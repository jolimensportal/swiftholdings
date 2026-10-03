import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { members, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  createAuthHeaders,
  createMemberSession,
  hashPassword,
} from '@/lib/auth/session';
import { validateDiscoveryInput, type DiscoveryInput } from '@/data/marketing/discovery';
import { errorResponse, jsonResponse, sameOriginRequest } from '@/utils/api';
import { getClientIp, rateLimit } from '@/utils/rate-limit';

type MemberSegment = 'ghanaian' | 'diaspora' | 'institutional';

/**
 * The discovery flow labels the Ghanaian profile "local"; the members table
 * enum calls it "ghanaian". Writing the form's value straight through would
 * violate the column enum.
 */
const SEGMENT_BY_DISCOVERY_ID: Record<string, MemberSegment> = {
  local: 'ghanaian',
  ghanaian: 'ghanaian',
  diaspora: 'diaspora',
  institutional: 'institutional',
};

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const asOptional = (value: unknown): string | undefined => {
  const text = asString(value).trim();
  return text === '' ? undefined : text;
};

/**
 * The briefing form's five steps. Previously this handler read `firstName` and
 * `lastName`, which nothing has ever sent, so every submission returned 400 and
 * every lead was lost. It also returned `{ success, memberId }` while the form
 * reads `{ ok, member }`, and wrote `passwordHash: ''`, discarding the password
 * the form asked the user to create.
 */
export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(`discovery:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return errorResponse('Too many attempts. Please try again later.', 429, {
      retryAfterSec: limited.retryAfterSec,
    });
  }

  if (!sameOriginRequest(request)) {
    return errorResponse('Cross-origin requests are not allowed.', 403);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return errorResponse('Expected a JSON body.', 415);
  }

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (raw === null || typeof raw !== 'object') {
    return errorResponse('Expected a JSON body.', 400);
  }

  const input: DiscoveryInput = {
    name: asString(raw.name),
    email: asString(raw.email),
    phone: asOptional(raw.phone),
    password: asString(raw.password),
    segment: asString(raw.segment),
    intent: asString(raw.intent),
    bracket: asOptional(raw.bracket),
    timezone: asString(raw.timezone),
    slotDate: asString(raw.slotDate),
    slotTime: asString(raw.slotTime),
  };

  // The form validates before submitting, but the server cannot trust that.
  const validation = validateDiscoveryInput(input);

  if (!validation.ok) {
    return errorResponse('Please correct the highlighted fields.', 400, {
      errors: validation.errors,
    });
  }

  const env = await getBindings();
  const db = getDb(env);

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const segment = SEGMENT_BY_DISCOVERY_ID[input.segment] ?? 'diaspora';
  const now = Date.now();

  const existing = await db.select().from(members).where(eq(members.email, email)).get();

  const memberId = existing?.id ?? `SW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  if (existing === undefined) {
    await db
      .insert(members)
      .values({
        id: memberId,
        email,
        name,
        passwordHash: await hashPassword(input.password),
        segment,
        tier: 'guest',
        kycStatus: 'pending',
        createdAt: now,
        updatedAt: now,
      })
      .run();
  }

  // The members table has no columns for the qualification answers and there is
  // no leads table, so the submission is kept as a member notification rather
  // than silently dropped.
  await db
    .insert(notifications)
    .values({
      id: `NT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      memberId,
      type: 'discovery',
      title: `Discovery briefing request — ${input.intent}`,
      body: input.bracket ?? null,
      dataJson: JSON.stringify({
        segment: input.segment,
        intent: input.intent,
        bracket: input.bracket ?? null,
        phone: input.phone ?? null,
        timezone: input.timezone,
        slotDate: input.slotDate,
        slotTime: input.slotTime,
      }),
      createdAt: now,
    })
    .run();

  if (existing !== undefined) {
    return jsonResponse({
      ok: true,
      alreadyMember: true,
      member: { name: existing.name, email: existing.email },
    });
  }

  const session = await createMemberSession(db, email, input.password);

  if (session === null) {
    return jsonResponse({ ok: true, member: { name, email } }, 201);
  }

  return jsonResponse(
    { ok: true, member: session.member },
    201,
    createAuthHeaders(session.token),
  );
};