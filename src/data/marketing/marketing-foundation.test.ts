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
    const homePage = readProjectFile('../../pages/index.astro');

    expect(marketingCss).toContain('.marketing-surface-dark');
    expect(homePage).toContain('marketing-surface-dark');
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
