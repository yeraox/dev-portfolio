// The game's single clock: ONE requestAnimationFrame loop shared by everything that animates
// (the scene canvas, the ring turning…). It only runs while someone is subscribed and the tab is
// visible, so a hidden tab spends no battery. If the device can't keep 60 fps, it drops to a
// steady 30 (frameRate.ts) and marks <html data-fps="30">.
import { useEffect, useEffectEvent } from 'react';
import { FIRST_FRAME_RATE, onRefresh } from './frameRate';

type FrameCallback = (now: number) => void;

const subscribers = new Set<FrameCallback>();
let frameId = 0;
let frameRate = FIRST_FRAME_RATE;

function tick(now: number) {
  frameId = 0;
  const step = onRefresh(frameRate, now);
  if (step.rate.halved && !frameRate.halved) document.documentElement.dataset.fps = '30';
  frameRate = step.rate;
  if (step.run) for (const callback of subscribers) callback(now);
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
