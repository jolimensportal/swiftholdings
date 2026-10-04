import type { APIRoute } from 'astro';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { createMemberSession, createAdminSession, createAuthHeaders } from '@/lib/auth/session';

interface LoginBody {
  email?: unknown;
  password?: unknown;
  scope?: unknown;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = await getBindings();
  const db = getDb(env);

  const body = (await request.json().catch(() => ({}))) as LoginBody;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return Response.json({ error: 'Email and password required' }, { status: 400 });
  }

  if (body.scope === 'admin') {
    const result = await createAdminSession(db, email, password, env.JWT_SECRET);
    if (!result) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    return Response.json({ admin: result.admin }, { headers: createAuthHeaders(result.token) });
  }

  const result = await createMemberSession(db, email, password, env.JWT_SECRET);
  if (!result) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  return Response.json({ member: result.member }, { headers: createAuthHeaders(result.token) });
};