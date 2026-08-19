import type { AstroSession } from 'astro';

export const MEMBER_SESSION_KEY = 'memberEmail';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface SessionLike {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, options?: { ttl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  destroy(): Promise<void>;
}

export const fromAstroSession = (session: AstroSession): SessionLike => ({
  async get(key) {
    return session.get(key);
  },
  async set(key, value, options) {
    session.set(key, value, options);
  },
  async delete(key) {
    session.delete(key);
  },
  async destroy() {
    session.destroy();
  },
});

export const getMemberEmail = async (
  session: SessionLike
): Promise<string | undefined> => {
  const value = await session.get(MEMBER_SESSION_KEY);

  return typeof value === 'string' ? value : undefined;
};

export const setMemberSession = async (
  session: SessionLike,
  email: string
): Promise<void> => {
  await session.set(MEMBER_SESSION_KEY, email, { ttl: SESSION_TTL_SECONDS });
};

export const clearMemberSession = async (
  session: SessionLike
): Promise<void> => {
  await session.destroy();
};
