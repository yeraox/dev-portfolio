import { CAPYROAD_VIDEO, SCREENSHOTS } from '../assets/projects/media.gen';
import { useLocale } from '../content/useLocale';
import type { Project, ProjectMedia } from '../content/types';
import { useReducedMotion } from '../engine/motion';
import { WindowSections } from './WindowSections';
import sheet from './sheet.module.css';
import styles from './ProjectsWindow.module.css';

// Screenshots fill the media column: half the window on a laptop, the whole width on a phone.
const SHOT_SIZES = '(min-width: 1040px) 50vw, 92vw';

/** ALCHEMY (projects) — projects, one section each: ← →, the tabs or a swipe go from one to the next. */
export default function ProjectsWindow() {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  return (
    <WindowSections
      label={t.projects.listLabel}
      sections={t.projects.list.map((project) => ({
        id: project.id,
        label: project.tab ?? project.name,
        tag: project.tag,
        // While hidden (only there for find-in-page) a project leaves out its pictures and video.
        content: (shown: boolean) => <ProjectDetail project={project} reducedMotion={reducedMotion} shown={shown} />,
      }))}
    />
  );
}

function ProjectDetail({ project, reducedMotion, shown }: { project: Project; reducedMotion: boolean; shown: boolean }) {
  const { t } = useLocale();
  const labels = t.projects.labels;
  return (
    // Wide windows: pictures on the left, text on the right (see .project in the CSS).
    <article className={styles.project}>
      {shown && (
        <div className={styles.media}>
          <ProjectMediaView media={project.media} reducedMotion={reducedMotion} />
        </div>
      )}
      <div className={styles.text}>
        <h3 className={sheet.heading}>
          {project.name} {project.tag && <span className={sheet.tag}>{project.tag}</span>}
        </h3>
        <p className={`${sheet.meta} ${styles.context}`}>{project.context}</p>
        <p className={sheet.paragraph}>{project.summary}</p>

        {/* Why it exists, right after what it is: the project's story before its details. */}
        <h4 className={styles.subheading}>{labels.why}</h4>
        <p className={sheet.paragraph}>{project.why}</p>

        <h4 className={styles.subheading}>{labels.did}</h4>
        <ul className={sheet.bullets}>
          {project.did.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <dl className={`${sheet.rows} ${styles.facts}`}>
          <div className={sheet.row}>
            <dt>{labels.stack}</dt>
            <dd>{project.stack.join(' · ')}</dd>
          </div>
          {project.notes.map((note) => (
            <div key={note.label} className={sheet.row}>
              <dt>{note.label}</dt>
              <dd>{note.value}</dd>
            </div>
          ))}
          {project.repo && (
            <div className={sheet.row}>
              <dt>{labels.repo}</dt>
              <dd>
                <a href={project.repo} target="_blank" rel="noopener noreferrer">
                  {project.repo.replace('https://', '')}
                  <span className={styles.srOnly}> {t.window.newTab}</span>
                </a>
              </dd>
            </div>
          )}
          {project.demo && (
            <div className={sheet.row}>
              <dt>{labels.demo}</dt>
              <dd>{project.demo}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}

function ProjectMediaView({ media, reducedMotion }: { media: ProjectMedia; reducedMotion: boolean }) {
  // TS concept — narrowing a discriminated union: inside the `if`, TypeScript knows which fields
  // `media` has (only 'video' has `videoLabel`); after it, only 'screenshots' is left, with `shots`.
  if (media.kind === 'video') {
    const video = CAPYROAD_VIDEO;
    return (
      <>
        <figure className={styles.figure}>
          <div className={sheet.screen}>
            <video
              // Muted must be an attribute too, or some phones refuse to autoplay.
              ref={(element) => element?.setAttribute('muted', '')}
              muted
              loop={!reducedMotion}
              autoPlay={!reducedMotion}
              controls={reducedMotion} // reduced motion: still image, plays only if asked to
              playsInline
              preload={reducedMotion ? 'none' : 'auto'}
              poster={video.poster}
              width={video.width}
              height={video.height}
              aria-label={media.videoLabel}
            >
              <source src={video.mp4} type="video/mp4" />
              <source src={video.webm} type="video/webm" />
            </video>
          </div>
          <figcaption className={sheet.meta}>{media.videoLabel}</figcaption>
        </figure>
        <Screenshot id={media.screenshot.id} alt={media.screenshot.alt} />
      </>
    );
  }

  return (
    <div className={styles.shots}>
      {media.shots.map((shot) => (
        <Screenshot key={shot.id} id={shot.id} alt={shot.alt} />
      ))}
    </div>
  );
}

function Screenshot({ id, alt }: { id: keyof typeof SCREENSHOTS; alt: string }) {
  const shot = SCREENSHOTS[id];
  return (
    <div className={sheet.screen}>
      <img
        src={shot.small}
        srcSet={`${shot.small} 640w, ${shot.large} 1280w`}
        sizes={SHOT_SIZES}
        width={shot.width}
        height={shot.height}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
