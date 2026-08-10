/* ============================================================
   BECOME. — Homepage section renderers and behaviour
   Content comes from js/data.js. Motion comes from js/motion.js.
   Navigation and footer come from js/chrome.js.
   This file only joins them together.
   ============================================================ */

window.SECTIONS = (function () {
  "use strict";

  var M = window.MOTION;
  var D = window.BECOME;
  var qs = M.qs,
    qsa = M.qsa,
    esc = M.esc,
    clamp = M.clamp;

  /* ==========================================================
     01 — Hero
     ========================================================== */

  /* The transformation line. Characters displace, blur and
     hand over to the next word. Never a typewriter.          */
  function heroRotator() {
    var host = qs("#rotator");
    if (!host) return;

    var words = D.heroWords;
    var nodes = words.map(function (w) {
      var span = M.el("span", "hero__word");
      M.splitChars(span, w);
      host.appendChild(span);
      return span;
    });

    var i = 0;
    var timer = null;
    var live = true;

    function show(n) {
      nodes.forEach(function (node, idx) {
        node.classList.remove("is-in", "is-out");
        if (idx === n) node.classList.add("is-in");
      });
    }

    function step() {
      var current = nodes[i];
      current.classList.remove("is-in");
      current.classList.add("is-out");
      i = (i + 1) % nodes.length;
      window.setTimeout(function () {
        show(i);
      }, 340);
    }

    show(0);

    if (M.reduced) return;

    function start() {
      if (timer || !live) return;
      timer = window.setInterval(step, 2600);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    M.inViewToggle(host, start, stop);

    document.addEventListener("visibilitychange", function () {
      live = !document.hidden;
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  /* Generative ember field behind the hero. Cheap, additive,
     paused the moment it leaves the screen.                   */
  function heroCanvas() {
    var canvas = qs("#heroCanvas");
    if (!canvas || M.reduced) return;

    var ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0,
      h = 0;
    var particles = [];
    var mouse = { x: -9999, y: -9999, on: false };
    var running = false;
    var raf = null;
    var t = 0;

    function size() {
      var rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      /* Density follows area, capped so phones stay smooth. */
      var count = clamp(Math.round((w * h) / 13000), 40, M.coarse ? 70 : 170);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          r: 0.5 + Math.random() * 1.7,
          s: 0.25 + Math.random() * 0.75,
          a: 0.14 + Math.random() * 0.5,
          hot: Math.random() > 0.72
        });
      }
    }

    /* A cheap flow field — two sine layers, no noise library. */
    function angleAt(x, y, time) {
      return (
        Math.sin(x * 0.0016 + time * 0.00021) * 1.7 +
        Math.cos(y * 0.0021 - time * 0.00016) * 1.7
      );
    }

    function frame() {
      if (!running) return;
      t += 16;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var a = angleAt(p.x, p.y, t);

        p.vx += Math.cos(a) * 0.035 * p.s;
        p.vy += Math.sin(a) * 0.035 * p.s;

        /* Pointer pushes the field aside. */
        if (mouse.on) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 0.01) {
            var f = (1 - d2 / 26000) * 0.9;
            var d = Math.sqrt(d2);
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        /* Wrap rather than respawn, so density never dips. */
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        var flicker = 0.75 + Math.sin(t * 0.002 + i) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = p.hot
          ? "rgba(255,138,84," + p.a * flicker + ")"
          : "rgba(255,92,43," + p.a * 0.62 * flicker + ")";
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = null;
    }

    size();
    window.addEventListener(
      "resize",
      function () {
        window.clearTimeout(size.__t);
        size.__t = window.setTimeout(size, 180);
      },
      { passive: true }
    );

    if (!M.coarse) {
      window.addEventListener(
        "pointermove",
        function (e) {
          var r = canvas.getBoundingClientRect();
          mouse.x = e.clientX - r.left;
          mouse.y = e.clientY - r.top;
          mouse.on = e.clientY < r.bottom && e.clientY > r.top;
        },
        { passive: true }
      );
    }

    M.inViewToggle(canvas, start, stop);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else M.inViewToggle(canvas, start, stop);
    });
  }

  /* ==========================================================
     02 — Ticker
     ========================================================== */

  function ticker() {
    [qs("#tickerA"), qs("#tickerB")].forEach(function (set, idx) {
      if (!set) return;
      var words = idx ? D.ticker.slice().reverse() : D.ticker;
      words.forEach(function (word) {
        var item = M.el("span", "ticker__item");
        item.innerHTML =
          esc(word) + '<span class="ticker__dot" aria-hidden="true"></span>';
        set.appendChild(item);
      });
    });
  }

  /* ==========================================================
     04 — Convergence
     ========================================================== */

  function converge() {
    var section = qs("#converge");
    var field = qs("#convergeField");
    var mark = qs(".converge__mark");
    var sub = qs(".converge__sub");
    var halo = qs("#convergeHalo");
    var track = qs("#convergeTrack");
    var pct = qs("#convergePct");
    if (!section || !field) return;

    var words = D.convergeWords;

    /* Deterministic scatter: a spiral, not a random cloud, so it
       reads as an organised system collapsing to a point.      */
    var nodes = words.map(function (word, i) {
      var span = M.el("div", "converge__word");
      span.textContent = word;

      var golden = 2.39996;
      var angle = i * golden;
      var radius = 0.32 + (i / words.length) * 0.68;

      var tx = Math.cos(angle) * radius * 46;
      var ty = Math.sin(angle) * radius * 40;

      span.style.setProperty("--tx", tx.toFixed(2) + "vw");
      span.style.setProperty("--ty", ty.toFixed(2) + "vh");
      span.style.setProperty("--p", "0");
      field.appendChild(span);
      return span;
    });

    function set(p, c) {
      for (var i = 0; i < nodes.length; i++) {
        /* Words leave in sequence, not all at once. */
        var offset = (i / nodes.length) * 0.32;
        var local = clamp((p - offset) / (1 - 0.32), 0, 1);
        nodes[i].style.setProperty("--p", local.toFixed(3));
      }
      if (mark) mark.style.setProperty("--c", c.toFixed(3));
      if (sub) sub.style.setProperty("--c", c.toFixed(3));
      if (halo) halo.style.setProperty("--c", c.toFixed(3));
      if (track) track.style.setProperty("--p", p.toFixed(3));
      if (pct) pct.textContent = Math.round(p * 100) + "%";
    }

    if (M.reduced) {
      set(1, 1);
      return;
    }

    M.onScrollFrame(function (y, vh) {
      var r = section.getBoundingClientRect();
      var scrollable = section.offsetHeight - vh;
      if (scrollable <= 0) return;

      var raw = clamp(-r.top / scrollable, 0, 1);

      /* Words collapse first, the wordmark arrives after. */
      var p = clamp((raw - 0.04) / 0.62, 0, 1);
      var c = clamp((raw - 0.34) / 0.34, 0, 1);
      set(p, c);
    });

    set(0, 0);
  }

  /* ==========================================================
     05 — Solutions
     A numbered index; every row is a door to its own page.
     ========================================================== */

  function solutions() {
    var index = qs("#solutionsIndex");
    var pane = qs("#solutionsPane");
    var meter = qs("#solutionsMeter");
    if (!index) return;

    var items = D.solutions;
    var total = items.length;
    var active = 0;
    var rows = [];
    var slides = [];
    var pips = [];
    var auto = null;

    items.forEach(function (s, i) {
      var num = "0" + (i + 1);

      /* --- index row: a link, not an accordion --- */
      var row = M.el("a", "sol");
      row.href = s.href;
      row.setAttribute("data-cursor", "Open");
      row.innerHTML =
        '<span class="sol__head">' +
        '<span class="sol__num">' + num + "</span>" +
        '<span class="sol__text">' +
        '<span class="sol__name">' + esc(s.name) + "</span>" +
        '<span class="sol__line">' + esc(s.line) + "</span>" +
        "</span>" +
        '<span class="sol__mark" aria-hidden="true">' +
        '<svg width="12" height="12" viewBox="0 0 16 16" fill="none">' +
        '<path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.5" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg></span>" +
        "</span>" +
        '<span class="sol__thumb frame frame--ratio-wide frame--graded">' +
        '<img class="frame__media is-seen" src="' + esc(s.media) +
        '" alt="' + esc(s.alt) + '" loading="lazy" decoding="async">' +
        "</span>";

      index.appendChild(row);
      rows.push(row);

      row.addEventListener("pointerenter", function () {
        if (window.matchMedia("(min-width: 1040px)").matches) {
          stopAuto();
          open(i);
        }
      });
      row.addEventListener("focus", function () {
        stopAuto();
        open(i);
      });

      /* --- stage slide --- */
      if (pane) {
        var slide = M.el("div", "solutions__slide");
        slide.innerHTML =
          '<img src="' + esc(s.media) + '" alt="" decoding="async">' +
          '<div class="solutions__slide-label">' +
          '<span class="solutions__slide-idx">' + num + " / 0" + total + "</span>" +
          "<b>" + esc(s.name) + "</b><span>" + esc(s.line) + "</span></div>";
        pane.appendChild(slide);
        slides.push(slide);
      }

      if (meter) {
        var pip = M.el("i");
        meter.appendChild(pip);
        pips.push(pip);
      }
    });

    function open(n) {
      active = n;
      rows.forEach(function (r, i) {
        r.classList.toggle("is-active", i === n);
      });
      slides.forEach(function (s, i) {
        s.classList.toggle("is-active", i === n);
      });
      pips.forEach(function (p, i) {
        p.classList.toggle("is-on", i <= n);
      });
    }

    function startAuto() {
      if (auto || M.reduced) return;
      auto = window.setInterval(function () {
        open((active + 1) % items.length);
      }, 4200);
    }
    function stopAuto() {
      if (auto) {
        window.clearInterval(auto);
        auto = null;
      }
    }

    open(0);
    M.inViewToggle(index, startAuto, stopAuto);
  }

  /* ==========================================================
     06 — AI Solutions showcase
     Six capabilities, each carried by real footage. The console
     stays; the CSS diagrams are gone.
     ========================================================== */

  function aiShowcase() {
    var rail = qs("#aiRail");
    var stage = qs("#aiStage");
    if (!rail || !stage) return;

    var items = D.aiCaps;
    var tabs = [];
    var slides = [];
    var videos = [];
    var active = 0;
    var auto = null;
    var visible = false;

    items.forEach(function (c, i) {
      var tab = M.el("button", "showreel__tab");
      tab.type = "button";
      tab.id = "aitab-" + c.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", "aipanel-" + c.id);
      tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
      tab.tabIndex = i === 0 ? 0 : -1;
      tab.innerHTML =
        '<span class="showreel__idx">' + ("0" + (i + 1)) + "</span>" +
        '<span class="showreel__label"><b>' + esc(c.name) + "</b>" +
        "<span>" + esc(c.line) + "</span></span>" +
        '<span class="showreel__bar" aria-hidden="true"><i></i></span>';
      rail.appendChild(tab);
      tabs.push(tab);

      var slide = M.el("div", "showreel__slide");
      slide.id = "aipanel-" + c.id;
      slide.setAttribute("role", "tabpanel");
      slide.setAttribute("aria-labelledby", tab.id);
      slide.innerHTML =
        '<video class="showreel__video" playsinline muted loop preload="none" ' +
        'poster="' + esc(c.poster) + '" aria-hidden="true"></video>' +
        '<img class="showreel__still" src="' + esc(c.poster) + '" alt="" ' +
        'loading="lazy" decoding="async">' +
        '<span class="showreel__grade" aria-hidden="true"></span>' +
        '<span class="showreel__cap"><b>' + esc(c.name) + "</b>" +
        "<span>" + esc(c.line) + "</span></span>";
      stage.appendChild(slide);
      slides.push(slide);
      videos.push(qs("video", slide));

      tab.addEventListener("click", function () {
        stopAuto();
        select(i);
      });
      tab.addEventListener("pointerenter", function () {
        if (!M.coarse) {
          stopAuto();
          select(i);
        }
      });
      tab.addEventListener("focus", function () {
        stopAuto();
        select(i);
      });
    });

    function play(v, src) {
      if (!v || M.reduced) return;
      if (!v.getAttribute("src")) {
        v.setAttribute("src", src);
        v.load();
      }
      var p = v.play();
      if (p && p.catch) {
        /* Autoplay can be refused. The poster still carries it. */
        p.catch(function () {});
      }
    }

    function select(n) {
      active = n;
      tabs.forEach(function (t, i) {
        var on = i === n;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        t.classList.toggle("is-on", on);
      });
      slides.forEach(function (s, i) {
        s.classList.toggle("is-on", i === n);
      });
      videos.forEach(function (v, i) {
        if (!v) return;
        if (i === n) {
          if (visible) play(v, items[i].video);
        } else if (!v.paused) {
          v.pause();
        }
      });
    }

    function startAuto() {
      if (auto || M.reduced) return;
      auto = window.setInterval(function () {
        select((active + 1) % items.length);
      }, 6000);
    }
    function stopAuto() {
      if (auto) {
        window.clearInterval(auto);
        auto = null;
      }
    }

    rail.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      stopAuto();
      select(n);
      tabs[n].focus();
    });

    select(0);

    /* Nothing decodes until the section is actually on screen. */
    M.inViewToggle(
      stage,
      function () {
        visible = true;
        play(videos[active], items[active].video);
        startAuto();
      },
      function () {
        visible = false;
        stopAuto();
        videos.forEach(function (v) {
          if (v && !v.paused) v.pause();
        });
      }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAuto();
        videos.forEach(function (v) {
          if (v && !v.paused) v.pause();
        });
      } else if (visible) {
        play(videos[active], items[active].video);
        startAuto();
      }
    });
  }

  /* ==========================================================
     07 — Products
     ========================================================== */

  function products() {
    osDesktop();
    osPhone();
    productUses();
    orbit();
    M.initTilt(qs("#deviceScreen"), 4);
  }

  function osDesktop() {
    if (window.OSUI) window.OSUI.desktop();
  }

  function osPhone() {
    if (window.OSUI) window.OSUI.phone();
  }

  function productUses() {
    var host = qs("#productUses");
    if (!host) return;
    D.livingOsUses.forEach(function (u, i) {
      var item = M.el("div", "products__use");
      item.setAttribute("data-reveal", "fade");
      item.style.setProperty("--reveal-delay", i * 90 + "ms");
      item.innerHTML = "<b>" + esc(u.k) + "</b><span>" + esc(u.v) + "</span>";
      host.appendChild(item);
    });
  }

  /* Seven capabilities revolving around one core. The ring spins;
     each label counter-spins so it never turns upside down.     */
  function orbit() {
    var host = qs("#orbitNodes");
    if (!host) return;

    var items = D.livingOsOrbit;
    var step = 360 / items.length;

    items.forEach(function (name, i) {
      var node = M.el("span", "eco");
      node.style.setProperty("--a", (step * i).toFixed(3) + "deg");
      node.innerHTML =
        '<span class="eco__anchor"><b class="eco__pill">' +
        esc(name) +
        "</b></span>";
      host.appendChild(node);
    });

    var list = qs("#orbitList");
    if (list) {
      list.innerHTML = items
        .map(function (n) {
          return "<li>" + esc(n) + "</li>";
        })
        .join("");
    }

    M.initSurfaceLight(".eco__pill", host);
  }

  /* ==========================================================
     09 — Who we transform
     ========================================================== */

  function industries() {
    var host = qs("#mosaic");
    if (!host) return;

    D.industries.forEach(function (ind, i) {
      var a = M.el("article", "ind ind--" + ind.cls);
      a.setAttribute("tabindex", "0");
      a.setAttribute("data-reveal", "scale");
      a.style.setProperty("--reveal-delay", (i % 3) * 110 + "ms");
      a.innerHTML =
        '<div class="ind__media" data-parallax="' +
        (0.04 + (i % 3) * 0.03).toFixed(2) +
        '">' +
        '<img src="' +
        esc(ind.media) +
        '" alt="' +
        esc(ind.alt) +
        '" loading="lazy" decoding="async">' +
        "</div>" +
        '<div class="ind__veil" aria-hidden="true"></div>' +
        '<div class="ind__body">' +
        '<span class="ind__num">' +
        ("0" + (i + 1)) +
        "</span>" +
        '<h3 class="ind__name">' +
        esc(ind.name) +
        "</h3>" +
        '<p class="ind__note">' +
        esc(ind.note) +
        "</p>" +
        "</div>";
      host.appendChild(a);
    });
  }

  /* ==========================================================
     11 — How it goes
     ========================================================== */

  function why() {
    var host = qs("#whyStack");
    if (!host) return;

    D.why.forEach(function (c) {
      var art = M.el("article", "chapter");
      art.innerHTML =
        '<div class="chapter__media" aria-hidden="true">' +
        '<img src="' +
        esc(c.media) +
        '" alt="" loading="lazy" decoding="async">' +
        "</div>" +
        '<div class="chapter__body">' +
        '<span class="chapter__num">' +
        esc(c.num) +
        "</span>" +
        '<h3 class="chapter__word">' +
        esc(c.word) +
        "<i>.</i></h3>" +
        '<p class="chapter__copy">' +
        esc(c.copy) +
        "</p>" +
        "</div>";
      art.setAttribute("data-reveal", "scale");
      host.appendChild(art);
    });
  }

  /* ==========================================================
     13 — Contact
     ========================================================== */

  function contact() {
    var details = qs("#contactDetails");
    var c = D.contact;

    function row(label, value, href) {
      var wrap = M.el("div", "contact__detail");
      var dt = M.el("dt");
      dt.textContent = label;
      var dd = M.el("dd");
      if (href) {
        var a = M.el("a");
        a.href = href;
        a.textContent = value;
        dd.appendChild(a);
      } else {
        dd.textContent = value;
      }
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      return wrap;
    }

    if (details) {
      details.appendChild(row("Email", c.email.value, "mailto:" + c.email.value));
      details.appendChild(
        row("Phone", c.phone.value, "tel:" + c.phone.value.replace(/\s/g, ""))
      );
    }

    /* The dropdown mirrors the five solutions, plus a way out. */
    var select = qs("#f-interest");
    if (select) {
      select.innerHTML = D.contactOptions
        .map(function (o) {
          return '<option value="' + esc(o) + '">' + esc(o) + "</option>";
        })
        .join("");
    }

    form();
  }

  function form() {
    var f = qs("#contactForm");
    if (!f) return;
    var status = qs("#formStatus");

    function fieldOf(input) {
      return input.closest(".field");
    }

    function setError(input, msg) {
      var field = fieldOf(input);
      if (!field) return;
      var slot = qs("[data-error]", field);
      field.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (slot) {
        slot.textContent = msg || "";
        if (!slot.id) slot.id = input.id + "-error";
        if (msg) input.setAttribute("aria-describedby", slot.id);
        else input.removeAttribute("aria-describedby");
      }
    }

    function validate() {
      var ok = true;
      var name = qs("#f-name"),
        email = qs("#f-email"),
        message = qs("#f-message");

      if (!name.value.trim()) {
        setError(name, "Tell us who you are.");
        ok = false;
      } else setError(name, "");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, "We need a working email to reply to.");
        ok = false;
      } else setError(email, "");

      if (message.value.trim().length < 12) {
        setError(message, "A sentence or two is enough.");
        ok = false;
      } else setError(message, "");

      return ok;
    }

    qsa("input, textarea", f).forEach(function (input) {
      input.addEventListener("blur", function () {
        if (fieldOf(input) && fieldOf(input).classList.contains("has-error")) validate();
      });
    });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var bad = qs(".field.has-error input, .field.has-error textarea", f);
        if (bad) bad.focus();
        return;
      }

      var to = D.contact.email.value;
      var payload = {
        name: qs("#f-name").value,
        email: qs("#f-email").value,
        company: qs("#f-company").value || "",
        interest: qs("#f-interest").value,
        message: qs("#f-message").value
      };

      var submitBtn = qs("button[type=submit]", f);
      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.textContent = "Sending…";
        status.classList.add("is-on");
      }

      fetch("https://script.google.com/macros/s/AKfycbywHnZ0hz7-lbGBEPc2u1glh-pJg_xjjZ8po5gyvmTcVKF3v0QcbvNG3VSIBO8EmRhwVg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      })
        .then(function () {
          if (status) status.textContent = "Thanks — we'll reply within a day.";
          f.reset();
        })
        .catch(function () {
          if (status)
            status.textContent =
              "Something went wrong. Please write to us directly at " + to + ".";
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ========================================================== */

  /* One broken section must never take the rest of the page with
     it, so each renderer is isolated and failures are recorded. */
  function renderAll() {
    var failed = [];

    [
      ["hero-rotator", heroRotator],
      ["hero-canvas", heroCanvas],
      ["ticker", ticker],
      ["converge", converge],
      ["solutions", solutions],
      ["ai", aiShowcase],
      ["products", products],
      ["industries", industries],
      ["why", why],
      ["contact", contact]
    ].forEach(function (pair) {
      try {
        pair[1]();
      } catch (err) {
        failed.push(pair[0]);
        if (window.console && window.console.error) {
          window.console.error("[become] section " + pair[0] + " failed:", err);
        }
      }
    });

    if (failed.length) {
      document.documentElement.setAttribute("data-section-error", failed.join(","));
    }
  }

  return { renderAll: renderAll };
})();
