export interface PasswordRecord {
  hash: string;
  salt: string;
  iterations: number;
}

const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_LENGTH = 32;

const encoder = new TextEncoder();

export const hashPassword = async (
  password: string
): Promise<PasswordRecord> => {
  if (password.length === 0) {
    throw new Error('Password must not be empty.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    baseKey,
    KEY_LENGTH * 8
  );

  return {
    hash: Buffer.from(bits).toString('base64'),
    salt: Buffer.from(salt).toString('base64'),
    iterations: ITERATIONS,
  };
};

export const verifyPassword = async (
  password: string,
  record: PasswordRecord
): Promise<boolean> => {
  if (password.length === 0) {
    return false;
  }

  try {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: Buffer.from(record.salt, 'base64'),
        iterations: record.iterations,
      },
      baseKey,
      KEY_LENGTH * 8
    );

    const candidate = Buffer.from(bits).toString('base64');
    const expected = Buffer.from(record.hash, 'base64');
    const actual = Buffer.from(candidate, 'base64');

    if (expected.length !== actual.length) {
      return false;
    }

    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected[i] ^ actual[i];
    }

    return diff === 0;
  } catch {
    return false;
  }
};
