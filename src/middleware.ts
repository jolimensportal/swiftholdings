import { defineMiddleware } from 'astro:middleware';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { getAdminFromRequest } from '@/lib/auth/session';

// There is no local member area any more: /members and /api/members are gone and
// /members redirects into the proxied portal (see public/_redirects). Only the
// admin surface is gated in the Worker.
const ADMIN_PREFIXES = ['/admin', '/api/admin'];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

/**
 * The member portal is a Next.js app deployed as its own Cloudflare Worker on
 * `swifthordingsportal.securemensah.workers.dev`. It is served to the public
 * under swifthorizon.com.gh/portal so the portal's own host is never visible to
 * a browser — no link, redirect, asset URL or cookie domain ever names it.
 *
 * The portal is built with `basePath: '/portal'`, so we strip that prefix on the
 * way out and restore it on any upstream redirect on the way back.
 */
const PORTAL_ORIGIN = 'https://swifthordingsportal.securemensah.workers.dev';
const PORTAL_PREFIX = '/portal';

const isPortalRequest = (pathname: string): boolean =>
  pathname === PORTAL_PREFIX || pathname.startsWith(`${PORTAL_PREFIX}/`);

async function proxyToPortal(request: Request, pathname: string, search: string): Promise<Response> {
  const upstreamPath = pathname.slice(PORTAL_PREFIX.length) || '/';
  const target = `${PORTAL_ORIGIN}${upstreamPath}${search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-host', 'swifthorizon.com.gh');
  headers.set('x-forwarded-proto', 'https');

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(upstream.headers);

  // An upstream redirect to "/portal/x" is already correct. One to "/x" lost the
  // prefix in transit, so put it back or the browser lands on the marketing site.
  const location = responseHeaders.get('location');
  if (location && location.startsWith('/') && !location.startsWith(`${PORTAL_PREFIX}/`)) {
    responseHeaders.set('location', `${PORTAL_PREFIX}${location}`);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals } = context;
  const { pathname, search } = new URL(request.url);

  if (isPortalRequest(pathname)) {
    try {
      return await proxyToPortal(request, pathname, search);
    } catch {
      return new Response('The member portal is temporarily unavailable.', {
        status: 502,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }
  }

  const needsAdmin = matches(pathname, ADMIN_PREFIXES);
  if (!needsAdmin) return next();

  const env = await getBindings();
  const db = getDb(env);

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

  return next();
});