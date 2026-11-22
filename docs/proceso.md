# How this portfolio was built

Built in November 2026 by Yeray Caturla with [Claude Code](https://claude.com/claude-code), in
eleven phases (0–10). Yeray set the direction and every decision, provided the art references
and reviewed each phase before approving it; Claude Code planned and wrote the code, following
the rules in [`CLAUDE.md`](../CLAUDE.md). It was also how Yeray learnt TypeScript.

## How we worked

- **One phase at a time.** Each phase started as a plan in Spanish that Yeray read and commented
  on. Nothing was built before his explicit "go", and nothing was deleted without his OK.
- **Every phase ended with a review:** screenshots at 390, 768 and 1440 px, performance numbers,
  a "TypeScript in this phase" section and the list of changed files. Yeray made every git
  commit himself; Claude Code never ran git.
- **Facts are his.** All copy comes from his CV and his answers (`CONTENT.md`); nothing is
  invented: no levels, percentages or metrics. One internship is under an NDA, so it shows only
  its three CV sentences.
- **His art, untouched.** Characters, ring icons and the camp background are Yeray's own
  references. Scripts cut them out and compose them; nothing is redrawn or repainted
  ([`docs/sprites.md`](sprites.md)).
- **Checked, not assumed.** Unit tests (Vitest) for the logic, the palette and the contrast;
  browser walkthroughs (Playwright) that play the site with keyboard only and touch only; frame
  rate under a 4× slower CPU; Lighthouse.
- **Skills** (in `.agents/skills/`): `impeccable` for the design system, audits and polish;
  `emil-design-eng` for interaction feel, translated to stepped, frame-based motion;
  `vercel-react-best-practices` for the client-side React rules; `modern-web-guidance` for the
  final review (accessibility, dialogs, performance). `design-taste-frontend` is installed but
  was set aside: its corporate-site rules contradict a game world.

## Phases

**0 · Foundations.** Vite + React 19 + TypeScript (strict), oxlint, Vitest and Playwright. The
design system's first version: a 640×360 scene, a limited palette (32 colours today) with a test
that keeps CSS and code in sync, and a WCAG contrast test for every text colour on its background.

**1 · The look of the windows.** Stone windows with bevels, the gold-rope banner, key hints and
the help line, first shown with the real profile content.

**2 · Characters.** A first approach (sprites traced onto a grid and hand-drawn) did not look like
Yeray's references, so it was dropped for "option A": his references rebuilt on their native pixel
grid, as they are. Then the walk cycles, with the "sello": one head stamped on every frame.

**3 · Camp and ring menu.** The camp scene on a canvas scaled by whole pixels, his background
image used as it is (snapping it to a grid blurred its details), a flickering campfire, the ring
menu (an ARIA menu, keyboard, mouse and touch), the state machine, native `<dialog>` windows and
the portrait-screen layout.

**4 · Content windows.** Typed Spanish and English dictionaries, windows loaded only when needed,
links straight to a window, and the project media made light (WebP screenshots, a trimmed muted
video).

**5 · Title screen.** A night landscape drawn in code, the embossed gold name, PRESS START and a
dithered transition; the camp downloads while the title is on screen.

**6 · Cave intro.** Yeray and Null walk out of the cave in the camp scene itself; skippable at any
moment, skipped for returning visitors and with reduced motion.

**7 · Quality and accessibility.** Head tags, share image and favicon, an `impeccable` audit and
polish, a fallback to 30 fps for slow devices and the design system rewritten from the built
site. (A plain-text CV page was built here and removed in phase 8: the CV is the PDF.)

**8 · Improvements.** Built in blocks, each reviewed on its own:
- the English CV; the ring with real names and Yeray's icons; the CV and SETTINGS in the ring;
  new portraits; his skin tone, re-toned by the generator; Null's new walk; icons for every
  technology; idle actions; the HUD's HP and XP;
- a second round from his own use of the site: SETTINGS on the title, back to the title, a red
  note on what "animations off" changes, flat windows that switch sections with the arrow keys,
  a ring that leaves the campfire in view, this portfolio as a project, a privacy line;
- each project's "why", in his words; a bug where a window went blank (a hidden note escaping
  its scroll container stretched the window); no focus ring when a window opens; the title's
  credits; "About me", with his hobbies, and a seven-slot ring.

**9 · Review and cleanup.** A review against `modern-web-guidance`, dead code removed, the
browser checks sharing one library, dependencies updated, and this documentation reduced to what
the project needs.

**10 · Publishing.** Pending: hosting (Cloudflare Pages or GitHub Pages), the site's address
(`SITE_URL`, for the canonical link, the share image and the sitemap), automatic deploys and the
live link in the README. If analytics are ever added, the privacy line in SETTINGS has to be
reviewed.

## Where it stands (23 November 2026)

| Measure | Result |
|---|---|
| Unit tests | 204 |
| Browser walkthroughs | camp 115 checks, windows 45, title 46, intro 24 |
| Initial JavaScript | 94.4 KB gzip (budget 100 KB) |
| Lighthouse, mobile | 99 performance · 100 accessibility · 100 best practices · 100 SEO |
| Frame rate | 60 fps, also with a 4× slower CPU |

From now on, each phase adds its summary to this page.
