"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    number: "01",
    image: "/images/services/custom-business-software.png",
    imageAlt: "Custom business software operations dashboard",
    title: "Custom Business Software",
    tagline: "Tools that fit your business, not the other way around.",
    description:
      "I design and build internal platforms, operational tools and custom software that solve real business problems and adapt as you grow.",
    examples:
      "Internal platforms, CRMs, dashboards, booking systems, inventory and operations tools.",
    href: "#software",
  },
  {
    number: "02",
    image: "/images/services/automation-applied-ai.png",
    imageAlt: "Automation and applied AI workflow system",
    title: "Automation & Applied AI",
    tagline: "Less manual work. More progress.",
    description:
      "I connect your systems, automate repetitive work and apply AI where it creates real value — so your team can focus on what matters.",
    examples:
      "Workflow automation, AI assistants, intelligent document processing and system integrations.",
    href: "#automation",
  },
  {
    number: "03",
    image: "/images/services/web-client-platforms.png",
    imageAlt: "Modern web and client platform interface",
    title: "Web & Client Platforms",
    tagline: "Digital experiences that drive results.",
    description:
      "I build modern, performant websites and client-facing platforms that communicate your value, serve your customers and integrate with your broader systems.",
    examples:
      "Marketing websites, client portals, web applications, e-commerce and tailored platforms.",
    href: "#web",
  },
];

export function WhatIBuild() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#F6F3EE] text-[#071017]"
    >
      <Container className="relative py-20 md:py-24 xl:py-28">
        {/* top separator */}
        <div className="absolute inset-x-0 top-0 h-px bg-[#071017]/8" />

        {/* ====================================================
            HEADER
        ==================================================== */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
            ease,
          }}
          className="mx-auto max-w-[950px] text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#FF5A1F]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#64727E]">
              What I Build
            </span>
          </div>

          <h2
            className="
              mt-8
              text-[40px]
              font-semibold
              leading-[0.98]
              tracking-[-0.055em]

              sm:text-[48px]
              md:text-[56px]
              xl:text-[62px]
            "
          >
            Systems built around how
            <br className="hidden sm:block" />
            {" "}your business{" "}
            <span className="text-[#FF5A1F]">
              actually works.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-[800px]
              text-[15px]
              leading-7
              text-[#63717D]

              md:text-[17px]
            "
          >
            From internal platforms to automation and customer-facing
            experiences, I build digital infrastructure that removes friction
            and helps the business move forward.
          </p>
        </motion.div>

        {/* ====================================================
            SERVICES
        ==================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.09,
              },
            },
          }}
          className="
            mt-16
            grid
            border-y
            border-[#071017]/10

            lg:grid-cols-3
          "
        >
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              variants={{
                hidden: reduceMotion
                  ? {}
                  : {
                      opacity: 0,
                      y: 18,
                    },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease,
                  },
                },
              }}
              className={[
                `
                  group
                  relative
                  flex
                  flex-col
                  py-9

                  sm:px-5

                  lg:px-7
                  lg:py-10

                  xl:px-9
                `,
                index > 0
                  ? `
                      border-t
                      border-[#071017]/10

                      lg:border-l
                      lg:border-t-0
                    `
                  : "",
              ].join(" ")}
            >
              {/* ==============================================
                  IMAGE
              ============================================== */}
              <div
                className="
                  relative
                  aspect-[3/2]
                  overflow-hidden
                  rounded-[16px]
                  border
                  border-[#071017]/10
                  bg-white
                  shadow-[0_16px_40px_rgba(7,16,23,0.045)]
                "
              >
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="
                    (max-width: 1024px) 100vw,
                    33vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out

                    group-hover:scale-[1.015]
                  "
                />

                {/* subtle edge so image integrates with page */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[inherit]
                    ring-1
                    ring-inset
                    ring-white/35
                  "
                />
              </div>

              {/* ==============================================
                  TEXT
              ============================================== */}
              <div className="mt-7">
                <p className="text-[9px] font-semibold tracking-[0.28em] text-[#89959E]">
                  {service.number}
                </p>

                <h3
                  className="
                    mt-4
                    text-[23px]
                    font-semibold
                    leading-[1.08]
                    tracking-[-0.04em]
                    text-[#071017]

                    xl:text-[26px]
                  "
                >
                  {service.title}
                </h3>

                <p className="mt-3 text-[14px] leading-6 text-[#53636F]">
                  {service.tagline}
                </p>

                <p
                  className="
                    mt-5
                    max-w-[390px]
                    text-[14px]
                    leading-[1.7]
                    text-[#63717D]
                  "
                >
                  {service.description}
                </p>
              </div>

              {/* ==============================================
                  EXAMPLES
              ============================================== */}
              <div className="mt-7 border-t border-[#071017]/10 pt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#89959E]">
                  Examples
                </p>

                <p className="mt-3 max-w-[390px] text-[13px] leading-[1.6] text-[#63717D]">
                  {service.examples}
                </p>
              </div>

              {/* ==============================================
                  CTA
              ============================================== */}
              <div className="mt-auto pt-7">
                <a
                  href={service.href}
                  className="
                    inline-flex
                    items-center
                    gap-4
                    text-[14px]
                    font-medium
                    text-[#071017]
                  "
                >
                  <span
                    className="
                      border-b
                      border-[#071017]/35
                      pb-[2px]
                      transition-colors
                      duration-200

                      group-hover:border-[#FF5A1F]
                    "
                  >
                    Explore
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                      text-[18px]
                      leading-none
                      transition-transform
                      duration-200

                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* ====================================================
            BOTTOM STATEMENT
        ==================================================== */}
        <div
          className="
            flex
            flex-col
            gap-6
            border-b
            border-[#071017]/10
            py-7

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <p className="max-w-[800px] text-[14px] leading-6 text-[#263640]">
            You don&apos;t need to choose a technology first. We start with
            what is slowing the business down.
          </p>

          <a
            href="#process"
            className="
              group
              inline-flex
              shrink-0
              items-center
              gap-4
              text-[14px]
              font-medium
              text-[#071017]
            "
          >
            <span className="border-b border-[#071017]/35 pb-[2px]">
              Explore my approach
            </span>

            <span
              aria-hidden="true"
              className="
                text-[18px]
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}