"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import { ComingSoonModals } from "@/components/launch/ComingSoonModals";

const stages = [
  {
    label: "Foundation",
    state: "done",
  },
  {
    label: "Content",
    state: "done",
  },
  {
    label: "Design",
    state: "active",
  },
  {
    label: "Development",
    state: "pending",
  },
  {
    label: "Launch",
    state: "pending",
  },
] as const;

export function ComingSoon() {
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="
        relative
        min-h-[100dvh]
        overflow-x-hidden
        bg-[#020608]
        text-white
      "
    >
      {/* =========================================================
          FIXED BACKGROUND / EARTH
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          z-0

          overflow-hidden

          bg-[#020608]
        "
      >
        {/* EARTH */}

        <Image
          src="/images/hero/earth.webp"
          alt=""
          fill
          priority
          quality={92}
          sizes="100vw"
          className="
            select-none

            object-cover
            object-[68%_35%]

            opacity-[0.94]

            sm:object-[62%_38%]
            sm:opacity-[0.96]

            md:object-[58%_42%]

            lg:object-[52%_52%]
            lg:opacity-100

            xl:object-[50%_53%]

            2xl:object-[50%_54%]
          "
        />

        {/* =======================================================
            LEFT READABILITY
        ======================================================= */}

        <div
          className="
            absolute
            inset-0

            bg-[linear-gradient(90deg,rgba(1,5,8,0.88)_0%,rgba(1,5,8,0.70)_29%,rgba(1,5,8,0.30)_57%,rgba(1,5,8,0.05)_100%)]

            sm:bg-[linear-gradient(90deg,rgba(1,5,8,0.89)_0%,rgba(1,5,8,0.67)_30%,rgba(1,5,8,0.27)_58%,rgba(1,5,8,0.035)_100%)]

            lg:bg-[linear-gradient(90deg,rgba(1,5,8,0.96)_0%,rgba(1,5,8,0.82)_27%,rgba(1,5,8,0.39)_48%,rgba(1,5,8,0.07)_72%,rgba(1,5,8,0.02)_100%)]
          "
        />

        {/* =======================================================
            TEXT DEPTH
        ======================================================= */}

        <div
          className="
            absolute

            left-[-22%]
            top-[55px]

            h-[570px]
            w-[120%]

            bg-[radial-gradient(ellipse_at_30%_40%,rgba(0,0,0,0.54)_0%,rgba(0,0,0,0.28)_38%,rgba(0,0,0,0)_72%)]

            sm:left-[-14%]
            sm:top-[70px]
            sm:w-[92%]

            lg:left-[-8%]
            lg:top-[9%]
            lg:h-[70%]
            lg:w-[62%]
          "
        />

        {/* =======================================================
            ORANGE AMBIENT LIGHT
        ======================================================= */}

        <div
          className="
            absolute

            left-[2%]
            top-[300px]

            h-[190px]
            w-[300px]

            rounded-full

            bg-[#FF5A1F]/[0.055]

            blur-[100px]

            sm:left-[11%]
            sm:top-[350px]
            sm:h-[230px]
            sm:w-[430px]

            lg:left-[14%]
            lg:top-auto
            lg:bottom-[24%]
            lg:h-[240px]
            lg:w-[520px]
            lg:blur-[110px]
          "
        />

        {/* =======================================================
            TOP CINEMATIC FADE
        ======================================================= */}

        <div
          className="
            absolute
            inset-x-0
            top-0

            h-[150px]

            bg-gradient-to-b
            from-[#020608]/50
            via-[#020608]/12
            to-transparent
          "
        />

        {/* =======================================================
            BOTTOM FADE → BLACK
        ======================================================= */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0

            h-[42%]

            bg-gradient-to-b
            from-transparent
            via-[#020608]/48
            to-[#020608]

            sm:h-[40%]

            lg:h-[32%]
            lg:via-[#020608]/36
          "
        />
      </div>

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}

      <div
        className="
          relative
          z-10

          mx-auto

          flex
          min-h-[100dvh]
          w-full
          max-w-[1480px]

          flex-col

          px-5

          sm:px-8

          lg:px-12

          xl:px-16
        "
      >
        {/* =======================================================
            HEADER
        ======================================================= */}

        <header
          className="
            flex
            h-[66px]
            shrink-0

            items-center
            justify-between

            gap-4

            sm:h-[76px]

            lg:h-[clamp(68px,8.5vh,92px)]
          "
        >
          {/* BRAND */}

          <span
            className="
              shrink-0

              text-[9px]
              font-semibold
              uppercase
              tracking-[0.30em]

              text-white

              [text-shadow:0_2px_18px_rgba(0,0,0,0.72)]

              sm:text-[11px]

              lg:text-[12px]
              lg:tracking-[0.32em]
            "
          >
            Daniel VLKO
          </span>

          {/* BOOKING CTA */}

          <button
            type="button"
            data-book-trigger
            aria-haspopup="dialog"
            aria-label="Book a free discovery call"
            className="
              group

              inline-flex
              min-w-0

              items-center
              justify-end

              gap-2

              text-[7.5px]
              font-semibold
              uppercase
              tracking-[0.17em]

              text-white/82

              [text-shadow:0_2px_16px_rgba(0,0,0,0.72)]

              transition-colors
              duration-200

              hover:text-white

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#FF5A1F]/60
              focus-visible:ring-offset-4
              focus-visible:ring-offset-[#020608]

              sm:gap-2.5
              sm:text-[9px]
              sm:tracking-[0.20em]

              lg:gap-3
              lg:text-[10px]
            "
          >
            <span className="hidden sm:inline">
              Book a free discovery call
            </span>

            <span className="sm:hidden">
              Book free call
            </span>

            <ArrowRight
              aria-hidden="true"
              size={12}
              strokeWidth={1.8}
              className="
                shrink-0

                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </button>
        </header>

        {/* =======================================================
            MAIN
        ======================================================= */}

        <section
          className="
            flex
            flex-1
            flex-col

            pb-5

            sm:pb-7

            lg:pb-[clamp(14px,2vh,28px)]
          "
        >
          {/* =====================================================
              HERO
          ===================================================== */}

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
              duration: reduceMotion
                ? 0
                : 0.75,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              relative

              my-10

              max-w-[720px]

              sm:my-14

              lg:my-[clamp(40px,8vh,100px)]
            "
          >
            {/* HERO SHADOW */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute

                -left-12
                -top-16

                -z-10

                h-[450px]
                w-[120%]

                bg-[radial-gradient(ellipse_at_28%_42%,rgba(0,0,0,0.38),rgba(0,0,0,0.13)_46%,transparent_74%)]

                blur-[6px]

                lg:hidden
              "
            />

            {/* SERVICES */}

            <div
              className="
                mb-5

                flex
                max-w-[520px]
                flex-wrap
                items-center

                gap-x-3
                gap-y-2

                text-[7px]
                font-medium
                uppercase
                tracking-[0.25em]

                text-white/48

                [text-shadow:0_2px_18px_rgba(0,0,0,0.88)]

                sm:mb-6
                sm:gap-x-4
                sm:text-[8px]
                sm:tracking-[0.27em]

                lg:text-[9px]
              "
            >
              <span>Software</span>

              <span
                aria-hidden="true"
                className="text-white/18"
              >
                /
              </span>

              <span>Automation</span>

              <span
                aria-hidden="true"
                className="text-white/18"
              >
                /
              </span>

              <span>AI Solutions</span>

              <span
                aria-hidden="true"
                className="text-white/18"
              >
                /
              </span>

              <span>Growth</span>
            </div>

            {/* HEADLINE */}

            <h1
              className="
                max-w-[690px]

                text-[clamp(2.55rem,11.6vw,3.5rem)]

                font-medium
                leading-[0.96]
                tracking-[-0.057em]

                [text-shadow:0_4px_28px_rgba(0,0,0,0.88)]

                sm:text-[clamp(3.4rem,7.3vw,4.6rem)]

                md:text-[4.7rem]

                lg:text-[clamp(3.65rem,7.35vh,5.75rem)]
                lg:[text-shadow:0_3px_28px_rgba(0,0,0,0.60)]
              "
            >
              I build systems
              <br />

              for a more efficient
              <br />

              <span
                className="
                  text-[#FF5A1F]

                  [text-shadow:0_4px_24px_rgba(0,0,0,0.72),0_0_32px_rgba(255,90,31,0.06)]
                "
              >
                tomorrow.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5

                max-w-[560px]

                text-[12px]
                leading-[1.7]

                text-white/62

                [text-shadow:0_2px_20px_rgba(0,0,0,0.90)]

                sm:mt-6
                sm:text-[14px]

                lg:mt-[clamp(16px,2.2vh,28px)]
                lg:text-[clamp(12px,1.4vh,15px)]
                lg:text-white/54
              "
            >
              Custom software, automation, AI-assisted workflows and digital
              platforms for businesses that want to operate smarter, move
              faster and scale with less friction.
            </p>

            {/* CTA */}

            <div
              className="
                mt-6

                flex
                flex-col

                gap-3

                sm:mt-7
                sm:flex-row
                sm:flex-wrap
                sm:items-center

                lg:mt-[clamp(18px,2.6vh,32px)]
              "
            >
              {/* BOOK */}

              <button
                type="button"
                data-book-trigger
                aria-haspopup="dialog"
                aria-label="Book a free discovery call"
                className="
                  group

                  inline-flex
                  h-[46px]
                  w-full

                  items-center
                  justify-center

                  gap-7

                  rounded-full

                  bg-[#FF5A1F]

                  px-6

                  text-[11px]
                  font-semibold

                  text-white

                  shadow-[0_14px_42px_rgba(255,90,31,0.22),0_4px_30px_rgba(0,0,0,0.25)]

                  transition-[transform,background-color,box-shadow]
                  duration-300

                  hover:-translate-y-[1px]
                  hover:bg-[#FF682E]
                  hover:shadow-[0_18px_48px_rgba(255,90,31,0.28)]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#FF5A1F]/80
                  focus-visible:ring-offset-4
                  focus-visible:ring-offset-[#020608]

                  sm:w-auto

                  lg:h-[48px]
                  lg:gap-8
                  lg:text-[12px]
                "
              >
                Book a free discovery call

                <ArrowRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                />
              </button>

              {/* CONTACT */}

              <button
                type="button"
                data-contact-trigger
                aria-haspopup="dialog"
                aria-label="Contact Daniel VLKO"
                className="
                  group

                  inline-flex
                  h-[46px]
                  w-full

                  items-center
                  justify-center

                  gap-7

                  rounded-full

                  border
                  border-white/[0.18]

                  bg-black/[0.22]

                  px-6

                  text-[11px]
                  font-semibold

                  text-white/92

                  shadow-[0_5px_24px_rgba(0,0,0,0.22)]

                  backdrop-blur-md

                  transition-[transform,border-color,background-color,color]
                  duration-300

                  hover:-translate-y-[1px]
                  hover:border-white/[0.30]
                  hover:bg-white/[0.055]
                  hover:text-white

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/40
                  focus-visible:ring-offset-4
                  focus-visible:ring-offset-[#020608]

                  sm:w-auto

                  lg:h-[48px]
                  lg:gap-8
                  lg:text-[12px]
                "
              >
                Contact me

                <ArrowRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                />
              </button>
            </div>
          </motion.div>

          {/* =====================================================
              STATUS
          ===================================================== */}

          <motion.section
            aria-label="Website launch progress"
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
              duration: reduceMotion
                ? 0
                : 0.8,

              delay: reduceMotion
                ? 0
                : 0.1,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              relative

              mt-auto

              shrink-0

              overflow-hidden

              rounded-[18px]

              border
              border-white/[0.09]

              bg-[#061015]/[0.91]

              shadow-[0_24px_90px_rgba(0,0,0,0.36)]

              backdrop-blur-xl
            "
          >
            <div
              className="
                grid

                lg:grid-cols-[0.92fr_1.28fr_0.78fr]
              "
            >
              {/* =================================================
                  WEBSITE
              ================================================= */}

              <div
                className="
                  p-5

                  sm:p-6

                  lg:border-r
                  lg:border-white/[0.075]

                  lg:p-[clamp(18px,2.5vh,30px)]
                "
              >
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.27em]

                    text-white/35

                    lg:text-[9px]
                  "
                >
                  Website
                </p>

                <h2
                  className="
                    mt-3

                    text-[19px]
                    font-medium
                    tracking-[-0.035em]

                    text-white

                    lg:mt-[clamp(10px,1.5vh,16px)]
                    lg:text-[clamp(18px,2vh,21px)]
                  "
                >
                  Currently being refined.
                </h2>

                <p
                  className="
                    mt-2.5

                    max-w-[350px]

                    text-[11px]
                    leading-[1.65]

                    text-white/42

                    lg:mt-[clamp(8px,1.2vh,12px)]
                    lg:text-[clamp(10px,1.25vh,12.5px)]
                  "
                >
                  I&apos;m improving and expanding the experience to better
                  present my work, process and thinking. You can still reach
                  out or book a free discovery call in the meantime.
                </p>
              </div>

              {/* =================================================
                  PROGRESS
              ================================================= */}

              <div
                className="
                  border-t
                  border-white/[0.075]

                  p-5

                  sm:p-6

                  lg:border-r
                  lg:border-t-0

                  lg:p-[clamp(18px,2.5vh,30px)]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    gap-4
                  "
                >
                  <p
                    className="
                      min-w-0

                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.23em]

                      text-white/35

                      sm:text-[8px]

                      lg:text-[9px]
                      lg:tracking-[0.25em]
                    "
                  >
                    Refining the experience
                  </p>

                  <p
                    className="
                      shrink-0

                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.21em]

                      text-[#FF6A32]

                      sm:text-[8px]

                      lg:text-[9px]
                    "
                  >
                    In progress
                  </p>
                </div>

                {/* PROGRESS BAR */}

                <div
                  role="progressbar"
                  aria-label="Website progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={56}
                  className="
                    mt-4

                    h-[4px]

                    overflow-hidden

                    rounded-full

                    bg-white/[0.075]

                    lg:mt-[clamp(12px,1.8vh,20px)]
                  "
                >
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            scaleX: 0,
                          }
                    }
                    animate={{
                      scaleX: 0.56,
                    }}
                    transition={{
                      duration: reduceMotion
                        ? 0
                        : 1.15,

                      delay: reduceMotion
                        ? 0
                        : 0.3,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      h-full
                      w-full
                      origin-left

                      rounded-full

                      bg-[#FF5A1F]

                      shadow-[0_0_10px_rgba(255,90,31,0.18)]

                      will-change-transform
                    "
                  />
                </div>

                {/* MILESTONES */}

                <div
                  className="
                    mt-6

                    lg:mt-[clamp(18px,2.5vh,30px)]
                  "
                >
                  <ol
                    className="
                      grid
                      grid-cols-5

                      items-start
                    "
                  >
                    {stages.map(
                      (
                        stage,
                        index,
                      ) => {
                        const done =
                          stage.state ===
                          "done";

                        const active =
                          stage.state ===
                          "active";

                        return (
                          <li
                            key={
                              stage.label
                            }
                            aria-current={
                              active
                                ? "step"
                                : undefined
                            }
                            className="
                              flex
                              min-w-0

                              flex-col
                              items-center
                            "
                          >
                            <div
                              className="
                                relative

                                flex
                                h-[28px]
                                w-[28px]

                                items-center
                                justify-center
                              "
                            >
                              {/* DONE */}

                              {done && (
                                <motion.div
                                  initial={
                                    reduceMotion
                                      ? false
                                      : {
                                          opacity: 0,
                                          scale: 0.86,
                                        }
                                  }
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                  }}
                                  transition={{
                                    duration:
                                      reduceMotion
                                        ? 0
                                        : 0.4,

                                    delay:
                                      reduceMotion
                                        ? 0
                                        : 0.3 +
                                          index *
                                            0.06,

                                    ease: [
                                      0.22,
                                      1,
                                      0.36,
                                      1,
                                    ],
                                  }}
                                  className="
                                    flex
                                    h-[22px]
                                    w-[22px]

                                    items-center
                                    justify-center

                                    rounded-full

                                    border
                                    border-white/[0.08]

                                    bg-white/[0.04]

                                    shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_5px_14px_rgba(0,0,0,0.18)]
                                  "
                                >
                                  <span
                                    className="
                                      h-[7px]
                                      w-[7px]

                                      rounded-full

                                      bg-[#FF5A1F]
                                    "
                                  />
                                </motion.div>
                              )}

                              {/* ACTIVE */}

                              {active && (
                                <>
                                  {!reduceMotion && (
                                    <motion.span
                                      aria-hidden="true"
                                      initial={{
                                        opacity:
                                          0.08,

                                        scale:
                                          0.9,
                                      }}
                                      animate={{
                                        opacity: [
                                          0.07,
                                          0.22,
                                          0.07,
                                        ],

                                        scale: [
                                          0.92,
                                          1.2,
                                          0.92,
                                        ],
                                      }}
                                      transition={{
                                        duration:
                                          2.5,

                                        repeat:
                                          Infinity,

                                        ease:
                                          "easeInOut",
                                      }}
                                      className="
                                        absolute

                                        h-[28px]
                                        w-[28px]

                                        rounded-full

                                        border
                                        border-[#FF5A1F]/45

                                        will-change-transform
                                      "
                                    />
                                  )}

                                  <motion.div
                                    initial={
                                      reduceMotion
                                        ? false
                                        : {
                                            opacity: 0,
                                            scale: 0.86,
                                          }
                                    }
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                    }}
                                    transition={{
                                      duration:
                                        reduceMotion
                                          ? 0
                                          : 0.45,

                                      delay:
                                        reduceMotion
                                          ? 0
                                          : 0.46,

                                      ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                      ],
                                    }}
                                    className="
                                      relative
                                      z-10

                                      flex
                                      h-[24px]
                                      w-[24px]

                                      items-center
                                      justify-center

                                      rounded-full

                                      border
                                      border-[#FF5A1F]/55

                                      bg-[#FF5A1F]/[0.055]

                                      shadow-[0_0_16px_rgba(255,90,31,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]
                                    "
                                  >
                                    <span
                                      className="
                                        h-[7px]
                                        w-[7px]

                                        rounded-full

                                        bg-[#FF5A1F]

                                        shadow-[0_0_8px_rgba(255,90,31,0.40)]
                                      "
                                    />
                                  </motion.div>
                                </>
                              )}

                              {/* PENDING */}

                              {!done &&
                                !active && (
                                  <div
                                    className="
                                      flex
                                      h-[20px]
                                      w-[20px]

                                      items-center
                                      justify-center

                                      rounded-full

                                      border
                                      border-white/[0.065]

                                      bg-white/[0.015]
                                    "
                                  >
                                    <span
                                      className="
                                        h-[4px]
                                        w-[4px]

                                        rounded-full

                                        bg-white/[0.16]
                                      "
                                    />
                                  </div>
                                )}
                            </div>

                            <p
                              className={`
                                mt-2

                                w-full

                                truncate

                                px-[1px]

                                text-center

                                text-[6px]
                                font-medium

                                sm:text-[8px]

                                lg:mt-2.5
                                lg:text-[clamp(7px,0.9vh,9px)]

                                ${
                                  active
                                    ? "text-white/88"
                                    : done
                                      ? "text-white/42"
                                      : "text-white/20"
                                }
                              `}
                            >
                              {
                                stage.label
                              }
                            </p>
                          </li>
                        );
                      },
                    )}
                  </ol>
                </div>
              </div>

              {/* =================================================
                  AVAILABLE
              ================================================= */}

              <div
                className="
                  border-t
                  border-white/[0.075]

                  p-5

                  sm:p-6

                  lg:border-t-0

                  lg:p-[clamp(18px,2.5vh,30px)]
                "
              >
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.27em]

                    text-white/35

                    lg:text-[9px]
                  "
                >
                  Available for new projects
                </p>

                <p
                  className="
                    mt-3

                    max-w-[285px]

                    text-[11px]
                    leading-[1.65]

                    text-white/44

                    lg:mt-[clamp(10px,1.5vh,16px)]
                    lg:text-[clamp(10px,1.25vh,12.5px)]
                  "
                >
                  Have a project, bottleneck or system worth improving?
                  Let&apos;s explore what would create the most impact.
                </p>

                <button
                  type="button"
                  data-contact-trigger
                  aria-haspopup="dialog"
                  aria-label="Contact Daniel VLKO"
                  className="
                    group

                    mt-4

                    inline-flex
                    h-[38px]

                    items-center
                    justify-center

                    gap-6

                    rounded-full

                    border
                    border-white/[0.14]

                    px-5

                    text-[10px]
                    font-semibold

                    text-white/84

                    transition-[border-color,background-color,color,transform]
                    duration-300

                    hover:-translate-y-[1px]
                    hover:border-white/[0.26]
                    hover:bg-white/[0.035]
                    hover:text-white

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white/40
                    focus-visible:ring-offset-4
                    focus-visible:ring-offset-[#061015]

                    lg:mt-[clamp(12px,1.8vh,20px)]
                    lg:h-[40px]
                    lg:gap-8
                    lg:text-[11px]
                  "
                >
                  Contact me

                  <ArrowRight
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.8}
                    className="
                      transition-transform
                      duration-300

                      group-hover:translate-x-1
                    "
                  />
                </button>
              </div>
            </div>
          </motion.section>
        </section>
      </div>

      {/* =========================================================
          CONTACT + CAL MODALS
      ========================================================= */}

      <ComingSoonModals />
    </main>
  );
}