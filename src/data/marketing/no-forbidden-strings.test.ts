import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const files = [
  '../../data/marketing/site.ts',
  '../../data/marketing/pages.ts',
  '../../data/marketing/locations.ts',
  '../../data/marketing/pathways.ts',
  '../../data/marketing/documents.ts',
  '../../data/marketing/calculator.ts',
];

const readAll = (): string =>
  files
    .map(path => readFileSync(new URL(path, import.meta.url), 'utf8'))
    .join('\n');

describe('phase 2 content regressions', () => {
  it('contains no retired model or artifact strings', () => {
    const content = readAll();

    expect(content).not.toContain('80/20');
    expect(content).not.toContain('Hamilton');
    expect(content).not.toContain('#2A1C46');
  });

  it('asserts the approved business model constants', () => {
    const content = readAll();

    expect(content).toContain('70');
    expect(content).toContain('$50,000');
  });
});
