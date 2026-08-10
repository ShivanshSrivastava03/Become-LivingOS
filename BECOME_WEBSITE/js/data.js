/* ============================================================
   BECOME. — Content model
   Everything the site says lives here. Edit this file to edit
   the website. Nothing below depends on the DOM.
   ============================================================ */

window.BECOME = (function () {
  "use strict";

  /* ----------------------------------------------------------
     Contact
     ---------------------------------------------------------- */
  var contact = {
    email: { value: "joinshivansh@gmail.com" },
    phone: { value: "+91 9305242236" },
    /* Digits only, country code first — wa.me wants it that way. */
    whatsapp: "919305242236",
    whatsappText: "Hi Become, I'd like to talk about a project."
  };

  contact.whatsappHref =
    "https://wa.me/" +
    contact.whatsapp +
    "?text=" +
    encodeURIComponent(contact.whatsappText);

  /* ----------------------------------------------------------
     Global chrome
     `page` marks the anchor targets that only exist on the
     homepage, so subpages can rewrite them as index.html#id.
     ---------------------------------------------------------- */
  var nav = [
    { label: "Solutions", href: "#solutions", home: true },
    { label: "AI", href: "#ai", home: true },
    { label: "LivingOS", href: "livingos.html" },
    { label: "Who We Transform", href: "#industries", home: true },
    { label: "Contact", href: "#contact", home: true }
  ];

  var cta = { label: "Start a conversation", href: "#contact", home: true };

  /* ----------------------------------------------------------
     01 — Hero
     ---------------------------------------------------------- */
  var heroWords = [
    "visible.",
    "connected.",
    "relevant.",
    "intelligent.",
    "digital.",
    "automated.",
    "future-ready.",
    "extraordinary.",
    "limitless."
  ];

  /* ----------------------------------------------------------
     02 — Capability ticker
     ---------------------------------------------------------- */
  var ticker = [
    "Automation",
    "AI Vision",
    "AI Voice",
    "Mobile Apps",
    "Web",
    "Platforms",
    "Applications",
    "LivingOS",
    "AI Analytics",
    "Branding",
    "Design",
    "Strategy"
  ];

  /* ----------------------------------------------------------
     04 — Convergence wall. Nine words, one outcome.
     ---------------------------------------------------------- */
  var convergeWords = [
    "AI Solutions",
    "AI Agents",
    "AI-First ERP",
    "Websites",
    "Mobile Apps",
    "Social Media",
    "Short-form Video",
    "Documentaries",
    "Automation"
  ];

  /* ----------------------------------------------------------
     05 — Solutions. Each one opens its own page.
     ---------------------------------------------------------- */
  var solutions = [
    {
      id: "marketing",
      name: "Marketing",
      line: "Build a brand people remember.",
      href: "marketing.html",
      media: "assets/img/ext/sol-marketing.jpg",
      alt: "A phone showing a social feed in a darkened room"
    },
    {
      id: "website",
      name: "Website",
      line: "Websites built for performance and growth.",
      href: "website.html",
      media: "assets/img/ext/sol-website.jpg",
      alt: "A laptop showing a commerce website being designed"
    },
    {
      id: "mobile",
      name: "Mobile Application",
      line: "Mobile experiences that people love to use.",
      href: "mobile-application.html",
      media: "assets/img/ext/sol-mobile.jpg",
      alt: "Hands using an application on a phone"
    },
    {
      id: "ai",
      name: "AI Solutions",
      line: "Practical AI that solves real business problems.",
      href: "ai-solutions.html",
      media: "assets/img/ext/sol-ai.jpg",
      alt: "A face lit by projected code"
    },
    {
      id: "products",
      name: "Our Products",
      line: "Products designed to transform industries.",
      href: "livingos.html",
      media: "assets/img/ext/sol-products.jpg",
      alt: "A modern living space lobby at night"
    }
  ];

  /* ----------------------------------------------------------
     06 — AI showcase. Six blocks, each carried by real footage.
     ---------------------------------------------------------- */
  var aiCaps = [
    {
      id: "chatbot",
      name: "AI Chatbot",
      line: "Answers, not scripts.",
      video: "assets/video/ai-chatbot.mp4",
      poster: "assets/video/ai-chatbot.jpg"
    },
    {
      id: "voice",
      name: "Voice AI",
      line: "Calls handled in natural speech.",
      video: "assets/video/ai-voice.mp4",
      poster: "assets/video/ai-voice.jpg"
    },
    {
      id: "vision",
      name: "Computer Vision",
      line: "Software that sees and understands.",
      video: "assets/video/ai-vision.mp4",
      poster: "assets/video/ai-vision.jpg"
    },
    {
      id: "integration",
      name: "AI Integration",
      line: "Intelligence inside what you already run.",
      video: "assets/video/ai-integration.mp4",
      poster: "assets/video/ai-integration.jpg"
    },
    {
      id: "charts",
      name: "AI Charts",
      line: "Data that tells you what happens next.",
      video: "assets/video/ai-charts.mp4",
      poster: "assets/video/ai-charts.jpg"
    },
    {
      id: "custom",
      name: "Custom Requirements",
      line: "Tell us what it should do.",
      video: "assets/video/ai-custom.mp4",
      poster: "assets/video/ai-custom.jpg"
    }
  ];

  /* ----------------------------------------------------------
     07 — Become LivingOS
     ---------------------------------------------------------- */
  var livingOsUses = [
    { k: "Rooms", v: "Manage every room with ease." },
    { k: "Billing", v: "Track payments without hassle." },
    { k: "Operations", v: "Keep daily work organized." },
    { k: "Resident App", v: "Stay connected with every resident." }
  ];

  /* The capability ecosystem that revolves around the core. */
  var livingOsOrbit = [
    "AI Agents",
    "Workflows",
    "AI Analytics",
    "Custom Dashboards",
    "Future Predictions",
    "Mobile App",
    "Automation"
  ];

  /* ----------------------------------------------------------
     09 — Who we transform
     ---------------------------------------------------------- */
  var industries = [
    {
      name: "SMEs",
      note: "Small teams given the operating leverage of a much larger one.",
      media: "assets/img/ext/sme.jpg",
      alt: "A small business owner in the doorway of their shop",
      cls: "a"
    },
    {
      name: "Startups",
      note: "Ship the first version fast, without building something you outgrow.",
      media: "assets/img/ext/startup.jpg",
      alt: "A startup team working together in an open office",
      cls: "b"
    },
    {
      name: "Hotels & Hostels",
      note: "Rooms, residents, money and operations running as one system.",
      media: "assets/img/ext/hotel.jpg",
      alt: "A hotel lobby",
      cls: "c"
    },
    {
      name: "Retail",
      note: "One honest view of stock, customers and margin.",
      media: "assets/img/ext/retail.jpg",
      alt: "A clothing store interior",
      cls: "d"
    },
    {
      name: "Restaurants",
      note: "Covers, kitchen and stock working from the same source of truth.",
      media: "assets/img/ext/restaurant.jpg",
      alt: "A restaurant dining room",
      cls: "e"
    },
    {
      name: "Healthcare",
      note: "Records, scheduling and billing that finally agree with each other.",
      media: "assets/img/ext/healthcare.jpg",
      alt: "A clinic reception desk",
      cls: "f"
    }
  ];

  /* ----------------------------------------------------------
     11 — How it goes
     ---------------------------------------------------------- */
  var why = [
    {
      word: "Understand",
      num: "01",
      copy: "We understand your business before we build for it.",
      media: "assets/img/why-think.jpg",
      alt: "A person sketching by lamplight in a dark room"
    },
    {
      word: "Build",
      num: "02",
      copy: "We turn real problems into practical solutions.",
      media: "assets/img/why-build.jpg",
      alt: "An overhead view of a workspace lit by two panel lights"
    },
    {
      word: "Grow",
      num: "03",
      copy: "We build technology that grows with you.",
      media: "assets/img/why-scale.jpg",
      alt: "Layered architectural forms in low light"
    }
  ];

  /* ----------------------------------------------------------
     13 — Contact form
     ---------------------------------------------------------- */
  var contactOptions = [
    "Marketing",
    "Website",
    "Mobile Application",
    "AI Solutions",
    "LivingOS",
    "Not sure yet"
  ];

  /* ----------------------------------------------------------
     Footer
     ---------------------------------------------------------- */
  var footer = {
    product: [{ label: "Become LivingOS", href: "livingos.html" }],
    solutions: [
      { label: "Marketing", href: "marketing.html" },
      { label: "Website", href: "website.html" },
      { label: "Mobile Application", href: "mobile-application.html" },
      { label: "AI Solutions", href: "ai-solutions.html" },
      { label: "LivingOS", href: "livingos.html" }
    ],
    company: [
      { label: "Who We Transform", href: "#industries", home: true },
      { label: "Contact", href: "#contact", home: true }
    ]
  };

  return {
    contact: contact,
    nav: nav,
    cta: cta,
    heroWords: heroWords,
    ticker: ticker,
    convergeWords: convergeWords,
    solutions: solutions,
    aiCaps: aiCaps,
    livingOsUses: livingOsUses,
    livingOsOrbit: livingOsOrbit,
    industries: industries,
    why: why,
    contactOptions: contactOptions,
    footer: footer
  };
})();
