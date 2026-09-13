"use client";

import Image from "next/image";

import {
  ArrowRight,
  Code2,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ComingSoonModals,
} from "@/components/launch/ComingSoonModals";

import {
  CalWarmup,
} from "@/components/contact/CalWarmup";

/* =========================================================
   SERVICES
========================================================= */

const services = [
  {
    label: "Custom Software",
    description:
      "Tailored digital systems built around real business needs.",
    icon: Code2,
  },
  {
    label: "Automation Systems",
    description:
      "Streamline operations and reduce repetitive manual work.",
    icon: Workflow,
  },
  {
    label: "AI Workflows",
    description:
      "Apply AI where it creates real operational leverage.",
    icon: Sparkles,
  },
] as const;

/* =========================================================
   STATUS SIGNAL
========================================================= */

function RefinementSignal({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <div
      className="
        relative
        flex
        h-[112px]
        w-[112px]
        shrink-0
        items-center
        justify-center
      "
    >
      {/* soft ambient glow */}

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  0.04,
                  0.1,
                  0.04,
                ],
                scale: [
                  0.94,
                  1.06,
                  0.94,
                ],
              }
        }
        transition={{
          duration: 5.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-3
          rounded-full
          bg-[#FF5A1F]
          blur-[34px]
        "
      />

      {/* outer ring */}

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  0.11,
                  0.23,
                  0.11,
                ],
                scale: [
                  0.985,
                  1.035,
                  0.985,
                ],
              }
        }
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-0
          rounded-full
          border
          border-white/[0.13]
        "
      />

      {/* middle ring */}

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  0.14,
                  0.32,
                  0.14,
                ],
                scale: [
                  1,
                  1.045,
                  1,
                ],
              }
        }
        transition={{
          duration: 4.9,
          delay: 0.35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-[17px]
          rounded-full
          border
          border-white/[0.15]
        "
      />

      {/* inner ring */}

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [
                  0.18,
                  0.4,
                  0.18,
                ],
                scale: [
                  1,
                  1.055,
                  1,
                ],
              }
        }
        transition={{
          duration: 4.2,
          delay: 0.75,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          inset-[34px]
          rounded-full
          border
          border-[#FF5A1F]/35
        "
      />

      {/* center dot */}

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                scale: [
                  0.92,
                  1.08,
                  0.92,
                ],
                opacity: [
                  0.75,
                  1,
                  0.75,
                ],
                boxShadow: [
                  "0 0 0 rgba(255,90,31,0)",
                  "0 0 22px rgba(255,90,31,0.45)",
                  "0 0 0 rgba(255,90,31,0)",
                ],
              }
        }
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          relative
          z-10
          h-[8px]
          w-[8px]
          rounded-full
          bg-[#FF5A1F]
        "
      />
    </div>
  );
}

/* =========================================================
   GLASS HIGHLIGHTS
========================================================= */

function GlassHighlights() {
  return (
    <>
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[inherit]
          bg-[linear-gradient(145deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.012)_29%,rgba(255,255,255,0)_62%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-8
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/[0.20]
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-white/[0.018]
          blur-[60px]
        "
      />
    </>
  );
}

/* =========================================================
   PAGE
========================================================= */

export function ComingSoon() {
  const shouldReduceMotion =
    useReducedMotion();

  const reducedMotion =
    !!shouldReduceMotion;

  return (
    <main
      className="
        relative
        min-h-[100dvh]
        overflow-x-hidden
        bg-[#020608]
        text-white

        lg:h-[100dvh]
        lg:min-h-[760px]
        lg:overflow-hidden
      "
    >
      {/* =====================================================
          EARTH BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
        "
      >
        <Image
          src="/images/hero/earth.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            object-cover

            object-[64%_42%]

            sm:object-[58%_45%]
            md:object-[54%_48%]
            lg:object-[50%_50%]
          "
        />

        {/* global cinematic control */}

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(180deg,rgba(1,5,8,0.62)_0%,rgba(1,5,8,0.18)_38%,rgba(1,5,8,0.015)_63%,rgba(1,5,8,0.34)_100%)]
          "
        />

        {/* hero readability */}

        <div
          className="
            absolute
            left-1/2
            top-[8%]
            h-[500px]
            w-[920px]
            -translate-x-1/2
            rounded-full
            bg-black/34
            blur-[155px]
          "
        />

        {/* bottom depth */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[30%]
            bg-gradient-to-b
            from-transparent
            via-[#020608]/22
            to-[#020608]/86
          "
        />

        {/* subtle orange ambient */}

        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [
                    0.62,
                    1,
                    0.62,
                  ],
                  scale: [
                    0.96,
                    1.04,
                    0.96,
                  ],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[23%]
            left-[7%]
            h-[220px]
            w-[420px]
            rounded-full
            bg-[#FF5A1F]/[0.045]
            blur-[120px]
          "
        />
      </div>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[100dvh]
          w-full
          max-w-[1320px]
          flex-col
          px-5

          sm:px-8

          lg:h-full
          lg:min-h-[760px]
          lg:px-12

          xl:px-14
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <header
          className="
            flex
            h-[72px]
            shrink-0
            items-center
            justify-between
            border-b
            border-white/[0.05]

            sm:h-[80px]
          "
        >
          <motion.span
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: -8,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.34em]
              text-white/92

              sm:text-[11px]
            "
          >
            Daniel VLKO
          </motion.span>

          <motion.button
            type="button"
            data-book-trigger
            whileHover={
              reducedMotion
                ? undefined
                : {
                    y: -1,
                    scale: 1.015,
                  }
            }
            whileTap={
              reducedMotion
                ? undefined
                : {
                    scale: 0.985,
                  }
            }
            className="
              group
              hidden
              h-[40px]
              items-center
              justify-center
              gap-5
              rounded-full
              border
              border-white/[0.13]
              bg-black/[0.20]
              px-5
              text-[9px]
              font-semibold
              text-white/68
              backdrop-blur-2xl
              transition-colors
              duration-300

              hover:border-white/[0.26]
              hover:bg-white/[0.04]
              hover:text-white

              sm:inline-flex
            "
          >
            Book a free discovery call

            <ArrowRight
              size={13}
              strokeWidth={1.7}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </motion.button>
        </header>

        {/* ===================================================
            BODY
        =================================================== */}

        <section
          className="
            flex
            flex-1
            flex-col
            pb-5

            sm:pb-7

            lg:min-h-0
            lg:pb-[clamp(18px,2.4vh,30px)]
          "
        >
          {/* =================================================
              HERO
          ================================================= */}

          <motion.div
            initial={
              reducedMotion
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
              duration: 0.85,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              mx-auto
              my-12
              flex
              w-full
              max-w-[960px]
              flex-col
              items-center
              text-center

              sm:my-14

              lg:my-auto
            "
          >
            {/* categories */}

            <motion.div
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.12,
              }}
              className="
                mb-5
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-3
                gap-y-2
                text-[7px]
                font-medium
                uppercase
                tracking-[0.32em]
                text-white/37

                sm:mb-6
                sm:gap-x-4
                sm:text-[8px]
              "
            >
              <span>Software</span>

              <span className="text-[#FF5A1F]/55">
                /
              </span>

              <span>Automation</span>

              <span className="text-[#FF5A1F]/55">
                /
              </span>

              <span>AI Solutions</span>
            </motion.div>

            {/* heading */}

            <h1
              className="
                max-w-[930px]
                text-[clamp(2.8rem,10vw,4.2rem)]
                font-medium
                leading-[0.975]
                tracking-[-0.06em]

                sm:text-[clamp(3.8rem,7vw,5.4rem)]

                lg:text-[clamp(4rem,6.2vh,5.75rem)]
              "
            >
              Scalable digital systems
              <br />
              for companies that want
              <br />
              to{" "}
              <span className="text-[#FF5A1F]">
                move faster.
              </span>
            </h1>

            {/* text */}

            <motion.p
              initial={
                reducedMotion
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
                duration: 0.7,
                delay: 0.18,
              }}
              className="
                mt-6
                max-w-[665px]
                text-[12.5px]
                leading-[1.72]
                text-white/52

                sm:text-[14px]

                lg:mt-[clamp(18px,2.2vh,27px)]
                lg:text-[clamp(12.5px,1.32vh,14.5px)]
              "
            >
              I build custom software,
              automation systems and
              AI-assisted workflows for
              businesses that want to operate
              smarter and scale with less
              friction.
              <br className="hidden sm:block" />
              <span className="sm:hidden">
                {" "}
              </span>
              The full website is currently
              being rebuilt and refined.
            </motion.p>

            {/* actions */}

            <motion.div
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.24,
              }}
              className="
                mt-7
                flex
                w-full
                flex-col
                items-center
                justify-center
                gap-3

                sm:w-auto
                sm:flex-row

                lg:mt-[clamp(20px,2.7vh,31px)]
              "
            >
              <motion.button
                type="button"
                data-book-trigger
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -2,
                        scale: 1.012,
                      }
                }
                whileTap={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 0.985,
                      }
                }
                className="
                  group
                  inline-flex
                  h-[48px]
                  w-full
                  items-center
                  justify-center
                  gap-8
                  rounded-full
                  bg-[#FF5A1F]
                  px-7
                  text-[11px]
                  font-semibold
                  text-white
                  shadow-[0_16px_50px_rgba(255,90,31,0.20)]
                  transition-[background-color,box-shadow]
                  duration-300

                  hover:bg-[#ff672e]
                  hover:shadow-[0_20px_62px_rgba(255,90,31,0.29)]

                  sm:w-auto
                  sm:min-w-[232px]

                  lg:text-[12px]
                "
              >
                Book a free discovery call

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                />
              </motion.button>

              <motion.button
                type="button"
                data-contact-trigger
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -2,
                        scale: 1.012,
                      }
                }
                whileTap={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 0.985,
                      }
                }
                className="
                  group
                  inline-flex
                  h-[48px]
                  w-full
                  items-center
                  justify-center
                  gap-8
                  rounded-full
                  border
                  border-white/[0.18]
                  bg-black/[0.20]
                  px-7
                  text-[11px]
                  font-semibold
                  text-white/82
                  backdrop-blur-2xl
                  transition-[background-color,border-color,color]
                  duration-300

                  hover:border-white/[0.34]
                  hover:bg-white/[0.045]
                  hover:text-white

                  sm:w-auto
                  sm:min-w-[162px]

                  lg:text-[12px]
                "
              >
                Contact me

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* =================================================
              CARDS
          ================================================= */}

          <motion.div
            initial={
              reducedMotion
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
              duration: 0.85,
              delay: 0.14,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              mx-auto
              grid
              w-full
              max-w-[1100px]
              gap-3

              lg:grid-cols-[1.08fr_0.92fr]
              lg:gap-4
            "
          >
            {/* ===============================================
                SERVICES
            =============================================== */}

            <motion.section
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="
                group/card
                relative
                overflow-hidden
                rounded-[20px]
                border
                border-white/[0.095]
                bg-black/[0.61]
                p-5
                shadow-[0_26px_90px_rgba(0,0,0,0.43)]
                backdrop-blur-[34px]
                backdrop-saturate-[1.12]
                transition-[border-color,background-color]
                duration-500

                hover:border-white/[0.145]
                hover:bg-black/[0.66]

                sm:p-6

                lg:p-[clamp(20px,2.4vh,28px)]
              "
            >
              <GlassHighlights />

              <div className="relative z-10">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-white/38

                    lg:text-[9px]
                  "
                >
                  What I do
                </p>

                <div
                  className="
                    mt-5
                    grid
                    divide-y
                    divide-white/[0.07]

                    sm:grid-cols-3
                    sm:divide-x
                    sm:divide-y-0
                  "
                >
                  {services.map(
                    (
                      service,
                      index,
                    ) => {
                      const Icon =
                        service.icon;

                      return (
                        <motion.div
                          key={
                            service.label
                          }
                          whileHover={
                            reducedMotion
                              ? undefined
                              : {
                                  y: -2,
                                }
                          }
                          className={`
                            group/service
                            flex
                            gap-4
                            py-5

                            first:pt-0
                            last:pb-0

                            sm:block
                            sm:px-5
                            sm:py-0

                            ${
                              index === 0
                                ? "sm:pl-0"
                                : ""
                            }

                            ${
                              index ===
                              services.length -
                                1
                                ? "sm:pr-0"
                                : ""
                            }
                          `}
                        >
                          <motion.div
                            whileHover={
                              reducedMotion
                                ? undefined
                                : {
                                    scale: 1.08,
                                  }
                            }
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-[#FF5A1F]/20
                              bg-[#FF5A1F]/[0.035]
                              transition-colors
                              duration-300

                              group-hover/service:border-[#FF5A1F]/35
                              group-hover/service:bg-[#FF5A1F]/[0.07]
                            "
                          >
                            <Icon
                              size={16}
                              strokeWidth={1.55}
                              className="
                                text-[#FF5A1F]
                              "
                            />
                          </motion.div>

                          <div
                            className="
                              min-w-0

                              sm:mt-4
                            "
                          >
                            <h2
                              className="
                                text-[12.5px]
                                font-medium
                                leading-[1.35]
                                tracking-[-0.02em]
                                text-white/90
                                transition-colors
                                duration-300

                                group-hover/service:text-white

                                lg:text-[13.5px]
                              "
                            >
                              {
                                service.label
                              }
                            </h2>

                            <p
                              className="
                                mt-1.5
                                max-w-[175px]
                                text-[9.5px]
                                leading-[1.55]
                                text-white/33
                                transition-colors
                                duration-300

                                group-hover/service:text-white/45

                                lg:text-[10.5px]
                              "
                            >
                              {
                                service.description
                              }
                            </p>
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              </div>
            </motion.section>

            {/* ===============================================
                WEBSITE STATUS
            =============================================== */}

            <motion.section
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="
                group/card
                relative
                overflow-hidden
                rounded-[20px]
                border
                border-white/[0.095]
                bg-black/[0.61]
                p-5
                shadow-[0_26px_90px_rgba(0,0,0,0.43)]
                backdrop-blur-[34px]
                backdrop-saturate-[1.12]
                transition-[border-color,background-color]
                duration-500

                hover:border-white/[0.145]
                hover:bg-black/[0.66]

                sm:p-6

                lg:p-[clamp(20px,2.4vh,28px)]
              "
            >
              <GlassHighlights />

              <div className="relative z-10">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-white/38

                    lg:text-[9px]
                  "
                >
                  Website status
                </p>

                <div
                  className="
                    mt-4
                    flex
                    flex-col
                    gap-5

                    sm:flex-row
                    sm:items-center
                    sm:gap-7
                  "
                >
                  <RefinementSignal
                    reducedMotion={
                      reducedMotion
                    }
                  />

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <h2
                      className="
                        text-[15px]
                        font-medium
                        tracking-[-0.025em]
                        text-white/92

                        sm:text-[16px]
                      "
                    >
                      Currently being
                      refined.
                    </h2>

                    <p
                      className="
                        mt-2
                        max-w-[420px]
                        text-[10.5px]
                        leading-[1.7]
                        text-white/38

                        sm:text-[11.5px]
                      "
                    >
                      I&apos;m rebuilding
                      and refining the
                      website to better
                      reflect the systems
                      I build, the way I
                      work and the results
                      I focus on.
                    </p>

                    <p
                      className="
                        mt-2
                        max-w-[420px]
                        text-[10.5px]
                        leading-[1.7]
                        text-white/38

                        sm:text-[11.5px]
                      "
                    >
                      The full experience
                      is still in progress,
                      but I&apos;m currently
                      open to new projects
                      and conversations.
                    </p>

                    {/* availability */}

                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        gap-2.5
                      "
                    >
                      <motion.span
                        animate={
                          reducedMotion
                            ? undefined
                            : {
                                opacity: [
                                  0.55,
                                  1,
                                  0.55,
                                ],
                                scale: [
                                  0.9,
                                  1,
                                  0.9,
                                ],
                              }
                        }
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="
                          h-[6px]
                          w-[6px]
                          rounded-full
                          bg-[#FF5A1F]
                          shadow-[0_0_12px_rgba(255,90,31,0.38)]
                        "
                      />

                      <span
                        className="
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[0.22em]
                          text-white/42
                        "
                      >
                        Open for new projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>

          {/* =================================================
              MICRO FOOTER
          ================================================= */}

          <div
            className="
              mx-auto
              mt-4
              hidden
              w-full
              max-w-[1100px]
              items-center
              justify-between
              border-t
              border-white/[0.045]
              pt-4

              lg:flex
            "
          >
            <span
              className="
                text-[7px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-white/20
              "
            >
              Daniel VLKO
            </span>

            <span
              className="
                text-[7px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-white/20
              "
            >
              Software · Automation · AI
            </span>
          </div>
        </section>
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}
      <CalWarmup />
      <ComingSoonModals />
    </main>
  );
}