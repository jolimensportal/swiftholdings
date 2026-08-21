# THE SWIFT PROJECT — Copy Constitution & Homepage Rewrite

**Date:** 2026-08-21
**Status:** Approved by user (visual brainstorm review)
**Scope type:** Copy-only. Zero layout, design, or route changes.
**Companion visual:** `.superpowers/brainstorm/81527-1787311548/content/homepage-copy-v1.html`

---

## 1. Summary

Rewrite all public marketing copy on swiftholdings.pages.dev under the new master brand **THE SWIFT PROJECT**, homepage-first. The homepage copy is LOCKED (approved via visual review). Internal pages follow in a second pass using the same constitution. Swift Holdings is reduced to a single discreet legal footer line. All factual contradictions (hub counts, taxonomy jargon, engineering leaks) are corrected in the same pass.

## 2. Goals

1. Rebrand every visible surface to **THE SWIFT PROJECT**; "Swift Holdings" appears exactly once per page — footer legal line: *"Operated by Swift Holdings."*
2. Homepage rewritten to the approved persuasion spine targeting the diaspora owner-investor avatar.
3. Canonical hub network framing everywhere: **four hubs** (Oyarifa·Accra flagship / Kumasi·Ashanti / Tamale·Northern / Takoradi·Western), capsules **48/24/12/12 = 96 total**. No Oyarifa-only framing anywhere ("Oyarifa first", "we start in Oyarifa" — banned).
4. Remove all jargon and engineering leaks from customer-facing copy.
5. Extend `no-forbidden-strings.test.ts` so regressions can't re-enter.

## 3. Non-Goals

- No visual/layout redesign of any section (user explicitly confirmed hero stays as-is).
- No new pages or routes; no nav restructuring beyond label consistency already present.
- No Next.js portal changes (separate app).
- No domain/DNS migration now — user will add TheSwiftProject.com later. Keep existing email addresses (`info@swiftholdings.org`, `partnerships@swiftholdings-ghana.com`) until mailboxes exist; only display branding changes.
- No Formspree/backend changes; existing form behavior preserved.
- No pricing/SIM figures added or removed beyond what's already public — reframing only.

## 4. Voice Law (applies to every string)

**Aman × Apple × Stripe × Ghanaian-diaspora insight.** Spine: *Clarity before confidence.*

- Never ask the reader to trust an adjective when a fact will do.
- Persuasion order: YOU → problem → desired future → mechanism → product → economics → proof → protection → people → action.
- Emotion peaks twice only: Section 02 proposition close and Section 10 diaspora passage.
- Fear language (construction nightmare) lives inside Section 01 as ammunition, never as page posture.

### Banned strings (customer-facing — add to forbidden-strings test)

| Banned | Why |
|---|---|
| `membership ecosystem`, `member gate`, `GATED` | internal jargon |
| `absolute certainty` | overclaim |
| `recorded briefing` | leaks internal process |
| `unlock wealth`, guaranteed-return phrasing | compliance risk |
| `PBKDF2`, `POST /api/discovery`, `Drizzle`, `honeypot`, `rate-limit`, `session` (in marketing data) | engineering notes leaked into copy |
| `securemensah.workers.dev` | staging URL in public copy |
| `Swift Holdings` outside the legal line | brand rule (test: count occurrences per page ≤ 1) |
| `Oyarifa first`, `we start in Oyarifa` | contradicts four-hub mandate |

Keep existing bans: `80/20`, `Hamilton`, `#2A1C46`. Keep existing requirements: `70`, `$50,000` must appear somewhere in pages data (verify placement survives rewrite).

## 5. Canonical Facts (single source of truth)

- Hubs: OYARIFA · ACCRA (flagship village) · KUMASI · ASHANTI · TAMALE · NORTHERN · TAKORADI · WESTERN
- Capsules per hub: 48 / 24 / 12 / 12 — total 96
- P7 Capsule: 38 m², nine-layer wall system, full-height glazing, private composite deck, solar-ready roof, integrated services, turnkey furnishing
- Market context: Ghana short-let occupancy ≈ 33–44%. The 88% target figure is REMOVED from the public homepage (returns to /ownership later only with a defensible bridge).
- Entry anchor: from $50,000 (unchanged).

## 6. Locked Homepage Copy

Locked = headlines, leads, structure, and every line below. Implementation may expand section bodies (see §8) but may not alter these lines without user sign-off.

### HERO
- Eyebrow: `THE SWIFT PROJECT · GHANA`
- H1: `Own your place in Ghana. Let it work while you're away.`
- Sub: `Fully finished modular residences inside professionally managed hospitality villages. Yours when you're home. Productive when you're not.`
- CTAs: `Request a private briefing` / `See how ownership works`
- Micro: `A guided conversation, not a public sales funnel.`

### 01 · THE PROBLEM
- Kicker: `Owning back home shouldn't become a second job`
- H2: `You wanted a place in Ghana. Not another construction project to manage from abroad.`
- Body: `The land. The contractor. The materials. The delays. The revised material list that arrives after you've paid. The calls across time zones. The trip home just to check what is going on.` + `For too many of us abroad, the dream became a remote job with no salary.`
- Turn: `We built The Swift Project around a different question: what if you could own the finished place — without personally managing everything it takes to build and run it?`

### 02 · THE PROPOSITION
- H2: `Yours when you're home. Productive when you're not.`
- Col A `When you're in Ghana`: `Come home to your own fully furnished residence. Reserve your dates — December, family weeks, remote-work months. Your clothes stay in the wardrobe. Your things stay where you left them.`
- Col B `When you're away`: `Your residence joins the village's managed hospitality operation. Guests, pricing, housekeeping, maintenance — handled by our on-ground team.`
- Close: `You don't have to choose between a place for yourself and an asset that works. It does both.`

### 03 · THE RESIDENCE
- Kicker: `The P7 Capsule`
- H2: `Thirty-eight square metres, considered down to the last one.`
- Body: `Full-height glazing that opens the room to the trees. Warm timber inside. A private deck for morning coffee. Engineered as a complete product — structure, insulation, services, furniture — finished before it ever reaches your plot.`
- Chips: Full-height glazing · Private composite deck · Nine-layer wall system · Solar-ready roof · Integrated services · Turnkey furnishing

### 04 · THE VILLAGE
- H2: `Your residence is private. The life around it is shared.`
- Body: `A pool for slow afternoons. Fire-side evenings in December. Long tables under the pavilion. Children in the shallows while you finish your coffee. Places to be alone; places to host everyone you love.`
- Close: `Not a row of prefabs. A village.`

### 05 · WHY MODULAR
- H2: `Most of the building happens before the building arrives.`
- Ledger: 1 Cost control — Factory production removes the site surprises that inflate budgets. / 2 Parallel timelines — Site preparation and home construction happen at once, not in sequence. / 3 Repeatable quality — Every capsule built to the same standard, by the same team, with the same checks. / 4 Faster to first stay — Months, not years, between decision and your first night home.

### 06 · THE OPERATING LAYER
- H2: `You own the asset. We run the experience around it.`
- Lead: `While you're away, the village operates as a hospitality business — and your residence is part of it.`
- Ledger: Distribution & booking / Dynamic pricing / Guest operations / Housekeeping & maintenance / Owner portal (one-line explanations as in visual)
- Close: `So ownership never becomes another full-time job.`

### 07 · CLARITY BEFORE CONFIDENCE
- H2: `Don't take our word for it.`
- Lead: `Before you decide anything, you'll understand:` Checklist: what you acquire + rights / operator vs yours / revenue & costs line by line / assumptions behind projections / exit path.
- Close: `Clarity first. Decision second.`

### 08 · THE NUMBERS
- H2: `We'd rather show you the assumptions than sell you the outcome.`
- Body: `Ghana's short-let market runs at roughly 33–44% occupancy. Our model is built on documented assumptions — base case, stronger case, downside case — that you'll examine line by line in your briefing.` + `No headline ROI theatre. No promises we can't defend.`

### 09 · ONE STANDARD, FOUR HUBS
- H2: `One standard. Four hubs.`
- Lead: `The Swift Project is a national network of hospitality villages, built to one standard. Four hubs anchor the map:`
- Rows: OYARIFA · ACCRA — Flagship village — Where the network begins / KUMASI · ASHANTI — Hub two / TAMALE · NORTHERN — Hub three / TAKORADI · WESTERN — Hub four
- Close: `Same capsule. Same share. Same standard. Wherever you land.`

### 10 · BETWEEN TWO PLACES
- Kicker: `For those who live between two places`
- H2: `Maybe home doesn't have to mean choosing one country over another.`
- Body: `A key that is yours. A room that remembers you. Your children growing up with somewhere in Ghana that is theirs — not a hotel, not a relative's spare room.` + `December means something again.`
- Close: `"We're going home." And meaning it.`

### 11 · THREE WAYS IN
- H2: `Stay. Own. Partner.`
- Stay — Book a visit. Feel the village before you decide anything. / Own — Explore ownership — the residence, the operation, the numbers. / Partner — Bring land, capital, or operations. Build a hub with us.

### FINAL CTA
- H2: `You don't need to decide today. You need enough information to decide well.`
- Body: `No checkout. No countdown timer. No pressure on the call. Just a structured conversation about whether this fits the life you're building.`
- CTA: `Request a private briefing`
- Legal micro: `The Swift Project · Operated by Swift Holdings`

## 7. Site-Wide Migration (this pass)

1. `site.ts`: name → `THE SWIFT PROJECT`; keep `legalName: 'Swift Holdings'` but render ONLY as footer legal line "Operated by Swift Holdings"; emails unchanged (§3); remove staging URL from any public string.
2. Footer © on all pages: `© 2026 The Swift Project. Operated by Swift Holdings.`
3. 404 page: drop "current Swift Holdings site" phrasing → brand-neutral line.
4. About lead: rewrite opening so it no longer says "Swift Holdings builds, operates…" (full About rewrite lands in pass 2; this pass only removes the wrong name and Oyarifa-only framing).
5. `locations.ts`: counts → 48/24/12/12; each hub card framed within the four-hub network.
6. Tier labels where visible near top of pages: Guest→Stay, Member→village life, Owner-Investor→Own (full rework in pass 2; this pass fixes top-of-page jargon instances like "GATED").

## 8. Test Implications (must-pass)

- `pages-rich.test.ts`: every section body >800 chars. Several locked sections are intentionally short. Rule: **expand bodies with mechanism/fact detail in the same voice — never adjectives, never new claims.** Headlines/leads stay verbatim.
- `no-forbidden-strings.test.ts`: add §4 banned list; verify required strings `70` and `$50,000` still present post-rewrite.
- `astro check` + full vitest suite green before commit.

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Body expansion dilutes voice | Expansion adds mechanism/facts only; self-review against Voice Law before commit |
| `Swift Holdings` sneaks back via components | Forbidden-strings test enforces ≤1 occurrence/page (legal line) |
| Email/domain confusion | Emails untouched this pass; display branding only |
| Richness test forces bloat | Cap additions to factual mechanism detail; reviewer checks |

## 10. Success Criteria

- Built site shows zero banned strings; `Swift Holdings` exactly once per page (legal line).
- Four-hub framing everywhere; counts consistent 48/24/12/12.
- Homepage reads end-to-end in locked voice; visual diff = none.
- All tests + astro check green.

## 11. Pass 2 (out of scope here, queued)

Full rewrites: /village, /how-it-works, /ownership, /protections, /locations, /partnership, /about, /resources, /briefing — using this constitution. Institutional/Ecosystem Fund pathway gets its own surface later.
