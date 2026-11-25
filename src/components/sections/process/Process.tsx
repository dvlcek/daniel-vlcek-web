import Link from "@/components/site/MarketingLink";
import { ArrowRight } from "lucide-react";
import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";
import { processSteps } from "./process.data";
import styles from "./Process.module.css";

export function Process() {

  return (
    <section id="process" aria-labelledby="process-heading" className={styles.section}>
      <MarketingReveal />
      <Container className={styles.container}>
        <header className={styles.header} data-marketing-reveal="intro">
          <div>
            <p className={styles.eyebrow}>How we work</p>
            <h2 id="process-heading" className={`section-heading ${styles.heading}`}>
              Built with purpose.<br />
              <span>Designed for the long run.</span>
            </h2>
          </div>
          <p className={`section-copy ${styles.intro}`}>
            A clear process from the first conversation to long-term technical support.
          </p>
        </header>

        <ol className={styles.steps} role="list">
          {processSteps.map((step, index) => (
            <li key={step.number} className={styles.step} data-marketing-reveal="step" data-partnership={index === processSteps.length - 1}>
              <span className={styles.number} aria-hidden="true">{step.number}</span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.closing} data-marketing-reveal="detail">
          <div className={styles.closingCopy}>
            <h3>It starts with a conversation.</h3>
          </div>
          <Link href="/contact#booking" data-contact-source="process"
            className={`button-primary button-size button-text ${styles.cta}`}>
            Book a strategy call
            <ArrowRight size={17} strokeWidth={1.6} aria-hidden="true" className="button-arrow" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
