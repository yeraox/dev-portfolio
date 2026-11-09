import styles from './StatBar.module.css';

type StatBarProps = {
  label: string;
  value: number;
  max: number;
  valueText?: string; // what to show/announce instead of the raw number, e.g. "6/6 días"
};

/** Label, number and a red gauge in an ink track. Only for real values — never decoration. */
export function StatBar({ label, value, max, valueText }: StatBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{valueText ?? value}</span>
      <div
        className={styles.track}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
