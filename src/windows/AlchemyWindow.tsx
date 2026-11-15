import { useLocale } from '../content/useLocale';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';

/** ALCHEMY — the tech stack, one tier per section, grouped like an alchemist's ingredients. No
 *  levels or percentages: only what Yeray declared (CONTENT.md). */
export default function AlchemyWindow() {
  const { t } = useLocale();
  return (
    <WindowSections
      label={t.sections.alchemy.title}
      sections={t.alchemy.tiers.map((tier) => ({
        id: tier.title,
        label: tier.title,
        content: (
          <dl className={sheet.rows}>
            {tier.groups.map((group) => (
              <div key={group.name} className={sheet.row}>
                <dt>{group.name}</dt>
                <dd>{group.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        ),
      }))}
    />
  );
}
