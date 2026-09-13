"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  Search,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import { CalBooking } from "@/components/contact/CalBooking";
import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

const callPoints = [
  {
    icon: Search,
    title: "Prepared in advance",
    description:
      "I review your company and the context you provide before we speak.",
  },
  {
    icon: Clock3,
    title: "30 focused minutes",
    description:
      "We focus on the real bottlenecks, opportunities and next steps.",
  },
  {
    icon: CalendarDays,
    title: "Free & no obligation",
    description:
      "A useful first conversation whether we work together or not.",
  },
];

export function ContactPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="
        relative
        min-h-[100dvh]
        overflow-hidden
        bg-[#020609]
        text-white
      "
    >
      <ContactBackground />

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          relative
          z-30

          border-b
          border-white/[0.07]

          bg-[#020609]/60

          backdrop-blur-xl
        "
      >
        <Container>
          <div
            className="
              flex
              h-[68px]
              items-center
              justify-between
            "
          >
            <Link
              href="/"
              style={{
                color: "#FFFFFF",
              }}
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]

                transition-opacity
                duration-200

                hover:opacity-65
              "
            >
              Daniel VLKO
            </Link>

            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.58)",
              }}
              className="
                group

                inline-flex
                items-center
                gap-2.5

                text-[11px]
                font-medium

                transition-colors
                duration-200

                hover:!text-white
              "
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.6}
                className="
                  transition-transform
                  duration-200

                  group-hover:-translate-x-1
                "
              />

              Back to website
            </Link>
          </div>
        </Container>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <Container
        className="
          relative
          z-10

          pb-10
          pt-12

          md:pb-12
          md:pt-14

          xl:pb-14
          xl:pt-16
        "
      >
        {/* ====================================================
            INTRO
        ==================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 16,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease,
          }}
          className="
            mx-auto
            max-w-[820px]
            text-center
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <span
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
                tracking-[0.38em]
                text-white/42
              "
            >
              Free Discovery Call
            </span>
          </div>

          <h1
            className="
              mt-6

              text-[40px]
              font-medium
              leading-[0.98]
              tracking-[-0.055em]

              sm:text-[49px]
              md:text-[56px]
              xl:text-[60px]
            "
          >
            Let&apos;s find what&apos;s slowing
            <br />

            the business{" "}
            <span className="text-[#FF5A1F]">
              down.
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-[620px]

              text-[13px]
              leading-6
              text-white/48

              md:text-[14px]
              md:leading-7
            "
          >
            Book a free 30-minute discovery call. I&apos;ll review your company
            and the context you share before we speak, so we can focus on the
            real bottlenecks, opportunities and next steps.
          </p>
        </motion.div>

        {/* ====================================================
            MICRO VALUE
        ==================================================== */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: reduceMotion ? 0 : 0.14,
                staggerChildren: reduceMotion ? 0 : 0.07,
              },
            },
          }}
          className="
            mx-auto
            mt-8

            grid
            max-w-[820px]
            gap-3

            md:grid-cols-3
          "
        >
          {callPoints.map((point) => {
            const Icon = point.icon;

            return (
              <motion.div
                key={point.title}
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
                className="
                  flex
                  items-start
                  gap-3

                  rounded-[12px]

                  border
                  border-white/[0.07]

                  bg-white/[0.018]

                  px-4
                  py-3.5
                "
              >
                <Icon
                  size={16}
                  strokeWidth={1.55}
                  className="
                    mt-[2px]
                    shrink-0
                    text-[#FF7540]
                  "
                />

                <div>
                  <p
                    className="
                      text-[11px]
                      font-medium
                      text-white/82
                    "
                  >
                    {point.title}
                  </p>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      leading-[1.55]
                      text-white/32
                    "
                  >
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ====================================================
            BOOKING CARD
        ==================================================== */}

        <motion.section
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.68,
            delay: 0.18,
            ease,
          }}
          className="
            mx-auto
            mt-6

            max-w-[920px]

            overflow-hidden

            rounded-[20px]

            border
            border-white/[0.09]

            bg-[#050D13]/[0.92]

            shadow-[0_30px_100px_rgba(0,0,0,0.28)]

            backdrop-blur-xl
          "
        >
          {/* CARD HEADER */}

          <div
            className="
              flex
              flex-col
              gap-3

              border-b
              border-white/[0.07]

              px-5
              py-5

              sm:flex-row
              sm:items-center
              sm:justify-between

              md:px-7
            "
          >
            <div>
              <h2
                className="
                  text-[17px]
                  font-semibold
                  tracking-[-0.035em]
                "
              >
                Choose a time that works for you.
              </h2>

              <p
                className="
                  mt-1

                  text-[11px]
                  leading-5
                  text-white/38
                "
              >
                Availability and timezone are handled automatically.
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-2

                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]

                text-white/30
              "
            >
              <Clock3
                size={13}
                strokeWidth={1.5}
              />

              30 min
            </div>
          </div>

          {/* CAL */}

          <div
            className="
              p-3

              sm:p-4
              md:p-5
            "
          >
            <CalBooking />
          </div>

          {/* CARD FOOT */}

          <div
            className="
              flex
              flex-col
              gap-2

              border-t
              border-white/[0.06]

              px-5
              py-4

              text-[9px]
              text-white/27

              sm:flex-row
              sm:items-center
              sm:justify-between

              md:px-7
            "
          >
            <span>
              No pitch deck required. No obligation.
            </span>

            <span>
              Your information stays private.
            </span>
          </div>
        </motion.section>

        {/* ====================================================
            GENERAL ENQUIRIES
        ==================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 8,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            delay: 0.32,
            ease,
          }}
          className="
            mx-auto
            mt-7

            max-w-[920px]

            border-t
            border-white/[0.06]

            pt-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-medium
                  text-white/62
                "
              >
                Have a general question instead?
              </p>

              <p
                className="
                  mt-1

                  text-[10px]
                  leading-5
                  text-white/28
                "
              >
                For partnerships, general enquiries or anything unrelated to a
                project.
              </p>
            </div>

            <a
              href="mailto:hello@danielvlko.com"
              style={{
                color: "#FFFFFF",
              }}
              className="
                group

                inline-flex
                items-center
                gap-4

                text-[12px]
                font-medium

                transition-opacity
                duration-200

                hover:opacity-70
              "
            >
              <Mail
                size={15}
                strokeWidth={1.6}
                className="text-[#FF7540]"
              />

              <span>
                hello@danielvlko.com
              </span>

              <ArrowRight
                size={14}
                strokeWidth={1.6}
                className="
                  transition-transform
                  duration-200

                  group-hover:translate-x-1
                "
              />
            </a>
          </div>
        </motion.div>
      </Container>

      {/* ======================================================
          SMALL FOOTER
      ====================================================== */}

      <footer
        className="
          relative
          z-10

          border-t
          border-white/[0.06]

          bg-[#020609]/60
        "
      >
        <Container>
          <div
            className="
              flex
              min-h-[64px]

              flex-col
              gap-2

              py-4

              text-[9px]
              text-white/25

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span>
              © {new Date().getFullYear()} Daniel VLKO
            </span>

            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.30)",
              }}
              className="
                group

                inline-flex
                items-center
                gap-2

                transition-colors
                duration-200

                hover:!text-white
              "
            >
              Back to danielvlko.com

              <ArrowRight
                size={12}
                className="
                  transition-transform
                  duration-200

                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </Container>
      </footer>
    </main>
  );
}

/* ============================================================
   BACKGROUND
============================================================ */

function ContactBackground() {
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
      <div className="absolute inset-0 bg-[#020609]" />

      {/* EARTH — ONLY ATMOSPHERE */}

      <div
        className="
          absolute
          inset-x-0
          bottom-[-32%]

          h-[64%]

          opacity-[0.24]
        "
      >
        <Image
          src="/images/hero/earth.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            select-none
            object-cover
            object-[center_38%]
          "
        />
      </div>

      {/* DARK PROTECTION */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(2,6,9,1) 0%,
              rgba(2,6,9,0.97) 28%,
              rgba(2,6,9,0.90) 52%,
              rgba(2,6,9,0.68) 78%,
              rgba(2,6,9,0.50) 100%
            )
          `,
        }}
      />

      {/* SUBTLE CENTER DEPTH */}

      <div
        className="
          absolute
          left-1/2
          top-[25%]

          h-[600px]
          w-[1000px]

          -translate-x-1/2

          rounded-full
          blur-[190px]
        "
        style={{
          background:
            "rgba(27,63,85,0.055)",
        }}
      />

      {/* TINY WARM HORIZON */}

      <div
        className="
          absolute

          bottom-[-80px]
          left-[4%]

          h-[260px]
          w-[360px]

          rounded-full
          blur-[140px]
        "
        style={{
          background:
            "rgba(255,90,31,0.04)",
        }}
      />

      {/* VIGNETTE */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 50%,
              rgba(0,0,0,0.10) 76%,
              rgba(0,0,0,0.34) 100%
            )
          `,
        }}
      />
    </div>
  );
}