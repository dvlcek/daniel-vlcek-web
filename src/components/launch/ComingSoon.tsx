"use client";

import Image from "next/image";

import {
  ArrowRight,
  Braces,
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
      "Digital systems built around real business requirements.",
    icon: Braces,
  },
  {
    label: "Automation Systems",
    description:
      "Processes designed to reduce repetitive manual work.",
    icon: Workflow,
  },
  {
    label: "AI Workflows",
    description:
      "AI applied where it creates measurable operational leverage.",
    icon: Sparkles,
  },
] as const;

/* =========================================================
   STATUS MARK
========================================================= */

function StatusMark({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <div
      className="
        relative
        flex
        h-[88px]
        w-[88px]
        shrink-0
        items-center
        justify-center
      "
    >
      <div
        className="
          absolute
          inset-0
          rounded-full
          border
          border-white/[0.07]
        "
      />

      <div
        className="
          absolute
          inset-[17px]
          rounded-full
          border
          border-white/[0.09]
        "
      />

      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [0.5, 1, 0.5],
                scale: [0.92, 1.08, 0.92],
              }
        }
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          h-[7px]
          w-[7px]
          rounded-full
          bg-[#FF5A1F]
          shadow-[0_0_18px_rgba(255,90,31,0.45)]
        "
      />
    </div>
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
        bg-[#020405]
        text-white

        lg:h-[100dvh]
        lg:min-h-[760px]
        lg:overflow-hidden
      "
    >
      {/* =====================================================
          BACKGROUND
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
          src="/images/hero/pp.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            object-cover

            object-[63%_45%]

            sm:object-[58%_46%]
            md:object-[54%_48%]
            lg:object-[50%_51%]
          "
        />

        {/* top darkness */}

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(180deg,rgba(1,3,4,0.78)_0%,rgba(1,3,4,0.42)_30%,rgba(1,3,4,0.08)_55%,rgba(1,3,4,0.18)_100%)]
          "
        />

        {/* readability behind hero */}

        <div
          className="
            absolute
            left-1/2
            top-[11%]
            h-[420px]
            w-[920px]
            -translate-x-1/2
            rounded-full
            bg-black/35
            blur-[150px]
          "
        />

        {/* depth behind cards */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[32%]
            bg-gradient-to-b
            from-transparent
            via-[#020405]/20
            to-[#020405]/88
          "
        />

        {/* subtle edge vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.28)_100%)]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
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
            border-white/[0.045]

            sm:h-[78px]
          "
        >
          <motion.span
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: -5,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.34em]
              text-white/90

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
              gap-5
              rounded-full
              border
              border-white/[0.12]
              bg-black/15
              px-5
              text-[10px]
              font-medium
              text-white/70
              backdrop-blur-xl
              transition-all
              duration-300

              hover:border-white/[0.22]
              hover:bg-white/[0.025]
              hover:text-white

              sm:inline-flex
            "
          >
            Book a discovery call

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
            lg:pb-[clamp(20px,2.5vh,30px)]
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
                    y: 16,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mx-auto
              my-12
              flex
              w-full
              max-w-[980px]
              flex-col
              items-center
              text-center

              sm:my-14

              lg:my-auto
            "
          >
            {/* eyebrow */}

            <div
              className="
                mb-6
                flex
                items-center
                justify-center
                gap-3
                text-[7px]
                font-medium
                uppercase
                tracking-[0.34em]
                text-white/32

                sm:text-[8px]
              "
            >
              <span>Software</span>

              <span className="text-[#FF5A1F]/60">
                /
              </span>

              <span>Automation</span>

              <span className="text-[#FF5A1F]/60">
                /
              </span>

              <span>AI Systems</span>
            </div>

            {/* heading */}

            <h1
              className="
                max-w-[950px]
                text-[clamp(2.85rem,10vw,4.35rem)]
                font-medium
                leading-[0.97]
                tracking-[-0.058em]

                sm:text-[clamp(4rem,7.2vw,5.6rem)]

                lg:text-[clamp(4.25rem,6.35vh,5.9rem)]
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

            {/* primary description */}

            <p
              className="
                mt-6
                max-w-[680px]
                text-[12.5px]
                leading-[1.72]
                text-white/50

                sm:text-[14px]

                lg:mt-[clamp(20px,2.4vh,28px)]
              "
            >
              I build custom software,
              automation systems and
              AI-assisted workflows for
              businesses that want to operate
              smarter and scale with less
              friction.
            </p>

            {/* website status copy */}

            <p
              className="
                mt-2
                text-[11px]
                leading-relaxed
                text-white/32

                sm:text-[12px]
              "
            >
              The full website is currently
              being rebuilt and refined.
            </p>

            {/* actions */}

            <div
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

                lg:mt-[clamp(22px,2.8vh,32px)]
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
                  shadow-[0_16px_42px_rgba(255,90,31,0.18)]
                  transition-all
                  duration-300

                  hover:bg-[#ff652b]
                  hover:shadow-[0_18px_48px_rgba(255,90,31,0.24)]

                  sm:w-auto
                  sm:min-w-[220px]

                  lg:text-[12px]
                "
              >
                Book a discovery call

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
                  border-white/[0.14]
                  bg-black/15
                  px-7
                  text-[11px]
                  font-medium
                  text-white/70
                  backdrop-blur-xl
                  transition-all
                  duration-300

                  hover:border-white/[0.26]
                  hover:bg-white/[0.025]
                  hover:text-white

                  sm:w-auto
                  sm:min-w-[154px]

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
            </div>
          </motion.div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <motion.div
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 14,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.85,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mx-auto
              grid
              w-full
              max-w-[1100px]
              gap-3

              lg:grid-cols-[1.12fr_0.88fr]
              lg:gap-4
            "
          >
            {/* ===============================================
                WHAT I DO
            =============================================== */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[18px]
                border
                border-white/[0.085]
                bg-[#050708]/80
                p-5
                shadow-[0_22px_70px_rgba(0,0,0,0.30)]
                backdrop-blur-[24px]

                sm:p-6
              "
            >
              <div
                className="
                  absolute
                  inset-x-7
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.14]
                  to-transparent
                "
              />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.31em]
                  text-white/34

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
                  divide-white/[0.06]

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
                      <div
                        key={
                          service.label
                        }
                        className={`
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
                        <div
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            text-[#FF5A1F]
                          "
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.55}
                          />
                        </div>

                        <div
                          className="
                            min-w-0

                            sm:mt-3.5
                          "
                        >
                          <h2
                            className="
                              text-[12.5px]
                              font-medium
                              leading-[1.35]
                              tracking-[-0.02em]
                              text-white/88

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
                              max-w-[180px]
                              text-[9.5px]
                              leading-[1.6]
                              text-white/32

                              lg:text-[10.5px]
                            "
                          >
                            {
                              service.description
                            }
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </section>

            {/* ===============================================
                WEBSITE STATUS
            =============================================== */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[18px]
                border
                border-white/[0.085]
                bg-[#050708]/80
                p-5
                shadow-[0_22px_70px_rgba(0,0,0,0.30)]
                backdrop-blur-[24px]

                sm:p-6
              "
            >
              <div
                className="
                  absolute
                  inset-x-7
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.14]
                  to-transparent
                "
              />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.31em]
                  text-white/34

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
                  sm:gap-6
                "
              >
                <StatusMark
                  reducedMotion={
                    reducedMotion
                  }
                />

                <div className="min-w-0">
                  <h2
                    className="
                      text-[15px]
                      font-medium
                      tracking-[-0.025em]
                      text-white/90

                      sm:text-[16px]
                    "
                  >
                    Currently being refined.
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-[360px]
                      text-[10.5px]
                      leading-[1.7]
                      text-white/35

                      sm:text-[11.5px]
                    "
                  >
                    I&apos;m rebuilding the
                    website to better reflect
                    the systems I build, how I
                    work and the results I
                    focus on.
                  </p>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <span
                      className="
                        h-[5px]
                        w-[5px]
                        rounded-full
                        bg-[#FF5A1F]
                        shadow-[0_0_10px_rgba(255,90,31,0.45)]
                      "
                    />

                    <span
                      className="
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.22em]
                        text-white/38
                      "
                    >
                      Open for selected projects
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </section>
      </div>

      <CalWarmup />
      <ComingSoonModals />
    </main>
  );
}