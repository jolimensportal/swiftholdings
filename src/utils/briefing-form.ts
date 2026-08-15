export interface BriefingPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  timeframe: string;
  message: string;
  consent: boolean;
  website: string;
}

export type BriefingFieldErrors = Partial<
  Record<keyof BriefingPayload, string>
>;

export type BriefingSubmissionResult =
  | { kind: 'success' }
  | { kind: 'fallback' }
  | { kind: 'error'; message: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const deliveryError =
  'We could not send your request. Please try again or email us directly.';

export function validateBriefing(
  payload: BriefingPayload
): BriefingFieldErrors {
  const errors: BriefingFieldErrors = {};

  if (!payload.name.trim()) errors.name = 'Enter your full name.';
  if (!emailPattern.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!payload.country.trim()) errors.country = 'Select your current country.';
  if (!payload.interest.trim()) {
    errors.interest = 'Select what brings you to Swift.';
  }
  if (!payload.timeframe.trim()) errors.timeframe = 'Select your timeframe.';
  if (!payload.consent) {
    errors.consent = 'Confirm that Swift may reply to this request.';
  }

  return errors;
}

export async function submitBriefing({
  endpoint,
  payload,
  fetcher = fetch,
  timeoutMs = 10_000,
}: {
  endpoint: string;
  payload: BriefingPayload;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}): Promise<BriefingSubmissionResult> {
  if (!endpoint.trim()) return { kind: 'fallback' };
  if (payload.website) return { kind: 'success' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const formData = new FormData();

    for (const [key, value] of Object.entries(payload)) {
      formData.set(key, String(value));
    }

    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
      signal: controller.signal,
    });

    return response.ok
      ? { kind: 'success' }
      : { kind: 'error', message: deliveryError };
  } catch {
    return { kind: 'error', message: deliveryError };
  } finally {
    clearTimeout(timeout);
  }
}
