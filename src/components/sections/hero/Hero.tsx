import Link from "next/link";

import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#050b10] text-white lg:min-h-[820px]">
      {/* IMAGE + SCROLL ANIMATION */}
      <HeroBackground />

      {/* CONTENT */}
      <Container className="relative z-10 min-h-[760px] lg:min-h-[820px]">
        <div className="flex min-h-[760px] items-start justify-center pt-[180px] lg:min-h-[820px] lg:pt-[165px]">
          <div className="mx-auto w-full max-w-[760px] text-center">
            <h1 className="text-[42px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-[54px] lg:text-[68px]">
              I turn operational chaos
              <br />
              into systems that{" "}
              <span className="text-[var(--accent)]">scale.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[660px] text-[15px] leading-6 text-white/65 sm:text-base">
              Custom software, automation and applied AI that remove manual
              work, connect operations and make your business easier to run.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#work"
                className="group inline-flex h-12 items-center justify-center gap-5 rounded-full bg-[var(--accent)] px-7 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span>View My Work</span>

                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-medium text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/5"
              >
                Let&apos;s Talk
              </Link>
            </div>
          </div>
        </div>

        {/* LEFT LABEL */}
        <div className="absolute left-12 top-[220px] hidden xl:block">
          <div className="flex items-start gap-5">
            <div className="h-[74px] w-px bg-white/25" />

            <p className="text-[9px] font-medium uppercase leading-[1.9] tracking-[0.36em] text-white/50">
              From
              <br />
              chaos to
              <br />
              clarity
            </p>
          </div>
        </div>

        {/* RIGHT LABEL */}
        <div className="absolute right-12 top-[260px] hidden xl:block">
          <div className="flex items-start gap-5">
            <div className="h-[74px] w-px bg-white/25" />

            <p className="text-[9px] font-medium uppercase leading-[1.9] tracking-[0.36em] text-white/50">
              Systems
              <br />
              for a brighter
              <br />
              tomorrow
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}