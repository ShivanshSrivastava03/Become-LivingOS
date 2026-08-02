# Become. — Website

The official site for **Become.** — a static, dependency-free build.
No Node, no npm, no build step. **Double-click `index.html` and it runs.**

---

## What you need to give me / fill in

Two things are deliberately left as marked placeholders. Nothing fake is
published — anything still unfilled renders on the page with a visible
`TO BE PROVIDED` tag so it can never ship by accident.

### 1. Contact details → `js/data.js` (top of file)

```js
var contact = {
  email:   { value: "hello@become.example",        pending: true },
  phone:   { value: "+00 00000 00000",             pending: true },
  address: { value: "Studio address, City, Country", pending: true },
  hours:   { value: "Mon–Fri, 10:00–19:00",        pending: true },
  socials: [
    { label: "LinkedIn",  href: "#", pending: true },
    ...
  ]
};
```

Replace `value` / `href`, then **set `pending: false`**. That one flag
removes the placeholder tag and turns email/phone into working
`mailto:` / `tel:` links.

### 2. Selected Work → `js/data.js` (`var work`)

The six case studies describe the *shape* of the work. They name no
clients and claim no statistics — but they are placeholders. Replace
them with real engagements and real imagery before launch.

---

## Optional: background video

The hero and the closing CTA already have `<video>` layers wired up,
sitting behind a still image. Drop a file in and it takes over
automatically — no code change:

```
assets/video/hero.mp4      → hero background
assets/video/finale.mp4    → closing CTA background
```

If the file is absent the still image stays and nothing breaks. Use a
short, quiet, dark loop (8–15s, ~1080p, under ~4 MB) so it does not cost
the first paint.

---

## Structure

```
BECOME_WEBSITE/
  index.html            the whole page
  css/
    tokens.css          colour, type scale, spacing, motion — edit here first
    base.css            reset, typography, buttons, motion primitives
    chrome.css          boot screen, cursor, nav, menu, footer
    sections-a.css      hero · ticker · manifesto · convergence · solutions · AI
    sections-b.css      products · work · industries · tech · why · process · contact · CTA
    demos.css           the AI interface simulations
  js/
    data.js             ← ALL COPY LIVES HERE
    motion.js           scroll engine, reveals, cursor, magnetics, marquee
    demos.js            AI console panels + capability visuals (drawn, not screenshots)
    sections.js         renders each section from data.js and wires behaviour
    main.js             boot, nav, menu, anchors, deep links, video
  assets/
    Become..png         the logo
    img/                36 images
    video/              empty — drop hero.mp4 / finale.mp4 here
```

**To change wording, edit `js/data.js`.** Nothing else needs touching.
**To change the look, start with `css/tokens.css`** — the whole site is
driven from those variables (one accent colour, one type scale, one
radius system).

---

## The page

| # | Section | Notes |
|---|---------|-------|
| — | Boot | Typographic load screen, ~1s, skipped under reduced motion |
| 01 | Hero | Full viewport. `Become` + a transformation word that morphs per-character. Generative ember particle field on canvas, reacting to the pointer |
| — | Ticker | Two counter-scrolling marquees, nudged by scroll velocity |
| 02 | Manifesto | Editorial spread on warm white; the statement lights up word by word as you scroll |
| 03 | Convergence | 4-screen pinned sequence — twelve words scatter, then collapse into **Become.** |
| 04 | Solutions | Numbered index + sticky media stage, auto-advancing, accordion on mobile |
| 05 | Artificial Intelligence | A working demo console (5 tabs: assistant, vision, voice, documents, forecast) + 9 capability cards with live micro-interfaces. All drawn in CSS/SVG |
| 06 | Products | Become LivingOS in a laptop + phone frame, running a real HTML dashboard. Then the OS constellation (RetailOS / SchoolOS / ClinicOS / RestaurantOS) |
| 07 | Selected Work | Drag-and-scroll carousel |
| 08 | Industries | Parallax mosaic, six environments |
| 09 | Technology | Kinetic marquee, monochrome, ember on hover |
| 10 | Why Become | Think / Build / Scale as stacking chapter cards |
| 11 | Process | Scroll-driven timeline |
| 12 | Contact | Placeholder details + validated form |
| 13 | Finale | **Become what is next.** |

---

## Built-in behaviour

- **Smooth scroll** — custom easing on desktop pointers only; native on
  touch; off entirely under reduced motion.
- **Reduced motion** — `prefers-reduced-motion` strips every animation
  and keeps the full design. Verified.
- **Keyboard** — skip link, visible focus rings, arrow-key tabs and
  carousel, focus trap in the mobile menu, Escape to close.
- **Deep links** — `?#ai`, `#products` etc. land instantly and correctly
  even though sections are rendered by script.
- **Failure isolation** — every init step is sandboxed; if one feature
  throws, the rest of the page still works and the page still appears.
- **Off-screen work is paused** — canvas, marquees, video and the live
  dashboard stop when not visible, and when the tab is hidden.

---

## Verified

Checked in headless Chrome 151 at **1440×900, 820×1180 and 390×844**:

- 36/36 images load, 0 failures
- No horizontal overflow at any width
- No init errors
- Every section renders (7 solutions, 9 AI cards, 6 case studies,
  6 industries, 5 process steps, 3 chapters, 4 products, 5 demo tabs,
  12 convergence words)

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
