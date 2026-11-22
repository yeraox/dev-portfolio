import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import styles from './WindowSections.module.css';

export type WindowSection = {
  id: string;
  label: string;
  tag?: string; // small badge next to the label (FEATURED, YOU ARE HERE…)
  // What the section shows. As a function it learns whether it is the one on screen (`shown`), so
  // it can leave out heavy parts while hidden (a video): its text is still there for find-in-page.
  // TS concept — a union with a function type: `typeof content === 'function'` tells them apart.
  content: ReactNode | ((shown: boolean) => ReactNode);
};

type WindowSectionsProps = {
  label: string; // accessible name of the tab list
  sections: WindowSection[];
};

const SWIPE_MIN = 60; // CSS px a finger travels sideways to change section
const ARROW_LINES = 2; // ↑ ↓ scroll the text two lines at a time
const PAGE_SHARE = 0.85; // Page Up / Down scroll most of what is on screen, keeping a line or two
// Elements that use the arrow keys themselves (a video's controls, form fields): left alone.
const OWN_ARROWS = 'video, audio, input, select, textarea, [contenteditable="true"]';

/**
 * A window's content split into sections, one on screen at a time, with tabs on top (ARIA
 * "tabs"). ← → change section from anywhere in the window (on a tab, Home and End too); a click or
 * tap on a tab goes to it; fingers can also swipe sideways. The mouse wheel, ↑ ↓, Page Up / Down
 * and (off the tabs) Home / End only scroll the section's text, from anywhere in the window too,
 * so the text never needs the focus (nor its focus ring). A blinking arrow tells when there is
 * more to read below. The other sections are there too,
 * hidden "until found": the browser's find-in-page (Ctrl+F) searches them and, on a match, its
 * section opens by itself.
 */
export function WindowSections({ label, sections }: WindowSectionsProps) {
  const [selected, setSelected] = useState(0);
  const [more, setMore] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // the section on screen
  const parts = useRef<(HTMLDivElement | null)[]>([]); // every section, in order
  // A section that find-in-page just opened, and where it was before the old one closed.
  const found = useRef<{ index: number; top: number } | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const id = useId();
  const count = sections.length;

  const measure = () => {
    const panel = panelRef.current;
    if (panel) setMore(panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2);
  };

  // Every section but the one on screen is hidden "until found" (set here: React does not know
  // that value of `hidden` yet). When find-in-page matches text in one, the browser shows it and
  // fires `beforematch`: that section becomes the selected one.
  useLayoutEffect(() => {
    const stops = parts.current.map((part, index) => {
      if (!part) return () => {};
      if (index === selected) part.removeAttribute('hidden');
      else part.setAttribute('hidden', 'until-found');
      const onFound = () => {
        found.current = { index, top: part.offsetTop };
        setSelected(index);
      };
      part.addEventListener('beforematch', onFound);
      return () => part.removeEventListener('beforematch', onFound);
    });
    return () => stops.forEach((stop) => stop());
  }, [selected, count]);

  // A new section starts at its top. One opened by find-in-page keeps the browser's scroll to the
  // match instead: the section that just closed may have been above it, so it moves back up by as
  // much as it moved.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const reveal = found.current;
    found.current = null;
    if (panel && reveal?.index === selected && contentRef.current) {
      panel.scrollTop -= reveal.top - contentRef.current.offsetTop;
    } else if (panel) {
      panel.scrollTop = 0;
    }
  }, [selected]);

  // Watch the section's size (images loading, window resized) to show or hide the arrow.
  useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(panel);
    observer.observe(content);
    return () => observer.disconnect();
  }, [selected]);

  function select(index: number) {
    if (index < 0 || index >= count) return;
    setSelected(index);
  }

  // ↑ ↓, Page Up / Down and Home / End scroll the text. With the focus on a link inside it the
  // browser already does that by itself; from anywhere else in the window (the window itself, a
  // tab, ESC EXIT) it is done here.
  function scrollText(key: string): boolean {
    const panel = panelRef.current;
    if (!panel) return false;
    const line = parseFloat(getComputedStyle(panel).lineHeight) || 40;
    const page = panel.clientHeight * PAGE_SHARE;
    // How far each key scrolls, in CSS px (Home / End: as far as there is).
    const steps: Record<string, number> = {
      ArrowDown: ARROW_LINES * line,
      ArrowUp: -ARROW_LINES * line,
      PageDown: page,
      PageUp: -page,
      End: panel.scrollHeight,
      Home: -panel.scrollHeight,
    };
    if (!(key in steps)) return false;
    panel.scrollBy({ top: steps[key] });
    return true;
  }

  // ← → from anywhere in the window (the window is modal, so every key press comes from inside
  // it). On a tab, the focus follows to the new tab, and Home / End go to the first and last one
  // (the ARIA tabs pattern). Elsewhere the focus goes back to the window, so it is never left
  // behind on a link of the section that just closed. Other reading keys scroll the text.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(OWN_ARROWS)) return;
    const onTab = target?.getAttribute('role') === 'tab';
    const inText = target !== null && panelRef.current?.contains(target) === true;
    const last = count - 1;
    let next: number;
    if (count > 1 && event.key === 'ArrowRight') next = selected === last ? 0 : selected + 1;
    else if (count > 1 && event.key === 'ArrowLeft') next = selected === 0 ? last : selected - 1;
    else if (onTab && event.key === 'Home') next = 0;
    else if (onTab && event.key === 'End') next = last;
    else {
      if (!inText && scrollText(event.key)) event.preventDefault();
      return;
    }
    event.preventDefault();
    select(next);
    if (onTab) tabs.current[next]?.focus();
    else if (inText) panelRef.current?.closest('dialog')?.focus({ preventScroll: true });
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    const t = event.touches[0];
    touch.current = t ? { x: t.clientX, y: t.clientY } : null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touch.current;
    const t = event.changedTouches[0];
    touch.current = null;
    if (!start || !t || count < 2) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    select(selected + (dx < 0 ? 1 : -1));
  }

  return (
    <div className={styles.sections}>
      {count > 1 && (
        <div role="tablist" aria-label={label} className={styles.tabs}>
          {sections.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={index === selected}
              tabIndex={index === selected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(index)}
            >
              {/* The badge goes inside the label, after it: when the tab shrinks, it is cut first. */}
              <span className={styles.label}>
                {item.label}
                {item.tag && <span className={styles.tag}>{item.tag}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className={styles.frame}>
        <div
          ref={panelRef}
          role={count > 1 ? 'tabpanel' : undefined}
          id={`${id}-panel`}
          aria-labelledby={count > 1 ? `${id}-tab-${selected}` : undefined}
          className={styles.panel}
          onScroll={measure}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {sections.map((item, index) => (
            <div
              key={item.id}
              ref={(element) => {
                parts.current[index] = element;
                if (index === selected) contentRef.current = element;
              }}
            >
              {typeof item.content === 'function' ? item.content(index === selected) : item.content}
            </div>
          ))}
        </div>
        {more && <span className={styles.more} aria-hidden="true" />}
      </div>
    </div>
  );
}
