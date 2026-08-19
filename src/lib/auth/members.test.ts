import { describe, expect, it } from 'vitest';
import { verifyPassword } from './password';
import {
  MemberAlreadyExistsError,
  createMember,
  getMemberByEmail,
  getMemberView,
  type KvLike,
  type MembersEnv,
} from './members';

const stubKv = (): KvLike => {
  const store = new Map<string, string>();

  return {
    async get(key) {
      return store.get(key) ?? null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async delete(key) {
      store.delete(key);
    },
  };
};

const stubEnv = (): MembersEnv => ({ SESSION: stubKv() });

describe('member store', () => {
  it('creates a member with a verifiable password', async () => {
    const env = stubEnv();
    const member = await createMember(env, {
      name: 'Ama Owusu',
      email: 'AMA@example.com',
      password: 'Obsidian9Gate',
    });

    expect(member.email).toBe('ama@example.com');
    expect(member.name).toBe('Ama Owusu');

    const stored = await getMemberByEmail(env, 'ama@example.com');
    expect(stored).not.toBeNull();
    await expect(
      verifyPassword('Obsidian9Gate', {
        hash: stored!.hash,
        salt: stored!.salt,
        iterations: stored!.iterations,
      })
    ).resolves.toBe(true);
  });

  it('normalizes the email to lowercase', async () => {
    const env = stubEnv();
    await createMember(env, {
      name: 'Kwame Mensah',
      email: '  Kwame@Example.COM ',
      password: 'Obsidian9Gate',
    });

    const stored = await getMemberByEmail(env, 'kwame@example.com');
    expect(stored?.name).toBe('Kwame Mensah');
  });

  it('rejects a duplicate email', async () => {
    const env = stubEnv();
    await createMember(env, {
      name: 'Ama Owusu',
      email: 'ama@example.com',
      password: 'Obsidian9Gate',
    });

    await expect(
      createMember(env, {
        name: 'Someone Else',
        email: 'ama@example.com',
        password: 'Obsidian9Gate',
      })
    ).rejects.toBeInstanceOf(MemberAlreadyExistsError);
  });

  it('returns null for an unknown email', async () => {
    const env = stubEnv();

    expect(await getMemberByEmail(env, 'nobody@example.com')).toBeNull();
  });

  it('returns a credential-free view', async () => {
    const env = stubEnv();
    await createMember(env, {
      name: 'Ama Owusu',
      email: 'ama@example.com',
      password: 'Obsidian9Gate',
    });

    const view = await getMemberView(env, 'ama@example.com');
    expect(view).toEqual({
      name: 'Ama Owusu',
      email: 'ama@example.com',
      createdAt: expect.any(String),
    });
  });

  it('rejects an empty password at create time', async () => {
    const env = stubEnv();

    await expect(
      createMember(env, {
        name: 'Ama Owusu',
        email: 'ama@example.com',
        password: '',
      })
    ).rejects.toThrow();
  });
});
