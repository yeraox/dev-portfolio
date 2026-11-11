import { useEffect, useRef, useState, type RefObject } from 'react';
import { ICONS } from '../assets/sprites/icons';
import { BRACKETS } from '../assets/textures';
import type { Section } from '../content/sections';
import { useGameLoop } from '../engine/useGameLoop';
import { RING, ROTATE_FRAMES, shortestTurn, slotOffset, turnAt, type Point } from '../game/ring';
import { wrap } from '../game/state';
import { toStage, type StageLayout } from '../game/stage';
import { IconCanvas } from './IconCanvas';
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

export type RingItem = Section & { title: string };

type RingMenuProps = {
  items: RingItem[];
  active: number;
  center: Point; // scene px: the ring turns around this point (Yeray's middle)
  layout: StageLayout;
  label: string; // accessible name of the menu
  reducedMotion: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  onPick: (index: number) => void;
};

/**
 * The ring menu: one button per section on an ellipse around Yeray, the active one at the top
 * inside blue brackets with its label above. ARIA "menu" pattern: the buttons are menu items
 * (actions that open a window), ←/→ move between them (handled by useInput), Enter opens.
 */
export function RingMenu({ items, active, center, layout, label, reducedMotion, menuRef, onPick }: RingMenuProps) {
  const turn = useRingTurn(active, items.length, reducedMotion);
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
  const labelTop = middle.top - (RING.ry + RING.icon / 2) * layout.scale;

  return (
    <>
      <div ref={menuRef} role="menu" aria-label={label} aria-orientation="horizontal" className={styles.ring}>
        {items.map((item, index) => {
          const offset = slotOffset(index, turn, items.length);
          const isActive = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              tabIndex={isActive ? 0 : -1}
              aria-haspopup="dialog"
              aria-label={`${item.label}: ${item.title}`}
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
              <IconCanvas sheet={ICONS[item.id]} className={styles.icon} />
            </button>
          );
        })}
      </div>
      <p className={styles.label} aria-hidden="true" style={{ left: middle.left, top: labelTop }}>
        {items[active].label}
      </p>
    </>
  );
}
