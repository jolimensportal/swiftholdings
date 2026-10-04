const encoder = new TextEncoder();
const decoder = new TextDecoder();

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30;
const AUTH_COOKIE = 'swift_auth';

async function importHmacKey(secret: string, usage: 'sign' | 'verify'): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret) as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

function base64urlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? encoder.encode(input) : input;
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function createToken(
  payload: Record<string, unknown>,
  secret: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: issuedAt, exp: issuedAt + ttlSeconds };

  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64urlEncode(JSON.stringify(claims));
  const signingInput = `${header}.${body}`;

  const key = await importHmacKey(secret, 'sign');
  const signature = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput) as BufferSource)
  );

  return `${header}.${body}.${base64urlEncode(signature)}`;
}

export async function verifyToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const signingInput = `${header}.${body}`;

  try {
    const key = await importHmacKey(secret, 'verify');
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(signature) as BufferSource,
      encoder.encode(signingInput) as BufferSource
    );
    if (!valid) return null;

    const claims = JSON.parse(decoder.decode(base64urlDecode(body))) as Record<string, unknown>;

    const exp = claims.exp;
    if (typeof exp === 'number' && exp < Math.floor(Date.now() / 1000)) return null;

    return claims;
  } catch {
    return null;
  }
}

export function getAuthCookie(request: Request): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;

  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === AUTH_COOKIE) return rest.join('=');
  }

  return null;
}

/**
 * Scoped to the whole apex so the session is shared between the marketing host
 * and the portal host — a member signs in once and the portal's server sees the
 * same cookie. Both hosts are ours, so the widened scope is deliberate.
 */
const AUTH_COOKIE_DOMAIN = '.swifthorizon.com.gh';

export function setAuthCookie(headers: Headers, token: string): void {
  headers.append(
    'Set-Cookie',
    `${AUTH_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Domain=${AUTH_COOKIE_DOMAIN}; Path=/; Max-Age=${DEFAULT_TTL_SECONDS}`
  );
}

export function clearAuthCookie(headers: Headers): void {
  headers.append(
    'Set-Cookie',
    `${AUTH_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Domain=${AUTH_COOKIE_DOMAIN}; Path=/; Max-Age=0`
  );
}