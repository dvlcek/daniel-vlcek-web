"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    number: "01",
    image: "/images/services/custom-business-software.png",
    imageAlt: "Custom business software operations dashboard",
    title: "Custom Software",
    tagline: "Software that fits how you work.",
    description:
      "When spreadsheets and off-the-shelf tools stop fitting, I build software around your workflow — so your team can manage customers, tasks and operations in one place.",
    examples: ["CRMs and dashboards", "Booking and inventory systems", "Internal business platforms"],
    href: "#business-platform",
    cta: "See a software project",
  },
  {
    number: "02",
    image: "/images/services/automation-applied-ai.png",
    imageAlt: "Automation and applied AI workflow system",
    title: "Automation & AI",
    tagline: "Let the repetitive work run itself.",
    description:
      "I connect your existing tools and automate data entry, follow-ups and document processing. AI handles the tasks it suits, with your team in control of the important decisions.",
    examples: ["Connected tools and workflows", "AI assistants", "Document processing"],
    href: "#ai-operations",
    cta: "See an automation project",
  },
  {
    number: "03",
    image: "/images/services/web-client-platforms.png",
    imageAlt: "Modern web and client platform interface",
    title: "Websites & Web Apps",
    tagline: "Give visitors a reason to get in touch.",
    description:
      "I build fast, clear websites that make your offer easy to understand and act on — plus portals and web apps that let customers book, buy or manage their account.",
    examples: ["Business websites", "Client portals and web apps", "E-commerce experiences"],
    href: "#client-platform",
    cta: "See a web project",
  },
];

export function WhatIBuild() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#F6F3EE] text-[#071017]"
    >
      <Container
        className="relative section-space">

        {/* ====================================================
            HEADER
        ==================================================== */}
        <motion.div
          initial={false}
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
          className="section-intro mx-auto text-center"
        >
          <h2
            className="section-heading section-heading--center"
          >
            Turn visitors into customers.
            <br />
            <span className="text-[#C2410C]">
              Give your team time back.
            </span>
          </h2>

          <p
            className="section-copy intro-gap mx-auto text-[#52616D]"
          >
            Websites that bring enquiries. Software that fits your workflow.
            Automation that takes the repetitive work off your team&apos;s plate.
          </p>
        </motion.div>

        {/* ====================================================
            SERVICES
        ==================================================== */}
        <motion.div
          initial={false}
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
            content-gap
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
                  min-w-0
                  py-9
                  motion-reduce:!opacity-100
                  motion-reduce:!transform-none

                  sm:px-5

                  lg:px-6
                  lg:py-10

                  xl:px-8
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
                  sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 104px), (max-width: 1279px) calc((100vw - 96px) / 3 - 56px), (max-width: 1479px) calc((100vw - 128px) / 3 - 72px), 378px"
                  className="
                    object-cover
                    transition-transform
                    duration-300
                    ease-out

                    [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.015]
                    motion-reduce:transform-none
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
              <div className="mt-7 flex-1">
                <p className="caption font-medium tracking-[0.18em] text-[#52616D]">
                  {service.number}
                </p>

                <h3
                  className="card-title mt-4 text-[#071017]"
                >
                  {service.title}
                </h3>

                <p className="body-copy mt-3 font-medium text-[#263640] lg:min-h-14 xl:min-h-7">
                  {service.tagline}
                </p>

                <p
                  className="body-copy mt-4 max-w-[390px] text-[#52616D]"
                >
                  {service.description}
                </p>
              </div>

              {/* ==============================================
                  EXAMPLES
              ============================================== */}
              <div className="mt-7 border-t border-[#071017]/10 pt-5">
                <p className="eyebrow text-[#52616D]">
                  What I build
                </p>

                <ul className="mt-3 space-y-2 small-copy text-[#52616D]">
                  {service.examples.map((example) => (
                    <li key={example} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[#C2410C]" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ==============================================
                  CTA
              ============================================== */}
              <div className="mt-auto pt-7">
                <a
                  href={service.href}
                  className="button-secondary
                    inline-flex
                    min-h-11
                    items-center
                    rounded-sm
                    gap-4
                    button-text
                    text-[#071017]
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-[#C2410C]
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
                    {service.cta}
                  </span>

                  <span
                    aria-hidden="true"
                    className="button-arrow text-[18px] leading-none"
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
          <p className="max-w-[800px] body-copy text-[#263640]">
            Start with what your business needs most. Build one focused solution,
            or connect the whole workflow.
          </p>

          <Link
            href="/contact" data-contact-source="services"
            className="button-secondary
              group
              inline-flex
              min-h-11
              self-start
              rounded-sm
              shrink-0
              items-center
              gap-4
              button-text
              text-[#071017]
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-[#C2410C]
            "
          >
            <span className="border-b border-[#071017]/35 pb-[2px]">
              Talk about your project
            </span>

            <span
              aria-hidden="true"
              className="button-arrow text-[18px]"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
