import { describe, expect, it } from 'vitest';
import { errorResponse, jsonResponse, sameOriginRequest } from './api';

describe('jsonResponse', () => {
  it('defaults to a JSON content type', async () => {
    const res = jsonResponse({ ok: true });

    expect(res.headers.get('content-type')).toContain('application/json');
    expect(await res.json()).toEqual({ ok: true });
  });

  it('does not clobber a caller-supplied content type', () => {
    const res = jsonResponse('hi', 200, { 'content-type': 'text/plain' });

    expect(res.headers.get('content-type')).toBe('text/plain');
  });

  it('carries headers given as a plain object', () => {
    const res = jsonResponse({}, 200, { 'X-Trace': 'abc' });

    expect(res.headers.get('x-trace')).toBe('abc');
  });

  /**
   * Regression: the argument was spread into an object literal, so a `Headers`
   * instance became `{}` and the auth cookie was dropped without error. The
   * briefing submit returned 201 with no session and nothing looked wrong.
   */
  it('carries headers given as a Headers instance', () => {
    const headers = new Headers();
    headers.append('Set-Cookie', 'swift_auth=token-value; HttpOnly; Secure; SameSite=Lax');

    const res = jsonResponse({ ok: true }, 201, headers);

    expect(res.headers.get('set-cookie')).toContain('swift_auth=token-value');
    expect(res.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('preserves the status code', () => {
    expect(jsonResponse({}, 429).status).toBe(429);
  });
});

describe('errorResponse', () => {
  it('returns the message under `error`', async () => {
    const res = errorResponse('Nope.', 400, { retryAfterSec: 30 });

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Nope.', retryAfterSec: 30 });
  });
});

describe('sameOriginRequest', () => {
  const request = (origin?: string, url = 'https://swifthorizon.com.gh/api/discovery') =>
    new Request(url, { method: 'POST', headers: origin ? { origin } : {} });

  it('accepts the same host', () => {
    expect(sameOriginRequest(request('https://swifthorizon.com.gh'))).toBe(true);
  });

  it('rejects a foreign host', () => {
    expect(sameOriginRequest(request('https://evil.example'))).toBe(false);
  });

  it('rejects a missing Origin header', () => {
    expect(sameOriginRequest(request())).toBe(false);
  });

  it('rejects a malformed Origin rather than throwing', () => {
    expect(sameOriginRequest(request('not a url'))).toBe(false);
  });
});