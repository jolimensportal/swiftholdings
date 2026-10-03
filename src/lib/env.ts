import type { D1Database, KVNamespace, R2Bucket, Queue, Fetcher } from '@cloudflare/workers-types';

/**
 * Typed Cloudflare bindings.
 *
 * `cloudflare:workers` cannot be resolved at module-load time: Astro's
 * Cloudflare adapter loads the app shell (including middleware) during the
 * Node-based prerender pass, where the `cloudflare:` URL scheme is unsupported
 * (ERR_UNSUPPORTED_ESM_URL_SCHEME). So the import is deferred to request time
 * and cached. Nothing here executes during `astro build`.
 */
export interface Bindings {
  DB: D1Database;
  SESSION: KVNamespace;
  DOCUMENTS: R2Bucket;
  EMAIL_QUEUE: Queue<unknown>;
  ASSETS: Fetcher;
  APP_ENV: string;
  JWT_SECRET: string;
  /** Optional. Set to forward contact enquiries; storage does not depend on it. */
  FORM_WEBHOOK_CONTACT?: string;
}

let cached: Bindings | null = null;

export async function getBindings(): Promise<Bindings> {
  if (cached) return cached;
  const { env } = await import('cloudflare:workers');
  cached = env as unknown as Bindings;
  return cached;
}