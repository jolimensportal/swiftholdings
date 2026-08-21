# Member Portal — Design Spec

**Date:** 2026-08-21
**Status:** Approved (design confirmed in brainstorming)
**Goal:** Build the full member portal as an MVP for an investor demo. All screens use simulated data and match the approved visual mockups exactly. Deployable to `swiftholdingsportal.securemensah.workers.dev`.

## Context

The Swift Project member portal gives owners/investors a private view of their prefab capsules: portfolio performance, a marketplace for abandoned/expiring units, tenant activity, sealed documents, and recorded briefings. The approved mockups (session `20342-1787064884`) lock the visual design. This spec turns those mockups into a buildable plan. Because the demo is imminent, we build everything with simulated data (no backend/auth) and deploy to the Cloudflare Worker so the investor can click through the live site.

## Goals

- Deliver all 7 member screens with a consistent shell, matching the approved mockups.
- Use simulated, realistic Ghana-flavoured data.
- Deploy to the worker for the investor demo.
- Keep code inside the Studio Admin conventions (co-located components, Server Components by default, semantic theme tokens, `swift-luxury.css` preset).

## Non-goals (this iteration)

- No real authentication / session / encrypted login backend.
- No real payment rails (card / wire / Paystack / escrow).
- No live data source — all data is fixture-based.
- No write operations that persist (bids, block-offs, profile edits are local/visual only).

## Build approach

Static mock-driven build (Approach 1). All screens are Next.js Server Components reading from a local fixtures module, except the marketplace bid box which is a Client Component with local-state simulation.

## Shared shell

- Sidebar: `THE SWIFT PROJECT` wordmark (serif + gold accent), a Ghanaian / Diaspora / Institutional segmented control (visual only, defaults to Diaspora), and nav items: Dashboard, Portfolio, Marketplace, Tenants, Documents, Briefings, Profile, Log out.
- Dark theme via the `swift-luxury.css` preset + semantic tokens; gold accent `#D6AC7A`, slate base `#14141a`, off-white `#EDE7DC`.
- Sidebar nav wired through `src/navigation/sidebar/sidebar-items.ts`.

## Screens & routes

| Route | Screen | Key content |
|-------|--------|-------------|
| `/dashboard/default` | Dashboard | Greeting "Good evening, Kofi"; portfolio value $187,400 (2 capsules Oyarifa + Tamale, 70/30); revenue ledger (Jul/Jun/Aug gross + your share + status); Oyarifa image card (88% occupancy, $132 ADR); footer "Next — Briefing with A. Mensah · Thu 20 Aug · 09:00 GMT · join". |
| `/portfolio` | Portfolio | "02 units · both in revenue"; hero card P7-012 Oyarifa (image, "Your first capsule", owned Mar 2026, 70/30, fully tenanted, In revenue); right column 90-day performance $6,140, gross $2,310/mo, your share $1,617/mo, occupancy 88%, block-off 18–22 Dec + reserve; second row P7-018 Tamale $52,400 phase 2/5; footer acquire new capsule $50,000 entry, 20% escrow. |
| `/marketplace` | Marketplace | "Oyarifa · Accra · 02/06 listings open"; featured bid P7-014 (image, "A capsule, returned to the fold", 38m² solar-ready, abandoned plan, bidding closes Sat); countdown 04d:11h:32m; current bid $48,200; reserve $46,000 met; 7 bids (you $48,200, A. Mensah $47,900, E. Boateng $47,400); bid input $48,450 min increment $250 escrow-verified; "Confirm bid — escrow-secured"; transfer P7-022 Tamale $52,000 buy-now; expiring P7-031 Kumasi $47,500. |
| `/tenants` | Tenants | "04 stays this month · 88% occupancy"; current stay Amma Owusu $165/night (night 3/5 P7-012); upcoming (E. Boateng 24–29 Aug $132, Family 3–10 Sept $118, J. Mettle 15–20 Sept $132); this-month stats (27/31 nights, 65% experiential, 11-day avg window). |
| `/documents` | Documents | "Sealed under Ghanaian law"; your files (purchase & installation agreement, 70/30 operating agreement, land lease & title memorandum, insurance certificate, blueprint set rev B, quarterly revenue statement); project library (partnership summary 42p, investor summary 38p, institutional modular hospitality whitepaper). |
| `/briefings` | Briefings | "Shown in GMT"; upcoming 20 Aug partnership briefing with A. Mensah 09:00 GMT 45min encrypted; past (Discovery 4 Aug 42min, Locations 28 Jul 31min); "every briefing recorded, summarised, filed to Documents". |
| `/profile` | Profile | "Identity verified · KYC complete"; Kofi Owusu, Diaspora Toronto→Accra; payouts (USD held / GHS settled monthly, bank •••• 4412 Toronto, English); security (2FA active, E2E session, phone +1 437 421 0963, email k.owusu@email.com). |

## Open decisions (approved defaults)

- **A. Login gateway:** include as a *static visual screen* (no real auth) so the investor sees the full narrative login → dashboard.
- **B. Interactivity:** marketplace bid box updates local state only; everything else static.
- **C. Images:** reuse live `swiftholdings.pages.dev` assets already referenced in the mockups.

## Data

- Single fixtures module `src/data/member-portal.ts` (or co-located per route) holding: capsules (Oyarifa, Tamale), bids (7-entry list + current/reserve), tenants (current + upcoming + monthly stats), documents (your files + library), briefings (upcoming + past), profile (Kofi Owusu), revenue ledger (Jul/Jun/Aug).
- Realistic Ghana figures; types defined locally, no `any`.

## Implementation notes

- Keep `page.tsx` as Server Component; move bid interactivity into a dedicated Client Component under `_components/`.
- Add screens to `sidebar-items.ts`.
- Use existing shadcn/ui components and semantic tokens; do not modify `src/components/ui/`.
- Handle loading/empty/error states where lists could be empty.

## Verification

- `npm run build` and `npm run lint` pass.
- Deploy to `swiftholdingsportal.securemensah.workers.dev` and click through all 7 screens.
- Screenshots of dashboard (mobile + dark) per AGENTS.md contribution rules.

## Next steps

1. Write implementation plan (writing-plans).
2. Build shared shell + fixtures.
3. Build screens in order: Dashboard → Portfolio → Marketplace → Tenants → Documents → Briefings → Profile → (static login gateway).
4. Deploy and verify.
