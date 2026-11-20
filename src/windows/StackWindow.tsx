import { STACK_ATLAS } from '../assets/stack/stack-icons.gen';
import { useLocale } from '../content/useLocale';
import { useStageLayout } from '../engine/useScreen';
import { devicePixelZoom } from '../game/stage';
import { TechIcon } from './TechIcon';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './StackWindow.module.css';

/** EQUIP (stack) — the tech stack as Yeray's gear, one tier per section, each technology with its
 *  icon. No levels or percentages: only what Yeray declared (CONTENT.md). */
export default function StackWindow() {
  const { t } = useLocale();
  const { textSize, dpr } = useStageLayout();
  // The icons stand about as tall as a line of text, in whole screen pixels: 32 CSS px on a 1440
  // laptop, 16 on a phone.
  const zoom = devicePixelZoom(1.25 * textSize, STACK_ATLAS.size, dpr);
  return (
    <WindowSections
      label={t.sections.stack.title}
      sections={t.stack.tiers.map((tier) => ({
        id: tier.title,
        label: tier.title,
        content: (
          <dl className={sheet.rows}>
            {tier.groups.map((group) => (
              <div key={group.name} className={sheet.row}>
                <dt>{group.name}</dt>
                <dd>
                  <ul className={styles.techs}>
                    {group.items.map((tech) => (
                      <li key={tech.id} className={styles.tech}>
                        <TechIcon id={tech.id} zoom={zoom} />
                        {tech.name}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        ),
      }))}
    />
  );
}
