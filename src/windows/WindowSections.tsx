import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent, type WheelEvent } from 'react';
import styles from './WindowSections.module.css';

export type WindowSection = {
  id: string;
  label: string;
  tag?: string; // small badge next to the label (FEATURED, CLASSIFIED…)
  content: ReactNode;
};

type WindowSectionsProps = {
  label: string; // accessible name of the tab list
  sections: WindowSection[];
};

const BURST_GAP_MS = 200; // wheel events closer than this belong to the same flick or spin
const WHEEL_STEP = 30; // a trackpad must travel this far (in a quiet burst) to change section
const SWIPE_MIN = 60; // CSS px a finger travels sideways to change section

/**
 * A window's content split into sections, one on screen at a time, with tabs on top (ARIA
 * "tabs"). The mouse wheel goes from section to section: a long section is read to its end first,
 * and one flick or spin changes one section only. Fingers swipe sideways. A blinking arrow tells
 * when there is more to read below.
 */
export function WindowSections({ label, sections }: WindowSectionsProps) {
  const [selected, setSelected] = useState(0);
  const [more, setMore] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const enterAtBottom = useRef(false); // going back with the wheel lands at the end of the section
  const wheel = useRef({ last: 0, used: false, travel: 0 });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const id = useId();
  const count = sections.length;

  const measure = () => {
    const panel = panelRef.current;
    if (panel) setMore(panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2);
  };

  // A new section starts at its top (or its end, when we came back to it with the wheel).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (panel) panel.scrollTop = enterAtBottom.current ? panel.scrollHeight : 0;
    enterAtBottom.current = false;
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

  function select(index: number, focusTab = false) {
    if (index < 0 || index >= count) return;
    setSelected(index);
    if (focusTab) tabs.current[index]?.focus();
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const last = count - 1;
    const keys: Record<string, number> = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowDown: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      ArrowUp: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], true);
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    if (count < 2 || event.deltaY === 0 || event.ctrlKey) return; // ctrl + wheel is the browser's zoom
    const panel = event.currentTarget;
    const down = event.deltaY > 0;
    const w = wheel.current;
    if (event.timeStamp - w.last > BURST_GAP_MS) {
      w.used = false; // a new flick or spin
      w.travel = 0;
    }
    w.last = event.timeStamp;
    const canScroll = down ? panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1 : panel.scrollTop > 0;
    if (canScroll) {
      w.used = true; // the browser scrolls the section; this burst won't also change section
      return;
    }
    if (w.used) return;
    w.travel += Math.abs(event.deltaY);
    if (w.travel < WHEEL_STEP) return;
    w.used = true;
    const next = selected + (down ? 1 : -1);
    if (next < 0 || next >= count) return;
    enterAtBottom.current = !down;
    select(next);
  }

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

  const section = sections[selected];
  return (
    <div className={styles.sections}>
      {count > 1 && (
        <div role="tablist" aria-label={label} className={styles.tabs} onKeyDown={onTabKey}>
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
              <span>{item.label}</span>
              {item.tag && <span className={styles.tag}>{item.tag}</span>}
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
          tabIndex={0}
          className={styles.panel}
          onScroll={measure}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div ref={contentRef} key={section.id}>
            {section.content}
          </div>
        </div>
        {more && <span className={styles.more} aria-hidden="true" />}
      </div>
    </div>
  );
}
