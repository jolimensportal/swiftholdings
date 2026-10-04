import type { APIRoute } from 'astro';
import { desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { members } from '@/db/schema';
import { jsonResponse } from '@/utils/api';

/** Operator member directory. Password hashes are never selected. */
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const env = await getBindings();
  const db = getDb(env);

  const rows = await db
    .select({
      id: members.id,
      email: members.email,
      name: members.name,
      segment: members.segment,
      tier: members.tier,
      kycStatus: members.kycStatus,
      createdAt: members.createdAt,
    })
    .from(members)
    .orderBy(desc(members.createdAt))
    .limit(200)
    .all();

  return jsonResponse({ members: rows });
};