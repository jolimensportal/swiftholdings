import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { members } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, createMemberSession, createAuthHeaders } from '@/lib/auth/session';

type Segment = 'ghanaian' | 'diaspora' | 'institutional';

interface RegisterBody {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  segment?: unknown;
}

const isSegment = (value: unknown): value is Segment =>
  value === 'ghanaian' || value === 'diaspora' || value === 'institutional';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = await getBindings();
  const db = getDb(env);

  const body = (await request.json().catch(() => ({}))) as RegisterBody;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !name || !password) {
    return Response.json({ error: 'Email, password, and name required' }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existing = await db.select().from(members).where(eq(members.email, email)).get();
  if (existing) {
    return Response.json({ error: 'Email already registered' }, { status: 409 });
  }

  const id = `SW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const now = Date.now();

  await db
    .insert(members)
    .values({
      id,
      email,
      name,
      passwordHash: await hashPassword(password),
      segment: isSegment(body.segment) ? body.segment : 'diaspora',
      tier: 'guest',
      kycStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    .run();

  const result = await createMemberSession(db, email, password, env.JWT_SECRET);
  if (!result) {
    return Response.json({ member: { id, email, name } }, { status: 201 });
  }

  return Response.json({ member: result.member }, { status: 201, headers: createAuthHeaders(result.token) });
};