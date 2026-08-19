import { describe, it, expect } from 'vitest';
import { figures } from './figures';

describe('Swift Holdings figures match the Oyarifa proposal', () => {
  it('exposes the proposal ADR range', () => {
    expect(figures.adrLow).toBe(100);
    expect(figures.adrHigh).toBe(132);
  });

  it('exposes occupancy, yield and the 80/20 split', () => {
    expect(figures.occupancyLow).toBe(33);
    expect(figures.occupancyHigh).toBe(44);
    expect(figures.yieldLow).toBe(6);
    expect(figures.yieldHigh).toBe(10);
    expect(figures.profitShareInvestor).toBe(80);
    expect(figures.profitShareOperator).toBe(20);
  });

  it('keeps the three investment tiers', () => {
    expect(figures.tiers.map(t => t.name)).toEqual([
      'Starter',
      'Cluster',
      'Block',
    ]);
  });

  it('exposes the real contacts', () => {
    expect(figures.contacts.email).toBe('info@swiftholdings.org');
    expect(figures.contacts.phoneGh).toBe('+233 544 101016');
    expect(figures.contacts.phoneCa).toBe('+1 437 421 0963');
    expect(figures.contacts.address).toBe('20 Edmonton St, Madina, Accra');
  });
});
