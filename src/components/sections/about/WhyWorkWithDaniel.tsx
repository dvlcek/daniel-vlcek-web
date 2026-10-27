"use client";
import Link from "next/link";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";
import styles from "./About.module.css";

const MotionLink = motion.create(Link);

const ease = [0.22, 1, 0.36, 1] as const;

const principles = [
  {
    title: "Direct collaboration",
    description:
      "You speak with the person designing and building your system. Decisions, trade-offs and progress stay clear throughout the project.",
  },
  {
    title: "From strategy to delivery",
    description:
      "I connect business requirements with architecture, implementation and the details that make a product useful day to day.",
  },
];

export function WhyWorkWithDaniel() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease } },
  };

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-20 overflow-hidden bg-[#F6F3EE] text-[#071017]"
    >
      <Container className="relative border-t border-[#071017]/[0.08] section-space">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center xl:gap-16 2xl:grid-cols-[0.78fr_1.22fr] 2xl:gap-16">
          <PartnerVisual reduceMotion={Boolean(reduceMotion)} />

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.075 } },
            }}
            className="min-w-0"
          >
            <motion.div variants={reveal} className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-8 bg-[#FF5A1F]" />
              <span className="eyebrow text-[#5F6C76]">
                About Daniel
              </span>
            </motion.div>

            <motion.h2
              variants={reveal}
              id="about-heading"
              className="section-heading intro-gap"
            >
              Business thinking.
              <br />
              <span className="text-[#C2410C]">Technical execution.</span>
            </motion.h2>

            <motion.div variants={reveal} className="section-copy intro-gap space-y-4 text-[#596773]">
              <p>
                I&apos;m Daniel, a software developer and automation architect.
                I work directly with founders and teams to build websites,
                platforms and workflows around how their business operates.
              </p>
              <p>
                What keeps me engaged is understanding the details: how
                customers buy, how teams work and where time is lost. Those
                details guide what I build, what I simplify and where
                automation can make a difference.
              </p>
            </motion.div>

            <motion.div variants={reveal} className="action-gap grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {principles.map((principle) => (
                <div key={principle.title} className={`${styles.principle} min-w-0`}>
                  <span aria-hidden="true" className={styles.rule} />
                  <h3 className="card-title card-title--small mt-4 text-[#071017]">
                    {principle.title}
                  </h3>
                  <p className="small-copy mt-3 max-w-[360px] text-[#626F79]">
                    {principle.description}
                  </p>
                </div>
              ))}
            </motion.div>

            <MotionLink
              variants={reveal}
              href="/contact" data-contact-source="about"
              style={{ color: "#FFFFFF" }}
              className="button-primary group action-gap inline-flex button-size max-w-full items-center justify-center rounded-full bg-[#071017] button-text shadow-[0_12px_34px_rgba(7,16,23,0.12)] hover:bg-[#101C24] hover:shadow-[0_16px_42px_rgba(7,16,23,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2410C]"
            >
              <span>Discuss your project</span>
              <ArrowRight
                size={17}
                strokeWidth={1.6}
                aria-hidden="true"
                className="button-arrow shrink-0"
              />
            </MotionLink>
            <MotionLink variants={reveal} href="/about" className="mt-4 flex min-h-11 w-fit items-center gap-3 rounded-sm button-text text-[#071017] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2410C]">
              More about Daniel<ArrowRight size={16} aria-hidden="true" />
            </MotionLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function PartnerVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.figure
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease }}
      className="group relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[22px] border border-[#071017]/[0.08] bg-[#020304] shadow-[0_24px_80px_rgba(7,16,23,0.14)] lg:mx-0"
    >
      <div className="relative aspect-[0.78/1] overflow-hidden">
        <Image
          src="/images/about/daniel-portrait-dark.png"
          alt="Portrait of Daniel VLKO"
          fill
          sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 520px, (max-width: 1479px) 40vw, 520px"
          className="object-cover object-[center_30%] transition-transform duration-500 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.015] motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, transparent 42%, rgba(0,0,0,0.10) 67%, rgba(0,0,0,0.68) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0.34) 100%)",
          }}
        />
        <figcaption className="absolute inset-x-6 bottom-7 z-10 sm:inset-x-10 sm:bottom-10">
          <p className="text-[24px] font-medium leading-[1.2] tracking-[-0.025em] text-white sm:text-[28px]">
            Daniel VLKO
          </p>
          <p className="small-copy mt-2 max-w-[340px] text-white/75">
            Software developer &amp; automation architect
          </p>
        </figcaption>
      </div>
    </motion.figure>
  );
}
