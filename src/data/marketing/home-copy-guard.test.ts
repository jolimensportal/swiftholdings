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
    expect(marketingPages.home.hero.eyebrow).toBe('SWIFT HORIZON · GHANA');
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
    expect(marketingSite.name).toBe('SWIFT HORIZON');
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
    expect(footer).toContain('SWIFT HORIZON');
    expect(footer).not.toContain('SWIFT HOLDINGS');
    expect(footer.match(/Operated by \{marketingSite\.legalName\}/g)).toHaveLength(1);
    const notFound = readSrc('../../pages/404.astro');
    expect(notFound).not.toContain('Swift Holdings');
  });

  it('drops the 88% target and portal preview from the homepage', () => {
    const indexPage = readSrc('../../pages/index.astro');
    expect(indexPage).not.toContain('88%');
    expect(indexPage).not.toContain('PortalPreview');
  });

  it('keeps the hub statement in the network section', () => {
    const network = readSrc('../../components/marketing/home/NetworkSection.astro');

    expect(network).toContain('One standard.');
    expect(network).toContain('Four hubs.');
  });

  it('homepage composes the approved section order', () => {
    const indexPage = readSrc('../../pages/index.astro');
    const order = [
      'MarketingHero',
      'ImageRail',
      'ProblemSection',
      'MechanismSection',
      'OperationsSection',
      'CapsuleSection',
      'VillageSection',
      'ModularSection',
      'AcquireSection',
      'AssumptionsSection',
      'NetworkSection',
      'DiasporaSection',
      'WaysSection',
      'AskSection',
      'ImageCredits',
    ];

    const positions = order.map(name => indexPage.indexOf(`<${name}`));

    for (const position of positions) {
      expect(position).toBeGreaterThan(-1);
    }
    for (let i = 1; i < positions.length; i += 1) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]!);
    }
  });

  it('uses the canonical wordmark in the header', () => {
    const header = readSrc('../../components/marketing/SiteHeader.astro');

    expect(header).toContain('SWIFT');
    expect(header).toContain('HORIZON');
    expect(header).not.toContain('PROJECT');
  });

  it('does not reference the retired brand anywhere customer-facing', () => {
    // Strip markup first: the retired wordmark is split across an element,
    // so a plain substring match would pass vacuously.
    const text = (src: string): string =>
      src
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .toUpperCase();

    for (const rel of [
      '../../components/marketing/SiteHeader.astro',
      '../../components/marketing/SiteFooter.astro',
      '../../layout/MarketingLayout.astro',
    ]) {
      expect(text(readSrc(rel))).not.toContain('THE SWIFT PROJECT');
    }
  });
});
