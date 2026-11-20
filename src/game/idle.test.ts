import { describe, expect, it } from 'vitest';
import { NULL_DOG, YERAY } from '../assets/characters/characters';
import { BETWEEN_MS, betweenMs, idleRound, poseDuration, shuffle, type IdleAction } from './idle';

const ACTIONS: IdleAction[] = [
  { actor: 'yeray', name: 'glasses', pose: YERAY.glasses },
  { actor: 'yeray', name: 'coffee', pose: YERAY.coffee },
  { actor: 'yeray', name: 'think', pose: YERAY.think },
  { actor: 'null', name: 'tilt', pose: NULL_DOG.tilt },
  { actor: 'null', name: 'wag', pose: NULL_DOG.wag },
  { actor: 'null', name: 'scratch', pose: NULL_DOG.scratch },
];

/** A repeatable stand-in for Math.random: the same numbers, in a loop. */
function sequence(...numbers: number[]): () => number {
  let i = 0;
  return () => numbers[i++ % numbers.length];
}

describe('the idle director', () => {
  it('waits 3–6 s between two actions', () => {
    expect(betweenMs(() => 0)).toBe(BETWEEN_MS.min);
    expect(betweenMs(() => 0.999999)).toBe(BETWEEN_MS.max);
    expect(betweenMs(() => 0.5)).toBe(4500);
  });

  it('shuffles without losing or repeating an action', () => {
    const mixed = shuffle(ACTIONS, sequence(0.9, 0.1, 0.5, 0.3, 0.7));
    expect(mixed).toHaveLength(ACTIONS.length);
    expect(new Set(mixed)).toEqual(new Set(ACTIONS));
  });

  it('plays every action once a round, the two taking turns', () => {
    for (const random of [sequence(0.1), sequence(0.9), sequence(0.3, 0.8, 0.5, 0.05)]) {
      const round = idleRound(ACTIONS, random);
      expect(new Set(round)).toEqual(new Set(ACTIONS)); // all six, once each
      expect(round.map((action) => action.actor)).toEqual(['yeray', 'null', 'yeray', 'null', 'yeray', 'null']);
    }
  });

  it('never plays the same action twice in a row, not even from one round to the next', () => {
    const played = [...idleRound(ACTIONS, sequence(0.2, 0.7)), ...idleRound(ACTIONS, sequence(0.6, 0.1))];
    played.slice(1).forEach((action, i) => expect(action).not.toBe(played[i]));
  });

  it('knows how long a pose plays', () => {
    expect(poseDuration(NULL_DOG.tilt)).toBe(6 * 120);
  });
});
