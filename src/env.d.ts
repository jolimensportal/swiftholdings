/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

interface ImportMetaEnv {
  readonly PUBLIC_FORMSPREE_BRIEFING_ENDPOINT?: string;
  readonly SKIP_KEYSTATIC?: string;
  readonly KEYSTATIC_STORAGE_MODE?: string;
  readonly KEYSTATIC_GITHUB_REPO_OWNER?: string;
  readonly KEYSTATIC_GITHUB_REPO_NAME?: string;
  readonly FORMSPREE_CONTACT_ENDPOINT?: string;
  readonly FORMSPREE_NEWSLETTER_ENDPOINT?: string;
  readonly FORM_WEBHOOK_CONTACT?: string;
  readonly FORM_WEBHOOK_NEWSLETTER?: string;
  readonly PROD: boolean;
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import type { D1Database, KVNamespace, R2Bucket, Queue } from '@cloudflare/workers-types';

declare global {
  /** Augmented per @cloudflare/workers-types convention. */
  interface Env {
    DB: D1Database;
    SESSION: KVNamespace;
    DOCUMENTS: R2Bucket;
    EMAIL_QUEUE: Queue<unknown>;
    ASSETS: Fetcher;
    APP_ENV: string;
    JWT_SECRET: string;
  }

  namespace App {
    interface Locals {
      DB: D1Database;
      SESSION: KVNamespace;
      DOCUMENTS: R2Bucket;
      EMAIL_QUEUE: Queue;
      member?: {
        id: string;
        email: string;
        name: string;
        segment: string;
        tier: string;
        kycStatus: string;
      };
      admin?: {
        id: string;
        email: string;
        name: string | null;
        role: string;
      };
    }
  }
}