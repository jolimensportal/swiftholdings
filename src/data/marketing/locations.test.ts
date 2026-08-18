import { describe, expect, it } from 'vitest';
import { marketStatistics, swiftHubs } from './locations';

describe('locations', () => {
  it('lists exactly four hubs including Oyarifa', () => {
    expect(swiftHubs).toHaveLength(4);
    expect(swiftHubs.map(hub => hub.city)).toContain('Oyarifa');
  });

  it('carries the documented market statistics', () => {
    expect(marketStatistics.accommodationDeficit).toContain('300,000');
    expect(marketStatistics.nationalDeficit).toContain('2,000,000');
    expect(marketStatistics.growth).toContain('6');
  });

  it('gives every hub a role and a capsule count', () => {
    for (const hub of swiftHubs) {
      expect(hub.role).toBeTruthy();
      expect(hub.capsules).toBeGreaterThan(0);
    }
  });
});