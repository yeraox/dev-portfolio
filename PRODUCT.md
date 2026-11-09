# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Vite + React 19 + TypeScript (strict), CSS Modules + a global tokens file, canvas for scenes.
No CSS frameworks, UI kits, animation libraries or game engines. Lint: oxlint. Tests: Vitest.
Screenshots and Lighthouse: Playwright Chromium (dev only). Full rules in `BRIEF.md`.

## Users
Deliberately broad: Yeray wants the site to open every possible door. All of these audiences are
primary and must be served by the same site:
- **Recruiters / HR (non-technical):** screening quickly; need profile, education, availability
  and contact within seconds, without playing.
- **Tech leads / senior developers:** evaluating how he thinks; look at projects, his part in
  them, GitHub code and technical decisions — including how this portfolio itself is built.
- **Local companies (Elda / Alicante area):** on-site or hybrid roles; mostly Spanish.
- **Remote / international companies:** remote roles, often in English (hence ES/EN).

## Product Purpose
A personal portfolio for Yeray Caturla, Junior Backend Developer, presented as an original
16-bit action-RPG world. It exists to get him interviews and offers. Success is any of:
1. They download the CV.
2. They visit his GitHub.
3. They contact him (email or LinkedIn).
4. They remember him and talk about the site, even without an opening right now.

## Positioning
- **Full cycle:** he has walked the whole chain, from systems (SMR) to APIs (DAW) to cloud
  deployment (current specialization in cloud resources and services). He understands software
  from the machine to the deployed service, not just one layer.
- **Consistency and discipline:** the same discipline as his six-days-a-week training, applied
  to learning and work.

The game framing is the memorable hook. The content inside it must stay plain, factual and fast
to scan.

## Operating Context
- Visitors arrive from a LinkedIn profile, a CV link, a job application or a shared link, on
  desktop or phone, often with little time.
- A recruiter may never press START: the plain CV view and contact must be reachable from any
  screen in under 10 seconds.
- Tech reviewers will open the GitHub repo; the code and README are part of the product.

## Capabilities and Constraints
- Bilingual ES/EN with typed dictionaries; Spanish is the source language.
- Keyboard, mouse and touch are all first-class inputs.
- Sections: EQUIP (projects), ALCHEMY (tech stack), STATS (profile, education, experience),
  COMMS (contact) are live. BUFFS (training) and CRAFT (cooking) exist but stay hidden until real
  content is provided.
- Performance budget and phase plan: `BRIEF.md` and `docs/plan-de-fases.md`.
- Git is operated only by Yeray.

## Brand Commitments
- Name: **Yeray Caturla**. Companion dog: **Null** (black & tan Griffon Belge).
- Avatar likeness: curly short mullet, round dark glasses, mustache + chin goatee (no beard),
  original 90s-adventurer outfit. Concept sheets: `references/avatar-concept.png`,
  `references/null-concept.png`.
- Era: original work in the 16-bit SNES action-RPG genre. Nothing copied from any existing
  game (logo, lettering, sprites, fonts, music, character names or outfits).
- Game labels stay English in both locales (EQUIP, ALCHEMY, STATS, BUFFS, CRAFT, COMMS,
  PRESS START, SKIP INTRO).

## Evidence on Hand
- CV (Spanish PDF, includes phone): `references/cv_es_yeray_caturla.pdf`. Downloadable as-is.
- All content: `CONTENT.md`.
- Project media: `media-src/projects/` (Capyroad screenshot + 26 s raw video, roulette and
  blackjack screenshots of Pakito's Gambling).
- Absences that must not be fabricated: no deployed demos, no metrics for the Bosa Digital
  internship (NDA — only the three CV sentences), no English CV PDF yet, no training numbers,
  no recipes, no testimonials.

## Product Principles
1. **Every audience gets what it came for fast.** The game is an invitation, never a gate: the
   CV and contact are always one step away.
2. **Facts plain, world playful.** The RPG wraps the content; it never distorts it. No invented
   stats, levels or percentages.
3. **The site is a proof of work.** Hand-built, accessible and fast is itself evidence of the
   full-cycle claim.
4. **Memorable but honest.** Personality (Null, the camp props, the hobbies) adds warmth without
   overclaiming.

## Accessibility & Inclusion
WCAG 2.2 AA: text contrast, full keyboard operation, touch, screen-reader semantics on the ring
menu and windows, `prefers-reduced-motion` honored (no intro walk). Content selectable and
indexable as real DOM text.
