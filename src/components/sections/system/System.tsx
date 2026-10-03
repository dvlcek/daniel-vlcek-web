"use client";

import { ArrowRight, BarChart3, Clock3, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

import { motion, useReducedMotion } from "motion/react";

import { SystemDiagram } from "@/components/sections/system/SystemDiagram";
import { Container } from "@/components/ui/Container";

const benefits = [
  {
    icon: Clock3,
    label: "Faster replies",
  },
  {
    icon: Zap,
    label: "Less manual work",
  },
  {
    icon: BarChart3,
    label: "Clearer decisions",
  },
  {
    icon: TrendingUp,
    label: "Room to grow",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function System() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="system"
      className="
        relative
        overflow-hidden
        bg-[#F6F3EE]
        text-[#071017]
      "
    >
      {/* ======================================================
          DARK → LIGHT TRANSITION

          Nie centered chapter marker.
          Len clean curved seam.
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[105px]
          overflow-hidden

          md:h-[125px]
        "
      >
        {/* DARK CURVE */}
        <div
          className="
            absolute
            left-1/2
            top-[-178px]
            h-[255px]
            w-[125%]
            -translate-x-1/2
            rounded-[50%]
            bg-[#03070b]

            md:top-[-190px]
            md:h-[280px]
          "
        />

        {/* TINY ORANGE ATMOSPHERIC EDGE */}
        <div
          className="
            absolute
            left-1/2
            top-[69px]
            h-px
            w-[62%]
            -translate-x-1/2
            opacity-50

            md:top-[83px]
          "
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,90,31,0.32), transparent)",
          }}
        />

        {/* SOFT LIGHT BELOW */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[45px]
            blur-2xl
          "
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.9), transparent 70%)",
          }}
        />
      </div>

      {/* ======================================================
          VERY SUBTLE AMBIENT BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 77% 46%,
              rgba(255, 90, 31, 0.025),
              transparent 32%
            )
          `,
        }}
      />

      <Container
        className="
          relative
          pb-20
          pt-[145px]

          md:pb-24
          md:pt-[165px]

          xl:pb-24
          xl:pt-[160px]
        "
      >
        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div
          className="
            grid
            gap-16

            xl:grid-cols-[minmax(400px,0.82fr)_minmax(0,1.18fr)]
            xl:items-center
            xl:gap-14

            2xl:grid-cols-[minmax(450px,0.86fr)_minmax(0,1.14fr)]
            2xl:gap-20
          "
        >
          {/* ==================================================
              LEFT
          ================================================== */}

          <motion.div
            initial={false}
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
              ease,
            }}
            className="max-w-[620px]"
          >
            {/* HEADLINE */}
            <h2
              className="
                text-[38px]
                text-balance
                font-normal
                leading-[1.06]
                tracking-[-0.04em]

                sm:text-[50px]
                md:text-[56px]

                xl:text-[54px]

                2xl:text-[62px]
              "
            >
              One connected system.
              <br />
              <span className="text-[#C2410C]">More room to grow.</span>
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-7
                max-w-[560px]
                text-[16px]
                leading-7
                text-[#52616D]

                md:text-[17px]
              "
            >
              I connect your website, CRM and everyday tools so enquiries reach
              the right person, routine tasks run automatically and you can see
              what&apos;s working.
            </p>

            {/* ==================================================
                BENEFITS
            ================================================== */}

            <motion.div
              initial={false}
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.45,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.07,
                  },
                },
              }}
              className="
                mt-9
                grid
                grid-cols-2
                gap-x-4
                gap-y-2

                sm:grid-cols-4
                sm:gap-x-0
              "
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={benefit.label}
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
                          duration: 0.45,
                          ease,
                        },
                      },
                    }}
                    className={[
                      "py-3",
                      index > 0
                        ? "sm:border-l sm:border-[#101D26]/10 sm:pl-6"
                        : "",
                    ].join(" ")}
                  >
                    <Icon
                      aria-hidden="true"
                      size={23}
                      strokeWidth={1.65}
                      className="text-[#071017]"
                    />

                    <p className="mt-3 max-w-[104px] text-[13px] leading-[1.45] text-[#182630]">
                      {benefit.label}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ==================================================
                CTA
            ================================================== */}

            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="
    group
    inline-flex
    h-[50px]
    items-center
    justify-center
    gap-6
    rounded-full
    bg-[#071017]
    px-7
    text-[13px]
    font-medium
    text-[#FFFFFF]
    shadow-[0_10px_30px_rgba(7,16,23,0.10)]
    transition-[transform,background-color,box-shadow]
    duration-200
    [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5
    hover:bg-[#111D25]
    active:scale-[0.98]
    motion-reduce:transform-none
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-[#C2410C]
  "
              >
                <span className="text-[#FFFFFF]">Book a strategy call</span>

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="text-[#FFFFFF] transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </Link>

              <a
                href="#work"
                className="
                  group
                  inline-flex
                  items-center
                  min-h-11
                  justify-center
                  sm:justify-start
                  gap-3
                  text-[13px]
                  font-medium
                  text-[#17242E]
                  rounded-sm
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#C2410C]
                "
              >
                <span className="border-b border-[#17242E]/35 pb-[2px]">
                  See it in action
                </span>

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </a>
            </div>
            <p className="mt-4 max-w-[420px] text-[12px] leading-[1.6] text-[#52616D]">
              We&apos;ll map the bottlenecks and the most useful next step for your business.
            </p>
          </motion.div>

          {/* ==================================================
              RIGHT — DIAGRAM
          ================================================== */}

          <div className="min-w-0">
            <SystemDiagram />
          </div>
        </div>
      </Container>
    </section>
  );
}
