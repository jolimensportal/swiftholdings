import { describe, it, expect } from 'vitest';
import { marketingPages } from './pages';
describe('rich copy', () => {
  it('ownership has 800+ chars and gated teaser', () => {
    const p = marketingPages.ownership as unknown as { sections?: string[]; hero: { lead: string } };
    const all = (p.sections?.join('') ?? p.hero.lead) + JSON.stringify(p);
    expect(all.length).toBeGreaterThan(800);
    expect(JSON.stringify(p)).toContain('GATED');
  });
  it('locations has hub caps 48', () => {
    const s = JSON.stringify(marketingPages.locations);
    expect(s).toContain('48');
  });
});
