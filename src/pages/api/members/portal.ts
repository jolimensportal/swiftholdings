import type { APIRoute } from 'astro';
import { desc, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { briefings, capsules, documents, members, ownerships, revenueLedger } from '@/db/schema';
import { jsonResponse } from '@/utils/api';

/**
 * Everything one signed-in member sees, in a single round trip.
 *
 * Scope is taken from `locals.member.id`, which the middleware derived from the
 * verified session cookie. Nothing here reads an id from the request, so a member
 * cannot ask for someone else's portfolio by changing a query parameter.
 */
export const GET: APIRoute = async ({ locals }) => {
  const member = locals.member;
  if (!member) return jsonResponse({ error: 'Unauthorized' }, 401);

  const env = await getBindings();
  const db = getDb(env);

  const held = await db
    .select({
      capsuleId: capsules.id,
      hub: capsules.hub,
      name: capsules.name,
      phase: capsules.phase,
      status: capsules.status,
      priceUsd: capsules.priceUsd,
      areaSqm: capsules.areaSqm,
      shareRatio: capsules.shareRatio,
      ownedSince: ownerships.ownedSince,
      capitalUnits: ownerships.capitalUnits,
      incomeUnits: ownerships.incomeUnits,
      lockInUntil: ownerships.lockInUntil,
      paymentPlanJson: ownerships.paymentPlanJson,
    })
    .from(ownerships)
    .innerJoin(capsules, eq(ownerships.capsuleId, capsules.id))
    .where(eq(ownerships.memberId, member.id))
    .all();

  const capsuleIds = held.map((row) => row.capsuleId);

  const statements = capsuleIds.length
    ? await db
        .select({
          id: revenueLedger.id,
          capsuleId: revenueLedger.capsuleId,
          month: revenueLedger.month,
          grossUsd: revenueLedger.grossUsd,
          ownerShareUsd: revenueLedger.ownerShareUsd,
          status: revenueLedger.status,
          paidAt: revenueLedger.paidAt,
        })
        .from(revenueLedger)
        .where(inArray(revenueLedger.capsuleId, capsuleIds))
        .orderBy(desc(revenueLedger.month))
        .all()
    : [];

  const docs = await db
    .select({
      id: documents.id,
      type: documents.type,
      name: documents.name,
      r2Key: documents.r2Key,
      mimeType: documents.mimeType,
      sizeBytes: documents.sizeBytes,
      status: documents.status,
      createdAt: documents.createdAt,
      capsuleId: documents.capsuleId,
    })
    .from(documents)
    .where(eq(documents.memberId, member.id))
    .all();

  const upcoming = await db.select().from(briefings).orderBy(desc(briefings.scheduledAt)).all();

  const portfolio = {
    // capital_units + income_units ARE the member's GHS position. Never multiply by
    // the capsule price — price is a separate USD figure.
    capitalUnits: held.reduce((sum, row) => sum + row.capitalUnits, 0),
    incomeUnits: held.reduce((sum, row) => sum + row.incomeUnits, 0),
    capsuleCount: held.length,
  };

  return jsonResponse({
    member: {
      id: member.id,
      email: member.email,
      name: member.name,
      segment: member.segment,
      tier: member.tier,
      kycStatus: member.kycStatus,
    },
    portfolio,
    holdings: held,
    statements,
    documents: docs,
    briefings: upcoming,
  });
};

/** Member-scoped profile update. Tiers and KYC are operator-controlled. */
export const PATCH: APIRoute = async ({ request, locals }) => {
  const member = locals.member;
  if (!member) return jsonResponse({ error: 'Unauthorized' }, 401);

  const body = (await request.json().catch(() => ({}))) as { name?: unknown };

  const name = typeof body.name === 'string' ? body.name.trim() : member.name;
  if (!name) return jsonResponse({ error: 'Name required' }, 400);

  const env = await getBindings();
  const db = getDb(env);

  await db
    .update(members)
    .set({ name, updatedAt: Date.now() })
    .where(eq(members.id, member.id))
    .run();

  return jsonResponse({ ok: true, member: { ...member, name } });
};