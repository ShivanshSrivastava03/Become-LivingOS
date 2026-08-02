/* ============================================================
   BECOME. — Interface simulations
   Every panel below is drawn, not screenshotted, so it stays
   sharp, weighs nothing and is easy to replace with the real
   product later.
   ============================================================ */

window.DEMOS = (function () {
  "use strict";

  var M = window.MOTION;
  var esc = M.esc;

  /* ---------------------------------------------------------- */
  /*  The five console panels                                    */
  /* ---------------------------------------------------------- */

  var panels = [
    {
      id: "assistant",
      tab: "Assistant",
      title: "Knowledge assistant",
      note: "Answers grounded in your own documents, with the source attached.",
      build: buildAssistant
    },
    {
      id: "vision",
      tab: "Vision",
      title: "Computer vision",
      note: "Detection, counting and quality checks running on a live camera feed.",
      build: buildVision
    },
    {
      id: "voice",
      tab: "Voice",
      title: "Voice agent",
      note: "A booking taken end to end, transcribed and logged as it happens.",
      build: buildVoice
    },
    {
      id: "documents",
      tab: "Documents",
      title: "Document intelligence",
      note: "Structured fields pulled from an unstructured file in one pass.",
      build: buildDocuments
    },
    {
      id: "forecast",
      tab: "Forecast",
      title: "Predictive analytics",
      note: "Demand projected far enough ahead that it can still be acted on.",
      build: buildForecast
    }
  ];

  function buildAssistant() {
    return (
      '<div class="demo demo--split">' +
      '<div class="chat">' +
      '<div class="bubble bubble--us" style="animation-delay:.05s">' +
      "Which of our properties still have unpaid dues from last month?" +
      "</div>" +
      '<div class="bubble bubble--them" style="animation-delay:.5s">' +
      "Four properties carry open balances. Riverside and Old Mill account for " +
      "most of it, both from residents who moved in mid-cycle." +
      '<span class="bubble__meta">Source · billing-policy.pdf, ledger</span>' +
      "</div>" +
      '<div class="bubble bubble--us" style="animation-delay:1.05s">' +
      "Draft the reminders." +
      "</div>" +
      '<div class="typing" style="animation-delay:1.5s"><i></i><i></i><i></i></div>' +
      "</div>" +
      '<div class="demo__side">' +
      '<div class="demo__stat"><span>Sources indexed</span><b>14,200</b></div>' +
      '<div class="demo__stat"><span>Answer latency</span><b class="ok">1.2s</b></div>' +
      '<div class="demo__stat"><span>Citations</span><b>Always on</b></div>' +
      '<div class="demo__chips">' +
      '<span class="demo__chip is-hot">Grounded</span>' +
      '<span class="demo__chip">Private</span>' +
      '<span class="demo__chip">Audited</span>' +
      "</div>" +
      '<p class="demo__note">Nothing is answered from memory alone. If the ' +
      "documents do not support it, the assistant says so.</p>" +
      "</div>" +
      "</div>"
    );
  }

  function buildVision() {
    var boxes = [
      { x: 12, y: 22, w: 26, h: 38, l: "Unit · ok", d: 0.25 },
      { x: 46, y: 34, w: 22, h: 30, l: "Weld · ok", d: 0.55 },
      { x: 70, y: 18, w: 20, h: 26, l: "Defect 0.94", d: 0.85, hot: true },
      { x: 26, y: 66, w: 18, h: 22, l: "Unit · ok", d: 1.1 }
    ];

    var html =
      '<div class="demo demo--split">' +
      '<div class="vision">' +
      '<img src="assets/img/sol-automation.jpg" alt="Simulated camera feed of a production line with detections drawn over it" loading="lazy" decoding="async">';

    boxes.forEach(function (b) {
      html +=
        '<span class="vision__box' +
        (b.hot ? "" : " vision__box--calm") +
        '" data-label="' +
        esc(b.l) +
        '" style="left:' +
        b.x +
        "%;top:" +
        b.y +
        "%;width:" +
        b.w +
        "%;height:" +
        b.h +
        "%;--d:" +
        b.d +
        's"></span>';
    });

    html +=
      "</div>" +
      '<div class="demo__side">' +
      '<div class="demo__stat"><span>Frames / sec</span><b>30</b></div>' +
      '<div class="demo__stat"><span>Units seen</span><b>1,486</b></div>' +
      '<div class="demo__stat"><span>Flagged</span><b>3</b></div>' +
      '<div class="demo__chips">' +
      '<span class="demo__chip">YOLO</span>' +
      '<span class="demo__chip">OpenCV</span>' +
      '<span class="demo__chip is-hot">On-site</span>' +
      "</div>" +
      '<p class="demo__note">Runs on hardware in the building, so footage never ' +
      "has to leave the site.</p>" +
      "</div>" +
      "</div>";

    return html;
  }

  function buildVoice() {
    var bars = "";
    for (var i = 0; i < 44; i++) {
      var h = 18 + Math.round(Math.abs(Math.sin(i * 0.7)) * 68);
      bars += '<i style="--i:' + i + ";--h:" + h + '%"></i>';
    }

    var lines = [
      { who: "Caller", what: "Hi — do you have a twin room free this weekend?", d: 0.2 },
      { who: "Become", what: "We do. Friday to Sunday, two nights. Shall I hold it?", d: 0.9, ai: true },
      { who: "Caller", what: "Yes please, under Rhea.", d: 1.6 },
      { who: "Become", what: "Held. I have sent the confirmation to your number.", d: 2.3, ai: true }
    ];

    var html =
      '<div class="demo">' +
      '<div class="wave" aria-hidden="true">' +
      bars +
      "</div>" +
      '<div class="demo demo--split" style="margin-top:0">' +
      '<div class="transcript">';

    lines.forEach(function (l) {
      html +=
        '<div class="transcript__line' +
        (l.ai ? " is-ai" : "") +
        '" style="--d:' +
        l.d +
        's">' +
        '<span class="transcript__who">' +
        esc(l.who) +
        "</span>" +
        '<span class="transcript__what">' +
        esc(l.what) +
        "</span>" +
        "</div>";
    });

    html +=
      "</div>" +
      '<div class="demo__side">' +
      '<div class="demo__stat"><span>Intent</span><b>Booking · hold</b></div>' +
      '<div class="demo__stat"><span>Outcome</span><b class="ok">Reserved</b></div>' +
      '<div class="demo__stat"><span>Handoff</span><b>Not needed</b></div>' +
      '<div class="demo__chips">' +
      '<span class="demo__chip is-hot">Multilingual</span>' +
      '<span class="demo__chip">Barge-in</span>' +
      '<span class="demo__chip">Logged</span>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    return html;
  }

  function buildDocuments() {
    var rows = [
      { k: "Vendor", v: "Northgate Supplies Ltd", d: 0.35 },
      { k: "Invoice", v: "NG-2291-B", d: 0.6 },
      { k: "Date", v: "18 July", d: 0.85 },
      { k: "Net", v: "₹ 1,84,200", d: 1.1 },
      { k: "Tax", v: "18% · ₹ 33,156", d: 1.35 },
      { k: "Due", v: "30 days", d: 1.6 }
    ];

    var skeleton = "";
    var widths = [92, 68, 100, 84, 46, 100, 74, 58];
    widths.forEach(function (w, i) {
      var hit = i === 1 || i === 4 || i === 6;
      skeleton +=
        '<i class="' +
        (hit ? "is-found" : "") +
        '" style="--w:' +
        w +
        "%;--d:" +
        (0.3 + i * 0.12) +
        's"></i>';
    });

    var html =
      '<div class="demo demo--split">' +
      '<div class="doc">' +
      '<div class="doc__head"><b>invoice-2291.pdf</b><span>Scanned · 2 pages</span></div>' +
      '<div class="doc__skeleton">' +
      skeleton +
      "</div>" +
      '<div class="doc__head" style="border:0;padding-top:.4rem">' +
      "<b>Confidence</b><span>0.97 average</span></div>" +
      "</div>" +
      '<div class="extract">';

    rows.forEach(function (r) {
      html +=
        '<div class="extract__row" style="--d:' +
        r.d +
        's"><span>' +
        esc(r.k) +
        "</span><b>" +
        esc(r.v) +
        "</b></div>";
    });

    html +=
      '<p class="demo__note" style="margin-top:.35rem">Values below the ' +
      "confidence threshold are queued for a human, never guessed.</p>" +
      "</div>" +
      "</div>";

    return html;
  }

  function buildForecast() {
    var actual = [58, 62, 55, 71, 68, 79, 74, 86];
    var pred = [86, 91, 88, 97, 104];

    var W = 320,
      H = 118,
      pad = 6;
    var total = actual.length + pred.length - 1;
    var stepX = (W - pad * 2) / (total - 1);

    function ptY(v) {
      return H - pad - ((v - 40) / 80) * (H - pad * 2);
    }

    var aPts = actual.map(function (v, i) {
      return [pad + i * stepX, ptY(v)];
    });

    var pPts = pred.map(function (v, i) {
      return [pad + (actual.length - 1 + i) * stepX, ptY(v)];
    });

    function toPath(pts) {
      return pts
        .map(function (p, i) {
          return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
        })
        .join(" ");
    }

    /* Confidence band widens as the forecast reaches further out. */
    var upper = pPts.map(function (p, i) {
      return [p[0], p[1] - i * 3.2];
    });
    var lower = pPts
      .map(function (p, i) {
        return [p[0], p[1] + i * 3.6];
      })
      .reverse();
    var band = toPath(upper) + " " + toPath(lower).replace("M", "L") + " Z";

    var grid = "";
    for (var g = 1; g < 4; g++) {
      var y = pad + ((H - pad * 2) / 4) * g;
      grid += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '"/>';
    }

    var last = pPts[pPts.length - 1];

    return (
      '<div class="demo demo--split">' +
      '<div class="chart">' +
      '<svg viewBox="0 0 ' +
      W +
      " " +
      H +
      '" role="img" aria-label="Demand trending upward with a projected range for the next five weeks">' +
      '<g class="chart__grid">' +
      grid +
      "</g>" +
      '<path class="chart__band" d="' +
      band +
      '"/>' +
      '<path class="chart__actual" style="--len:900" d="' +
      toPath(aPts) +
      '"/>' +
      '<path class="chart__pred" d="' +
      toPath(pPts) +
      '"/>' +
      '<circle class="chart__dot" cx="' +
      last[0].toFixed(1) +
      '" cy="' +
      last[1].toFixed(1) +
      '" r="3.5"/>' +
      "</svg>" +
      '<div class="chart__axis"><span>Wk 1</span><span>Now</span><span>Wk 13</span></div>' +
      '<div class="chart__key">' +
      "<span><i></i> Observed</span>" +
      '<span><i class="pred"></i> Projected</span>' +
      "</div>" +
      "</div>" +
      '<div class="demo__side">' +
      '<div class="demo__stat"><span>Horizon</span><b>5 weeks</b></div>' +
      '<div class="demo__stat"><span>Signal</span><b>Season + history</b></div>' +
      '<div class="demo__stat"><span>Action</span><b class="ok">Reorder now</b></div>' +
      '<p class="demo__note">A forecast is only useful if it arrives while ' +
      "there is still time to change the order.</p>" +
      "</div>" +
      "</div>"
    );
  }

  /* ---------------------------------------------------------- */
  /*  Capability card miniatures                                 */
  /* ---------------------------------------------------------- */

  function mini(kind) {
    switch (kind) {
      case "chat":
        return (
          '<div class="mini mini--chat">' +
          '<span class="mini__b" style="--d:0s"></span>' +
          '<span class="mini__b" style="--d:.35s"></span>' +
          '<span class="mini__b" style="--d:.7s"></span>' +
          "</div>"
        );

      case "vision":
        return (
          '<div class="mini mini--vision">' +
          '<span class="mini__scan"></span>' +
          '<span class="mini__box" style="left:16%;top:22%;width:30%;height:36%;--d:0s"></span>' +
          '<span class="mini__box" style="left:56%;top:44%;width:26%;height:30%;--d:.5s"></span>' +
          "</div>"
        );

      case "voice": {
        var b = "";
        for (var i = 0; i < 20; i++) {
          b +=
            '<span class="mini__bar" style="--i:' +
            i +
            ";--h:" +
            (26 + Math.round(Math.abs(Math.sin(i * 0.9)) * 62)) +
            '%"></span>';
        }
        return '<div class="mini mini--voice">' + b + "</div>";
      }

      case "graph":
        return (
          '<div class="mini">' +
          '<svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">' +
          '<g class="mini__edge">' +
          '<line x1="60" y1="40" x2="24" y2="18"/>' +
          '<line x1="60" y1="40" x2="98" y2="24"/>' +
          '<line x1="60" y1="40" x2="30" y2="62"/>' +
          '<line x1="60" y1="40" x2="92" y2="62"/>' +
          '<line x1="24" y1="18" x2="98" y2="24"/>' +
          "</g>" +
          '<circle class="mini__node" cx="24" cy="18" r="4"/>' +
          '<circle class="mini__node" cx="98" cy="24" r="4"/>' +
          '<circle class="mini__node" cx="30" cy="62" r="4"/>' +
          '<circle class="mini__node" cx="92" cy="62" r="4"/>' +
          '<circle class="mini__node is-hot" cx="60" cy="40" r="6">' +
          '<animate attributeName="r" values="6;7.6;6" dur="2.6s" repeatCount="indefinite"/>' +
          "</circle>" +
          "</svg>" +
          "</div>"
        );

      case "pipeline":
        return (
          '<div class="mini">' +
          '<svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">' +
          '<path class="mini__line mini__line--ghost" d="M14 40 H50 V22 H106"/>' +
          '<path class="mini__line mini__line--ghost" d="M50 40 V58 H106"/>' +
          '<circle class="mini__node" cx="14" cy="40" r="4"/>' +
          '<circle class="mini__node" cx="50" cy="40" r="4"/>' +
          '<circle class="mini__node" cx="106" cy="22" r="4"/>' +
          '<circle class="mini__node" cx="106" cy="58" r="4"/>' +
          '<circle class="mini__pulse" r="3.2">' +
          '<animateMotion dur="3.2s" repeatCount="indefinite" path="M14 40 H50 V22 H106"/>' +
          '<animate attributeName="opacity" values="0;1;1;0" dur="3.2s" repeatCount="indefinite"/>' +
          "</circle>" +
          "</svg>" +
          "</div>"
        );

      case "tryon":
        return (
          '<div class="mini mini--tryon">' +
          '<svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">' +
          '<circle class="mini__node" cx="60" cy="24" r="9"/>' +
          '<path class="mini__area" d="M42 44 Q60 34 78 44 L82 74 H38 Z"/>' +
          '<path class="mini__line" d="M42 44 Q60 34 78 44 L82 74 H38 Z"/>' +
          "</svg>" +
          '<span class="mini__swatches">' +
          '<i class="mini__swatch" style="background:#ff5c2b;--d:0s"></i>' +
          '<i class="mini__swatch" style="background:#5b6b8a;--d:1.5s"></i>' +
          '<i class="mini__swatch" style="background:#e9e7e3;--d:3s"></i>' +
          "</span>" +
          "</div>"
        );

      case "sentiment": {
        var cols = "";
        var vals = [30, 52, 40, 66, 48, 74, 58, 82];
        vals.forEach(function (v, i) {
          var h = (v / 100) * 56;
          cols +=
            '<rect class="mini__col' +
            (i === vals.length - 1 ? " is-hot" : "") +
            '" x="' +
            (10 + i * 13) +
            '" y="' +
            (68 - h) +
            '" width="8" height="' +
            h +
            '" rx="2">' +
            '<animate attributeName="height" from="0" to="' +
            h +
            '" dur="0.9s" begin="' +
            i * 0.08 +
            's" fill="freeze"/>' +
            '<animate attributeName="y" from="68" to="' +
            (68 - h) +
            '" dur="0.9s" begin="' +
            i * 0.08 +
            's" fill="freeze"/>' +
            "</rect>";
        });
        return (
          '<div class="mini"><svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">' +
          cols +
          "</svg></div>"
        );
      }

      case "docs":
        return (
          '<div class="mini mini--docs">' +
          '<span class="mini__ln" style="--w:88%"></span>' +
          '<span class="mini__ln is-hit" style="--w:54%;--d:0s"></span>' +
          '<span class="mini__ln" style="--w:96%"></span>' +
          '<span class="mini__ln is-hit" style="--w:40%;--d:.6s"></span>' +
          '<span class="mini__ln" style="--w:72%"></span>' +
          '<span class="mini__ln is-hit" style="--w:62%;--d:1.2s"></span>' +
          "</div>"
        );

      case "forecast":
        return (
          '<div class="mini">' +
          '<svg viewBox="0 0 120 80" preserveAspectRatio="none">' +
          '<path class="mini__area" d="M8 58 L28 50 L48 54 L68 38 L68 72 L8 72 Z"/>' +
          '<path class="mini__line" style="stroke:rgba(255,255,255,.7)" d="M8 58 L28 50 L48 54 L68 38"/>' +
          '<path class="mini__line mini__line--ghost" style="stroke:#ff5c2b" d="M68 38 L88 32 L112 18"/>' +
          '<circle class="mini__pulse" cx="112" cy="18" r="3.5">' +
          '<animate attributeName="opacity" values="1;.25;1" dur="2.2s" repeatCount="indefinite"/>' +
          "</circle>" +
          "</svg>" +
          "</div>"
        );

      default:
        return '<div class="mini"></div>';
    }
  }

  return { panels: panels, mini: mini };
})();
