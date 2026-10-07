/**
 * Outbound mail via the Resend REST API.
 *
 * Resend rather than the Cloudflare Email Service because Cloudflare only lets a
 * free account send to destinations already verified in the account, which is no
 * use to a business whose leads are strangers. Resend's free tier sends to anyone.
 *
 * Two invariants this module exists to hold:
 *
 *  1. It never throws. Every caller is a request handler that has already
 *     persisted the lead, so a mail failure must not turn a successful enquiry
 *     into a 500. Failures are returned and logged instead.
 *  2. It never renders untrusted text as markup. Lead names, brackets and free
 *     text come straight from the public form, so they are escaped before they
 *     reach an HTML part.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Sender display name is the short brand, not the registered entity.
 * "Swift Horizon Limited" is long enough that Gmail, Outlook and iOS Mail
 * truncate the sender column to "Swift Horizon Limi…", which looks like a
 * delivery glitch. The registered name stays in the footer, the legal dossier
 * and every document; the envelope name is a presentation choice.
 */
export const DEFAULT_SENDER = 'Swift Horizon <info@swifthorizon.com.gh>';

export interface ResendPayload {
  from?: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  text?: string;
}

export type SendResult =
  | { sent: true; id: string }
  | { sent: false; configured: false }
  | { sent: false; configured: true; error: string };

/** Exported so the operator console can reuse the exact same escaping. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * POST to Resend. Resolves to a result rather than rejecting, so a caller can
 * fire-and-forget without a try/catch that swallows real bugs.
 */
export async function resendRequest(
  apiKey: string | undefined,
  payload: ResendPayload
): Promise<SendResult> {
  if (apiKey === undefined || apiKey === '') {
    return { sent: false, configured: false };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: DEFAULT_SENDER, ...payload }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      return {
        sent: false,
        configured: true,
        error: `Resend responded ${response.status}: ${detail.slice(0, 200)}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };

    return { sent: true, id: data.id ?? 'unknown' };
  } catch (cause) {
    return {
      sent: false,
      configured: true,
      error: cause instanceof Error ? cause.message : 'Unknown mail transport failure',
    };
  }
}

/**
 * Send a plain-text body as a minimal, readable HTML part.
 * Returns `configured: false` when no API key is set, which is the normal state
 * in preview and local development.
 */
export async function sendEmail(
  apiKey: string | undefined,
  message: { to: string[]; subject: string; body: string; replyTo?: string }
): Promise<SendResult> {
  if (apiKey === undefined || apiKey === '') {
    return { sent: false, configured: false };
  }

  const escaped = escapeHtml(message.body);
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 12px">${block.replace(/\n/g, '<br />')}</p>`)
    .join('');

  return resendRequest(apiKey, {
    to: message.to,
    subject: message.subject,
    replyTo: message.replyTo,
    text: message.body,
    html: `<div style="font:16px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a20">${paragraphs}</div>`,
  });
}

export interface DiscoveryLead {
  name: string;
  segment: string;
  intent: string;
  bracket: string | null;
  phone: string | null;
  slotDate: string;
  slotTime: string;
}

const label = (text: string, value: string | null | undefined): string =>
  value === null || value === undefined || value === ''
    ? `<p style="margin:0 0 6px"><strong>${text}:</strong> <span style="color:#6b6b74">not given</span></p>`
    : `<p style="margin:0 0 6px"><strong>${text}:</strong> ${escapeHtml(value)}</p>`;

/**
 * Compose the notification sent to the operator when someone requests a briefing.
 * Kept separate from transport so it can be unit-tested for escaping.
 */
export function buildDiscoveryNotice(lead: DiscoveryLead): { subject: string; html: string; text: string } {
  const subject = `Discovery briefing request — ${lead.name || 'unnamed lead'} (${lead.intent || 'unspecified'})`;

  const text = [
    `A new discovery briefing request arrived on swifthorizon.com.gh.`,
    ``,
    `Name: ${lead.name}`,
    `Email: (reply directly to this message to reach them)`,
    `Phone: ${lead.phone ?? 'not given'}`,
    `Profile: ${lead.segment || 'not given'}`,
    `Intent: ${lead.intent || 'not given'}`,
    `Bracket: ${lead.bracket ?? 'not given'}`,
    `Preferred slot: ${lead.slotDate || 'any'} ${lead.slotTime || ''}`.trim(),
  ].join('\n');

  const html = `<div style="font:16px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a20">
  <h1 style="font-size:18px;margin:0 0 4px">New discovery briefing request</h1>
  <p style="margin:0 0 16px;color:#6b6b74">swifthorizon.com.gh/briefing</p>
  ${label('Name', lead.name)}
  ${label('Phone', lead.phone)}
  ${label('Profile', lead.segment)}
  ${label('Intent', lead.intent)}
  ${label('Bracket', lead.bracket)}
  ${label('Preferred date', lead.slotDate)}
  ${label('Preferred time', lead.slotTime)}
</div>`;

  return { subject, html, text };
}