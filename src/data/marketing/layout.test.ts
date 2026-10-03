import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Layout guards for the shared marketing chrome.
 *
 * The footer's six links sat in a non-wrapping flex row 747px wide, which pushed
 * the whole page into sideways scroll below ~800px. Nothing caught it: the
 * desktop overflow check passed, because desktop is exactly where it does not
 * break.
 */

const CSS = readFileSync(join(process.cwd(), 'src/assets/styles/marketing.css'), 'utf8');

function rule(selector: string): string {
  return new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(CSS)?.[1] ?? '';
}

describe('shared marketing layout', () => {
  it('the footer link row wraps instead of overflowing narrow viewports', () => {
    expect(rule('.site-footer-links')).toMatch(/flex-wrap\s*:\s*wrap/);
  });

  it('the footer link row never declares a fixed width', () => {
    expect(rule('.site-footer-links')).not.toMatch(/(^|[;\s])width\s*:/);
  });

  it('the header nav wraps too', () => {
    const nav = rule('.site-nav-links');
    expect(nav === '' || /flex-wrap\s*:\s*wrap/.test(nav)).toBe(true);
  });
});