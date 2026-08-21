import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { marketingPages } from './pages';
import { marketingSite } from './site';
import { swiftHubs } from './locations';

const readSrc = (rel: string): string =>
  readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('homepage copy constitution', () => {
  const home = JSON.stringify(marketingPages.home);

  it('locks the approved hero verbatim', () => {
    expect(marketingPages.home.hero.eyebrow).toBe('THE SWIFT PROJECT · GHANA');
    expect(marketingPages.home.hero.title).toBe(
      "Own your place in Ghana. Let it work while you're away.",
    );
    expect(marketingPages.home.hero.lead.startsWith('Fully finished modular residences')).toBe(true);
  });

  it('keeps internal jargon and leaks off the homepage', () => {
    for (const banned of [
      'membership ecosystem',
      'GATED',
      'absolute certainty',
      'PBKDF2',
      'securemensah.workers.dev',
      'recorded',
    ]) {
      expect(home).not.toContain(banned);
    }
  });

  it('reduces Swift Holdings to the legal line', () => {
    expect(home).not.toContain('Swift Holdings');
    expect(marketingSite.name).toBe('THE SWIFT PROJECT');
    expect(marketingSite.legalName).toBe('Swift Holdings');
  });

  it('presents Stay / Own / Partner instead of tier jargon', () => {
    expect(marketingSite.tiers.map(tier => tier.name)).toEqual(['Stay', 'Own', 'Partner']);
    expect(marketingSite.tiers.map(tier => tier.cta.href)).toEqual([
      '/village',
      '/ownership',
      '/partnership',
    ]);
  });

  it('standardizes the four-hub network counts', () => {
    expect(swiftHubs.map(hub => hub.capsules)).toEqual([48, 24, 12, 12]);
  });

  it('scrubs the brand name from chrome except the legal line', () => {
    const footer = readSrc('../../components/marketing/SiteFooter.astro');
    expect(footer).toContain('THE SWIFT PROJECT');
    expect(footer).not.toContain('SWIFT HOLDINGS');
    expect(footer.match(/Operated by Swift Holdings/g)).toHaveLength(1);
    const notFound = readSrc('../../pages/404.astro');
    expect(notFound).not.toContain('Swift Holdings');
  });

  it('drops the 88% target and portal preview from the homepage', () => {
    const indexPage = readSrc('../../pages/index.astro');
    expect(indexPage).not.toContain('88%');
    expect(indexPage).not.toContain('PortalPreview');
    expect(indexPage).toContain('One standard. Four hubs.');
  });
});
