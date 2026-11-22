import { useEffect, useRef, useState, type RefObject } from 'react';
import { iconOutline, type IconImage } from '../assets/icons/icons';
import { BRACKETS } from '../assets/textures';
import type { SlotId } from '../content/sections';
import { useGameLoop } from '../engine/useGameLoop';
import { RING, ROTATE_FRAMES, openSpread, openingOffset, shortestTurn, turnAt, type Point } from '../game/ring';
import { wrap } from '../game/state';
import { toStage, type StageLayout } from '../game/stage';
import styles from './RingMenu.module.css';

const FRAME_MS = 1000 / 60;
const TAP_SLOP = 10; // CSS px a finger may move and still count as a tap

/** The ring's drawn position (in slots), turning towards `active` in 8 whole frames. */
function useRingTurn(active: number, count: number, reducedMotion: boolean): number {
  const [turn, setTurn] = useState(active);
  const shown = useRef(active); // the position on screen right now, even mid-turn
  const motion = useRef<{ from: number; delta: number; start: number } | null>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const from = shown.current;
    const delta = shortestTurn(wrap(from, count), active, count);
    if (delta === 0) return;
    motion.current = { from, delta, start: performance.now() };
    setMoving(true);
  }, [active, count]);

  useGameLoop((now) => {
    const m = motion.current;
    if (!m) return;
    const frame = reducedMotion ? ROTATE_FRAMES : (now - m.start) / FRAME_MS;
    shown.current = turnAt(m.from, m.delta, frame);
    setTurn(shown.current);
    if (frame >= ROTATE_FRAMES) {
      motion.current = null;
      setMoving(false);
    }
  }, moving);

  return turn;
}

/** How far the ring has spread out: 1 at once, or 1/6 → 1 in whole steps when it opens. */
function useRingOpening(opening: boolean): number {
  const [spread, setSpread] = useState(opening ? openSpread(0) : 1);
  const start = useRef<number | null>(null);

  useGameLoop((now) => {
    start.current ??= now;
    const next = openSpread((now - start.current) / FRAME_MS);
    if (next !== spread) setSpread(next);
  }, spread < 1);

  return spread;
}

export type RingItem = {
  id: SlotId;
  name: string; // shown above its icon, always: PROYECTOS, STACK…
  title: string; // what it is, for the banner and screen readers: "Alquimia — Proyectos"
  icon: IconImage;
};

type RingMenuProps = {
  items: RingItem[];
  active: number;
  center: Point; // scene px: the ring turns around this point (Yeray's middle)
  layout: StageLayout;
  label: string; // accessible name of the menu
  reducedMotion: boolean;
  opening: boolean; // spread out from Yeray when it appears (after the intro)
  menuRef: RefObject<HTMLDivElement | null>;
  onPick: (index: number) => void;
};

/**
 * The ring menu: one button per slot on an ellipse around Yeray, each with its name always visible
 * above its icon; the active one at the top, inside blue brackets, its name in green. ARIA "menu"
 * pattern: the buttons are menu items (actions), ←/→ move between them (handled by useInput),
 * Enter opens.
 */
export function RingMenu({ items, active, center, layout, label, reducedMotion, opening, menuRef, onPick }: RingMenuProps) {
  const turn = useRingTurn(active, items.length, reducedMotion);
  const spread = useRingOpening(opening);
  const firstRender = useRef(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Keyboard users: focus follows the slot at the top (unless they were busy elsewhere).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const menu = menuRef.current;
    const focused = document.activeElement;
    if (!menu || (focused && focused !== document.body && !menu.contains(focused))) return;
    menu.querySelector<HTMLElement>('[data-active="true"]')?.focus();
  }, [active, menuRef]);

  const size = RING.icon * layout.scale;
  const middle = toStage(center.x, center.y, layout);
  const outline = iconOutline(layout.scale);

  return (
    <div ref={menuRef} role="menu" aria-label={label} aria-orientation="horizontal" className={styles.ring}>
      {items.map((item, index) => {
        const offset = openingOffset(index, turn, items.length, spread);
        const isActive = index === active;
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            tabIndex={isActive ? 0 : -1}
            aria-haspopup="dialog"
            // The accessible name starts with the visible one (WCAG 2.5.3 "label in name").
            aria-label={`${item.name}: ${item.title}`}
            data-active={isActive}
            className={styles.slot}
            style={{
              left: Math.round(middle.left + offset.x * layout.scale - size / 2),
              top: Math.round(middle.top + offset.y * layout.scale - size / 2),
              width: size,
              height: size,
              borderImageSource: isActive ? BRACKETS.url : undefined,
            }}
            onClick={() => onPick(index)}
            // Touch: the tap is read from the finger itself. Right after a fast swipe, phones may
            // swallow the "click" a tap normally produces; this way the tap still counts.
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              const touch = event.changedTouches[0];
              touchStart.current = null;
              if (!start || !touch || Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > TAP_SLOP) return;
              event.preventDefault(); // no extra click afterwards: this was the tap
              onPick(index);
            }}
          >
            <img
              className={styles.icon}
              style={{ filter: outline }}
              src={item.icon.src}
              width={item.icon.width * layout.scale}
              height={item.icon.height * layout.scale}
              alt=""
              draggable={false}
            />
            {/* The names appear once the ring has spread out after the intro. */}
            {spread === 1 && (
              <span className={styles.name} data-active={isActive} aria-hidden="true">
                {item.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
