import { HOBBY_ATLAS, HOBBY_ICONS } from '../assets/about/hobby-icons.gen';
import { useLocale } from '../content/useLocale';
import { useStageLayout } from '../engine/useScreen';
import { devicePixelZoom } from '../game/stage';
import { AtlasIcon } from './AtlasIcon';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './AboutWindow.module.css';

/** JOURNAL (about me) — two sections: Yeray as a developer (what the CV doesn't say) and the
 *  personal side, his hobbies each with its icon. Only what Yeray told (CONTENT.md). */
export default function AboutWindow() {
  const { t } = useLocale();
  const { textSize, dpr } = useStageLayout();
  const { developer, personal } = t.about;
  // The icons as tall as the STACK's: about a line of text, in whole screen pixels.
  const zoom = devicePixelZoom(1.25 * textSize, HOBBY_ATLAS.size, dpr);
  return (
    <WindowSections
      label={t.sections.about.title}
      sections={[
        {
          id: 'developer',
          label: developer.tab,
          content: (
            <div className={styles.prose}>
              {developer.paragraphs.map((paragraph) => (
                <p key={paragraph} className={sheet.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          ),
        },
        {
          id: 'personal',
          label: personal.tab,
          content: (
            <div className={styles.prose}>
              <p className={sheet.paragraph}>{personal.intro}</p>
              <ul className={styles.hobbies}>
                {personal.hobbies.map((hobby) => (
                  <li key={hobby.id} className={styles.hobby}>
                    <AtlasIcon atlas={HOBBY_ATLAS} index={HOBBY_ICONS[hobby.id]} zoom={zoom} />
                    <div>
                      <h3 className={styles.name}>{hobby.name}</h3>
                      <p className={sheet.paragraph}>{hobby.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
      ]}
    />
  );
}
