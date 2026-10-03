import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Contrast contract for the marketing grounds.
 *
 * A browser-rendered sweep found nine WCAG AA failures on the homepage that every
 * other check passed, so these invariants are locked here. Accent tokens are only
 * safe on one ground: gold reads ~8:1 on obsidian and 1.83:1 on canvas. Static
 * analysis is enough to catch that class of bug, and it needs no browser.
 */

const RAW_CSS = readFileSync(join(process.cwd(), 'src/assets/styles/marketing.css'), 'utf8');
// Comments carry the word "background" when explaining a removal, so strip them
// before any rule matching.
const CSS = RAW_CSS.replace(/\/\*[\s\S]*?\*\//g, '');
const HOME_DIR = join(process.cwd(), 'src/components/marketing/home');

// ── colour maths ────────────────────────────────────────────────────────────

type Rgb = [number, number, number];

interface Paint {
  rgb: Rgb;
  alpha: number;
}

function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Parses `#abc`, `#aabbcc`, `rgb(r g b)` and `rgb(r g b / a)`. */
function parseColour(value: string): Paint {
  const text = value.trim();

  if (text.startsWith('#')) return { rgb: parseHex(text), alpha: 1 };

  const rgbMatch = /rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/.exec(text);
  if (rgbMatch) {
    return {
      rgb: [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])],
      alpha: rgbMatch[4] === undefined ? 1 : Number(rgbMatch[4]),
    };
  }

  throw new Error(`unsupported colour literal: ${value}`);
}

function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Flatten a possibly-translucent colour onto an opaque backdrop. */
function composite(over: Paint, backdrop: Rgb): Rgb {
  return over.rgb.map((c, i) => c * over.alpha + backdrop[i] * (1 - over.alpha)) as Rgb;
}

function contrastRatio(fg: Rgb, bg: Rgb): number {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Resolve a custom property to its declared colour, or throw if it is not one. */
function tokenPaint(name: string): Paint {
  const match = new RegExp(`${name}\\s*:\\s*(#[0-9a-fA-F]{3,6}|rgba?\\([^)]*\\))`).exec(CSS);
  if (!match) throw new Error(`token ${name} is not declared as a colour literal in marketing.css`);
  return parseColour(match[1]!);
}

function tokenHex(name: string): string {
  const paint = tokenPaint(name);
  if (paint.alpha !== 1) throw new Error(`token ${name} is translucent; use tokenPaint instead`);
  return (
    '#' +
    paint.rgb
      .map(c => Math.round(c).toString(16).padStart(2, '0'))
      .join('')
  );
}

/** Contrast of a token used as text on an opaque ground token. */
function tokenContrast(fgName: string, bgName: string): number {
  const fg = tokenPaint(fgName);
  const bg = tokenPaint(bgName);
  if (bg.alpha !== 1) throw new Error(`ground ${bgName} must be opaque`);
  return contrastRatio(composite(fg, bg.rgb), bg.rgb);
}

// ── component inventory ─────────────────────────────────────────────────────

interface HomeComponent {
  file: string;
  tone: 'canvas' | 'obsidian' | 'mixed';
  source: string;
}

function homeComponents(): HomeComponent[] {
  return readdirSync(HOME_DIR)
    .filter(f => f.endsWith('.astro'))
    .map(file => {
      const source = readFileSync(join(HOME_DIR, file), 'utf8');
      const tones = [...source.matchAll(/<SectionShell\s+tone="(\w+)"/g)].map(m => m[1]!);
      const unique = [...new Set(tones)];
      return {
        file,
        tone: (unique.length === 1 ? unique[0] : 'mixed') as HomeComponent['tone'],
        source,
      };
    });
}

// ── the contract ────────────────────────────────────────────────────────────

describe('ground contrast contract', () => {
  it('gold is legible on the obsidian ground', () => {
    expect(tokenContrast('--ground-gold', '--ground-obsidian')).toBeGreaterThanOrEqual(4.5);
  });

  it('gold has a legible canvas counterpart, and the two differ', () => {
    // The whole reason this token exists: plain gold fails on canvas.
    expect(tokenContrast('--ground-gold', '--ground-canvas')).toBeLessThan(4.5);
    expect(tokenContrast('--ground-gold-on-canvas', '--ground-canvas')).toBeGreaterThanOrEqual(4.5);
    expect(tokenHex('--ground-gold-on-canvas')).not.toBe(tokenHex('--ground-gold'));
  });

  it('body copy is legible on both grounds', () => {
    expect(tokenContrast('--ground-ink-dim', '--ground-obsidian')).toBeGreaterThanOrEqual(4.5);
    expect(tokenContrast('--ground-ink-dim-on-canvas', '--ground-canvas')).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it('caption ink is legible on both grounds', () => {
    expect(tokenContrast('--ground-ink-dim', '--ground-obsidian')).toBeGreaterThanOrEqual(4.5);
    expect(tokenContrast('--ground-ink-dim-on-canvas', '--ground-canvas')).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it('both grounds are opaque, so no caption can be sat on a translucent bar', () => {
    expect(tokenPaint('--ground-obsidian').alpha).toBe(1);
    expect(tokenPaint('--ground-canvas').alpha).toBe(1);
  });

  it('both grounds declare their own caption ink', () => {
    expect(CSS).toMatch(/\.marketing-surface-dark\s*\{[^}]*--image-label-ink\s*:/);
    expect(CSS).toMatch(/\.marketing-surface-canvas\s*\{[^}]*--image-label-ink\s*:/);
  });

  it('the image frame carries no background, so captions are not sat on a black bar', () => {
    const rule = /\.marketing-image-frame\s*\{([^}]*)\}/.exec(CSS)?.[1] ?? '';
    expect(rule).not.toMatch(/(^|[;\s])background\s*:/);
  });

  it('the image caption follows the ground instead of assuming a dark surface', () => {
    const rule = /\.marketing-image-label\s*\{([^}]*)\}/.exec(CSS)?.[1] ?? '';
    expect(rule).toContain('--image-label-ink');
    expect(rule).not.toMatch(/color\s*:\s*var\(--marketing-dim-on-dark\)\s*;/);
  });

  it('no canvas-grounded component paints text with the obsidian-only gold token', () => {
    const offenders = homeComponents()
      .filter(c => c.tone === 'canvas')
      .filter(c => /color\s*:\s*var\(--ground-gold\)/.test(c.source))
      .map(c => c.file);

    expect(offenders).toEqual([]);
  });

  it('every canvas-grounded accent uses the canvas gold token', () => {
    const offenders = homeComponents()
      .filter(c => c.tone === 'canvas')
      .filter(c => /color\s*:\s*var\(--ground-gold-on-canvas\)/.test(c.source))
      .map(c => c.file);

    // Guard against the token being deleted from every component at once.
    expect(offenders.length).toBeGreaterThan(0);
  });

  it('the gold gradient appears exactly once, on the ask', () => {
    const users = homeComponents()
      .filter(c => /linear-gradient\(120deg,\s*#e1be92/i.test(c.source))
      .map(c => c.file);

    expect(users).toEqual(['AskSection.astro']);
  });
});