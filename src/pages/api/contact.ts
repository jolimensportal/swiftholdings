import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { contactEnquiries } from '@/db/schema';
import { deliverFormPayload } from '@/utils/api';
import { errorResponse, jsonResponse, sameOriginRequest } from '@/utils/api';
import { getClientIp, rateLimit } from '@/utils/rate-limit';
import { sendEmail } from '@/lib/email';

/**
 * Public contact enquiries.
 *
 * This used to validate the three fields, return `{ success: true }`, and throw
 * the message away — a completed enquiry went nowhere at all. It now persists to
 * `contact_enquiries`, and forwards to a webhook when one is configured, so email
 * delivery is a configuration change rather than a code change.
 */

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MESSAGE = 4000;

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(`contact:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return errorResponse('Too many attempts. Please try again shortly.', 429, {
      retryAfterSec: limited.retryAfterSec,
    });
  }

  if (!sameOriginRequest(request)) {
    return errorResponse('Cross-origin requests are not allowed.', 403);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return errorResponse('Expected a JSON body.', 415);
  }

  const raw = (await request.json().catch(() => null)) as ContactBody | null;

  if (raw === null || typeof raw !== 'object') {
    return errorResponse('Expected a JSON body.', 400);
  }

  // Honeypot: the field is hidden from people and left empty by them, so a
  // filled value means a bot. Answer as though it succeeded, so the bot learns
  // nothing, and store nothing.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return jsonResponse({ message: 'Thank you — we will be in touch.' }, 201);
  }

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = 'Please tell us your name.';
  if (!EMAIL_PATTERN.test(email)) errors.email = 'That email address does not look right.';
  if (message.length < 5) errors.message = 'Please add a little more detail.';
  if (message.length > MAX_MESSAGE) errors.message = 'Please keep it under 4000 characters.';

  if (Object.keys(errors).length > 0) {
    return errorResponse('Please correct the highlighted fields.', 400, { errors });
  }

  const env = await getBindings();
  const db = getDb(env);
  const now = Date.now();
  const id = `EN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  await db
    .insert(contactEnquiries)
    .values({ id, name, email, message, source: 'contact', handled: false, createdAt: now })
    .run();

  // Best-effort forward. Delivery failing must not lose the enquiry, which is
  // already stored by this point.
  const webhook = env.FORM_WEBHOOK_CONTACT;
  await deliverFormPayload(webhook, { id, name, email, message }).catch(() => undefined);

  // Notify the operator directly, so enquiries still reach them if no webhook is
  // configured. Same rule as above: the row is durable, mail is best-effort.
  const mail = await sendEmail(env.RESEND_API_KEY, {
    to: [env.NOTIFY_EMAIL ?? 'info@swifthorizon.com.gh'],
    subject: `Website enquiry — ${name}`,
    replyTo: email,
    body: [
      `A new enquiry arrived on swifthorizon.com.gh/contact.`,
      ``,
      `Reference: ${id}`,
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      `Message:`,
      message,
    ].join('\n'),
  });

  if (mail.sent === false && mail.configured) {
    console.error('[contact] operator notification failed:', mail.error);
  }

  return jsonResponse({ message: 'Thank you — we will be in touch.', id }, 201);
};