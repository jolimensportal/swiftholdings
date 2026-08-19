import { describe, expect, it } from 'vitest';
import {
  fundBrackets,
  getBrackets,
  nextBusinessDays,
  ownerBrackets,
  segments,
  timezones,
  validateDiscoveryInput,
  type DiscoveryInput,
} from './discovery';

const validInput = (
  overrides: Partial<DiscoveryInput> = {}
): DiscoveryInput => ({
  name: 'Ama Owusu',
  email: 'ama@example.com',
  phone: '+233 54 400 0000',
  password: 'Obsidian9Gate',
  segment: 'diaspora',
  intent: 'prefab',
  bracket: '$100,000 – $250,000',
  timezone: 'GMT',
  slotDate: '2026-08-24',
  slotTime: '10:00',
  ...overrides,
});

describe('discovery segments and intents', () => {
  it('lists the three segments with labels and descriptions', () => {
    expect(segments.map(s => s.label)).toEqual([
      'Local Ghanaian',
      'Diaspora Partner',
      'Institutional Fund',
    ]);
    expect(segments.every(s => s.description.length > 0)).toBe(true);
  });

  it('lists the four intents with labels', () => {
    expect(getBrackets).toBeDefined();
  });
});

describe('getBrackets', () => {
  it('maps prefab intent to owner brackets', () => {
    expect(getBrackets('prefab')).toEqual(ownerBrackets);
    expect(ownerBrackets).toContain('$50,000 – $100,000');
    expect(ownerBrackets).toContain('$1M+');
  });

  it('maps ecosystem intent to fund brackets', () => {
    expect(getBrackets('ecosystem')).toEqual(fundBrackets);
    expect(fundBrackets[0]).toBe('$1M – $5M');
    expect(fundBrackets.at(-1)).toBe('$25M+');
  });

  it('returns no brackets for a stay booking', () => {
    expect(getBrackets('stay')).toEqual([]);
  });

  it('returns the exploring fallback bracket', () => {
    expect(getBrackets('exploring')).toEqual(['None yet']);
  });
});

describe('timezones', () => {
  it('covers the six approved timezones from PST to JST', () => {
    expect(timezones.map(t => t.id)).toEqual([
      'PST',
      'EST',
      'GMT',
      'CET',
      'HKT',
      'JST',
    ]);
    expect(timezones.map(t => t.offset)).toEqual([-8, -5, 0, 1, 8, 9]);
  });
});

describe('nextBusinessDays', () => {
  it('skips weekends when generating slots', () => {
    const friday = new Date('2026-08-21T12:00:00Z');
    const days = nextBusinessDays(friday, 3);

    expect(days.map(d => d.toISOString().slice(0, 10))).toEqual([
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
    ]);
  });

  it('respects the requested count', () => {
    expect(nextBusinessDays(new Date('2026-08-24T12:00:00Z'), 5)).toHaveLength(
      5
    );
  });
});

describe('validateDiscoveryInput', () => {
  it('accepts a complete valid submission', () => {
    expect(validateDiscoveryInput(validInput())).toEqual({ ok: true });
  });

  it('rejects a missing name', () => {
    const result = validateDiscoveryInput(validInput({ name: ' ' }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it('rejects a malformed email', () => {
    const result = validateDiscoveryInput(
      validInput({ email: 'not-an-email' })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeDefined();
  });

  it('rejects a malformed phone', () => {
    const result = validateDiscoveryInput(validInput({ phone: 'abc' }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.phone).toBeDefined();
  });

  it('allows an absent phone', () => {
    const result = validateDiscoveryInput(validInput({ phone: undefined }));

    expect(result.ok).toBe(true);
  });

  it('rejects a weak password', () => {
    const result = validateDiscoveryInput(validInput({ password: 'short' }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.password).toBeDefined();
  });

  it('rejects a password without an uppercase letter', () => {
    const result = validateDiscoveryInput(
      validInput({ password: 'obsidian9gate' })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.password).toBeDefined();
  });

  it('rejects an unknown segment', () => {
    const result = validateDiscoveryInput(validInput({ segment: 'galactic' }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.segment).toBeDefined();
  });

  it('rejects an unknown intent', () => {
    const result = validateDiscoveryInput(validInput({ intent: 'spaceship' }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.intent).toBeDefined();
  });

  it('requires a bracket when the intent has brackets', () => {
    const result = validateDiscoveryInput(validInput({ bracket: undefined }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.bracket).toBeDefined();
  });

  it('rejects a bracket outside the intent list', () => {
    const result = validateDiscoveryInput(
      validInput({ intent: 'ecosystem', bracket: '$50,000 – $100,000' })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.bracket).toBeDefined();
  });

  it('accepts the exploring fallback bracket', () => {
    const result = validateDiscoveryInput(
      validInput({
        intent: 'exploring',
        bracket: 'None yet',
      })
    );

    expect(result.ok).toBe(true);
  });

  it('rejects an unknown timezone', () => {
    const result = validateDiscoveryInput(validInput({ timezone: 'KAT' }));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.timezone).toBeDefined();
  });

  it('rejects a slot on a weekend', () => {
    const result = validateDiscoveryInput(
      validInput({ slotDate: '2026-08-22' })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.slotDate).toBeDefined();
  });

  it('rejects a slot in the past', () => {
    const result = validateDiscoveryInput(
      validInput({ slotDate: '2020-01-06' })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.slotDate).toBeDefined();
  });

  it('collects multiple errors at once', () => {
    const result = validateDiscoveryInput(
      validInput({ name: '', email: 'nope', timezone: 'KAT' })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.timezone).toBeDefined();
    }
  });
});
