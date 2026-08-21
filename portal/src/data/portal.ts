export const member = {
  name: "Kwame Mensah",
  memberId: "SW-0024",
  joined: "Feb 2026",
  greeting: "Good evening",
};

export const portfolio = {
  value: 127_400,
  currency: "GHS",
  capitalUnits: 89_180,
  incomeUnits: 38_220,
  yield: 9.4,
  lockInYear: 1,
  lockInTotal: 5,
  lastDistribution: "GHS 2,998.00 on 30 Jun 2026",
};

export const netWorthSeries = [
  { month: "Feb", value: 50_000 },
  { month: "Mar", value: 57_200 },
  { month: "Apr", value: 64_400 },
  { month: "May", value: 78_600 },
  { month: "Jun", value: 102_900 },
  { month: "Jul", value: 127_400 },
];

export const allocation = [
  { label: "Capital Units", value: 70, color: "var(--color-capital)" },
  { label: "Income Units", value: 30, color: "var(--color-income)" },
];

export const milestones = [
  { label: "Land acquisition", status: "done" as const },
  { label: "Foundation", status: "done" as const },
  { label: "Structure", status: "in-progress" as const },
  { label: "Finishing", status: "pending" as const },
  { label: "Handover", status: "pending" as const },
];

export const fundedUnit = {
  plot: "Plot 14",
  name: "Meridian 3-Bed",
  phase: "Phase 1",
  progress: 40,
  eta: "Q4 2027",
  foundation: "Q4 2026",
};

export const prefabCatalog = [
  {
    id: "P-101",
    name: "Meridian 3-Bed",
    type: "Duplex",
    size: "3 bedrooms / 2 baths / 1,850 sqft",
    phase: "Phase 1",
    price: 50_000,
    units: 48,
    funded: 18,
    status: "Funding open",
  },
  {
    id: "P-102",
    name: "Savannah 4-Bed",
    type: "Detached villa",
    size: "4 bedrooms / 3 baths / 2,400 sqft",
    phase: "Phase 2",
    price: 75_000,
    units: 32,
    funded: 4,
    status: "Early funding",
  },
  {
    id: "P-103",
    name: "Lagoon Studio Court",
    type: "Studio cluster",
    size: "24 studios / 480 sqft each",
    phase: "Phase 2",
    price: 20_000,
    units: 24,
    funded: 2,
    status: "Early funding",
  },
  {
    id: "P-104",
    name: "Keta Waterfront",
    type: "Beachfront units",
    size: "2 bedrooms / 1,200 sqft",
    phase: "Phase 3",
    price: 60_000,
    units: 20,
    funded: 0,
    status: "Coming soon",
  },
  {
    id: "P-105",
    name: "Oyarifa Garden Court",
    type: "Townhome cluster",
    size: "6 townhomes / 1,100 sqft each",
    phase: "Phase 1",
    price: 55_000,
    units: 36,
    funded: 9,
    status: "Funding open",
  },
  {
    id: "P-106",
    name: "Aburi Ridge Bungalow",
    type: "Bungalow",
    size: "2 bedrooms / 1,000 sqft",
    phase: "Phase 2",
    price: 45_000,
    units: 28,
    funded: 6,
    status: "Funding open",
  },
  {
    id: "P-107",
    name: "Kumasi Asante Courtyard",
    type: "Courtyard homes",
    size: "3 bedrooms / 1,600 sqft",
    phase: "Phase 2",
    price: 58_000,
    units: 30,
    funded: 3,
    status: "Early funding",
  },
  {
    id: "P-108",
    name: "Tamale Savannah Loft",
    type: "Loft block",
    size: "12 lofts / 640 sqft each",
    phase: "Phase 3",
    price: 22_000,
    units: 24,
    funded: 0,
    status: "Coming soon",
  },
  {
    id: "P-109",
    name: "Takoradi Harbour Studios",
    type: "Studio block",
    size: "30 studios / 420 sqft each",
    phase: "Phase 3",
    price: 18_000,
    units: 30,
    funded: 1,
    status: "Early funding",
  },
  {
    id: "P-110",
    name: "Osu Sky Terrace",
    type: "Apartment",
    size: "2 bedrooms / 1,300 sqft",
    phase: "Phase 1",
    price: 65_000,
    units: 40,
    funded: 22,
    status: "Funding open",
  },
  {
    id: "P-111",
    name: "Cape Coast Clifftop",
    type: "Detached villa",
    size: "4 bedrooms / 2,200 sqft",
    phase: "Phase 3",
    price: 82_000,
    units: 18,
    funded: 0,
    status: "Coming soon",
  },
  {
    id: "P-112",
    name: "Accra Polo Garden",
    type: "Duplex",
    size: "3 bedrooms / 1,900 sqft",
    phase: "Phase 2",
    price: 68_000,
    units: 34,
    funded: 11,
    status: "Funding open",
  },
];

export const statements = [
  { period: "Q2 2026", income: "GHS 2,998.00", capital: "GHS 0.00", yield: "9.4%", paid: "30 Jun 2026", status: "Paid" },
  { period: "Q1 2026", income: "GHS 1,862.00", capital: "GHS 0.00", yield: "7.2%", paid: "31 Mar 2026", status: "Paid" },
  { period: "Q4 2025", income: "—", capital: "GHS 50,000.00", yield: "—", paid: "—", status: "Funding" },
];

export const documents = [
  { id: "DOC-0142", name: "Prefab Unit Subscription Agreement", type: "PDF", size: "1.2 MB", date: "14 Feb 2026", status: "Signed" },
  { id: "DOC-0143", name: "Project Development Plan — Phase 1", type: "PDF", size: "4.8 MB", date: "14 Feb 2026", status: "Signed" },
  { id: "DOC-0151", name: "Q1 2026 Statement of Account", type: "PDF", size: "320 KB", date: "31 Mar 2026", status: "Issued" },
  { id: "DOC-0160", name: "Q2 2026 Statement of Account", type: "PDF", size: "340 KB", date: "30 Jun 2026", status: "Issued" },
  { id: "DOC-0161", name: "Land Title — Plot 14, Meridian", type: "PDF", size: "2.1 MB", date: "30 Jun 2026", status: "Issued" },
];

export const briefings = [
  { id: "B-2026-03", title: "Phase 1 Foundation Milestone Reached", date: "12 Jul 2026", category: "Construction", excerpt: "Foundation works on all 48 Meridian units are complete ahead of schedule. Structural works begin this month." },
  { id: "B-2026-02", title: "Q2 2026 Distribution Announcement", date: "30 Jun 2026", category: "Distributions", excerpt: "Members earn a 9.4% annualised yield on income units for Q2. Distributions were paid on 30 June." },
  { id: "B-2026-01", title: "Phase 2 Opens — Savannah & Lagoon", date: "2 Jun 2026", category: "New projects", excerpt: "Early funding is now open for the Savannah 4-Bed and Lagoon Studio Court. Existing members fund first." },
];