import type { APIRoute } from 'astro';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { capsuleImages, capsules, ownerships } from '@/db/schema';
import { corsHeaders } from '@/utils/cors';
import { jsonResponse } from '@/utils/api';

/**
 * With Astro's blanket checkOrigin disabled (see astro.config.mjs), every
 * admin write re-checks the Origin itself. Cookies authenticate the admin but
 * do not stop a cross-site form POST riding an authenticated session, so this
 * allowlist is the CSRF defence for these endpoints.
 */
function adminRequestAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (origin === null) return false;
  return corsHeaders(request).get('access-control-allow-origin') === origin;
}

const HUB_MAX = 64;
const NAME_MAX = 120;

/** Generate a short, collision-resistant id without a UUID dependency. */
function makeId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${hex.toUpperCase()}`;
}

/** Capsule inventory with occupancy, for the operator console. */
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);

  const env = await getBindings();
  const db = getDb(env);

  const rows = await db.select().from(capsules).orderBy(asc(capsules.hub)).all();
  const held = await db.select().from(ownerships).all();
  const images = await db.select().from(capsuleImages).orderBy(asc(capsuleImages.position)).all();

  const withOwners = rows.map((c) => {
    const owned = held.filter((o) => o.capsuleId === c.id);
    return {
      ...c,
      owners: owned.length,
      capitalUnits: owned.reduce((sum, o) => sum + o.capitalUnits, 0),
      images: images
        .filter((img) => img.capsuleId === c.id)
        .map((img) => ({
          id: img.id,
          position: img.position,
          isHero: img.isHero,
          caption: img.caption,
          mimeType: img.mimeType,
          sizeBytes: img.sizeBytes,
        })),
    };
  });

  return jsonResponse({ capsules: withOwners });
};

interface CapsuleInput {
  name?: unknown;
  hub?: unknown;
  phase?: unknown;
  status?: unknown;
  priceUsd?: unknown;
  areaSqm?: unknown;
  shareRatio?: unknown;
}

const STATUSES = new Set(['building', 'in-revenue', 'completed']);

/** Onboard a new prefab unit. Price is in cents, matching the rest of the schema. */
export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);
  if (!adminRequestAllowed(request)) return jsonResponse({ error: 'Forbidden' }, 403);

  // Astro's CSRF guard rejects a cross-site PUT carrying a form body, so a
  // multipart upload arrives here on POST with _method=upload.
  if (request.headers.get('content-type')?.includes('multipart/form-data')) {
    return uploadImages(request, locals);
  }

  const body = (await request.json().catch(() => ({}))) as CapsuleInput;

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const hub = typeof body.hub === 'string' ? body.hub.trim() : '';

  if (!name || name.length > NAME_MAX) {
    return jsonResponse({ error: 'Name is required' }, 400);
  }
  if (!hub || hub.length > HUB_MAX) {
    return jsonResponse({ error: 'Hub is required' }, 400);
  }

  const status = typeof body.status === 'string' && STATUSES.has(body.status) ? body.status : 'building';
  const phase = Number.isFinite(body.phase) ? Number(body.phase) : 1;
  const priceCents = Number.isFinite(body.priceUsd) ? Number(body.priceUsd) : 0;
  const areaSqm = Number.isFinite(body.areaSqm) ? Number(body.areaSqm) : 38;
  const shareRatio = typeof body.shareRatio === 'string' && body.shareRatio.trim() ? body.shareRatio.trim() : '70/30';

  if (priceCents < 0 || priceCents > 1_000_000_000) {
    return jsonResponse({ error: 'Price out of range' }, 400);
  }

  const env = await getBindings();
  const db = getDb(env);

  const id = makeId('CAP');
  const now = Date.now();

  await db
    .insert(capsules)
    .values({
      id,
      hub,
      name,
      phase,
      status: status as 'building' | 'in-revenue' | 'completed',
      priceUsd: priceCents,
      areaSqm,
      shareRatio,
      imageR2Key: null,
    })
    .run();

  return jsonResponse({ ok: true, capsule: { id, hub, name, phase, status, priceUsd: priceCents, areaSqm, shareRatio } }, 201);
};

/** Update an existing capsule. Used by the onboarding wizard's later steps. */
export const PATCH: APIRoute = async ({ request, locals }) => {
  if (!locals.admin) return jsonResponse({ error: 'Unauthorized' }, 401);
  if (!adminRequestAllowed(request)) return jsonResponse({ error: 'Forbidden' }, 403);

  const body = (await request.json().catch(() => ({}))) as CapsuleInput & { id?: unknown };
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return jsonResponse({ error: 'id is required' }, 400);

  const env = await getBindings();
  const db = getDb(env);

  const patch: Record<string, unknown> = {};
  if (typeof body.name === 'string' && body.name.trim()) patch.name = body.name.trim().slice(0, NAME_MAX);
  if (typeof body.hub === 'string' && body.hub.trim()) patch.hub = body.hub.trim().slice(0, HUB_MAX);
  if (Number.isFinite(body.phase)) patch.phase = Number(body.phase);
  if (Number.isFinite(body.priceUsd)) patch.priceUsd = Number(body.priceUsd);
  if (Number.isFinite(body.areaSqm)) patch.areaSqm = Number(body.areaSqm);
  if (typeof body.shareRatio === 'string' && body.shareRatio.trim()) patch.shareRatio = body.shareRatio.trim();
  if (typeof body.status === 'string' && STATUSES.has(body.status)) patch.status = body.status;

  if (Object.keys(patch).length === 0) return jsonResponse({ error: 'Nothing to update' }, 400);

  await db.update(capsules).set(patch).where(eq(capsules.id, id)).run();

  return jsonResponse({ ok: true });
};

/**
 * Attach photographs to an onboarded capsule.
 *
 * Accepts multipart/form-data so a browser can upload many files in one
 * request. Each file is stored under capsules/<id>/ in the R2 bucket and gets
 * its own row so the gallery can be ordered and the hero can be chosen.
 */
async function uploadImages(request: Request, locals: App.Locals): Promise<Response> {

  const form = await request.formData().catch(() => null);
  if (!form) return jsonResponse({ error: 'Expected multipart form data' }, 400);

  const capsuleId = String(form.get('capsuleId') ?? '').trim();
  if (!capsuleId) return jsonResponse({ error: 'capsuleId is required' }, 400);

  const env = await getBindings();
  const db = getDb(env);

  const existing = await db.select().from(capsules).where(eq(capsules.id, capsuleId)).get();
  if (!existing) return jsonResponse({ error: 'Unknown capsule' }, 404);

  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return jsonResponse({ error: 'No images supplied' }, 400);

  const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
  const now = Date.now();

  const already = await db
    .select({ id: capsuleImages.id })
    .from(capsuleImages)
    .where(eq(capsuleImages.capsuleId, capsuleId))
    .all();
  const count = already.length;

  const saved: { id: string; r2Key: string; position: number; isHero: boolean }[] = [];

  for (const [index, file] of files.entries()) {
    if (!ALLOWED.has(file.type)) continue;

    const r2Key = `capsules/${capsuleId}/${makeId('IMG')}.${file.type.split('/')[1] ?? 'jpg'}`;
    await env.DOCUMENTS.put(r2Key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });

    const id = makeId('CIMG');
    const position = count + index;
    const isHero = position === 0;

    await db
      .insert(capsuleImages)
      .values({
        id,
        capsuleId,
        r2Key,
        isHero,
        position,
        mimeType: file.type,
        sizeBytes: file.size,
        caption: String(form.get('caption') ?? '').trim() || null,
        createdAt: now,
      })
      .run();

    // Mirror the first upload onto the capsule row for card rendering.
    if (isHero) {
      await db.update(capsules).set({ imageR2Key: r2Key }).where(eq(capsules.id, capsuleId)).run();
    }

    saved.push({ id, r2Key, position, isHero });
  }

  if (saved.length === 0) {
    return jsonResponse({ error: 'No supported image types. Use JPEG, PNG, WebP or AVIF.' }, 400);
  }

  return jsonResponse({ ok: true, images: saved }, 201);
};
