// Publishes Yeray's CV PDF as it is (BRIEF.md, "Downloadable CV"): copies the private original from
// references/ to public/cv/, where the site serves it at /cv/yeray-caturla-cv-es.pdf. The PDF
// includes his phone number: that is his decision, and only the PDF has it (never the web pages).
// Usage: npm run cv
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';

const SOURCE = 'references/cv_es_yeray_caturla.pdf';
const TARGET = 'public/cv/yeray-caturla-cv-es.pdf';

if (!existsSync(SOURCE)) {
  console.error(`✗ ${SOURCE} not found (references/ is private and lives only on Yeray's computer).`);
  process.exit(1);
}
mkdirSync('public/cv', { recursive: true });
copyFileSync(SOURCE, TARGET);
console.log(`✓ ${TARGET} (${(statSync(TARGET).size / 1024 / 1024).toFixed(1)} MB)`);
