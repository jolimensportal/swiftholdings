import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type MarketingImageManifest = {
  images: Array<{
    id: string;
    source: string;
    label: 'Illustrative reference';
    alt: string;
    focalPoint: 'centre' | 'north' | 'south';
    derivatives: Array<{ name: string; width: number; height: number }>;
  }>;
};

const manifestPath = new URL('./image-manifest.json', import.meta.url);
const manifest = JSON.parse(
  readFileSync(manifestPath, 'utf8')
) as MarketingImageManifest;

describe('marketing image manifest', () => {
  // Source-file pinning lives in climate.test.ts, which asserts membership
  // of an approved warm-climate set rather than freezing a literal array.

  it('declares unique positive-dimension derivatives and illustrative alt text', () => {
    const derivativeNames = manifest.images.flatMap(image => {
      expect(image.label).toBe('Illustrative reference');
      expect(image.alt).toContain('Illustrative reference');
      return image.derivatives.map(derivative => {
        expect(derivative.width).toBeGreaterThan(0);
        expect(derivative.height).toBeGreaterThan(0);
        return derivative.name;
      });
    });

    expect(new Set(derivativeNames).size).toBe(derivativeNames.length);
  });

  it('has committed derivatives after local preparation', () => {
    for (const image of manifest.images) {
      for (const derivative of image.derivatives) {
        expect(
          existsSync(
            new URL(
              `../../assets/images/marketing/${derivative.name}.webp`,
              import.meta.url
            )
          )
        ).toBe(true);
        expect(
          existsSync(
            new URL(
              `../../assets/images/marketing/${derivative.name}.jpg`,
              import.meta.url
            )
          )
        ).toBe(true);
      }
    }
  });
});
