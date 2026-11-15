import { describe, expect, it } from 'vitest';
import type { Pose } from '../assets/characters/characters';
import { actorAt, scriptDuration, type ActorScript } from './script';

const STAND: Pose = { frames: ['yeray-front'], ms: 650, pixelSize: 1 };
const WALK: Pose = { frames: ['yeray-front-pass', 'yeray-front'], ms: 120, pixelSize: 1 };
const SIT: Pose = { frames: ['null-sit'], ms: 700, pixelSize: 0.5 };

const SCRIPT: ActorScript = {
  from: { x: 100, y: 100 },
  steps: [
    { type: 'wait', pose: STAND, ms: 500 },
    { type: 'walk', pose: WALK, to: { x: 100, y: 200 }, speed: 50 }, // 100 px at 50 px/s = 2 s
    { type: 'walk', pose: WALK, to: { x: 130, y: 240 }, speed: 50 }, // 50 px = 1 s
  ],
  rest: SIT,
};

describe('cutscene script', () => {
  it('adds up the steps: waits plus distance ÷ speed', () => {
    expect(scriptDuration(SCRIPT)).toBe(500 + 2000 + 1000);
  });

  it('waits where it starts', () => {
    expect(actorAt(SCRIPT, 0)).toMatchObject({ pose: STAND, x: 100, ground: 100 });
    expect(actorAt(SCRIPT, 499)).toMatchObject({ pose: STAND, x: 100, ground: 100 });
  });

  it('walks in a straight line at the given speed, in whole pixels', () => {
    expect(actorAt(SCRIPT, 1500)).toMatchObject({ pose: WALK, x: 100, ground: 150 });
    const frame = actorAt(SCRIPT, 1234);
    expect(Number.isInteger(frame.x) && Number.isInteger(frame.ground)).toBe(true);
    expect(actorAt(SCRIPT, 3000)).toMatchObject({ x: 115, ground: 220 });
  });

  it('keeps one walk cycle going across steps with the same pose', () => {
    expect(actorAt(SCRIPT, 500).poseTime).toBe(0); // the walk starts on its first frame
    expect(actorAt(SCRIPT, 2600).poseTime).toBe(2100); // second walk step, same cycle
  });

  it('ends in its resting pose where the last step left it', () => {
    expect(actorAt(SCRIPT, 3500)).toMatchObject({ pose: SIT, x: 130, ground: 240, poseTime: 0 });
    expect(actorAt(SCRIPT, 9000)).toMatchObject({ pose: SIT, x: 130, ground: 240 });
  });
});
