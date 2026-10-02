import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'src/data/marketing/image-manifest.json'), 'utf8'),
);

interface ManifestImage {
  id: string;
  source: string;
  label: string;
  alt: string;
  derivatives: { name: string; width: number; height: number }[];
}

const images = manifest.images as ManifestImage[];

describe('marketing photography is Ghana-appropriate', () => {
  it('has twelve images', () => {
    expect(images).toHaveLength(12);
  });

  it('has twelve distinct source files', () => {
    const sources = images.map(i => i.source);
    expect(new Set(sources).size).toBe(12);
  });

  it('uses only warm-climate sources', () => {
    const approved = new Set([
      'prefab_14_1920x1833.jpg',
      'prefab_16_2400x1200.jpg',
      'prefab_17_2048x1365.jpg',
      'prefab_22_1600x1106.jpg',
      'prefab_23_1600x1095.jpg',
      'prefab_25_1580x1053.jpg',
      'prefab_26_1600x996.jpg',
      'prefab_27_1600x995.jpg',
      'prefab_28_1600x995.jpg',
      'prefab_29_1500x1051.jpg',
      'prefab_31_1500x1051.jpg',
      'prefab_container_34_1600x1069.jpg',
    ]);

    for (const image of images) {
      expect(approved, `${image.id} uses ${image.source}`).toContain(image.source);
    }
  });

  it('never upscales a derivative beyond its source width', () => {
    for (const image of images) {
      const sourceWidth = Number(/(\d+)x(\d+)\.jpg$/.exec(image.source)?.[1]);
      expect(sourceWidth).toBeGreaterThan(0);

      for (const d of image.derivatives) {
        expect(d.width, `${image.id}/${d.name} upscales a ${sourceWidth}px source`).toBeLessThanOrEqual(
          sourceWidth,
        );
      }
    }
  });

  it('declares an illustrative-reference label and alt on every image', () => {
    for (const image of images) {
      expect(image.label).toBe('Illustrative reference');
      expect(image.alt).toMatch(/^Illustrative reference of /);
    }
  });
});