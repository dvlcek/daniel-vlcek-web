import Link from "next/link";

import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const platforms = [
    "amazon",
    "Google",
    "OpenAI",
    "stripe",
    "shopify",
    "aws",
    "n8n",
  ];

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
            pt-[21vh]
            pb-[170px]
            sm:pt-[20vh]
            sm:pb-[180px]
            lg:pt-[18vh]
            xl:pt-[17vh]
          "
        >
          <div className="mx-auto w-full max-w-[900px] text-center">
            {/* Positioning */}
            <p
              className="
                mb-5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white/42
                sm:text-[11px]
              "
            >
              Web Development
              <span className="mx-3 text-white/20">·</span>
              Automation Systems
            </p>

            {/* Headline */}
            <h1
              className="
                text-[42px]
                leading-[0.98]
                tracking-[-0.055em]
                sm:text-[60px]
                lg:text-[68px]
                xl:text-[78px]
              "
              style={{
                textShadow:
                  "0 4px 18px rgba(0,0,0,0.72), 0 14px 50px rgba(0,0,0,0.48)",
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
                mt-6
                max-w-[560px]
                text-[15px]
                leading-6
                text-white/62
                sm:text-[16px]
              "
              style={{
                textShadow: "0 3px 14px rgba(0,0,0,0.8)",
              }}
            >
              High-converting websites, custom software and automation for companies that want to grow, operate faster and stop being held back by outdated systems.
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
                  border-white/[0.22]
                  bg-black/10
                  px-7
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-sm
                  transition-colors
                  duration-200
                  hover:border-white/40
                  hover:bg-white/[0.04]
                "
              >
                View my work
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* ====================================================
          BOTTOM TRUST / LOGOS STRIP
      ==================================================== */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <Container className="relative">
          <div className="relative pb-6 sm:pb-8">
            {/* shadow / glow behind */}
            <div
              className="
                absolute
                inset-x-[8%]
                bottom-2
                h-[88px]
                rounded-[999px]
                bg-black/70
                blur-3xl
                sm:inset-x-[12%]
              "
            />

            <div className="relative mx-auto w-full max-w-[1120px]">
              {/* clean label */}
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-white/12" />
                <p
                  className="
                    shrink-0
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.34em]
                    text-white/52
                    sm:text-[11px]
                  "
                >
                  TRUSTED WORKFLOWS
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/12 to-white/12" />
              </div>

              {/* logos / names row */}
              <div
                className="
                  rounded-[28px]
                  border
                  border-white/[0.10]
                  bg-black/18
                  px-4
                  py-4
                  shadow-[0_18px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]
                  backdrop-blur-[10px]
                  sm:px-7
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-y-3
                    text-white/92
                  "
                >
                  {platforms.map((platform, index) => (
                    <div
                      key={platform}
                      className="flex items-center justify-center"
                    >
                      <span
                        className={`
                          px-4
                          text-[18px]
                          leading-none
                          tracking-[-0.02em]
                          sm:px-5
                          ${
                            platform === "amazon" ||
                            platform === "stripe" ||
                            platform === "shopify" ||
                            platform === "aws" ||
                            platform === "n8n"
                              ? "font-medium lowercase"
                              : "font-medium"
                          }
                        `}
                        style={{
                          textShadow: "0 2px 14px rgba(0,0,0,0.45)",
                        }}
                      >
                        {platform}
                      </span>

                      {index !== platforms.length - 1 && (
                        <span className="hidden h-5 w-px bg-white/12 sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}