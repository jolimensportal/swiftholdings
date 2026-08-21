// Simulated Super Admin ops-console data. No backend.
export type Segment = "ghanaian" | "diaspora" | "institutional";
export type KycStatus = "verified" | "pending" | "review";

export interface Member {
  id: string;
  name: string;
  segment: Segment;
  origin: string;
  capsules: number;
  kyc: KycStatus;
  payout: string;
  joined: string;
}

export const members: Member[] = [
  { id: "M-001", name: "Kofi Owusu", segment: "diaspora", origin: "Toronto → Accra", capsules: 2, kyc: "verified", payout: "USD held / GHS settled", joined: "Mar 2026" },
  { id: "M-002", name: "Ama Mensah", segment: "ghanaian", origin: "Accra", capsules: 1, kyc: "verified", payout: "GHS direct", joined: "Feb 2026" },
  { id: "M-003", name: "Ekow Boateng", segment: "diaspora", origin: "London", capsules: 1, kyc: "pending", payout: "USD held", joined: "Jul 2026" },
  { id: "M-004", name: "Mzeni Capital", segment: "institutional", origin: "Accra / Lagos", capsules: 5, kyc: "verified", payout: "USD wire", joined: "Jan 2026" },
  { id: "M-005", name: "Yaa Asantewaa", segment: "ghanaian", origin: "Kumasi", capsules: 1, kyc: "pending", payout: "GHS direct", joined: "Aug 2026" },
  { id: "M-006", name: "Jonathan Mettle", segment: "diaspora", origin: "New York", capsules: 1, kyc: "verified", payout: "USD held", joined: "May 2026" },
];

export interface AdminCapsule {
  id: string;
  name: string;
  location: string;
  owner: string;
  segment: Segment;
  status: "in-revenue" | "building" | "listed";
  occupancy: number;
  grossMonthly: number;
}

export const capsules: AdminCapsule[] = [
  { id: "P7-012", name: "Oyarifa", location: "Oyarifa, Accra", owner: "Kofi Owusu", segment: "diaspora", status: "in-revenue", occupancy: 88, grossMonthly: 2310 },
  { id: "P7-018", name: "Tamale", location: "Tamale", owner: "Kofi Owusu", segment: "diaspora", status: "building", occupancy: 0, grossMonthly: 0 },
  { id: "P7-014", name: "Aburi Return", location: "Aburi, Accra", owner: "Mzeni Capital", segment: "institutional", status: "listed", occupancy: 0, grossMonthly: 0 },
  { id: "P7-022", name: "Tamale Transfer", location: "Tamale", owner: "Mzeni Capital", segment: "institutional", status: "listed", occupancy: 0, grossMonthly: 0 },
  { id: "P7-031", name: "Kumasi Expiry", location: "Kumasi", owner: "Yaa Asantewaa", segment: "ghanaian", status: "listed", occupancy: 0, grossMonthly: 0 },
  { id: "P7-007", name: "Osu Loft", location: "Osu, Accra", owner: "Ama Mensah", segment: "ghanaian", status: "in-revenue", occupancy: 76, grossMonthly: 1980 },
];

export interface PayoutRun {
  id: string;
  period: string;
  member: string;
  usd: number;
  ghs: number;
  status: "settled" | "processing" | "held";
}

export const payouts: PayoutRun[] = [
  { id: "PR-081", period: "Aug 2026", member: "Kofi Owusu", usd: 1617, ghs: 0, status: "processing" },
  { id: "PR-082", period: "Aug 2026", member: "Ama Mensah", usd: 0, ghs: 15230, status: "settled" },
  { id: "PR-083", period: "Aug 2026", member: "Mzeni Capital", usd: 8420, ghs: 0, status: "processing" },
  { id: "PR-084", period: "Jul 2026", member: "Jonathan Mettle", usd: 1290, ghs: 0, status: "held" },
  { id: "PR-085", period: "Jul 2026", member: "Kofi Owusu", usd: 1617, ghs: 0, status: "settled" },
];

export interface KycReview {
  id: string;
  member: string;
  document: string;
  submitted: string;
  status: "pending" | "review";
}

export const kycQueue: KycReview[] = [
  { id: "KYC-114", member: "Ekow Boateng", document: "Passport + Proof of address", submitted: "18 Aug 2026", status: "pending" },
  { id: "KYC-115", member: "Yaa Asantewaa", document: "Ghana Card + Title memo", submitted: "19 Aug 2026", status: "review" },
  { id: "KYC-116", member: "Jonathan Mettle", document: "Renewal — 2FA device", submitted: "20 Aug 2026", status: "pending" },
];

export interface ContentItem {
  id: string;
  title: string;
  type: "Briefing" | "Document";
  status: "draft" | "published";
  date: string;
}

export const contentItems: ContentItem[] = [
  { id: "C-01", title: "Partnership briefing — A. Mensah", type: "Briefing", status: "published", date: "20 Aug 2026" },
  { id: "C-02", title: "Q3 revenue statement template", type: "Document", status: "draft", date: "21 Aug 2026" },
  { id: "C-03", title: "Institutional hospitality whitepaper", type: "Document", status: "published", date: "12 Aug 2026" },
  { id: "C-04", title: "Discovery briefing (recorded)", type: "Briefing", status: "published", date: "04 Aug 2026" },
];

export interface SettingRow {
  label: string;
  value: string;
  note: string;
}

export const settings: SettingRow[] = [
  { label: "Platform mode", value: "Live (investor demo)", note: "Public member portal enabled" },
  { label: "Payout currency", value: "USD held / GHS monthly", note: "Settlement cadence: monthly" },
  { label: "KYC provider", value: "Goldstreet Verify", note: "Auto-review on upload" },
  { label: "Discovery form", value: "Open", note: "Stays set aside for members first" },
  { label: "Briefing recordings", value: "Auto-file to Documents", note: "Encrypted at rest" },
];

export const segmentLabel = (s: Segment) =>
  s === "ghanaian" ? "Ghanaian" : s === "diaspora" ? "Diaspora" : "Institutional";

export const kycLabel = (k: KycStatus) =>
  k === "verified" ? "Verified" : k === "pending" ? "Pending" : "In review";
