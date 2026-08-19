import { describe, expect, it } from 'vitest';
import {
  MEMBER_SESSION_KEY,
  clearMemberSession,
  getMemberEmail,
  setMemberSession,
  type SessionLike,
} from './session';

interface StubSession extends SessionLike {
  map: Map<string, unknown>;
}

const stubSession = (): StubSession => {
  const map = new Map<string, unknown>();

  return {
    map,
    async get(key) {
      return map.get(key);
    },
    async set(key, value) {
      map.set(key, value);
    },
    async delete(key) {
      map.delete(key);
    },
    async destroy() {
      map.clear();
    },
  };
};

describe('session helpers', () => {
  it('returns undefined when no member is signed in', async () => {
    const session = stubSession();

    expect(await getMemberEmail(session)).toBeUndefined();
  });

  it('stores the member email in the session', async () => {
    const session = stubSession();
    await setMemberSession(session, 'ama@example.com');

    expect(await getMemberEmail(session)).toBe('ama@example.com');
    expect(session.map.has(MEMBER_SESSION_KEY)).toBe(true);
  });

  it('clears the session', async () => {
    const session = stubSession();
    await setMemberSession(session, 'ama@example.com');
    await clearMemberSession(session);

    expect(await getMemberEmail(session)).toBeUndefined();
    expect(session.map.size).toBe(0);
  });

  it('survives an overwrite with a different member', async () => {
    const session = stubSession();
    await setMemberSession(session, 'ama@example.com');
    await setMemberSession(session, 'kwame@example.com');

    expect(await getMemberEmail(session)).toBe('kwame@example.com');
  });
});
