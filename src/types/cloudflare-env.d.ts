declare module 'cloudflare:workers' {
  import type { KvLike } from '../lib/auth/members';

  export const env: {
    SESSION: KvLike;
  };
}
