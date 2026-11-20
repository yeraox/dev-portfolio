import styles from './HudBar.module.css';

type HudBarProps = {
  label: string; // HP or XP: a game label
  kind: 'hp' | 'xp'; // the colour: red for life, blue for experience
  value: number; // how full, 0–1
  // What a screen reader hears. Without it the bar is decoration and stays silent (the life bar:
  // there is no real number behind it).
  valueText?: string;
};

/** A small game gauge for the HUD: its label, then an ink track filled in whole steps. */
export function HudBar({ label, kind, value, valueText }: HudBarProps) {
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={styles.bar} data-kind={kind} aria-hidden={valueText ? undefined : true}>
      <span className={styles.label} aria-hidden="true">
        {label}
      </span>
      <div
        className={styles.track}
        role={valueText ? 'meter' : undefined}
        aria-label={valueText ? label : undefined}
        aria-valuemin={valueText ? 0 : undefined}
        aria-valuemax={valueText ? 100 : undefined}
        aria-valuenow={valueText ? percent : undefined}
        aria-valuetext={valueText}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
