import { useEffect, useRef } from 'react';
import { drawAnimation, type SpriteSheet } from '../engine/sprites';

/** A 16×16 ring icon (src/assets/sprites/icons.ts) drawn once into a tiny canvas, scaled by CSS. */
export function IconCanvas({ sheet, className }: { sheet: SpriteSheet; className?: string }) {
  // TS concept — `useRef<HTMLCanvasElement>(null)`: a box that React fills with the <canvas>.
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, sheet.width, sheet.height);
    drawAnimation(ctx, sheet, sheet.animations.still, 0, 0, 0);
  }, [sheet]);

  return <canvas ref={ref} className={className} width={sheet.width} height={sheet.height} aria-hidden="true" />;
}
