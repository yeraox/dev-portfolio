import { useEffect, useRef, useState } from 'react';
import { NULL_DOG, YERAY, type Pose } from '../../assets/characters/characters';
import { drawPose, drawShadow, poseBob, poseFrame, preloadPoses } from '../../engine/drawCharacter';
import { CAMP_POSES, loadCampBackground, type CampBackground } from './campAssets';
import { useGameLoop } from '../../engine/useGameLoop';
import { actorAt, type ActorFrame } from '../../game/script';
import type { StageLayout } from '../../game/stage';
import { UI_PALETTE } from '../../styles/palette';
import { CAMP } from './campLayout';
import { FIRE, fireFrame } from './fireFlicker';
import { INTRO, INTRO_MS, INTRO_POSES } from './intro';
import styles from './CampScene.module.css';

// The intro's clock only moves while frames are drawn: a hidden tab stops the game loop, and the
// first frame back counts as one short step instead of the whole time away (the scene pauses).
const LONGEST_STEP_MS = 100;

type CampCanvasProps = {
  layout: StageLayout;
  reducedMotion: boolean;
  intro: boolean; // play the intro's script instead of the still camp
  onIntroEnd: () => void; // called once, when the script is over
};

/** The size of a character's ground shadow, in scene px (radii of the ellipse). */
function shadowFor(pose: Pose): { rx: number; ry: number } {
  if (pose === NULL_DOG.sit) return { rx: 13, ry: 3 };
  if (pose === NULL_DOG.trotSide) return { rx: 16, ry: 3 };
  if (pose === NULL_DOG.walkDown || pose === NULL_DOG.stand) return { rx: 9, ry: 2 };
  return { rx: 17, ry: 4 }; // Yeray
}

/**
 * The camp's pixels: Yeray's background image, the campfire flicker, the shadows, Yeray and Null,
 * on one canvas that works in screen pixels. During the intro the two follow its script; then
 * they stay at their places. The game loop asks every frame, but the canvas is only redrawn when
 * something visible changed (a step, a pose, a breath, the flame, the size).
 */
export function CampCanvas({ layout, reducedMotion, intro, onIntroEnd }: CampCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  // TS concept — a union with null: until the image has loaded there is no background to draw.
  const [background, setBackground] = useState<CampBackground | null>(null);
  const [posesReady, setPosesReady] = useState(false);
  const drawn = useRef('');
  const clock = useRef({ elapsed: 0, last: -1 });
  const ended = useRef(false);

  // Straight into the camp (a link, a returning visitor), the intro's walking drawings are not
  // needed, so they are not downloaded.
  const [poses] = useState(intro ? INTRO_POSES : CAMP_POSES);
  useEffect(() => {
    let alive = true;
    loadCampBackground().then((loaded) => alive && setBackground(loaded));
    preloadPoses(poses).then(() => alive && setPosesReady(true));
    return () => {
      alive = false;
    };
  }, [poses]);

  const { camera, scale, dpr } = layout;
  const cssWidth = camera.width * scale;
  const cssHeight = camera.height * scale;

  useGameLoop((now) => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !background || !posesReady) return;

    // Who stands where: the intro's script, or the camp's places.
    let actors: ActorFrame[];
    if (intro) {
      const c = clock.current;
      if (c.last >= 0) c.elapsed += Math.min(now - c.last, LONGEST_STEP_MS);
      c.last = now;
      if (c.elapsed >= INTRO_MS && !ended.current) {
        ended.current = true;
        onIntroEnd(); // the game loop always runs the latest version of this callback
      }
      actors = [actorAt(INTRO.yeray, c.elapsed), actorAt(INTRO.null, c.elapsed)];
    } else {
      actors = [
        { pose: YERAY.idle, x: CAMP.yeray.x, ground: CAMP.yeray.ground, flip: false, poseTime: now },
        { pose: NULL_DOG.sit, x: CAMP.null.x, ground: CAMP.null.ground, flip: false, poseTime: now },
      ];
    }
    // The one further down the screen is nearer the camera, so it is drawn last (in front).
    const drawOrder = [...actors].sort((a, b) => a.ground - b.ground);
    const looks = drawOrder.map((actor) => ({
      ...actor,
      frame: poseFrame(actor.pose, actor.poseTime),
      bob: poseBob(actor.pose, actor.poseTime, reducedMotion),
    }));

    const flame = fireFrame(now, reducedMotion);
    const key = `${canvas.width}×${canvas.height} ${camera.x} ${flame} ${looks.map((l) => `${l.frame} ${l.x} ${l.ground} ${l.bob} ${l.flip}`).join(' ')}`;
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
    for (const look of looks) {
      const shadow = shadowFor(look.pose);
      drawShadow(ctx, look.x, look.ground - 1, shadow.rx, shadow.ry, UI_PALETTE.ink, zoom, camera);
    }
    for (const look of looks) {
      drawPose(ctx, look.pose, look.frame, look.bob, { x: look.x, ground: look.ground, flip: look.flip }, zoom, camera);
    }
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
