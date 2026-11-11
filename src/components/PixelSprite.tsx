import { useEffect, useState } from 'react';
import { CHARACTER_IMAGES, type Pose } from '../assets/characters/characters';
import styles from './PixelSprite.module.css';

type PixelSpriteProps = {
  pose: Pose;
  unit: number; // CSS px for one image pixel of a pixelSize-1 pose (e.g. the scene scale)
  flip?: boolean; // face the other way
  className?: string;
};

/** One character pose, crisp at a whole-number zoom. Cycles its frames when it has several,
 *  or bobs 1 px in hard steps when it has a single drawing. Drawn as a background so several
 *  frames can share one png (walk sheets): only the frame's rows are shown. */
export function PixelSprite({ pose, unit, flip = false, className }: PixelSpriteProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (pose.frames.length < 2) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % pose.frames.length), pose.ms);
    return () => window.clearInterval(id);
  }, [pose]);

  const image = CHARACTER_IMAGES[pose.frames[frame % pose.frames.length]];
  // Whole CSS pixels per image pixel, so every pixel stays a perfect square.
  const zoom = Math.max(1, Math.round(pose.pixelSize * unit));
  const classes = [styles.sprite, pose.bob && styles.bob, flip && styles.flip, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      aria-hidden="true"
      style={{
        width: image.width * zoom,
        height: image.height * zoom,
        backgroundImage: `url(${image.src})`,
        backgroundSize: `${image.width * zoom}px auto`,
        backgroundPosition: `0 ${-image.y * zoom}px`,
        animationDuration: pose.bob ? `${pose.ms * 2}ms` : undefined,
      }}
    />
  );
}
