// Animations on or off. The visitor's own choice in SETTINGS wins; until they make one, the
// system decides (prefers-reduced-motion: reduce → off). React reads it with useAnimations() and
// useReducedMotion(); CSS reads it from <html data-motion="on|off">, so one switch stops every
// animation: the intro walk, the transitions, the ring's turn, the campfire, the breathing, the
// idle actions, the blinking and the windows' wipe (WCAG 2.2.2 Pause, Stop, Hide).
import { useSyncExternalStore } from 'react';

// TS concept — a union of two literals: the setting can only be 'on' or 'off', never a typo.
export type Animations = 'on' | 'off';

const QUERY = '(prefers-reduced-motion: reduce)';
const KEY = 'animations';
const listeners = new Set<() => void>();

/** The choice saved on an earlier visit, or null when the visitor never made one. */
function readSaved(): Animations | null {
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved === 'on' || saved === 'off' ? saved : null;
  } catch {
    return null; // no storage (blocked): follow the system
  }
}

function systemReduces(): boolean {
  return window.matchMedia(QUERY).matches;
}

let choice: Animations | null = typeof window === 'undefined' ? null : readSaved();

/** What applies now: the visitor's choice or, without one, the system's preference. */
function current(): Animations {
  if (choice) return choice;
  return systemReduces() ? 'off' : 'on';
}

function update(): void {
  document.documentElement.dataset.motion = current();
  for (const notify of listeners) notify();
}

if (typeof window !== 'undefined') {
  update();
  window.matchMedia(QUERY).addEventListener('change', update); // the system setting changed
}

/** The visitor's choice: applied at once everywhere, and saved for the next visit. */
export function setAnimations(value: Animations): void {
  choice = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Not saved (storage blocked): it still applies for this visit.
  }
  update();
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

/** What SETTINGS shows as chosen: the animations as they are now. */
export function useAnimations(): Animations {
  return useSyncExternalStore(subscribe, current);
}

/** True when there should be less motion: animations off, by choice or by the system. */
export function useReducedMotion(): boolean {
  return useAnimations() === 'off';
}

/** True when the animations are off only because the system asks for less motion (the visitor
 *  never chose): SETTINGS says so. */
export function useSystemReducesMotion(): boolean {
  return useSyncExternalStore(subscribe, () => choice === null && systemReduces());
}
