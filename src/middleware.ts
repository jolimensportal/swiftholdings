import { defineMiddleware } from 'astro:middleware';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { getMemberFromRequest, getAdminFromRequest } from '@/lib/auth/session';
import { corsHeaders } from '@/utils/cors';

/**
 * `/members` is NOT gated here: public/_redirects 301s it to the portal's own
 * host before the Worker ever sees it. Only the two API surfaces need a session,
 * plus the marketing site's admin console.
 */
const ADMIN_PREFIXES = ['/admin', '/api/admin'];
const MEMBER_API_PREFIXES = ['/api/members'];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const wantsJson = (pathname: string) => pathname.startsWith('/api/');

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals } = context;
  const { pathname } = new URL(request.url);
  const isApi = pathname.startsWith('/api/');

  // Preflight must succeed before the auth gate, or the browser never sends the
  // real request (and therefore never sends the cookie).
  if (isApi && request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const needsAdmin = matches(pathname, ADMIN_PREFIXES);
  const needsMember = matches(pathname, MEMBER_API_PREFIXES);
  if (!needsAdmin && !needsMember) return next();

  const env = await getBindings();
  const db = getDb(env);

  if (needsAdmin) {
    // The sign-in page is itself under /admin, so guarding it would redirect it
    // to itself forever. Let it through; it grants nothing on its own.
    if (pathname === '/admin/login') return next();

    const admin = await getAdminFromRequest(request, db, env.JWT_SECRET);
    if (!admin) {
      if (wantsJson(pathname)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return context.redirect('/admin/login', 302);
    }
    locals.admin = admin;
  }

  if (needsMember) {
    // Admins are members too — an operator inspecting a member's record must not
    // be locked out by a member-only gate.
    if (locals.admin) return next();

    const member = await getMemberFromRequest(request, db, env.JWT_SECRET);
    if (!member) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    locals.member = member;
  }

  return next();
});