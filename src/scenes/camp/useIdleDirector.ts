// What Yeray and Null do in the camp: every 3–6 s one of them plays an idle
// action once — pushing up his glasses, a sip of coffee, a tail wag… — in rounds where each action
// plays once and the two take turns (game/idle.ts).
import { useEffect, useRef, type RefObject } from 'react';
import { NULL_DOG, YERAY } from '../../assets/characters/characters';
import { preloadPoses } from '../../engine/drawCharacter';
import { betweenMs, idleRound, poseDuration, type IdleAction } from '../../game/idle';

const IDLE_ACTIONS: IdleAction[] = [
  { actor: 'yeray', name: 'glasses', pose: YERAY.glasses },
  { actor: 'yeray', name: 'coffee', pose: YERAY.coffee },
  { actor: 'yeray', name: 'think', pose: YERAY.think },
  { actor: 'null', name: 'tilt', pose: NULL_DOG.tilt },
  { actor: 'null', name: 'wag', pose: NULL_DOG.wag },
  { actor: 'null', name: 'scratch', pose: NULL_DOG.scratch },
];

/** The action playing now, if any, and when it started (performance.now() ms). */
export type IdleNow = IdleAction & { start: number };

/**
 * Plays idle actions while `enabled` (the camp is on screen with no window, no intro, no reduced
 * motion): one every 3–6 s, whatever the visitor is doing — turning the ring does not stop them.
 * Returns a ref the canvas reads every frame: no re-render is needed. Each action's drawings
 * download the first time it is about to play (a few KB), so they never weigh on the camp's first
 * load.
 */
export function useIdleDirector(enabled: boolean): RefObject<IdleNow | null> {
  const current = useRef<IdleNow | null>(null);
  // What plays next: the rest of this round (game/idle.ts). It survives a window opening and
  // closing, so the round goes on where it was.
  const queue = useRef<IdleAction[]>([]);

  useEffect(() => {
    current.current = null;
    if (!enabled) return;
    let timer = 0;
    let alive = true; // false once the camp is covered or gone: a download that ends then is ignored
    const pause = () => {
      current.current = null;
      timer = window.setTimeout(play, betweenMs(Math.random));
    };
    const play = () => {
      if (queue.current.length === 0) queue.current = idleRound(IDLE_ACTIONS, Math.random);
      const action = queue.current.shift();
      if (!action) return;
      preloadPoses([action.pose]).then(() => {
        if (!alive) return;
        current.current = { ...action, start: performance.now() };
        timer = window.setTimeout(pause, poseDuration(action.pose));
      });
    };
    pause();
    return () => {
      alive = false;
      window.clearTimeout(timer);
      current.current = null;
    };
  }, [enabled]);

  return current;
}
