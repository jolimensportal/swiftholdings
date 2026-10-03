import { defineMiddleware } from 'astro:middleware';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { getMemberFromRequest, getAdminFromRequest } from '@/lib/auth/session';

const MEMBER_PREFIXES = ['/members', '/api/members'];
const ADMIN_PREFIXES = ['/admin', '/api/admin'];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals } = context;
  const { pathname } = new URL(request.url);

  const needsMember = matches(pathname, MEMBER_PREFIXES);
  const needsAdmin = matches(pathname, ADMIN_PREFIXES);
  if (!needsMember && !needsAdmin) return next();

  const env = await getBindings();
  const db = getDb(env);

  if (needsMember) {
    const member = await getMemberFromRequest(request, db, env.JWT_SECRET);
    if (!member) {
      if (pathname.startsWith('/api/')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const nextPath = encodeURIComponent(pathname + new URL(request.url).search);
      return context.redirect(`/login?next=${nextPath}`, 302);
    }
    locals.member = member;
  }

  if (needsAdmin) {
    // The sign-in page is itself under /admin, so guarding it would redirect it
    // to itself forever. Let it through; it grants nothing on its own.
    if (pathname === '/admin/login') return next();

    const admin = await getAdminFromRequest(request, db, env.JWT_SECRET);
    if (!admin) {
      if (pathname.startsWith('/api/')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return context.redirect('/admin/login', 302);
    }
    locals.admin = admin;
  }

  return next();
});