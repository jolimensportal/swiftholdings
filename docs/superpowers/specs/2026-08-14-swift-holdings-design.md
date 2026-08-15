# Swift Holdings — Prefab Village Site (Design Spec)

## Goal

A premium, Awwwards-grade **multi-page** site that pitches Swift Holdings'
Prefab Village (Oyarifa, Accra) to diaspora real-estate investors. Primary
conversion path: a lead/prospectus form plus a newsletter capture.

## Key decisions

- **Base:** the **DataNova** template
  (Astro 7 + Tailwind CSS v4 + Preline UI + Keystatic CMS + Drizzle ORM + Turso).
  Chosen to honour the "maintain DataNova" instruction and because Astro gives
  true multi-page output with fast builds. A Next.js rebuild was considered and
  dropped.
- **Visual direction:** the **Vaulk** (`vaulk.com/en-GB`) "engineering blueprint"
  craft — corner-bracket frame, a technical schematic/plan as the hero visual,
  monochrome slate, per-word load + scroll reveal. Explicitly avoids the
  dark + gold + serif "AI slop" rejected earlier.
- **Structure:** 7 pages — Home, The Model, Investment, Market Insights, About,
  Investor Protections / FAQ, Contact.
- **Conversion:** `ContactForm` → `/api/contact`, newsletter `FooterForm` →
  `/api/newsletter` (both endpoints ship with DataNova).

## Stack / environment

- Node 22 (via nvm), pnpm 10.33.3. `pnpm install` then `pnpm dev` →
  `http://127.0.0.1:4321/` (cold start ~30–50s).
- Added **Lenis** for smooth scroll; scroll-reveal via `IntersectionObserver`
  (`.reveal` / `.reveal-ready`, armed only when JS runs so no-JS and
  reduced-motion users see all content).

## Design system

- Fonts: **DM Sans** (headings), **Work Sans** (body) — inherited from DataNova.
- Palette: off-white background, `slate-900` text, thin rules, mono uppercase
  labels. Deliberately monochrome; a warm accent (terracotta/clay) is a future
  option, not yet applied.
- Utilities added in `global.css`: `blueprint-grid`, `hero-word`, `rule-thin`,
  and the `.reveal` / `.reveal-ready` scroll-reveal pair.

## Components

- `HeroSection` + `HeroContent` (oversized per-word headline) + `VillagePlan`
  (inline SVG site plan of the village).
- Sections: `SwiftStats`, `TheModelSection`, `InvestmentSection` (+ `CapsuleArt`
  blueprint elevation), `InsightsSection`, `ProtectionsSection` (Preline FAQ
  accordion), `LeadCTA`, `PageHeader`.
- `Navbar` and `Footer` rebranded to Swift Holdings with real contacts and a
  private-placement risk disclaimer.

## Content (from the proposal PDF)

- Location: Oyarifa, Accra. Audience: African diaspora investors.
- Fractional ownership from **$100/share**; ADR **$100–$132**; occupancy
  **33–44%** (ramping); target yield **6–10%** net; profit share **80 / 20**
  (investor / operator).
- Contacts: `info@swiftholdings.org`, `+233 544 101016`, `+1 437 421 0963`,
  `20 Edmonton St, Madina, Accra`.
- All figures are marked **indicative** with a risk disclaimer; not a regulated
  securities offering in every jurisdiction.

## Open items

1. Real photography / AI-generated capsule renders (assets pending — only vector
   blueprint art exists so far; `<img>` slots ready to wire).
2. Final content-accuracy review against the source PDF before going public.
3. Deploy (DataNova targets Vercel).
