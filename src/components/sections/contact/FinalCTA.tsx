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
      aria-labelledby="closing-heading"
      className="
        relative
        isolate
        bg-[#02070B]
        text-white
      "
    >
      <FinalCTATransition />
      <ClosingBackground reduceMotion={Boolean(reduceMotion)} />

      <Container
        className="relative z-10 section-space"
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
                className="eyebrow text-white/65"
              >
                Your next step
              </span>
            </motion.div>

            {/* HEADLINE */}

            <motion.h2
              id="closing-heading"
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
              className="section-heading intro-gap"
            >
              Let&apos;s make your
              <br />
              business work{" "}
              <span className="text-[#FF5A1F]">
                better.
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
              className="section-copy intro-gap max-w-[560px] text-white/70"
            >
              Tell me what you want to improve, automate or build. We&apos;ll
              discuss the priorities and the most useful next step.
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
                action-gap

                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
              "
            >
              {/* PRIMARY */}

              <a
                href="/contact" data-contact-source="final-cta"
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

                  bg-[#FF5A1F]


                  button-text

                  shadow-[0_10px_28px_rgba(255,90,31,0.18)]


                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#FF8054]
                  hover:bg-[#FF6932]
                  hover:shadow-[0_14px_34px_rgba(255,90,31,0.22)]
                "
              >
                <span style={{ color: "#FFFFFF" }}>
                  Discuss your project
                </span>

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  strokeWidth={1.7}
                  style={{
                    color: "#FFFFFF",
                  }}
                  className="button-arrow"
                />
              </a>

              <a
                href="mailto:hello@danielvlko.com"
                className="inline-flex min-h-11 items-center justify-center px-3 text-[14px] text-white/70 underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054] sm:justify-start"
              >
                hello@danielvlko.com
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

function ClosingBackground({ reduceMotion }: { reduceMotion: boolean }) {
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
        initial={reduceMotion ? false : { scale: 1.02 }}
        whileInView={{
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: reduceMotion ? 0 : 1.2,
          ease,
        }}
        className="
          absolute
          inset-0
        "
      >
        <Image
          src="/images/hero/pp.jpg"
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
              #02070B
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
