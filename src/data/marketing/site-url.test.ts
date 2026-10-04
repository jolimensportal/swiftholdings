import { describe, it, expect } from 'vitest';
import { getCanonicalSiteUrl } from './site';

describe('getCanonicalSiteUrl', () => {
  it('falls back to the live domain when env is blank', () => {
    expect(getCanonicalSiteUrl('')).toBe('https://swifthorizon.com.gh');
  });

  it('falls back to the live domain when env is undefined', () => {
    expect(getCanonicalSiteUrl()).toBe('https://swifthorizon.com.gh');
  });

  it('returns env when set', () => {
    expect(getCanonicalSiteUrl('https://swifthorizon.com.gh')).toBe('https://swifthorizon.com.gh');
  });

  it('trims trailing slash', () => {
    expect(getCanonicalSiteUrl('https://swifthorizon.com.gh/')).toBe('https://swifthorizon.com.gh');
  });

  it('never points at the retired pages.dev origin', () => {
    expect(getCanonicalSiteUrl('')).not.toContain('swiftholdings.pages.dev');
  });
});