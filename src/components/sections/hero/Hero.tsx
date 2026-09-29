import Link from "next/link";

import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { Container } from "@/components/ui/Container";

/* =========================================================
   PLATFORM LOGOS
========================================================= */

const platforms = [
  {
    name: "Google",
    src: "/images/brands/google-wordmark.svg",
    imageClassName: "h-[20px] sm:h-[22px]",
  },
  {
    name: "OpenAI",
    src: "/images/brands/openai-wordmark.svg",
    imageClassName: "h-[45px] sm:h-[50px]",
  },
  {
    name: "Stripe",
    src: "/images/brands/stripe-wordmark.svg",
    imageClassName: "h-[29px] sm:h-[32px]",
  },
  {
    name: "AWS",
    src: "/images/brands/aws-wordmark.svg",
    imageClassName: "h-[40px] sm:h-[45px]",
  },
  {
    name: "n8n",
    src: "/images/brands/n8n-logo-white.svg",
    imageClassName: "h-[23px] sm:h-[26px]",
  },
] as const;

export function Hero() {
  return (
    <section
      className="
        relative
        min-h-[100dvh]
        overflow-hidden
        bg-[#020609]
        text-white
      "
    >
      <HeroBackground />

      <Container className="relative z-10 min-h-[100dvh]">
        {/* ====================================================
            HERO CONTENT
        ==================================================== */}
        <div
          className="
            flex
            min-h-[100dvh]
            justify-center
            pb-[190px]
            pt-[21vh]
            sm:pb-[200px]
            sm:pt-[20vh]
            lg:pt-[18vh]
            xl:pt-[17vh]
          "
        >
          <div className="mx-auto w-full max-w-[960px] text-center">
            {/* Positioning */}
            <p
              className="
                mb-5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.26em]
                text-white/50
                sm:text-[11px]
              "
            >
              Web Development
              <span className="mx-3 text-white/22">·</span>
              Automation Systems
            </p>

            {/* Headline */}
            <h1
              className="
                text-[42px]
                font-normal
                leading-[0.97]
                tracking-[-0.04em]
                sm:text-[60px]
                lg:text-[72px]
                xl:text-[82px]
              "
              style={{
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.72), 0 16px 56px rgba(0,0,0,0.52)",
              }}
            >
              Build the next version
              <br />
              of{" "}
              <span className="text-[var(--accent)]">
                your business.
              </span>
            </h1>

            {/* Supporting copy */}
            <p
              className="
                mx-auto
                mt-7
                max-w-[600px]
                text-[15px]
                font-normal
                leading-[1.6]
                tracking-[-0.005em]
                text-white/64
                sm:text-[16px]
              "
              style={{
                textShadow: "0 3px 16px rgba(0,0,0,0.82)",
              }}
            >
              High-converting websites, custom software and automation for
              companies that want to grow, operate faster and stop being held
              back by outdated systems.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="
                  group
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-5
                  rounded-full
                  bg-[var(--accent)]
                  px-7
                  text-sm
                  font-medium
                  text-white
                  shadow-[0_8px_30px_rgba(255,90,31,0.14)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_35px_rgba(255,90,31,0.20)]
                "
              >
                <span>Book a strategy call</span>

                <span
                  aria-hidden="true"
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>

              <Link
                href="/work"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/[0.16]
                  bg-black/10
                  px-7
                  text-sm
                  font-medium
                  text-white/88
                  backdrop-blur-sm
                  transition-colors
                  duration-200
                  hover:border-white/30
                  hover:bg-white/[0.04]
                  hover:text-white
                "
              >
                View my work
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* ====================================================
          PLATFORM LOGOS
      ==================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-[26px]
          z-20
          sm:bottom-[30px]
        "
      >
        {/* Dark fade over lower Earth */}
        <div
          className="
            absolute
            inset-x-0
            bottom-[-30px]
            h-[190px]
            bg-gradient-to-t
            from-[#020609]
            via-[#020609]/66
            to-transparent
          "
        />

        {/* Soft shadow behind entire logo strip */}
        <div
          className="
            absolute
            bottom-[-35px]
            left-1/2
            h-[135px]
            w-[82%]
            max-w-[1100px]
            -translate-x-1/2
            rounded-full
            bg-black/70
            blur-[50px]
          "
        />

        <Container className="relative">
          <div className="mx-auto w-full max-w-[1040px]">
            {/* Label */}
            <div
              className="
                mb-5
                flex
                items-center
                justify-center
                gap-5
              "
            >
              <div
                className="
                  h-px
                  w-[80px]
                  bg-gradient-to-r
                  from-transparent
                  to-white/[0.10]
                  sm:w-[150px]
                "
              />

              <p
                className="
                  shrink-0
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.32em]
                  text-white/36
                  sm:text-[10px]
                "
              >
                Platforms I build with
              </p>

              <div
                className="
                  h-px
                  w-[80px]
                  bg-gradient-to-l
                  from-transparent
                  to-white/[0.10]
                  sm:w-[150px]
                "
              />
            </div>

            {/* Logos */}
            <div
              className="
                mx-auto
                flex
                max-w-[900px]
                flex-wrap
                items-center
                justify-center
                gap-x-9
                gap-y-4
                sm:gap-x-12
                lg:flex-nowrap
                lg:justify-between
              "
            >
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="
                    flex
                    h-[36px]
                    min-w-[78px]
                    items-center
                    justify-center
                    sm:min-w-[90px]
                  "
                >
                  <img
                    src={platform.src}
                    alt={platform.name}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    className={`
                      block
                      w-auto
                      max-w-[118px]
                      select-none
                      object-contain
                      opacity-[0.62]
                      ${platform.imageClassName}
                    `}
                    style={{
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}