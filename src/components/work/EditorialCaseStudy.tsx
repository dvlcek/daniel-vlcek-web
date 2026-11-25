import type { ReactNode } from "react";
import Link from "@/components/site/MarketingLink";
import { Container } from "@/components/ui/Container";
import { getPublishedProjects, type EditorialProject } from "@/content/projects";
import styles from "./Portfolio.module.css";

type EditorialSection = EditorialProject["editorial"]["sections"][number];

function Details({ items, isOutcome = false }: { items: NonNullable<EditorialSection["capabilities"]>; isOutcome?: boolean }) {
  return (
    <dl className={`${styles.editorialDetails} ${isOutcome ? styles.outcomes : ""}`}>
      {items.map(item => (
        <div key={item.title}>
          <dt className="card-title card-title--small">{item.title}</dt>
          <dd className={`body-copy ${styles.muted}`}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

function ArticleSection({ section }: { section: EditorialSection }) {
  const { id, label, heading, paragraphs, capabilities, checklist, workflow, outcomes } = section;
  return (
    <section aria-labelledby={`${id}-heading`} className={`${styles.editorialSection} ${workflow ? styles.lifecycle : ""}`}>
      <Container>
        <div className={styles.split}>
          <div>
            <p className={`eyebrow ${styles.accent}`}>{label}</p>
            <h2 id={`${id}-heading`} className="section-heading intro-gap">{heading}</h2>
          </div>
          <div className={`section-copy ${styles.paragraphs} ${styles.muted}`}>
            {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        {capabilities && <Details items={capabilities} />}
        {workflow && (
          <ol className={styles.lifecycleSteps} aria-label={label} role="list">
            {workflow.map(step => (
              <li key={step.title}>
                <h3 className="card-title card-title--small">{step.title}</h3>
                <p className={`body-copy ${styles.muted}`}>{step.description}</p>
              </li>
            ))}
          </ol>
        )}
        {checklist && (
          <ul className={`body-copy ${styles.checklist}`}>
            {checklist.map(item => <li key={item}>{item}</li>)}
          </ul>
        )}
        {outcomes && <Details items={outcomes} isOutcome />}
      </Container>
    </section>
  );
}

export function EditorialCaseStudy({ project, gallery }: { project: EditorialProject; gallery: ReactNode[] }) {
  const { sections, closing, relatedSlugs, cta } = project.editorial;
  const related = getPublishedProjects().filter(item => item.slug !== project.slug && relatedSlugs.includes(item.slug));
  return (
    <>
      {sections.map(section => <ArticleSection key={section.id} section={section} />)}
      {gallery.length > 0 && (
        <section aria-label="Project gallery" className={styles.editorialSection}>
          <Container>{gallery}</Container>
        </section>
      )}
      <div className={styles.closing}>
        <Container><p>{closing}</p></Container>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related-projects" className={styles.editorialSection}>
          <Container>
            <h2 id="related-projects" className="section-heading">Related projects</h2>
            <div className={styles.related}>
              {related.map(item => <Link key={item.slug} href={`/work/${item.slug}`} className={styles.textLink}>{item.name}</Link>)}
            </div>
          </Container>
        </section>
      )}
      <section aria-labelledby="project-cta-heading" className={styles.editorialSection}>
        <Container className={styles.split}>
          <div>
            <h2 id="project-cta-heading" className="section-heading">{cta.heading}</h2>
            <p className="card-title intro-gap">{cta.subheading}</p>
          </div>
          <div>
            <p className={`section-copy ${styles.muted}`}>{cta.description}</p>
            <div className={`action-gap ${styles.ctaLinks}`}>
              <Link href="/contact#booking" className={`button-primary button-size button-text ${styles.primary}`}>{cta.primary}</Link>
              <Link href="/work" className={`button-text ${styles.textLink}`}>{cta.secondary}</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
