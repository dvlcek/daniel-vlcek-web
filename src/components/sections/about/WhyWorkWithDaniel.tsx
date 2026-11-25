import Image from "next/image";
import Link from "@/components/site/MarketingLink";
import { ArrowRight } from "lucide-react";

import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";
import styles from "./About.module.css";

const principles = [
  "Direct collaboration",
  "Understanding before building",
  "Long-term commitment",
] as const;

export function WhyWorkWithDaniel() {

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={styles.section}
    >
      <MarketingReveal />
      <Container className={styles.container}>
        <div className={styles.layout}>
          <figure
            className={styles.profile}
            data-marketing-reveal="portrait"
          >
            <div className={styles.portrait}>
              <Image
                src="/images/about/daniel-portrait-dark.png"
                alt="Portrait of Daniel VLKO"
                fill
                sizes="(max-width: 479px) calc(100vw - 40px), 420px"
                className={styles.image}
              />
            </div>

            <figcaption className={styles.identity}>
              <p className={styles.name}>
                Daniel VLKO
              </p>

              <p className={styles.role}>
                Software Developer &amp; Automation Architect
              </p>

              <p className={styles.metadata}>
                Founder, VLKO Ventures
                <span aria-hidden="true">·</span>
                Vienna, Austria
              </p>
            </figcaption>
          </figure>

          <div className={styles.content}>
            <header data-marketing-reveal="intro">
              <p className={styles.eyebrow}>
                About Daniel
              </p>

              <h2
                id="about-heading"
                className={`section-heading ${styles.heading}`}
              >
                Business thinking.
                <br />
                <span>Technical execution.</span>
              </h2>
            </header>

            <div
              className={styles.copy}
              data-marketing-reveal="intro"
            >
              <p>
                <strong className={styles.statement}>
                  For me, good technology starts with
                  understanding people.
                </strong>
              </p>

              <p>
                I want to understand how your business works,
                where you want to go and what&apos;s holding
                you back. I ask questions, challenge ideas
                when it makes sense and value honest
                conversations.
              </p>

              <p>
                I care about how we work together just as
                much as what we build.
              </p>
            </div>

            <ul
              className={styles.principles}
              role="list"
              aria-label="My approach to collaboration"
            >
              {principles.map((principle) => (
                <li
                  key={principle}
                  className={styles.principle}
                  data-marketing-reveal="detail"
                >
                  <span
                    className={styles.marker}
                    aria-hidden="true"
                  />

                  <span>{principle}</span>
                </li>
              ))}
            </ul>

            <div
              className={styles.actions}
              data-marketing-reveal="intro"
            >
              <Link
                href="/about"
                className={styles.aboutLink}
              >
                More about me

                <ArrowRight
                  size={18}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
