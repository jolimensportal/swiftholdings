export function jsonResponse(
  body: unknown,
  status = 200,
  headers: HeadersInit = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function errorResponse(
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
): Response {
  return jsonResponse({ error: message, ...extra }, status);
}

/**
 * CSRF-lite: require a same-host Origin header on state-changing requests.
 * Browsers send Origin on all POSTs; missing or foreign origins are rejected.
 */
export function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');

  if (origin === null) {
    return false;
  }

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/**
 * Forward form payloads to an optional webhook (e.g. Formspree).
 * When unset, accepts the payload in demo mode so the template works out of the box.
 */
export async function deliverFormPayload(
  webhookUrl: string | undefined,
  payload: Record<string, unknown>
): Promise<{ delivered: boolean; demo: boolean }> {
  if (!webhookUrl) {
    console.info(
      '[forms] Demo mode – set FORMSPREE_* or FORM_WEBHOOK_* to deliver submissions.',
      payload
    );
    return { delivered: false, demo: true };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded with ${response.status}`);
  }

  return { delivered: true, demo: false };
}
