/* ============================================================
   BECOME. — Boot and global behaviour
   ============================================================ */

(function () {
  "use strict";

  var M = window.MOTION;
  var qs = M.qs,
    qsa = M.qsa;

  var NAV_OFFSET = 64;

  /* ----------------------------------------------------------
     Boot sequence
     ---------------------------------------------------------- */

  function boot() {
    var screen = qs("#boot");
    var bar = qs("#bootBar");
    var pct = qs("#bootPct");

    function finish() {
      document.body.classList.add("is-booted");
      if (screen) screen.classList.add("is-done");
      /* Reveal work can only measure correctly once visible. */
      window.setTimeout(function () {
        M.initReveal();
        M.initMasks();
        M.kick();
      }, 60);
    }

    if (M.reduced || !screen) {
      if (screen) screen.classList.add("is-done");
      document.body.classList.add("is-booted");
      return finish;
    }

    var progress = 0;
    var done = false;

    var tick = window.setInterval(function () {
      /* Ease toward 100 but never quite arrive until we are ready. */
      progress += (100 - progress) * 0.14 + 1.5;
      if (progress > 98) progress = 98;
      if (bar) bar.style.transform = "scaleX(" + progress / 100 + ")";
      if (pct) pct.textContent = Math.round(progress) + "%";
    }, 60);

    function complete() {
      if (done) return;
      done = true;
      window.clearInterval(tick);
      if (bar) bar.style.transform = "scaleX(1)";
      if (pct) pct.textContent = "100%";
      window.setTimeout(finish, 380);
    }

    /* Whichever comes first: the page settling, or a hard cap. */
    if (document.readyState === "complete") {
      window.setTimeout(complete, 900);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(complete, 420);
      });
    }
    window.setTimeout(complete, 3200);

    return finish;
  }

  /* ----------------------------------------------------------
     Navigation
     ---------------------------------------------------------- */

  function navBehaviour() {
    var nav = qs("#nav");
    if (!nav) return;

    var lastY = window.pageYOffset;

    M.onScrollFrame(function (y) {
      nav.classList.toggle("is-stuck", y > 40);

      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;

      if (goingDown && y > 420 && !document.body.classList.contains("menu-open")) {
        nav.classList.add("is-hidden");
      } else if (goingUp) {
        nav.classList.remove("is-hidden");
      }

      if (Math.abs(y - lastY) > 3) lastY = y;
    });
  }

  function menu() {
    var toggle = qs("#navToggle");
    var panel = qs("#menu");
    if (!toggle || !panel) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      document.body.classList.add("menu-open");
      document.body.style.overflow = "hidden";
      panel.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      var first = qs(".menu__link", panel);
      if (first) window.setTimeout(function () { first.focus(); }, 340);
    }

    function close() {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      panel.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    toggle.addEventListener("click", function () {
      if (document.body.classList.contains("menu-open")) close();
      else open();
    });

    qsa("[data-menu-close]").forEach(function (n) {
      n.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        close();
      }
    });

    /* Keep focus inside the panel while it is open. */
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusables = qsa(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        panel
      ).filter(function (n) {
        return n.offsetParent !== null;
      });
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (
        window.innerWidth >= 1040 &&
        document.body.classList.contains("menu-open")
      ) {
        close();
      }
    });
  }

  /* ----------------------------------------------------------
     Anchors — one easing for every in-page jump
     ---------------------------------------------------------- */

  function anchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;

      var href = a.getAttribute("href");
      if (!href || href === "#") return;

      var target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();

      if (document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
        var panel = qs("#menu");
        var toggle = qs("#navToggle");
        if (panel) panel.setAttribute("aria-hidden", "true");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        window.setTimeout(function () {
          M.scrollToEl(target, NAV_OFFSET);
        }, 260);
      } else {
        M.scrollToEl(target, NAV_OFFSET);
      }

      /* Keep the URL honest without letting it jump. */
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", href);
      }
    });
  }

  /* ----------------------------------------------------------
     Deep links
     The browser resolves #section before JavaScript has built
     the section, so it lands in the wrong place. Re-resolve it
     once the content exists.
     ---------------------------------------------------------- */

  function deepLink() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    var target;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (e) {
      return;
    }
    if (!target) return;

    function land() {
      var top =
        target.getBoundingClientRect().top +
        (window.pageYOffset || 0) -
        NAV_OFFSET;
      top = Math.max(0, top);
      /* Arriving from another page should be instant, never a
         one-second animated fall from the top of the document. */
      try {
        window.scrollTo({ top: top, left: 0, behavior: "instant" });
      } catch (e) {
        window.scrollTo(0, top);
      }
      M.kick();
    }

    land();
    window.setTimeout(land, 120);
    window.addEventListener("load", function () {
      window.setTimeout(land, 60);
    });
  }

  /* ----------------------------------------------------------
     Progress bar + back to top
     ---------------------------------------------------------- */

  function chrome() {
    var bar = qs("#progressBar");
    var top = qs("#toTop");

    M.onScrollFrame(function (y, vh) {
      var max = Math.max(
        1,
        document.documentElement.scrollHeight - vh
      );
      if (bar) bar.style.setProperty("--p", M.clamp(y / max, 0, 1).toFixed(4));
      if (top) top.classList.toggle("is-on", y > vh * 1.4);
    });

    if (top) {
      top.addEventListener("click", function () {
        M.scrollToY(0);
      });
    }
  }

  /* ----------------------------------------------------------
     Optional video layers
     A still is always shown. If a film exists at the path
     below it quietly takes over; if not, nothing breaks.
     ---------------------------------------------------------- */

  function videoLayers() {
    if (M.reduced) return;

    [
      { id: "heroVideo", src: "assets/video/hero.mp4" },
      { id: "finaleVideo", src: "assets/video/finale.mp4" }
    ].forEach(function (spec) {
      var v = document.getElementById(spec.id);
      if (!v) return;

      var still = v.parentNode ? v.parentNode.querySelector("img") : null;

      v.addEventListener("loadeddata", function () {
        v.hidden = false;
        v.classList.remove("is-hidden");
        if (still) still.style.display = "none";
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });

      v.addEventListener("error", function () {
        v.remove();
      });

      /* Only attempt once the section is close to view. */
      M.onceInView(
        v.parentNode || v,
        function () {
          v.src = spec.src;
          v.load();
        },
        "300px"
      );

      /* Never let an off-screen film keep decoding. */
      M.inViewToggle(
        v.parentNode || v,
        function () {
          if (!v.hidden && v.paused) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          }
        },
        function () {
          if (!v.hidden && !v.paused) v.pause();
        }
      );
    });
  }

  /* ----------------------------------------------------------
     Go
     ---------------------------------------------------------- */

  /* No single feature may be allowed to take the page down with
     it. Each step is isolated; failures are recorded, not fatal. */
  var failures = [];

  function safe(name, fn) {
    try {
      fn();
    } catch (err) {
      failures.push(name);
      if (window.console && window.console.error) {
        window.console.error("[become] " + name + " failed:", err);
      }
    }
  }

  function start() {
    /* Content first — nothing below depends on motion running. */
    safe("render", function () {
      window.SECTIONS.renderAll();
    });

    safe("nav", navBehaviour);
    safe("menu", menu);
    safe("anchors", anchors);
    safe("chrome", chrome);
    safe("video", videoLayers);

    safe("smooth", M.initSmooth);
    safe("cursor", M.initCursor);
    safe("parallax", M.initParallax);
    safe("marquee", M.initMarquee);
    safe("magnetic", M.initMagnetic);
    safe("lit", M.initLitText);
    safe("light", function () {
      M.initSurfaceLight(".orbit__node");
    });

    /* Boot must run whatever happened above, or the page would
       never become visible. */
    safe("boot", boot);

    safe("reveal", function () {
      M.initReveal();
      M.initMasks();
      M.kick();
    });
    safe("deeplink", deepLink);

    if (failures.length) {
      document.documentElement.setAttribute(
        "data-init-error",
        failures.join(",")
      );
    }

    /* Late pass for images that change layout as they load. */
    window.addEventListener("load", function () {
      safe("reveal-late", function () {
        M.initReveal();
        M.kick();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
