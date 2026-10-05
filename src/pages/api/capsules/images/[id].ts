import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { capsuleImages } from '@/db/schema';

/**
 * Serves one capsule photograph.
 *
 * R2 keys are never sent to a browser. This handler maps a public image id to
 * the private key server-side and streams the object, so the storage layout
 * cannot be enumerated from the client.
 *
 * Public by design: these are unit photographs, not member documents. Nothing
 * here is scoped to a person.
 */
export const GET: APIRoute = async ({ params }) => {
  const imageId = params.id?.trim();
  if (!imageId) return new Response('Not found', { status: 404 });

  const env = await getBindings();
  const db = getDb(env);

  const row = await db.select().from(capsuleImages).where(eq(capsuleImages.id, imageId)).get();
  if (!row) return new Response('Not found', { status: 404 });

  const object = await env.DOCUMENTS.get(row.r2Key);
  if (!object) return new Response('Not found', { status: 404 });

  return new Response(object.body as unknown as BodyInit, {
    headers: {
      'content-type': row.mimeType ?? object.httpMetadata?.contentType ?? 'image/jpeg',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};