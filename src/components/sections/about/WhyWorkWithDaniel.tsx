"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

const reasons = [
  {
    title: "You work directly with me",
    description:
      "No account managers. No middle layers. You get direct access, clear decisions and my full attention from day one.",
  },
  {
    title: "Diagnose before building",
    description:
      "We find the real constraint first, so the solution fixes the problem instead of adding another layer of complexity.",
  },
  {
    title: "Clear, proactive communication",
    description:
      "You always know where things stand, what comes next and why each decision matters.",
  },
  {
    title: "Built for measurable impact",
    description:
      "From architecture to implementation, every decision is made around real business value and long-term usability.",
  },
];

export function WhyWorkWithDaniel() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-[#F6F3EE]
        text-[#071017]
      "
    >
      <WhyBackground />

      <Container
        className="
          relative
          z-10

          border-t
          border-[#071017]/[0.08]

          pt-20
          pb-16

          md:pt-24
          md:pb-20

          xl:pt-28
          xl:pb-20

          2xl:pt-32
          2xl:pb-24
        "
      >
        <div
          className="
            grid
            gap-14

            lg:grid-cols-[0.82fr_1.18fr]
            lg:items-center

            xl:gap-20

            2xl:grid-cols-[0.78fr_1.22fr]
            2xl:gap-24
          "
        >
          {/* ==================================================
              LEFT — PORTRAIT
          ================================================== */}

          <PartnerVisual reduceMotion={Boolean(reduceMotion)} />

          {/* ==================================================
              RIGHT — CONTENT
          ================================================== */}

          <div className="min-w-0">
            {/* EYEBROW */}

            <motion.div
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
                  delay: 0.06,
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
                Why work with Daniel
              </span>
            </motion.div>

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
                amount: 0.5,
              }}
              transition={{
                duration: 0.7,
                delay: 0.05,
                ease,
              }}
              className="
                mt-9

                max-w-[900px]

                text-[43px]
                font-semibold
                leading-[0.96]
                tracking-[-0.06em]

                sm:text-[52px]
                md:text-[58px]
                xl:text-[62px]
                2xl:text-[68px]
              "
            >
              A strategic partner
              <br />
              from idea to{" "}
              <span className="text-[#FF5A1F]">
                impact.
              </span>
            </motion.h2>

            {/* INTRO */}

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
                delay: 0.13,
                ease,
              }}
              className="
                mt-7
                max-w-[780px]

                text-[16px]
                leading-7
                text-[#596773]

                md:text-[18px]
                md:leading-8
              "
            >
              I work directly with a select number of founders and operators to
              turn complex business problems into clear, scalable systems. No
              layers, no handoffs — just sharp thinking, hands-on execution and
              a focus on measurable outcomes.
            </motion.p>

            {/* REASONS */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.25,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: reduceMotion ? 0 : 0.08,
                    staggerChildren: reduceMotion ? 0 : 0.08,
                  },
                },
              }}
              className="
                mt-10

                grid
                gap-x-10
                gap-y-9

                sm:grid-cols-2

                xl:mt-12
                xl:gap-x-14
              "
            >
              {reasons.map((reason) => (
                <Reason
                  key={reason.title}
                  title={reason.title}
                  description={reason.description}
                  reduceMotion={Boolean(reduceMotion)}
                />
              ))}
            </motion.div>

            {/* CTA */}

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
                delay: 0.34,
                ease,
              }}
              className="
                mt-11

                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-center

                xl:mt-12
              "
            >
              {/* PRIMARY */}

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
                <span style={{ color: "#FFFFFF" }}>
                  Let&apos;s Talk
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

              {/* SECONDARY */}

              <a
                href="#process"
                className="
                  group

                  inline-flex
                  h-[52px]

                  items-center
                  justify-center
                  gap-7

                  rounded-full

                  border
                  border-[#071017]/25

                  px-7

                  text-[14px]
                  font-medium

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-[#071017]/45
                  hover:bg-white/40
                "
              >
                <span style={{ color: "#071017" }}>
                  See My Process
                </span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.6}
                  style={{
                    color: "#071017",
                  }}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </a>

              {/* MICRO COPY */}

              <div
                className="
                  mt-2

                  border-l
                  border-[#071017]/15

                  pl-6

                  sm:ml-3
                  sm:mt-0
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    leading-[1.8]
                    tracking-[0.3em]
                    text-[#7A8790]
                  "
                >
                  Less noise.
                  <br />
                  More progress.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
   REASON
============================================================ */

type ReasonProps = {
  title: string;
  description: string;
  reduceMotion: boolean;
};

function Reason({
  title,
  description,
  reduceMotion,
}: ReasonProps) {
  return (
    <motion.article
      variants={{
        hidden: reduceMotion
          ? {}
          : {
              opacity: 0,
              y: 14,
            },

        visible: {
          opacity: 1,
          y: 0,

          transition: {
            duration: 0.52,
            ease,
          },
        },
      }}
      className="group"
    >
      <motion.div
        variants={{
          hidden: reduceMotion
            ? {}
            : {
                scaleX: 0,
              },

          visible: {
            scaleX: 1,

            transition: {
              duration: 0.55,
              ease,
            },
          },
        }}
        style={{
          transformOrigin: "left",
        }}
        className="
          h-px
          w-7

          bg-[#FF5A1F]

          transition-[width]
          duration-300

          group-hover:w-10
        "
      />

      <h3
        className="
          mt-4

          text-[17px]
          font-semibold
          leading-[1.15]
          tracking-[-0.035em]

          text-[#071017]

          md:text-[18px]
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          max-w-[360px]

          text-[13px]
          leading-[1.65]
          text-[#626F79]

          md:text-[14px]
        "
      >
        {description}
      </p>
    </motion.article>
  );
}

/* ============================================================
   PORTRAIT
============================================================ */

type PartnerVisualProps = {
  reduceMotion: boolean;
};

function PartnerVisual({
  reduceMotion,
}: PartnerVisualProps) {
  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
              scale: 0.985,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.8,
        ease,
      }}
      className="
        relative

        mx-auto
        w-full
        max-w-[520px]

        overflow-hidden

        rounded-[22px]

        border
        border-[#071017]/[0.08]

        bg-[#020304]

        shadow-[0_24px_80px_rgba(7,16,23,0.14)]

        lg:mx-0
      "
    >
      <div
        className="
          relative

          aspect-[0.78/1]

          min-h-[520px]

          overflow-hidden
        "
      >
        <Image
          src="/images/about/daniel-portrait-dark.png"
          alt="Daniel VLKO — Software Developer and Automation Architect"
          fill
          sizes="
            (max-width: 1024px) 90vw,
            520px
          "
          className="
            object-cover
            object-[center_30%]

            transition-transform
            duration-[1200ms]
            ease-out

            hover:scale-[1.015]
          "
        />

        {/* DARK BOTTOM DEPTH */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
          "
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.01) 0%,
                transparent 42%,
                rgba(0,0,0,0.10) 67%,
                rgba(0,0,0,0.52) 100%
              )
            `,
          }}
        />

        {/* VIGNETTE */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
          "
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                transparent 42%,
                rgba(0,0,0,0.08) 70%,
                rgba(0,0,0,0.34) 100%
              )
            `,
          }}
        />

        {/* COPY */}

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
            delay: 0.3,
            ease,
          }}
          className="
            absolute

            bottom-8
            left-8
            right-8

            z-10

            sm:bottom-10
            sm:left-10
          "
        >
          <div className="h-px w-8 bg-[#FF5A1F]" />

          <p
            className="
              mt-5

              max-w-[270px]

              text-[16px]
              font-medium
              leading-[1.5]
              tracking-[-0.02em]

              text-white/90

              sm:text-[18px]
            "
          >
            Less noise.
            <br />
            More thinking.
            <br />
            Better systems.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   BACKGROUND
============================================================ */

function WhyBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >
      <div
        className="
          absolute

          left-[-250px]
          top-[15%]

          h-[620px]
          w-[620px]

          rounded-full
          blur-[160px]
        "
        style={{
          background: "rgba(7,16,23,0.018)",
        }}
      />

      <div
        className="
          absolute

          right-[-280px]
          top-[12%]

          h-[720px]
          w-[720px]

          rounded-full
          blur-[180px]
        "
        style={{
          background: "rgba(255,255,255,0.26)",
        }}
      />
    </div>
  );
}