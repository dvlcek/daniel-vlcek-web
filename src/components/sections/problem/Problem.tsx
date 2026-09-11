"use client";

import {
  motion,
  useReducedMotion,
} from "motion/react";

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
      {/* AMBIENT CONTINUATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[260px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(34,72,92,0.055), transparent 66%)",
        }}
      />

      <Container className="relative py-14 md:py-16 xl:py-[72px]">
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
            amount: 0.15,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.085]
            bg-white/[0.008]
            px-5
            py-10

            sm:px-8

            md:px-10
            md:py-12

            xl:px-12
            xl:py-12
          "
        >
          {/* TOP LIGHT */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[180px] w-[700px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(255,255,255,0.025), transparent 68%)",
            }}
          />

          {/* ==================================================
              HEADER
          ================================================== */}

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
              amount: 0.5,
            }}
            transition={{
              delay: 0.08,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto max-w-[930px] text-center"
          >
            {/* <div className="mx-auto inline-flex h-[30px] items-center justify-center rounded-full border border-white/[0.10] px-4">
              <span className="text-[9px] font-medium text-white/50">
                The Problem
              </span>
            </div> */}

            <h2
              className="
                mt-7
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

              <span className="md:hidden">
                {" "}
              </span>

              They lack{" "}
              <span className="text-[var(--accent)]">
                connected systems.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[680px] text-[14px] leading-6 text-white/38 sm:text-[15px]">
              Scattered tools, manual work and disconnected data create
              friction, slow decisions and quietly limit growth.
            </p>
          </motion.div>

          {/* ==================================================
              PROBLEM CARDS
          ================================================== */}

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
                  delayChildren: 0.14,
                  staggerChildren: reduceMotion
                    ? 0
                    : 0.075,
                },
              },
            }}
            className="
              relative
              mt-10
              grid
              gap-3

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-5
              xl:gap-4
            "
          >
            {problems.map((problem, index) => (
              <motion.article
                key={problem.title}
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
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="
                  group
                  relative
                  min-w-0
                  rounded-[18px]
                  border
                  border-white/[0.075]
                  bg-white/[0.008]
                  px-5
                  pb-6
                  pt-4

                  transition-[transform,border-color,background-color]
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-white/[0.13]
                  hover:bg-white/[0.014]
                "
              >
                <ProblemSignal type={problem.type} />

                <h3 className="mt-2 text-[15px] font-medium tracking-[-0.025em] text-white/90">
                  {problem.title}
                </h3>

                <p className="mt-2 text-[12px] leading-5 text-white/34">
                  {problem.description}
                </p>

                {/* Tiny visual link between cards on desktop */}
                {index < problems.length - 1 && (
                  <motion.div
                    aria-hidden="true"
                    initial={
                      reduceMotion
                        ? false
                        : {
                            scaleX: 0,
                            opacity: 0,
                          }
                    }
                    whileInView={{
                      scaleX: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.075,
                    }}
                    style={{
                      transformOrigin: "left",
                    }}
                    className="
                      absolute
                      -right-[17px]
                      top-[59px]
                      z-10
                      hidden
                      h-px
                      w-[17px]
                      bg-white/[0.07]

                      xl:block
                    "
                  />
                )}
              </motion.article>
            ))}
          </motion.div>

          {/* ==================================================
              STATS
          ================================================== */}

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
              amount: 0.6,
            }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mt-10 border-t border-white/[0.07] pt-8"
          >
            <div className="grid gap-8 md:grid-cols-3 md:gap-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.description}
                  className={[
                    "text-center",
                    index > 0
                      ? "md:border-l md:border-white/[0.07]"
                      : "",
                  ].join(" ")}
                >
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

                  <p className="mx-auto mt-3 max-w-[230px] text-[12px] leading-5 text-white/40">
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
              duration: 0.65,
              delay: 0.2,
            }}
            className="
              relative
              mt-8
              flex
              flex-col
              gap-2
              border-t
              border-white/[0.045]
              pt-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span className="text-[7px] font-semibold uppercase tracking-[0.40em] text-white/15">
              From chaos to clarity
            </span>

            <span className="text-[7px] font-semibold uppercase tracking-[0.40em] text-white/15">
              Systems for a brighter tomorrow
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}