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
  const cookie = jar.get("swift_auth") ? `swift_auth=${jar.get("swift_auth")?.value}` : "";

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

/**
 * Identity for whichever session is present. Admins are not members, so the
 * member endpoint 401s for them; without this, every member screen threw an
 * error page when a super admin navigated there.
 */
export async function getViewer(): Promise<
  | { kind: "member"; member: PortalMember }
  | { kind: "admin"; admin: { id: string; email: string; name: string; role: string } }
  | null
> {
  const admin = await getAdminOverview();
  if (admin) return { kind: "admin", admin: admin.admin };

  const portal = await getPortalData();
  if (portal) return { kind: "member", member: portal.member };

  return null;
}

export async function getAdminOverview(): Promise<AdminOverview | null> {
  return apiFetch<AdminOverview>("/api/admin/overview");
}

export async function getAdminMembers(): Promise<AdminMemberRow[]> {
  const body = await apiFetch<{ members: AdminMemberRow[] }>("/api/admin/members");
  return body?.members ?? [];
}

export interface AdminCapsuleImage {
  id: string;
  position: number;
  isHero: boolean;
  caption: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
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
  images: AdminCapsuleImage[];
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
/**
 * Operator mail console types and calls.
 *
 * Mutations go through `apiMutate`, not `apiFetch`: the console POSTs with a
 * JSON body, and the marketing Worker requires one. `apiFetch` has no body
 * parameter and no error channel, so reusing it would mean silently dropping the
 * operator's message on any 4xx.
 */
export interface EmailContact {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  handled: boolean;
}

export interface EmailDirectoryRow {
  id: string;
  name: string;
  email: string;
  segment: string;
  tier: string;
  createdAt: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

export interface EmailConsoleData {
  enquiries: EmailContact[];
  directory: EmailDirectoryRow[];
  templates: EmailTemplate[];
}

export async function getEmailConsoleData(): Promise<EmailConsoleData | null> {
  return apiFetch<EmailConsoleData>("/api/admin/email");
}

interface MutateResult {
  ok: boolean;
  status: number;
  error?: string;
  detail?: string;
  id?: string;
}

async function apiMutate(path: string, payload: Record<string, unknown>): Promise<MutateResult> {
  const jar = await cookies();
  const token = jar.get("swift_auth")?.value;

  try {
    const response = await fetch(`${API_ORIGIN}${path}`, {
      method: "POST",
      headers: {
        cookie: token ? `swift_auth=${token}` : "",
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      detail?: string;
      id?: string;
    };

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: body.error ?? "The request was rejected.",
        detail: body.detail,
      };
    }

    return { ok: true, status: response.status, id: body.id };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the mail service." };
  }
}

export function sendEmailFromConsole(message: { to: string[]; subject: string; body: string }): Promise<MutateResult> {
  return apiMutate("/api/admin/email", { action: "send", ...message });
}

export function saveEmailTemplate(template: {
  id?: string;
  name: string;
  subject: string;
  body: string;
}): Promise<MutateResult> {
  return apiMutate("/api/admin/email", { action: "save-template", ...template });
}

export function deleteEmailTemplate(id: string): Promise<MutateResult> {
  return apiMutate("/api/admin/email", { action: "delete-template", id });
}
