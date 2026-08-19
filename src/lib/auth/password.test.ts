import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
  it('produces a hash record with base64 hash, salt, and iterations', async () => {
    const record = await hashPassword('Obsidian9Gate');

    expect(record.iterations).toBe(100_000);
    expect(record.hash).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(record.salt).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(Buffer.from(record.salt, 'base64')).toHaveLength(16);
  });

  it('verifies the correct password', async () => {
    const record = await hashPassword('Obsidian9Gate');

    await expect(verifyPassword('Obsidian9Gate', record)).resolves.toBe(true);
  });

  it('rejects a wrong password', async () => {
    const record = await hashPassword('Obsidian9Gate');

    await expect(verifyPassword('WrongPass9', record)).resolves.toBe(false);
  });

  it('uses a unique salt for every hash', async () => {
    const first = await hashPassword('Obsidian9Gate');
    const second = await hashPassword('Obsidian9Gate');

    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });

  it('rejects an empty password at hash time', async () => {
    await expect(hashPassword('')).rejects.toThrow();
  });

  it('rejects an empty password at verify time', async () => {
    const record = await hashPassword('Obsidian9Gate');

    await expect(verifyPassword('', record)).resolves.toBe(false);
  });

  it('produces a stable verify for an already-hashed record', async () => {
    const record = await hashPassword('AmaOwusu2026!');

    await expect(verifyPassword('AmaOwusu2026!', record)).resolves.toBe(true);
    await expect(verifyPassword('AmaOwusu2027!', record)).resolves.toBe(false);
  });
});
