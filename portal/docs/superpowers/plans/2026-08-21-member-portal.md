# Member Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full 7-screen Swift Project member portal (Dashboard, Portfolio, Marketplace, Tenants, Documents, Briefings, Profile) plus a static login gateway, using simulated data that matches the approved mockups, deployable to `swiftholdingsportal.securemensah.workers.dev` for an investor demo.

**Architecture:** Next.js 16 App Router (`(main)` segment). Each screen is a Server Component under `src/app/(main)/<route>/page.tsx`, composing co-located components in `_components/`. All data comes from one typed fixtures module `src/data/member-portal.ts`. The shared shell is the existing shadcn `Sidebar` (updated wordmark + Ghanaian/Diaspora/Institutional segmented control + member nav). The marketplace bid box is the only Client Component (local-state simulation). Theme is the `swift-luxury` preset (charcoal + champagne gold), applied as the default.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui (radix-nova), recharts (already used by the existing dashboard), lucide-react, date-fns.

> **Verification note:** This project has no unit-test framework configured. Verification per task is `npm run build` + `npm run lint` (the project's own validation commands). Run them from `portal/`.

---

## File Structure

**New / modified:**

- `src/config/app-config.ts` — set `name` to "The Swift Project" (wordmark source).
- `src/styles/globals.css` (or root layout) — default `data-theme-preset="swift-luxury"` + `class="dark"` so the demo opens in the approved dark look.
- `src/data/member-portal.ts` — **Create.** All simulated data + types.
- `src/navigation/sidebar/sidebar-items.ts` — **Modify.** Member nav (Dashboard, Portfolio, Marketplace, Tenants, Documents, Briefings, Profile).
- `src/app/(main)/_components/sidebar/app-sidebar.tsx` — **Modify.** Custom "THE SWIFT PROJECT" wordmark + Ghanaian/Diaspora/Institutional segmented control; keep `NavMain` + `NavUser`.
- `src/app/(main)/_components/sidebar/segmented-control.tsx` — **Create.** Visual-only segmented control.
- `src/app/(main)/dashboard/default/page.tsx` — **Modify.** Replace generic demo with Dashboard v2.
- `src/app/(main)/dashboard/default/_components/dashboard-view.tsx` — **Create.** Dashboard v2 layout.
- `src/app/(main)/portfolio/page.tsx` — **Create.** Portfolio screen.
- `src/app/(main)/portfolio/_components/portfolio-view.tsx` — **Create.**
- `src/app/(main)/marketplace/page.tsx` — **Create.** Marketplace screen.
- `src/app/(main)/marketplace/_components/marketplace-view.tsx` — **Create.**
- `src/app/(main)/marketplace/_components/bid-box.tsx` — **Create.** Client Component (local-state bid simulation).
- `src/app/(main)/tenants/page.tsx` — **Create.**
- `src/app/(main)/tenants/_components/tenants-view.tsx` — **Create.**
- `src/app/(main)/documents/page.tsx` — **Create.**
- `src/app/(main)/documents/_components/documents-view.tsx` — **Create.**
- `src/app/(main)/briefings/page.tsx` — **Create.**
- `src/app/(main)/briefings/_components/briefings-view.tsx` — **Create.**
- `src/app/(main)/profile/page.tsx` — **Create.**
- `src/app/(main)/profile/_components/profile-view.tsx` — **Create.**
- `src/app/(main)/(auth)/login/page.tsx` — **Create.** Static login gateway screen.

Each page stays a Server Component and delegates to its `*‑view.tsx`. Reuse `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardAction`, `Button`, `Badge` from `@/components/ui`. Use theme tokens (`bg-background`, `text-foreground`, `text-primary`, `border-border`, `text-muted-foreground`, `bg-primary`) — these resolve to the swift-luxury charcoal + gold. Use `font-heading` for the serif display headings (matches Cormorant Garamond feel). Do **not** add arbitrary hex colors.

---

## Task 1: Set the swift-luxury theme as default

**Files:**
- Modify: `src/config/app-config.ts`
- Modify: `src/app/layout.tsx` (root layout — apply `data-theme-preset` + `dark`)

- [ ] **Step 1: Set the app name**

In `src/config/app-config.ts`, ensure:
```ts
export const APP_CONFIG = {
  name: "The Swift Project",
  // …rest unchanged
} as const;
```

- [ ] **Step 2: Apply the preset + dark mode on the root layout**

In `src/app/layout.tsx`, find the `<html>` tag and set:
```tsx
<html lang="en" className="dark" data-theme-preset="swift-luxury" suppressHydrationWarning>
```
(Keep existing `suppressHydrationWarning` if present. If the `<html>` is produced by a theme provider, set `data-theme-preset="swift-luxury"` there instead, and ensure the `dark` class is applied by default for the demo.)

- [ ] **Step 3: Verify build + lint**

Run: `cd portal && npm run build`
Expected: build succeeds (0 type errors).
Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/config/app-config.ts src/app/layout.tsx
git commit -m "feat: default to swift-luxury dark theme for member portal"
```

---

## Task 2: Create the simulated data module

**Files:**
- Create: `src/data/member-portal.ts`

- [ ] **Step 1: Write the fixtures module**

```ts
// Simulated member-portal data for the investor demo. No backend.
export type Segment = "ghanaian" | "diaspora" | "institutional";

export interface Capsule {
  id: string;
  name: string;
  location: string;
  ownedSince: string;
  share: string;
  status: "in-revenue" | "building";
  occupancy?: number;
  adr?: number;
  performance90d?: number;
  grossMonthly?: number;
  yourShareMonthly?: number;
  phase?: string;
  price?: number;
  nextPayment?: string;
  blockOff?: string;
  image: string;
}

export const capsules: Capsule[] = [
  {
    id: "P7-012",
    name: "Oyarifa, Accra",
    location: "Oyarifa, Accra",
    ownedSince: "March 2026",
    share: "70 / 30",
    status: "in-revenue",
    occupancy: 88,
    adr: 132,
    performance90d: 6140,
    grossMonthly: 2310,
    yourShareMonthly: 1617,
    blockOff: "18–22 Dec",
    image: "https://swiftholdings.pages.dev/_astro/village-story.CPtuL6AT.webp",
  },
  {
    id: "P7-018",
    name: "Tamale",
    location: "Tamale",
    ownedSince: "Plans completed",
    share: "70 / 30",
    status: "building",
    phase: "Phase 2 of 5",
    price: 52400,
    nextPayment: "1 Sept",
    image: "https://swiftholdings.pages.dev/_astro/architecture-gallery.XT2ht_me.webp",
  },
];

export interface LedgerRow {
  month: string;
  gross: number;
  share: number;
  status: string;
}

export const revenueLedger: LedgerRow[] = [
  { month: "July", gross: 2380, share: 1666, status: "paid" },
  { month: "June", gross: 2450, share: 1715, status: "paid" },
  { month: "August", gross: 2310, share: 1617, status: "29 Aug" },
];

export const portfolioValue = 187400;
export const greetingName = "Kofi";
export const nextBriefing = "Briefing with A. Mensah · Thursday 20 Aug · 09:00 GMT";

export interface Bid {
  bidder: string;
  amount: number;
  time: string;
  you?: boolean;
}

export interface MarketplaceFeatured {
  id: string;
  location: string;
  title: string;
  blurb: string;
  specs: string;
  countdown: string;
  currentBid: number;
  reserve: number;
  reserveMet: boolean;
  bids: Bid[];
  minIncrement: number;
  defaultBid: number;
  image: string;
}

export const marketplaceFeatured: MarketplaceFeatured = {
  id: "P7-014",
  location: "Oyarifa · Accra",
  title: "A capsule, returned to the fold",
  blurb:
    "38 m² · solar-ready · Oyarifa, Accra. Payment plan abandoned after the third instalment; reserve met, bidding closes Saturday.",
  specs: "38 m² · solar-ready",
  countdown: "04d : 11h : 32m",
  currentBid: 48200,
  reserve: 46000,
  reserveMet: true,
  bids: [
    { bidder: "you", amount: 48200, time: "2h ago", you: true },
    { bidder: "A. Mensah", amount: 47900, time: "5h ago" },
    { bidder: "E. Boateng", amount: 47400, time: "1d ago" },
  ],
  minIncrement: 250,
  defaultBid: 48450,
  image: "https://swiftholdings.pages.dev/_astro/home-hero-desktop.BT7o6C_b.webp",
};

export interface Listing {
  id: string;
  location: string;
  tag: string;
  price: number;
  note: string;
  image: string;
}

export const marketplaceListings: Listing[] = [
  {
    id: "P7-022",
    location: "Tamale",
    tag: "Transfer",
    price: 52000,
    note: "Owner exit, year 2 of lock-in · buy-now, no auction",
    image: "https://swiftholdings.pages.dev/_astro/village-story.CPtuL6AT.webp",
  },
  {
    id: "P7-031",
    location: "Kumasi",
    tag: "Expiring · grace ends 22 Aug",
    price: 47500,
    note: "Final notice before listing · opens to bids in 9 days",
    image: "https://swiftholdings.pages.dev/_astro/diaspora-lifestyle.CMb8Or9w.webp",
  },
];

export interface Tenant {
  name: string;
  origin: string;
  detail: string;
  rate: number;
  state: "current" | "upcoming";
}

export const currentTenant: Tenant = {
  name: "Amma Owusu",
  origin: "Toronto, Canada",
  detail: "Experiential stay · night 3 of 5 · P7-012, Oyarifa",
  rate: 165,
  state: "current",
};

export const upcomingTenants: Tenant[] = [
  { name: "E. Boateng", origin: "24–29 Aug", detail: "P7-012", rate: 132, state: "upcoming" },
  { name: "Family visit — 4 guests", origin: "3–10 Sept", detail: "P7-012", rate: 118, state: "upcoming" },
  { name: "J. Mettle", origin: "15–20 Sept", detail: "P7-012", rate: 132, state: "upcoming" },
];

export const tenantStats = {
  staysThisMonth: 4,
  occupancy: 88,
  nightsSold: "27 / 31",
  experiential: "65%",
  avgWindow: "11 days",
};

export interface DocFile {
  name: string;
  date: string;
  status: string;
}
export interface DocLibrary {
  name: string;
  meta: string;
}

export const yourDocuments: DocFile[] = [
  { name: "Purchase & installation agreement", date: "Mar 2026", status: "signed" },
  { name: "70 / 30 operating agreement", date: "Mar 2026", status: "signed" },
  { name: "Land lease & title memorandum", date: "Mar 2026", status: "sealed" },
  { name: "Insurance certificate — full build", date: "Apr 2026", status: "current" },
  { name: "Blueprint set — P7 capsule, 9-layer wall", date: "Mar 2026", status: "rev B" },
  { name: "Quarterly revenue statement", date: "Jul 2026", status: "ready" },
];

export const documentLibrary: DocLibrary[] = [
  { name: "Partnership summary", meta: "read · PDF · 42 pages" },
  { name: "Investor summary & partnership models", meta: "read · PDF · 38 pages" },
  { name: "Institutional modular hospitality — Ghana", meta: "read · PDF · whitepaper" },
];

export interface Briefing {
  day: string;
  month: string;
  title: string;
  meta: string;
  state: "upcoming" | "past";
}

export const briefings: Briefing[] = [
  {
    day: "20",
    month: "Aug",
    title: "Partnership briefing — the 70 / 30, explained",
    meta: "With A. Mensah · 09:00 GMT · 45 minutes · encrypted",
    state: "upcoming",
  },
  {
    day: "4",
    month: "Aug",
    title: "Discovery — the P7 capsule, build & finish",
    meta: "42 min · notes · recording",
    state: "past",
  },
  {
    day: "28",
    month: "Jul",
    title: "Locations — Oyarifa land walkthrough",
    meta: "31 min · notes · recording",
    state: "past",
  },
];

export const profile = {
  name: "Kofi Owusu",
  route: "Diaspora · Toronto, Canada → Accra, Ghana",
  kyc: "Identity verified · KYC complete",
  settlement: "USD held · GHS settled monthly",
  bank: "•••• 4412 · Toronto",
  language: "English",
  twoFactor: "active",
  encryption: "end-to-end",
  phone: "+1 437 421 0963",
  email: "k.owusu@email.com",
  initials: "KO",
};
```

- [ ] **Step 2: Verify build**

Run: `cd portal && npm run build`
Expected: type-checks pass.

- [ ] **Step 3: Commit**

```bash
git add src/data/member-portal.ts
git commit -m "feat: simulated member-portal data module"
```

---

## Task 3: Update the sidebar nav + member wordmark

**Files:**
- Modify: `src/navigation/sidebar/sidebar-items.ts`
- Create: `src/app/(main)/_components/sidebar/segmented-control.tsx`
- Modify: `src/app/(main)/_components/sidebar/app-sidebar.tsx`

- [ ] **Step 1: Replace sidebar items with the member nav**

In `sidebar-items.ts`, replace the `sidebarItems` array with:
```ts
import {
  Calendar,
  ChartBar,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Users,
  type LucideIcon,
  Wallet,
} from "lucide-react";

export type NavBadge = "new" | "soon";
export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}
interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}
export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}
export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}
export type NavMainItem = NavMainLinkItem | NavMainParentItem;
export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Owner",
    items: [
      { id: "dashboard", title: "Dashboard", url: "/dashboard/default", icon: LayoutDashboard },
      { id: "portfolio", title: "Portfolio", url: "/portfolio", icon: ChartBar },
      { id: "marketplace", title: "Marketplace", url: "/marketplace", icon: Wallet },
      { id: "tenants", title: "Tenants", url: "/tenants", icon: Users },
    ],
  },
  {
    id: 2,
    label: "Resources",
    items: [
      { id: "documents", title: "Documents", url: "/documents", icon: FolderOpen },
      { id: "briefings", title: "Briefings", url: "/briefings", icon: Calendar },
    ],
  },
  {
    id: 3,
    label: "Account",
    items: [{ id: "profile", title: "Profile", url: "/profile", icon: FileText }],
  },
];
```

- [ ] **Step 2: Create the segmented control**

`src/app/(main)/_components/sidebar/segmented-control.tsx`:
```tsx
"use client";

import { useState } from "react";

const SEGMENTS = ["Ghanaian", "Diaspora", "Institutional"] as const;

export function SegmentedControl() {
  const [active, setActive] = useState<(typeof SEGMENTS)[number]>("Diaspora");
  return (
    <div className="flex overflow-hidden rounded-md border border-primary/25 text-[10px] tracking-wide">
      {SEGMENTS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setActive(s)}
          className={
            "flex-1 px-2 py-1.5 text-center transition-colors " +
            (active === s
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {s}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update the sidebar header**

In `app-sidebar.tsx`, replace the `SidebarHeader` block with the wordmark + segmented control:
```tsx
<SidebarHeader>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild size="lg">
        <Link prefetch={false} href="/dashboard/default">
          <span className="font-heading text-base leading-none">
            THE SWIFT <span className="text-primary">PROJECT</span>
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
  <SegmentedControl />
</SidebarHeader>
```
Add the import: `import { SegmentedControl } from "./segmented-control";` and keep `NavMain`, `NavUser`, `SupportCard` as-is.

- [ ] **Step 4: Verify build + lint**

Run: `cd portal && npm run build && npm run lint`
Expected: success, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/navigation/sidebar/sidebar-items.ts src/app/'(main)'/_components/sidebar/segmented-control.tsx src/app/'(main)'/_components/sidebar/app-sidebar.tsx
git commit -m "feat: member sidebar nav, wordmark, segment control"
```

---

## Task 4: Dashboard (v2)

**Files:**
- Modify: `src/app/(main)/dashboard/default/page.tsx`
- Create: `src/app/(main)/dashboard/default/_components/dashboard-view.tsx`

- [ ] **Step 1: Replace the page**

`page.tsx`:
```tsx
import { DashboardView } from "./_components/dashboard-view";

export default function Page() {
  return <DashboardView />;
}
```

- [ ] **Step 2: Build the dashboard view**

`dashboard-view.tsx`:
```tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  capsules,
  greetingName,
  nextBriefing,
  portfolioValue,
  revenueLedger,
} from "@/data/member-portal";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function DashboardView() {
  const [oyarifa] = capsules;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Dashboard</p>
        <h1 className="font-heading text-3xl text-foreground">
          Good evening, {greetingName}
        </h1>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Portfolio value</p>
            <p className="font-heading text-5xl text-primary">{currency(portfolioValue)}</p>
          </div>
          <p className="pb-2 text-sm text-muted-foreground">
            Two capsules · Oyarifa + Tamale
            <br />
            70 / 30 revenue share active
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Revenue ledger</span>
              <span>GHS settled monthly · USD held</span>
            </div>
            <div className="divide-y divide-border">
              {revenueLedger.map((row) => (
                <div key={row.month} className="grid grid-cols-4 py-3 text-sm">
                  <span className="text-foreground/80">{row.month}</span>
                  <span className="tabular-nums text-foreground">{currency(row.gross)}</span>
                  <span className="tabular-nums text-primary">{currency(row.share)}</span>
                  <span className="text-right text-xs text-muted-foreground">{row.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={oyarifa.image} alt="" className="h-40 w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                {oyarifa.id} · Oyarifa
              </p>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="flex justify-between py-3 text-sm">
              <span className="text-muted-foreground">Occupancy — 30 days</span>
              <span className="tabular-nums text-foreground">{oyarifa.occupancy}%</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-muted-foreground">Average daily rate</span>
              <span className="tabular-nums text-foreground">${oyarifa.adr}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-4 text-sm">
          <span className="text-muted-foreground">Next — {nextBriefing}</span>
          <span className="text-primary">join</span>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint**

Run: `cd portal && npm run build && npm run lint`

- [ ] **Step 4: Commit**

```bash
git add src/app/'(main)'/dashboard/default/page.tsx src/app/'(main)'/dashboard/default/_components/dashboard-view.tsx
git commit -m "feat: member dashboard v2 with simulated data"
```

---

## Task 5: Portfolio

**Files:**
- Create: `src/app/(main)/portfolio/page.tsx`
- Create: `src/app/(main)/portfolio/_components/portfolio-view.tsx`

- [ ] **Step 1: Page**

```tsx
import { PortfolioView } from "./_components/portfolio-view";

export default function Page() {
  return <PortfolioView />;
}
```

- [ ] **Step 2: View**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { capsules } from "@/data/member-portal";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function PortfolioView() {
  const [oyarifa, tamale] = capsules;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Portfolio · 02 units · both in revenue
      </p>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div className="relative min-h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={oyarifa.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/10" />
            <div className="absolute bottom-5 left-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">{oyarifa.id} · {oyarifa.location}</p>
              <p className="font-heading text-3xl text-foreground">Your first capsule</p>
              <p className="mt-1 text-sm text-muted-foreground">Owned since {oyarifa.ownedSince} · {oyarifa.share} share · fully tenanted</p>
            </div>
            <div className="absolute right-5 top-4 text-xs uppercase tracking-[0.22em] text-primary/90">In revenue</div>
          </div>
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-[0.22em] text-primary/75">Performance — 90 days</span>
              <span className="font-heading text-2xl text-primary">{currency(oyarifa.performance90d ?? 0)}</span>
            </div>
            <Row label="Gross revenue" value={`${currency(oyarifa.grossMonthly ?? 0)} / mo`} />
            <Row label="Your share — 70%" value={`${currency(oyarifa.yourShareMonthly ?? 0)} / mo`} />
            <Row label="Occupancy" value={`${oyarifa.occupancy}%`} />
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Block-off dates — yours</p>
              <span className="rounded bg-primary/15 px-2 py-1 text-xs text-primary">{oyarifa.blockOff}</span>
              <span className="ml-2 text-xs text-muted-foreground">+ reserve</span>
            </div>
          </CardContent>
        </div>
      </Card>

      <Card className="flex items-center gap-4 p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tamale.image} alt="" className="h-24 w-40 object-cover" />
        <CardContent className="flex flex-1 items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/90">{tamale.id} · {tamale.location}</p>
            <p className="font-heading text-2xl text-foreground">{currency(tamale.price ?? 0)}</p>
            <p className="text-xs text-muted-foreground">Plans completed · awaiting foundation · next payment {tamale.nextPayment}</p>
          </div>
          <div className="text-right text-xs">
            <p className="uppercase tracking-[0.22em] text-muted-foreground">{tamale.phase}</p>
            <p className="mt-2 text-primary">manage</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">Acquire a new capsule — reserve with a 20% escrow deposit</span>
          <span className="font-heading text-xl text-primary">$50,000 entry</span>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint**

- [ ] **Step 4: Commit**

```bash
git add src/app/'(main)'/portfolio/page.tsx src/app/'(main)'/portfolio/_components/portfolio-view.tsx
git commit -m "feat: portfolio screen with capsule detail"
```

---

## Task 6: Marketplace + interactive bid box

**Files:**
- Create: `src/app/(main)/marketplace/page.tsx`
- Create: `src/app/(main)/marketplace/_components/marketplace-view.tsx`
- Create: `src/app/(main)/marketplace/_components/bid-box.tsx`

- [ ] **Step 1: Page**

```tsx
import { MarketplaceView } from "./_components/marketplace-view";

export default function Page() {
  return <MarketplaceView />;
}
```

- [ ] **Step 2: Bid box (Client Component)**

```tsx
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function BidBox({
  defaultBid,
  minIncrement,
}: {
  defaultBid: number;
  minIncrement: number;
}) {
  const [bid, setBid] = useState(defaultBid);
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="number"
          value={bid}
          min={defaultBid}
          step={minIncrement}
          onChange={(e) => setBid(Number(e.target.value))}
          className="flex-1 rounded border border-primary/40 bg-background px-3 py-3 text-lg tabular-nums text-foreground"
        />
        <span className="max-w-[90px] text-[10px] leading-tight text-muted-foreground">
          min increment ${minIncrement} · escrow-verified
        </span>
      </div>
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Confirm bid — escrow-secured
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Marketplace view**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  marketplaceFeatured,
  marketplaceListings,
} from "@/data/member-portal";
import { BidBox } from "./bid-box";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function MarketplaceView() {
  const f = marketplaceFeatured;
  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-baseline justify-between pb-3">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Marketplace — {f.location}</p>
        <p className="text-xs text-muted-foreground">02 / 06 listings open</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <div className="relative min-h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-background/5" />
            <div className="absolute bottom-0 left-0 max-w-sm p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">Unit {f.id}</p>
              <p className="font-heading text-4xl text-foreground">{f.title}</p>
              <p className="mt-2 text-sm text-muted-foreground/80">{f.blurb}</p>
            </div>
            <div className="absolute right-5 top-4 text-right">
              <p className="font-heading text-xl text-primary tabular-nums">{f.countdown}</p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">until close</p>
            </div>
          </div>
          <CardContent className="flex flex-col gap-4 border-l border-border py-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Current bid</p>
                <p className="font-heading text-4xl text-primary">{currency(f.currentBid)}</p>
              </div>
              <p className="text-right text-xs text-muted-foreground">
                reserve {currency(f.reserve)} · {f.reserveMet ? "met" : "not met"}
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs text-muted-foreground">{f.bids.length + 4} bids</p>
              <div className="flex flex-col gap-2">
                {f.bids.map((b) => (
                  <div key={b.bidder} className="flex justify-between text-sm">
                    <span className={b.you ? "text-primary" : "text-foreground/80"}>
                      {currency(b.amount)} {b.you && <span className="text-muted-foreground">— you</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">{b.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <BidBox defaultBid={f.defaultBid} minIncrement={f.minIncrement} />
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid border-t border-border sm:grid-cols-2">
        {marketplaceListings.map((l) => (
          <div key={l.id} className="flex gap-4 p-5 sm:odd:border-r sm:odd:border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.image} alt="" className="h-20 w-28 rounded object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">{l.id} · {l.location}</p>
              <p className="font-heading text-2xl text-foreground">{currency(l.price)}</p>
              <p className="text-xs text-muted-foreground">{l.tag} · {l.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build + lint**

- [ ] **Step 5: Commit**

```bash
git add src/app/'(main)'/marketplace/page.tsx src/app/'(main)'/marketplace/_components/marketplace-view.tsx src/app/'(main)'/marketplace/_components/bid-box.tsx
git commit -m "feat: marketplace with interactive bid box"
```

---

## Task 7: Tenants

**Files:**
- Create: `src/app/(main)/tenants/page.tsx`
- Create: `src/app/(main)/tenants/_components/tenants-view.tsx`

- [ ] **Step 1: Page**

```tsx
import { TenantsView } from "./_components/tenants-view";

export default function Page() {
  return <TenantsView />;
}
```

- [ ] **Step 2: View**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  currentTenant,
  tenantStats,
  upcomingTenants,
} from "@/data/member-portal";

const currency = (n: number) => `$${n}`;

export function TenantsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Tenants · {tenantStats.staysThisMonth} stays this month · {tenantStats.occupancy}% occupancy
      </p>

      <Card className="flex items-center gap-4 p-0">
        <div className="flex size-11 items-center justify-center rounded-full border border-primary/50 font-heading text-lg text-primary">
          {currentTenant.name.split(" ").map((p) => p[0]).join("")}
        </div>
        <CardContent className="flex flex-1 items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {currentTenant.name} <span className="font-normal text-muted-foreground">— {currentTenant.origin}</span>
            </p>
            <p className="text-xs text-muted-foreground">{currentTenant.detail}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/90">Checked in</p>
            <p className="text-sm tabular-nums text-muted-foreground">{currency(currentTenant.rate)} / night</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Upcoming</p>
            <div className="divide-y divide-border">
              {upcomingTenants.map((t) => (
                <div key={t.name} className="grid grid-cols-[1.2fr_1fr_auto] py-3 text-sm">
                  <span className="text-foreground/80">{t.name}</span>
                  <span className="text-muted-foreground">{t.origin}</span>
                  <span className="text-right tabular-nums text-foreground/60">{currency(t.rate)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">This month</p>
            <Row label="Nights sold" value={tenantStats.nightsSold} />
            <Row label="Experiential — ~two-thirds" value={tenantStats.experiential} />
            <Row label="Avg. booking window" value={tenantStats.avgWindow} />
            <p className="pt-3 text-xs text-muted-foreground">
              Bookings arrive through the discovery form — stays are set aside for members first.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint**

- [ ] **Step 4: Commit**

```bash
git add src/app/'(main)'/tenants/page.tsx src/app/'(main)'/tenants/_components/tenants-view.tsx
git commit -m "feat: tenants screen"
```

---

## Task 8: Documents

**Files:**
- Create: `src/app/(main)/documents/page.tsx`
- Create: `src/app/(main)/documents/_components/documents-view.tsx`

- [ ] **Step 1: Page**

```tsx
import { DocumentsView } from "./_components/documents-view";

export default function Page() {
  return <DocumentsView />;
}
```

- [ ] **Step 2: View**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { documentLibrary, yourDocuments } from "@/data/member-portal";

export function DocumentsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Documents · Sealed under Ghanaian law · downloadable PDFs
      </p>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Your files</p>
          <div className="divide-y divide-border">
            {yourDocuments.map((d) => (
              <div key={d.name} className="grid grid-cols-[2fr_1fr_1fr_auto] py-3 text-sm">
                <span className="font-medium text-foreground">{d.name}</span>
                <span className="text-muted-foreground">{d.date}</span>
                <span className="text-muted-foreground">{d.status}</span>
                <span className="text-right text-primary">open</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Project library — for members</p>
          <div className="divide-y divide-border">
            {documentLibrary.map((d) => (
              <div key={d.name} className="grid grid-cols-[2fr_1fr_auto] py-3 text-sm">
                <span className="text-foreground/80">{d.name}</span>
                <span className="text-muted-foreground">{d.meta}</span>
                <span className="text-right text-primary">open</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint**

- [ ] **Step 4: Commit**

```bash
git add src/app/'(main)'/documents/page.tsx src/app/'(main)'/documents/_components/documents-view.tsx
git commit -m "feat: documents screen"
```

---

## Task 9: Briefings

**Files:**
- Create: `src/app/(main)/briefings/page.tsx`
- Create: `src/app/(main)/briefings/_components/briefings-view.tsx`

- [ ] **Step 1: Page**

```tsx
import { BriefingsView } from "./_components/briefings-view";

export default function Page() {
  return <BriefingsView />;
}
```

- [ ] **Step 2: View**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { briefings } from "@/data/member-portal";

export function BriefingsView() {
  const [upcoming, ...past] = briefings;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Briefings · Shown in GMT · your timezone</p>

      <Card className="flex items-center gap-5 p-0">
        <CardContent className="flex flex-1 items-center gap-5 py-5">
          <div className="text-center">
            <p className="font-heading text-2xl text-primary">{upcoming.day}</p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{upcoming.month}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{upcoming.title}</p>
            <p className="text-xs text-muted-foreground">{upcoming.meta}</p>
          </div>
          <span className="text-primary">join</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Past</p>
          <div className="divide-y divide-border">
            {past.map((b) => (
              <div key={b.title} className="grid grid-cols-[2fr_1fr_1fr_auto] py-3 text-sm">
                <span className="text-foreground/80">{b.title}</span>
                <span className="text-muted-foreground">{b.day} {b.month}</span>
                <span className="text-muted-foreground">{b.meta.split("·")[0].trim()}</span>
                <span className="text-right text-primary">notes · recording</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4 text-sm">
          <span className="text-muted-foreground">Every briefing is recorded, summarised, and filed to Documents.</span>
          <span className="text-primary">schedule one</span>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint**

- [ ] **Step 4: Commit**

```bash
git add src/app/'(main)'/briefings/page.tsx src/app/'(main)'/briefings/_components/briefings-view.tsx
git commit -m "feat: briefings screen"
```

---

## Task 10: Profile

**Files:**
- Create: `src/app/(main)/profile/page.tsx`
- Create: `src/app/(main)/profile/_components/profile-view.tsx`

- [ ] **Step 1: Page**

```tsx
import { ProfileView } from "./_components/profile-view";

export default function Page() {
  return <ProfileView />;
}
```

- [ ] **Step 2: View**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/data/member-portal";

export function ProfileView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">{profile.kyc}</p>

      <div className="flex items-center gap-6">
        <div className="flex size-14 items-center justify-center rounded-full border border-primary/50 font-heading text-2xl text-primary">
          {profile.initials}
        </div>
        <div>
          <p className="font-heading text-3xl text-foreground">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{profile.route}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Payouts</p>
            <Row label="Settlement" value={profile.settlement} />
            <Row label="Bank on file" value={profile.bank} />
            <Row label="Statement language" value={profile.language} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Security & contact</p>
            <Row label="Two-factor authentication" value={profile.twoFactor} />
            <Row label="Session encryption" value={profile.encryption} />
            <Row label="Phone" value={profile.phone} />
            <Row label="Email" value={profile.email} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-4 text-sm">
          <span className="text-muted-foreground">Your details stay with Swift Holdings — never sold, never shared.</span>
          <span className="text-primary">manage</span>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + lint**

- [ ] **Step 4: Commit**

```bash
git add src/app/'(main)'/profile/page.tsx src/app/'(main)'/profile/_components/profile-view.tsx
git commit -m "feat: profile screen"
```

---

## Task 11: Static login gateway

**Files:**
- Create: `src/app/(main)/(auth)/login/page.tsx`

- [ ] **Step 1: Create the login screen**

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border border-primary/25 bg-card p-8 text-center shadow-xs">
        <p className="font-heading text-lg leading-none">
          THE SWIFT <span className="text-primary">PROJECT</span>
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-primary/75">Private Briefing Portal</p>

        <div className="mt-8 flex flex-col gap-3 text-left">
          <Input type="email" placeholder="Email" className="bg-background" />
          <Input type="password" placeholder="Password" className="bg-background" />
          <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Secure Login
          </Button>
        </div>

        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>Forgot password</span>
          <span>Request access</span>
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-primary/60">
          🔒 Encrypted
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `cd portal && npm run build && npm run lint`

- [ ] **Step 3: Commit**

```bash
git add src/app/'(main)'/'(auth)'/login/page.tsx
git commit -m "feat: static login gateway screen"
```

---

## Task 12: Final build, lint, and deploy

**Files:** none new

- [ ] **Step 1: Full build + lint**

Run: `cd portal && npm run build && npm run lint`
Expected: success, 0 errors.

- [ ] **Step 2: Deploy to the worker**

Run: `cd portal && npx wrangler deploy` (or the project's deploy script). Confirm `https://swiftholdingsportal.securemensah.workers.dev/dashboard/default` loads with the new dark Swift-luxury theme and all 7 screens are reachable from the sidebar.

- [ ] **Step 3: Commit any deploy/config tweaks**

```bash
git add -A && git commit -m "chore: deploy member portal MVP" || echo "nothing to commit"
```

---

## Self-review notes

- **Spec coverage:** Dashboard ✓ (Task 4), Portfolio ✓ (5), Marketplace ✓ (6), Tenants ✓ (7), Documents ✓ (8), Briefings ✓ (9), Profile ✓ (10), Login gateway ✓ (11), shared shell/segmented control ✓ (3), simulated data ✓ (2), theme ✓ (1). Verification ✓ (12).
- **Placeholders:** None — every step has concrete code/commands.
- **Type consistency:** `Capsule`, `Bid`, `Tenant`, `Briefing`, `DocFile`, `DocLibrary`, `Listing`, `LedgerRow`, `Segment` defined once in Task 2 and reused across views; `Row` helper duplicated per view (intentional, co-located) with identical signature.
- **Convention adherence:** Server Components by default; only `bid-box.tsx` and `segmented-control.tsx` are client components; co-located `_components/`; semantic theme tokens only (no arbitrary hex); `@/` alias; Biome style (double quotes, semicolons, 2-space).
