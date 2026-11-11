import { useEffect, useRef, useState } from 'react';
import { NULL_DOG, YERAY } from '../../assets/characters/characters';
import { drawPose, drawShadow, poseBob, poseFrame, preloadPoses } from '../../engine/drawCharacter';
import { useGameLoop } from '../../engine/useGameLoop';
import type { StageLayout } from '../../game/stage';
import { UI_PALETTE } from '../../styles/palette';
import { CAMP } from './campLayout';
import { FIRE, fireFrame, fireVariants } from './fireFlicker';
import styles from './CampScene.module.css';

type CampCanvasProps = {
  layout: StageLayout;
  reducedMotion: boolean;
};

type Background = { image: HTMLImageElement; fire: HTMLCanvasElement[] };

/** Loads Yeray's camp image and prepares the campfire's flicker variants from it. */
async function loadBackground(): Promise<Background> {
  const image = new Image();
  image.src = CAMP.background.image.src;
  await image.decode();
  return { image, fire: fireVariants(image) };
}

/**
 * The camp's pixels: Yeray's background image, the campfire flicker, the shadows, Yeray and Null,
 * on one canvas that works in screen pixels. The game loop asks every frame, but it only redraws
 * when something visible changed (a pose, a breath, the flame, the size).
 */
export function CampCanvas({ layout, reducedMotion }: CampCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  // TS concept — a union with null: until the image has loaded there is no background to draw.
  const [background, setBackground] = useState<Background | null>(null);
  const [posesReady, setPosesReady] = useState(false);
  const drawn = useRef('');

  useEffect(() => {
    let alive = true;
    loadBackground().then((loaded) => alive && setBackground(loaded));
    preloadPoses([YERAY.idle, NULL_DOG.sit]).then(() => alive && setPosesReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const { camera, scale, dpr } = layout;
  const cssWidth = camera.width * scale;
  const cssHeight = camera.height * scale;

  useGameLoop((now) => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !background || !posesReady) return;

    const yeray = YERAY.idle;
    const yerayFrame = poseFrame(yeray, now);
    const yerayBob = poseBob(yeray, now, reducedMotion);
    const nullFrame = poseFrame(NULL_DOG.sit, now);
    const nullBob = poseBob(NULL_DOG.sit, now, reducedMotion);
    const flame = fireFrame(now, reducedMotion);
    const key = `${canvas.width}×${canvas.height} ${camera.x} ${yerayFrame} ${yerayBob} ${nullFrame} ${nullBob} ${flame}`;
    if (key === drawn.current) return;
    drawn.current = key;

    const zoom = canvas.width / camera.width; // canvas pixels per scene pixel

    // The background and the flame share one transform, so the flame lands exactly on its spot.
    const bg = CAMP.background;
    const imageZoom = bg.scale * zoom; // canvas pixels per image pixel
    ctx.setTransform(imageZoom, 0, 0, imageZoom, (bg.x - camera.x) * zoom, (bg.y - camera.y) * zoom);
    ctx.imageSmoothingEnabled = imageZoom < 0.75; // only a strong shrink is smoothed
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(background.image, 0, 0);
    if (flame > 0) ctx.drawImage(background.fire[flame - 1], FIRE.x, FIRE.y);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.imageSmoothingEnabled = false;
    drawShadow(ctx, CAMP.yeray.x, CAMP.yeray.ground - 1, 17, 4, UI_PALETTE.ink, zoom, camera);
    drawShadow(ctx, CAMP.null.x, CAMP.null.ground - 1, 13, 3, UI_PALETTE.ink, zoom, camera);
    drawPose(ctx, yeray, yerayFrame, yerayBob, CAMP.yeray, zoom, camera);
    drawPose(ctx, NULL_DOG.sit, nullFrame, nullBob, CAMP.null, zoom, camera);
  });

  return (
    <canvas
      ref={ref}
      className={styles.canvas}
      width={Math.round(cssWidth * dpr)}
      height={Math.round(cssHeight * dpr)}
      style={{ width: cssWidth, height: cssHeight }}
      aria-hidden="true"
    />
  );
}
