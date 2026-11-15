// Dev-only page: /dev/textos. Every text of the site in Spanish and English, side by side, so
// Yeray can review the translation. Never shipped (see Root.tsx).
import { EN } from '../content/en';
import { ES } from '../content/es';
import { flattenTexts } from '../content/texts';
import styles from './TextsReview.module.css';

const english = new Map(flattenTexts(EN));
// Group the rows by the first part of their path: page, ring, sections, stats, equip…
const groups = new Map<string, [string, string][]>();
for (const [path, text] of flattenTexts(ES)) {
  const group = path.split('.')[0];
  groups.set(group, [...(groups.get(group) ?? []), [path, text]]);
}

export default function TextsReview() {
  return (
    <main className={styles.page}>
      <header>
        <h1>Textos · español e inglés</h1>
        <p>
          Todo lo que dice la web, en los dos idiomas. El español sale de <code>CONTENT.md</code>; el inglés
          lo he traducido yo. Las filas marcadas son iguales en los dos idiomas: nombres propios y
          tecnologías, normalmente.
        </p>
      </header>
      {[...groups].map(([group, rows]) => (
        <section key={group} className={styles.group}>
          <h2>{group}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Dónde</th>
                <th scope="col">Español</th>
                <th scope="col">English</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([path, text]) => (
                <tr key={path} className={english.get(path) === text ? styles.same : undefined}>
                  <td className={styles.path}>{path}</td>
                  <td lang="es">{text}</td>
                  <td lang="en">{english.get(path)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
