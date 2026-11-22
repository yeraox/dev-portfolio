// A tiny cutscene player: each character follows a "script", a list of steps such as "wait 0.5 s"
// or "walk to (x, y) at this speed". Timings are changed by editing the list, never this logic.
// Pure functions → tested in script.test.ts. Positions are scene px; `y` is the line the feet
// stand on.
import type { Pose } from '../assets/characters/characters';
import type { Point } from './ring';

// TS concept — a discriminated union for the steps: `type` says which kind of step it is, and
// TypeScript only lets you read `ms` on a 'wait' and `to`/`speed` on a 'walk'.
type ScriptStep =
  | { type: 'wait'; pose: Pose; ms: number; flip?: boolean } // stay put, in a still or moving pose
  | { type: 'walk'; pose: Pose; to: Point; speed: number; flip?: boolean }; // straight line, px per second

export type ActorScript = {
  from: Point; // where the character stands when the script starts
  steps: ScriptStep[];
  rest: Pose; // the pose it keeps once its steps are over
};

/** What to draw for a character at one moment of its script. */
export type ActorFrame = {
  pose: Pose;
  x: number; // whole scene px
  ground: number; // whole scene px
  flip: boolean;
  poseTime: number; // ms since this pose started (walk cycles start on their first frame)
};

function stepDuration(step: ScriptStep, from: Point): number {
  if (step.type === 'wait') return step.ms;
  return (Math.hypot(step.to.x - from.x, step.to.y - from.y) / step.speed) * 1000;
}

/** How long the whole script takes, in ms. */
export function scriptDuration(script: ActorScript): number {
  let at = script.from;
  let total = 0;
  for (const step of script.steps) {
    total += stepDuration(step, at);
    if (step.type === 'walk') at = step.to;
  }
  return total;
}

/** Where the character is, and in which pose, `elapsed` ms after the script started. */
export function actorAt(script: ActorScript, elapsed: number): ActorFrame {
  let at = script.from;
  let stepStart = 0;
  let poseStart = 0;
  let pose: Pose | null = null;
  for (const step of script.steps) {
    // Two steps in a row with the same pose keep one cycle going, so the legs never restart.
    if (step.pose !== pose) {
      pose = step.pose;
      poseStart = stepStart;
    }
    const duration = stepDuration(step, at);
    if (elapsed < stepStart + duration) {
      const done = (elapsed - stepStart) / duration; // 0 → 1 along this step
      const to = step.type === 'walk' ? step.to : at;
      return {
        pose: step.pose,
        x: Math.round(at.x + (to.x - at.x) * done),
        ground: Math.round(at.y + (to.y - at.y) * done),
        flip: step.flip ?? false,
        poseTime: elapsed - poseStart,
      };
    }
    stepStart += duration;
    if (step.type === 'walk') at = step.to;
  }
  return { pose: script.rest, x: Math.round(at.x), ground: Math.round(at.y), flip: false, poseTime: elapsed - stepStart };
}
