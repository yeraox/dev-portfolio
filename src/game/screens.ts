// Which screen the site shows (BRIEF.md: TITLE → TRANSITION → INTRO → HUB). The cave intro joins in
// phase 6. Pure function → tested in screens.test.ts.

// TS concept — another discriminated union: only a TRANSITION has a `half` (fading out of the
// title, then fading into the camp).
export type Screen = { name: 'TITLE' } | { name: 'TRANSITION'; half: 'out' | 'in' } | { name: 'CAMP' };

export type ScreenAction =
  | { type: 'START' } // any key, click or tap on the title (or SKIP INTRO)
  | { type: 'MIDPOINT' } // the screen is fully dark: swap title for camp
  | { type: 'DONE' }; // the camp is fully visible

/** A link to a window (/#equip…) goes straight to the camp; everyone else sees the title. */
export function initialScreen(deepLinked: boolean): Screen {
  return deepLinked ? { name: 'CAMP' } : { name: 'TITLE' };
}

export function screenReducer(screen: Screen, action: ScreenAction): Screen {
  switch (screen.name) {
    case 'TITLE':
      return action.type === 'START' ? { name: 'TRANSITION', half: 'out' } : screen;
    case 'TRANSITION':
      if (action.type === 'MIDPOINT' && screen.half === 'out') return { name: 'TRANSITION', half: 'in' };
      if (action.type === 'DONE' && screen.half === 'in') return { name: 'CAMP' };
      return screen;
    case 'CAMP':
      return screen;
  }
}
