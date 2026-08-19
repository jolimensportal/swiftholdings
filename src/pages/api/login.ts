import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getMemberByEmail } from '@/lib/auth/members';
import { verifyPassword } from '@/lib/auth/password';
import { fromAstroSession, setMemberSession } from '@/lib/auth/session';
import { errorResponse, jsonResponse, sameOriginRequest } from '@/utils/api';
import { getClientIp, rateLimit } from '@/utils/rate-limit';

const normalize = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export const POST: APIRoute = async ({ request, session }) => {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`login:${ip}`, { limit: 10, windowMs: 60_000 });
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

    if (session === undefined) {
      return errorResponse('Sessions are not configured.', 500);
    }

    const body = await request.json();
    const email = normalize(body.email).toLowerCase();
    const password = normalize(body.password);

    const member = await getMemberByEmail(env.SESSION, email);
    const verified =
      member !== null && (await verifyPassword(password, member));

    if (!verified) {
      return errorResponse('Incorrect email or password.', 401);
    }

    await setMemberSession(fromAstroSession(session), member.email);

    return jsonResponse({
      ok: true,
      member: { name: member.name, email: member.email },
    });
  } catch (error) {
    console.error('Error handling login:', error);
    return errorResponse('Internal server error', 500);
  }
};
