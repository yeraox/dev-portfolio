// "Press any key" for the title (to start) and the intro (to skip it). Some keys never count:
// moving between the controls (Tab), holding a modifier, Escape, or pressing Enter/Space on a
// button, which already does that button's own thing.
const IGNORED_KEYS = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape']);
const CONTROLS = 'button, a[href], input';

/** True when the key press should count as "any key". */
export function isAnyKey(event: KeyboardEvent): boolean {
  if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || IGNORED_KEYS.has(event.key)) return false;
  const onControl = event.target instanceof Element && event.target.closest(CONTROLS);
  return !(onControl && (event.key === 'Enter' || event.key === ' '));
}

/** True when a click landed on a button or link (those keep their own meaning). */
export function isOnControl(target: EventTarget): boolean {
  return target instanceof Element && target.closest(CONTROLS) !== null;
}
