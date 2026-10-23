"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";
import styles from "./Process.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    number: "01",
    title: "Understand",
    kicker: "Find the real constraint.",
    description:
      "We map the business, workflows and bottlenecks to understand what is actually slowing things down.",
  },
  {
    number: "02",
    title: "Architect",
    kicker: "Design the right system.",
    description:
      "We decide what to simplify, automate or build — and how everything should work together.",
  },
  {
    number: "03",
    title: "Build",
    kicker: "Turn the plan into reality.",
    description:
      "I develop, integrate and automate the system around your operations, not the other way around.",
  },
  {
    number: "04",
    title: "Scale",
    kicker: "Make it better as you grow.",
    description:
      "We measure what changed, improve what matters and extend the system without unnecessary complexity.",
  },
];

export function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="process"
      className="
        relative
        overflow-hidden
        scroll-mt-20
        bg-[#F6F3EE]
        text-[#071017]
      "
    >
      {/* ======================================================
          SELECTED WORK → PROCESS TRANSITION
      ====================================================== */}

      <ProcessTransition />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <Container
        className="relative z-10 section-space section-space--curve"
      >
        {/* ====================================================
            INTRO
        ==================================================== */}

        <div className="section-intro">
          {/* HEADLINE */}

          <motion.h2
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 18,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.55,
            }}
            transition={{
              duration: 0.7,
              delay: 0.06,
              ease,
            }}
            className="section-heading"
          >
            Understand first.
            <br />
            Build what{" "}
            <span className="text-[#FF5A1F]">
              matters.
            </span>
          </motion.h2>

          {/* DESCRIPTION */}

          <motion.p
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 12,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.14,
              ease,
            }}
            className="section-copy intro-gap text-[#596773]"
          >
            I start with the business, not the technology. Then I design,
            build and improve the system around what actually creates value.
          </motion.p>
        </div>

        {/* ====================================================
            PROCESS STEPS
        ==================================================== */}

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.22,
          }}
          variants={{
            hidden: {},

            visible: {
              transition: {
                delayChildren: reduceMotion ? 0 : 0.08,
                staggerChildren: reduceMotion ? 0 : 0.1,
              },
            },
          }}
          className="content-gap list-none p-0 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4"
        >
          {steps.map((step) => (
            <ProcessStep
              key={step.number}
              step={step}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </motion.ol>

        {/* ====================================================
            CTA
        ==================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 12,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.55,
            delay: 0.38,
            ease,
          }}
          className="action-gap"
        >
          <a
            href="/contact" data-contact-source="process"
            style={{
              color: "#FFFFFF",
            }}
            className="button-primary
              group

              inline-flex
              button-size

              items-center
              justify-center

              rounded-full

              bg-[#071017]


              button-text

              shadow-[0_12px_34px_rgba(7,16,23,0.12)]


              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-[#C2410C]
              hover:bg-[#101C24]
              hover:shadow-[0_16px_42px_rgba(7,16,23,0.16)]
            "
          >
            <span
              style={{
                color: "#FFFFFF",
              }}
            >
              Start a conversation
            </span>

            <ArrowRight
              size={17}
              aria-hidden="true"
              strokeWidth={1.6}
              style={{
                color: "#FFFFFF",
              }}
              className="button-arrow"
            />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}

/* ============================================================
   PROCESS STEP
============================================================ */

type ProcessStepProps = {
  step: {
    number: string;
    title: string;
    kicker: string;
    description: string;
  };

  reduceMotion: boolean;
};

function ProcessStep({ step, reduceMotion }: ProcessStepProps) {
  return (
    <motion.li
      variants={{
        hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0 : 0.5, ease },
        },
      }}
      className={`${styles.step} relative min-w-0`}
    >
      <div className="flex items-center gap-6" aria-hidden="true">
        <span
          className={`${styles.number} shrink-0 text-[52px] font-medium leading-none tracking-[-0.06em] text-[#CDD1D4] tabular-nums md:text-[58px] xl:text-[60px] 2xl:text-[66px]`}
        >
          {step.number}
        </span>

        <div className="relative h-px flex-1 overflow-hidden bg-[#071017]/10">
          <motion.span
            variants={{
              hidden: reduceMotion ? {} : { scaleX: 0 },
              visible: {
                scaleX: 1,
                transition: { duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.08, ease },
              },
            }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-0 bg-[#071017]/16"
          />
          <span className={styles.lineAccent} />
        </div>
      </div>

      <h3 className="card-title mt-6 text-[#071017]">
        {step.title}
      </h3>
      <p className="small-copy mt-3 font-medium text-[#65727C]">
        {step.kicker}
      </p>
      <p className="body-copy mt-4 max-w-[310px] text-[#5F6C76]">
        {step.description}
      </p>
    </motion.li>
  );
}

/* ============================================================
   SELECTED WORK → PROCESS TRANSITION
============================================================ */

function ProcessTransition() {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none

        absolute
        inset-x-0
        top-0

        z-0

        h-[125px]

        overflow-hidden

        md:h-[145px]
      "
    >
      {/* DARK CURVE */}

      <div
        className="
          absolute

          left-1/2

          top-[-205px]

          h-[286px]
          w-[128%]

          -translate-x-1/2

          rounded-[50%]

          bg-[#03070b]

          md:top-[-214px]
          md:h-[305px]
        "
      />

      {/* SOFT SHADOW */}

      <div
        className="
          absolute

          left-1/2

          top-[65px]

          h-[46px]
          w-[86%]

          -translate-x-1/2

          blur-[26px]

          md:top-[76px]
        "
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(3,7,11,0.10) 0%,
              rgba(3,7,11,0.04) 45%,
              transparent 72%
            )
          `,
        }}
      />

      {/* LIGHT RETURN */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0

          h-[40px]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(246,243,238,0),
              rgba(246,243,238,0.7)
            )
          `,
        }}
      />
    </div>
  );
}
