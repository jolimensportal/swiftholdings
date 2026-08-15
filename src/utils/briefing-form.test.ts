import { describe, expect, it, vi } from 'vitest';
import {
  submitBriefing,
  validateBriefing,
  type BriefingPayload,
} from './briefing-form';

const validPayload: BriefingPayload = {
  name: 'Ama Mensah',
  email: 'ama@example.com',
  phone: '+1 555 0100',
  country: 'Canada',
  interest: 'Owning a home',
  timeframe: '6-12 months',
  message: 'I would like to understand the next step.',
  consent: true,
  website: '',
};

describe('validateBriefing', () => {
  it('accepts a complete private-briefing request', () => {
    expect(validateBriefing(validPayload)).toEqual({});
  });

  it('returns field messages for missing consent and invalid email', () => {
    expect(
      validateBriefing({
        ...validPayload,
        email: 'not-an-email',
        consent: false,
      })
    ).toMatchObject({
      email: 'Enter a valid email address.',
      consent: 'Confirm that Swift may reply to this request.',
    });
  });
});

describe('submitBriefing', () => {
  it('silently succeeds for a honeypot submission', async () => {
    const fetcher = vi.fn();

    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: { ...validPayload, website: 'https://bot.invalid' },
        fetcher,
      })
    ).resolves.toEqual({ kind: 'success' });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns fallback when no public Formspree endpoint is configured', async () => {
    await expect(
      submitBriefing({ endpoint: '', payload: validPayload })
    ).resolves.toEqual({
      kind: 'fallback',
    });
  });

  it('returns success only after a successful Formspree response', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response('', { status: 200 }));

    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: validPayload,
        fetcher,
      })
    ).resolves.toEqual({ kind: 'success' });
  });

  it('keeps the form retryable after a network error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError('Network failed'));

    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: validPayload,
        fetcher,
      })
    ).resolves.toEqual({
      kind: 'error',
      message:
        'We could not send your request. Please try again or email us directly.',
    });
  });

  it('returns a retryable error after the request times out', async () => {
    const fetcher = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Timed out', 'AbortError'))
          );
        })
    );

    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: validPayload,
        fetcher: fetcher as typeof fetch,
        timeoutMs: 0,
      })
    ).resolves.toEqual({
      kind: 'error',
      message:
        'We could not send your request. Please try again or email us directly.',
    });
  });
});
