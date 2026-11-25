import Image from "next/image";
import Link from "@/components/site/MarketingLink";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import type { getPortfolioEntries } from "@/content/projects";
import styles from "./Portfolio.module.css";

const imageSizes = "(min-width: 1480px) 1352px, (min-width: 1280px) calc(100vw - 128px), (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)";

export function WorkIndex({ entries }: { entries: ReturnType<typeof getPortfolioEntries> }) {
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
            {entries.map(({ project, href }) => {
              const [media] = project.media;
              const name = "portfolioName" in project ? project.portfolioName ?? project.name : project.name;
              const preview = href && project.status === "draft";
              return (
                <article key={project.slug} className={styles.entry}>
                  <p className={`eyebrow ${styles.accent}`}>{project.classification}{preview && " / Draft for review"}</p>
                  <h2 className="section-heading intro-gap">{name}</h2>
                  <p className={`section-copy intro-gap ${styles.muted}`}>{project.description}</p>
                  {media && (media.approved || preview) && (
                    <Image src={media.src} alt={media.alt} width={media.width} height={media.height}
                      sizes={imageSizes} className={`${styles.image} ${styles.media}`} />
                  )}
                  {href && <Link href={href} className={`button-text ${styles.textLink} intro-gap`}>View case study<span className="sr-only"> — {name}</span></Link>}
                  {preview && <p className={`small-copy intro-gap ${styles.muted}`}>Internal product interface shown with synthetic demonstration data.</p>}
                </article>
              );
            })}
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
