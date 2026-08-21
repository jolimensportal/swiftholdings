# THE SWIFT PROJECT — Rich + Gated + Dashboard Preview Design

## Status
Approved via visual companion 2026-08-21 (questions Q1-Q8 locked). This supersedes `2026-08-15-swift-holdings-core-site-rebuild-design.md` and `2026-08-18-swift-project-phase2-design.md` for the marketing + portal scope. Prior docs remain historical.

## Goal
Make swiftholdings.pages.dev content-rich everywhere (even illustrations) while gated premium is *significantly known* to drive the briefing form, and preview the member dashboard that unlocks after. Product is now **THE SWIFT PROJECT** (full rebrand per Q1-A) with **capsule family** across **4 hubs** (no single Oyarifa lock). Until domain purchase tomorrow, canonical stays `https://swiftholdings.pages.dev`; no hardcoded `theswiftproject.com` redirects.

The site must:
- Feel premium, calm, diaspora-narrative — not bento-card catalogue
- Show rich public ledgers/capsule stories with “Illustrative/SIM” labels where simulated
- Tease gated value with blur + lock + counts on every premium table
- Preview the portal dashboard (GHS 51,400 etc) on marketing to answer “what’s beyond the gate?”
- Simulate where data must be simulated, with clear disclosure, until Drizzle live

## Approved Decisions

| Area | Decision | Rationale |
| --- | --- | --- |
| Brand | Q1-A Full rebrand: THE SWIFT PROJECT retires SWIFT HOLDINGS (legal + marketing). Footer © The Swift Project, emails info@theswiftproject.com (MX fallback swift-holdings.gh until cutover) | User override; clean product brand |
| Capsule | Q2-B Family: P7 38m² hero + Meridian 3-Bed 1,850 sqft / Savannah 4-Bed 2,400 / Lagoon Studio Court 24×480 / Keta Waterfront 1,200. Prices $20k–$75k, $50k anchor for P7. Specs: 9-layer wall, CIGS solar-ready, composite deck, cocoon chair, privacy slats | Keeps P7 trust + choice for brackets; portal catalog already has 4 variants |
| Hubs | Q3-B Redistribute 96: Greater Accra 48 / Ashanti (Kumasi) 24 / Western (Takoradi) 12 / Northern (Tamale) 12. `Oyarifa` → Accra Hub (Oyarifa) label. `/oyarifa` 301 → `/locations` soft via env, not hardcoded domain | Matches scaling deck nationwide + portal funded 26/96 (18/4/2/2) |
| Economics | Q4-A 70/30 firm, 5y lock, monthly GHS settlement, USD held. $50k entry → gross $3,485 (30d×$132×88%) → investor $2,440 (70%). Yield 9.4% (GHS 2,998 Q2), gross GHS 51,400, FX 14.7 | Aligns Investor Briefing + portal math; drop 80/20 legacy |
| IA | Q5-A Keep /locations drop /oyarifa: `/` , `/village`, `/how-it-works`, `/ownership`, `/protections`, `/locations`, `/partnership`, `/about`, `/briefing`, `/resources` | Zero breaking changes; locations page already built for 96 |
| Copy | Q6-B Diaspora narrative + dossier depth: each page 800–1200w, lead story + ledger + proof teaser + FAQ + CTA | Justifies $50k, matches “certainty, craft” |
| Gate | Q7-A Keep 5-step DiscoveryForm (Segment/Intent/Bracket/Contact+Password/Timezone+Slot) → POST /api/discovery → SESSION KV 7d → /members vault | Captures bracket for routing, enables portal login; mail fallback if PUBLIC_FORMSPREE_BRIEFING_ENDPOINT blank |
| Portal | Q8-B Live Drizzle: member+allocation+statements+documents from DB (currently simulated Ghana GHS 127,400, 26/96) | Unlocks /portfolio, /statements, /documents truth |

## Domain Softness
Keep `astro.config.mjs: site: 'https://swiftholdings.pages.dev'` canonical until purchase. New domain via `PUBLIC_SITE_URL` env; `_headers` and `_redirects` use relative redirects only. No 301 to theswiftproject.com committed until DNS verified. Header shows THE SWIFT PROJECT, not SWIFT HOLDINGS.

## Scope

### Phase 1: Marketing Rich + Gated Teasers + Dashboard Preview (this spec)
**Routes (all rich, 800–1200w + image + ledger + FAQ):**
1. Home `/` — Greater Accra hero, 3-door ecosystem (Guest/Member/Owner-Investor), market ledger (300k/2M/6-10%/33-44% vs 88%/$132 SIM), diaspora story, portal preview teaser
2. Village `/village` — P7 38m² gallery (deck/cocoon/slats), 5 amenities (pool/hot tub/fire pit/BBQ pavilion louvered/kids zone), engineering 4 pillars (climate/rapid deployment/acoustic/solar), capsule family cards
3. How It Works `/how-it-works` — 4 steps (Briefing → Dossier → JV 70/30 → Construction & Yield) + 5-phase detail (Land/Foundation/Delivery/Install/Revenue) — combined narrative
4. Ownership `/ownership` — 70/30 wedge, market intelligence 300k deficit, calculator $50k 88% → GHS 51,400/35,980, demand 6-10%, public ledger SIM + “Unlock full 5y 350%” lock
5. Protections `/protections` — 5y shield timeline, Ghanaian land law litigation-free, skin-in-the-game, insured CIGS
6. Locations `/locations` — 4 hub cards 48/24/12/12 + map + demand curve, blob counts SIM, “Live availability → briefing” teaser
7. Partnership `/partnership` — Ecosystem Fund vs P7 Acquisition 70/30 both paths
8. About `/about` — THE SWIFT PROJECT vision (ex-Swift Holdings), modular + hospitality + bridge, contact 20 Edmonton St +233 / +1-437
9. Briefing `/briefing` — 5-step gate, encrypted, 45-min slot
10. Resources `/resources` — vault teaser (3 docs 42p/38p/24p) blurred

**Vault (gated after briefing):** `/members`, `/members/documents/*`, gated API `SESSION` KV check. Public shows counts/types only.

### Phase 2: Portal Live (after Phase 1)
Wire Drizzle to portal: `/dashboard` (portfolio GHS 127,400 chart Feb–Jul), `/portfolio`, `/prefabs` (family filter), `/statements` (Q2 GHS 2,998), `/documents`, `/briefings`, `/dashboard/default` (overview GHS 51,400 etc) — all from DB, not static JSON.

## Information Architecture

**Header:** `The Village | How It Works | Ownership & Financials | Protections | Locations | Partnership | About | Resources | Request a briefing` — collapses to menu <1024px, persists THE SWIFT PROJECT left.

**Footer:** `SWIFT HOLDINGS` → `THE SWIFT PROJECT` (per Q1-A), links Vision/Asset/Locations/Partnership/Request Briefing, © 2026 The Swift Project.

**Gating pattern (reuse on /ownership, /locations, /resources, home):**
```
[Header] Full yield table  🔒 GATED — briefing unlocks
[Blurred rows 2–12]  (filter blur 3px, opacity 0.7)
[Button] Unlock full scenarios with a briefing →  → /briefing
[Meta] 3 docs · 1.2–4.8MB · Land titles included
```
**Dashboard preview (new section on / and /ownership):**
```
[Left] Screenshot of portal Ghana dashboard (GHS 51,400 + 88% + 26/96 + Kwame/ Esi Owusu table, rows 11–60 blurred + lock overlay, click → /briefing)
[Right] What unlocks: Portfolio chart, Statements 12mo, 5-doc vault, Allocation 70/30 donut
```

## Visual System
- **Palette:** Obsidian #1a252c / Champagne Bronze #8c7853 / Sand #f4efe6 / White (spec) → implemented as `swift-luxury` oklch 0.58/0.62 60 + `marketing-obsidian-900` etc. Keep.
- **Type:** Outfit + Manrope/Cormorant per MarketingLayout; tight tracking, editorial scale.
- **Images:** Source `~/Desktop/PREFAB` not committed; curated 12-role manifest via `scripts/prepare-marketing-images.mjs` + `validate-marketing-images.mjs`; derivatives in `src/assets/images/marketing` with explicit ratios (Hero 16:10 2400×1500, Story 3:2 1800×1200, Feature 4:3 1600×1200, Banner 21:9 2520×1080), visible “Illustrative reference” label, alt precise.
- **Simulated badge:** Small pill `SIMULATED · AirDNA/GSS-based` vs `GATED` pill — distinct colors (#fff3cd vs #e0f2fe).

## Component Architecture
- **Marketing (Astro):** `SiteHeader` (nav + theme toggle), `MarketingHero` (eyebrow/title/lead/dual CTA/image), `ImageFrame` (ratio/focal/alt/label), `MarketLedger` (eyebrow/title/body/items[] ledger-row), `StorySplit` (image reverse), `GatedTeaser` (new, blurred slot + lock), `PortalPreview` (new, image + bullets), `NumberedSteps` (How It Works), `ConfidenceList`, `DiscoveryForm.client.tsx` (5 steps), `SiteFooter`.
- **Portal (Next 16):** `MetricCards` (GHS 51,400 etc, Ghana), `RecentCustomersTable` (60 Ghana rows, Meridian etc), `PortfolioChart` (netWorthSeries Feb–Jul), `FundedUnitCard` (Plot 14 Meridian 40%), `MilestonesCard`, `StatementsTable`, `DocumentsTable` — all read from `data/portal.ts` now, Drizzle after Q8-B.
- **Data:** `src/data/marketing/*` (pages, site, image-assets), `src/content` (villages/capsules/hubs), `src/db` Drizzle + `SESSION` KV (`wrangler.jsonc`).

## Data Simulation vs Gated
| Location | Simulate (public rich) | Gate (premium after briefing) |
| --- | --- | --- |
| Market ledger | 300k/2M/6-10%/33-44% vs 88%/$132 + FX 14.7 — aggregated, SIM badge, source footnote | Full AirDNA/GSS tables, methodology, hub-month occupancy |
| Capsule specs | 38m² 9-layer + amenity list (5) — rich story | Factory certs, thermal/acoustic |
| Hub caps | 48/24/12/12 counts SIM, map | Live availability per hub/plot |
| Calculator | $50k → $3,485 gross → $2,440 (70%) teaser | 5y 350% per scenario, hub-month matrix |
| Portal | GHS 127,400 chart teaser, 2 statements | 12mo statements, allocation live, 5-doc vault |

All SIM values marked “Illustrative reference” + “SIMULATED” pill; hard numbers (titles, land 20 Edmonton St, phones) remain exact.

## API & Auth Flow
1. `DiscoveryForm` 5 steps client validation → POST `/api/discovery` `{segment, intent, bracket, name, email, phone, password, timezone, slotDate, slotTime}`
2. Server validates via `src/data/marketing/discovery.ts` (isValidName/Email/Phone/Password), writes Drizzle `member` (PBKDF2 hash), sets `SESSION` KV cookie 7d, returns `{ok, member}`.
3. Client shows “You are in” + `Download Partnership Summary` + `Go to your documents` → `/members`.
4. Gated routes (`/members/*`, portal `/portfolio` etc) check `SESSION` via `middleware.ts` (new) — redirect to `/briefing` if missing.
5. `PUBLIC_FORMSPREE_BRIEFING_ENDPOINT` fallback: if blank, show mailto, preserve values, no success sim.

## Error Handling & Accessibility
- Missing manifest source → `images:prepare` fails with filename/role.
- Missing derivative → fallback frame in dev, block prod build.
- Form network fail → preserve values, retry + mailto fallback, inline errors, focus first invalid, announce via aria-live.
- Every interactive (header, mobile menu, form, teasers, portal table) keyboard reachable, visible focus, semantic labels, alt precise, never “completed Swift home” for reference.

## Quality Gates (before push)
1. `pnpm check` 0 errors, `pnpm build` success on Node 22
2. 10 routes render 1440/1024/390 no overflow: /, /village, /how-it-works, /ownership, /protections, /locations, /partnership, /about, /briefing, /resources
3. Header/mobile/primary CTA work per route
4. Every image ratio correct, no stretch, Illustrative label where SIM
5. Gated teasers show blur+lock+count, dashboard preview image blurred rows 11–60 + lock
6. Portal Ghana dashboard + table show Meridian etc, no “Studio Admin” strings
7. Domain still `swiftholdings.pages.dev` canonical; no hardcoded theswiftproject.com 301
8. Form validation/success/failure/retry/mailto + KV gate work

## Tests
- Vitest: briefing validation, request-state, manifest crop, hub caps 48/24/12/12
- Smoke: 10 routes desktop/mobile, keyboard, form states, gate redirect
- Run `pnpm test && pnpm check && pnpm build` before push

## Out of Scope
- Legal entity dissolution beyond footer/copy (contracts handled outside code until domain bought)
- Container/Alibaba/China prefab sets (supplier catalogue feel)
- Custom backend beyond `/api/discovery` + Drizzle + KV
- Changing caps beyond 48/24/12/12 without land confirmation

