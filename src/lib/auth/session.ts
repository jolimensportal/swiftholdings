import { getDb, type Db } from '@/db/client';
import { members, adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createToken, verifyToken, getAuthCookie, setAuthCookie, clearAuthCookie } from './jwt';

/**
 * Workers' WebCrypto refuses PBKDF2 above 100k iterations
 * (NotSupportedError: "iteration counts above 100000 are not supported"),
 * so 100k is both the ceiling and the right default here.
 */
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_MAX_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;

const encoder = new TextEncoder();

export interface MemberSession {
  id: string;
  email: string;
  name: string;
  segment: string;
  tier: string;
  kycStatus: string;
}

export interface AdminSession {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Stored format: pbkdf2$<iterations>$<saltHex>$<hashHex> */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, 100_000);
  return `pbkdf2$100000$${toHex(salt)}$${toHex(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations < 1) return false;
  const safeIterations = Math.min(iterations, 100_000);

  const computed = await pbkdf2(password, fromHex(parts[2]), safeIterations);
  return constantTimeEqual(computed, fromHex(parts[3]));
}

export async function createMemberSession(
  db: Db,
  email: string,
  password: string,
  secret: string
): Promise<{ token: string; member: MemberSession } | null> {
  const member = await db.select().from(members).where(eq(members.email, email)).get();
  if (!member) return null;

  if (!(await verifyPassword(password, member.passwordHash))) return null;

  const token = await createToken(
    {
      sub: member.id,
      email: member.email,
      role: 'member',
      tier: member.tier,
    },
    secret
  );

  return {
    token,
    member: {
      id: member.id,
      email: member.email,
      name: member.name,
      segment: member.segment,
      tier: member.tier,
      kycStatus: member.kycStatus,
    },
  };
}

export async function createAdminSession(
  db: Db,
  email: string,
  password: string,
  secret: string
): Promise<{ token: string; admin: AdminSession } | null> {
  const admin = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).get();
  if (!admin) return null;

  if (!(await verifyPassword(password, admin.passwordHash))) return null;

  const token = await createToken({ sub: admin.id, email: admin.email, role: 'admin' }, secret);

  return {
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  };
}

export async function getMemberFromRequest(request: Request, db: Db, secret: string): Promise<MemberSession | null> {
  const token = getAuthCookie(request);
  if (!token) return null;

  const claims = await verifyToken(token, secret);
  if (!claims || claims.role !== 'member' || typeof claims.sub !== 'string') return null;

  const member = await db.select().from(members).where(eq(members.id, claims.sub)).get();
  if (!member) return null;

  return {
    id: member.id,
    email: member.email,
    name: member.name,
    segment: member.segment,
    tier: member.tier,
    kycStatus: member.kycStatus,
  };
}

export async function getAdminFromRequest(request: Request, db: Db, secret: string): Promise<AdminSession | null> {
  const token = getAuthCookie(request);
  if (!token) return null;

  const claims = await verifyToken(token, secret);
  if (!claims || claims.role !== 'admin' || typeof claims.sub !== 'string') return null;

  const admin = await db.select().from(adminUsers).where(eq(adminUsers.id, claims.sub)).get();
  if (!admin) return null;

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

export function createAuthHeaders(token: string): Headers {
  const headers = new Headers();
  setAuthCookie(headers, token);
  return headers;
}

export function createLogoutHeaders(): Headers {
  const headers = new Headers();
  clearAuthCookie(headers);
  return headers;
}
