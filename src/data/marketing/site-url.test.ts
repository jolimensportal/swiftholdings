import { describe, it, expect } from 'vitest';
import { getCanonicalSiteUrl } from './site';
describe('getCanonicalSiteUrl', () => {
  it('returns pages.dev when env blank', () => {
    expect(getCanonicalSiteUrl('')).toBe('https://swiftholdings.pages.dev');
  });
  it('returns env when set', () => {
    expect(getCanonicalSiteUrl('https://theswiftproject.com')).toBe('https://theswiftproject.com');
  });
  it('trims trailing slash', () => {
    expect(getCanonicalSiteUrl('https://theswiftproject.com/')).toBe('https://theswiftproject.com');
  });
});
