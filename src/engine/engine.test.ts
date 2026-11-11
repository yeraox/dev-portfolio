import { describe, expect, it } from 'vitest';
import { filledRows, liftColumns, mirrorRows, paste, rowCenter, shiftRowsDown, swapColors, sym, withRows } from './grid';
import { anim, frameIndexAt } from './sprites';

describe('grid helpers', () => {
  it('sym mirrors the left half', () => {
    expect(sym(['ab', '.c'])).toEqual(['abba', '.cc.']);
  });

  it('withRows replaces rows from y', () => {
    expect(withRows(['aa', 'bb', 'cc'], 1, ['xx'])).toEqual(['aa', 'xx', 'cc']);
  });

  it('paste keeps pixels under spaces and clears with dots', () => {
    expect(paste(['aaaa', 'aaaa'], 1, 0, ['b .'])).toEqual(['aba.', 'aaaa']);
  });

  it('shiftRowsDown moves a block down and clears the top', () => {
    expect(shiftRowsDown(['a', 'b', 'c'], 0, 1)).toEqual(['.', 'a', 'b']);
  });

  it('liftColumns raises a foot by one pixel', () => {
    const legs = ['oo', 'xo', 'xo'];
    expect(liftColumns(legs, 0, 0, 1, 2)).toEqual(['xo', 'xo', '.o']);
  });

  it('mirrorRows flips a row range around a column', () => {
    expect(mirrorRows(['ab.', 'ab.'], 1, 1, 1)).toEqual(['ab.', '.ba']);
  });

  it('rowCenter and filledRows find the figure', () => {
    expect(rowCenter('..xx..')).toBe(2.5);
    expect(filledRows(['...', '.x.', 'xx.', '...'])).toEqual({ top: 1, bottom: 2 });
  });

  it('swapColors exchanges two colors in a row range', () => {
    expect(swapColors(['cC', 'cC'], 'c', 'C', 1, 1)).toEqual(['cC', 'Cc']);
  });
});

describe('animation timing', () => {
  const walk = anim([['a'], ['b'], ['c']], 100);

  it('picks the frame for the elapsed time and loops', () => {
    expect(frameIndexAt(walk, 0)).toBe(0);
    expect(frameIndexAt(walk, 150)).toBe(1);
    expect(frameIndexAt(walk, 299)).toBe(2);
    expect(frameIndexAt(walk, 300)).toBe(0);
  });

  it('supports a different duration per frame (e.g. a quick blink)', () => {
    const blink = anim([['open'], ['closed']], [3000, 120]);
    expect(frameIndexAt(blink, 2999)).toBe(0);
    expect(frameIndexAt(blink, 3050)).toBe(1);
  });

  it('holds the last frame when not looping', () => {
    const once = anim([['a'], ['b']], 100, false);
    expect(frameIndexAt(once, 5000)).toBe(1);
  });
});
