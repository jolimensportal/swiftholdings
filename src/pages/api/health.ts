import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { feedback } from '@/db/schema';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getDb(await getBindings());
    await db.select().from(feedback).limit(1).all();
    return Response.json({ ok: true, database: 'up' });
  } catch (error) {
    console.error('health check failed:', error);
    return Response.json({ ok: false, database: 'down' }, { status: 503 });
  }
};
