import { describe, expect, it } from 'vitest';
import { PORTRAIT_PX } from '../../game/stage';
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
  it('front and side stand within 3 image pixels of each other', () => {
    // ground + 1 = from the top of the image down to the feet (the figure starts on row 0)
    const heights = [YERAY.idle, YERAY.side].map(
      (pose) => (CHARACTER_IMAGES[pose.frames[0]].ground + 1) * pose.pixelSize,
    );
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(3);
  });
});

describe('Null is one size standing, walking and sitting', () => {
  it('his walk and his sitting picture stand within 3 scene px of each other', () => {
    const heights = [NULL_DOG.stand, NULL_DOG.sit].map(
      (pose) => (CHARACTER_IMAGES[pose.frames[0]].ground + 1) * pose.pixelSize,
    );
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(3);
  });
});

describe.each([
  ['Yeray toward the camera', YERAY.walkDown, YERAY.idle],
  ['Yeray side', YERAY.walkSide, YERAY.side],
  ['Null toward the camera', NULL_DOG.walkDown, NULL_DOG.stand],
])('walk: %s', (_name, walk, still) => {
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

describe('HUD portraits', () => {
  it("Null's portrait (without its gold frame) is the size of the HUD's screen", () => {
    expect(CHARACTER_IMAGES['null-portrait'].width).toBe(PORTRAIT_PX);
    expect(CHARACTER_IMAGES['null-portrait'].height).toBe(PORTRAIT_PX);
  });

  it("Yeray's drawing ×2 fits that screen across and shows his neck and collar below the face", () => {
    const face = CHARACTER_IMAGES['yeray-front'];
    expect(face.width * 2).toBeLessThanOrEqual(PORTRAIT_PX);
    expect(face.top).toBe(0);
    // The screen shows 57 rows of his drawing (115 / 2): the face ends near row 40.
    expect(Math.floor(PORTRAIT_PX / 2)).toBeGreaterThanOrEqual(50);
  });
});

describe.each([
  ['Null tilts his head', NULL_DOG.tilt, NULL_DOG.sit],
  ['Null wags his tail', NULL_DOG.wag, NULL_DOG.sit],
  ['Null scratches his ear', NULL_DOG.scratch, NULL_DOG.sit],
  ['Yeray pushes up his glasses', YERAY.glasses, YERAY.idle],
  ['Yeray drinks his coffee', YERAY.coffee, YERAY.idle],
  ['Yeray thinks', YERAY.think, YERAY.idle],
])('idle action: %s', (_name, action, rest) => {
  const still = CHARACTER_IMAGES[rest.frames[0]];

  it('stands on the still drawing\'s ground line and keeps its centre, so it starts and ends without a jump', () => {
    for (const frame of action.frames) {
      const image = CHARACTER_IMAGES[frame];
      // Nothing below the feet: the same rows under the ground line as the still drawing.
      expect(image.height - image.ground).toBe(still.height - still.ground);
      // Widened evenly on both sides: an even difference keeps the middle column in place.
      expect((image.width - still.width) % 2).toBe(0);
    }
    expect(action.pixelSize).toBe(rest.pixelSize);
  });
});
