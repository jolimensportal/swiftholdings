import type { APIRoute } from 'astro';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { contactEnquiries, emailTemplates, members } from '@/db/schema';
import { DEFAULT_SENDER, escapeHtml, resendRequest } from '@/lib/email';
import { errorResponse, jsonResponse } from '@/utils/api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_TO = 20;
const MAX_SUBJECT = 200;
const MAX_BODY = 20_000;
const MAX_TEMPLATE_NAME = 80;
const MAX_TEMPLATE_BODY = 20_000;

/**
 * Operator mail console.
 *
 * Admin-only (`locals.admin`), which is the whole security story: any account
 * that could reach this endpoint could send mail that looks like it came from
 * the company, and one abused domain gets the domain listed.
 *
 * GET returns everything the composer needs in a single request — the people who
 * actually enquired, the member directory, and saved templates. Splitting these
 * across three endpoints would only add round trips to a screen that renders all
 * three at once.
 */
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const env = await getBindings();
  const db = getDb(env);

  const [enquiries, directory, templates] = await Promise.all([
    db
      .select({
        id: contactEnquiries.id,
        name: contactEnquiries.name,
        email: contactEnquiries.email,
        createdAt: contactEnquiries.createdAt,
        handled: contactEnquiries.handled,
      })
      .from(contactEnquiries)
      .orderBy(desc(contactEnquiries.createdAt))
      .limit(200)
      .all(),
    db
      .select({
        id: members.id,
        name: members.name,
        email: members.email,
        segment: members.segment,
        tier: members.tier,
        createdAt: members.createdAt,
      })
      .from(members)
      .orderBy(desc(members.createdAt))
      .limit(200)
      .all(),
    db
      .select()
      .from(emailTemplates)
      .orderBy(desc(emailTemplates.updatedAt))
      .all(),
  ]);

  return jsonResponse({ enquiries, directory, templates });
};

type Action = 'send' | 'save-template' | 'delete-template';

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (raw === null || typeof raw !== 'object') {
    return errorResponse('Expected a JSON body.', 400);
  }

  const action = String(raw.action ?? 'send') as Action;

  const env = await getBindings();
  const db = getDb(env);
  const now = Date.now();

  if (action === 'delete-template') {
    const id = String(raw.id ?? '').trim();

    if (id === '') return errorResponse('Missing template id.', 400);

    await db.delete(emailTemplates).where(eq(emailTemplates.id, id)).run();

    return jsonResponse({ ok: true });
  }

  if (action === 'save-template') {
    const name = String(raw.name ?? '').trim();
    const subject = String(raw.subject ?? '').trim();
    const body = String(raw.body ?? '').trim();
    const id = String(raw.id ?? '').trim();

    if (name === '' || name.length > MAX_TEMPLATE_NAME) {
      return errorResponse('Give the template a short name.', 400);
    }
    if (subject === '' || subject.length > MAX_SUBJECT) {
      return errorResponse('The template needs a subject.', 400);
    }
    if (body === '' || body.length > MAX_TEMPLATE_BODY) {
      return errorResponse('The template body is empty or too long.', 400);
    }

    // No unique index on name, so editing is an explicit id and creating is not.
    // That keeps two admins from clobbering each other's templates by typing the
    // same label.
    if (id !== '') {
      await db
        .update(emailTemplates)
        .set({ name, subject, body, updatedAt: now })
        .where(eq(emailTemplates.id, id))
        .run();

      return jsonResponse({ ok: true, id });
    }

    const newId = `TPL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    await db
      .insert(emailTemplates)
      .values({ id: newId, name, subject, body, createdAt: now, updatedAt: now })
      .run();

    return jsonResponse({ ok: true, id: newId });
  }

  // action === 'send'
  const to = Array.isArray(raw.to)
    ? raw.to.map((entry) => String(entry).trim().toLowerCase()).filter(Boolean)
    : [];
  const subject = String(raw.subject ?? '').trim();
  const body = String(raw.body ?? '').trim();

  if (to.length === 0) return errorResponse('Add at least one recipient.', 400);
  if (to.length > MAX_TO) return errorResponse(`At most ${MAX_TO} recipients per message.`, 400);

  const badAddress = to.find((address) => !EMAIL_PATTERN.test(address));

  if (badAddress !== undefined) {
    return errorResponse(`"${badAddress}" is not a valid email address.`, 400);
  }
  if (subject === '' || subject.length > MAX_SUBJECT) {
    return errorResponse('The message needs a subject.', 400);
  }
  if (body === '' || body.length > MAX_BODY) {
    return errorResponse('The message body is empty or too long.', 400);
  }

  // Resend caps a single send at 50 recipients; we stay well under it.
  const result = await resendRequest(env.RESEND_API_KEY, {
    from: DEFAULT_SENDER,
    to,
    subject,
    // The operator is the author, so replies go to the console's own mailbox
    // rather than bouncing off a no-reply address nobody reads.
    replyTo: env.NOTIFY_EMAIL ?? 'info@swifthorizon.com.gh',
    text: body,
    html: `<div style="font:16px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a20">${escapeHtml(body)
      .split(/\n{2,}/)
      .map((block) => `<p style="margin:0 0 12px">${block.replace(/\n/g, '<br />')}</p>`)
      .join('')}</div>`,
  });

  if (result.sent === false) {
    if (result.configured === false) {
      return errorResponse('Outbound mail is not configured on this deployment.', 503);
    }

    console.error('[admin/email] send failed:', result.error);

    return errorResponse('Resend rejected the message.', 502, { detail: result.error });
  }

  return jsonResponse({ ok: true, id: result.id, recipients: to });
};