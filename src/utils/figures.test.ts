import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { figures } from './figures';

/**
 * `figures.ts` is the single source for every commercial term in public copy.
 * Two sets used to disagree — $100 a share / 80/20 / $1,200 against $50,000 /
 * 70/30 — and both were live. These checks make a third divergence impossible:
 * no page may quote a price or a split that does not come from here.
 */

const read = (path: string): string => readFileSync(join(process.cwd(), path), 'utf8');

const publicPages = [
  'src/pages/ownership.astro',
  'src/pages/investment.astro',
  'src/pages/the-model.astro',
  'src/pages/market-insights.astro',
  'src/pages/village.astro',
  'src/pages/protections.astro',
  'src/pages/contact.astro',
  'src/data/marketing/pages.ts',
];

describe('commercial figures', () => {
  it('states one entry price and one split', () => {
    expect(figures.entryPrice).toBe(50000);
    expect(`${figures.profitShareInvestor} / ${figures.profitShareOperator}`).toBe('70 / 30');
    expect(figures.settlement).toBe('Monthly');
  });

  it('keeps the market context unchanged', () => {
    expect(figures.adrLow).toBe(100);
    expect(figures.adrHigh).toBe(132);
    expect(figures.occupancyLow).toBe(33);
    expect(figures.occupancyHigh).toBe(44);
    expect(figures.modelOccupancy).toBe(88);
    expect(figures.yieldLow).toBe(6);
    expect(figures.yieldHigh).toBe(10);
  });

  it('keeps the three tiers, priced from the entry price', () => {
    expect(figures.tiers.map(tier => tier.name)).toEqual(['Starter', 'Cluster', 'Block']);
    expect(figures.tiers[0]!.priceFrom).toBe(figures.entryPrice);
    for (const tier of figures.tiers) {
      expect(tier.priceFrom % figures.entryPrice).toBe(0);
    }
  });

  it('never quotes a share price or the old split', () => {
    const offenders: string[] = [];

    for (const page of publicPages) {
      const source = read(page);
      // $100 is also the bottom of the ADR range, which is legitimate market
      // context — so only flag it where it is presented as a share price.
      const sharePrice = /shares?\s+start(?:s|ing)?\s+at\s+\$100|\$100\s*(?:a|per|\/)\s*share/i;
      const oldSplit = /\b80\s*\/\s*20\b/;

      if (sharePrice.test(source) || oldSplit.test(source)) {
        offenders.push(page);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('never quotes the old $1,200 starter tier', () => {
    const offenders = publicPages.filter(page => /\$1,200|\$4,800|\$12,000/.test(read(page)));

    expect(offenders).toEqual([]);
  });

  it('agrees with the entry price the briefing form asks for', () => {
    const discovery = read('src/data/marketing/discovery.ts');
    const brackets = [...discovery.matchAll(/\$\s?([\d,]+)(?![\dMK])/g)].map(m =>
      Number(m[1]!.replace(/,/g, '')),
    );

    // The cheapest bracket offered must not undercut the actual entry price.
    expect(Math.min(...brackets)).toBeGreaterThanOrEqual(figures.entryPrice);
  });

  it('no longer exposes a share price field', () => {
    // TypeScript already proves nothing references it — the build fails on an
    // unknown property — so this only pins that the field stays gone.
    expect('sharePriceFrom' in figures).toBe(false);
    expect(figures.entryPrice).toBe(50000);
  });
});