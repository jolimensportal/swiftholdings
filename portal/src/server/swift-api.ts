import { cookies } from "next/headers";

/**
 * Server-side client for the marketing Worker API, which owns the D1 database.
 * The portal renders no numbers of its own — everything here is real.
 *
 * The session cookie is scoped to `.swifthorizon.com.gh`, so it is readable here
 * and is forwarded verbatim. Server-side fetching means no CORS round trip and
 * no token ever reaches the browser bundle.
 */
const API_ORIGIN = process.env.SWIFT_API_ORIGIN ?? "https://swifthorizon.com.gh";

export interface PortalMember {
  id: string;
  email: string;
  name: string;
  segment: "ghanaian" | "diaspora" | "institutional";
  tier: "guest" | "member" | "owner-investor";
  kycStatus: "pending" | "approved" | "rejected" | "needs_info";
}

export interface Holding {
  capsuleId: string;
  hub: string;
  name: string;
  phase: number;
  status: "building" | "in-revenue" | "completed";
  priceUsd: number;
  areaSqm: number;
  shareRatio: string;
  ownedSince: number;
  capitalUnits: number;
  incomeUnits: number;
  lockInUntil: number | null;
  paymentPlanJson: string | null;
}

export interface Statement {
  id: number;
  capsuleId: string;
  month: string;
  grossUsd: number;
  ownerShareUsd: number;
  status: "paid" | "pending" | "processing";
  paidAt: number | null;
}

export interface PortalDocument {
  id: string;
  type: string;
  name: string;
  r2Key: string;
  mimeType: string | null;
  sizeBytes: number | null;
  status: string;
  createdAt: number;
  capsuleId: string | null;
}

export interface Briefing {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: number;
  durationMin: number;
  host: string | null;
}

export interface PortalPayload {
  member: PortalMember;
  portfolio: { capitalUnits: number; incomeUnits: number; capsuleCount: number };
  holdings: Holding[];
  statements: Statement[];
  documents: PortalDocument[];
  briefings: Briefing[];
}

async function apiFetch<T>(path: string): Promise<T | null> {
  const jar = await cookies();
  const cookie = jar
    .get("swift_auth")
    ? `swift_auth=${jar.get("swift_auth")?.value}`
    : "";

  try {
    const response = await fetch(`${API_ORIGIN}${path}`, {
      headers: { cookie, accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export interface AdminMemberRow {
  id: string;
  email: string;
  name: string;
  segment: string;
  tier: string;
  kycStatus: string;
  createdAt: number;
}

export interface AdminOverview {
  admin: { id: string; email: string; name: string; role: string };
  counts: {
    members: number;
    capsules: number;
    pendingKyc: number;
    pendingPayouts: number;
    activeListings: number;
  };
  revenue: { grossUsd: number; ownerShareUsd: number };
  tiers: { tier: string; count: number }[];
  hubs: { hub: string; count: number }[];
  kycQueue: { id: string; memberId: string; status: string; submittedAt: number }[];
  payoutQueue: {
    id: string;
    memberId: string;
    capsuleId: string;
    amountUsd: number;
    status: string;
    scheduledFor: number;
  }[];
}

/** Returns null when signed out, so callers can render a signed-out state. */
export async function getPortalData(): Promise<PortalPayload | null> {
  return apiFetch<PortalPayload>("/api/members/portal");
}

export async function getAdminOverview(): Promise<AdminOverview | null> {
  return apiFetch<AdminOverview>("/api/admin/overview");
}

export async function getAdminMembers(): Promise<AdminMemberRow[]> {
  const body = await apiFetch<{ members: AdminMemberRow[] }>("/api/admin/members");
  return body?.members ?? [];
}

export interface AdminCapsuleRow {
  id: string;
  hub: string;
  name: string;
  phase: number;
  status: "building" | "in-revenue" | "completed";
  priceUsd: number;
  areaSqm: number;
  shareRatio: string;
  owners: number;
  capitalUnits: number;
}

export async function getAdminCapsules(): Promise<AdminCapsuleRow[]> {
  const body = await apiFetch<{ capsules: AdminCapsuleRow[] }>("/api/admin/capsules");
  return body?.capsules ?? [];
}

/**
 * Every `*_usd` integer column in D1 is stored in CENTS, not dollars.
 * Proof: revenue_ledger 2026-08 holds grossUsd 231000, which is $2,310 —
 * the figure the old mock file displayed as `gross: 2310`.
 *
 * All money goes through these two helpers so the conversion lives in exactly
 * one place. If the schema is ever migrated to whole dollars, only this
 * comment and the two divisors change.
 */
export const centsToUsd = (cents: number): number => cents / 100;

export const formatUsd = (cents: number): string =>
  `$${centsToUsd(cents).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/** GHS position figures (capital_units, income_units) are whole pesewas already. */
export const formatGhs = (amount: number): string =>
  `GHS ${Math.round(amount).toLocaleString("en-GH", { maximumFractionDigits: 0 })}`;

/**
 * Presence of the cookie is not authority. The marketing Worker is the only
 * thing that can mint one, and an admin layout must additionally prove the
 * caller holds an admin session — otherwise any member could read /admin/*.
 */
export async function isAdminSession(): Promise<boolean> {
  const overview = await getAdminOverview();
  return overview !== null;
}