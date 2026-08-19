import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateDiscoveryInput } from '@/data/marketing/discovery';
import {
  MemberAlreadyExistsError,
  createMember,
  getMemberByEmail,
} from '@/lib/auth/members';
import { fromAstroSession, setMemberSession } from '@/lib/auth/session';
import { errorResponse, jsonResponse, sameOriginRequest } from '@/utils/api';
import { getClientIp, rateLimit } from '@/utils/rate-limit';

export const POST: APIRoute = async ({ request, session }) => {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`discovery:${ip}`, {
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

    if (session === undefined) {
      return errorResponse('Sessions are not configured.', 500);
    }

    const body = await request.json();
    const validation = validateDiscoveryInput(body);

    if (!validation.ok) {
      return errorResponse('Please correct the highlighted fields.', 400, {
        errors: validation.errors,
      });
    }

    const memberSession = fromAstroSession(session);
    const existing = await getMemberByEmail(env.SESSION, body.email);

    if (existing !== null) {
      await setMemberSession(memberSession, existing.email);

      return jsonResponse({
        ok: true,
        alreadyMember: true,
        member: {
          name: existing.name,
          email: existing.email,
        },
      });
    }

    const member = await createMember(env.SESSION, {
      name: body.name,
      email: body.email,
      password: body.password,
    });
    await setMemberSession(memberSession, member.email);

    return jsonResponse({ ok: true, member });
  } catch (error) {
    if (error instanceof MemberAlreadyExistsError) {
      return errorResponse('That email already belongs to a member.', 409);
    }

    console.error('Error handling discovery submission:', error);
    return errorResponse('Internal server error', 500);
  }
};
