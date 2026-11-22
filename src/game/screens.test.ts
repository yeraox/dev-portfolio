import { describe, expect, it } from 'vitest';
import { initialScreen, screenReducer, titleOnScreen, type Screen, type ScreenAction } from './screens';

const ALL_ACTIONS: ScreenAction[] = [
  { type: 'START', intro: true },
  { type: 'START', intro: false },
  { type: 'MIDPOINT' },
  { type: 'DONE' },
  { type: 'INTRO_END' },
  { type: 'BACK_TO_TITLE' },
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

  it('leaves the camp only for BACK TO TITLE', () => {
    const camp: Screen = { name: 'CAMP' };
    for (const action of ALL_ACTIONS) {
      if (action.type !== 'BACK_TO_TITLE') expect(screenReducer(camp, action)).toBe(camp);
    }
  });

  it('BACK TO TITLE: camp → dark → title, and the title starts again from there', () => {
    let screen: Screen = { name: 'CAMP' };
    screen = screenReducer(screen, { type: 'BACK_TO_TITLE' });
    expect(screen).toEqual({ name: 'TRANSITION', half: 'out', to: 'TITLE' });
    expect(screenReducer(screen, { type: 'BACK_TO_TITLE' })).toBe(screen); // a second click changes nothing
    expect(screenReducer(screen, { type: 'INTRO_END' })).toBe(screen);
    screen = screenReducer(screen, { type: 'MIDPOINT' });
    screen = screenReducer(screen, { type: 'DONE' });
    expect(screen).toEqual({ name: 'TITLE' });
    expect(screenReducer(screen, { type: 'BACK_TO_TITLE' })).toBe(screen); // only from the camp
    expect(screenReducer(screen, { type: 'START', intro: true })).toEqual({ name: 'TRANSITION', half: 'out', to: 'INTRO' });
  });
});

describe('which screen is on view', () => {
  it('the title until it is dark, then the camp or the intro', () => {
    expect(titleOnScreen({ name: 'TITLE' })).toBe(true);
    expect(titleOnScreen({ name: 'TRANSITION', half: 'out', to: 'INTRO' })).toBe(true);
    expect(titleOnScreen({ name: 'TRANSITION', half: 'in', to: 'INTRO' })).toBe(false);
    expect(titleOnScreen({ name: 'TRANSITION', half: 'in', to: 'CAMP' })).toBe(false);
    expect(titleOnScreen({ name: 'INTRO' })).toBe(false);
    expect(titleOnScreen({ name: 'CAMP' })).toBe(false);
  });

  it('back to the title: the camp until it is dark, then the title', () => {
    expect(titleOnScreen({ name: 'TRANSITION', half: 'out', to: 'TITLE' })).toBe(false);
    expect(titleOnScreen({ name: 'TRANSITION', half: 'in', to: 'TITLE' })).toBe(true);
  });
});
