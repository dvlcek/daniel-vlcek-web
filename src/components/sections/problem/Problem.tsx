"use client";

import { motion, useReducedMotion } from "motion/react";

import { AnimatedStat } from "@/components/sections/problem/AnimatedStat";
import { ProblemSignal } from "@/components/sections/problem/ProblemSignal";
import { Container } from "@/components/ui/Container";

const problems = [
  {
    type: "scattered" as const,
    title: "Scattered tools",
    description:
      "Work lives across too many apps, making it harder to see the full picture.",
  },
  {
    type: "manual" as const,
    title: "Manual work",
    description:
      "Repetitive tasks take time away from work that actually moves the business forward.",
  },
  {
    type: "data" as const,
    title: "Disconnected data",
    description:
      "Information is split across tools and teams, creating inconsistent results.",
  },
  {
    type: "decisions" as const,
    title: "Slow decisions",
    description:
      "Without clear visibility, getting the right answer takes longer than it should.",
  },
  {
    type: "potential" as const,
    title: "Lost potential",
    description:
      "Good people spend time working around the system instead of creating impact.",
  },
];

const stats = [
  {
    value: 55,
    suffix: "%",
    decimals: 0,
    description: "find it hard to track down information",
    source: "Atlassian State of Teams 2024",
  },
  {
    value: 50,
    suffix: "%",
    decimals: 0,
    description: "have discovered another team doing the same work",
    source: "Atlassian State of Teams 2024",
  },
  {
    value: 3.6,
    suffix: "h",
    decimals: 1,
    description: "lost per week to unnecessary meetings",
    source: "Asana Anatomy of Work 2023",
  },
];

export function Problem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-[#03070b] text-white"
    >
      {/* ==================================================
          SECTION AMBIENT
      ================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(34,72,92,0.07), transparent 65%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[430px] h-[360px] w-[1100px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,90,31,0.032), transparent 68%)",
          filter: "blur(8px)",
        }}
      />

      <Container className="relative py-20 md:py-24 xl:py-[112px]">
        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
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
            amount: 0.35,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto max-w-[930px] text-center"
        >
          <h2
            className="
              text-[34px]
              font-medium
              leading-[1.04]
              tracking-[-0.05em]

              sm:text-[42px]
              md:text-[48px]
              xl:text-[52px]
            "
          >
            Most businesses don&apos;t lack potential.
            <br className="hidden md:block" />

            <span className="md:hidden"> </span>

            They lack{" "}
            <span className="text-[var(--accent)]">
              connected systems.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[680px]
              text-[14px]
              leading-6
              text-white/38

              sm:text-[15px]
            "
          >
            Scattered tools, manual work and disconnected data create friction,
            slow decisions and quietly limit growth.
          </p>
        </motion.div>

        {/* ==================================================
            PROBLEM CARDS AREA
        ================================================== */}

        <div className="relative mt-14 md:mt-16 xl:mt-[72px]">
          {/* Soft glow underneath cards */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[260px]
              w-[92%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-[100%]
              opacity-70
              blur-[80px]
            "
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.027), transparent 70%)",
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.12,
                  staggerChildren: reduceMotion ? 0 : 0.075,
                },
              },
            }}
            className="
              relative
              grid
              gap-4

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-5
              xl:gap-[14px]
            "
          >
            {problems.map((problem) => (
              <motion.article
                key={problem.title}
                variants={{
                  hidden: reduceMotion
                    ? {}
                    : {
                        opacity: 0,
                        y: 24,
                        scale: 0.985,
                      },

                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,

                    transition: {
                      duration: 0.58,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                }
                className="
                  group
                  relative
                  min-w-0
                  overflow-hidden
                  rounded-[20px]
                  px-5
                  pb-6
                  pt-5
                "
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.012) 42%, rgba(255,255,255,0.005) 100%)",

                  boxShadow:
                    "0 20px 55px rgba(0,0,0,0.32), 0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.045)",
                }}
              >
                {/* Card internal depth */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[20px]
                    ring-1
                    ring-inset
                    ring-white/[0.045]
                    transition-colors
                    duration-300
                    group-hover:ring-white/[0.075]
                  "
                />

                {/* Accent ambient glow */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    -left-10
                    -top-12
                    h-[140px]
                    w-[140px]
                    rounded-full
                    opacity-0
                    blur-[45px]
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                  style={{
                    background: "rgba(255,90,31,0.08)",
                  }}
                />

                {/* Hover accent line */}

                {/* <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-5
                    right-5
                    top-0
                    h-px
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,90,31,0.55), transparent)",
                  }}
                /> */}

                <div className="relative">
                  <ProblemSignal type={problem.type} />

                  <h3
                    className="
                      mt-3
                      text-[15px]
                      font-medium
                      tracking-[-0.025em]
                      text-white/92
                    "
                  >
                    {problem.title}
                  </h3>

                  <p
                    className="
                      mt-2.5
                      text-[12px]
                      leading-[1.7]
                      text-white/36
                    "
                  >
                    {problem.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* ==================================================
            FLOATING DIVIDER
        ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scaleX: 0.92,
                }
          }
          whileInView={{
            opacity: 1,
            scaleX: 1,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            mt-16
            h-px
            w-full
            max-w-[1080px]

            md:mt-[72px]
          "
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.085) 18%, rgba(255,255,255,0.085) 82%, transparent)",
          }}
        />

        {/* ==================================================
            STATS
        ================================================== */}

        <motion.div
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
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mt-10 md:mt-12"
        >
          <div className="grid gap-10 md:grid-cols-3 md:gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.description}
                className="
                  relative
                  flex
                  min-h-[130px]
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                {index > 0 && (
                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      left-0
                      top-1/2
                      hidden
                      h-[82px]
                      w-px
                      -translate-y-1/2

                      md:block
                    "
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(255,255,255,0.09), transparent)",
                    }}
                  />
                )}

                <p
                  className="
                    text-[40px]
                    font-medium
                    leading-none
                    tracking-[-0.055em]
                    text-white

                    lg:text-[44px]
                  "
                >
                  <AnimatedStat
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </p>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-[230px]
                    text-[12px]
                    leading-5
                    text-white/40
                  "
                >
                  {stat.description}
                </p>

                <p className="mt-2 text-[8px] text-white/16">
                  {stat.source}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                }
          }
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
          }}
          className="relative mt-12 md:mt-14"
        >
          <div
            aria-hidden="true"
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.045) 12%, rgba(255,255,255,0.045) 88%, transparent)",
            }}
          />

          <div
            className="
              mt-5
              flex
              flex-col
              gap-2

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
          </div>
        </motion.div>
      </Container>
    </section>
  );
}