/* ============================================================
   BECOME. — LivingOS interface simulation
   The dashboard and companion app drawn in CSS. Shared by the
   homepage product preview and the dedicated LivingOS page.
   ============================================================ */

window.OSUI = (function () {
  "use strict";

  var M = window.MOTION;
  var qs = M.qs,
    qsa = M.qsa,
    esc = M.esc;

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

  return { desktop: osDesktop, phone: osPhone };
})();
