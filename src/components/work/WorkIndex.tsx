import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import type { Project } from "@/content/projects";
import styles from "./Portfolio.module.css";

export function WorkIndex({ projects }: { projects: readonly Project[] }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section aria-labelledby="work-heading" className={`${styles.hero} ${styles.section}`}>
          <Container>
            <nav aria-label="Breadcrumb"><ol className={`small-copy ${styles.breadcrumbs}`}><li><Link href="/">Home</Link></li><li aria-current="page">Work</li></ol></nav>
            <p className={`eyebrow ${styles.accent}`}>Selected work</p><h1 id="work-heading" className={`display-heading ${styles.heroTitle}`}>Software in context.</h1>
            <p className={`section-copy intro-gap ${styles.heroCopy}`}>A closer look at the problems, product decisions and implementation behind the work. Project types and the scope of each contribution are stated explicitly.</p>
          </Container>
        </section>
        <section aria-label="Projects" id="work" className={styles.section}>
          <Container>
            {projects.map(project => <article key={project.slug} className={styles.entry}>
              <p className={`eyebrow ${styles.accent}`}>{project.classification}{project.status === "draft" ? " / Draft for review" : ""}</p>
              <Link href={`/work/${project.slug}`} className={styles.entryLink}>
                <h2 className="section-heading intro-gap">{project.name}</h2>
                <p className={`section-copy intro-gap ${styles.muted}`}>{project.summary}</p>
                {project.media[0] && <Image src={project.media[0].src} alt={project.media[0].alt} width={project.media[0].width} height={project.media[0].height} sizes="(min-width: 1480px) 1352px, (min-width: 1280px) calc(100vw - 128px), (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" className={`${styles.image} ${styles.media}`} />}
                <p className={`button-text ${styles.textLink} intro-gap`}>Explore the project</p>
              </Link>
              <p className={`small-copy ${styles.entryMeta} ${styles.muted}`}>{project.role ?? "Development role wording awaiting owner approval"}</p>
              <p className={`small-copy intro-gap ${styles.muted}`}>Internal product interface. Visuals use synthetic demonstration data, not customer records or measured business results.</p>
              <ul aria-label={`${project.name} capabilities`} className={`body-copy ${styles.capabilityList}`}>{project.capabilities.slice(0, 4).map(item => <li key={item.title}>{item.title}</li>)}</ul>
              <nav aria-label={`${project.name} related services`} className={styles.related}>{project.relatedServices.map(service => <Link key={service.href} href={service.href} className={`button-text ${styles.textLink}`}>{service.title}</Link>)}</nav>
            </article>)}
          </Container>
        </section>
        <section aria-labelledby="work-contact-heading" className={`${styles.section} ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>Your next project</p><h2 id="work-contact-heading" className="section-heading intro-gap">What needs to work together?</h2>
            <p className={`section-copy intro-gap ${styles.muted}`}>A customer journey, an internal workflow or the connection between your tools. Start with the business problem and we will discuss a useful next step.</p>
            <div className="action-gap"><Link href="/contact" className={`button-primary button-size button-text ${styles.primary}`}>Discuss your project<ArrowRight size={17} aria-hidden="true" className="button-arrow shrink-0" /></Link></div>
            <p className={`small-copy intro-gap ${styles.muted}`}>Free 30-minute discovery call. No obligation.</p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
