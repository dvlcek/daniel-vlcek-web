import Link from "@/components/site/MarketingLink";
import Image from "next/image";

import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { Container } from "@/components/ui/Container";

/* =========================================================
   TECHNOLOGY LOGOS
========================================================= */

const technologies = [
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

type HeroProps = {
  workHref?: string;
};

/* =========================================================
   HERO
========================================================= */

export function Hero({
  workHref = "/#work",
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="
        relative
        isolate
        flex
        min-h-[100svh]
        flex-col
        overflow-hidden
        bg-[#020609]
        text-white
      "
    >
      <HeroBackground />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <Container
        className="
          relative
          z-10
          flex
          flex-1
          flex-col
          justify-center
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[960px]
            pb-[clamp(3rem,8svh,6rem)]
            pt-[clamp(8rem,20svh,13rem)]
            text-center
          "
        >
          {/* Positioning */}

          <p
            className="
              eyebrow
              mb-6
              text-white/75
              sm:mb-7
            "
          >
            Software Developer &amp; Automation Architect
          </p>

          {/* Headline */}

          <h1
            id="hero-heading"
            className="display-heading text-balance"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.72), 0 16px 56px rgba(0,0,0,0.52)",
            }}
          >
            Build the next version

            <br className="hidden md:block" />

            {" "}of{" "}

            <span className="text-[var(--marketing-accent)]">
              your business.
            </span>
          </h1>

          {/* Supporting copy */}

          <p
            className="
              section-copy
              intro-gap
              mx-auto
              max-w-[650px]
              text-pretty
              text-white/70
            "
            style={{
              textShadow:
                "0 3px 16px rgba(0,0,0,0.82)",
            }}
          >
             High-performance websites, custom software and
intelligent automation. Built for businesses
ready to scale.
          </p>

          {/* Primary actions */}

          <div
            className="
              action-gap
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <Link
              href="/contact"
              data-contact-source="hero"
              className="
                button-primary
                button-accent
                button-size
                button-text
                group
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-[var(--marketing-accent)]
                shadow-[0_8px_30px_rgba(255,90,31,0.14)]
                hover:shadow-[0_12px_35px_rgba(255,90,31,0.20)]
              "
            >
              <span>Book a strategy call</span>

              <span
                aria-hidden="true"
                className="button-arrow"
              >
                →
              </span>
            </Link>

            <Link
              href={workHref}
              className="
                button-secondary
                marketing-acrylic
                button-size
                button-text
                inline-flex
                items-center
                justify-center
                rounded-full
                hover:text-white
              "
            >
              View my work
            </Link>
          </div>
        </div>
      </Container>

      {/* ==================================================
          TECHNOLOGY STRIP
      ================================================== */}

      <div
        className="
          relative
          z-20
          mt-auto
          pb-7
          pt-6
          sm:pb-8
        "
      >
        {/* Background transition */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-[230px]
            bg-gradient-to-t
            from-[#020609]
            via-[#020609]/70
            to-transparent
          "
        />

        {/* Soft shadow */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
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

            <p
              className="
                eyebrow
                mb-5
                text-center
                text-white/60
                sm:mb-6
              "
            >
              Technologies I build with
            </p>

            {/* Technology logos */}

            <ul
              aria-label="Technologies I build with"
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
              {technologies.map((technology) => (
                <li
                  key={technology.name}
                  className="
                    flex
                    h-[52px]
                    min-w-[78px]
                    items-center
                    justify-center
                    sm:min-w-[90px]
                  "
                >
                  <Image
                    src={technology.src}
                    alt={technology.name}
                    width={118}
                    height={50}
                    unoptimized
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
                      ${technology.imageClassName}
                    `}
                    style={{
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
