import { describe, expect, it } from 'vitest';
import { NULL_DOG, YERAY } from '../../assets/characters/characters';
import { OPEN_FRAMES } from '../../game/ring';
import { actorAt, scriptDuration } from '../../game/script';
import { CAMP } from './campLayout';
import { CAVE_MOUTH, INTRO, INTRO_MS } from './intro';

const FRAME_MS = 1000 / 60;

describe('the intro', () => {
  it('lasts 4–6 s in all, the ring opening included', () => {
    const total = INTRO_MS + OPEN_FRAMES * FRAME_MS;
    expect(total).toBeGreaterThanOrEqual(4000);
    expect(total).toBeLessThanOrEqual(6000);
  });

  it('starts both characters in the cave mouth', () => {
    for (const script of [INTRO.yeray, INTRO.null]) {
      expect(script.from.x).toBeGreaterThan(CAVE_MOUTH.left);
      expect(script.from.x).toBeLessThan(CAVE_MOUTH.right);
      expect(script.from.y).toBeGreaterThan(CAVE_MOUTH.top);
      expect(script.from.y).toBeLessThanOrEqual(CAVE_MOUTH.floor);
    }
  });

  it('ends exactly where the camp draws them, in the camp poses (no jump at the hand-over)', () => {
    expect(actorAt(INTRO.yeray, INTRO_MS)).toMatchObject({ pose: YERAY.idle, x: CAMP.yeray.x, ground: CAMP.yeray.ground });
    expect(actorAt(INTRO.null, INTRO_MS)).toMatchObject({ pose: NULL_DOG.sit, x: CAMP.null.x, ground: CAMP.null.ground });
  });

  it('has Null set off after Yeray and stay behind him on the way down', () => {
    expect(actorAt(INTRO.null, 600).pose).toBe(NULL_DOG.stand);
    expect(actorAt(INTRO.yeray, 600).pose).toBe(YERAY.walkDown);
    for (let ms = 0; ms < scriptDuration(INTRO.yeray); ms += 100) {
      expect(actorAt(INTRO.null, ms).ground).toBeLessThanOrEqual(actorAt(INTRO.yeray, ms).ground);
    }
  });
});
