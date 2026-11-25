import Image from "next/image";
import Link from "@/components/site/MarketingLink";
import { ArrowRight } from "lucide-react";

import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="closing-heading"
      className={styles.section}
    >
      <MarketingReveal />
      <Container className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.content} data-marketing-reveal="closing">

            {/* Editorial introduction */}

            <p className={styles.eyebrow}>
              Your next step
            </p>

            <h2
              id="closing-heading"
              className={`section-heading ${styles.heading}`}
            >
              <span>Your vision.</span>

              <span>
                Our next{" "}
                <em>challenge.</em>
              </span>
            </h2>

            <p className={styles.description}>
              Whether you have a clear vision or simply
              know something could work better,
              let&apos;s explore what&apos;s possible together.
            </p>

            {/* Contact actions */}

            <div className={styles.actions}>
              <Link
                href="/contact#booking"
                data-contact-source="final-cta"
                className={styles.primary}
              >
                <span>Book a strategy call</span>

                <ArrowRight
                  size={18}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </Link>

              <a
                href="mailto:hello@danielvlko.com"
                className={styles.email}
              >
                hello@danielvlko.com
              </a>
            </div>

            {/* Booking information */}

            <p className={styles.bookingInfo}>
              30 minutes
              <span aria-hidden="true">·</span>
              Free
              <span aria-hidden="true">·</span>
              No commitment
            </p>

          </div>
        </div>
      </Container>

      {/* Cinematic background */}

      <div
        className={styles.visual}
        aria-hidden="true"
      >
        <Image
          src="/images/hero/pp.jpg"
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 66vw"
          className={styles.image}
        />
      </div>
    </section>
  );
}
