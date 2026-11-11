import { describe, expect, it } from 'vitest';
import { TRANSPARENT } from '../../engine/grid';
import type { SpriteSheet } from '../../engine/sprites';
import { UI_PALETTE } from '../../styles/palette';
import { ICONS } from './icons';

const ALLOWED_COLORS = new Set<string>(Object.values(UI_PALETTE));

const SHEETS: [string, SpriteSheet][] = Object.entries(ICONS).map(
  ([name, sheet]): [string, SpriteSheet] => [`icon ${name}`, sheet],
);

describe.each(SHEETS)('%s', (_name, sheet) => {
  it('legend uses only UI palette colors', () => {
    for (const hex of Object.values(sheet.legend)) expect(ALLOWED_COLORS.has(hex)).toBe(true);
  });

  for (const [animName, animation] of Object.entries(sheet.animations)) {
    it(`${animName}: every frame is exactly ${sheet.width}×${sheet.height}`, () => {
      animation.frames.forEach((frame, f) => {
        expect(frame.length, `frame ${f} rows`).toBe(sheet.height);
        frame.forEach((row, y) => expect(row.length, `frame ${f} row ${y}`).toBe(sheet.width));
      });
    });

    it(`${animName}: every pixel is in the legend`, () => {
      for (const frame of animation.frames) {
        for (const row of frame) {
          for (const ch of row) {
            if (ch !== TRANSPARENT) expect(sheet.legend, `unknown pixel "${ch}"`).toHaveProperty(ch);
          }
        }
      }
    });
  }
});
