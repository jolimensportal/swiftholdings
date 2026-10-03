import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string): string =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

describe('marketing foundation regressions', () => {
  it('visibly labels the generated social card as an illustrative reference', () => {
    const generator = readProjectFile(
      '../../../scripts/prepare-marketing-images.mjs'
    );

    expect(generator).toContain('>ILLUSTRATIVE REFERENCE</text>');
  });

  it('supports a distinct mobile aspect ratio for curated mobile crops', () => {
    const imageFrame = readProjectFile(
      '../../components/marketing/ImageFrame.astro'
    );

    expect(imageFrame).toContain('mobileRatio?: string;');
    expect(imageFrame).toContain('--marketing-image-mobile-ratio');
  });

  it('uses the phase 2 token set (obsidian, canvas, gold) and no violet', () => {
    const marketingCss = readProjectFile('../../assets/styles/marketing.css');
    const layout = readProjectFile('../../layout/MarketingLayout.astro');

    expect(marketingCss).toContain('--marketing-obsidian-900:');
    expect(marketingCss).toContain('--marketing-canvas:');
    expect(marketingCss).toContain('--marketing-gold-gradient');
    expect(marketingCss).not.toContain('#2A1C46');
    expect(layout).not.toContain('#2A1C46');
  });

  it('uses contrasting text and focus styling on dark marketing surfaces', () => {
    const marketingCss = readProjectFile('../../assets/styles/marketing.css');
    // The homepage composes sections rather than carrying the classes itself,
    // so the surfaces are asserted on the components it renders.
    const sectionShell = readProjectFile(
      '../../components/marketing/home/SectionShell.astro'
    );
    const askSection = readProjectFile('../../components/marketing/home/AskSection.astro');

    expect(marketingCss).toContain('.marketing-surface-dark');
    expect(sectionShell).toContain('marketing-surface-dark');
    expect(sectionShell).toContain('marketing-surface-canvas');
    expect(askSection).toContain('marketing-surface-dark');
  });

  it('MarketingHero honours ratio and emits a mobile source', () => {
    const hero = readProjectFile('../../components/marketing/MarketingHero.astro');

    expect(hero).toContain("ratio = '");
    expect(hero).toContain("mobileRatio = '");
    expect(hero).toMatch(/media="\(max-width: 767px\)"/);
    expect(hero).toContain('--marketing-image-desktop-ratio');
  });

  it('validates every generated public marketing asset', () => {
    const validator = readProjectFile(
      '../../../scripts/validate-marketing-images.mjs'
    );

    for (const asset of [
      'social.png',
      'icon.svg',
      'icon-192.png',
      'icon-512.png',
      'apple-touch-icon.png',
    ]) {
      expect(validator).toContain(asset);
    }
  });

  it('loads Cormorant Garamond and Manrope through astro-font', () => {
    const layout = readProjectFile('../../layout/MarketingLayout.astro');

    expect(layout).toContain('Cormorant+Garamond');
    expect(layout).toContain('family=Manrope');
  });
});
