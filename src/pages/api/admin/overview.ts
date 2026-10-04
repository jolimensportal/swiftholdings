import type { APIRoute } from 'astro';
import { desc, eq, sql } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { capsules, kycReviews, listings, members, payouts, revenueLedger } from '@/db/schema';
import { jsonResponse } from '@/utils/api';

/** Operator dashboard rollup. Admin-gated by src/middleware.ts. */
export const GET: APIRoute = async ({ locals }) => {
  const admin = locals.admin;
  if (!admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const env = await getBindings();
  const db = getDb(env);

  const [counts] = await db
    .select({
      members: sql<number>`(SELECT COUNT(*) FROM members)`,
      capsules: sql<number>`(SELECT COUNT(*) FROM capsules)`,
      pendingKyc: sql<number>`(SELECT COUNT(*) FROM kyc_reviews WHERE status = 'pending')`,
      pendingPayouts: sql<number>`(SELECT COUNT(*) FROM payouts WHERE status IN ('pending','processing'))`,
      activeListings: sql<number>`(SELECT COUNT(*) FROM listings WHERE status IN ('active','reserve_met'))`,
      revenueGrossUsd: sql<number>`COALESCE((SELECT SUM(gross_usd) FROM revenue_ledger), 0)`,
      revenueOwnerUsd: sql<number>`COALESCE((SELECT SUM(owner_share_usd) FROM revenue_ledger), 0)`,
    })
    .from(sql`members`)
    .all();

  const tiers = await db
    .select({ tier: members.tier, count: sql<number>`COUNT(*)` })
    .from(members)
    .groupBy(members.tier)
    .all();

  const hubs = await db
    .select({ hub: capsules.hub, count: sql<number>`COUNT(*)` })
    .from(capsules)
    .groupBy(capsules.hub)
    .all();

  const kycQueue = await db
    .select({
      id: kycReviews.id,
      memberId: kycReviews.memberId,
      status: kycReviews.status,
      submittedAt: kycReviews.submittedAt,
    })
    .from(kycReviews)
    .where(eq(kycReviews.status, 'pending'))
    .orderBy(desc(kycReviews.submittedAt))
    .limit(25)
    .all();

  const payoutQueue = await db
    .select({
      id: payouts.id,
      memberId: payouts.memberId,
      capsuleId: payouts.capsuleId,
      amountUsd: payouts.amountUsd,
      status: payouts.status,
      scheduledFor: payouts.scheduledFor,
    })
    .from(payouts)
    .orderBy(desc(payouts.scheduledFor))
    .limit(25)
    .all();

  return jsonResponse({
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    counts: {
      members: counts?.members ?? 0,
      capsules: counts?.capsules ?? 0,
      pendingKyc: counts?.pendingKyc ?? 0,
      pendingPayouts: counts?.pendingPayouts ?? 0,
      activeListings: counts?.activeListings ?? 0,
    },
    revenue: {
      grossUsd: counts?.revenueGrossUsd ?? 0,
      ownerShareUsd: counts?.revenueOwnerUsd ?? 0,
    },
    tiers,
    hubs,
    kycQueue,
    payoutQueue,
  });
};
