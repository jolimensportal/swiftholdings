import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = join(process.cwd(), 'src');
const STYLE_FILES = ['src/assets/styles/marketing.css', 'src/assets/styles/global.css'];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(astro|tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

const css = STYLE_FILES.map(p => readFileSync(join(process.cwd(), p), 'utf8')).join('\n');

// Scoped <style> blocks inside components count as definitions too — Astro scopes
// them, but they still satisfy a `marketing-*` class used in that same file.
function componentStyleBlocks(): string {
  return walk(SRC)
    .filter(file => /\.(astro|tsx)$/.test(file))
    .map(file => readFileSync(file, 'utf8'))
    .join('\n')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/g, '$1');
}

const scopedCss = componentStyleBlocks();

const definedClasses = new Set(
  [...`${css}\n${scopedCss}`.matchAll(/\.(marketing-[a-z0-9-]+)\s*[,{]/g)].map(m => m[1]!),
);
const definedVars = new Set([...css.matchAll(/(--marketing-[a-z0-9-]+)\s*:/g)].map(m => m[1]!));

// Custom properties set inline via a style attribute, not declared in a stylesheet.
const INLINE_PROPS = new Set(['--marketing-image-desktop-ratio', '--marketing-image-mobile-ratio']);

function collectUsed() {
  const classes = new Map<string, string[]>();
  const vars = new Map<string, string[]>();

  for (const file of walk(SRC)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/var\((--marketing-[a-z0-9-]+)\)/g)) {
      const list = vars.get(m[1]!) ?? [];
      list.push(file);
      vars.set(m[1]!, list);
    }
    for (const m of src.matchAll(/(?<![\w-])(marketing-[a-z0-9-]+)/g)) {
      const list = classes.get(m[0]!) ?? [];
      list.push(file);
      classes.set(m[0]!, list);
    }
  }

  return { classes, vars };
}

describe('marketing css contract', () => {
  const { classes, vars } = collectUsed();

  it('every marketing-* class used in source is defined in a stylesheet', () => {
    const missing = [...classes.entries()]
      .filter(([name]) => !definedClasses.has(name) && !definedVars.has(name))
      .map(([name, files]) => `${name} (used in ${files.length} file(s), e.g. ${files[0]})`);
    expect(missing).toEqual([]);
  });

  it('every marketing-* custom property used in source is declared', () => {
    const missing = [...vars.entries()]
      .filter(([name]) => !definedVars.has(name) && !INLINE_PROPS.has(name))
      .map(([name, files]) => `${name} (used in ${files.length} file(s), e.g. ${files[0]})`);
    expect(missing).toEqual([]);
  });
});

describe('homepage grounds', () => {
  it('declares mode-independent ground tokens', () => {
    for (const token of [
      '--ground-obsidian',
      '--ground-canvas',
      '--ground-ink',
      '--ground-ink-dim',
      '--ground-gold',
      '--ground-rule',
    ]) {
      expect(css).toMatch(new RegExp(`${token}\\s*:`));
    }
  });

  it('does not flip the ground tokens in light mode', () => {
    const lightBlock = css.slice(css.indexOf('body.light-mode'));
    for (const token of ['--ground-obsidian', '--ground-canvas', '--ground-ink']) {
      expect(lightBlock).not.toMatch(new RegExp(`${token}\\s*:`));
    }
  });

  it('gives .marketing-surface-dark a base rule independent of light mode', () => {
    const base = css.match(/^\.marketing-surface-dark\s*\{[^}]*\}/m);
    expect(base).not.toBeNull();
  });
});