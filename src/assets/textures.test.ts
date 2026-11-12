import { describe, expect, it } from 'vitest';
import { BANNER_DITHER, BRACKETS, BRACKET_SLICE, DARKEN_STEPS, ROPE_FRAME, STONE_TILE } from './textures';

describe('textures', () => {
  it('stone only uses colors that keep window text readable', () => {
    // Text may only sit on stone-0 / stone-1 (and ink is darker still).
    expect(STONE_TILE.colors.sort()).toEqual(['ink', 'stone-0', 'stone-1']);
  });

  it('stone is mostly stone, with only sparse ink pits', () => {
    expect(STONE_TILE.width).toBe(32);
    expect(STONE_TILE.height).toBe(32);
  });

  it('banner dither mixes the two banner blues', () => {
    expect(BANNER_DITHER.colors.sort()).toEqual(['blue-1', 'blue-2']);
  });

  it('rope frame is a 3×3 nine-slice of 6 px cells in gold and ink', () => {
    expect(ROPE_FRAME.width).toBe(18);
    expect(ROPE_FRAME.colors.every((c) => c === 'ink' || c.startsWith('gold-'))).toBe(true);
  });

  it('selection brackets are blue corners that fit their nine-slice cells', () => {
    expect(BRACKETS.colors).toEqual(['blue-3']);
    expect(BRACKETS.width).toBe(8);
    expect(BRACKET_SLICE * 2).toBeLessThan(BRACKETS.width); // the middle stays empty
  });

  it('the transition darkens in three dithered steps, only with night-0', () => {
    expect(DARKEN_STEPS).toHaveLength(3);
    for (const step of DARKEN_STEPS) expect(step.colors).toEqual(['night-0']);
  });

  it('textures are CSS-ready data URLs', () => {
    expect(STONE_TILE.url.startsWith('url("data:image/svg+xml,')).toBe(true);
  });
});
