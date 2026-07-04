# PROJECT_BRIEF.md — IGNITO Techfest Website

> **Read this entire file before writing or changing any code.** This is the single source of truth for scope and design decisions on this project — not the chat history, not memory of an earlier conversation. If a decision here turns out to be wrong or changes mid-build, **update this file in the same pass as the code change**, and log it in the Changelog (§11). A stale brief is worse than no brief.

---

## 1. Project Snapshot

| | |
|---|---|
| Name | IGNITO |
| Type | Techfest website — frontend only, dummy content |
| Theme | Space — specifically a **"Mission Control / Ignition"** identity, not generic stars-on-black |
| Stack | Vite + React + Tailwind CSS v4 |
| Package manager | npm |
| Status | Not yet scaffolded — Phase 0 |

---

## 2. Operating Rules (apply to every session, human or AI)

1. Read this file in full before starting work.
2. **Colors are configurable — see §6.** Never hardcode a hex value or an arbitrary one-off Tailwind color (e.g. `bg-[#123456]`) inside a component. Always reference a named token.
3. **Don't generate assets — ask instead.** See Asset Policy (§7). No AI-generated images, no hand-crafted complex illustrations, no scouring the web for "the perfect" photo. Use a labeled placeholder and ask the user for the real thing if one is needed.
4. Work in small units — one component or section per task, not "build the whole site" in one pass. Each unit should be run and visually checked before moving to the next.
5. If you hit a scope decision this file doesn't cover (new section, new library, structural change, routing approach), **update this file to record the decision** rather than silently deciding and moving on.
6. Don't let this file drift from the code. If §6, §7, or §9 stop matching reality, fix the file before adding more features on top.

---

## 3. Tech Stack & Setup

- **Vite** + **React** (JS, not TypeScript, unless you decide otherwise — update §1 if you switch)
- **Tailwind CSS v4**, via the official `@tailwindcss/vite` plugin — CSS-first config, no `tailwind.config.js` needed
- **framer-motion** — scroll reveals, hover states, transitions
- **lucide-react** — icon set (`Rocket`, `Satellite`, `Orbit`, `Telescope`, `Radar`, `Cpu`, `Bot` all exist and are on-theme)
- Single-page site with anchor-linked sections by default (see Open Decisions §10 — revisit if event/competition detail pages are wanted, which would call for `react-router-dom`)

**Scaffold commands:**
```bash
npm create vite@latest ignito -- --template react
cd ignito
npm install
npm install tailwindcss @tailwindcss/vite
npm install framer-motion lucide-react
```

**`vite.config.js`:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**`src/main.jsx`** must import the theme stylesheet (see §6) as its first import so Vite picks up the CSS.

---

## 4. Concept & Identity

IGNITO literally means *ignition* — the identity leans into a **launch / mission-control** framing rather than generic "space":

- Events → **missions**, Schedule → **flight plan**, Organizers → **Mission Control**
- Warm ignition-orange CTAs against a cool violet/cyan starfield — that contrast is the visual signature
- Loading state = an ignition countdown ("T-minus 3…2…1… liftoff"), not a generic spinner
- Hero includes a live countdown timer to the fest start date

**Typography:** display font `Space Grotesk` (headings), body font `Inter`. Load via Google Fonts `<link>` in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Motion:** starfield background (canvas or CSS, not an image — see §7), scroll-reveal via `whileInView`, card hover tilt + glow, all wrapped to respect `prefers-reduced-motion`.

---

## 5. Site Map

Required by the brief: **Home, Events, Competitions, Contact.**

| Section | Priority | Notes |
|---|---|---|
| Navbar | Required | Sticky, glassmorphism, mobile slide-in menu |
| Home / Hero | Required | Countdown timer, two CTAs, scroll indicator |
| About | Recommended | 2–3 lines + animated stat counters |
| Events | Required | Filterable cards, dummy data from `data/events.json` |
| Competitions | Required | Cards with prize/team-size/difficulty, dummy data from `data/competitions.json` |
| Schedule | Optional | Day-tabs + vertical timeline |
| Speakers/Team | Optional | Card grid |
| Gallery | Optional | Only if real or placeholder images are approved — see §7 |
| Sponsors | Optional | Logo strip |
| FAQ | Optional | Accordion |
| Contact | Required | Form UI, optionally wired to EmailJS/Formspree |
| Footer | Required | Links, socials, copyright |

If time is short, cut from the bottom of this table up — never cut polish on the required rows to fit in optional ones.

---

## 6. Design Tokens — Colors Are Configurable

**All colors live in exactly one place: `src/styles/theme.css`**, defined with Tailwind v4's `@theme` directive. This is the *only* file to edit to re-theme the site. Every component must reference a named token (`bg-space-bg`, `text-nebula-violet`, `border-space-border`, …) — never a raw hex code or an arbitrary bracket value.

```css
/* src/styles/theme.css */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-space-bg: #05050F;
  --color-space-surface: #0B0B1E;
  --color-space-border: #1E1E3F;

  /* Accents */
  --color-nebula-violet: #8B5CF6;
  --color-nebula-blue: #22D3EE;
  --color-ignition-flame: #FB923C;

  /* Text */
  --color-text-primary: #F8FAFC;
  --color-text-muted: #94A3B8;

  /* Fonts */
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

This automatically generates utility classes — `bg-space-bg`, `text-nebula-violet`, `border-ignition-flame`, `font-display`, etc. — with no extra config step.

**To re-theme the entire site:** change the hex values in this block only. Because nothing else hardcodes a color, every component updates automatically.

> Fallback note: if the project ends up on Tailwind v3 for any reason, replicate this by defining the same variable names under `:root` in `index.css` and mapping them into `theme.extend.colors` in `tailwind.config.js`. The v4 `@theme` approach above is the default plan — only switch if you hit a specific v4 compatibility blocker, and if you do, update this section.

---

## 7. Asset Policy — Ask, Don't Generate

- **Do not** spend time generating AI images, hand-crafting complex illustrations, or hunting for "the perfect" stock photo before checking whether it's actually needed.
- For anything that needs a real photo or illustration (hero background art, gallery photos, sponsor logos, speaker headshots): use a clearly labeled placeholder — a `div` with a dashed border and a text label like `[SPEAKER PHOTO]`, or a neutral placeholder service like `https://placehold.co/` — and then **ask the user directly** for the real asset or a description of what they want. Don't fabricate one and move on silently.
- Icons are the exception: use `lucide-react` freely. No asset request needed.
- Backgrounds/effects (starfield, glows, gradients) are built with CSS/canvas/SVG shapes, not image files.
- Once real assets are supplied, they go in `public/images/`.

---

## 8. Folder Structure

```
src/
  main.jsx
  App.jsx
  styles/
    theme.css          <- ALL color tokens (§6). Nowhere else.
  components/
    layout/
      Navbar.jsx
      Footer.jsx
    sections/
      Hero.jsx
      About.jsx
      Events.jsx
      Competitions.jsx
      Schedule.jsx
      Contact.jsx
    ui/
      Button.jsx
      Card.jsx
      SectionHeading.jsx
      CountdownTimer.jsx
      StarfieldBackground.jsx
      Badge.jsx
  data/
    events.json
    competitions.json
    schedule.json
  hooks/
    useCountdown.js
  lib/
    utils.js
public/
  images/               <- real assets land here once supplied (§7)
```

---

## 9. Coding Conventions

- Functional components, named exports
- Styling: Tailwind utility classes only — no inline `style={}`, no CSS-in-JS
- No hardcoded colors anywhere outside `theme.css` (§6)
- Motion via `framer-motion`; wrap non-essential animation so it's disabled under `prefers-reduced-motion`
- Dummy content lives in `data/*.json`; components map over it — don't hardcode dummy event/competition text inline in JSX
- Data schema:
  - `events.json` entries: `{ id, title, category, description, date, time, venue, icon }` (icon = a `lucide-react` icon name)
  - `competitions.json` entries: `{ id, title, category, description, prize, teamSize, difficulty, deadline, icon }`

---

## 10. Open Decisions / Assumptions

Track anything assumed rather than explicitly confirmed, so it's visible and easy to revisit.

| Decision | Current assumption | Status |
|---|---|---|
| Single-page vs multi-page | Single-page, anchor-linked sections | Assumed — revisit if event/competition detail pages are wanted |
| Contact form backend | UI only, no real submission | Assumed — mention if you want EmailJS/Formspree wired up |
| Optional sections included | None yet beyond required 4 + About | Update as you decide which optional sections to build |
| TypeScript vs JS | Plain JS | Assumed for simplicity — switch if preferred |

---

## 11. Changelog

Log every time this brief changes and why — this is what keeps it trustworthy as the source of truth.

| Date | Change |
|---|---|
| 2026-07-04 | Initial brief created: Vite + React + Tailwind v4, configurable color tokens via `@theme`, asset policy (ask, don't generate), living-brief workflow rules established. |
| 2026-07-04 | **Phase 0–6 build started.** Scaffolding decision: Vite CLI could not run non-interactively in existing directory — project files created manually matching the `react` template output. Stack confirmed: Vite 6.4.3, React 19.1, Tailwind CSS v4.3.2 (`@tailwindcss/vite`), framer-motion 12.42.2, lucide-react 1.23.0. |
| 2026-07-04 | Fest date placeholder set to **2027-01-15** in `CountdownTimer.jsx` — update when real date confirmed. |
| 2026-07-04 | Optional sections (Schedule, Speakers, Gallery, Sponsors, FAQ) deferred; built Required + About sections per brief priority table. |
| 2026-07-04 | `Github` icon not exported by lucide-react v1.23 — replaced with `GitBranch` in Footer socials. |

---

## 12. Definition of Done (per section)

A section isn't "done" until:
- [ ] Built from tokens in §6 only — zero hardcoded colors
- [ ] Responsive at 375px / 768px / 1024px / 1440px, no horizontal scroll
- [ ] Any animation respects `prefers-reduced-motion`
- [ ] Dummy content pulled from `data/*.json`, not hardcoded in JSX
- [ ] No placeholder asset shipped without a corresponding ask to the user (§7)
- [ ] No console errors/warnings
