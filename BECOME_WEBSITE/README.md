# Become. — Website

The official site for **Become.** — a static, dependency-free build.
No Node, no npm, no build step. **Double-click `index.html` and it runs.**

---

## Structure

```
BECOME_WEBSITE/
  index.html                the homepage
  marketing.html            ┐
  website.html              │ the five solution pages,
  mobile-application.html   │ reached from Section 05
  ai-solutions.html         │
  livingos.html             ┘ (also the LivingOS product page)
  privacy.html · terms.html · cookies.html

  css/
    tokens.css        colour, type scale, spacing, motion — edit here first
    base.css          reset, typography, buttons, motion primitives
    chrome.css        boot screen, cursor, nav, menu, footer
    sections-a.css    hero · ticker · manifesto · convergence · solutions · AI
    sections-b.css    products · who we transform · how it goes · contact · finale
    pages.css         the five solution pages: heroes, media cards, rails,
                      device mock-ups, app UI, 2D/3D comparison, CTA bands
  js/
    data.js           ← ALL HOMEPAGE COPY LIVES HERE
    motion.js         scroll engine, reveals, cursor, magnetics, marquee, tilt
    chrome.js         nav + mobile menu + footer, shared by every page
    os-ui.js          the LivingOS dashboard and companion app, drawn in CSS
    sections.js       renders each homepage section and wires its behaviour
    pages.js          solution-page behaviour: rails, cross-fades, flows, tilt
    main.js           boot, nav, menu, anchors, deep links, lazy video
  assets/
    Become..png       the logo
    img/              site imagery
    img/ext/          licensed stock photography
    video/            17 clips + their poster frames
```

**To change homepage wording, edit `js/data.js`.** Nothing else needs
touching. The five solution pages hold their own copy inline.
**To change the look, start with `css/tokens.css`** — the whole site is
driven from those variables (one accent colour, one type scale, one
radius system).

---

## The homepage

| # | Section | Notes |
|---|---------|-------|
| — | Boot | Typographic load screen, ~1s, skipped under reduced motion |
| 01 | Hero | Full viewport. `Become` + a transformation word that morphs per-character, over drifting ember footage and a generative particle field |
| — | Ticker | Two counter-scrolling marquees, nudged by scroll velocity |
| 01 | Manifesto | Editorial spread on warm white; the statement lights up word by word as you scroll |
| — | Convergence | 4-screen pinned sequence — nine words scatter, then collapse into **Become.** |
| 02 | Solutions | Numbered index + sticky media stage. Each row opens its own page |
| 03 | AI Solutions | A live showcase console: six capabilities, each carried by real footage, auto-advancing |
| 04 | Products | Become LivingOS in a laptop + phone frame, running a real HTML dashboard |
| 05 | The ecosystem | Seven capabilities revolving continuously around the LivingOS core |
| 06 | Who We Transform | Parallax mosaic, six kinds of business |
| 07 | How it goes | Understand / Build / Grow as stacking chapter cards |
| 08 | Contact | Email, phone, WhatsApp and a validated form |
| — | Finale | **Become. What you aspire to be.** |

## The solution pages

Each shares the same chrome, ends with a clear next action, and offers a
route back to Section 05.

| Page | Carries |
|------|---------|
| `marketing.html` | Social media handling (Instagram + Facebook), Reels & posts, Documentary |
| `website.html` | Seven kinds of website, a 2D-versus-3D comparison you can interact with, nine customer categories |
| `mobile-application.html` | Animated app screens, nine app categories, three ways we build, requirement → app |
| `ai-solutions.html` | The six AI capabilities, each a full media band with real footage |
| `livingos.html` | The product, marked **in development**: dashboard, capabilities, mobile app, and where it belongs |

---

## Built-in behaviour

- **Smooth scroll** — custom easing on desktop pointers only; native on
  touch; off entirely under reduced motion.
- **Reduced motion** — `prefers-reduced-motion` strips every animation
  and keeps the full design.
- **Keyboard** — skip link, visible focus rings, arrow-key tabs and
  rails, focus trap in the mobile menu, Escape to close.
- **Deep links** — `#ai`, `#products` etc. land instantly and correctly
  even though sections are rendered by script.
- **Failure isolation** — every init step *and every section renderer* is
  sandboxed. If one throws, the rest of the page still renders, and the
  failure is recorded on `<html data-init-error>` / `data-section-error`.
- **Off-screen work is paused** — canvas, marquees, video and the live
  dashboard stop when not visible, and when the tab is hidden.
- **Video is lazy and never load-bearing** — every clip carries a poster
  frame, loads only near the viewport, and pauses off-screen. If a file
  is missing the poster simply stays.

---

## Verified

Checked in headless Chromium 151:

- **9 pages** × **4 breakpoints** (390, 834, 1280, 1920) — no horizontal
  overflow, no overlapping cards, no clipped text
- **283 links** crawled — every internal target resolves to a real file
  and a real anchor; no `href="#"` placeholders
- **0** JavaScript errors, **0** failed requests, **0** missing assets
- **39** interaction checks — AI showreel tabs and video swapping,
  solution hover previews, revolving orbit, rails, cross-fades,
  scroll flows, form validation, mobile menu, back-to-top
- **116** content checks against the section-by-section review document

---

## Publishing

It is a static site, so any host works: Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or plain S3/nginx. Upload the `BECOME_WEBSITE` folder
contents as-is. Nothing to compile.

Before going live, update the absolute URL in `index.html`:
`og:image`, `twitter:image` and the `url` in the JSON-LD block currently
point at `become.example`.

The contact form opens the visitor's email client (`mailto:`). To capture
submissions properly, point the form at Formspree/Basin/your own endpoint
in `js/sections.js` → `form()`.

Photography and footage are licensed stock (Pexels), stored locally in
`assets/` so the site has no runtime dependency on any CDN.
