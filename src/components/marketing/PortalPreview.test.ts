import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
describe('PortalPreview', () => {
  it('exists and mentions GHS', () => {
    const p = path.resolve('src/components/marketing/PortalPreview.astro');
    const s = fs.readFileSync(p, 'utf8');
    expect(s).toContain('Your member portal');
    expect(s).toContain('GHS 127,400');
    expect(s).toContain('/briefing');
  });
});
