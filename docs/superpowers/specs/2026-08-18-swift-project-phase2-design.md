# THE SWIFT PROJECT — Phase 2 Design (Rebrand + Membership Ecosystem)

## Status

Approved section-by-section through the visual companion on 2026-08-18.
Supersedes the Phase 1 direction in `2026-08-15-swift-holdings-core-site-rebuild-design.md`
for everything except the Phase 1 pages it explicitly keeps. Phase 1 remains the
foundation; this document rebrands and extends it.

## Goal

Transform the Phase 1 Swift Holdings marketing site into **THE SWIFT PROJECT**:
a single membership ecosystem where visitors browse and book stays, members join
through a gated discovery briefing, and owner-investors purchase and operate P7
capsules — all wrapped in a hand-crafted, luxury-grade design language that no
one would mistake for AI-generated work.

The result must make high-net-worth diaspora and institutional visitors believe
the project was designed and built by humans with taste. Craft bar is a hard
requirement, not an aspiration.

## Approved Decisions

| Area | Decision |
| --- | --- |
| Name | **THE SWIFT PROJECT** everywhere (site, metadata, social card, copy). Parent company remains Swift Holdings. |
| Audience | Diaspora owner-investors primary; Ghanaian owners welcome; institutional partners via Ecosystem Fund. |
| Business model | One membership ecosystem, three tiers: book a stay (everyone) · member (via gated discovery form → login) · owner-investor (P7 capsule, 70/30). |
| Revenue split | 70/30 (owner/investor 70%). The 80/20 model is retired and must not appear anywhere. |
| Entry | $50,000 per P7 capsule. No other entry price exists for the owner path. |
| Ecosystem Fund | Kept as Pathway 2 on the Partnership page, with differently-colored CTAs. Not merged into the owner path. |
| Hamilton / Ontario mockup | Template artifact — discarded. Never appears. |
| Dark/light split | Dark obsidian for hero, portal, investor surfaces. Light canvas `#F4EFE6` for reading-heavy pages (documents, resources). |
| CTA style | Gold gradient fill `#D7B777 → #B99255` in BOTH modes, dark text on gold. Secondary = outlined gold. |
| Marketplace feed | BOTH sources: stopped/abandoned payment plans AND owner exits. |
| Gating | All gates locked: prospectus, yield data, calculator saves, availability & pricing, legal dossier, stay bookings. |
| Gated content | Real long-form web documents, readable on-site and downloadable as PDF. |
| Craft bar | Must pass design-taste standards: real fonts, real photography, asymmetric composition, restraint, no template patterns. |

## Scope

This phase covers, in implementation order:

1. **Rebrand shell** — name, metadata, social card, nav across all pages.
2. **Public site** — 10-page architecture (below), content per the content map.
3. **Gated documents** — three long-form documents readable on-site + PDF download.
4. **Discovery form** — the 5-step briefing funnel, all gates behind it.
5. **Member login + portal** — shell, dashboard, portfolio, marketplace, tenants,
   documents, briefings, profile (design approved; build scope may defer live
   payments/escrow — see Deferred Decisions).

### Route Plan

| New route | Purpose | Notes |
| --- | --- | --- |
| `/` | Hero + membership promise | Rebrand copy; keep Phase 1 hero imagery direction |
| `/village` | The Village | Oyarifa masterplan, P7 capsule, 9-layer wall, shared land |
| `/how-it-works` | How It Works | 5-phase lock-in timeline, purchase → operation |
| `/ownership` | Ownership & Financials | 70/30, $50K entry, calculator, yield tables (public summary; full tables gated) |
| `/protections` | Protections & Legal | Escrow, title under Ghanaian law, insurance, legal dossier (gated) |
| `/locations` | Locations | Renamed from `/accra`; Oyarifa + Kumasi/Tamale/Takoradi hubs, capital-bridge map |
| `/partnership` | Partnership | NEW. Two pathways: Owner-Investor / Ecosystem Fund. Differently-colored CTAs |
| `/about` | Our Vision | Renamed from About Swift |
| `/resources` | Resources | NEW gated hub: the three long-form documents + lead magnets |
| `/briefing` | Briefing | The 5-step discovery form (replaces Phase 1 contact form) |

Redirects: `/accra` → `/locations`. Existing Phase 1 routes otherwise retained.

## Design System

### Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `obsidian-950` | `#14141A` | Portal/dark surface base |
| `obsidian-900` | `#171719` | Dark hero base |
| `obsidian-850` | `#1D2026` | Dark card surface |
| `obsidian-800` | `#211F1D` | Dark raised surface |
| `canvas` | `#F4EFE6` | Light reading pages |
| `gold-400` | `#E1BE92` | Gold text on dark, hover |
| `gold-500` | `#D6AC7A` | Primary gold accent |
| `gold-600` | `#C8A06C` | Borders, secondary accents |
| `gold-700` | `#A88459` | Pressed/outlined states |
| `gold-gradient` | `linear-gradient(92deg, #D7B777 0%, #B99255 100%)` | Primary CTA fill, dark text, both modes |
| `gold-line` | `rgba(214,172,122,0.14)` | 1px card/ledger hairlines |
| `ink-on-dark` | `#EDE7DC` | Body text on dark |
| `ink-dim` | `rgba(237,231,220,0.5)` | Secondary text on dark |
| `radius` | 4–5px | Buttons/inputs/cards |
| `shadow` | none heavy | Only subtle elevation; rely on hairlines |

### Type

- **Display:** Cormorant Garamond 400/500 (+ italic) — serif editorial moments:
  page anchors, hero lines, numerals, unit names.
- **UI/Body:** Manrope 400/500/600.
- Micro-labels: 10px, `letter-spacing: 0.22em`, uppercase, gold `rgba(214,172,122,0.75)`.
- Numerals: `font-variant-numeric: tabular-nums` everywhere money/time appears.
- Scale: display 26–54px; body 12–13.5px; ledger rows 12–12.5px.

### Craft Rules (mandatory)

- No three-equal-card grids. Asymmetric composition: featured split (1.5fr/1fr),
  image-led bands, ledger rows.
- Real photography only — P7 renders and land photography; never gradient
  placeholder boxes in the shipped site.
- One serif moment per screen/section; everything else quiet.
- One eyebrow label per 2–3 sections; no label spam.
- Hairlines and tabular numerals over boxes and chips; no badge stacks.
- No marquees; motion only where it has purpose (countdown, hover reveals).

## Information Architecture

Nav (public): The Village · How It Works · Ownership & Financials · Protections ·
Locations · Partnership · About · Resources · Request a briefing (gold CTA).
Portal nav (after login): Dashboard · Portfolio · Marketplace · Tenants ·
Documents · Briefings · Profile · Log out.

### Content Map

Public (rich, no gating):

- Hero: "A luxury hospitality asset in Ghana, built with absolute certainty."
- Masterplan; P7 capsule specs (38 m², 9-layer wall system, CIGS solar);
  manufacturing flow; land/bridge map (Oyarifa + Kumasi/Tamale/Takoradi hubs).
- Market dashboard: 300K+ Accra accommodation deficit, 2M+ national, 6–10% growth.
- 70/30 explainer; $50K entry; 5-phase lock-in timeline; calculator (public
  results, $50K → 88% occupancy → 350% → ~$2,450/mo) — full scenarios gated.
- Protections summary; contacts (real: +1-437-421-0963 · +233-544-101016 ·
  info@swiftholdings.org · swiftholdings-ghana.com · partnerships@swiftholdings-ghana.com).

Gated (behind login, unlocked by discovery form):

- Full yield tables & scenarios; calculator saves & comparisons.
- Availability & pricing by unit; stay bookings.
- Legal dossier (title memorandum, operating agreement, insurance).
- The three long-form documents (below).

### Gated Documents (lead magnets — readable + PDF download)

1. **Partnership Summary** (≈42 pages)
2. **Investor Summary & Partnership Models** (≈38 pages)
3. **Institutional Modular Hospitality in Ghana** (whitepaper)

## Discovery Form (5 Steps)

1. **Who you are** — segmented control: Local Ghanaian / Diaspora / Institutional.
2. **Why you're here** — branching intent: set up a capsule / fund the Ecosystem /
   book a stay / still exploring.
3. **Capital plans** — adaptive brackets: owner path from $50K up; Fund path
   $1M–5M / 5M–10M / 10M–25M / 25M+.
4. **Contact details** — green-check validation states per partner reference.
5. **Briefing schedule** — global timezone picker (PST −8 → JST +9), 45-minute
   encrypted call, "end-to-end encryption active".

Submit → confirmation + login credentials → all gates open. Every briefing is
recorded, summarised, and filed to the member's Documents.

## Portal

Shell: wordmark (serif, gold accent), audience segmented control, nav, log out.
All screens dark obsidian. Ledger style throughout.

### Dashboard
Serif greeting ("Good evening, Kofi"); portfolio value as large gold numeral;
context caption; revenue ledger (gross / your 70% / status, tabular); unit image
with gradient caption; occupancy 88% + ADR $132 rows; next briefing strip.

### Portfolio
Featured unit split: image + "Your first capsule" serif, performance ledger
(90-day total, 70% share, occupancy, block-off dates as quiet gold chips);
second unit as slim band (phase 2 of 5, next payment); acquisition rail:
"reserve with a 20% escrow deposit" + serif `$50,000 entry`.

### Marketplace
Featured listing split: 16:9 unit render with countdown (serif numerals,
"d : h : m"), status chip overlay; bid panel: current bid (serif gold), reserve
state ("reserve $46,000 · met"), bid ledger rows (bidder, time, "— you"), min
increment $250, escrow note; gold-gradient confirm button. Secondary listings
as image-led rows: P7-022 Tamale (Transfer, buy-now $52,000), P7-031 Kumasi
(Expiring, grace ends, opens to bids in N days).

Lifecycle: Reserved → Delinquent → Expiring → Abandoned → listed to bids;
owner exits = Transfer listings (buy-now, no auction). Bidding: 14-day windows,
min increment $250, auto-bid cap, escrow. Settlement: 72h deposit → title
transfer (Ghanaian law) → balance plan; missed deposit = re-list + forfeiture.

### Tenants
Current guest as monogram card (privacy-first, no photos of guests); upcoming
stays ledger; month summary (nights sold, ~65% experiential, booking window);
note: stays are set aside for members first.

### Documents
"Your files" ledger: purchase & installation agreement, 70/30 operating
agreement, land lease & title memorandum, insurance certificate, blueprint set,
quarterly revenue statement. "Project library": the three gated documents.
All sealed under Ghanaian law, downloadable PDFs.

### Briefings
Upcoming briefing (serif date block, topic, timezone display); past briefings
with notes/recording; "recorded, summarised, and filed to Documents" note.

### Profile
Serif name block; identity (Diaspora · Toronto → Accra); payouts (USD held ·
GHS settled monthly); security rows (2FA active, end-to-end session
encryption); real contact line. "Never sold, never shared."

## Error Handling & Trust

- Form validation with explicit green-check states; every gate explains what
  unlocks and why (prospectus, yield data, calculator, availability, legal).
- Escrow and title transfer language grounded in Ghanaian law; no claims beyond
  the documents (80/20, Hamilton, and unverified yields must not appear).
- Login/portal flows keep "encrypted" language only where real (HTTPS,
  end-to-end on briefings); 2FA labeled as such.

## Deferred Decisions (for the implementation plan)

- Auth backend (managed auth vs email/password vs magic link) — plan decides.
- Live payment rails (card/wire/Paystack) and escrow settlement — plan scopes;
  portal designs assume them but may ship with demo-state ledgers first.
- PDF generation for the three documents (print stylesheet vs server-side).
- Marketplace scheduling engine (delinquency timers, grace windows) — plan
  decides between client-state demo and server scheduling.

## Testing

- Every portal screen reviewed in the browser against the craft rules.
- Gating verified: anonymous visitors see locked states; members see content.
- Calculator outputs match the approved figures ($50K / 88% / 350% / ~$2,450).
- Redirect `/accra` → `/locations`; no 80/20 or Hamilton strings anywhere.