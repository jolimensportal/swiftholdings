/**
 * The portal runs on its own host and calls this API with the caller's session
 * cookie. Only our own hosts are allowed, and credentials must be permitted so
 * the browser sends the cookie.
 */
const ALLOWED_ORIGINS = new Set([
  'https://swifthorizon.com.gh',
  'https://www.swifthorizon.com.gh',
  'https://portal.swifthorizon.com.gh',
]);

export function corsHeaders(request: Request): Headers {
  const origin = request.headers.get('Origin');
  const headers = new Headers();

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Vary', 'Origin');
  }

  headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return headers;
}