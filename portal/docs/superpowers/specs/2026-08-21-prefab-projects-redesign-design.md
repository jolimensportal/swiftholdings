# Prefab Projects — Redesign (Direction A · Obsidian Editorial)

**Status:** Approved (full mockup `prefab-a-full.html` signed off by user)
**Date:** 2026-08-21
**Scope:** `/prefabs` route (sidebar label "Prefab Projects")

## Direction
Dark obsidian + Swift gold luxury editorial. Photographic, generous whitespace, serif display
headings (`font-heading`), sans body. Real PREFAB photography on desktop and mobile.

## Layout (top → bottom)
1. **Page header** — eyebrow `THE PREFAB VILLAGE`, h1 `Prefab Projects`, one-line subhead.
2. **Hero (flagship project)** — full-bleed photo (`prefabCatalog[0]`, Meridian 3-Bed) with a
   left-to-right obsidian gradient scrim; location eyebrow, name, stats (units / entry / status),
   `View project` button anchored to `#catalog`.
3. **Your funded unit** — split card: photo + progress, phase/foundation/handover/funding stats.
   Backed by `fundedUnit` (Plot 14 · Meridian · Phase 1).
4. **All prefab projects (`#catalog`)** — responsive grid (1 / 2 / 3 cols) of 12 photo cards:
   image with status badge, name + type, entry price, funding progress bar + `funded/units %`.

## Design tokens (no raw hex)
- Backgrounds: `bg-background`, `bg-background/60`, `bg-primary/5`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Borders: `border-primary/15`, `border-primary/30`
- Accent fill: `bg-primary text-primary-foreground` for "Funding open" badges + buttons
- Headings: `font-heading`; body: default sans (Geist)

## Data wiring
- `src/data/portal.ts` `prefabCatalog`: added `image` (12 hosted photos in `public/prefabs/`) and
  `location` (flagship only, `Oyarifa · Accra`).
- Photos copied + resized (1400px) from `~/Desktop/PREFAB` into `portal/public/prefabs/`.

## Files
- `src/app/(main)/prefabs/page.tsx` — now a thin Server Component rendering `PrefabsView`.
- `src/app/(main)/prefabs/_components/prefabs-view.tsx` — new Direction A view.
- `src/data/portal.ts` — `image` + `location` on `prefabCatalog`.
- `public/prefabs/*.jpg` — 12 hosted photos.

## Mockups (approved)
- `.superpowers/brainstorm/86507-1787315400/content/prefab-projects-directions.html` (A/B/C)
- `.superpowers/brainstorm/86507-1787315400/content/prefab-a-full.html` (selected, full page)
