import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { marketingSite } from './site';

describe('primary navigation', () => {
  it('has exactly five links', () => {
    expect(marketingSite.navigation).toHaveLength(5);
  });

  it('keeps the five approved destinations in order', () => {
    expect(marketingSite.navigation.map(item => item.href)).toEqual([
      '/village',
      '/how-it-works',
      '/ownership',
      '/locations',
      '/partnership',
    ]);
  });

  it('no longer links Protections, About or Resources from the header', () => {
    const hrefs = marketingSite.navigation.map(item => item.href);
    for (const href of ['/protections', '/about', '/resources']) {
      expect(hrefs).not.toContain(href);
    }
  });

  it('retains Protections, About and Resources in the footer', () => {
    const footer = readFileSync(
      join(process.cwd(), 'src/components/marketing/SiteFooter.astro'),
      'utf8',
    );
    for (const href of ['/protections', '/about', '/resources']) {
      expect(footer).toContain(`href="${href}"`);
    }
  });
});