import type { APIRoute } from 'astro';

const PORTAL_ORIGIN = 'https://portal.swiftholdings.website';

export const GET: APIRoute = async ({ params, url, request }) => {
  const pathSegments = Array.isArray(params.path) ? params.path : [];
  const upstreamPath = pathSegments.join('/');
  const target = `${PORTAL_ORIGIN}/${upstreamPath}${url.search}`;

  const headers = new Headers(request.headers);
  // Set Host to portal's domain for correct redirect generation
  headers.set('host', 'portal.swiftholdings.website');
  // Don't forward x-forwarded-host - let portal use its own Host
  headers.set('x-forwarded-proto', 'https');

  const upstream = await fetch(target, {
    method: 'GET',
    headers,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(upstream.headers);
  const location = responseHeaders.get('location');
  if (location && location.startsWith('/') && !location.startsWith('/portal/')) {
    responseHeaders.set('location', `/portal${location}`);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
};