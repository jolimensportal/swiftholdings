import { defineMiddleware } from 'astro:middleware';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { getAdminFromRequest } from '@/lib/auth/session';

const ADMIN_PREFIXES = ['/admin', '/api/admin'];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals } = context;
  const { pathname } = new URL(request.url);

  const needsAdmin = matches(pathname, ADMIN_PREFIXES);
  if (!needsAdmin) return next();

  const env = await getBindings();
  const db = getDb(env);

  if (pathname === '/admin/login') return next();

  const admin = await getAdminFromRequest(request, db, env.JWT_SECRET);
  if (!admin) {
    if (pathname.startsWith('/api/')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return context.redirect('/admin/login', 302);
  }
  locals.admin = admin;

  return next();
});