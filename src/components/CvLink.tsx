import { useLocale } from '../content/useLocale';
import { PATHS } from '../site/paths';
import styles from './CvLink.module.css';

type CvLinkProps = {
  inline?: boolean; // inside the HUD row (camp on portrait screens) instead of the top-left corner
};

/** VER CV / VIEW CV on every screen of the game: the plain CV is always one click away for
 *  whoever has no time to play (PRODUCT.md, principle 1). Top left; on portrait screens the camp
 *  puts it between the two portraits, where the banner can't cover it and the thumb reaches it. */
export function CvLink({ inline = false }: CvLinkProps) {
  const { t, locale } = useLocale();
  const link = (
    <a className={inline ? `${styles.link} ${styles.inline}` : styles.link} href={PATHS.cv[locale]}>
      {t.cv.link}
    </a>
  );
  // In the corner it sits in a <header> (the page's "banner" landmark), so screen readers find it.
  return inline ? link : <header>{link}</header>;
}
