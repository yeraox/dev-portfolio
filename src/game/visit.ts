// Remembers that this browser has already reached the camp, so the next visit starts there. Only
// a yes/no is stored, nothing personal.
const VISITED_KEY = 'visited';

// Storage can be missing or blocked (private mode, strict settings): then every visit is a first.
export function hasVisited(): boolean {
  try {
    return window.localStorage.getItem(VISITED_KEY) === 'yes';
  } catch {
    return false;
  }
}

export function rememberVisit(): void {
  try {
    window.localStorage.setItem(VISITED_KEY, 'yes');
  } catch {
    // Not saved: the next visit shows the title again, which is fine.
  }
}
