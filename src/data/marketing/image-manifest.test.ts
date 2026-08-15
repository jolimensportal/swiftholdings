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
  it('contains the approved twelve curated source files exactly once', () => {
    expect(manifest.images.map(image => image.source)).toEqual([
      'prefab_2_2048x1365.jpg',
      'prefab_10_2500x1667.jpg',
      'prefab_6_4368x2912.jpg',
      'prefab_8_2943x1962.jpg',
      'prefab_16_2400x1200.jpg',
      'prefab_18_1800x1210.jpg',
      'prefab_19_1800x1200.jpg',
      'prefab_25_1580x1053.jpg',
      'prefab_28_1600x995.jpg',
      'prefab_29_1500x1051.jpg',
      'prefab_31_1500x1051.jpg',
      'prefab_37_1200x840.jpg',
    ]);
  });

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
