import { Divider } from '../components/Divider';
import { useLocale } from '../content/useLocale';
import type { Locale } from '../content/types';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './CommsWindow.module.css';

const LOCALES: Locale[] = ['es', 'en'];

/** COMMS — contact rows (links open in a new tab, email opens the mail app) and the language
 *  switch, as a plain radio group: keyboard and screen readers know it already. */
export default function CommsWindow() {
  const { t, locale, setLocale } = useLocale();
  const content = (
    <div className={styles.comms}>
      <dl className={sheet.rows}>
        {t.comms.rows.map((row) => (
          <div key={row.label} className={sheet.row}>
            <dt>{row.label}</dt>
            <dd>
              {row.href ? (
                <ContactLink href={row.href} label={row.value} newTab={t.window.newTab} />
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <Divider />

      <fieldset className={styles.language}>
        <legend className={sheet.heading}>{t.comms.language.legend}</legend>
        <div className={styles.options}>
          {LOCALES.map((code) => (
            <label key={code} className={styles.option}>
              <input
                type="radio"
                name="locale"
                value={code}
                checked={locale === code}
                onChange={() => setLocale(code)}
                className={styles.radio}
              />
              <span lang={code}>{t.comms.language[code]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
  // A single section: no tabs, but the same scrolling panel as the other windows.
  return <WindowSections label={t.sections.comms.title} sections={[{ id: 'contact', label: t.sections.comms.title, content }]} />;
}

/** Web links open in a new tab (the portfolio stays open); the email link opens the mail app. */
function ContactLink({ href, label, newTab }: { href: string; label: string; newTab: string }) {
  const external = href.startsWith('http');
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
      {label}
      {external && <span className={styles.srOnly}> {newTab}</span>}
    </a>
  );
}
