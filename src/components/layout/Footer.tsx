"use client";

import type { ReactNode } from "react";

import {
  ArrowRight,
  Code2,
  Mail,
} from "lucide-react";

import { Container } from "@/components/ui/Container";

const navLinks = [
  {
    label: "Work",
    href: "/#work",
  },
  {
    label: "Services",
    href: "/#services",
  },
  {
    label: "Process",
    href: "/#process",
  },
  {
    label: "About",
    href: "/#about",
  },
];

export function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden

        border-t
        border-white/[0.10]

        bg-[#02070B]
        text-white
      "
    >
      <Container
        className="
          relative

          py-10
          md:py-12
          xl:py-14
        "
      >
        {/* ======================================================
            MAIN ROW
        ====================================================== */}

        <div
          className="
            grid
            gap-10

            md:grid-cols-[1fr_auto]
            md:items-start

            xl:grid-cols-[0.95fr_auto_1.05fr]
            xl:items-start
            xl:gap-14
          "
        >
          {/* ====================================================
              BRAND
          ==================================================== */}

          <div>
            <a
              href="/"
              style={{
                color: "#FFFFFF",
              }}
              className="
                inline-block

                text-[11px]
                font-semibold
                uppercase
                tracking-[0.28em]

                transition-opacity
                duration-200

                hover:opacity-70
              "
            >
              Daniel VLKO
            </a>

            <p
              className="
                mt-3
                max-w-[340px]

                text-[9px]
                font-medium
                uppercase
                leading-[1.8]
                tracking-[0.22em]

                text-white/40
              "
            >
              Software Developer &amp; Automation Architect
              <br />
              Building scalable digital systems.
            </p>
          </div>

          {/* ====================================================
              NAVIGATION
          ==================================================== */}

          <nav
            aria-label="Footer navigation"
            className="
              flex
              flex-wrap

              gap-x-8
              gap-y-3

              md:justify-end

              xl:justify-center
              xl:gap-x-10
            "
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: "rgba(255,255,255,0.62)",
                }}
                className="
                  text-[12px]
                  font-medium

                  transition-colors
                  duration-200

                  hover:!text-white
                "
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ====================================================
              CONTACT / CTA
          ==================================================== */}

          <div
            className="
              md:col-span-2
              md:flex
              md:items-end
              md:justify-between
              md:gap-8

              xl:col-span-1
              xl:block
            "
          >
            {/* CTA */}

            <div
              className="
                max-w-[360px]

                xl:ml-auto
                xl:max-w-[330px]
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.30em]

                  text-white/30
                "
              >
                Start a conversation
              </p>

              <p
                className="
                  mt-3

                  text-[16px]
                  font-medium
                  leading-[1.35]
                  tracking-[-0.025em]

                  text-white/88
                "
              >
                Have a business problem worth solving?
              </p>

              <a
                href="/contact"
                style={{
                  color: "#FFFFFF",
                }}
                className="
                  group

                  mt-5

                  inline-flex
                  h-[42px]

                  items-center
                  justify-center
                  gap-5

                  rounded-full

                  bg-[#FF5A1F]

                  px-5

                  text-[11px]
                  font-medium

                  shadow-[0_10px_28px_rgba(255,90,31,0.13)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#FF6932]
                "
              >
                Book a discovery call

                <ArrowRight
                  size={14}
                  strokeWidth={1.7}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                />
              </a>

              {/* GENERAL EMAIL */}

              <div
                className="
                  mt-5

                  flex
                  items-center
                  gap-3
                "
              >
                <Mail
                  size={14}
                  strokeWidth={1.55}
                  className="text-white/28"
                />

                <div>
                  <p
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.20em]

                      text-white/25
                    "
                  >
                    General enquiries
                  </p>

                  <a
                    href="mailto:hello@danielvlko.com"
                    style={{
                      color: "rgba(255,255,255,0.50)",
                    }}
                    className="
                      mt-1
                      inline-block

                      text-[10px]

                      transition-colors
                      duration-200

                      hover:!text-white
                    "
                  >
                    hello@danielvlko.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM AREA
        ====================================================== */}

        <div
          className="
            mt-11

            border-t
            border-white/[0.07]

            pt-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* SOCIALS */}

            <div className="flex items-center gap-1">
              {/* LINKEDIN */}

              <SocialLink
                href="#"
                label="LinkedIn"
              >
                <span
                  className="
                    relative
                    top-[-1px]

                    text-[15px]
                    font-bold
                    leading-none
                    tracking-[-0.07em]
                  "
                >
                  in
                </span>
              </SocialLink>

              {/* GITHUB */}

              <SocialLink
                href="#"
                label="GitHub"
              >
                <Code2
                  size={17}
                  strokeWidth={1.65}
                />
              </SocialLink>

              {/* EMAIL */}

              <SocialLink
                href="mailto:hello@danielvlko.com"
                label="Email"
              >
                <Mail
                  size={17}
                  strokeWidth={1.6}
                />
              </SocialLink>
            </div>

            {/* MICRO COPY */}

            <p
              className="
                text-[8px]
                font-medium
                uppercase
                leading-[1.75]
                tracking-[0.24em]

                text-white/25

                sm:text-center
              "
            >
              Building calmer businesses
              <br className="hidden sm:block" />
              {" "}
              through better systems.
            </p>

            {/* COPYRIGHT */}

            <div
              className="
                flex
                flex-col
                gap-1

                sm:items-end
              "
            >
              <p
                className="
                  text-[9px]
                  text-white/28
                "
              >
                © {new Date().getFullYear()} Daniel VLKO.
                All rights reserved.
              </p>

              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.22em]

                  text-white/20
                "
              >
                Built with purpose.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ============================================================
   SOCIAL LINK
============================================================ */

type SocialLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};

function SocialLink({
  href,
  label,
  children,
}: SocialLinkProps) {
  const external =
    href.startsWith("http");

  return (
    <a
      href={href}
      aria-label={label}
      target={
        external
          ? "_blank"
          : undefined
      }
      rel={
        external
          ? "noreferrer"
          : undefined
      }
      style={{
        color: "rgba(255,255,255,0.58)",
      }}
      className="
        group

        inline-flex
        h-9
        w-9

        items-center
        justify-center

        rounded-full

        border
        border-transparent

        transition-all
        duration-200

        hover:border-white/[0.08]
        hover:bg-white/[0.055]
        hover:!text-white
      "
    >
      <span
        className="
          transition-transform
          duration-200

          group-hover:scale-[1.06]
        "
      >
        {children}
      </span>
    </a>
  );
}