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

/** Returns null when signed out, so callers can render a signed-out state. */
export async function getPortalData(): Promise<PortalPayload | null> {
  return apiFetch<PortalPayload>("/api/members/portal");
}

export async function getAdminOverview(): Promise<unknown | null> {
  return apiFetch("/api/admin/overview");
}