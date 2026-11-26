import Image from "next/image";
import Link from "@/components/site/MarketingLink";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ServiceContactLink, ServiceNextStep } from "@/components/services/ServicePage";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/services/ServicesOverview.module.css";

export const metadata = pageMetadata(
  "Web Development, Custom Software & Automation Services",
  "Explore websites, custom business software and automation services from Daniel VLKO. Find the right starting point for customer growth or operational efficiency.",
  "/services",
);

const presentation = {
  "web-development": {
    title: "Websites & E-commerce",
    image: "/images/services/web.webp",
    summary: "Custom websites and online stores designed to make your offer clear and turn visits into enquiries or sales.",
    capabilities: ["Business websites", "Online stores", "Redesigns", "Performance & technical SEO"],
    link: "Explore web development",
  },
  "custom-software": {
    title: "Custom Software",
    image: "/images/services/business-build.webp",
    summary: "Tailored applications that bring your people, data and daily operations into one reliable system.",
    capabilities: ["Business applications", "CRM systems", "Client portals", "Operational dashboards"],
    link: "Explore custom software",
  },
  "automation-ai": {
    title: "Automation & AI",
    image: "/images/services/ai-build.webp",
    summary: "Connect your existing tools, automate repetitive tasks and apply AI where it makes a practical difference.",
    capabilities: ["Workflow automation", "API integrations", "Lead & CRM workflows", "Human-reviewed AI"],
    link: "Explore automation & AI",
  },
} satisfies Record<(typeof services)[number]["slug"], {
  title: string; image: string; summary: string; capabilities: string[]; link: string;
}>;

const process = [
  { title: "Understand", description: "We clarify your goals, current tools and the problem worth solving." },
  { title: "Define & build", description: "We agree the scope, deliverables and acceptance criteria, then build and review the solution." },
  { title: "Launch & handover", description: "We verify the agreed requirements and clarify ownership, operation and any further improvements." },
];

const projects = [
  { name: "Mini Sklady", image: "/images/work/mini-sklady.webp", href: "/work/mini-sklady" },
  { name: "Pokracuj Studio", image: "/images/work/pokracuj-studio.webp", href: "/work/pokracuj-studio" },
];

const questions = [
  { question: "What if I don't know which service I need?", answer: "Describe the problem, who it affects and the tools you use. The discovery call helps us decide whether a website, a dedicated application or an integration is the right starting point." },
  { question: "Can I combine multiple services?", answer: "Yes. A customer portal may need custom software behind it, and an internal tool may need integrations. We define one coherent scope around the business outcome." },
  { question: "Can we start with a smaller project?", answer: "Yes. A discovery phase, focused improvement or a single bounded workflow can be scoped separately, depending on the dependencies and your goals." },
  { question: "How much does a project cost and how long does it take?", answer: "Cost and timing depend on the scope, complexity, content and integrations. We agree deliverables, responsibilities, price and timing before implementation." },
  { question: "What happens after launch?", answer: "We agree the handover and operating responsibilities as part of the project. Ongoing maintenance, support and improvements can be scoped separately; they are not automatically included." },
];

export default function Services() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section aria-labelledby="services-title" className={`${styles.hero} ${styles.dark}`}>
          <Container>
            <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
              <ol><li><Link href="/">Home</Link></li><li aria-current="page">Services</li></ol>
            </nav>
            <p className={styles.eyebrow}>Services / Daniel VLKO</p>
            <div className={styles.heroGrid}>
              <h1 id="services-title" className={styles.heroTitle}>
                Websites. Software. <span>Intelligent automation.</span>
              </h1>
              <div className={styles.heroAside}>
                <p className={styles.lead}>Attract customers, simplify operations and reduce manual work with digital solutions built around your business.</p>
                <ServiceContactLink />
                <p className={styles.expectation}>Free 30-minute discovery call. No obligation.</p>
              </div>
            </div>
            <nav aria-label="Jump to a service" className={styles.index}>
              {services.map((service, index) => (
                <Link key={service.slug} href={`#${service.slug}`}>
                  <span className={styles.indexNumber}>0{index + 1}</span>
                  <span>{presentation[service.slug].title}</span><ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </Container>
        </section>

        <section aria-labelledby="expertise-heading" className={styles.section}>
          <Container>
            <p className={styles.eyebrow}>01 / Core expertise</p>
            <div className={styles.sectionIntro}>
              <h2 id="expertise-heading" className={styles.heading}>What I can build for you.</h2>
              <p className={styles.copy}>Start with the outcome your business needs. Each service can stand on its own or become part of a connected solution.</p>
            </div>
            <div className={styles.showcase}>
              {services.map((service, index) => {
                const item = presentation[service.slug];
                return (
                  <article key={service.slug} id={service.slug} className={styles.serviceRow} aria-labelledby={`${service.slug}-title`}>
                    <div className={styles.serviceContent}>
                      <p className={styles.eyebrow}>0{index + 1} / {service.outcome}</p>
                      <h3 id={`${service.slug}-title`} className={styles.serviceTitle}>{item.title}</h3>
                      <p className={styles.copy}>{item.summary}</p>
                      <ul className={styles.capabilities} aria-label="Possible deliverables">
                        {item.capabilities.map(capability => <li key={capability}>{capability}</li>)}
                      </ul>
                      <Link href={`/services/${service.slug}`} className={styles.textLink}>{item.link}<ArrowUpRight size={18} aria-hidden="true" /></Link>
                    </div>
                    <figure className={styles.visual} data-marketing-reveal="project">
                        <Image src={item.image} alt="" fill sizes="(min-width: 1440px) 600px, (min-width: 768px) 45vw, 90vw" className={styles.image} />
                    </figure>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        <section aria-labelledby="connected-heading" className={`${styles.section} ${styles.dark}`}>
          <Container className={styles.connectedGrid}>
            <div>
              <p className={styles.eyebrow}>02 / Connected solutions</p>
              <h2 id="connected-heading" className={styles.heading}>Better together.</h2>
              <p className={styles.copy}>Your website, internal software and automated workflows can work as one system. We define the right scope around your business, not around a technical category.</p>
              <Link href="/contact" data-contact-source="services" className={styles.textLink}>Discuss your project <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
            <div className={styles.network} data-marketing-reveal="project" role="img" aria-label="Websites, software and automation connect to support your business">
              <div className={styles.networkNodes}>
                <span>Websites<span>Customers</span></span>
                <span>Software<span>Operations</span></span>
                <span>Automation<span>Workflows</span></span>
              </div>
              <svg aria-hidden="true" viewBox="0 0 300 58" preserveAspectRatio="none" className={styles.networkLines}>
                <path d="M50 0V20Q50 29 60 29H150V58M150 0V58M250 0V20Q250 29 240 29H150" />
              </svg>
              <div className={styles.networkResult}><span className={styles.signal} />Your business</div>
              <p className={styles.networkCaption}>One connected approach</p>
            </div>
          </Container>
        </section>

        <section aria-labelledby="process-heading" className={styles.section}>
          <Container>
            <p className={styles.eyebrow}>03 / How we work</p>
            <h2 id="process-heading" className={styles.heading}>From idea to implementation.</h2>
            <ol className={styles.steps}>
              {process.map((step, index) => (
                <li key={step.title} data-marketing-reveal="step"><span className={styles.eyebrow}>0{index + 1}</span><h3>{step.title}</h3><p className={styles.copy}>{step.description}</p></li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="services-work-heading" className={`${styles.section} ${styles.work}`}>
          <Container>
            <p className={styles.eyebrow}>04 / Selected work</p>
            <div className={styles.sectionIntro}>
              <h2 id="services-work-heading" className={styles.heading}>See what I build.</h2>
              <Link href="/work" className={styles.textLink}>View all work <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
            <div className={styles.projects}>
              {projects.map(project => (
                <article key={project.href} data-marketing-reveal="project">
                  <Link href={project.href} className={styles.projectLink}>
                    <div className={`${styles.visual} ${styles.projectVisual}`}><Image src={project.image} alt="" fill sizes="(min-width: 1440px) 600px, (min-width: 768px) 45vw, 90vw" className={styles.image} /></div>
                    <div className={styles.projectLabel}><h3>{project.name}</h3><ArrowUpRight size={20} aria-hidden="true" /></div>
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section aria-labelledby="services-faq-heading" className={styles.section}>
          <Container className={styles.faqGrid}>
            <div><p className={styles.eyebrow}>05 / FAQ</p><h2 id="services-faq-heading" className={styles.heading}>Before we get started.</h2><p className={styles.copy}>A few practical questions about scope and working together.</p></div>
            <div className={styles.faq}>
              {questions.map(({question, answer}) => <details key={question}><summary>{question}<span aria-hidden="true" /></summary><p className={styles.copy}>{answer}</p></details>)}
            </div>
          </Container>
        </section>
        <ServiceNextStep />
      </main>
      <Footer />
    </>
  );
}
