// The camp's state machine (BRIEF.md: HUB ↔ WINDOW); the title, transition and intro have their
// own (screens.ts). A pure function: (state, action) → next state, so every transition is testable.
import { isSection, type SectionId, type SlotId } from '../content/sections';

// TS concept — discriminated union: both states share the `scene` field with a different literal
// value. After `if (state.scene === 'WINDOW')`, TypeScript knows `state.section` exists.
// The open window is a section's, the CV's question ("Download the CV?") or SETTINGS: every slot
// opens one.
export type GameState =
  | { scene: 'HUB'; ring: SlotId[]; active: number }
  | { scene: 'WINDOW'; ring: SlotId[]; active: number; section: SlotId };

export type GameAction =
  | { type: 'ROTATE'; step: 1 | -1 } // ← / → / swipe: the next or previous slot comes to the top
  | { type: 'PICK'; index: number } // click / tap on a slot: it comes to the top and opens
  | { type: 'OPEN' } // Enter / Space: open the slot at the top
  | { type: 'CLOSE' }; // Esc / back button: close the window

/** `ring` = the slots the menu shows, in order. The first one starts at the top, unless the page
 *  was opened on a section's link (`opened`, e.g. /#projects): then that window starts open. */
export function initialState(ring: SlotId[], opened: SectionId | null = null): GameState {
  const index = opened ? ring.indexOf(opened) : -1;
  if (opened && index >= 0) return { scene: 'WINDOW', ring, active: index, section: opened };
  return { scene: 'HUB', ring, active: 0 };
}

/** The section named by a link's hash (#projects → 'projects'), if the ring shows it. The CV and
 *  SETTINGS have no link of their own. */
export function sectionFromHash(hash: string, ring: SlotId[]): SectionId | null {
  for (const slot of ring) {
    if (isSection(slot) && `#${slot}` === hash) return slot;
  }
  return null;
}

/** Index arithmetic that wraps around the ring: -1 → last, length → 0. */
export function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/** Opening a slot: it comes to the top and opens its window (a section, the CV's question or
 *  SETTINGS). */
function activate(state: GameState, index: number): GameState {
  return { scene: 'WINDOW', ring: state.ring, active: index, section: state.ring[index] };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.scene === 'WINDOW') {
    // While a window is open the ring stays still; only closing does something.
    return action.type === 'CLOSE' ? { scene: 'HUB', ring: state.ring, active: state.active } : state;
  }
  switch (action.type) {
    case 'ROTATE':
      return { ...state, active: wrap(state.active + action.step, state.ring.length) };
    case 'PICK':
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= state.ring.length) return state;
      return activate(state, action.index);
    case 'OPEN':
      return activate(state, state.active);
    case 'CLOSE':
      return state;
  }
}
