/* ============================================================
   BECOME. — Dedicated page behaviour
   Everything the five solution pages need beyond the shared
   chrome: drag rails, cross-fading device screens, scroll flows
   and the LivingOS product tour.
   ============================================================ */

window.PAGES = (function () {
  "use strict";

  var M = window.MOTION;
  var qs = M.qs,
    qsa = M.qsa,
    clamp = M.clamp;

  /* ==========================================================
     Horizontal rails — drag, scroll, arrow keys
     ========================================================== */

  function rails() {
    qsa("[data-rail]").forEach(function (rail) {
      var wrap = rail.closest("[data-rail-wrap]") || rail.parentNode;
      var thumb = qs("[data-rail-thumb]", wrap);
      var prev = qs("[data-rail-prev]", wrap);
      var next = qs("[data-rail-next]", wrap);

      function update() {
        var max = rail.scrollWidth - rail.clientWidth;
        var p = max > 0 ? rail.scrollLeft / max : 0;
        var ratio = rail.clientWidth / rail.scrollWidth;
        if (thumb) {
          thumb.style.setProperty("--w", clamp(ratio * 100, 12, 100) + "%");
          thumb.style.setProperty(
            "--x",
            p * (100 / clamp(ratio, 0.12, 1) - 100) + "%"
          );
        }
        if (prev) prev.disabled = rail.scrollLeft < 4;
        if (next) next.disabled = rail.scrollLeft > max - 4;
      }

      function step(dir) {
        var card = rail.firstElementChild;
        var amount = card ? card.offsetWidth + 20 : rail.clientWidth * 0.8;
        rail.scrollBy({
          left: amount * dir,
          behavior: M.reduced ? "auto" : "smooth"
        });
      }

      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });

      rail.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update, { passive: true });

      rail.setAttribute("tabindex", "0");
      rail.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      });

      /* Pointer drag, with a threshold so clicks still land. */
      var down = false, moved = false, startX = 0, startScroll = 0;

      rail.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch") return; /* native touch is better */
        down = true;
        moved = false;
        startX = e.clientX;
        startScroll = rail.scrollLeft;
      });

      window.addEventListener("pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 5) {
          moved = true;
          rail.classList.add("is-dragging");
        }
        if (moved) rail.scrollLeft = startScroll - dx;
      });

      window.addEventListener("pointerup", function () {
        if (!down) return;
        down = false;
        if (moved) {
          rail.classList.remove("is-dragging");
          window.setTimeout(update, 60);
        }
      });

      update();
    });
  }

  /* ==========================================================
     Cross-fading stacks — phone screens, media panels
     Any [data-fade] cycles its .is-on child. Hovering or
     focusing a [data-fade-to] button takes manual control.
     ========================================================== */

  function fades() {
    qsa("[data-fade]").forEach(function (host) {
      var slides = qsa(":scope > *", host).filter(function (n) {
        return !n.hasAttribute("data-fade-skip");
      });
      if (slides.length < 2) {
        if (slides[0]) slides[0].classList.add("is-on");
        return;
      }

      var pickers = qsa('[data-fade-to][data-fade-host="' + host.id + '"]');
      var i = 0;
      var timer = null;
      var every = parseInt(host.getAttribute("data-fade"), 10) || 3200;

      function show(n) {
        i = (n + slides.length) % slides.length;
        slides.forEach(function (s, idx) {
          s.classList.toggle("is-on", idx === i);
          var v = s.matches("video") ? s : qs("video", s);
          if (v) {
            if (idx === i) {
              var p = v.play();
              if (p && p.catch) p.catch(function () {});
            } else if (!v.paused) {
              v.pause();
            }
          }
        });
        pickers.forEach(function (b, idx) {
          b.classList.toggle("is-on", idx === i);
          b.setAttribute("aria-selected", idx === i ? "true" : "false");
        });
      }

      function start() {
        if (timer || M.reduced) return;
        timer = window.setInterval(function () { show(i + 1); }, every);
      }
      function stop() {
        if (timer) { window.clearInterval(timer); timer = null; }
      }

      pickers.forEach(function (b, idx) {
        b.addEventListener("click", function () { stop(); show(idx); });
        b.addEventListener("pointerenter", function () {
          if (!M.coarse) { stop(); show(idx); }
        });
        b.addEventListener("focus", function () { stop(); show(idx); });
      });

      show(0);
      M.inViewToggle(host, start, stop);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
      });
    });
  }

  /* ==========================================================
     Scroll-lit flows — YOUR IDEA → DESIGN → APP
     ========================================================== */

  function flows() {
    qsa("[data-flow]").forEach(function (host) {
      var steps = qsa(".flow__step, .flow__arrow", host);
      if (!steps.length) return;

      if (M.reduced) {
        steps.forEach(function (s) { s.classList.add("is-on"); });
        return;
      }

      M.onScrollFrame(function (y, vh) {
        var r = host.getBoundingClientRect();
        /* Fully lit once the block reaches the middle of the screen. */
        var p = clamp((vh * 0.85 - r.top) / (r.height * 0.55 + vh * 0.3), 0, 1);
        var reached = Math.ceil(p * steps.length);
        steps.forEach(function (s, i) {
          s.classList.toggle("is-on", i < reached);
        });
      });
    });
  }

  /* ==========================================================
     Local anchors — a page's own "Explore ↓" jump
     main.js already handles these, so nothing to add here.
     ==========================================================
     LivingOS product tour
     ========================================================== */

  /* Any [data-tilt] leans toward the pointer, driven by its parent. */
  function tilts() {
    qsa("[data-tilt]").forEach(function (node) {
      M.initTilt(node, 7);
    });
  }

  function livingOs() {
    if (!qs("#osUi")) return;
    window.OSUI.desktop();
    window.OSUI.phone();
    M.initTilt(qs("#deviceScreen"), 4);
  }

  /* ========================================================== */

  function init() {
    rails();
    fades();
    flows();
    tilts();
    livingOs();
  }

  return { init: init };
})();
