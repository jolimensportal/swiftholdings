import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { marketingSite, marketingSiteUrl } from './site';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/**
 * Directories whose contents are user-facing and must not reintroduce a retired
 * brand. `src/content/documents` is excluded: those are contract documents that
 * legitimately name the registered operator, Swift Horizon Limited.
 */
const SCANNED_DIRS = ['src/pages', 'src/layout', 'src/components', 'src/data', 'src/utils', 'portal/src', 'public'];

const EXTENSIONS = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.json', '.webmanifest', '.mdoc', '.md', '.css']);

/** Retired names that must not reappear in customer-facing copy. */
const RETIRED_BRAND_NAMES = [
  'The Swift Project',
  'THE SWIFT PROJECT',
  'Swift Project',
];

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if ([...EXTENSIONS].some((ext) => entry.endsWith(ext))) out.push(full);
  }
  return out;
};

describe('brand identity: Swift Horizon', () => {
  it('uses the new brand as the canonical site name', () => {
    expect(marketingSite.name).toBe('SWIFT HORIZON');
  });

  it('keeps Swift Horizon Limited as the registered operator', () => {
    expect(marketingSite.legalName).toBe('Swift Horizon Limited');
  });

  it('points at the live domain, not the retired pages.dev origin', () => {
    expect(marketingSiteUrl).not.toContain('pages.dev');
  });

  it('no longer ships any retired brand name in customer-facing surfaces', () => {
    const offenders: string[] = [];

    for (const dir of SCANNED_DIRS) {
      const abs = join(ROOT, dir);
      let files: string[] = [];
      try {
        files = walk(abs);
      } catch {
        continue; // directory absent in this checkout
      }

      for (const file of files) {
        const rel = relative(ROOT, file);
        // Contract documents legitimately reference the registered operator.
        if (rel.startsWith('src/content/documents')) continue;
        // Tests assert on brand strings by design.
        if (/\.test\.[cm]?[jt]sx?$/.test(rel)) continue;

        const source = readFileSync(file, 'utf8');
        for (const retired of RETIRED_BRAND_NAMES) {
          if (source.includes(retired)) offenders.push(`${rel}: "${retired}"`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});