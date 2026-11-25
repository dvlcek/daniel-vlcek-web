import { MarketingReveal } from "@/components/site/MarketingReveal";
import { Container } from "@/components/ui/Container";
import styles from "./HomeFAQ.module.css";

const questions = [
  {
    question: "What kind of businesses do you work with?",
    answer:
      "I work with founders, growing businesses and established companies that want to improve how they operate through technology. Whether you're starting something new or improving an existing business, the most important thing is a shared ambition to build something valuable.",
  },
  {
    question: "What happens on the first strategy call?",
    answer:
      "We'll spend around 30 minutes talking about your business, your goals and the challenges you're facing. It's an opportunity to get to know each other, explore ideas and see whether working together makes sense. There's no obligation to move forward.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Every project is different, so I price based on the scope, complexity and value of the solution. Before we begin, you'll have a clear proposal outlining the investment, deliverables and payment terms.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "That depends on what we're building. A focused website may take a few weeks, while a more complex software platform or automation system can take several months. We'll agree on a realistic timeline and clear milestones before development begins.",
  },
  {
    question: "Can you work with our existing tools and systems?",
    answer:
      "Absolutely. I believe in making the most of what already works. I'll review your existing tools and infrastructure, identify opportunities for improvement and recommend whether to integrate, extend or replace individual components.",
  },
  {
    question: "Do we own the software you build?",
    answer:
      "Ownership, source code access and licensing are clearly defined in our agreement before development begins. My goal is to give you control over your business technology, with any third-party licensing or platform requirements explained upfront.",
  },
  {
    question: "What happens after launch?",
    answer:
      "I see launch as the beginning of a new stage, not necessarily the end of our collaboration. We can arrange ongoing maintenance, monitoring, improvements and further development based on what your business needs.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. I'm based in Vienna, Austria, and can work with businesses internationally. Communication, project management and development can all be handled remotely, regardless of location.",
  },
  {
    question: "Can we start small and expand later?",
    answer:
      "Absolutely. I often recommend focusing on what brings the most value first. We can build a solid foundation, introduce new capabilities over time and expand the system as your business grows.",
  },
  {
    question: "Can you improve an existing website or application?",
    answer:
      "Yes. I'll first review your current solution to understand what's working, what isn't and where improvements would have the greatest impact. Sometimes a focused improvement makes more sense than rebuilding everything from scratch.",
  },
] as const;

export function HomeFAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={styles.section}
    >
      <MarketingReveal />
      <Container className={styles.container}>
        <div className={styles.layout}>

          {/* Editorial introduction */}

          <header className={styles.intro} data-marketing-reveal="intro">
            <p className={styles.eyebrow}>
              FAQ
            </p>

            <h2
              id="faq-heading"
              className={`section-heading ${styles.heading}`}
            >
              Before we talk.
            </h2>

            <p className={styles.description}>
              A few things you might want to know
              before we get started.
            </p>
          </header>

          {/* Native accordion */}

          <div className={styles.accordion}>
            {questions.map(({ question, answer }) => (
              <details
                key={question}
                name="homepage-faq"
                className={styles.item}
              >
                <summary className={styles.summary}>
                  <span className={styles.question}>
                    {question}
                  </span>

                  <span className={styles.icon} aria-hidden="true" />
                </summary>

                <div className={styles.answer}>
                  <p>{answer}</p>
                </div>
              </details>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
