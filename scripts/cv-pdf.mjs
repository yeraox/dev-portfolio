// Publishes Yeray's CV PDFs as they are (BRIEF.md, "Downloadable CV"): copies the private originals
// from references/ to public/cv/, where the site serves them at /cv/yeray-caturla-cv-es.pdf and
// /cv/yeray-caturla-cv-en.pdf. The PDFs include his phone number: that is his decision, and only
// the PDFs have it (never the web pages).
// Usage: npm run cv
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';

const COPIES = [
  { source: 'references/cv_es_yeray_caturla.pdf', target: 'public/cv/yeray-caturla-cv-es.pdf' },
  { source: 'references/cv_en_yeray_caturla.pdf', target: 'public/cv/yeray-caturla-cv-en.pdf' },
];

const missing = COPIES.filter(({ source }) => !existsSync(source));
if (missing.length > 0) {
  for (const { source } of missing) console.error(`✗ ${source} not found (references/ is private and lives only on Yeray's computer).`);
  process.exit(1);
}
mkdirSync('public/cv', { recursive: true });
for (const { source, target } of COPIES) {
  copyFileSync(source, target);
  console.log(`✓ ${target} (${(statSync(target).size / 1024 / 1024).toFixed(1)} MB)`);
}
