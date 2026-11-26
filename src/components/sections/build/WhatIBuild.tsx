import Image from "next/image";
import Link from "@/components/site/MarketingLink";
import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";
import styles from "./WhatIBuild.module.css";

const services = [
  {
    id: "web-development",
    title: "Websites & E-commerce",
    description:
      "Custom websites and online stores built to attract customers and drive sales.",
    image: "/images/services/web.webp",
    imageAlt: "Custom website development showcase",
    href: "/services/web-development",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description:
      "Business applications, CRM systems and client portals tailored to your operations.",
    image: "/images/services/business-build.webp",
    imageAlt: "Custom business software showcase",
    href: "/services/custom-software",
  },
  {
    id: "automation-ai",
    title: "Automation & AI",
    description:
      "AI integrations and automated workflows that reduce manual work and save time.",
    image: "/images/services/ai-build.webp",
    imageAlt: "Business automation workflow",
    href: "/services/automation-ai",
  },
] as const;

function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 18 18 6M8 6h10v10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const principles = [
  "Custom-built solutions",
  "Direct technical partnership",
  "Built for long-term growth",
] as const;

export function WhatIBuild() {
  return (
    <section id="services" aria-labelledby="services-heading" className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.layout}>
          <header className={styles.intro} data-marketing-reveal="intro">
            <p className={styles.eyebrow}>Expertise</p>
            <h2 id="services-heading" className={styles.heading}>
              Websites, software <span>&amp; automation.</span>
            </h2>
            <p className={styles.introDescription}>
              One technical partner to help you attract more customers, simplify operations and grow with less manual work.
            </p>
            <Link href="/services" className={styles.primaryLink}>
              Explore all services <Arrow />
            </Link>
            <ul className={styles.principles} aria-label="Our approach">
              {principles.map((principle) => (
                <li key={principle}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {principle}
                </li>
              ))}
            </ul>
          </header>
          <div className={styles.services}>
            {services.map((service, index) => (
              <article key={service.id} id={`service-${service.id}`} className={styles.service} data-marketing-reveal="project">
                <Link href={service.href} aria-labelledby={`service-title-${service.id}`} className={styles.serviceLink}>
                  <div className={styles.content}>
                    <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")} /</span>
                    <h3 id={`service-title-${service.id}`} className={styles.title}>{service.title}</h3>
                    <p className={styles.description}>{service.description}</p>
                  </div>
                  <div className={styles.visual}>
                    <Image src={service.image} alt={service.imageAlt} fill sizes="(min-width: 1100px) 240px, (min-width: 640px) 36vw, (min-width: 480px) 140px, 90vw" className={styles.image} />
                  </div>
                  <span className={styles.arrow} aria-hidden="true"><Arrow /></span>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.footer} data-marketing-reveal="detail">
          <p>One technical partner. Connected solutions.</p>
          <span className={styles.footerLine} aria-hidden="true" />
          <Link href="/contact" data-contact-source="services" className={styles.contactLink}>Discuss your project <Arrow /></Link>
        </div>
      </Container>
      <MarketingReveal />
    </section>
  );
}
