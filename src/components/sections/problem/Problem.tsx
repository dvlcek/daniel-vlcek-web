"use client";

import { motion, useReducedMotion } from "motion/react";

import { AnimatedStat } from "@/components/sections/problem/AnimatedStat";
import { ProblemSignal } from "@/components/sections/problem/ProblemSignal";

const problems = [
  {
    type: "experience" as const,
    title: "Visitors leave",
    description:
      "You pay to bring people to your website. Slow pages and a confusing next step lose them before they enquire.",
  },
  {
    type: "manual" as const,
    title: "Busywork takes over",
    description:
      "Your team copies data, sends reminders and repeats the same tasks. The work grows. Your capacity doesn't.",
  },
  {
    type: "systems" as const,
    title: "Tools don't talk",
    description:
      "Your website, inbox and CRM each hold part of the picture. Your team has to fill the gaps by hand.",
  },
  {
    type: "opportunities" as const,
    title: "Leads go cold",
    description:
      "An enquiry sits in an inbox. A follow-up gets forgotten. By the time you reply, the customer has moved on.",
  },
  {
    type: "visibility" as const,
    title: "Decisions become guesses",
    description:
      "You piece together reports from different tools, yet still can't clearly see which efforts bring customers or where revenue slips away.",
  },
];

const stats = [
  {
    value: 53,
    prefix: "",
    suffix: "%",
    decimals: 0,
    label: "of mobile visits abandoned",
    description: "When a mobile site takes over 3 seconds to load.",
    source: "Google · Mobile speed study, 2016",
    sourceUrl:
      "https://blog.google/products-and-platforms/products/ads/speed-scorecard-impact-calculator/",
  },
  {
    value: 58,
    prefix: "",
    suffix: "%",
    decimals: 0,
    label: "of work time spent coordinating",
    description: "Knowledge workers spend more time organising work than doing skilled work.",
    source: "Asana · Anatomy of Work, 2023",
    sourceUrl:
      "https://asana.com/press/releases/pr/asana-anatomy-of-work-global-index-2023-smart-collaboration-and-clear-goals-integral-to-creating-positive-business-opportunities/5957f2bd-2a85-4ea1-93ed-6c507b478954",
  },
  {
    value: 55,
    prefix: "",
    suffix: "%",
    decimals: 0,
    label: "of customers feel the disconnect",
    description: "They say departments feel separate, rather than like one company.",
    source: "Salesforce · Connected Customer, 2023",
    sourceUrl: "https://www.salesforce.com/news/stories/foundations-announcement/",
  },
];

export function Problem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-[#03070b] text-white"
    >
      {/* =====================================================
          SUBTLE TOP AMBIENT
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[340px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(32,63,78,0.055), transparent 68%)",
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1480px]
          px-5
          pb-[132px]
          pt-24

          sm:px-7

          md:px-10
          md:pb-[145px]
          md:pt-28

          xl:px-12
          xl:pb-[155px]
          xl:pt-[124px]
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 16,
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
          className="mx-auto max-w-[1040px] text-center"
        >
          <h2
            className="
              text-[38px]
              text-balance
              font-normal
              leading-[1.08]
              tracking-[-0.04em]

              sm:text-[46px]

              md:text-[54px]

              xl:text-[60px]
            "
          >
            Your business has moved forward.

            <br className="hidden md:block" />

            <span className="md:hidden"> </span>

            Your systems{" "}
            <span className="text-[var(--accent)]">
              haven&apos;t.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[720px]
              text-[14px]
              leading-[1.7]
              text-white/64

              sm:text-[15px]

              xl:text-[16px]
            "
          >
            A slow website loses enquiries. Manual work eats into your day.
            Disconnected tools make every next step harder than it needs to be.
          </p>
        </motion.div>

        {/* ==================================================
            CARDS
        ================================================== */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.18,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.1,
                staggerChildren: reduceMotion ? 0 : 0.065,
              },
            },
          }}
          className="
            mx-auto
            mt-16
            grid
            max-w-[1360px]
            gap-4

            sm:grid-cols-2

            lg:grid-cols-3

            xl:mt-[72px]
            xl:grid-cols-5
            xl:gap-4
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
                      y: 18,
                    },

                visible: {
                  opacity: 1,
                  y: 0,

                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                    }
              }
              transition={{
                duration: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                group
                relative
                min-h-[250px]
                overflow-hidden
                rounded-[18px]
                border
                border-white/[0.055]
                bg-white/[0.012]
                px-6
                pb-7
                pt-6
                text-center

                transition-[border-color,background-color]
                duration-300

                hover:border-white/[0.09]
                hover:bg-white/[0.018]
              "
            >
              <ProblemSignal type={problem.type} />

              <h3
                className="
                  mt-4
                  text-balance
                  text-[15px]
                  font-medium
                  leading-[1.25]
                  tracking-[-0.025em]
                  text-white/92

                  xl:flex
                  xl:min-h-[40px]
                  xl:items-center
                  xl:justify-center
                  xl:text-[16px]
                "
              >
                {problem.title}
              </h3>

              <p
                className="
                  mt-3
                  text-pretty
                  text-[14px]
                  leading-[1.72]
                  text-white/64
                "
              >
                {problem.description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        {/* ==================================================
            DIVIDER
        ================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scaleX: 0.96,
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
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            mt-[68px]
            h-px
            w-full
            max-w-[1220px]
          "
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.075) 10%, rgba(255,255,255,0.075) 90%, transparent)",
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
                  y: 14,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            mt-8
            max-w-[1220px]

            md:mt-9
          "
        >
          <div
            className="
              grid
              gap-10

              md:grid-cols-3
              md:gap-0
            "
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="
                  relative
                  flex
                  min-h-[178px]
                  flex-col
                  items-center
                  justify-center
                  px-6
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
                      h-[100px]
                      w-px
                      -translate-y-1/2

                      md:block
                    "
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(255,255,255,0.085), transparent)",
                    }}
                  />
                )}

                <p
                  className="
                    text-[50px]
                    font-medium
                    leading-none
                    tracking-[-0.06em]
                    text-white

                    md:text-[54px]

                    xl:text-[58px]
                  "
                >
                  <AnimatedStat
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </p>

                <p
                  className="
                    mt-4
                    text-[12px]
                    font-medium
                    leading-[1.4]
                    tracking-[-0.015em]
                    text-white/72

                    sm:text-[13px]

                    xl:text-[14px]
                  "
                >
                  {stat.label}
                </p>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-[270px]
                    text-[13px]
                    leading-[1.55]
                    text-white/60
                  "
                >
                  {stat.description}
                </p>

                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-3
                    rounded-sm
                    text-[11px]
                    leading-[1.5]
                    text-white/55
                    underline
                    decoration-white/20
                    underline-offset-4
                    transition-colors
                    hover:text-white/80
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-[var(--accent)]
                  "
                >
                  {stat.source}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
