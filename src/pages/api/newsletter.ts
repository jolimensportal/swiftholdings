import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { members } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDb(await getBindings());
  const body = (await request.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email required' }, { status: 400 });
  }

  const existing = await db.select().from(members).where(eq(members.email, email)).get();
  if (existing) return Response.json({ success: true, message: 'Already subscribed' });

  const now = Date.now();
  await db
    .insert(members)
    .values({
      id: `NL-${Date.now().toString(36).toUpperCase()}`,
      email,
      name: email.split('@')[0],
      passwordHash: '',
      segment: 'diaspora',
      tier: 'guest',
      kycStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    .run();

  return Response.json({ success: true }, { status: 201 });
};
