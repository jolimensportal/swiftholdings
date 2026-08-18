import { describe, expect, it } from 'vitest';
import { pathways } from './pathways';

describe('pathways', () => {
  it('exposes exactly two pathways', () => {
    expect(pathways).toHaveLength(2);
  });

  it('keeps the owner pathway on gold and the fund on platinum', () => {
    expect(pathways[0].accent).toBe('gold');
    expect(pathways[1].accent).toBe('platinum');
  });

  it('keeps the 70 / 30 split and the $50,000 entry in the owner path', () => {
    const owner = pathways[0];

    expect(owner.keyFacts).toContain('70 / 30 revenue share');
    expect(owner.keyFacts).toContain('$50,000 entry');
  });

  it('gives the fund pathway a distinct minimum', () => {
    expect(pathways[1].minimum).toBeTruthy();
  });
});