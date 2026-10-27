import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { services, type Service } from "@/content/services";
import { legalContactEmail } from "@/lib/legal-details";
import styles from "./ServicePage.module.css";

export function ServiceContactLink() {
  return (
    <Link href="/contact" data-contact-source="services" className={`button-primary button-size button-text ${styles.primary}`}>
      <span>Book a discovery call</span>
      <ArrowRight size={17} aria-hidden="true" className="button-arrow shrink-0" />
    </Link>
  );
}

export function ServiceNextStep() {
  return (
    <section aria-labelledby="next-step-heading" className={`section-space ${styles.dark}`}>
      <Container>
        <p className={`eyebrow ${styles.accent}`}>The next step</p>
        <h2 id="next-step-heading" className="section-heading intro-gap">Start with the business problem.</h2>
        <p className={`section-copy intro-gap ${styles.muted}`}>
          Tell me what you want to build or improve and which tools you use today.
          We will discuss your priorities and the most useful next step.
        </p>
        <div className="action-gap"><ServiceContactLink /></div>
        <p className={`small-copy ${styles.expectation}`}>Free 30-minute discovery call. No obligation.</p>
        <p className={`small-copy ${styles.expectation}`}>
          Prefer email?{" "}
          <a href={`mailto:${legalContactEmail}`} className={styles.textLink}>{legalContactEmail}</a>
        </p>
      </Container>
    </section>
  );
}

export function ServicePage({ service }: { service: Service }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section aria-labelledby="service-title" className={styles.hero}>
          <Container>
            <nav aria-label="Breadcrumb">
              <ol className={`small-copy ${styles.breadcrumbs}`}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li aria-current="page">{service.name}</li>
              </ol>
            </nav>
            <p className={`eyebrow ${styles.accent}`}>{service.name} / {service.outcome}</p>
            <h1 id="service-title" className={`display-heading ${styles.heroTitle}`}>{service.title}</h1>
            <p className={`section-copy ${styles.heroCopy}`}>{service.description}</p>
            <div className="action-gap"><ServiceContactLink /></div>
            <p className={`small-copy ${styles.expectation}`}>Free 30-minute discovery call. No obligation.</p>
          </Container>
        </section>

        <section aria-labelledby="problems-heading" className="section-space">
          <Container className={styles.split}>
            <div>
              <p className={`eyebrow ${styles.accent}`}>When this helps</p>
              <h2 id="problems-heading" className="section-heading intro-gap">Does this sound familiar?</h2>
              <p className={`section-copy intro-gap ${styles.muted}`}>{service.problemIntro}</p>
            </div>
            <ul className={`body-copy ${styles.problemList}`}>{service.problems.map(problem => <li key={problem}>{problem}</li>)}</ul>
          </Container>
        </section>

        <section aria-labelledby="solution-heading" className={`section-space ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>What I build</p>
            <div className={`intro-gap ${styles.split}`}>
              <h2 id="solution-heading" className="section-heading">{service.solutionTitle}</h2>
              <p className={`section-copy ${styles.muted}`}>{service.solution}</p>
            </div>
            <h3 className="card-title content-gap">What the scope can include</h3>
            <p className={`body-copy intro-gap ${styles.muted}`}>These are possible deliverables. Your project includes only the items we agree in scope.</p>
            <dl className={styles.rows}>
              {service.deliverables.map(item => (
                <div key={item.title} className={styles.row}>
                  <dt className="card-title card-title--small">{item.title}</dt>
                  <dd className={`body-copy ${styles.muted}`}>{item.description}</dd>
                </div>
              ))}
            </dl>
            <p className={`body-copy intro-gap ${styles.muted}`}>{service.boundary}</p>
            <div className="action-gap">
              <Link href="/contact" data-contact-source="services" className={`button-secondary button-text ${styles.textLink}`}>Discuss your project scope</Link>
            </div>
          </Container>
        </section>

        <section aria-labelledby="process-heading" className="section-space">
          <Container>
            <p className={`eyebrow ${styles.accent}`}>How we work</p>
            <h2 id="process-heading" className="section-heading intro-gap">Understand first. Build with a clear scope.</h2>
            <ol className={styles.steps}>
              {service.process.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <span aria-hidden="true" className={`eyebrow ${styles.accent}`}>0{index + 1}</span>
                  <h3 className="card-title card-title--small">{step.title}</h3>
                  <p className={`body-copy ${styles.muted}`}>{step.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="cooperation-heading" className={`section-space ${styles.dark}`}>
          <Container>
            <p className={`eyebrow ${styles.accent}`}>Cooperation options</p>
            <h2 id="cooperation-heading" className="section-heading intro-gap">Start at the right level.</h2>
            <dl className={styles.rows}>
              {service.engagements.map(item => (
                <div key={item.title} className={styles.row}>
                  <dt className="card-title card-title--small">{item.title}</dt>
                  <dd className={`body-copy ${styles.muted}`}>{item.description}</dd>
                </div>
              ))}
            </dl>
            <p className={`body-copy intro-gap ${styles.muted}`}>Scope, cost, timing and responsibilities are agreed for each project. Any ongoing work requires a separate agreement.</p>
          </Container>
        </section>

        <section aria-labelledby="faq-heading" className="section-space">
          <Container>
            <p className={`eyebrow ${styles.accent}`}>Practical questions</p>
            <h2 id="faq-heading" className="section-heading intro-gap">Before we start.</h2>
            <div className={styles.faq}>
              {service.faqs.map(faq => (
                <details key={faq.question}>
                  <summary className="body-copy">{faq.question}</summary>
                  <p className={`body-copy section-copy ${styles.muted}`}>{faq.answer}</p>
                </details>
              ))}
            </div>
            <nav aria-label="Other services" className={styles.related}>
              {services.filter(item => item.slug !== service.slug).map(item => (
                <Link key={item.slug} href={`/services/${item.slug}`} className={`button-text ${styles.textLink}`}>Explore {item.name.toLowerCase()}</Link>
              ))}
            </nav>
          </Container>
        </section>
        <ServiceNextStep />
      </main>
      <Footer />
    </>
  );
}
