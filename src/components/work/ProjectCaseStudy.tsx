import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import type { Project, ProjectMedia } from "@/content/projects";
import styles from "./Portfolio.module.css";

function ProductFigure({ media, priority = false }: { media: ProjectMedia; priority?: boolean }) {
  return (
    <figure className={styles.media}>
      <a href={media.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${media.alt}`}>
      <Image src={media.src} alt={media.alt} width={media.width} height={media.height}
        sizes="(min-width: 1480px) 1352px, (min-width: 1280px) calc(100vw - 128px), (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
        preload={priority} className={styles.image} />
      </a>
      <figcaption className={`small-copy ${styles.caption}`}>{media.caption}{" "}<a href={media.src} target="_blank" rel="noopener noreferrer" className={styles.textLink}>View full-size image</a></figcaption>
    </figure>
  );
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  const [hero, ...showcase] = project.media;
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section aria-labelledby="project-title" className={`${styles.hero} ${styles.section}`}>
          <Container>
            <nav aria-label="Breadcrumb"><ol className={`small-copy ${styles.breadcrumbs}`}><li><Link href="/">Home</Link></li><li><Link href="/work">Work</Link></li><li aria-current="page">{project.name}</li></ol></nav>
            <p className={`eyebrow ${styles.accent}`}>{project.classification}{project.status === "draft" ? " / Draft for review" : ""}</p>
            <h1 id="project-title" className={`display-heading ${styles.heroTitle}`}>{project.name}</h1>
            <div className={`intro-gap ${styles.intro}`}>
              <p className="card-title">{project.headline}</p>
              <p className={`section-copy ${styles.heroCopy}`}>{project.summary}</p>
            </div>
            {hero && <ProductFigure media={hero} priority />}
            <dl className={styles.meta}>
              <div><dt className={`eyebrow ${styles.onDark}`}>Project type</dt><dd className="body-copy">{project.classification}</dd></div>
              <div><dt className={`eyebrow ${styles.onDark}`}>Development role</dt><dd className="body-copy">{project.role ?? "Wording awaiting owner approval"}</dd></div>
              <div><dt className={`eyebrow ${styles.onDark}`}>Focus</dt><dd className="body-copy">{project.focus}</dd></div>
            </dl>
          </Container>
        </section>

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
      </main>
      <Footer />
    </>
  );
}
