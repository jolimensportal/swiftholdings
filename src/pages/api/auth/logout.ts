import type { APIRoute } from 'astro';
import { createLogoutHeaders } from '@/lib/auth/session';

export const POST: APIRoute = async () => {
  return Response.json({ success: true }, { headers: createLogoutHeaders() });
};