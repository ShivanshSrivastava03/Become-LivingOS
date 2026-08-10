/* ============================================================
   BECOME. — Shared chrome renderer
   Navigation, mobile menu and footer. Used by the homepage and
   by every dedicated solution page, so the two can never drift.
   ============================================================ */

window.CHROME = (function () {
  "use strict";

  var M = window.MOTION;
  var D = window.BECOME;
  var qs = M.qs,
    qsa = M.qsa,
    esc = M.esc;

  /* Homepage anchors (#solutions, #contact …) only resolve on the
     homepage. Everywhere else they have to be sent back to it. */
  var isHome = document.body.getAttribute("data-page") === "home";

  function href(item) {
    if (item.home && !isHome) return "index.html" + item.href;
    return item.href;
  }

  /* ---------------------------------------------------------- */

  function navigation() {
    var links = qs("#navLinks");
    var pill = qs("#navPill");
    var menuBody = qs("#menuBody");

    D.nav.forEach(function (item, i) {
      var url = href(item);

      if (links) {
        var a = M.el("a", "nav__link");
        a.href = url;
        a.textContent = item.label;
        links.appendChild(a);
      }

      if (menuBody) {
        var wrap = M.el("div", "menu__item");
        var link = M.el("a", "menu__link");
        link.href = url;
        link.style.setProperty("--i", 120 + i * 65 + "ms");
        link.setAttribute("data-menu-close", "");
        link.innerHTML =
          "<em>0" + (i + 1) + "</em><span>" + esc(item.label) + "</span>";
        wrap.appendChild(link);
        menuBody.appendChild(wrap);
      }
    });

    /* Primary call to action, in the bar and inside the menu. */
    qsa("[data-cta]").forEach(function (node) {
      node.setAttribute("href", href(D.cta));
      var label = qs("[data-cta-label]", node);
      if (label) label.textContent = D.cta.label + " →";
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

    spy(links, pill);
  }

  /* Scroll-spy. On the homepage the pill tracks the section you
     are inside; on a subpage it parks on that page's own link. */
  function spy(links, pill) {
    var navLinks = qsa(".nav__link", links || document);
    if (!navLinks.length) return;

    function park(a) {
      if (!pill || !a) return;
      pill.style.width = a.offsetWidth + "px";
      pill.style.transform = "translateX(" + a.offsetLeft + "px)";
      pill.classList.add("is-parked");
    }

    if (!isHome) {
      var here = document.body.getAttribute("data-nav");
      if (!here) return;
      var match = navLinks.filter(function (a) {
        return (a.getAttribute("href") || "").indexOf(here) === 0;
      })[0];
      if (match) {
        match.classList.add("is-current");
        /* Widths are only correct once fonts have settled. */
        window.setTimeout(function () {
          park(match);
        }, 300);
      }
      return;
    }

    var targets = D.nav
      .filter(function (n) {
        return n.home;
      })
      .map(function (n) {
        return { href: n.href, node: qs(n.href) };
      })
      .filter(function (t) {
        return t.node;
      });

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

  /* ---------------------------------------------------------- */

  function footer() {
    function fill(id, items) {
      var host = qs(id);
      if (!host) return;
      host.innerHTML = items
        .map(function (i) {
          return (
            '<li><a href="' + esc(href(i)) + '">' + esc(i.label) + "</a></li>"
          );
        })
        .join("");
    }

    fill("#footProduct", D.footer.product);
    fill("#footSolutions", D.footer.solutions);
    fill("#footCompany", D.footer.company);

    var year = qs("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* Every WhatsApp entry point on the page, wired from one number. */
  function whatsapp() {
    qsa("[data-whatsapp]").forEach(function (a) {
      a.href = D.contact.whatsappHref;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function render() {
    navigation();
    footer();
    whatsapp();
  }

  return { render: render, href: href, isHome: isHome };
})();
