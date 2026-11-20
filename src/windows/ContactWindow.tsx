import { useLocale } from '../content/useLocale';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './ContactWindow.module.css';

/** COMMS (contact) — the contact rows: web links open in a new tab, the PDF downloads, the email
 *  opens the mail app. (The language is switched from the ring's flag and on the title.) */
export default function ContactWindow() {
  const { t } = useLocale();
  const content = (
    <div className={styles.contact}>
      <dl className={sheet.rows}>
        {t.contact.rows.map((row) => (
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
    </div>
  );
  // A single section: no tabs, but the same scrolling panel as the other windows.
  return <WindowSections label={t.sections.contact.title} sections={[{ id: 'contact', label: t.sections.contact.title, content }]} />;
}

/** Web links open in a new tab (the portfolio stays open); the PDF downloads; the email link
 *  opens the mail app. */
function ContactLink({ href, label, newTab }: { href: string; label: string; newTab: string }) {
  const pdf = href.endsWith('.pdf');
  const opensTab = !pdf && !href.startsWith('mailto:');
  return (
    <a
      href={href}
      target={opensTab ? '_blank' : undefined}
      rel={opensTab ? 'noopener noreferrer' : undefined}
      download={pdf ? '' : undefined}
    >
      {label}
      {opensTab && <span className={styles.srOnly}> {newTab}</span>}
    </a>
  );
}
