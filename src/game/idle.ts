// The idle director's rules: every few seconds, one character does one of its
// idle actions, whether or not the visitor is using the ring — the camp feels alive. They go in
// rounds: each action once a round, in a random order, the two characters taking turns. Pure
// functions (the timing and the order), tested.
import type { Pose } from '../assets/characters/characters';

export type IdleActor = 'yeray' | 'null';
export type IdleAction = { actor: IdleActor; name: string; pose: Pose };

/** The pause between two actions: 3–6 s, different every time. */
export const BETWEEN_MS = { min: 3000, max: 6000 };

/** `random` is Math.random in the game (0 ≤ r < 1) and a fixed sequence in the tests. */
export function betweenMs(random: () => number): number {
  return Math.round(BETWEEN_MS.min + random() * (BETWEEN_MS.max - BETWEEN_MS.min));
}

/** A copy of `actions` in a random order (the Fisher–Yates shuffle: every order equally likely). */
export function shuffle(actions: IdleAction[], random: () => number): IdleAction[] {
  const out = [...actions];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * One round: each character's actions in a random order, taking turns (Yeray, Null, Yeray…). So
 * every action plays once a round — none is left waiting by bad luck — and, as the turns
 * alternate, the same action never plays twice in a row.
 */
export function idleRound(actions: IdleAction[], random: () => number): IdleAction[] {
  const yeray = shuffle(actions.filter((action) => action.actor === 'yeray'), random);
  const dog = shuffle(actions.filter((action) => action.actor === 'null'), random);
  const round: IdleAction[] = [];
  for (let i = 0; i < Math.max(yeray.length, dog.length); i++) {
    if (yeray[i]) round.push(yeray[i]);
    if (dog[i]) round.push(dog[i]);
  }
  return round;
}

/** How long a pose plays once: every frame, `ms` each. */
export function poseDuration(pose: Pose): number {
  return pose.frames.length * pose.ms;
}
