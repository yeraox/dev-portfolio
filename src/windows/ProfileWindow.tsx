import { Divider } from '../components/Divider';
import { Portrait } from '../components/Portrait';
import { useLocale } from '../content/useLocale';
import { useStageLayout } from '../engine/useScreen';
import { CHARACTER_IMAGES } from '../assets/characters/characters';
import { devicePixelZoom } from '../game/stage';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './ProfileWindow.module.css';

/** STATS (profile) — the character sheet in three sections: profile, education and the quest log. */
export default function ProfileWindow() {
  const { t } = useLocale();
  const { mode, uiUnit, dpr } = useStageLayout();
  const s = t.profile;
  // His face (the same as in the HUD: his in-game drawing, from the hair to the collar) grows with
  // the window, in whole screen pixels: 138 CSS px on phones, tablets and a 1440 laptop, 276 from
  // 1920 px. (On portrait screens the window is the whole screen.)
  const face = CHARACTER_IMAGES['yeray-front'].width;
  const portraitZoom = devicePixelZoom(mode === 'tall' ? 140 : 48 * uiUnit, face, dpr);

  const profile = (
    <div className={styles.profile}>
      <div className={styles.card}>
        <Portrait who="yeray" side={face * portraitZoom} zoom={portraitZoom} className={styles.portrait} />
        <div className={styles.identity}>
          <p className={styles.name}>{s.name}</p>
          <p className={styles.role}>{s.role}</p>
        </div>
      </div>
      <div>
        <dl className={sheet.rows}>
          {s.rows.map((row) => (
            <div key={row.label} className={sheet.row}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <Divider />
        <p className={sheet.paragraph}>{s.bio}</p>
      </div>
    </div>
  );

  const education = (
    <ul className={sheet.list}>
      {s.education.map((item) => (
        <li key={item.title} className={sheet.entry}>
          <p className={sheet.entryTitle}>{item.title}</p>
          <p className={sheet.meta}>
            {item.school} · <span className={sheet.years}>{item.years}</span> ·{' '}
            <span className={item.status === 'inProgress' ? sheet.inProgress : undefined}>{s.status[item.status]}</span>
          </p>
          {item.note && <p className={sheet.meta}>{item.note}</p>}
        </li>
      ))}
    </ul>
  );

  const quests = (
    <ul className={sheet.list}>
      {s.quests.map((quest) => (
        <li key={quest.company} className={sheet.entry}>
          <p className={sheet.entryTitle}>{quest.role}</p>
          <p className={sheet.meta}>
            {quest.company} · {quest.details}
          </p>
          <ul className={sheet.bullets}>
            {quest.tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );

  return (
    <WindowSections
      label={t.sections.profile.title}
      sections={[
        { id: 'profile', label: s.profileTitle, content: profile },
        { id: 'education', label: s.educationTitle, content: education },
        { id: 'quests', label: s.questsTitle, content: quests },
      ]}
    />
  );
}
