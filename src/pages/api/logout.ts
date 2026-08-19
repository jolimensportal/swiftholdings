import type { APIRoute } from 'astro';
import { fromAstroSession, clearMemberSession } from '@/lib/auth/session';
import { jsonResponse, sameOriginRequest } from '@/utils/api';

export const POST: APIRoute = async ({ request, session }) => {
  if (!sameOriginRequest(request)) {
    return jsonResponse(
      { ok: false, error: 'Cross-origin requests are not allowed.' },
      403
    );
  }

  if (session !== undefined) {
    await clearMemberSession(fromAstroSession(session));
  }

  return jsonResponse({ ok: true });
};
