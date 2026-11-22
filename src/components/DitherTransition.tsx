import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { DARKEN_STEPS } from '../assets/textures';
import { useGameLoop } from '../engine/useGameLoop';
import styles from './DitherTransition.module.css';

const FRAME_MS = 1000 / 60;
const FRAMES_PER_STEP = 4; // 5 steps × 4 frames ≈ 0.33 s each way (DESIGN.md, "Title screen": 12–20 frames)
const SOLID = 4;

type DitherTransitionProps = {
  half: 'out' | 'in'; // out: clear → dark; in: dark → clear
  reducedMotion: boolean; // then it jumps straight to the end
  onEnd: () => void; // called once the half is complete
};

/**
 * The scene transition: a 16-bit "fade" that darkens through dithered steps of the palette (a 4×4
 * pattern, ¼ → ½ → ¾ → solid night) instead of a smooth fade. Covers the page and takes no input.
 */
export function DitherTransition({ half, reducedMotion, onEnd }: DitherTransitionProps) {
  const [step, setStep] = useState(0); // 0..4, how far this half has gone
  const start = useRef<number | null>(null);
  const end = useEffectEvent(onEnd);

  useGameLoop((now) => {
    start.current ??= now;
    const next = reducedMotion ? SOLID : Math.min(SOLID, Math.floor((now - start.current) / (FRAMES_PER_STEP * FRAME_MS)));
    if (next !== step) setStep(next);
  });

  useEffect(() => {
    if (step === SOLID) end();
  }, [step]);

  const darkness = half === 'out' ? step : SOLID - step;
  return (
    <div
      className={styles.cover}
      aria-hidden="true"
      data-darkness={darkness}
      style={{ backgroundImage: darkness > 0 && darkness < SOLID ? DARKEN_STEPS[darkness - 1].url : undefined }}
    />
  );
}
