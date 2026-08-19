import { hashPassword } from './password';

export interface KvLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface MembersEnv {
  SESSION: KvLike;
}

export interface MemberRecord {
  name: string;
  email: string;
  hash: string;
  salt: string;
  iterations: number;
  createdAt: string;
}

export interface MemberView {
  name: string;
  email: string;
  createdAt: string;
}

export interface NewMember {
  name: string;
  email: string;
  password: string;
}

export class MemberAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A member with the email ${email} already exists.`);
    this.name = 'MemberAlreadyExistsError';
  }
}

const memberKey = (email: string): string => `member:${email}`;

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const createMember = async (
  env: MembersEnv,
  input: NewMember
): Promise<MemberView> => {
  const email = normalizeEmail(input.email);
  const existing = await getMemberByEmail(env, email);

  if (existing !== null) {
    throw new MemberAlreadyExistsError(email);
  }

  const passwordRecord = await hashPassword(input.password);
  const record: MemberRecord = {
    name: input.name.trim(),
    email,
    hash: passwordRecord.hash,
    salt: passwordRecord.salt,
    iterations: passwordRecord.iterations,
    createdAt: new Date().toISOString(),
  };

  await env.SESSION.put(memberKey(email), JSON.stringify(record));

  return toMemberView(record);
};

export const getMemberByEmail = async (
  env: MembersEnv,
  email: string
): Promise<MemberRecord | null> => {
  const raw = await env.SESSION.get(memberKey(normalizeEmail(email)));

  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw) as MemberRecord;
  } catch {
    return null;
  }
};

export const getMemberView = async (
  env: MembersEnv,
  email: string
): Promise<MemberView | null> => {
  const record = await getMemberByEmail(env, email);

  return record === null ? null : toMemberView(record);
};

const toMemberView = (record: MemberRecord): MemberView => ({
  name: record.name,
  email: record.email,
  createdAt: record.createdAt,
});
