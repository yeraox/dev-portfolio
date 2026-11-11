import { describe, expect, it } from 'vitest';
import { CHARACTER_IMAGES, NULL_DOG, YERAY, type Pose } from './characters';

const POSES: [string, Pose][] = [
  ...Object.entries(YERAY).map(([name, pose]): [string, Pose] => [`Yeray ${name}`, pose]),
  ...Object.entries(NULL_DOG).map(([name, pose]): [string, Pose] => [`Null ${name}`, pose]),
];

describe.each(POSES)('%s', (_name, pose) => {
  it('has at least one frame and a positive timing and size', () => {
    expect(pose.frames.length).toBeGreaterThan(0);
    expect(pose.ms).toBeGreaterThan(0);
    expect(pose.pixelSize).toBeGreaterThan(0);
  });

  it('every frame image exists and has a size', () => {
    for (const frame of pose.frames) {
      const image = CHARACTER_IMAGES[frame];
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
      expect(image.ground).toBeLessThan(image.height);
    }
  });
});

describe('Yeray poses share one height', () => {
  it('front, arms crossed and side stand within 3 image pixels of each other', () => {
    // ground + 1 = from the top of the image down to the feet (the figure starts on row 0)
    const heights = [YERAY.idle, YERAY.armsCrossed, YERAY.side].map(
      (pose) => (CHARACTER_IMAGES[pose.frames[0]].ground + 1) * pose.pixelSize,
    );
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(3);
  });
});

describe.each([
  ['toward the camera', YERAY.walkDown, YERAY.idle],
  ['side', YERAY.walkSide, YERAY.side],
])('Yeray walk %s', (_name, walk, still) => {
  const images = walk.frames.map((frame) => CHARACTER_IMAGES[frame]);

  it('is an 8-frame cycle', () => {
    expect(walk.frames).toHaveLength(8);
  });

  it('keeps one canvas and one ground line, so switching frames never jumps', () => {
    // TS concept — a Set keeps each value once: size 1 means every frame has the same value.
    expect(new Set(images.map((image) => `${image.width}×${image.height}`)).size).toBe(1);
    expect(new Set(images.map((image) => image.ground)).size).toBe(1);
  });

  it('starts and stops on the still pose without a jump', () => {
    const stillImage = CHARACTER_IMAGES[still.frames[0]];
    expect(walk.frames).toContain(still.frames[0]);
    expect(stillImage.ground).toBe(images[0].ground);
  });
});
