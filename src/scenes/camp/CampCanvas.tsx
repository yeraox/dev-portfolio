import { useEffect, useMemo, useRef, useState } from 'react';
import { NULL_DOG, YERAY } from '../../assets/characters/characters';
import { drawPose, drawShadow, poseBob, poseFrame, preloadPoses } from '../../engine/drawCharacter';
import { useGameLoop } from '../../engine/useGameLoop';
import type { StageLayout } from '../../game/stage';
import { UI_PALETTE } from '../../styles/palette';
import { CAMP } from './campLayout';
import { BACKGROUND, provisionalBackground } from './provisionalBackground';
import styles from './CampScene.module.css';

type CampCanvasProps = {
  layout: StageLayout;
  idleSince: number; // performance.now() of the last menu input
  reducedMotion: boolean;
};

/**
 * The camp's pixels: background, Yeray and Null, on one canvas that works in screen pixels.
 * The game loop asks every frame, but it only redraws when something visible changed (a pose,
 * a breath, the size): most frames cost one string comparison.
 */
export function CampCanvas({ layout, idleSince, reducedMotion }: CampCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const background = useMemo(() => provisionalBackground(), []);
  const [ready, setReady] = useState(false);
  const drawn = useRef('');

  useEffect(() => {
    let alive = true;
    preloadPoses([YERAY.idle, YERAY.armsCrossed, NULL_DOG.sit]).then(() => alive && setReady(true));
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
    if (!canvas || !ctx || !ready) return;

    const yeray = now - idleSince > CAMP.armsCrossedAfterMs ? YERAY.armsCrossed : YERAY.idle;
    const yerayFrame = poseFrame(yeray, now);
    const yerayBob = poseBob(yeray, now, reducedMotion);
    const nullFrame = poseFrame(NULL_DOG.sit, now);
    const nullBob = poseBob(NULL_DOG.sit, now, reducedMotion);
    const key = `${canvas.width}×${canvas.height} ${camera.x} ${yerayFrame} ${yerayBob} ${nullFrame} ${nullBob}`;
    if (key === drawn.current) return;
    drawn.current = key;

    const zoom = canvas.width / camera.width; // canvas pixels per scene pixel
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      background,
      camera.x / BACKGROUND.pixel,
      camera.y / BACKGROUND.pixel,
      camera.width / BACKGROUND.pixel,
      camera.height / BACKGROUND.pixel,
      0,
      0,
      canvas.width,
      canvas.height,
    );
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
