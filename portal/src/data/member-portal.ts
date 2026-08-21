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
