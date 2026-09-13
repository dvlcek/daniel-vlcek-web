"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

export function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="
        relative
        isolate
        bg-[#02070B]
        text-white
      "
    >
      <FinalCTATransition />
      <ClosingBackground />

      <Container
        className="
          relative
          z-10

          py-16

          md:py-[72px]
          xl:py-20
        "
      >
        <div
          className="
            flex
            min-h-[390px]
            items-center

            md:min-h-[420px]
            xl:min-h-[450px]
          "
        >
          <div className="max-w-[720px]">
            {/* EYEBROW */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -10,
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
                duration: 0.5,
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
                  delay: 0.05,
                  ease,
                }}
                style={{
                  transformOrigin: "left",
                }}
                className="
                  h-px
                  w-8
                  bg-[#FF5A1F]
                "
              />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.36em]
                  text-white/45
                "
              >
                A brighter way forward
              </span>
            </motion.div>

            {/* HEADLINE */}

            <motion.h2
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
                amount: 0.5,
              }}
              transition={{
                duration: 0.65,
                delay: 0.05,
                ease,
              }}
              className="
                mt-7

                text-[40px]
                font-medium
                leading-[0.98]
                tracking-[-0.055em]

                sm:text-[48px]
                md:text-[54px]
                xl:text-[58px]
              "
            >
              Same business.
              <br />
              A more efficient{" "}
              <span className="text-[#FF5A1F]">
                future.
              </span>
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
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
                duration: 0.55,
                delay: 0.13,
                ease,
              }}
              className="
                mt-5
                max-w-[560px]

                text-[14px]
                leading-6
                text-white/55

                md:text-[15px]
                md:leading-7
              "
            >
              Build the systems your business needs to move faster, operate
              clearer and scale with less friction.
            </motion.p>

            {/* CTA */}

            <motion.div
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
                delay: 0.22,
                ease,
              }}
              className="
                mt-7

                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
              "
            >
              {/* PRIMARY */}

              <a
                href="mailto:hello@danielvlko.com"
                style={{
                  color: "#FFFFFF",
                }}
                className="
                  group

                  inline-flex
                  h-[48px]

                  items-center
                  justify-center
                  gap-6

                  rounded-full

                  bg-[#FF5A1F]

                  px-6

                  text-[13px]
                  font-medium

                  shadow-[0_10px_28px_rgba(255,90,31,0.18)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#FF6932]
                  hover:shadow-[0_14px_34px_rgba(255,90,31,0.22)]
                "
              >
                <span style={{ color: "#FFFFFF" }}>
                  Let&apos;s Talk
                </span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
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
                href="#work"
                style={{
                  color: "#FFFFFF",
                }}
                className="
                  group

                  inline-flex
                  h-[48px]

                  items-center
                  justify-center
                  gap-5

                  rounded-full

                  border
                  border-white/[0.24]

                  bg-black/[0.08]

                  px-6

                  text-[13px]
                  font-medium

                  backdrop-blur-sm

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-white/[0.42]
                  hover:bg-white/[0.035]
                "
              >
                <span style={{ color: "#FFFFFF" }}>
                  View My Work
                </span>

                <ArrowRight
                  size={14}
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
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
   ABOUT → CTA TRANSITION
============================================================ */

function FinalCTATransition() {
  return (
    <>
      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          inset-x-0
          top-[-40px]

          z-[3]

          h-[54px]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(2,7,11,0) 0%,
              rgba(2,7,11,0.04) 28%,
              rgba(2,7,11,0.18) 58%,
              rgba(2,7,11,0.56) 82%,
              #02070B 100%
            )
          `,
        }}
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          left-[12%]
          right-[12%]
          top-[-28px]

          z-[2]

          h-[32px]

          blur-[24px]
        "
        style={{
          background: "rgba(7,16,23,0.10)",
        }}
      />
    </>
  );
}

/* ============================================================
   BACKGROUND
============================================================ */

function ClosingBackground() {
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
      <div className="absolute inset-0 bg-[#02070B]" />

      {/* EARTH */}

      <motion.div
        initial={{
          scale: 1.02,
        }}
        whileInView={{
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.6,
          ease,
        }}
        className="
          absolute
          inset-0
        "
      >
        <Image
          src="/images/footer/earth.png"
          alt=""
          fill
          sizes="100vw"
          className="
            select-none
            object-cover

            object-[69%_50%]

            sm:object-[66%_50%]
            md:object-[64%_50%]
            lg:object-[61%_50%]
            xl:object-[59%_50%]
          "
        />
      </motion.div>

      {/* LEFT COPY AREA */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(2,7,11,0.93) 0%,
              rgba(2,7,11,0.82) 21%,
              rgba(2,7,11,0.52) 38%,
              rgba(2,7,11,0.16) 56%,
              transparent 72%
            )
          `,
        }}
      />

      {/* TOP DEPTH */}

      <div
        className="
          absolute
          inset-x-0
          top-0

          h-[20%]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.22),
              transparent
            )
          `,
        }}
      />

      {/* BOTTOM FADE TO FOOTER */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0

          h-[30%]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              transparent,
              rgba(2,7,11,0.44)
            )
          `,
        }}
      />

      {/* VIGNETTE */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 60% 45%,
              transparent 52%,
              rgba(0,0,0,0.05) 75%,
              rgba(0,0,0,0.20) 100%
            )
          `,
        }}
      />
    </div>
  );
}