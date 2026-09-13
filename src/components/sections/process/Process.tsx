"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";

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
        className="
          relative
          z-10

          pb-16
          pt-[165px]

          md:pb-20
          md:pt-[185px]

          xl:pb-24
          xl:pt-[195px]

          2xl:pb-26
          2xl:pt-[210px]
        "
      >
        {/* ====================================================
            INTRO
        ==================================================== */}

        <div className="max-w-[920px]">
          {/* EYEBROW */}

          {/* <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -12,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.8,
            }}
            transition={{
              duration: 0.55,
              ease,
            }}
            className="flex items-center gap-4"
          >
            <motion.span
              initial={
                reduceMotion
                  ? false
                  : {
                      scaleX: 0,
                    }
              }
              whileInView={{
                scaleX: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease,
              }}
              style={{
                transformOrigin: "left",
              }}
              className="h-px w-8 bg-[#FF5A1F]"
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.34em]
                text-[#697781]
              "
            >
              My Process
            </span>
          </motion.div> */}

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
            className="
              mt-9

              text-[44px]
              font-semibold
              leading-[0.96]
              tracking-[-0.06em]

              sm:text-[54px]
              md:text-[60px]
              xl:text-[66px]
              2xl:text-[72px]
            "
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
            className="
              mt-7
              max-w-[720px]

              text-[16px]
              leading-7
              text-[#596773]

              md:text-[18px]
              md:leading-8
            "
          >
            I start with the business, not the technology. Then I design,
            build and improve the system around what actually creates value.
          </motion.p>
        </div>

        {/* ====================================================
            PROCESS STEPS
        ==================================================== */}

        <motion.div
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
          className="
            mt-16
            grid
            gap-12

            sm:grid-cols-2

            xl:mt-[72px]
            xl:grid-cols-4
            xl:gap-10

            2xl:gap-14
          "
        >
          {steps.map((step) => (
            <ProcessStep
              key={step.number}
              step={step}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </motion.div>

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
          className="mt-14"
        >
          <a
            href="/contact"
            style={{
              color: "#FFFFFF",
            }}
            className="
              group

              inline-flex
              h-[52px]

              items-center
              justify-center
              gap-8

              rounded-full

              bg-[#071017]

              px-7

              text-[14px]
              font-medium

              shadow-[0_12px_34px_rgba(7,16,23,0.12)]

              transition-all
              duration-300

              hover:-translate-y-0.5
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
              strokeWidth={1.6}
              style={{
                color: "#FFFFFF",
              }}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
              "
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

function ProcessStep({
  step,
  reduceMotion,
}: ProcessStepProps) {
  return (
    <motion.article
      variants={{
        hidden: reduceMotion
          ? {}
          : {
              opacity: 0,
              y: 18,
            },

        visible: {
          opacity: 1,
          y: 0,

          transition: {
            duration: 0.58,
            ease,
          },
        },
      }}
      className="
        group
        relative
        min-w-0
      "
    >
      {/* NUMBER + LINE */}

      <div
        className="
          flex
          items-center
          gap-6
        "
      >
        <motion.span
          variants={{
            hidden: reduceMotion
              ? {}
              : {
                  opacity: 0,
                  y: 8,
                },

            visible: {
              opacity: 1,
              y: 0,

              transition: {
                duration: 0.5,
                ease,
              },
            },
          }}
          className="
            shrink-0

            text-[52px]
            font-medium
            leading-none
            tracking-[-0.06em]

            text-[#CDD1D4]

            transition-colors
            duration-300

            group-hover:text-[#FF5A1F]

            md:text-[58px]
            xl:text-[60px]
            2xl:text-[66px]
          "
        >
          {step.number}
        </motion.span>

        {/* DRAWING LINE */}

        <div
          className="
            relative
            h-px
            flex-1
            overflow-hidden

            bg-[#071017]/10
          "
        >
          <motion.span
            variants={{
              hidden: reduceMotion
                ? {}
                : {
                    scaleX: 0,
                  },

              visible: {
                scaleX: 1,

                transition: {
                  duration: 0.7,
                  delay: 0.08,
                  ease,
                },
              },
            }}
            style={{
              transformOrigin: "left",
            }}
            className="
              absolute
              inset-0

              bg-[#071017]/16

              transition-colors
              duration-300

              group-hover:bg-[#FF5A1F]/55
            "
          />
        </div>
      </div>

      {/* TITLE */}

      <motion.h3
        variants={{
          hidden: reduceMotion
            ? {}
            : {
                opacity: 0,
                y: 8,
              },

          visible: {
            opacity: 1,
            y: 0,

            transition: {
              duration: 0.5,
              delay: 0.08,
              ease,
            },
          },
        }}
        className="
          mt-8

          text-[22px]
          font-semibold
          leading-none
          tracking-[-0.04em]

          text-[#071017]

          md:text-[24px]
        "
      >
        {step.title}
      </motion.h3>

      {/* KICKER */}

      <motion.p
        variants={{
          hidden: reduceMotion
            ? {}
            : {
                opacity: 0,
                y: 6,
              },

          visible: {
            opacity: 1,
            y: 0,

            transition: {
              duration: 0.45,
              delay: 0.12,
              ease,
            },
          },
        }}
        className="
          mt-2.5

          text-[13px]
          font-medium
          leading-5

          text-[#65727C]

          md:text-[14px]
        "
      >
        {step.kicker}
      </motion.p>

      {/* DESCRIPTION */}

      <motion.p
        variants={{
          hidden: reduceMotion
            ? {}
            : {
                opacity: 0,
                y: 6,
              },

          visible: {
            opacity: 1,
            y: 0,

            transition: {
              duration: 0.45,
              delay: 0.16,
              ease,
            },
          },
        }}
        className="
          mt-4
          max-w-[310px]

          text-[14px]
          leading-[1.65]

          text-[#5F6C76]

          md:text-[15px]
        "
      >
        {step.description}
      </motion.p>
    </motion.article>
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

          bg-[#040B10]

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
              rgba(7,16,23,0.14) 0%,
              rgba(7,16,23,0.05) 45%,
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