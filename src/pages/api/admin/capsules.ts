import type { APIRoute } from 'astro';
import { asc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { capsules, ownerships } from '@/db/schema';
import { jsonResponse } from '@/utils/api';

/** Capsule inventory with occupancy, for the operator console. */
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const env = await getBindings();
  const db = getDb(env);

  const rows = await db.select().from(capsules).orderBy(asc(capsules.hub)).all();

  const held = await db.select().from(ownerships).all();

  const withOwners = rows.map((c) => ({
    ...c,
    // price_usd and the counts are integer columns; price_usd is cents.
    owners: held.filter((o) => o.capsuleId === c.id).length,
    capitalUnits: held
      .filter((o) => o.capsuleId === c.id)
      .reduce((sum, o) => sum + o.capitalUnits, 0),
  }));

  return jsonResponse({ capsules: withOwners });
};