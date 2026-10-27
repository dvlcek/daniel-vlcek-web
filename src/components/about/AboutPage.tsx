import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { about } from "@/content/about";
import { getPortfolioNavigation } from "@/lib/portfolio-navigation";
import styles from "./AboutPage.module.css";

function ContactLink() {
  return <Link href="/contact" data-contact-source="about" className={`button-primary button-size button-text ${styles.primary}`}>Book a discovery call<ArrowRight size={17} aria-hidden="true" className="button-arrow shrink-0" /></Link>;
}

export function AboutPage() {
  const { workHref } = getPortfolioNavigation();
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section aria-labelledby="about-title" className={`${styles.section} ${styles.hero}`}>
          <Container>
            <nav aria-label="Breadcrumb"><ol className={`small-copy ${styles.breadcrumbs}`}><li><Link href="/">Home</Link></li><li aria-current="page">About</li></ol></nav>
            <div className={styles.split}>
              <div>
                <p className={`eyebrow ${styles.accent}`}>01 / About</p>
                <h1 id="about-title" className={`display-heading ${styles.name}`}>Daniel VLKO.</h1>
                <p className={`card-title ${styles.role}`}>Software Developer &amp; Automation Architect</p>
                <div className="action-gap"><ContactLink /></div>
              </div>
              <div>
                <p className={`section-copy ${styles.muted} ${styles.heroIntro}`}>{about.introduction}</p>
                <ul className={styles.focus}>{about.focus.map(item => <li key={item.label}><span className={`eyebrow ${styles.accent}`}>{item.label}</span><span className={`body-copy ${styles.muted}`}>{item.text}</span></li>)}</ul>
              </div>
            </div>
          </Container>
        </section>

        <section aria-labelledby="what-heading" className={styles.section}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>02 / What I do</p><h2 id="what-heading" className="section-heading intro-gap">The customer experience. The business behind it.</h2>
            <div className={styles.rows}>{about.services.map(service => <article key={service.href} className={styles.row}><h3 className="card-title">{service.title}</h3><div><p className={`body-copy ${styles.muted}`}>{service.text}</p><Link href={service.href} className={`button-text intro-gap ${styles.textLink}`}>Explore {service.title.toLowerCase()}</Link></div></article>)}</div>
          </Container>
        </section>
        <section aria-labelledby="thinking-heading" className={`${styles.section} ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>03 / How I think</p><h2 id="thinking-heading" className="section-heading intro-gap">Start with the workflow. Then choose what to build.</h2>
            <ol className={styles.steps}>{about.thinking.map((item, i) => <li key={item.title}><span aria-hidden="true" className={`eyebrow ${styles.accent}`}>0{i + 1}</span><h3 className="card-title card-title--small">{item.title}</h3><p className={`body-copy ${styles.muted}`}>{item.text}</p></li>)}</ol>
          </Container>
        </section>
        <section aria-labelledby="expertise-heading" className={styles.section}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>04 / Technical expertise</p><h2 id="expertise-heading" className="section-heading intro-gap">From the interface to the information underneath.</h2>
            <dl className={styles.rows}>{about.expertise.map(item => <div key={item.title} className={styles.row}><dt className="card-title card-title--small">{item.title}</dt><dd className={`body-copy ${styles.muted}`}>{item.text}</dd></div>)}</dl>
          </Container>
        </section>
        <section aria-labelledby="approach-heading" className={`${styles.section} ${styles.continuation}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>05 / My approach</p><h2 id="approach-heading" className="section-heading intro-gap">Clear decisions. Practical collaboration.</h2>
            <dl className={styles.rows}>{about.collaboration.map(item => <div key={item.title} className={styles.row}><dt className="card-title card-title--small">{item.title}</dt><dd className={`body-copy ${styles.muted}`}>{item.text}</dd></div>)}</dl>
          </Container>
        </section>
        <section aria-labelledby="about-work-heading" className={`${styles.section} ${styles.dark}`}>
          <Container className={styles.split}>
            <div><p className={`eyebrow ${styles.accent}`}>06 / Selected work</p><h2 id="about-work-heading" className="section-heading intro-gap">Put the approach in context.</h2></div>
            <div><p className={`section-copy ${styles.muted}`}>Explore the kinds of systems I build, the problems they address and the connections between the interface and the workflow.</p><Link href={workHref} className={`button-text action-gap ${styles.textLink}`}>Explore selected work</Link></div>
          </Container>
        </section>
        <section aria-labelledby="about-contact-heading" className={`${styles.section} ${styles.dark} ${styles.continuation}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>07 / The next step</p><h2 id="about-contact-heading" className="section-heading intro-gap">What needs to work better?</h2>
            <p className={`section-copy intro-gap ${styles.muted}`}>Tell me what you want to build, connect or improve. We will discuss the priorities and the most useful next step.</p>
            <div className="action-gap"><ContactLink /></div><p className={`small-copy intro-gap ${styles.muted}`}>Free 30-minute discovery call. No obligation.</p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
