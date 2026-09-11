"use client";

import {
  ArrowRight,
  BarChart3,
  Clock3,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import { SystemDiagram } from "@/components/sections/system/SystemDiagram";
import { Container } from "@/components/ui/Container";

const benefits = [
  {
    icon: Clock3,
    label: "Less friction",
  },
  {
    icon: BarChart3,
    label: "More clarity",
  },
  {
    icon: Zap,
    label: "Faster decisions",
  },
  {
    icon: TrendingUp,
    label: "More opportunity",
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
              ease,
            }}
            className="max-w-[620px]"
          >

            {/* HEADLINE */}
            <h2
              className="
                mt-10
                text-[42px]
                font-semibold
                leading-[0.99]
                tracking-[-0.06em]

                sm:text-[50px]
                md:text-[56px]

                xl:text-[54px]

                2xl:text-[62px]
              "
            >
              Growth works
              <br />
              better when
              <br />

              <span className="text-[#FF5A1F]">
                the system is connected.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-7
                max-w-[560px]
                text-[16px]
                leading-7
                text-[#63717D]

                md:text-[17px]
              "
            >
              Bring customer experience, operations and data into one
              coordinated flow, so the business can move forward with clarity.
            </p>

            {/* ==================================================
                BENEFITS
            ================================================== */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.45,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion
                      ? 0
                      : 0.07,
                  },
                },
              }}
              className="
                mt-9
                grid
                grid-cols-2

                sm:grid-cols-4
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
                      size={23}
                      strokeWidth={1.65}
                      className="text-[#071017]"
                    />

                    <p className="mt-3 max-w-[90px] text-[13px] leading-[1.35] text-[#182630]">
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
              <a
                href="#work"
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
                  text-white
                  shadow-[0_10px_30px_rgba(7,16,23,0.10)]
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#111D25]
                "
              >
                <span>See what&apos;s possible</span>

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <a
                href="#services"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  text-[13px]
                  font-medium
                  text-[#17242E]
                "
              >
                <span className="border-b border-[#17242E]/35 pb-[2px]">
                  Explore solutions
                </span>

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>
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