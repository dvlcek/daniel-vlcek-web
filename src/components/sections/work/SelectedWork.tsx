"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  ArrowRight,
  Check,
} from "lucide-react";

import {
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import { Container } from "@/components/ui/Container";

import {
  featuredCaseStudy,
  secondaryCaseStudies,
  selectedWorkIntroStats,
  type AnimatedMetric as AnimatedMetricType,
} from "./selectedWork.data";

const ease = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   SECTION
============================================================ */

export function SelectedWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="work"
      className="
        relative
        isolate
        overflow-hidden
        bg-[#050D13]
        text-white
      "
    >
      <SelectedWorkBackground />

      <Container
        className="
          relative
          z-10

          py-20
          md:py-24
          xl:py-28
          2xl:py-32
        "
      >
        <div
          className="
            grid
            gap-14

            xl:grid-cols-[360px_minmax(0,1fr)]
            xl:items-start
            xl:gap-14

            2xl:grid-cols-[395px_minmax(0,1fr)]
            2xl:gap-16
          "
        >
          {/* ==================================================
              INTRO
          ================================================== */}

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 22,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.28,
            }}
            transition={{
              duration: 0.7,
              ease,
            }}
            className="xl:sticky xl:top-24"
          >
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
                  duration: 0.6,
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
                  text-[#8798A4]
                "
              >
                Selected Work
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
              }}
              transition={{
                duration: 0.68,
                delay: 0.08,
                ease,
              }}
              className="
                mt-9

                text-[44px]
                font-semibold
                leading-[0.96]
                tracking-[-0.06em]

                sm:text-[52px]
                xl:text-[57px]
                2xl:text-[62px]
              "
            >
              Systems that
              <br />

              <span className="text-white">
                make the business
              </span>

              <br />

              <span className="text-[#FF5A1F]">
                move faster.
              </span>
            </motion.h2>

            {/* COPY */}

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
                delay: 0.16,
                ease,
              }}
              className="
                mt-7
                max-w-[350px]

                text-[15px]
                leading-7
                text-[#93A3AE]

                md:text-[16px]
              "
            >
              Selected systems built to remove manual work, connect operations
              and create infrastructure that becomes more valuable as the
              business grows.
            </motion.p>

            {/* ==================================================
                ANIMATED METRICS
            ================================================== */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.7,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren:
                      reduceMotion ? 0 : 0.09,
                  },
                },
              }}
              className="
                mt-9

                grid
                grid-cols-3

                border-t
                border-white/[0.09]

                pt-6
              "
            >
              {selectedWorkIntroStats.map(
                (metric, index) => (
                  <motion.div
                    key={metric.label}
                    variants={{
                      hidden: reduceMotion
                        ? {}
                        : {
                            opacity: 0,
                            y: 10,
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
                    className={[
                      "min-w-0",

                      index > 0
                        ? "border-l border-white/[0.09] pl-4"
                        : "pr-4",
                    ].join(" ")}
                  >
                    <div
                      className="
                        text-[22px]
                        font-semibold
                        leading-none
                        tracking-[-0.05em]
                        text-white

                        2xl:text-[25px]
                      "
                    >
                      <AnimatedNumber
                        metric={metric}
                      />
                    </div>

                    <p
                      className="
                        mt-2.5

                        max-w-[95px]

                        text-[10px]
                        leading-[1.45]
                        text-[#71848F]

                        2xl:text-[11px]
                      "
                    >
                      {metric.label}
                    </p>
                  </motion.div>
                ),
              )}
            </motion.div>

            {/* CTA */}

            <motion.a
              href="#case-studies"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
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
                duration: 0.5,
                delay: 0.34,
                ease,
              }}
              className="
                group

                mt-9

                inline-flex
                items-center
                gap-4

                text-[13px]
                font-medium
                text-white
              "
            >
              <span
                className="
                  inline-flex

                  h-[42px]
                  w-[42px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.14]

                  bg-white/[0.025]

                  transition-all
                  duration-300

                  group-hover:border-white/[0.28]
                  group-hover:bg-white/[0.06]
                "
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.6}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-0.5
                  "
                />
              </span>

              <span
                className="
                  border-b
                  border-white/[0.20]

                  pb-[2px]

                  transition-colors
                  duration-300

                  group-hover:border-white/50
                "
              >
                Explore selected work
              </span>
            </motion.a>
          </motion.div>

          {/* ==================================================
              PROJECTS
          ================================================== */}

          <motion.div
            id="case-studies"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            variants={{
              hidden: {},

              visible: {
                transition: {
                  staggerChildren:
                    reduceMotion ? 0 : 0.11,
                },
              },
            }}
            className="grid gap-4"
          >
            <FeaturedCaseStudy />

            <div
              className="
                grid
                gap-4

                lg:grid-cols-[1.05fr_0.95fr]
              "
            >
              <AICaseStudy />

              <ClientPlatformCaseStudy />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
   ANIMATED NUMBER
============================================================ */

type AnimatedNumberProps = {
  metric: AnimatedMetricType;
};

function AnimatedNumber({
  metric,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.8,
  });

  const reduceMotion = useReducedMotion();

  const [value, setValue] = useState(() => {
    if (reduceMotion) {
      return metric.value;
    }

    if (metric.direction === "down") {
      return (
        metric.from ??
        Math.max(
          metric.value + 5,
          metric.value * 1.5,
        )
      );
    }

    return metric.from ?? 0;
  });

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (reduceMotion) {
      setValue(metric.value);
      return;
    }

    const startValue =
      metric.direction === "down"
        ? metric.from ??
          Math.max(
            metric.value + 5,
            metric.value * 1.5,
          )
        : metric.from ?? 0;

    const endValue = metric.value;

    const duration =
      metric.direction === "down"
        ? 900
        : 1050;

    const startTime = performance.now();

    let frame = 0;

    const update = (now: number) => {
      const elapsed = now - startTime;

      const progress = Math.min(
        elapsed / duration,
        1,
      );

      /*
       * easeOutCubic:
       * fast beginning, slow landing.
       * Looks more premium than linear count.
       */
      const eased =
        1 - Math.pow(1 - progress, 3);

      const nextValue =
        startValue +
        (endValue - startValue) * eased;

      setValue(nextValue);

      if (progress < 1) {
        frame =
          requestAnimationFrame(update);
      }
    };

    frame =
      requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [
    inView,
    metric.direction,
    metric.from,
    metric.value,
    reduceMotion,
  ]);

  const decimals =
    metric.decimals ?? 0;

  return (
    <span ref={ref}>
      {metric.prefix ?? ""}

      {value.toFixed(decimals)}

      {metric.suffix ?? ""}
    </span>
  );
}

/* ============================================================
   FEATURED CASE STUDY
============================================================ */

function FeaturedCaseStudy() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id="business-platform"
      variants={{
        hidden: reduceMotion
          ? {}
          : {
              opacity: 0,
              y: 24,
              scale: 0.988,
            },

        visible: {
          opacity: 1,
          y: 0,
          scale: 1,

          transition: {
            duration: 0.7,
            ease,
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
      className="
        group
        relative

        overflow-hidden

        rounded-[20px]

        border
        border-white/[0.09]

        bg-[#08141D]/96

        p-5

        shadow-[0_20px_60px_rgba(0,0,0,0.18)]

        transition-colors
        duration-300

        hover:border-white/[0.15]

        md:p-6
        2xl:p-7
      "
    >
      {/* subtle highlight */}

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
              circle at 96% 6%,
              rgba(255,90,31,0.045),
              transparent 32%
            )
          `,
        }}
      />

      <div
        className="
          relative

          grid
          gap-7

          lg:grid-cols-[285px_minmax(0,1fr)]

          2xl:grid-cols-[320px_minmax(0,1fr)]
        "
      >
        {/* COPY */}

        <div className="flex flex-col">
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#FF7846]
            "
          >
            {featuredCaseStudy.eyebrow}
          </p>

          <h3
            className="
              mt-4

              text-[29px]
              font-semibold
              leading-none
              tracking-[-0.045em]
              text-white

              2xl:text-[32px]
            "
          >
            {featuredCaseStudy.title}
          </h3>

          <p
            className="
              mt-4

              text-[14px]
              leading-6
              text-[#CBD4D9]
            "
          >
            {featuredCaseStudy.subtitle}
          </p>

          <p
            className="
              mt-5

              text-[12px]
              leading-[1.75]
              text-[#8496A1]

              2xl:text-[13px]
            "
          >
            {featuredCaseStudy.description}
          </p>

          {/* OUTCOME LABELS */}

          <div
            className="
              mt-6

              grid
              grid-cols-3

              border-t
              border-white/[0.08]

              pt-5
            "
          >
            {featuredCaseStudy.metrics?.map(
              (metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 8,
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
                    duration: 0.45,
                    delay:
                      0.2 + index * 0.07,
                    ease,
                  }}
                  className={
                    index > 0
                      ? "border-l border-white/[0.08] pl-3"
                      : "pr-3"
                  }
                >
                  <div
                    className="
                      text-[14px]
                      font-semibold
                      tracking-[-0.03em]
                      text-white
                    "
                  >
                    {metric.value}
                  </div>

                  <p
                    className="
                      mt-1.5

                      text-[9px]
                      leading-[1.45]
                      text-[#748691]
                    "
                  >
                    {metric.label}
                  </p>

                  {metric.detail && (
                    <p
                      className="
                        mt-1.5

                        text-[9px]
                        font-medium
                        text-[#61C78A]
                      "
                    >
                      {metric.detail}
                    </p>
                  )}
                </motion.div>
              ),
            )}
          </div>

          {/* CTA */}

          <div className="mt-auto pt-6">
            <a
              href={featuredCaseStudy.href}
              className="
                group/button

                inline-flex

                h-[43px]

                items-center
                gap-4

                rounded-full

                bg-[#FF5A1F]

                px-5

                text-[12px]
                font-medium
                text-white

                shadow-[0_8px_24px_rgba(255,90,31,0.16)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#FF6932]
              "
            >
              View case study

              <ArrowRight
                size={14}
                className="
                  transition-transform
                  duration-300

                  group-hover/button:translate-x-1
                "
              />
            </a>
          </div>
        </div>

        {/* SCREENSHOT */}

        <div
          className="
            relative

            min-h-[305px]

            overflow-hidden

            rounded-[14px]

            border
            border-white/[0.085]

            bg-[#050D13]
          "
        >
          <Image
            src={featuredCaseStudy.image}
            alt={featuredCaseStudy.imageAlt}
            fill
            sizes="
              (max-width: 1024px) 100vw,
              720px
            "
            className="
              object-cover

              transition-transform
              duration-[900ms]
              ease-out

              group-hover:scale-[1.018]
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0

              bg-gradient-to-tr
              from-black/[0.05]
              via-transparent
              to-white/[0.018]
            "
          />
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   AI OPERATIONS SYSTEM
============================================================ */

function AICaseStudy() {
  const item = secondaryCaseStudies[0];
  const reduceMotion = useReducedMotion();

  if (!item) {
    return null;
  }

  return (
    <motion.article
      id="ai-operations"
      variants={{
        hidden: reduceMotion
          ? {}
          : {
              opacity: 0,
              y: 20,
            },

        visible: {
          opacity: 1,
          y: 0,

          transition: {
            duration: 0.62,
            ease,
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
      className="
        group

        overflow-hidden

        rounded-[18px]

        border
        border-[#D8DEDF]

        bg-[#F6F3EE]

        p-5

        text-[#071017]

        shadow-[0_14px_45px_rgba(0,0,0,0.12)]

        transition-shadow
        duration-300

        hover:shadow-[0_22px_60px_rgba(0,0,0,0.16)]

        2xl:p-6
      "
    >
      <p
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.27em]
          text-[#74848F]
        "
      >
        {item.eyebrow}
      </p>

      <div
        className="
          mt-4

          grid
          gap-5

          md:grid-cols-[0.9fr_1.1fr]
        "
      >
        {/* COPY */}

        <div>
          <h3
            className="
              text-[23px]
              font-semibold
              leading-none
              tracking-[-0.045em]

              2xl:text-[25px]
            "
          >
            {item.title}
          </h3>

          <p
            className="
              mt-3

              text-[12px]
              leading-6
              text-[#586771]

              2xl:text-[13px]
            "
          >
            {item.subtitle}
          </p>

          {/* BENEFITS */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            variants={{
              hidden: {},

              visible: {
                transition: {
                  staggerChildren:
                    reduceMotion
                      ? 0
                      : 0.065,
                },
              },
            }}
            className="mt-5 space-y-2.5"
          >
            {item.bullets?.map((bullet) => (
              <motion.div
                key={bullet}
                variants={{
                  hidden: reduceMotion
                    ? {}
                    : {
                        opacity: 0,
                        x: -7,
                      },

                  visible: {
                    opacity: 1,
                    x: 0,

                    transition: {
                      duration: 0.4,
                      ease,
                    },
                  },
                }}
                className="
                  flex
                  items-start
                  gap-2.5

                  text-[10px]
                  leading-5
                  text-[#45535C]

                  2xl:text-[11px]
                "
              >
                <span
                  className="
                    mt-[2px]

                    flex
                    h-[16px]
                    w-[16px]
                    shrink-0

                    items-center
                    justify-center

                    rounded-full

                    bg-[#FF5A1F]

                    text-white
                  "
                >
                  <Check
                    size={9}
                    strokeWidth={2.2}
                  />
                </span>

                {bullet}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* IMAGE */}

        <div
          className="
            relative

            min-h-[190px]

            overflow-hidden

            rounded-[13px]

            border
            border-[#DEE3E5]

            bg-white
          "
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="
              (max-width: 768px) 100vw,
              430px
            "
            className="
              object-cover

              transition-transform
              duration-[850ms]
              ease-out

              group-hover:scale-[1.02]
            "
          />
        </div>
      </div>

      {/* CTA */}

      <a
        href={item.href}
        className="
          group/link

          mt-6

          inline-flex
          items-center
          gap-4

          text-[12px]
          font-medium
          text-[#071017]
        "
      >
        <span
          className="
            border-b
            border-[#071017]/25

            pb-[2px]
          "
        >
          View case study
        </span>

        <ArrowRight
          size={14}
          className="
            transition-transform
            duration-300

            group-hover/link:translate-x-1
          "
        />
      </a>
    </motion.article>
  );
}

/* ============================================================
   CLIENT PLATFORM
============================================================ */

function ClientPlatformCaseStudy() {
  const item = secondaryCaseStudies[1];
  const reduceMotion = useReducedMotion();

  if (!item) {
    return null;
  }

  return (
    <motion.article
      id="client-platform"
      variants={{
        hidden: reduceMotion
          ? {}
          : {
              opacity: 0,
              y: 20,
            },

        visible: {
          opacity: 1,
          y: 0,

          transition: {
            duration: 0.62,
            ease,
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
      className="
        group

        flex
        flex-col

        overflow-hidden

        rounded-[18px]

        border
        border-white/[0.09]

        bg-[#08141D]/95

        p-5

        shadow-[0_14px_45px_rgba(0,0,0,0.16)]

        transition-colors
        duration-300

        hover:border-white/[0.15]

        2xl:p-6
      "
    >
      <p
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.27em]
          text-[#8FA0AB]
        "
      >
        {item.eyebrow}
      </p>

      <h3
        className="
          mt-4

          text-[23px]
          font-semibold
          leading-none
          tracking-[-0.045em]
          text-white

          2xl:text-[25px]
        "
      >
        {item.title}
      </h3>

      <p
        className="
          mt-3

          text-[12px]
          leading-6
          text-[#BEC9CF]
        "
      >
        {item.subtitle}
      </p>

      {/* IMAGE */}

      <div
        className="
          relative

          mt-5

          aspect-[1.35/1]

          overflow-hidden

          rounded-[13px]

          border
          border-white/[0.08]

          bg-[#050D13]
        "
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="
            (max-width: 1024px) 100vw,
            400px
          "
          className="
            object-cover

            transition-transform
            duration-[850ms]
            ease-out

            group-hover:scale-[1.02]
          "
        />
      </div>

      {/* CTA */}

      <a
        href={item.href}
        className="
          group/link

          mt-auto
          pt-6

          inline-flex
          items-center
          gap-4

          text-[12px]
          font-medium
          text-white
        "
      >
        <span
          className="
            border-b
            border-white/20

            pb-[2px]
          "
        >
          View case study
        </span>

        <ArrowRight
          size={14}
          className="
            transition-transform
            duration-300

            group-hover/link:translate-x-1
          "
        />
      </a>
    </motion.article>
  );
}

/* ============================================================
   BACKGROUND

   Intentionally restrained.
   Hero owns the big cinematic moment.
============================================================ */

function SelectedWorkBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none

        absolute
        inset-0
        z-0

        overflow-hidden
      "
    >
      {/* BASE */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              #08141D 0%,
              #061018 42%,
              #040B10 100%
            )
          `,
        }}
      />

      {/* NATURAL TOP DEPTH */}

      <div
        className="
          absolute
          inset-x-0
          top-0

          h-[52px]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.16),
              rgba(0,0,0,0.045) 42%,
              transparent 100%
            )
          `,
        }}
      />

      {/* COOL LEFT ATMOSPHERE */}

      <div
        className="
          absolute

          left-[-260px]
          top-[40px]

          h-[720px]
          w-[720px]

          rounded-full

          blur-[155px]
        "
        style={{
          background:
            "rgba(43,91,122,0.08)",
        }}
      />

      {/* WARM FEATURED ATMOSPHERE */}

      <div
        className="
          absolute

          right-[-260px]
          top-[-100px]

          h-[660px]
          w-[660px]

          rounded-full

          blur-[165px]
        "
        style={{
          background:
            "rgba(255,90,31,0.06)",
        }}
      />

      {/* ONE SUBTLE ORBIT */}

      <div
        className="
          absolute

          right-[-410px]
          top-[-320px]

          h-[780px]
          w-[780px]

          rounded-full
        "
        style={{
          border:
            "1px solid rgba(255,90,31,0.075)",
        }}
      />

      {/* LOWER DEPTH */}

      <div
        className="
          absolute

          bottom-[-430px]
          left-[12%]

          h-[720px]
          w-[920px]

          rounded-full

          blur-[190px]
        "
        style={{
          background:
            "rgba(28,61,82,0.05)",
        }}
      />

      {/* VIGNETTE */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 52% 40%,
              transparent 49%,
              rgba(0,0,0,0.08) 75%,
              rgba(0,0,0,0.24) 100%
            )
          `,
        }}
      />
    </div>
  );
}