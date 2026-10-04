import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB);
}

export type Db = ReturnType<typeof getDb>;