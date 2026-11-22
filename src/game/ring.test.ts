import { describe, expect, it } from 'vitest';
import { OPEN_FRAMES, RING, ROTATE_FRAMES, openSpread, openingOffset, shortestTurn, slotAngle, slotOffset, turnAt } from './ring';

describe('ring geometry', () => {
  it('puts the active slot at the top and spreads the rest evenly', () => {
    expect(slotAngle(2, 2, 6)).toBe(-90);
    expect(slotAngle(3, 2, 6) - slotAngle(2, 2, 6)).toBe(60); // 360° / 6
    expect(slotAngle(1, 0, 4)).toBe(0); // 4 slots: the next one sits to the right
  });

  it('keeps the top and bottom slots above and below Yeray', () => {
    const top = slotOffset(0, 0, 4);
    expect(top.x).toBeCloseTo(0);
    expect(top.y).toBeCloseTo(-RING.ry);
    const bottom = slotOffset(2, 0, 4);
    expect(bottom.x).toBeCloseTo(0);
    expect(bottom.y).toBeCloseTo(RING.ry);
    const right = slotOffset(1, 0, 4);
    expect(right.x).toBeCloseTo((RING.rxTop + RING.rxBottom) / 2); // halfway down: the middle width
    expect(right.y).toBeCloseTo(0);
  });

  it('brings the upper side slots closer to Yeray than the lower ones (6 slots)', () => {
    const upperRight = slotOffset(1, 0, 6);
    const lowerRight = slotOffset(2, 0, 6);
    const upperLeft = slotOffset(5, 0, 6);
    expect(upperRight.x).toBeCloseTo(70, 0); // the campfire (left) and the dumbbells (right) in view
    expect(lowerRight.x).toBeCloseTo(113, 0); // the lower ones keep clear of Null
    expect(upperLeft.x).toBeCloseTo(-upperRight.x); // and the ring stays symmetric
    expect(upperRight.y).toBeCloseTo(-RING.ry / 2);
  });

  it.each([4, 5, 6, 7])('keeps %i slots from overlapping', (count) => {
    for (let i = 0; i < count; i++) {
      const a = slotOffset(i, 0, count);
      const b = slotOffset((i + 1) % count, 0, count);
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(RING.icon);
    }
  });

  it('turns the short way round', () => {
    expect(shortestTurn(0, 1, 6)).toBe(1);
    expect(shortestTurn(0, 5, 6)).toBe(-1); // from the first to the last: one step back
    expect(shortestTurn(5, 0, 6)).toBe(1);
    expect(shortestTurn(3.5, 5, 6)).toBe(1.5); // from halfway through a turn
  });

  it('moves in whole frames and stops after 8', () => {
    expect(turnAt(2, 1, 0)).toBe(2);
    expect(turnAt(2, 1, 4.9)).toBe(2.5); // frame 4 of 8
    expect(turnAt(2, 1, ROTATE_FRAMES)).toBe(3);
    expect(turnAt(2, 1, 100)).toBe(3);
    expect(turnAt(2, -1, 2)).toBe(1.75);
  });

  it('opens in 6 whole steps over 12 frames, ending on the normal ring', () => {
    expect(openSpread(0)).toBeCloseTo(1 / 6);
    expect(openSpread(1)).toBeCloseTo(1 / 6);
    expect(openSpread(2)).toBeCloseTo(2 / 6);
    expect(openSpread(OPEN_FRAMES - 1)).toBe(1);
    expect(openSpread(100)).toBe(1);
    for (let index = 0; index < 4; index++) {
      const open = openingOffset(index, 0, 4, 1);
      const ring = slotOffset(index, 0, 4);
      expect(open.x).toBeCloseTo(ring.x);
      expect(open.y).toBeCloseTo(ring.y);
    }
  });

  it('starts the opening close to Yeray', () => {
    const start = openingOffset(0, 0, 4, openSpread(0));
    expect(Math.hypot(start.x, start.y)).toBeLessThan(RING.icon); // within one icon of his middle
  });
});
