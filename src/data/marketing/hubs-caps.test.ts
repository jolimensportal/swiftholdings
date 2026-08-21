import { describe, it, expect } from 'vitest';
import { hubs } from './hubs';
import { capsules } from './capsules';
describe('hubs & capsules', () => {
  it('hubs sum 96 and first is Accra 48', () => {
    expect(hubs.reduce((a, b) => a + b.units, 0)).toBe(96);
    expect(hubs[0].name).toBe('Greater Accra');
    expect(hubs[0].units).toBe(48);
  });
  it('capsules has P7 38m²', () => {
    expect(capsules.find((c) => c.id === 'P7')!.size).toBe('38m²');
  });
  it('capsules family count 5', () => {
    expect(capsules.length).toBe(5);
  });
});
