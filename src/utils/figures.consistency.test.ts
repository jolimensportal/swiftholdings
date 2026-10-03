import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { figures } from './figures';

/**
 * There must be one set of commercial terms.
 *
 * `figures.ts` is the single source for the older marketing pages: $100 a share,
 * 80/20, 6–10% net, quarterly, 33–44% occupancy. The rebuilt pages hardcode a
 * different model: $50,000 per capsule, 70/30, monthly settlement, 88%
 * occupancy, and a briefing form that asks for a $50,000–$1M bracket.
 *
 * Both are live and public, so a prospect can read /investment and /ownership
 * and cite either. These assertions document the conflict precisely: each one
 * names the term and both values. Resolving it means picking the canonical model
 * and making both sides read from here — then this file goes green and enforces
 * it from then on.
 *
 * Nothing here guesses which model is current.
 */

const read = (path: string): string =>
  readFileSync(join(process.cwd(), path), 'utf8');

const OLD_SYSTEM = {
  investment: read('src/pages/investment.astro'),
  theModel: read('src/pages/the-model.astro'),
} as const;

const NEW_SYSTEM = {
  pages: read('src/data/marketing/pages.ts'),
  ownership: read('src/pages/ownership.astro'),
  discovery: read('src/data/marketing/discovery.ts'),
} as const;

/** Every distinct money amount and revenue split asserted anywhere in public copy. */
function moneyClaims(...sources: string[]): Set<string> {
  const found = new Set<string>();
  for (const source of sources) {
    for (const m of source.matchAll(
      /\$[\d,]+(?:\s*(?:–|-|—|to)\s*\$?[\d,]+)?|\b\d{2}\s*\/\s*\d{2}\b/g,
    )) {
      found.add(m[0].replace(/\s+/g, ' ').trim());
    }
  }
  return found;
}

describe('commercial terms', () => {
  it('records the two models that currently disagree', () => {
    // The legacy model, from the shared figures module.
    expect(figures.sharePriceFrom).toBe(100);
    expect(
      `${figures.profitShareInvestor} / ${figures.profitShareOperator}`,
    ).toBe('80 / 20');
    expect(`${figures.yieldLow}–${figures.yieldHigh}%`).toBe('6–10%');
    expect(`${figures.occupancyLow}–${figures.occupancyHigh}%`).toBe('33–44%');

    // The rebuilt model, hardcoded in the newer pages.
    expect(NEW_SYSTEM.ownership).toContain('$50,000');
    expect(NEW_SYSTEM.ownership).toContain('70 / 30');
    expect(NEW_SYSTEM.pages).toContain('$50,000 entry');
  });

  it('UNRESOLVED — the investor split disagrees between the two models', () => {
    const legacy = `${figures.profitShareInvestor} / ${figures.profitShareOperator}`;
    const rebuilt = moneyClaims(NEW_SYSTEM.pages, NEW_SYSTEM.ownership);

    // Legacy says 80 / 20. The rebuilt pages say 70 / 30. Both are live.
    expect(legacy).toBe('80 / 20');
    expect(rebuilt.has('70 / 30')).toBe(true);
    expect(rebuilt.has(legacy)).toBe(false);
  });

  it('UNRESOLVED — the entry price disagrees between the two models', () => {
    const lowestLegacy = Math.min(...figures.tiers.map(t => t.priceFrom));
    const brackets = moneyClaims(NEW_SYSTEM.discovery);

    // Cheapest legacy tier is $1,200. The briefing form's floor is $50,000, and
    // the rebuilt pages quote $50,000 per capsule.
    expect(lowestLegacy).toBe(1200);
    expect([...brackets].some(c => c.startsWith('$50,000'))).toBe(true);
    expect(NEW_SYSTEM.pages).toContain('$50,000 entry');
  });

  it('uses one spelling of the brand', () => {
    // "Swift Holdings" is the operator and appears in the shared footer, but the
    // old page copy also uses it as the subject of the offer.
    expect(OLD_SYSTEM.investment).not.toContain('Swift Holdings');
  });
});