import { describe, expect, it } from 'vitest';
import { initialScreen, screenReducer, type Screen, type ScreenAction } from './screens';

const ALL_ACTIONS: ScreenAction[] = [
  { type: 'START', intro: true },
  { type: 'START', intro: false },
  { type: 'MIDPOINT' },
  { type: 'DONE' },
  { type: 'INTRO_END' },
];

describe('initial screen', () => {
  it('shows the title on a first visit', () => {
    expect(initialScreen({ hash: '', visited: false })).toEqual({ name: 'TITLE' });
  });

  it('goes straight to the camp for a window link or a returning visitor', () => {
    expect(initialScreen({ hash: '#equip', visited: false })).toEqual({ name: 'CAMP' });
    expect(initialScreen({ hash: '#camp', visited: false })).toEqual({ name: 'CAMP' });
    expect(initialScreen({ hash: '', visited: true })).toEqual({ name: 'CAMP' });
  });

  it('shows the title for /#title, even after a visit', () => {
    expect(initialScreen({ hash: '#title', visited: true })).toEqual({ name: 'TITLE' });
  });
});

describe('screen flow', () => {
  it('goes title → dark → intro → camp, in that order only', () => {
    let screen: Screen = { name: 'TITLE' };
    screen = screenReducer(screen, { type: 'START', intro: true });
    expect(screen).toEqual({ name: 'TRANSITION', half: 'out', to: 'INTRO' });
    expect(screenReducer(screen, { type: 'DONE' })).toBe(screen); // not before the midpoint
    screen = screenReducer(screen, { type: 'MIDPOINT' });
    expect(screen).toEqual({ name: 'TRANSITION', half: 'in', to: 'INTRO' });
    expect(screenReducer(screen, { type: 'START', intro: true })).toBe(screen); // a second key press changes nothing
    screen = screenReducer(screen, { type: 'DONE' });
    expect(screen).toEqual({ name: 'INTRO' });
    expect(screenReducer(screen, { type: 'START', intro: true })).toBe(screen);
    screen = screenReducer(screen, { type: 'INTRO_END' });
    expect(screen).toEqual({ name: 'CAMP' });
  });

  it('SKIP INTRO on the title (or reduced motion) fades straight into the camp', () => {
    let screen: Screen = { name: 'TITLE' };
    screen = screenReducer(screen, { type: 'START', intro: false });
    screen = screenReducer(screen, { type: 'MIDPOINT' });
    screen = screenReducer(screen, { type: 'DONE' });
    expect(screen).toEqual({ name: 'CAMP' });
  });

  it('skipping while the intro is still fading in lands in the camp', () => {
    let screen: Screen = { name: 'TRANSITION', half: 'in', to: 'INTRO' };
    screen = screenReducer(screen, { type: 'INTRO_END' });
    expect(screen).toEqual({ name: 'TRANSITION', half: 'in', to: 'CAMP' });
    expect(screenReducer(screen, { type: 'DONE' })).toEqual({ name: 'CAMP' });
    // …but not while the title is still darkening.
    const out: Screen = { name: 'TRANSITION', half: 'out', to: 'INTRO' };
    expect(screenReducer(out, { type: 'INTRO_END' })).toBe(out);
  });

  it('never leaves the camp', () => {
    const camp: Screen = { name: 'CAMP' };
    for (const action of ALL_ACTIONS) expect(screenReducer(camp, action)).toBe(camp);
  });
});
