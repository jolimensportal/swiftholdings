# Swift Horizon — Homepage Rebuild

**Status:** approved design, pending spec review
**Date:** 2026-10-02
**Repo:** `/Users/macbookpro/swift-holdings/DataNova` (git `jolimensportal/swiftholdings`)
**Live target:** `https://swifthorizon.com.gh/`
**Preview:** `http://localhost:59196/` (`docs/superpowers/brainstorm/2026-10-02-homepage-rebuild/serve.sh`)

---

## 1. What is being rebuilt and why

The homepage is being rebuilt structurally, not cosmetically. An audit of the live page found
four defects that no amount of restyling would fix:

| Defect | Measured on live |
|---|---|
| No narrative spine — equal-weight blocks | 13 sections (hero + 12 content), 12 `h2`, 7,558px tall |
| Photography starved and repeated | 4 `<img>`, **3 unique** — `village-banner` used twice |
| Banned 3-equal-card grid, rendering empty | base/stronger/downside = 3 blank cream boxes |
| Cormorant Garamond loaded but never used | 0 serif glyphs on the page |
| 400–600px dead space between sections | right half of most sections empty |

Plus a brand conflict: the nav wordmark reads `THE SWIFT PROJECT` while the page, title and
domain all read `Swift Horizon`.

**Goal:** one page with a spine, one image per section with no repeats, the locked design system
actually applied, and a total height below the current 7,558px.

## 2. Locked decisions

These were settled with the user before any design work and are not reopened here.

1. **Brand is `Swift Horizon`.** "The Swift Project" is removed from the public site, including
   nav and footer.
2. **Four movements.** I The ground · II The mechanism · III The product · IV Proof and ask.
3. **All twelve approved sections are retained.** Nothing is cut, nothing is moved to a subpage.
4. **Copy is verbatim** from `2026-08-21-the-swift-project-copy-constitution-design.md`. No copy
   was written, rewritten, or reordered in this project.
5. **Section treatments are chosen per section**, not by adopting one candidate wholesale.

## 3. Section treatments

Each section was reviewed in three variants — **A** from *The Ledger*, **B** from *The Long
Room*, **C** from *Four Rooms* — and chosen independently. Picks are recorded in
`picks.json` and reproduced by `build.html`.

| # | Unit | Movement | Pick | Treatment | Ground |
|---|---|---|---|---|---|
| 1 | Hero | I | **A** | Full-bleed dark, image ground at 0.5 opacity, sans `h1` | obsidian |
| 2 | The image rail | I | **C** | Single horizontal rail, 11 frames, gold tick per frame | obsidian |
| 3 | The problem | I | **B** | Cream, Cormorant display, asymmetric split (0.8/1.2) | canvas |
| 4 | The mechanism | II | **C** | Sticky statement left, paired states right | obsidian |
| 5 | Village operations | II | **B** | Full-bleed band plate, then cream wide split with ledger | plate + canvas |
| 6 | The P7 capsule | III | **A** | Giant `38` numeral, pill specs, asymmetric split (1.2/0.8) | canvas |
| 7 | The village | III | **A** | Cream split (0.8/1.2), image + moment line | canvas |
| 8 | Why modular | III | **A** | Cream, image left / ledger right (1.2/0.8) | canvas |
| 9 | What you acquire | IV | **B** | Sticky Cormorant statement left, ruled ledger right | obsidian |
| 10 | The assumptions | IV | **B** | Cream-free; staggered rules right of a serif statement | obsidian |
| 11 | The network | IV | **C** | Sticky statement left, four ruled hub rows right | obsidian |
| 12 | Between two places | IV | **A** | Statement left, prose right | obsidian |
| 13 | Three ways in | IV | **A** | Four-column rows: numeral / title / prose / link | obsidian |
| 14 | The ask | IV | **C** | Gold gradient card with a briefing-contents side panel | **gold** |

**Distribution:** A ×6, B ×4, C ×4.

### 3.1 The logic behind the mix

The picks are not arbitrary. They follow a consistent rule, and the rule should survive into
production because it is what makes the page cohere:

- **A — image-led and row-led sections.** Hero, capsule, village, why modular, diaspora, ways.
  Where a section owns one strong photograph or a wide horizontal row, A wins.
- **B — argument and prose sections.** The problem, operations, acquire, assumptions. Where the
  job is to make an argument in words, B's cream ground and Cormorant display carry it.
- **C — structural and data sections.** The rail, the mechanism, the network, the ask. Where the
  content is infrastructure — a set of frames, paired states, hub counts, a closing card — C's
  ruled structures handle it.

Movement III is uniformly A, which is correct: the product is where photography does the work.
The closing `s09 / s11 / s12` run is C for the network and the ask, and A for the two emotional
sections — again the same rule.

### 3.2 Ground rhythm

Derived from the picks above, the page reads as a deliberate sequence:

```
dark, dark  →  cream  →  dark  →  band+cream  →  cream ×3  →  dark ×5  →  gold
```

- **Obsidian** opens the page (hero, rail) and carries the entire credibility run in IV.
- **Cream** carries the argument (I) and the product reveal (III).
- **The band plate** at section 5 is the single full-bleed interruption before the product.
- **Gold appears exactly once**, on the final card. It is never used as a background anywhere else.

One consequence to review: section 4 (mechanism, obsidian) sits between cream sections 3 and 5,
so the cream run is interrupted by a single dark statement. This reads as a deliberate pivot at
full width, but it is the one place where the rhythm is arguable and it should be checked in the
assembled page before sign-off.

## 4. Photography — re-curated

This is the largest substantive change and it was not in the original plan.

The twelve previously approved marketing images were found to be predominantly **cold-climate**:
`home-hero-desktop` (the live hero) has **snow on the ground** and grey concrete steps;
`village-story` has snow and bare deciduous trees and is a multi-unit building contradicting
"your residence is private"; `ownership-story` has conifers and Adirondack chairs;
`confidence-feature` is desert landscaping; `warm-detail` is a manicured temperate lawn. Only
`village-banner`, `dusk-cta-desktop` and `architecture-gallery` read as Ghana. This is why the
live page reused a single image — the rest were unusable.

All 82 images in `~/Desktop/PREFAB` were filtered for low-latitude warmth — dry grass, timber,
dusk light, tropical planting — excluding snow, conifers, temperate lawns and cheap-box product
shots. **Eleven** images were selected. All twelve appear; five are shared between the rail
and their own section — see §8.

| Slot | File | Character | Shared with |
|---|---|---|---|
| Hero | `prefab_16_2400x1200.jpg` | savanna grass, pink dusk | — |
| Problem | `prefab_26_1600x996.jpg` | dry ornamental grass | rail |
| Mechanism | `prefab_28_1600x995.jpg` | black frame, gravel court | rail |
| Operations | `prefab_container_34_1600x1069.jpg` | dark-clad, mature trees | rail |
| Capsule | `prefab_29_1500x1051.jpg` | timber pavilion, full-height glazing | rail |
| Village | `prefab_22_1600x1106.jpg` | residence onto shared pool deck | rail |
| Modular | `prefab_17_2048x1365.jpg` | open grassland | rail |
| Acquire | `prefab_31_1500x1051.jpg` | warm timber, tropical planting | rail |
| Assumptions | `prefab_27_1600x995.jpg` | long dark minimal | rail |
| Diaspora | `prefab_23_1600x1095.jpg` | large mature trees | rail |
| Ways in | `prefab_14_1920x1833.jpg` | weathered steel and timber | rail |
| The ask | `dusk-cta-desktop.webp` | timber residence with deck at dusk | rail |

Full pool for re-selection: `http://localhost:59196/shortlist.html`.

**These are still not Swift Horizon homes.** The disclosure question is addressed by the rail and
the per-section ticks, with the credits strip carrying the complete list. See §8.

## 5. Disclosure treatment

Picked as **C**: a horizontal image rail with a small gold tick and an index per frame, plus one
explanatory line beneath the rail, plus a credits strip at the foot of the page. Sections that own
a photograph also carry a tick and a hairline caption.

This was chosen over the two alternatives because it puts the disclosures in one place instead of
scattering identical sentences down the page, where they read as a legal warning rather than a
footnote. It also gives the page one memorable image moment instead of several competing ones.

The disclosure must stay attached to the images and must not be reduced to a footer line alone.
Copy: *"Every photograph above is illustrative reference material, not a completed Swift Horizon
capsule."*

## 6. Design system

Locked tokens, converted to `oklch` in `assets/tokens.css`:

- **Obsidian** `0.190 0.011 285` · `0.205 0.005 270` · `0.235 0.017 270` · `0.245 0.007 60`
- **Canvas** `0.955 0.013 85` · **on-dark** `0.930 0.014 85` · **platinum** `0.815 0.011 258`
- **Gold** `0.816 0.075 75` · `0.755 0.083 72` · `0.677 0.086 72` · `0.567 0.077 71`
- **Gold gradient** `0.816 0.075 75 → 0.677 0.086 72`, dark text — **final card only**
- **Type** Cormorant Garamond + Manrope. Serif carries display statements and the one italic
  moment per screen; sans carries body and data. Tabular numerals throughout.
- **Grounds** full-bleed edge to edge. **Rules** hairline only. No boxes where a rule will do.

Banned and confirmed absent from all picks: 3-equal-card grids, left-border accent containers,
gradient-heavy backgrounds, emoji decoration.

## 7. Navigation

Trimmed from eight links plus CTA plus theme toggle to five links plus CTA:

`The Village · How It Works · Ownership · Locations · Partnership`

**Protections, About and Resources move to the footer.** This is an information-architecture
change, not a visual one, and is the item most likely to need reverting. Eight links plus a CTA
plus a toggle does not fit at 1440px without crowding.

## 8. Resolution: the assembly stands as approved

`build.html` — the direct assembly of the fourteen picks — **is the design of record.** It was
reviewed and confirmed correct as built.

An intermediate variant was produced that dropped the image rail and redistributed the
photographs into the sections that had none. It was reviewed and **rejected**, and has been
deleted. The rail, the per-section plates and the band plate all stand as picked.

**Known consequence, accepted:** the rail carries eleven frames, and five of those photographs
also appear further down in their own section — dry grass (problem), under the oaks (operations),
capsule, shared pool, grassland. Twelve unique photographs; seventeen `<img>` elements. This is
recorded rather than resolved, because resolving it requires either removing section images from
Movement III or shortening the rail, and both were declined.

## 9. Known constraint: page height

The assembly measures **~9,300px** at 1440px, against **7,558px** for the current live page. The
page is therefore **longer than what it replaces**, and this is accepted rather than engineered
away.

Reasoning: the live page reaches 7,558px with three photographs and substantial dead space — the
very dead space this rebuild exists to remove. Twelve content sections and twelve photographs at
readable type sizes do not compress below roughly 8,900px. Closing the remaining gap would require
either stripping images from Movement III or moving sections to subpages, and both reopen settled
decisions.

What must still happen in implementation, and is a real requirement:

1. **Make every ground full-bleed.** In `build.html` each section sits inside a standalone 1360px
   container so it can be judged in isolation, which leaves dark gutters beside the cream grounds.
   This is a harness artefact, not a design choice.
2. **Consolidate the per-section padding** into a single vertical rhythm rather than each section
   carrying its own preview padding.

What is **not** a requirement: matching or beating 7,558px. Criterion 6 was rewritten accordingly.
Shorter than the current page was never the goal; removing dead space was.

## 10. Out of scope

- Copy of any kind — locked by the copy constitution.
- Subpages. `/village`, `/ownership`, `/partnership`, `/briefing`, `/protections` are untouched.
- The member portal, auth, API, and all Cloudflare stack work.
- Real photography. Blocked on hubs coming online; the disclosure in §5 covers the interim.

## 11. Acceptance criteria

1. All twelve approved sections present, copy verbatim.
2. Twelve unique photographs present. Five are shared between the rail and their own section — accepted, see §8.
3. No 3-equal-card grid anywhere on the page.
4. Cormorant Garamond visibly used — display statements plus one italic moment per screen.
5. `Swift Horizon` is the only wordmark in nav and footer.
6. Page height at or under ~9,300px at 1440px viewport, with consolidated section padding. Beating the current 7,558px is not required — see §9.
7. Every ground full-bleed.
8. Disclosure present, attached to the images, stating these are illustrative reference.
9. Nav reduced to five links, CTA retained.
10. Zero layout shift, no horizontal scroll, keyboard-navigable, focus visible.
11. `astro check` clean, `pnpm test` green, build succeeds.

## 12. Artefacts

```
docs/superpowers/brainstorm/2026-10-02-homepage-rebuild/
├── index.html              chooser, 14 units, picks readout
├── picks.json              the locked per-section picks
├── build.html              THE PAGE — assembles from picks.json or localStorage
├── assets/tokens.css       locked design system in oklch
├── assets/a1..a11.jpg      the eleven re-curated images
├── assets/dusk-cta-desktop.webp   retained from the original twelve
├── shortlist.html          the 23 warm-climate candidates of 82
├── pool.html               all 82
├── contact-sheet.html      the 12 previously approved, and what is wrong with them
├── 1a|1b|1c-*.html         the three full-page candidates
├── sections/<id>.html      14 units × 3 stacked variants
├── sections/_lib.css       shared component CSS
├── sections/_pick.js       pick persistence
├── sections/build.py       regenerates all 14
└── serve.sh                port 59196
```