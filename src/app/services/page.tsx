import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ServiceContactLink, ServiceNextStep } from "@/components/services/ServicePage";
import styles from "@/components/services/ServicePage.module.css";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Web Development, Custom Software & Automation Services",
  "Explore websites, custom business software and automation services from Daniel VLKO. Find the right starting point for customer growth or operational efficiency.",
  "/services",
);

export default function Services() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section aria-labelledby="services-title" className={styles.hero}>
          <Container>
            <nav aria-label="Breadcrumb"><ol className={`small-copy ${styles.breadcrumbs}`}><li><Link href="/">Home</Link></li><li aria-current="page">Services</li></ol></nav>
            <p className={`eyebrow ${styles.accent}`}>Software Developer &amp; Automation Architect</p>
            <h1 id="services-title" className={`display-heading ${styles.heroTitle}`}>Build for growth.<br />Connect for efficiency.</h1>
            <p className={`section-copy ${styles.heroCopy}`}>Websites that make your offer clear. Software that fits your operations. Automation that connects the work between them. Start with the business outcome, then choose what needs to be built.</p>
            <div className="action-gap"><ServiceContactLink /></div>
            <p className={`small-copy ${styles.expectation}`}>Free 30-minute discovery call. No obligation.</p>
          </Container>
        </section>

        <section aria-labelledby="choose-heading" className="section-space">
          <Container>
            <p className={`eyebrow ${styles.accent}`}>Find your starting point</p>
            <h2 id="choose-heading" className="section-heading intro-gap">What does your business need next?</h2>
            <div className={styles.rows}>
              {services.map(service => (
                <article key={service.slug} className={styles.row}>
                  <div>
                    <p className={`eyebrow ${styles.accent}`}>{service.outcome}</p>
                    <h3 className={`card-title ${styles.serviceName}`}><Link href={`/services/${service.slug}`} className={styles.textLink}>{service.name}</Link></h3>
                  </div>
                  <div>
                    <p className={`section-copy ${styles.muted} ${styles.serviceSummary}`}>{service.summary}</p>
                    <Link href={`/services/${service.slug}`} className={`button-text intro-gap ${styles.textLink}`}>Explore {service.name.toLowerCase()}</Link>
                  </div>
                </article>
              ))}
            </div>
            <p className={`body-copy ${styles.muted} ${styles.choiceNote}`}>A project can span more than one service. A customer-facing portal may need custom software behind it; an internal tool may need integrations. We define one coherent scope around the problem rather than ask you to choose a technical category in advance.</p>
          </Container>
        </section>

        <section aria-labelledby="approach-heading" className={`section-space ${styles.dark}`}>
          <Container className={styles.split}>
            <div>
              <p className={`eyebrow ${styles.accent}`}>From problem to scope</p>
              <h2 id="approach-heading" className="section-heading intro-gap">Choose the work that makes a difference.</h2>
            </div>
            <div>
              <p className={`section-copy ${styles.muted}`}>We start with your customers, team and existing tools. Then we decide what to improve, what to connect and what needs a dedicated build.</p>
              <p className={`body-copy intro-gap ${styles.muted}`}>Discovery, project implementation and integrations are scoped to the actual need. Deliverables, responsibilities and acceptance criteria are agreed before implementation. Prices, timelines and ongoing support are not assumed.</p>
            </div>
          </Container>
        </section>
        <section aria-labelledby="services-faq-heading" className="section-space">
          <Container>
            <p className={`eyebrow ${styles.accent}`}>Before choosing a service</p>
            <h2 id="services-faq-heading" className="section-heading intro-gap">Start with what you know.</h2>
            <div className={styles.faq}>
              <details><summary className="body-copy">What if I do not know which service I need?</summary><p className={`body-copy section-copy ${styles.muted}`}>Describe the problem, who it affects and the tools involved. The discovery call is a starting point for deciding whether a website, a dedicated application or an integration is worth exploring.</p></details>
              <details><summary className="body-copy">Can we start with a smaller scope?</summary><p className={`body-copy section-copy ${styles.muted}`}>Yes. A discovery phase, focused improvement or one bounded workflow can be scoped separately. The right starting point depends on the dependencies and the outcome you need.</p></details>
              <details><summary className="body-copy">Do you offer fixed packages or ongoing support?</summary><p className={`body-copy section-copy ${styles.muted}`}>Work is scoped individually. Deliverables, price, timing and handover responsibilities need agreement. Any ongoing improvements or support require a separate agreement rather than an assumed commitment.</p></details>
            </div>
          </Container>
        </section>
        <ServiceNextStep />
      </main>
      <Footer />
    </>
  );
}
