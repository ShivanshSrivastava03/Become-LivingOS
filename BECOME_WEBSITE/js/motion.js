/* ============================================================
   BECOME. — Motion engine
   One scroll loop, one observer, one pointer loop. Everything
   else subscribes. Nothing animates that cannot be turned off.
   ============================================================ */

window.MOTION = (function () {
  "use strict";

  /* ---------- tiny helpers ---------------------------------- */

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* Escapes anything that came from the content model. */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var coarse =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  /* ---------- scroll driver --------------------------------- */
  /* A single rAF-throttled scroll broadcast. */

  var subs = [];
  var ticking = false;

  function broadcast() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var vh = window.innerHeight;
    for (var i = 0; i < subs.length; i++) {
      try {
        subs[i](y, vh);
      } catch (e) {
        /* one bad subscriber must never stop the rest */
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(broadcast);
    }
  }

  function onScrollFrame(fn) {
    subs.push(fn);
    return fn;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------- smooth scroll --------------------------------- */
  /* Wheel is intercepted and eased. Native scroll (scrollbar,
     keyboard, touch) is left alone and simply re-syncs us.     */

  var smooth = {
    on: false,
    target: 0,
    current: 0,
    running: false,
    ease: 0.098,
    self: false
  };

  function smoothStep() {
    smooth.current = lerp(smooth.current, smooth.target, smooth.ease);

    if (Math.abs(smooth.target - smooth.current) < 0.35) {
      smooth.current = smooth.target;
      smooth.running = false;
    }

    smooth.self = true;
    window.scrollTo(0, smooth.current);
    smooth.self = false;

    if (smooth.running) window.requestAnimationFrame(smoothStep);
  }

  function maxScroll() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function onWheel(e) {
    if (!smooth.on) return;
    if (e.ctrlKey) return; /* pinch zoom */
    if (document.body.classList.contains("menu-open")) return;
    /* Sideways gestures belong to horizontal rails, not the page. */
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    /* Let genuinely scrollable panels keep their own wheel. */
    var t = e.target;
    while (t && t !== document.body) {
      if (t.nodeType === 1 && t.hasAttribute("data-native-scroll")) return;
      t = t.parentNode;
    }

    e.preventDefault();

    if (!smooth.running) smooth.current = window.pageYOffset;

    smooth.target = clamp(smooth.target + e.deltaY, 0, maxScroll());

    if (!smooth.running) {
      smooth.running = true;
      window.requestAnimationFrame(smoothStep);
    }
  }

  function syncSmooth() {
    if (smooth.self || !smooth.on) return;
    if (!smooth.running) {
      smooth.target = smooth.current = window.pageYOffset;
    }
  }

  function initSmooth() {
    if (reduced || coarse) return;
    if (!window.matchMedia("(min-width: 900px)").matches) return;

    smooth.on = true;
    smooth.target = smooth.current = window.pageYOffset;
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", syncSmooth, { passive: true });
  }

  /* Scroll to a target with the same easing. */
  function scrollToY(y) {
    y = clamp(y, 0, maxScroll());

    if (!smooth.on) {
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      return;
    }

    smooth.current = window.pageYOffset;
    smooth.target = y;

    if (!smooth.running) {
      smooth.running = true;
      window.requestAnimationFrame(smoothStep);
    }
  }

  function scrollToEl(node, offset) {
    if (!node) return;
    var top =
      node.getBoundingClientRect().top +
      (window.pageYOffset || 0) -
      (offset || 0);
    scrollToY(top);
  }

  /* ---------- reveal ---------------------------------------- */

  var revealObserver = null;

  function initReveal(root) {
    var nodes = qsa("[data-reveal], [data-reveal-group]", root || document);
    if (!nodes.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-seen");
      });
      return;
    }

    /* The observer deliberately ignores the bottom tenth of the screen,
       which is fine for content you scroll to and wrong for content that
       is already on the first screen. Anything above the fold at start-up
       is revealed outright, so a hero button can never stay invisible. */
    nodes = nodes.filter(function (n) {
      if (n.classList.contains("is-seen")) return false;
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && r.top < window.innerHeight) {
        if (r.top + (window.pageYOffset || 0) < window.innerHeight) {
          n.classList.add("is-seen");
          return false;
        }
      }
      return true;
    });
    if (!nodes.length) return;

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var n = entry.target;
            n.classList.add("is-seen");

            /* Stagger direct children of a group. */
            if (n.hasAttribute("data-reveal-group")) {
              var step = parseInt(n.getAttribute("data-reveal-group"), 10) || 80;
              qsa(":scope > *", n).forEach(function (child, i) {
                child.style.setProperty("--reveal-delay", i * step + "ms");
                child.classList.add("is-seen");
              });
            }
            revealObserver.unobserve(n);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
      );
    }

    nodes.forEach(function (n) {
      if (!n.classList.contains("is-seen")) revealObserver.observe(n);
    });
  }

  /* Anything that just needs a one-shot "it is on screen" flag. */
  function onceInView(node, fn, margin) {
    if (!node) return;
    if (reduced || !("IntersectionObserver" in window)) {
      fn(node);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          fn(e.target);
          io.unobserve(e.target);
        });
      },
      { rootMargin: margin || "0px 0px -8% 0px", threshold: 0.01 }
    );
    io.observe(node);
  }

  /* Fires whenever a node enters or leaves — used to pause work. */
  function inViewToggle(node, onIn, onOut) {
    if (!node || !("IntersectionObserver" in window)) {
      if (onIn) onIn();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            if (onIn) onIn();
          } else if (onOut) onOut();
        });
      },
      { rootMargin: "120px", threshold: 0 }
    );
    io.observe(node);
  }

  /* ---------- text splitting -------------------------------- */

  function splitChars(node, text) {
    node.textContent = "";
    var chars = String(text).split("");
    var frag = document.createDocumentFragment();
    chars.forEach(function (ch, i) {
      var s = el("span", "split-char");
      s.style.setProperty("--c", i);
      s.textContent = ch === " " ? " " : ch;
      frag.appendChild(s);
    });
    node.appendChild(frag);
    return qsa(".split-char", node);
  }

  function splitWords(node) {
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    var texts = [];
    var t;
    while ((t = walker.nextNode())) {
      if (t.nodeValue.trim()) texts.push(t);
    }

    texts.forEach(function (textNode) {
      var frag = document.createDocumentFragment();
      var parts = textNode.nodeValue.split(/(\s+)/);
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) {
          frag.appendChild(document.createTextNode(p));
        } else {
          var s = el("span", "split-word");
          s.textContent = p;
          frag.appendChild(s);
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });

    return qsa(".split-word", node);
  }

  /* Groups words into visual lines, then wraps each line in a
     clipping mask so headlines can rise into view. */
  function splitLines(node) {
    if (node.__lined) return qsa(".line-mask", node);
    var words = splitWords(node);
    if (!words.length) return [];

    var lines = [];
    var currentTop = null;
    var bucket = null;

    words.forEach(function (w) {
      var top = Math.round(w.offsetTop);
      if (currentTop === null || Math.abs(top - currentTop) > 4) {
        currentTop = top;
        bucket = [];
        lines.push(bucket);
      }
      bucket.push(w);
    });

    var frag = document.createDocumentFragment();
    lines.forEach(function (lineWords, i) {
      var mask = el("span", "line-mask");
      var inner = el("span");
      mask.style.setProperty("--line-delay", i * 95 + "ms");
      lineWords.forEach(function (w, wi) {
        inner.appendChild(w);
        if (wi < lineWords.length - 1)
          inner.appendChild(document.createTextNode(" "));
      });
      mask.appendChild(inner);
      frag.appendChild(mask);
    });

    node.textContent = "";
    node.appendChild(frag);
    node.__lined = true;
    return qsa(".line-mask", node);
  }

  function initMasks(root) {
    if (reduced) return;
    qsa("[data-mask]", root || document).forEach(function (node) {
      splitLines(node);
      onceInView(node, function (n) {
        n.classList.add("is-seen");
      });
    });
  }

  /* ---------- scroll-lit text ------------------------------- */

  function initLitText(root) {
    qsa("[data-lit]", root || document).forEach(function (node) {
      var words = splitWords(node);
      if (!words.length) return;

      /* A few nouns carry the accent when they light up. */
      var accents = /^(clarity|speed|automation|growth|problems\.?)$/i;
      words.forEach(function (w) {
        if (accents.test(w.textContent.replace(/[.,]/g, "")))
          w.classList.add("is-accent");
      });

      if (reduced) {
        words.forEach(function (w) {
          w.classList.add("is-lit");
        });
        return;
      }

      onScrollFrame(function (y, vh) {
        var r = node.getBoundingClientRect();
        /* Progress runs while the block crosses the middle band. */
        var start = vh * 0.86;
        var end = vh * 0.24;
        var p = clamp((start - r.top) / (start - end), 0, 1);
        var lit = Math.round(p * words.length);
        for (var i = 0; i < words.length; i++) {
          var on = i < lit;
          if (on !== !!words[i].__lit) {
            words[i].classList.toggle("is-lit", on);
            words[i].__lit = on;
          }
        }
      });
    });
  }

  /* ---------- parallax -------------------------------------- */

  function initParallax(root) {
    if (reduced) return;
    var nodes = qsa("[data-parallax]", root || document);
    if (!nodes.length) return;

    nodes.forEach(function (n) {
      n.__amt = parseFloat(n.getAttribute("data-parallax")) || 0.1;
    });

    onScrollFrame(function (y, vh) {
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var mid = r.top + r.height / 2 - vh / 2;
        n.style.transform = "translate3d(0," + -mid * n.__amt + "px,0)";
      });
    });
  }

  /* ---------- marquee --------------------------------------- */
  /* Constant drift, nudged by scroll velocity. */

  function initMarquee(root) {
    var rows = qsa("[data-marquee]", root || document);
    if (!rows.length) return;

    var lastY = window.pageYOffset;
    var velocity = 0;

    onScrollFrame(function (y) {
      velocity = clamp((y - lastY) * 0.35, -34, 34);
      lastY = y;
    });

    rows.forEach(function (row) {
      var set = row.firstElementChild;
      if (!set) return;

      /* Duplicate the set until it comfortably covers two screens. */
      var guard = 0;
      while (row.scrollWidth < window.innerWidth * 2.2 && guard < 12) {
        var clone = set.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        row.appendChild(clone);
        guard++;
      }

      row.__x = 0;
      row.__speed = parseFloat(row.getAttribute("data-marquee")) || -0.4;
      row.__w = set.scrollWidth || 1;
      row.__live = true;
    });

    if (reduced) return;

    function frame() {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!row.__live) continue;
        row.__x += row.__speed + velocity * (row.__speed < 0 ? 1 : -1) * 0.5;
        if (row.__x <= -row.__w) row.__x += row.__w;
        if (row.__x > 0) row.__x -= row.__w;
        row.style.transform = "translate3d(" + row.__x + "px,0,0)";
      }
      velocity *= 0.9;
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);

    window.addEventListener(
      "resize",
      function () {
        rows.forEach(function (row) {
          var set = row.firstElementChild;
          if (set) row.__w = set.scrollWidth || row.__w;
        });
      },
      { passive: true }
    );
  }

  /* ---------- pointer: magnetic buttons + card light -------- */

  function initMagnetic(root) {
    if (reduced || coarse) return;

    qsa("[data-magnetic]", root || document).forEach(function (node) {
      if (node.__magnetic) return;
      node.__magnetic = true;

      var raf = null;
      var tx = 0,
        ty = 0,
        cx = 0,
        cy = 0;

      function run() {
        cx = lerp(cx, tx, 0.18);
        cy = lerp(cy, ty, 0.18);
        node.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
        if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
          raf = window.requestAnimationFrame(run);
        } else {
          node.style.transform = tx === 0 && ty === 0 ? "" : node.style.transform;
          raf = null;
        }
      }

      node.addEventListener("pointermove", function (e) {
        var r = node.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        ty = (e.clientY - (r.top + r.height / 2)) * 0.34;
        if (!raf) raf = window.requestAnimationFrame(run);
      });

      node.addEventListener("pointerleave", function () {
        tx = 0;
        ty = 0;
        if (!raf) raf = window.requestAnimationFrame(run);
      });
    });
  }

  /* Warm light that follows the pointer across a surface. */
  function initSurfaceLight(selector, root) {
    if (coarse) return;
    qsa(selector, root || document).forEach(function (node) {
      if (node.__lit) return;
      node.__lit = true;
      node.addEventListener("pointermove", function (e) {
        var r = node.getBoundingClientRect();
        node.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        node.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---------- cursor ---------------------------------------- */

  function initCursor() {
    var node = qs("#cursor");
    if (!node || coarse || reduced) return;

    var label = qs("#cursorLabel");
    var ring = qs(".cursor__ring", node);
    var dot = qs(".cursor__dot", node);

    var mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    var rx = mx,
      ry = my;
    var dx = mx,
      dy = my;

    window.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType !== "mouse") return;
        mx = e.clientX;
        my = e.clientY;
        node.classList.add("is-active");

        var hit = e.target && e.target.closest ? e.target.closest("[data-cursor]") : null;
        if (hit) {
          node.classList.add("is-grown");
          node.classList.remove("is-link");
          if (label) label.textContent = hit.getAttribute("data-cursor") || "View";
        } else {
          node.classList.remove("is-grown");
          var link =
            e.target && e.target.closest
              ? e.target.closest("a, button, input, select, textarea, [role='tab']")
              : null;
          node.classList.toggle("is-link", !!link);
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", function () {
      node.classList.remove("is-active");
    });

    function frame() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      dx = lerp(dx, mx, 0.45);
      dy = lerp(dy, my, 0.45);
      if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      if (dot) dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  /* ---------- 3D tilt --------------------------------------- */

  function initTilt(node, max) {
    if (!node || coarse || reduced) return;
    var m = max || 5;
    var host = node.parentNode;

    host.addEventListener("pointermove", function (e) {
      var r = host.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      node.style.setProperty("--tilt-y", px * m + "deg");
      node.style.setProperty("--tilt-x", -py * m + "deg");
    });

    host.addEventListener("pointerleave", function () {
      node.style.setProperty("--tilt-y", "0deg");
      node.style.setProperty("--tilt-x", "0deg");
    });
  }

  /* ---------- counters -------------------------------------- */

  return {
    qs: qs,
    qsa: qsa,
    el: el,
    esc: esc,
    clamp: clamp,
    lerp: lerp,
    reduced: reduced,
    coarse: coarse,
    onScrollFrame: onScrollFrame,
    kick: onScroll,
    initSmooth: initSmooth,
    scrollToY: scrollToY,
    scrollToEl: scrollToEl,
    initReveal: initReveal,
    onceInView: onceInView,
    inViewToggle: inViewToggle,
    splitChars: splitChars,
    splitWords: splitWords,
    splitLines: splitLines,
    initMasks: initMasks,
    initLitText: initLitText,
    initParallax: initParallax,
    initMarquee: initMarquee,
    initMagnetic: initMagnetic,
    initSurfaceLight: initSurfaceLight,
    initCursor: initCursor,
    initTilt: initTilt
  };
})();
