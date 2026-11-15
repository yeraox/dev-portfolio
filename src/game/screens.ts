// Which screen the site shows (BRIEF.md: TITLE → TRANSITION → INTRO → HUB). Pure functions →
// tested in screens.test.ts.

// TS concept — another discriminated union: only a TRANSITION has a `half` (fading out of the
// title, then fading into the camp) and a `to` (what the fade reveals).
export type Screen =
  | { name: 'TITLE' }
  | { name: 'TRANSITION'; half: 'out' | 'in'; to: 'INTRO' | 'CAMP' }
  | { name: 'INTRO' }
  | { name: 'CAMP' };

export type ScreenAction =
  | { type: 'START'; intro: boolean } // PRESS START (intro), SKIP INTRO (no intro)
  | { type: 'MIDPOINT' } // the screen is fully dark: swap the title for the camp
  | { type: 'DONE' } // the camp is fully visible
  | { type: 'INTRO_END' }; // the intro finished, or was skipped

export type ScreenStart = {
  hash: string; // the address's #part: a window link (/#equip) skips the title
  visited: boolean; // this browser has reached the camp before
};

// The one link that always shows the title, even after a visit (to see it again, or show it).
export const TITLE_HASH = '#title';

/** Links to a window and returning visitors go straight to the camp; first visits see the title. */
export function initialScreen({ hash, visited }: ScreenStart): Screen {
  if (hash === TITLE_HASH) return { name: 'TITLE' };
  if (hash.length > 1 || visited) return { name: 'CAMP' };
  return { name: 'TITLE' };
}

export function screenReducer(screen: Screen, action: ScreenAction): Screen {
  switch (screen.name) {
    case 'TITLE':
      return action.type === 'START'
        ? { name: 'TRANSITION', half: 'out', to: action.intro ? 'INTRO' : 'CAMP' }
        : screen;
    case 'TRANSITION':
      if (action.type === 'MIDPOINT' && screen.half === 'out') return { ...screen, half: 'in' };
      if (action.type === 'DONE' && screen.half === 'in') return { name: screen.to };
      // SKIP INTRO while the intro is still fading in: the fade goes on, into the camp.
      if (action.type === 'INTRO_END' && screen.half === 'in' && screen.to === 'INTRO') return { ...screen, to: 'CAMP' };
      return screen;
    case 'INTRO':
      return action.type === 'INTRO_END' ? { name: 'CAMP' } : screen;
    case 'CAMP':
      return screen;
  }
}
