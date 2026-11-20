import { describe, expect, it } from 'vitest';
import { NULL_DOG } from '../assets/characters/characters';
import { poseBob, poseFrame } from './drawCharacter';

describe('poseFrame and poseBob', () => {
  it('walk through the frames as time passes', () => {
    const wag = NULL_DOG.wag;
    expect(poseFrame(wag, 0)).toBe(wag.frames[0]);
    expect(poseFrame(wag, wag.ms)).toBe(wag.frames[1]);
    expect(poseFrame(wag, wag.ms * wag.frames.length)).toBe(wag.frames[0]); // loops
  });

  // The bug of 2026-11-20: an idle action asked a few ms before it started got frames[-1]
  // (undefined), the drawing failed and the game loop stopped: Null vanished for good.
  it('a moment before the pose started is its first frame, never nothing', () => {
    for (const elapsed of [-1, -16, -500]) {
      expect(poseFrame(NULL_DOG.tilt, elapsed)).toBe(NULL_DOG.tilt.frames[0]);
      expect(poseBob(NULL_DOG.sit, elapsed, false)).toBe(0);
    }
  });
});
