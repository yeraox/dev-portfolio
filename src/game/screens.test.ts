import { describe, expect, it } from 'vitest';
import { initialScreen, screenReducer, type Screen, type ScreenAction } from './screens';

describe('screens', () => {
  it('starts on the title, or in the camp when the link names a window', () => {
    expect(initialScreen(false)).toEqual({ name: 'TITLE' });
    expect(initialScreen(true)).toEqual({ name: 'CAMP' });
  });

  it('goes title → dark → camp, in that order only', () => {
    let screen: Screen = { name: 'TITLE' };
    screen = screenReducer(screen, { type: 'START' });
    expect(screen).toEqual({ name: 'TRANSITION', half: 'out' });
    expect(screenReducer(screen, { type: 'DONE' })).toBe(screen); // not before the midpoint
    screen = screenReducer(screen, { type: 'MIDPOINT' });
    expect(screen).toEqual({ name: 'TRANSITION', half: 'in' });
    expect(screenReducer(screen, { type: 'START' })).toBe(screen); // a second key press changes nothing
    screen = screenReducer(screen, { type: 'DONE' });
    expect(screen).toEqual({ name: 'CAMP' });
  });

  it('never leaves the camp for the title', () => {
    const camp: Screen = { name: 'CAMP' };
    const actions: ScreenAction[] = [{ type: 'START' }, { type: 'MIDPOINT' }, { type: 'DONE' }];
    for (const action of actions) expect(screenReducer(camp, action)).toBe(camp);
  });
});
