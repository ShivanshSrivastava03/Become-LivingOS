/* ============================================================
   BECOME. — Section renderers and behaviour
   Content comes from js/data.js. Motion comes from js/motion.js.
   This file only joins the two together.
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
     Navigation + menu
     ========================================================== */

  function nav() {
    var links = qs("#navLinks");
    var pill = qs("#navPill");
    var menuBody = qs("#menuBody");

    D.nav.forEach(function (item, i) {
      if (links) {
        var a = M.el("a", "nav__link");
        a.href = item.href;
        a.textContent = item.label;
        links.appendChild(a);
      }

      if (menuBody) {
        var wrap = M.el("div", "menu__item");
        var link = M.el("a", "menu__link");
        link.href = item.href;
        link.style.setProperty("--i", 120 + i * 65 + "ms");
        link.setAttribute("data-menu-close", "");
        link.innerHTML =
          "<em>0" + (i + 1) + "</em><span>" + esc(item.label) + "</span>";
        wrap.appendChild(link);
        menuBody.appendChild(wrap);
      }
    });

    /* Sliding pill follows the hovered link. */
    if (links && pill) {
      qsa(".nav__link", links).forEach(function (a) {
        a.addEventListener("pointerenter", function () {
          pill.style.width = a.offsetWidth + "px";
          pill.style.transform = "translateX(" + a.offsetLeft + "px)";
        });
      });
    }

    /* Scroll-spy: mark the section you are actually inside. */
    var targets = D.nav
      .map(function (n) {
        return { href: n.href, node: qs(n.href) };
      })
      .filter(function (t) {
        return t.node;
      });

    var navLinks = qsa(".nav__link");

    M.onScrollFrame(function (y, vh) {
      var active = null;
      targets.forEach(function (t) {
        var r = t.node.getBoundingClientRect();
        if (r.top <= vh * 0.4 && r.bottom >= vh * 0.4) active = t.href;
      });
      navLinks.forEach(function (a) {
        a.classList.toggle(
          "is-current",
          active != null && a.getAttribute("href") === active
        );
      });
    });
  }

  /* ==========================================================
     01 — Hero
     ========================================================== */

  function heroFacts() {
    var list = qs("#heroFacts");
    if (!list) return;
    D.heroFacts.forEach(function (f) {
      var li = M.el("li");
      li.innerHTML = esc(f.k) + " <b>" + esc(f.v) + "</b>";
      list.appendChild(li);
    });
  }

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
     ========================================================== */

  function solutions() {
    var index = qs("#solutionsIndex");
    var pane = qs("#solutionsPane");
    var meter = qs("#solutionsMeter");
    if (!index) return;

    var items = D.solutions;
    var active = 0;
    var panels = [];
    var slides = [];
    var pips = [];
    var auto = null;

    items.forEach(function (s, i) {
      /* --- index row --- */
      var row = M.el("div", "sol");
      var id = "sol-panel-" + s.id;

      var head = M.el("button", "sol__head");
      head.type = "button";
      head.setAttribute("aria-expanded", i === 0 ? "true" : "false");
      head.setAttribute("aria-controls", id);
      head.innerHTML =
        '<span class="sol__num">' +
        ("0" + (i + 1)) +
        "</span>" +
        '<span class="sol__name">' +
        esc(s.name) +
        "</span>" +
        '<span class="sol__mark" aria-hidden="true">' +
        '<svg width="11" height="11" viewBox="0 0 12 12" fill="none">' +
        '<path d="M3 6h6M6 3v6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
        "</svg></span>";

      var panel = M.el("div", "sol__panel");
      panel.id = id;
      panel.setAttribute("role", "region");

      var tags = s.tags
        .map(function (t) {
          return '<span class="sol__tag">' + esc(t) + "</span>";
        })
        .join("");

      panel.innerHTML =
        '<div class="sol__panel-inner">' +
        '<p class="sol__copy"><b style="color:var(--fg)">' +
        esc(s.line) +
        "</b> " +
        esc(s.copy) +
        "</p>" +
        '<div class="sol__tags">' +
        tags +
        "</div>" +
        '<div class="frame frame--ratio-wide frame--graded sol__mobile-media">' +
        '<img class="frame__media is-seen" src="' +
        esc(s.media) +
        '" alt="' +
        esc(s.alt) +
        '" loading="lazy" decoding="async">' +
        "</div>" +
        "</div>";

      row.appendChild(head);
      row.appendChild(panel);
      index.appendChild(row);
      panels.push({ row: row, head: head, panel: panel });

      head.addEventListener("click", function () {
        stopAuto();
        open(i);
      });
      head.addEventListener("pointerenter", function () {
        if (window.matchMedia("(min-width: 1040px)").matches) {
          stopAuto();
          open(i);
        }
      });
      head.addEventListener("focus", function () {
        stopAuto();
        open(i);
      });

      /* --- stage slide --- */
      if (pane) {
        var slide = M.el("div", "solutions__slide");
        slide.innerHTML =
          '<img src="' +
          esc(s.media) +
          '" alt="" decoding="async">' +
          '<div class="solutions__slide-label">' +
          '<span class="solutions__slide-idx">' +
          ("0" + (i + 1)) +
          " / 07</span>" +
          "<b>" +
          esc(s.name) +
          "</b><span>" +
          esc(s.line) +
          "</span></div>";
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
      panels.forEach(function (p, i) {
        var on = i === n;
        p.row.classList.toggle("is-active", on);
        p.head.setAttribute("aria-expanded", on ? "true" : "false");
        p.panel.style.height = on ? p.panel.scrollHeight + "px" : "0px";
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

    /* Panel heights are content-dependent — remeasure on resize. */
    window.addEventListener(
      "resize",
      function () {
        window.clearTimeout(open.__t);
        open.__t = window.setTimeout(function () {
          open(active);
        }, 160);
      },
      { passive: true }
    );
  }

  /* ==========================================================
     06 — Artificial intelligence
     ========================================================== */

  function ai() {
    var navEl = qs("#consoleNav");
    var view = qs("#consoleView");
    var grid = qs("#capGrid");
    var outcomes = qs("#aiOutcomes");

    /* --- console --- */
    if (navEl && view) {
      var panels = window.DEMOS.panels;
      var built = {};

      panels.forEach(function (p, i) {
        var tab = M.el("button", "console__tab");
        tab.type = "button";
        tab.id = "tab-" + p.id;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
        tab.setAttribute("aria-controls", "panel-" + p.id);
        tab.tabIndex = i === 0 ? 0 : -1;
        tab.innerHTML = '<i aria-hidden="true"></i><span>' + esc(p.tab) + "</span>";
        navEl.appendChild(tab);

        var panel = M.el("div", "console__panel");
        panel.id = "panel-" + p.id;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        panel.innerHTML =
          '<div class="console__panel-head"><h3>' +
          esc(p.title) +
          "</h3><p>" +
          esc(p.note) +
          "</p></div>";
        view.appendChild(panel);

        tab.addEventListener("click", function () {
          select(i);
        });
      });

      var tabs = qsa(".console__tab", navEl);
      var views = qsa(".console__panel", view);

      function select(n) {
        tabs.forEach(function (t, i) {
          t.setAttribute("aria-selected", i === n ? "true" : "false");
          t.tabIndex = i === n ? 0 : -1;
        });
        views.forEach(function (v, i) {
          v.classList.toggle("is-on", i === n);
        });

        /* Panels build on first view, then replay on return so
           the animation is always seen from the start. */
        var p = panels[n];
        var host = views[n];
        var head = host.firstElementChild;
        host.innerHTML = "";
        host.appendChild(head);
        var wrap = M.el("div");
        wrap.innerHTML = p.build();
        while (wrap.firstChild) host.appendChild(wrap.firstChild);
        built[p.id] = true;
      }

      navEl.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp")
          n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault();
        select(n);
        tabs[n].focus();
      });

      /* Build the first panel only once it is actually near. */
      M.onceInView(view, function () {
        select(0);
      });
    }

    /* --- capability cards --- */
    if (grid) {
      D.aiCaps.forEach(function (c, i) {
        var card = M.el("article", "cap");
        card.innerHTML =
          '<div class="cap__top">' +
          '<span class="cap__idx">' +
          ("0" + (i + 1)) +
          "</span>" +
          '<span class="cap__pill">' +
          esc(c.pill) +
          "</span>" +
          "</div>" +
          '<div class="cap__viz" aria-hidden="true">' +
          window.DEMOS.mini(c.viz) +
          "</div>" +
          '<div class="cap__foot"><h3>' +
          esc(c.name) +
          "</h3><p>" +
          esc(c.copy) +
          "</p></div>";
        card.setAttribute("data-reveal", "fade");
        card.style.setProperty("--reveal-delay", (i % 3) * 90 + "ms");
        grid.appendChild(card);
      });
      M.initSurfaceLight(".cap", grid);
    }

    /* --- outcomes --- */
    if (outcomes) {
      D.aiOutcomes.forEach(function (o, i) {
        var item = M.el("div", "ai__outcome");
        item.setAttribute("data-reveal", "fade");
        item.style.setProperty("--reveal-delay", i * 70 + "ms");
        item.innerHTML = "<b>" + esc(o.k) + "</b><span>" + esc(o.v) + "</span>";
        outcomes.appendChild(item);
      });
    }
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
    var host = qs("#osUi");
    if (!host) return;

    var navItems = [
      { k: "Overview", on: true },
      { k: "Rooms", b: "128" },
      { k: "Residents", b: "302" },
      { k: "Billing", b: "9" },
      { k: "Housekeeping" },
      { k: "Maintenance", b: "4" },
      { k: "Reports" }
    ];

    var kpis = [
      { k: "Occupancy", v: "94%", d: "+6%" },
      { k: "Collected", v: "88%", d: "+11%" },
      { k: "Open tickets", v: "4", d: "-3", down: true },
      { k: "Check-ins", v: "17", d: "today" }
    ];

    var bars = [46, 58, 52, 67, 61, 74, 70, 82, 78, 88, 84, 94];
    var months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

    var rooms = "";
    var states = [
      "is-full","is-full","is-part","is-full","is-clean","is-full","is-full","",
      "is-full","is-part","is-full","is-full","is-full","","is-clean","is-full",
      "is-part","is-full","is-full","is-clean","is-full","is-full","","is-full",
      "is-full","is-clean","is-full","is-full","is-part","is-full","is-full","is-full",
      "","is-full","is-full","is-part","is-full","is-clean","is-full","is-full",
      "is-full","is-full","is-clean","is-full","is-full","is-part","is-full",""
    ];
    states.forEach(function (s) {
      rooms += '<span class="os__room ' + s + '"></span>';
    });

    var feed = [
      { t: "Rhea K. checked into 214", w: "now", isNew: true },
      { t: "Rent received · Unit 108", w: "12m" },
      { t: "Maintenance closed · 3F hall", w: "41m" },
      { t: "Deep clean scheduled · 219", w: "1h" }
    ];

    host.innerHTML =
      '<div class="os__top">' +
      '<span class="os__brand"><i></i><span>Become.</span></span>' +
      '<span class="os__search">Search rooms, residents, invoices…</span>' +
      '<span class="os__avatars"><i></i><i></i><i></i></span>' +
      "</div>" +
      '<div class="os__main">' +
      '<div class="os__side">' +
      '<span class="os__side-label">Property</span>' +
      navItems
        .map(function (n) {
          return (
            '<span class="os__nav' +
            (n.on ? " is-on" : "") +
            '"><i></i>' +
            esc(n.k) +
            (n.b ? "<b>" + esc(n.b) + "</b>" : "") +
            "</span>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="os__content">' +
      '<div class="os__crumb"><h4>Riverside House</h4><span>Live · updated 4s ago</span></div>' +
      '<div class="os__kpis">' +
      kpis
        .map(function (k) {
          return (
            '<div class="os__kpi"><small>' +
            esc(k.k) +
            "</small><b>" +
            esc(k.v) +
            '</b><u class="' +
            (k.down ? "is-down" : "") +
            '">' +
            esc(k.d) +
            "</u></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="os__panels">' +
      '<div class="os__card">' +
      '<div class="os__card-top"><b>Occupancy</b><span>12 months</span></div>' +
      '<div class="os__chart">' +
      bars
        .map(function (v, i) {
          return (
            '<span class="os__bar' +
            (i < 8 ? " is-muted" : "") +
            '" style="--v:' +
            v +
            ";--i:" +
            i +
            '"></span>'
          );
        })
        .join("") +
      "</div>" +
      '<div class="os__legend">' +
      months
        .map(function (m) {
          return "<span>" + m + "</span>";
        })
        .join("") +
      "</div>" +
      '<div class="os__card-top" style="margin-top:.2em"><b>Rooms</b><span>128 units</span></div>' +
      '<div class="os__rooms">' +
      rooms +
      "</div>" +
      "</div>" +
      '<div class="os__card">' +
      '<div class="os__card-top"><b>Activity</b><span>Live</span></div>' +
      '<div class="os__feed">' +
      feed
        .map(function (f) {
          return (
            '<div class="os__row' +
            (f.isNew ? " is-new" : "") +
            '"><i></i><span>' +
            esc(f.t) +
            "</span><b>" +
            esc(f.w) +
            "</b></div>"
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    /* Bars grow only once the device is on screen. */
    M.onceInView(qs("#device") || host, function () {
      host.classList.add("is-seen");
    });

    /* A quiet heartbeat so the interface feels alive. */
    if (!M.reduced) {
      var feedRows = qsa(".os__row", host);
      var idx = 0;
      var beat = null;

      M.inViewToggle(
        host,
        function () {
          if (beat) return;
          beat = window.setInterval(function () {
            feedRows.forEach(function (r) {
              r.classList.remove("is-new");
            });
            idx = (idx + 1) % feedRows.length;
            feedRows[idx].classList.add("is-new");
          }, 2600);
        },
        function () {
          if (beat) {
            window.clearInterval(beat);
            beat = null;
          }
        }
      );
    }
  }

  function osPhone() {
    var host = qs("#osMobile");
    if (!host) return;

    var items = [
      "Room 214 · ready",
      "Invoice #4471 paid",
      "Laundry request",
      "Wi-Fi reset · 3F"
    ];

    host.innerHTML =
      '<div class="os-m__title"><b>Today</b><span>Riverside</span></div>' +
      '<div class="os-m__hero"><small>Occupancy</small><b>94%</b>' +
      '<div class="os-m__bar"><i></i></div></div>' +
      '<div class="os-m__list">' +
      items
        .map(function (i) {
          return '<div class="os-m__item"><i></i><span>' + esc(i) + "</span></div>";
        })
        .join("") +
      "</div>";
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

  function orbit() {
    var host = qs("#orbit");
    if (!host) return;
    D.osFamily.forEach(function (o, i) {
      var node = M.el("article", "orbit__node orbit__node--" + (i + 1));
      node.setAttribute("data-reveal", "fade");
      node.style.setProperty("--reveal-delay", 150 + i * 110 + "ms");
      node.innerHTML =
        '<span class="chip chip--' +
        esc(o.cls) +
        '">' +
        esc(o.status) +
        "</span>" +
        "<b>" +
        esc(o.name) +
        "</b><p>" +
        esc(o.copy) +
        "</p>";
      host.appendChild(node);
    });
  }

  /* ==========================================================
     08 — Selected work carousel
     ========================================================== */

  function work() {
    var viewport = qs("#workViewport");
    var track = qs("#workTrack");
    var thumb = qs("#workThumb");
    var prev = qs("#workPrev");
    var next = qs("#workNext");
    if (!viewport || !track) return;

    D.work.forEach(function (c, i) {
      var art = M.el("article", "case" + (c.wide ? " case--wide" : ""));
      art.setAttribute("data-cursor", "View");
      art.innerHTML =
        '<div class="case__frame">' +
        '<span class="case__tag">' +
        esc(c.tag) +
        "</span>" +
        '<img src="' +
        esc(c.media) +
        '" alt="' +
        esc(c.alt) +
        '" loading="lazy" decoding="async">' +
        '<div class="case__shift">' +
        "<span>" +
        esc(c.from) +
        '</span><i aria-hidden="true"></i><b>' +
        esc(c.to) +
        "</b></div>" +
        "</div>" +
        '<div class="case__body">' +
        "<h3>" +
        esc(c.title) +
        "</h3>" +
        "<p>" +
        esc(c.copy) +
        "</p>" +
        '<div class="case__meta">' +
        c.meta
          .map(function (m) {
            return '<span class="sol__tag">' + esc(m) + "</span>";
          })
          .join("") +
        "</div>" +
        "</div>";
      track.appendChild(art);
    });

    var cards = qsa(".case", track);

    function update() {
      var max = viewport.scrollWidth - viewport.clientWidth;
      var p = max > 0 ? viewport.scrollLeft / max : 0;
      var ratio = viewport.clientWidth / viewport.scrollWidth;
      if (thumb) {
        thumb.style.setProperty("--w", clamp(ratio * 100, 12, 100) + "%");
        thumb.style.setProperty(
          "--x",
          (p * (100 / clamp(ratio, 0.12, 1) - 100)) + "%"
        );
      }
      if (prev) prev.disabled = viewport.scrollLeft < 4;
      if (next) next.disabled = viewport.scrollLeft > max - 4;
    }

    function step(dir) {
      var card = cards[0];
      var amount = card
        ? card.offsetWidth + 20
        : viewport.clientWidth * 0.8;
      viewport.scrollBy({
        left: amount * dir,
        behavior: M.reduced ? "auto" : "smooth"
      });
    }

    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    viewport.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });

    /* Pointer drag with a movement threshold so clicks survive. */
    var down = false,
      moved = false,
      startX = 0,
      startScroll = 0;

    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return; /* native touch is better */
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
    });

    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        viewport.classList.add("is-dragging");
      }
      if (moved) viewport.scrollLeft = startScroll - dx;
    });

    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      if (moved) {
        viewport.classList.remove("is-dragging");
        /* Let snapping settle after the class is restored. */
        window.setTimeout(update, 60);
      }
    });

    update();
  }

  /* ==========================================================
     09 — Industries mosaic
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
     10 — Technology
     ========================================================== */

  function tech() {
    var a = qs("#techA"),
      b = qs("#techB"),
      list = qs("#techList"),
      notes = qs("#techNotes");

    function chip(t) {
      return (
        '<span class="tech__chip"><i aria-hidden="true"></i>' +
        esc(t.n) +
        "<small>" +
        esc(t.c) +
        "</small></span>"
      );
    }

    if (a) a.innerHTML = D.tech.map(chip).join("");
    if (b) b.innerHTML = D.tech.slice().reverse().map(chip).join("");

    /* The marquee is decorative; this list is what gets read. */
    if (list)
      list.innerHTML = D.tech
        .map(function (t) {
          return "<li>" + esc(t.n) + " — " + esc(t.c) + "</li>";
        })
        .join("");

    if (notes) {
      D.techNotes.forEach(function (n, i) {
        var item = M.el("div", "tech__note");
        item.setAttribute("data-reveal", "fade");
        item.style.setProperty("--reveal-delay", i * 110 + "ms");
        item.innerHTML = "<b>" + esc(n.k) + "</b><span>" + esc(n.v) + "</span>";
        notes.appendChild(item);
      });
    }
  }

  /* ==========================================================
     11 — Why Become
     ========================================================== */

  function why() {
    var host = qs("#whyStack");
    if (!host) return;

    D.why.forEach(function (c, i) {
      var art = M.el("article", "chapter chapter--" + (i + 1));
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
        '<div class="chapter__points">' +
        c.points
          .map(function (p) {
            return '<span class="chapter__point">' + esc(p) + "</span>";
          })
          .join("") +
        "</div>" +
        "</div>";
      art.setAttribute("data-reveal", "scale");
      host.appendChild(art);
    });
  }

  /* ==========================================================
     12 — Process
     ========================================================== */

  function process() {
    var host = qs("#trackSteps");
    var track = qs("#track");
    var line = qs("#trackLine");
    if (!host) return;

    D.process.forEach(function (s) {
      var li = M.el("li", "step");
      li.innerHTML =
        '<span class="step__node">' +
        esc(s.n) +
        "</span>" +
        "<h3>" +
        esc(s.k) +
        "</h3>" +
        "<p>" +
        esc(s.v) +
        "</p>" +
        '<span class="step__out">→ ' +
        esc(s.out) +
        "</span>";
      host.appendChild(li);
    });

    var steps = qsa(".step", host);

    if (M.reduced) {
      steps.forEach(function (s) {
        s.classList.add("is-on");
      });
      if (line) line.style.setProperty("--p", "1");
      return;
    }

    M.onScrollFrame(function (y, vh) {
      if (!track) return;
      var r = track.getBoundingClientRect();
      var span = r.height + vh * 0.35;
      var p = clamp((vh * 0.78 - r.top) / span, 0, 1);
      if (line) line.style.setProperty("--p", p.toFixed(3));

      var reached = Math.ceil(p * steps.length);
      steps.forEach(function (s, i) {
        s.classList.toggle("is-on", i < reached);
      });
    });
  }

  /* ==========================================================
     13 — Contact
     ========================================================== */

  function contact() {
    var details = qs("#contactDetails");
    var socials = qs("#contactSocials");
    var c = D.contact;

    function row(label, item, href) {
      var dt = M.el("dt");
      dt.textContent = label;
      var dd = M.el("dd");

      if (item.pending) {
        dd.innerHTML = '<span class="is-placeholder">' + esc(item.value) + "</span>";
      } else if (href) {
        dd.innerHTML =
          '<a href="' + esc(href) + '">' + esc(item.value) + "</a>";
      } else {
        dd.textContent = item.value;
      }

      var wrap = M.el("div", "contact__detail");
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      return wrap;
    }

    if (details) {
      details.appendChild(row("Email", c.email, "mailto:" + c.email.value));
      details.appendChild(row("Phone", c.phone, "tel:" + c.phone.value.replace(/\s/g, "")));
      details.appendChild(row("Studio", c.address));
      details.appendChild(row("Hours", c.hours));
    }

    if (socials) {
      c.socials.forEach(function (s) {
        var a = M.el(s.pending ? "span" : "a", "chip" + (s.pending ? " chip--concept" : ""));
        if (!s.pending) {
          a.href = s.href;
          a.target = "_blank";
          a.rel = "noopener";
        }
        a.textContent = s.label;
        socials.appendChild(a);
      });
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
      var subject = "New enquiry — " + qs("#f-interest").value;
      var body =
        "Name: " + qs("#f-name").value +
        "\nEmail: " + qs("#f-email").value +
        "\nCompany: " + (qs("#f-company").value || "—") +
        "\nInterest: " + qs("#f-interest").value +
        "\n\n" + qs("#f-message").value;

      window.location.href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (status) {
        status.textContent =
          "Opening your email client. If nothing happens, write to " + to + ".";
        status.classList.add("is-on");
      }
    });
  }

  /* ==========================================================
     Footer
     ========================================================== */

  function footer() {
    function fill(id, items) {
      var host = qs(id);
      if (!host) return;
      host.innerHTML = items
        .map(function (i) {
          return '<li><a href="' + esc(i.href) + '">' + esc(i.label) + "</a></li>";
        })
        .join("");
    }

    fill("#footProducts", D.footer.products);
    fill("#footSolutions", D.footer.solutions);
    fill("#footCompany", D.footer.company);

    var year = qs("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ========================================================== */

  function renderAll() {
    nav();
    heroFacts();
    heroRotator();
    heroCanvas();
    ticker();
    converge();
    solutions();
    ai();
    products();
    work();
    industries();
    tech();
    why();
    process();
    contact();
    footer();
  }

  return { renderAll: renderAll };
})();
