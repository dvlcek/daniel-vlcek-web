import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";
import { SystemDiagram } from "./SystemDiagram";
import { benefits } from "./system.data";
import styles from "./System.module.css";

export function System() {
  return (
    <section id="system" aria-labelledby="system-heading" className={styles.section}>
      <MarketingReveal />
      <Container className={styles.container}>
        <header className={styles.header} data-marketing-reveal="intro">
          <div className={styles.headingGroup}>
            <p className={styles.eyebrow}>The connected approach</p>
            <h2 id="system-heading" className={`section-heading ${styles.heading}`}>
              Everything connected.<br />
              <span>Nothing isolated.</span>
            </h2>
          </div>
          <p className={`section-copy ${styles.description}`}>
            From customer-facing experiences to internal operations, I build systems that work together as one.
          </p>
        </header>
        <SystemDiagram />
        <ul className={styles.benefits}>
          {benefits.map((benefit) => (
            <li key={benefit.title}>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
