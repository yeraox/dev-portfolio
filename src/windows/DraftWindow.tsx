import { useLocale } from '../content/useLocale';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';

/** A section still without its content: ABOUT ME for now (only reachable in development). */
export default function DraftWindow() {
  const { t } = useLocale();
  const content = <p className={sheet.paragraph}>{t.window.draft}</p>;
  return <WindowSections label={t.window.draft} sections={[{ id: 'draft', label: t.window.draft, content }]} />;
}
