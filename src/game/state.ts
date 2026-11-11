// The camp's state machine (BRIEF.md: HUB ↔ WINDOW). TITLE, TRANSITION and INTRO join in
// phases 5–6. A pure function: (state, action) → next state, so every transition is testable.
import type { SectionId } from '../content/sections';

// TS concept — discriminated union: both states share the `scene` field with a different literal
// value. After `if (state.scene === 'WINDOW')`, TypeScript knows `state.section` exists.
export type GameState =
  | { scene: 'HUB'; ring: SectionId[]; active: number }
  | { scene: 'WINDOW'; ring: SectionId[]; active: number; section: SectionId };

export type GameAction =
  | { type: 'ROTATE'; step: 1 | -1 } // ← / → / swipe: the next or previous slot comes to the top
  | { type: 'PICK'; index: number } // click / tap on a slot: it comes to the top and opens
  | { type: 'OPEN' } // Enter / Space: open the slot at the top
  | { type: 'CLOSE' }; // Esc / back button: close the window

/** `ring` = the sections the menu shows, in order. The first one starts at the top. */
export function initialState(ring: SectionId[]): GameState {
  return { scene: 'HUB', ring, active: 0 };
}

/** Index arithmetic that wraps around the ring: -1 → last, length → 0. */
export function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
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
      return { scene: 'WINDOW', ring: state.ring, active: action.index, section: state.ring[action.index] };
    case 'OPEN':
      return { scene: 'WINDOW', ring: state.ring, active: state.active, section: state.ring[state.active] };
    case 'CLOSE':
      return state;
  }
}
