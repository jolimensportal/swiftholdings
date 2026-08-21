import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
describe('GatedTeaser', () => {
  it('file exists with lock text', () => {
    const p = path.resolve('src/components/marketing/GatedTeaser.astro');
    const s = fs.readFileSync(p, 'utf8');
    expect(s).toContain('GATED');
    expect(s).toContain('Unlock full scenarios');
    expect(s).toContain('blur');
  });
});
