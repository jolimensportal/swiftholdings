/**
 * Augment the global `Env` from @cloudflare/workers-types.
 * The module `cloudflare:workers` exports `env: Env`, so augmenting
 * `Env` here types every `import { env } from 'cloudflare:workers'`.
 */
interface Env {
  DB: import('@cloudflare/workers-types').D1Database;
  SESSION: import('@cloudflare/workers-types').KVNamespace;
  DOCUMENTS: import('@cloudflare/workers-types').R2Bucket;
  EMAIL_QUEUE: import('@cloudflare/workers-types').Queue<unknown>;
  ASSETS: import('@cloudflare/workers-types').Fetcher;
  APP_ENV: string;
  JWT_SECRET: string;
  /** Optional. Set to forward contact enquiries; storage does not depend on it. */
  FORM_WEBHOOK_CONTACT?: string;
}