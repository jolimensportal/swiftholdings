import { describe, expect, it, vi, afterEach } from 'vitest';
import { buildDiscoveryNotice, resendRequest, sendEmail } from './email';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('resendRequest', () => {
  it('posts to the Resend API with bearer auth and the sender', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 })
      );

    const result = await resendRequest('re_123', {
      from: 'Swift Horizon Limited <info@swifthorizon.com.gh>',
      to: ['someone@example.com'],
      subject: 'hi',
      html: '<p>hi</p>',
    });

    expect(result.sent).toBe(true);

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>).Authorization).toBe(
      'Bearer re_123'
    );
    expect(JSON.parse(String(init?.body)).from).toBe(
      'Swift Horizon Limited <info@swifthorizon.com.gh>'
    );
  });

  it('reports failure instead of throwing when Resend rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'invalid api key' }), {
        status: 401,
      })
    );

    const result = await resendRequest('bad_key', {
      from: 'x@y.com',
      to: ['a@b.com'],
      subject: 's',
      html: 'h',
    });

    expect(result).toMatchObject({ sent: false, configured: true, error: expect.any(String) });
  });

  it('treats a missing API key as not configured rather than an error', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await resendRequest(undefined, {
      from: 'x@y.com',
      to: ['a@b.com'],
      subject: 's',
      html: 'h',
    });

    expect(result).toEqual({ sent: false, configured: false });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('reports failure when the network throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));

    const result = await resendRequest('re_123', {
      from: 'x@y.com',
      to: ['a@b.com'],
      subject: 's',
      html: 'h',
    });

    expect(result.sent).toBe(false);
    expect(result).toMatchObject({
      sent: false,
      error: expect.stringContaining('ECONNREFUSED'),
    });
  });
});

describe('sendEmail', () => {
  it('escapes untrusted text so a lead name cannot inject markup', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 })
      );

    await sendEmail('re_123', {
      to: ['info@swifthorizon.com.gh'],
      subject: 'x',
      body: '<script>alert(1)</script>',
    });

    const payload = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));

    // The HTML part must be inert. The text/plain part carries the raw string by
    // design — a plain-text alternative is never rendered as markup.
    expect(payload.html).not.toContain('<script>');
    expect(payload.html).toContain('&lt;script&gt;');
    expect(payload.text).toBe('<script>alert(1)</script>');
  });

  it('sends a plain-text alternative alongside the HTML part', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 })
      );

    await sendEmail('re_123', {
      to: ['info@swifthorizon.com.gh'],
      subject: 'x',
      body: 'Bracketed at 50k-100k',
    });

    const payload = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));
    expect(payload.text).toBe('Bracketed at 50k-100k');
    expect(payload.from).toContain('Swift Horizon Limited');
  });

  it('is a no-op returning the input when no key is configured', async () => {
    const result = await sendEmail(undefined, {
      to: ['a@b.com'],
      subject: 's',
      body: 'b',
    });

    expect(result).toEqual({ sent: false, configured: false });
  });
});

describe('buildDiscoveryNotice', () => {
  it('states the obvious subject line with the lead name', () => {
    const subject = buildDiscoveryNotice({
      name: 'Ama Mensah',
      segment: 'local',
      intent: 'own',
      bracket: '50k-100k',
      phone: '+233 544 101016',
      slotDate: '2026-11-04',
      slotTime: '14:00',
    }).subject;

    expect(subject).toContain('Ama Mensah');
    expect(subject).toContain('own');
  });

  it('never renders a raw script tag from user input', () => {
    const notice = buildDiscoveryNotice({
      name: '<img src=x onerror=alert(1)>',
      segment: 'local',
      intent: '<b>own</b>',
      bracket: null,
      phone: null,
      slotDate: '',
      slotTime: '',
    });

    expect(notice.html).not.toContain('<img src=x');
    expect(notice.html).toContain('&lt;img');
  });

  it('survives every field being empty', () => {
    const notice = buildDiscoveryNotice({
      name: '',
      segment: '',
      intent: '',
      bracket: null,
      phone: null,
      slotDate: '',
      slotTime: '',
    });

    expect(notice.subject).toBeTruthy();
    expect(notice.html).toContain('briefing');
  });
});