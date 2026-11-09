import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS, ratioFor } from './contrast';
import {
  AVATAR_PALETTE,
  NULL_PALETTE,
  SPRITE_PALETTE_MAX,
  UI_PALETTE,
  UI_PALETTE_MAX,
} from './palette';

const HEX = /^#[0-9a-f]{6}$/;

describe('palettes', () => {
  it('UI palette stays within the 16-bit budget', () => {
    expect(Object.keys(UI_PALETTE).length).toBeLessThanOrEqual(UI_PALETTE_MAX);
  });

  it.each([
    ['avatar', AVATAR_PALETTE],
    ['Null', NULL_PALETTE],
  ])('%s sprite palette fits 15 colors + transparent', (_name, palette) => {
    expect(Object.keys(palette).length).toBeLessThanOrEqual(SPRITE_PALETTE_MAX);
  });

  it('every color is lowercase #rrggbb', () => {
    const all = [UI_PALETTE, AVATAR_PALETTE, NULL_PALETTE].flatMap((p) => Object.values(p));
    for (const hex of all) expect(hex).toMatch(HEX);
  });
});

describe('tokens.css mirrors palette.ts', () => {
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
  const tokens = Object.fromEntries(
    [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/g)].map((m) => [m[1], m[2]]),
  );

  it('has exactly the same names and values', () => {
    expect(tokens).toEqual(UI_PALETTE);
  });
});

describe('contrast (WCAG 2.2 AA)', () => {
  it.each(CONTRAST_PAIRS.map((p) => [p.use, p] as const))('%s', (_use, pair) => {
    expect(ratioFor(pair)).toBeGreaterThanOrEqual(pair.min);
  });
});
