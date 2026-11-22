import styles from './SkipIntro.module.css';

type SkipIntroProps = {
  label: string;
  onSkip: () => void;
};

/** SKIP INTRO, bottom right, from the title's first frame to the end of the intro. */
export function SkipIntro({ label, onSkip }: SkipIntroProps) {
  return (
    <button type="button" className={styles.skip} onClick={onSkip}>
      {label}
    </button>
  );
}
