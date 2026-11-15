import { YERAY } from '../assets/characters/characters';
import { Divider } from '../components/Divider';
import { PixelSprite } from '../components/PixelSprite';
import { useLocale } from '../content/useLocale';
import { useStageLayout } from '../engine/useScreen';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './StatsWindow.module.css';

/** STATS — the character sheet in three sections: profile, education and the quest log. */
export default function StatsWindow() {
  const { t } = useLocale();
  const { scale } = useStageLayout();
  const s = t.stats;
  // The portrait grows with the window: ×3 on a 1440 laptop, ×2 on a phone.
  const portraitZoom = Math.max(2, Math.round(1.5 * scale));

  const profile = (
    <div className={styles.profile}>
      <div className={styles.card}>
        <div className={styles.portrait}>
          <PixelSprite pose={YERAY.portrait} unit={portraitZoom} />
        </div>
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
      label={t.sections.stats.title}
      sections={[
        { id: 'profile', label: s.profileTitle, content: profile },
        { id: 'education', label: s.educationTitle, content: education },
        { id: 'quests', label: s.questsTitle, content: quests },
      ]}
    />
  );
}
