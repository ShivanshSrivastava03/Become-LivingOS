/* ============================================================
   BECOME. — Content model
   Everything the site says lives here. Edit this file to edit
   the website. Nothing below depends on the DOM.
   ============================================================ */

window.BECOME = (function () {
  "use strict";

  /* ----------------------------------------------------------
     ⚑ CONTACT — WAITING ON REAL INFORMATION
     Replace every value marked `pending: true`. Anything still
     pending renders as a visible "to be provided" tag on the
     page so nothing fake is ever published.
     ---------------------------------------------------------- */
  var contact = {
    email: { value: "hello@become.example", pending: true },
    phone: { value: "+00 00000 00000", pending: true },
    address: { value: "Studio address, City, Country", pending: true },
    hours: { value: "Mon–Fri, 10:00–19:00", pending: true },
    socials: [
      { label: "LinkedIn", href: "#", pending: true },
      { label: "Instagram", href: "#", pending: true },
      { label: "X", href: "#", pending: true },
      { label: "GitHub", href: "#", pending: true }
    ]
  };

  var nav = [
    { label: "Solutions", href: "#solutions" },
    { label: "AI", href: "#ai" },
    { label: "Products", href: "#products" },
    { label: "Work", href: "#work" },
    { label: "Company", href: "#why" },
    { label: "Contact", href: "#contact" }
  ];

  /* Hero — the transformation line cycles through these. */
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

  var heroFacts = [
    { k: "Products", v: "Built in-house" },
    { k: "AI", v: "Applied, in production" },
    { k: "Delivery", v: "Design + engineering" }
  ];

  var ticker = [
    "Software",
    "Artificial Intelligence",
    "SaaS Products",
    "Automation",
    "Cloud",
    "Mobile",
    "Computer Vision",
    "Brand",
    "Data"
  ];

  /* Convergence wall — these collapse into the wordmark. */
  var convergeWords = [
    "Visible.",
    "Automated.",
    "Connected.",
    "Intelligent.",
    "Scalable.",
    "Digital.",
    "Powerful.",
    "Trusted.",
    "Modern.",
    "Faster.",
    "Global.",
    "Relevant."
  ];

  /* ---------------------------------------------------------- */

  var solutions = [
    {
      id: "software",
      name: "Software Engineering",
      line: "Systems a business can actually run on.",
      copy: "Platforms, internal tools and integrations engineered to survive growth, staff turnover and the next five years — not just the demo.",
      tags: ["Platforms", "Internal tools", "APIs", "Integrations"],
      media: "assets/img/sol-software.jpg",
      alt: "A developer working at a dark desk lit by code on screen"
    },
    {
      id: "ai",
      name: "Artificial Intelligence",
      line: "Models put to work, not put on stage.",
      copy: "Applied AI that sits inside your operations and removes the work nobody should be doing by hand. Measured on outcomes, not novelty.",
      tags: ["Vision", "Language", "Speech", "Forecasting"],
      media: "assets/img/atmos-sphere.jpg",
      alt: "An abstract sphere formed from thousands of points of light"
    },
    {
      id: "web",
      name: "Web Experiences",
      line: "A first impression that closes.",
      copy: "Sites and product surfaces built for speed, clarity and conviction. Fast on a mid-range phone, memorable on a large screen.",
      tags: ["Marketing sites", "Product UI", "Design systems", "SEO"],
      media: "assets/img/accent-curves.jpg",
      alt: "Soft abstract curves lit in warm orange against black"
    },
    {
      id: "mobile",
      name: "Mobile Applications",
      line: "In the pocket of the people who matter.",
      copy: "Native-quality apps for customers and for staff, shipped as one product across iOS and Android and maintained as the business changes.",
      tags: ["iOS", "Android", "Offline-first", "Push"],
      media: "assets/img/sol-mobile.jpg",
      alt: "A person filming with a phone under warm coloured light"
    },
    {
      id: "brand",
      name: "Brand Growth",
      line: "Being good is not the same as being chosen.",
      copy: "Identity, positioning and digital presence that make the right people notice, remember and come back — built to compound.",
      tags: ["Identity", "Positioning", "Content", "Performance"],
      media: "assets/img/sol-brand.jpg",
      alt: "A film lighting rig on a darkened studio floor"
    },
    {
      id: "automation",
      name: "Automation",
      line: "The end of the manual middle.",
      copy: "Workflows that move data, trigger actions and close loops on their own, so your team spends its hours on the parts that need judgement.",
      tags: ["Workflows", "RPA", "Integrations", "Alerts"],
      media: "assets/img/sol-automation.jpg",
      alt: "A robotic arm working on a production line"
    },
    {
      id: "cloud",
      name: "Cloud Infrastructure",
      line: "Ready before the traffic arrives.",
      copy: "Infrastructure that scales quietly, deploys safely and costs what it should. Observability from day one, not after the first incident.",
      tags: ["AWS", "Azure", "Containers", "CI/CD"],
      media: "assets/img/sol-cloud.jpg",
      alt: "Structured cabling inside a network rack"
    }
  ];

  /* ---------------------------------------------------------- */

  var aiCaps = [
    {
      name: "AI Chatbots",
      pill: "Deployed",
      copy: "Answers customers at two in the morning — trained on your policies, catalogue and tone.",
      viz: "chat"
    },
    {
      name: "Computer Vision",
      pill: "Live",
      copy: "Cameras that count, inspect and flag, without anyone watching a monitor.",
      viz: "vision"
    },
    {
      name: "Voice AI",
      pill: "Live",
      copy: "Calls answered, booked and logged in natural speech, in the languages you serve.",
      viz: "voice"
    },
    {
      name: "Knowledge Assistants",
      pill: "Deployed",
      copy: "Every document the company owns, answerable in one sentence with its source.",
      viz: "graph"
    },
    {
      name: "AI Automation",
      pill: "Live",
      copy: "Decisions and handoffs that used to sit in a queue waiting for a person.",
      viz: "pipeline"
    },
    {
      name: "Virtual Try-On",
      pill: "Product",
      copy: "Customers see it on themselves before they decide to buy it.",
      viz: "tryon"
    },
    {
      name: "Speech Analytics",
      pill: "Live",
      copy: "What was actually said across a thousand calls — and what it means for next week.",
      viz: "sentiment"
    },
    {
      name: "Document Intelligence",
      pill: "Live",
      copy: "Invoices, identity documents and contracts read, checked and filed in seconds.",
      viz: "docs"
    },
    {
      name: "Predictive Analytics",
      pill: "Live",
      copy: "Demand, churn and risk surfaced early enough to still do something about them.",
      viz: "forecast"
    }
  ];

  var aiOutcomes = [
    { k: "Better decisions", v: "Evidence instead of instinct" },
    { k: "Faster operations", v: "Hours removed from every cycle" },
    { k: "Less manual work", v: "People on judgement, not entry" },
    { k: "New experiences", v: "Things you could not offer before" },
    { k: "Scalable intelligence", v: "Capacity that grows without headcount" },
    { k: "Connected knowledge", v: "One memory across the organisation" }
  ];

  /* ---------------------------------------------------------- */

  var livingOsUses = [
    {
      k: "Live occupancy",
      v: "Every room, bed and booking in one view that updates itself."
    },
    {
      k: "Money that reconciles",
      v: "Rent, dues and collections tracked without a spreadsheet in sight."
    },
    {
      k: "Operations on rails",
      v: "Housekeeping, maintenance and staff tasks routed automatically."
    },
    {
      k: "Residents in the loop",
      v: "A companion app for requests, payments and everything else."
    }
  ];

  var osFamily = [
    {
      name: "RetailOS",
      status: "In development",
      cls: "soon",
      copy: "Inventory, storefront and customer history behaving as one system."
    },
    {
      name: "SchoolOS",
      status: "Concept",
      cls: "concept",
      copy: "Admissions, attendance and academics without the paperwork underneath."
    },
    {
      name: "ClinicOS",
      status: "Concept",
      cls: "concept",
      copy: "Records, scheduling and billing that finally agree with each other."
    },
    {
      name: "RestaurantOS",
      status: "Concept",
      cls: "concept",
      copy: "Covers, kitchen and stock forecast from the same source of truth."
    }
  ];

  /* ----------------------------------------------------------
     ⚑ SELECTED WORK — PLACEHOLDER CASE STUDIES
     These describe the shape of the work, not named clients.
     Replace with real engagements (and real imagery) before
     launch. No statistics are claimed anywhere by design.
     ---------------------------------------------------------- */
  var work = [
    {
      tag: "Hospitality",
      title: "The property that runs itself at night",
      copy: "Check-in, keys and night audit handled without a phone call, so the desk is free for the guests actually standing in front of it.",
      from: "Night-shift phone calls",
      to: "Automated check-in",
      media: "assets/img/work-hospitality.jpg",
      alt: "A hotel lobby bar lit in deep red neon",
      meta: ["Product", "Mobile", "Automation"],
      wide: true
    },
    {
      tag: "Restaurants",
      title: "A kitchen that knows what is coming",
      copy: "Covers forecast from history and season, turned into a prep list and a purchase order before the team arrives.",
      from: "Guesswork prep",
      to: "Forecast-led ordering",
      media: "assets/img/work-restaurant.jpg",
      alt: "A dimly lit restaurant dining room with warm table lamps",
      meta: ["Forecasting", "Ops"]
    },
    {
      tag: "Retail",
      title: "Stock you can actually trust",
      copy: "Three disconnected systems reduced to one inventory truth, shared by the shop floor, the warehouse and the website.",
      from: "Three systems",
      to: "One inventory truth",
      media: "assets/img/work-retail.jpg",
      alt: "A bright modern retail store interior",
      meta: ["Platform", "Integrations"]
    },
    {
      tag: "Education",
      title: "Administration, quietly removed",
      copy: "Attendance, records and reporting that update themselves, returning the week to the people who came here to teach.",
      from: "Paper registers",
      to: "Records that update themselves",
      media: "assets/img/work-education.jpg",
      alt: "A large university lecture hall",
      meta: ["Web", "Automation"]
    },
    {
      tag: "Manufacturing",
      title: "Defects caught on the line",
      copy: "Vision models inspecting every unit as it passes, instead of a sample checked once the batch is already finished.",
      from: "End-of-batch checks",
      to: "Real-time inspection",
      media: "assets/img/work-manufacturing.jpg",
      alt: "Workers on a manufacturing assembly line",
      meta: ["Computer Vision", "Cloud"],
      wide: true
    },
    {
      tag: "SaaS",
      title: "A product, not a project",
      copy: "An internal tool that had outgrown its spreadsheet, rebuilt as a multi-tenant platform the business can now sell.",
      from: "Internal spreadsheet",
      to: "Multi-tenant platform",
      media: "assets/img/work-platform.jpg",
      alt: "Source code displayed on a dark screen",
      meta: ["SaaS", "Architecture"]
    }
  ];

  /* ---------------------------------------------------------- */

  var industries = [
    {
      name: "Hospitality",
      note: "Hotels, hostels and serviced living running on one system instead of six.",
      media: "assets/img/ind-hospitality.jpg",
      alt: "A modern hotel lobby at night with a city view",
      cls: "a"
    },
    {
      name: "Healthcare",
      note: "Clinics and practices where records, scheduling and billing stop fighting each other.",
      media: "assets/img/ind-healthcare.jpg",
      alt: "A clinical operating theatre",
      cls: "b"
    },
    {
      name: "Retail",
      note: "Stores and brands with one honest view of stock, customers and margin.",
      media: "assets/img/ind-retail.jpg",
      alt: "A warmly lit clothing boutique",
      cls: "c"
    },
    {
      name: "Education",
      note: "Institutions spending less of the week on administration and more of it on teaching.",
      media: "assets/img/ind-education.jpg",
      alt: "Students in a modern lecture room",
      cls: "d"
    },
    {
      name: "Manufacturing",
      note: "Lines that see their own defects and plants that predict their own downtime.",
      media: "assets/img/ind-manufacturing.jpg",
      alt: "An automotive manufacturing floor",
      cls: "e"
    },
    {
      name: "SMEs",
      note: "Small teams given the operating leverage of a much larger one.",
      media: "assets/img/ind-sme.jpg",
      alt: "A small workshop lit by a single lamp",
      cls: "f"
    }
  ];

  var tech = [
    { n: "Python", c: "Language" },
    { n: "React", c: "Interface" },
    { n: "Next.js", c: "Framework" },
    { n: "FastAPI", c: "Services" },
    { n: "PostgreSQL", c: "Data" },
    { n: "Docker", c: "Runtime" },
    { n: "AWS", c: "Cloud" },
    { n: "Azure", c: "Cloud" },
    { n: "OpenAI", c: "Models" },
    { n: "TensorFlow", c: "ML" },
    { n: "PyTorch", c: "ML" },
    { n: "YOLO", c: "Vision" },
    { n: "OpenCV", c: "Vision" }
  ];

  var techNotes = [
    {
      k: "Chosen, not collected",
      v: "We pick the smallest stack that solves the problem and can be maintained by the people who inherit it."
    },
    {
      k: "Portable by default",
      v: "Containerised services and standard interfaces, so nothing is locked to a vendor that changes its mind."
    },
    {
      k: "Boring where it counts",
      v: "Proven data layers under the interesting parts. The novelty belongs in the product, not the plumbing."
    }
  ];

  var why = [
    {
      word: "Think",
      num: "Chapter 01",
      copy: "Most technology fails because it answers a question nobody asked. We start by finding the one that actually matters, and we are willing to tell you the answer is not software.",
      points: ["Discovery", "Opportunity mapping", "Honest scope"],
      media: "assets/img/why-think.jpg",
      alt: "A person sketching by lamplight in a dark room"
    },
    {
      word: "Build",
      num: "Chapter 02",
      copy: "Design and engineering in the same room, on the same week. What we hand over is documented, tested and understandable by someone who was not there when we wrote it.",
      points: ["Design", "Engineering", "Quality"],
      media: "assets/img/why-build.jpg",
      alt: "An overhead view of a workspace lit by two panel lights"
    },
    {
      word: "Scale",
      num: "Chapter 03",
      copy: "Software is not finished when it ships. We measure what it does, automate what repeats and extend it as the business becomes something else.",
      points: ["Deploy", "Automate", "Extend"],
      media: "assets/img/why-scale.jpg",
      alt: "Layered architectural forms in low light"
    }
  ];

  var process = [
    {
      n: "01",
      k: "Discover",
      v: "We sit with the problem before we touch a tool. Constraints, people, money, timing.",
      out: "A decision, not a deck"
    },
    {
      n: "02",
      k: "Design",
      v: "Interfaces and architecture drawn together, so the thing that looks right also works.",
      out: "A prototype you can use"
    },
    {
      n: "03",
      k: "Develop",
      v: "Built in visible increments. You see it working every week, not at the end.",
      out: "Working software"
    },
    {
      n: "04",
      k: "Deploy",
      v: "Released carefully, with monitoring, rollback and a team that knows how to run it.",
      out: "Live, and observable"
    },
    {
      n: "05",
      k: "Grow",
      v: "Measured, automated and extended. The system keeps up as the business changes shape.",
      out: "Compounding returns"
    }
  ];

  var footer = {
    products: [
      { label: "Become LivingOS", href: "#products" },
      { label: "RetailOS", href: "#products" },
      { label: "SchoolOS", href: "#products" },
      { label: "ClinicOS", href: "#products" },
      { label: "RestaurantOS", href: "#products" }
    ],
    solutions: [
      { label: "Software Engineering", href: "#solutions" },
      { label: "Artificial Intelligence", href: "#ai" },
      { label: "Web Experiences", href: "#solutions" },
      { label: "Mobile Applications", href: "#solutions" },
      { label: "Automation", href: "#solutions" },
      { label: "Cloud Infrastructure", href: "#solutions" }
    ],
    company: [
      { label: "Why Become", href: "#why" },
      { label: "Process", href: "#process" },
      { label: "Selected Work", href: "#work" },
      { label: "Industries", href: "#industries" },
      { label: "Contact", href: "#contact" }
    ]
  };

  return {
    contact: contact,
    nav: nav,
    heroWords: heroWords,
    heroFacts: heroFacts,
    ticker: ticker,
    convergeWords: convergeWords,
    solutions: solutions,
    aiCaps: aiCaps,
    aiOutcomes: aiOutcomes,
    livingOsUses: livingOsUses,
    osFamily: osFamily,
    work: work,
    industries: industries,
    tech: tech,
    techNotes: techNotes,
    why: why,
    process: process,
    footer: footer
  };
})();
