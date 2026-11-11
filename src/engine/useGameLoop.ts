// The game's single clock: ONE requestAnimationFrame loop shared by everything that animates
// (the scene canvas, the ring turning…). It only runs while someone is subscribed and the tab is
// visible, so a hidden tab spends no battery.
import { useEffect, useEffectEvent } from 'react';

type FrameCallback = (now: number) => void;

const subscribers = new Set<FrameCallback>();
let frameId = 0;

function tick(now: number) {
  frameId = 0;
  for (const callback of subscribers) callback(now);
  start();
}

function start() {
  if (frameId === 0 && subscribers.size > 0 && !document.hidden) frameId = requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(frameId);
  frameId = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

/** Calls `onFrame(now)` on every screen refresh while `running` is true. `now` is in ms, from the
 *  same clock as `performance.now()`. */
export function useGameLoop(onFrame: FrameCallback, running = true): void {
  // TS concept — the hook's parameter is a function type; `useEffectEvent` always calls the latest
  // `onFrame` without restarting the loop when the component re-renders.
  const frame = useEffectEvent(onFrame);

  useEffect(() => {
    if (!running) return;
    const callback: FrameCallback = (now) => frame(now);
    subscribers.add(callback);
    start();
    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) stop();
    };
  }, [running]);
}
