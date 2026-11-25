import Image from "next/image";
import Link from "@/components/site/MarketingLink";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import type { Project, ProjectMedia, PublicCaseStudy } from "@/content/projects";
import { EditorialCaseStudy } from "./EditorialCaseStudy";
import styles from "./Portfolio.module.css";

function ProductFigure({ media, priority = false, expandable = true }: { media: ProjectMedia; priority?: boolean; expandable?: boolean }) {
  const image = (
    <Image src={media.src} alt={media.alt} width={media.width} height={media.height}
      sizes="(min-width: 1480px) 1352px, (min-width: 1280px) calc(100vw - 128px), (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
      preload={priority} className={styles.image} />
  );
  return (
    <figure className={styles.media}>
      {expandable ? <a href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${media.alt}`}>{image}</a> : image}
      <figcaption className={`small-copy ${styles.caption}`}>{media.caption}{expandable && <>{" "}<a href={media.src} target="_blank" rel="noopener noreferrer" className={styles.textLink}>View full-size image</a></>}</figcaption>
    </figure>
  );
}

/** Conceptual architecture only; not a product screenshot. */
function PlatformDraftFigure() {
  return (
    <figure className={styles.media}>
      <svg
        viewBox="0 0 640 368"
        role="img"
        aria-labelledby="platform-diagram-title platform-diagram-description"
        style={{ display: "block", width: "100%", height: "auto", borderRadius: "8px" }}
      >
        <title id="platform-diagram-title">Connected business infrastructure</title>
        <desc id="platform-diagram-description">Conceptual architecture connecting CRM and operations with planned intelligence and tailored integrations.</desc>
        <rect width="640" height="368" rx="8" fill="#0b131a" />
        <g fill="none" stroke="#56616b" strokeWidth="1.5">
          <path d="M166 112 V145 H320 M474 112 V145 H320 M320 223 V252 H166 V272 M320 223 V252 H474 V272" />
        </g>
        <g fill="#111e28" stroke="#36434d">
          <rect x="48" y="48" width="236" height="64" rx="6" />
          <rect x="356" y="48" width="236" height="64" rx="6" />
          <rect x="48" y="272" width="236" height="56" rx="6" />
          <rect x="356" y="272" width="236" height="56" rx="6" />
        </g>
        <rect x="154" y="145" width="332" height="78" rx="6" fill="#17222a" stroke="#ff8054" />
        <g fill="#f5f5f5" textAnchor="middle" fontFamily="inherit" fontSize="20">
          <text x="166" y="77">CRM &amp; leads</text>
          <text x="474" y="77">Operations</text>
          <text x="320" y="190">Intelligent Business Platform</text>
          <text x="166" y="297">Custom integrations</text>
          <text x="474" y="297">AI &amp; analytics</text>
        </g>
        <g fill="#a0a7ae" textAnchor="middle" fontFamily="inherit" fontSize="14">
          <text x="166" y="96">Current foundation</text>
          <text x="474" y="96">Current foundation</text>
          <text x="166" y="315">Tailored solutions</text>
          <text x="474" y="315">Product direction</text>
        </g>
      </svg>
      <figcaption className={`small-copy ${styles.caption}`}>
        Conceptual platform architecture. Not a product screenshot.
      </figcaption>
    </figure>
  );
}

export function ProjectCaseStudy({ project }: { project: PublicCaseStudy }) {
  const [hero, ...showcase] = project.media;
  const editorial = "editorial" in project;
  const facts = editorial ? [
    ["Industry", project.industry],
    ["Project type", project.projectType],
    ["Scope", project.scope],
    ["Engagement", project.role],
    ["Status", developmentLabels[project.developmentStatus]],
  ] : [
    ["Project type", project.classification],
    ["Development role", project.role ?? "Wording awaiting owner approval"],
    ["Focus", project.focus],
  ];
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={`${styles.page} ${editorial ? styles.editorial : ""}`}>
        <article aria-labelledby="project-title">
        <section aria-labelledby="project-title" className={`${styles.hero} ${styles.section}`}>
          <Container>
            <nav aria-label="Breadcrumb"><ol className={`small-copy ${styles.breadcrumbs}`}><li><Link href="/">Home</Link></li><li><Link href="/work">Work</Link></li><li aria-current="page">{project.name}</li></ol></nav>
            <p className={`eyebrow ${styles.accent}`}>{editorial ? project.services.join(" / ") : project.classification}{project.status === "draft" ? " / Draft for review" : ""}</p>
            <h1 id="project-title" className={`display-heading ${styles.heroTitle}`}>{project.name}</h1>
            <div className={`intro-gap ${styles.intro}`}>
              <p className={editorial ? styles.editorialHeadline : "card-title"}>{project.headline}</p>
              <div>
                <p className={`section-copy ${styles.heroCopy}`}>{editorial ? project.introduction : project.summary}</p>
                {editorial && project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`button-text ${styles.textLink} ${styles.liveLink}`}>
                    Visit live website <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
            {hero && <ProductFigure media={hero} priority expandable={!editorial} />}
            {!hero && project.slug === "intelligent-business-platform" && project.status === "draft" && <PlatformDraftFigure />}
            <ProjectFacts facts={facts} />
          </Container>
        </section>
        {editorial
          ? <EditorialCaseStudy project={project} gallery={showcase.map(media => <ProductFigure key={media.src} media={media} expandable={false} />)} />
          : <LegacyCaseStudy project={project} showcase={showcase} />}
        </article>
      </main>
      <Footer />
    </>
  );
}

const developmentLabels = {
  live: "Live project",
  "in-development": "In development",
  internal: "Internal product",
  unconfirmed: null,
};

function ProjectFacts({ facts }: { facts: (string | null)[][] }) {
  return (
    <dl className={styles.meta}>
      {facts.map(([label, value]) => value && <div key={label}><dt className={`eyebrow ${styles.onDark}`}>{label}</dt><dd className="body-copy">{value}</dd></div>)}
    </dl>
  );
}

function LegacyCaseStudy({ project, showcase }: { project: Project; showcase: ProjectMedia[] }) {
  return (
    <>
        <section aria-labelledby="overview-heading" className={styles.section}>
          <Container className={styles.split}>
            <div><p className={`eyebrow ${styles.accent}`}>01 / Project overview</p><h2 id="overview-heading" className="section-heading intro-gap">{project.headings.overview}</h2></div>
            <p className={`section-copy ${styles.muted}`}>{project.description}</p>
          </Container>
        </section>
        <section aria-labelledby="challenge-heading" className={`${styles.section} ${styles.continuation}`}>
          <Container className={styles.split}>
            <div><p className={`eyebrow ${styles.accent}`}>02 / Business challenge</p><h2 id="challenge-heading" className="section-heading intro-gap">{project.headings.challenge}</h2></div>
            <p className={`section-copy ${styles.muted}`}>{project.challenge}</p>
          </Container>
        </section>

        <section aria-labelledby="solution-heading" className={`${styles.section} ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>03 / The solution</p>
            <div className={`intro-gap ${styles.split}`}><h2 id="solution-heading" className="section-heading">{project.headings.solution}</h2><p className={`section-copy ${styles.muted}`}>{project.solution}</p></div>
            <dl className={styles.rows}>{project.capabilities.map(item => <div key={item.title} className={styles.row}><dt className="card-title card-title--small">{item.title}</dt><dd className={`body-copy ${styles.muted}`}>{item.description}</dd></div>)}</dl>
          </Container>
        </section>

        {showcase.length > 0 && <section aria-labelledby="showcase-heading" className={styles.section}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>04 / Product showcase</p><h2 id="showcase-heading" className="section-heading intro-gap">{project.headings.showcase}</h2>
            <p className={`section-copy intro-gap ${styles.muted}`}>{project.showcaseIntro}</p>
            {showcase.map(media => <ProductFigure key={media.src} media={media} />)}
          </Container>
        </section>}

        <section aria-labelledby="implementation-heading" className={`${styles.section} ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>05 / Technical implementation</p><h2 id="implementation-heading" className="section-heading intro-gap">{project.headings.implementation}</h2>
            <ul aria-label="Technologies used" className={`body-copy ${styles.tech}`}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
            <dl className={styles.rows}>{project.decisions.map(item => <div key={item.title} className={styles.row}><dt className="card-title card-title--small">{item.title}</dt><dd className={`body-copy ${styles.muted}`}>{item.description}</dd></div>)}</dl>
          </Container>
        </section>

        <section aria-labelledby="workflow-heading" className={styles.section}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>06 / Connected workflow</p><h2 id="workflow-heading" className="section-heading intro-gap">{project.headings.workflow}</h2>
            <ol className={styles.steps}>{project.workflow.map((step, index) => <li key={step.title} className={styles.step}><span aria-hidden="true" className={`eyebrow ${styles.accent}`}>0{index + 1}</span><h3 className="card-title card-title--small">{step.title}</h3><p className={`body-copy ${styles.muted}`}>{step.description}</p></li>)}</ol>
          </Container>
        </section>
        <section aria-labelledby="outcomes-heading" className={`${styles.section} ${styles.continuation}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>07 / Outcomes &amp; current status</p><h2 id="outcomes-heading" className="section-heading intro-gap">{project.headings.outcomes}</h2>
            <dl className={styles.rows}>{project.outcomes.map(item => <div key={item.title} className={styles.row}><dt className="card-title card-title--small">{item.title}</dt><dd className={`body-copy ${styles.muted}`}>{item.description}</dd></div>)}</dl>
            <p className={`section-copy intro-gap ${styles.muted}`}>{project.currentStatus}</p>
          </Container>
        </section>
        <section aria-labelledby="related-heading" className={`${styles.section} ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>08 / Related services</p><h2 id="related-heading" className="section-heading intro-gap">{project.headings.related}</h2>
            <nav aria-label="Related services" className={styles.related}>{project.relatedServices.map(service => <Link key={service.href} href={service.href} className={`button-text ${styles.textLink}`}>{service.title}</Link>)}</nav>
          </Container>
        </section>
        <section aria-labelledby="project-cta-heading" className={`${styles.section} ${styles.dark} ${styles.continuation}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>09 / The next step</p>
            <h2 id="project-cta-heading" className="section-heading intro-gap">{project.headings.cta}</h2>
            <p className={`section-copy intro-gap ${styles.muted}`}>Tell me which processes need to work together. We will discuss the problem, the constraints and a useful starting point.</p>
            <div className="action-gap"><Link href="/contact" className={`button-primary button-size button-text ${styles.primary}`}>Discuss a similar project<ArrowRight aria-hidden="true" size={17} className="button-arrow shrink-0" /></Link></div>
            <p className={`small-copy intro-gap ${styles.muted}`}>Free 30-minute discovery call. No obligation.</p>
          </Container>
        </section>
    </>
  );
}
