import { BANNER_DITHER, ROPE_FRAME } from '../assets/textures';
import styles from './BannerWindow.module.css';

type BannerWindowProps = {
  title: string;
};

/** Top banner naming the active section: dithered blue inside a gold rope frame. */
export function BannerWindow({ title }: BannerWindowProps) {
  return (
    <div className={styles.banner} style={{ borderImageSource: ROPE_FRAME.url }}>
      <div className={styles.fill} style={{ backgroundImage: BANNER_DITHER.url }}>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
}
