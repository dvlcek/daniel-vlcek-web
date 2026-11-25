import Image from "next/image";
import Link from "@/components/site/MarketingLink";

import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";

import {
  homepageProjects,
  getWorkProjectHref,
} from "@/content/projects";

import styles from "./SelectedWork.module.css";

type HomepageProject = (typeof homepageProjects)[number];

type ProjectProps = {
  project: HomepageProject;
  featured?: boolean;
};

const featuredCapabilities = [
  {
    label: "CRM & lead management",
    planned: false,
  },
  {
    label: "Business analytics",
    planned: true,
  },
  {
    label: "Workflow automation",
    planned: true,
  },
];

/* =====================================================
   PLATFORM OVERVIEW
===================================================== */

function PlatformOverview() {
  return (
    <figure className={styles.platform}>
      <div className={styles.platformContent}>
        <p className={styles.platformHeading}>
          Connected business operations
        </p>

        <ul className={styles.platformModules}>
          <li>CRM &amp; leads</li>
          <li>Projects &amp; tasks</li>
          <li>Operations &amp; security</li>
        </ul>
      </div>

      <figcaption className={styles.platformCaption}>
        Platform overview diagram
      </figcaption>
    </figure>
  );
}

/* =====================================================
   PROJECT VISUAL
===================================================== */

function ProjectVisual({
  project,
  featured = false,
}: ProjectProps) {
  const [image] = project.media;

  if (!image && !featured) {
    return null;
  }

  return (
    <div
      className={
        featured
          ? `${styles.visual} ${styles.featuredVisual}`
          : styles.visual
      }
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            featured
              ? "(min-width: 1440px) 744px, (min-width: 1024px) 58vw, calc(100vw - 40px)"
              : "(min-width: 1440px) 624px, (min-width: 768px) 46vw, calc(100vw - 40px)"
          }
          className={styles.image}
        />
      ) : (
        <PlatformOverview />
      )}
    </div>
  );
}

/* =====================================================
   FEATURED CAPABILITIES
===================================================== */

function FeaturedCapabilities() {
  return (
    <ul
      className={styles.capabilities}
      aria-label="Platform capabilities and roadmap"
    >
      {featuredCapabilities.map((capability) => (
        <li
          key={capability.label}
          className={styles.capability}
        >
          <span>{capability.label}</span>

          {capability.planned && (
            <span className={styles.roadmapLabel}>
              Roadmap
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* =====================================================
   PROJECT
===================================================== */

function Project({
  project,
  featured = false,
}: ProjectProps) {
  const href = getWorkProjectHref(project);

  return (
    <article data-marketing-reveal="project"
      id={featured ? "client-platform" : project.slug}
      className={
        featured
          ? `${styles.project} ${styles.featuredProject}`
          : styles.project
      }
    >
      <ProjectVisual
        project={project}
        featured={featured}
      />

      <div className={styles.projectInfo}>
        {featured && (
          <p className={styles.projectCategory}>
            {project.classification}
          </p>
        )}

        <h3
          className={
            featured
              ? `${styles.projectTitle} ${styles.featuredTitle}`
              : styles.projectTitle
          }
        >
          {project.name}
        </h3>

        {!featured && (
          <p className={styles.projectCategory}>
            {project.classification}
          </p>
        )}

        <p className={styles.projectDescription}>
          {project.summary}
        </p>

        {featured && <FeaturedCapabilities />}

        {href && (
          <Link
            href={href}
            className={styles.caseLink}
          >
            View case study

            <span className="sr-only">
              {" — "}
              {project.name}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

/* =====================================================
   SECTION INTRO
===================================================== */

function WorkIntro() {
  return (
    <header data-marketing-reveal="intro"
      className={styles.intro}
    >
      <p className={styles.eyebrow}>
        Selected work
      </p>

      <div className={styles.introGrid}>
        <h2
          id="work-heading"
          className={styles.heading}
        >
          Built beyond the surface.
        </h2>

        <p className={styles.introDescription}>
          From digital experiences to the systems
          that power businesses.
        </p>
      </div>
    </header>
  );
}

/* =====================================================
   SELECTED WORK
===================================================== */

export function SelectedWork() {
  const [featured, ...secondary] = homepageProjects;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className={styles.section}
    >
      <MarketingReveal />
      <Container className={styles.shell}>
        <WorkIntro />

        <div
          id="case-studies"
          className={styles.gallery}
        >
          <Project
            project={featured}
            featured
          />

          <div className={styles.projectGrid}>
            {secondary.map((project) => (
              <Project
                key={project.slug}
                project={project}
              />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Link
            href="/work"
            className={styles.viewAll}
          >
            View all projects
          </Link>
        </div>
      </Container>
    </section>
  );
}
