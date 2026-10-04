import type { APIRoute } from 'astro';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/db/client';
import { getBindings } from '@/lib/env';
import { feedback } from '@/db/schema';

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[a-zA-Z0-9/_-]+$/, 'Invalid slug format');

const voteSchema = z.object({
  slug: slugSchema,
  type: z.enum(['helpful', 'notHelpful']),
});

async function getFeedbackCounts(db: ReturnType<typeof getDb>, slug: string) {
  const row = await db
    .select()
    .from(feedback)
    .where(eq(feedback.slug, slug))
    .get();

  return {
    helpful: row?.helpful ?? 0,
    notHelpful: row?.notHelpful ?? 0,
  };
}

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = getDb(await getBindings());
    const slugResult = slugSchema.safeParse(url.searchParams.get('slug'));
    if (!slugResult.success) {
      return new Response(JSON.stringify({ error: 'A valid slug query parameter is required.' }), { status: 400 });
    }

    const counts = await getFeedbackCounts(db, slugResult.data);
    return new Response(JSON.stringify(counts), { status: 200 });
  } catch (error) {
    console.error('Error reading feedback:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDb(await getBindings());
    const data = await request.json();
    const parsed = voteSchema.safeParse(data);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid feedback payload.' }), { status: 400 });
    }

    const { slug, type } = parsed.data;

    const updatedFeedback =
      type === 'helpful'
        ? await db
            .insert(feedback)
            .values({ slug, helpful: 1 })
            .onConflictDoUpdate({
              target: feedback.slug,
              set: { helpful: sql`${feedback.helpful} + 1` },
            })
            .returning({
              helpful: feedback.helpful,
              notHelpful: feedback.notHelpful,
            })
            .get()
        : await db
            .insert(feedback)
            .values({ slug, notHelpful: 1 })
            .onConflictDoUpdate({
              target: feedback.slug,
              set: { notHelpful: sql`${feedback.notHelpful} + 1` },
            })
            .returning({
              helpful: feedback.helpful,
              notHelpful: feedback.notHelpful,
            })
            .get();

    return new Response(JSON.stringify(updatedFeedback), { status: 200 });
  } catch (error) {
    console.error('Error handling feedback:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};