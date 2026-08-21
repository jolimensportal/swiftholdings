import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
describe('redirects', () => {
  it('has oyarifa -> locations soft', () => {
    const p = path.resolve('public/_redirects');
    const s = fs.readFileSync(p, 'utf8');
    expect(s).toContain('/oyarifa');
    expect(s).toContain('/locations');
    expect(s).not.toContain('theswiftproject.com');
  });
  it('has platform -> village', () => {
    const s = fs.readFileSync(path.resolve('public/_redirects'), 'utf8');
    expect(s).toContain('/platform');
    expect(s).toContain('/village');
  });
});
