// Keyboard, mouse and touch → four game actions, so the camp doesn't care where an order came
// from. Clicks and taps on the ring's buttons stay normal button clicks (accessible by default).
import { useEffect, useEffectEvent, type RefObject } from 'react';

type InputAction = 'LEFT' | 'RIGHT' | 'CONFIRM' | 'CANCEL';

/** Return true when the action was used: the browser's default for that key is then cancelled
 *  (e.g. arrows no longer scroll the page). */
type ActionHandler = (action: InputAction) => boolean;

const SWIPE_MIN = 40; // CSS px a finger must travel sideways to count as a swipe

const KEYS: Record<string, InputAction> = {
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  Enter: 'CONFIRM',
  ' ': 'CONFIRM',
  Escape: 'CANCEL',
};

// Buttons, links and fields already react to Enter / Space by themselves.
const ACTIVATES_ITSELF = 'button, a[href], input, select, textarea, [contenteditable="true"]';

/** Keys anywhere on the page; swipes on `surface`. */
export function useInput(surface: RefObject<HTMLElement | null>, onAction: ActionHandler): void {
  const handle = useEffectEvent(onAction);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      const action = KEYS[event.key];
      if (!action) return;
      // TS concept — `instanceof` narrows: inside the `if`, `event.target` is an Element.
      if (action === 'CONFIRM' && event.target instanceof Element && event.target.closest(ACTIVATES_ITSELF)) return;
      if (handle(action)) event.preventDefault();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    let start: { x: number; y: number; id: number } | null = null;
    let ignoreClicksUntil = 0; // after a swipe, the lifting finger is not a tap

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse') return; // swipes are for fingers and pens
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
      ignoreClicksUntil = 0; // a new touch: whatever comes next is a real tap or a new swipe
    }
    function onPointerUp(event: PointerEvent) {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
      // Dragging the ring to the left brings the next slot (from the right) to the top.
      handle(dx < 0 ? 'RIGHT' : 'LEFT');
      ignoreClicksUntil = performance.now() + 400; // the finger may lift over a button
    }
    function onClick(event: MouseEvent) {
      if (performance.now() >= ignoreClicksUntil) return;
      event.stopPropagation();
      event.preventDefault();
    }
    const cancel = () => (start = null);

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', cancel);
    element.addEventListener('click', onClick, true); // capture: before the button sees it
    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', cancel);
      element.removeEventListener('click', onClick, true);
    };
  }, [surface]);
}
