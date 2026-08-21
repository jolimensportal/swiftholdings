# My Prefabs — Redesign (Direction A · Obsidian Editorial)

**Status:** Approved (full mockup `my-prefabs-a.html` signed off by user)
**Date:** 2026-08-21
**Scope:** `/portfolio` route (sidebar label "My Prefabs")

## Direction
Same Obsidian Editorial treatment as the Prefab Projects redesign, so the two pages read as one
product: dark obsidian + Swift gold, photographic, serif display headings (`font-heading`),
sans body, generous spacing.

## Layout (top → bottom)
1. **Header** — eyebrow `MY PREFABS`, h1 `My Prefab Holdings`, one-line subhead.
2. **Summary strip** — 3 stat cards: Portfolio value (`portfolioValue`), Monthly distributions
   (`oyarifa.yourShareMonthly`), Occupancy (`oyarifa.occupancy`).
3. **In revenue** — featured card for the Oyarifa capsule: photo + left-to-right obsidian scrim,
   "In revenue" tag, location/name/meta, and a stats panel (90-day performance, gross / mo, your
   share / mo, occupancy, block-off dates).
4. **In build** — Tamale card: photo + price, phase, next payment, "manage".
5. **CTA** — acquire a new capsule with entry price.

## Decisions
- **Currency switched `$` → `GHS`** to match Prefab Projects and the rest of the portal (user
  approved the mockup with GHS).
- Content is faithful to the current page (2 owned units + acquire CTA) — restyled, not
  restructured.
- Images reuse the existing `capsule.image` URLs (hosted on the marketing site), which already
  load on the deployed worker.

## Design tokens (no raw hex)
- Backgrounds: `bg-background`, `bg-primary/5`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Borders: `border-primary/15`, `border-border`
- Accent fills: `bg-primary/15` (tags, block-off pill), `bg-primary/5` (CTA)
- Headings: `font-heading`; body: default sans (Geist)

## Files
- `src/app/(main)/portfolio/_components/portfolio-view.tsx` — rewritten to Direction A.
- `src/app/(main)/portfolio/page.tsx` — unchanged (thin Server Component rendering `PortfolioView`).
- `src/data/member-portal.ts` — data unchanged; consumed as before.

## Mockups (approved)
- `.superpowers/brainstorm/87356-1787316716/content/my-prefabs-a.html`
