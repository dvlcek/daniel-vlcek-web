"use client";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import styles from "./SelectedWork.module.css";

import {
  featuredCaseStudy,
  secondaryCaseStudies,
  type WorkCaseStudy,
  type WorkMetric,
} from "./selectedWork.data";

const MotionLink = motion.create(Link);

const ease = [0.22, 1, 0.36, 1] as const;

export function SelectedWork({ workHref = "#case-studies", projectHref, featuredProject = featuredCaseStudy }: { workHref?: string; projectHref?: string; featuredProject?: WorkCaseStudy }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="work" className="relative isolate overflow-hidden bg-[#03070b] text-white">
      <SelectedWorkBackground />

      <Container className="relative z-10 section-space max-w-[1640px] xl:px-12">
        <div className="grid gap-12 min-[1536px]:grid-cols-[320px_minmax(0,1fr)] min-[1536px]:items-start">
          <SelectedWorkIntro reduceMotion={reduceMotion} workHref={workHref} />

          <motion.div
            id="case-studies"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
            }}
            className="grid min-w-0 scroll-mt-24 gap-6"
          >
            <FeaturedCaseStudy project={featuredProject} href={projectHref} />
            <div className="grid items-stretch gap-6 min-[1280px]:grid-cols-2">
              {secondaryCaseStudies.slice(0, 2).map((project, index) => (
                <SecondaryCaseStudy
                  key={project.title}
                  project={project}
                  id={index === 0 ? "ai-operations" : "client-platform"}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function SelectedWorkIntro({ reduceMotion, workHref }: { reduceMotion: boolean | null; workHref: string }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.68, ease }}
      className={`${styles.intro} min-w-0 min-[1536px]:sticky min-[1536px]:top-28`}
    >
      <div className="flex items-center gap-4 lg:col-start-1">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ transformOrigin: "left" }}
          className="h-px w-10 shrink-0 bg-[var(--accent)]"
        />
        <span className="eyebrow text-white/65">
          Selected Work
        </span>
      </div>

      <h2 className={`${styles.introHeading} section-heading intro-gap lg:col-start-1`}>
        <span className="block">Less busywork.</span>
        <span className="block text-[var(--accent)]">More business.</span>
      </h2>

      <p className="section-copy intro-gap max-w-[560px] text-white/70 lg:col-start-1 min-[1536px]:max-w-[320px]">
        See how custom platforms, automation and better digital experiences
        turn everyday bottlenecks into room to grow.
      </p>

      <MotionLink
        href={workHref}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.48, delay: 0.27, ease }}
        className={`button-primary button-accent ${styles.introAction} group action-gap inline-flex button-size w-fit items-center justify-center rounded-full bg-[var(--accent)] button-text text-white shadow-[0_8px_30px_rgba(255,90,31,0.14)] hover:bg-[var(--accent-hover)] hover:shadow-[0_12px_35px_rgba(255,90,31,0.20)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]`}
      >
        <span>Explore selected work</span>
        <ArrowRight size={17} aria-hidden="true" strokeWidth={1.7} className="button-arrow" />
      </MotionLink>
    </motion.div>
  );
}

function FeaturedCaseStudy({ project, href }: { project: WorkCaseStudy; href?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id="business-platform"
      variants={{
        hidden: reduceMotion ? {} : { opacity: 0 },
        visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.55, ease } },
      }}
      className={`${styles.card} group relative min-w-0 overflow-hidden rounded-[20px]`}
    >
      <div className="relative min-h-[460px] md:min-h-[520px]">
        <ProjectVisual
          src={project.image}
          alt={project.imageAlt}
          priority
          featured
        />

        <div className="relative z-10 flex min-h-[460px] md:min-h-[520px] min-w-0 max-w-full flex-col p-6 [text-shadow:0_2px_16px_rgba(0,0,0,0.72)] sm:max-w-[65%] sm:p-8 md:max-w-[56%] min-[1600px]:p-10">
          <ProjectTag>{project.eyebrow}</ProjectTag>
          <h3 className="card-title card-title--featured mt-6 max-w-[400px] text-white">
            {href ? <Link href={href} className="rounded-sm underline decoration-white/40 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">{project.title}</Link> : project.title}
          </h3>
          <p className="mt-4 max-w-[400px] body-copy text-white/75">
            {project.subtitle}
          </p>
          {project.metrics?.length ? (
            <MetricsRow metrics={project.metrics} className="mt-7" />
          ) : null}
          <p className="mt-6 max-w-[380px] small-copy text-white/65">
            {project.description}
          </p>
          {href && <Link href={href} className="button-secondary mt-5 inline-flex min-h-11 w-fit items-center gap-3 rounded-sm button-text text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Explore the project<ArrowRight size={16} aria-hidden="true" className="button-arrow" /></Link>}
        </div>

      </div>
    </motion.article>
  );
}

function SecondaryCaseStudy({ project, id }: { project: WorkCaseStudy; id: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id={id}
      variants={{
        hidden: reduceMotion ? {} : { opacity: 0 },
        visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.55, ease } },
      }}
      className={`${styles.card} group relative min-w-0 overflow-hidden rounded-[20px]`}
    >
      <div className="relative h-full min-h-[380px]">
        <ProjectVisual
          src={project.image}
          alt={project.imageAlt}
          background
          lightOverlay
          strongerOverlay={id === "ai-operations"}
          objectPosition={id === "ai-operations" ? "53% center" : "70% center"}
        />

        <div className="relative z-10 flex h-full min-h-[380px] min-w-0 max-w-full flex-col p-6 [text-shadow:0_2px_14px_rgba(0,0,0,0.72)] sm:max-w-[65%] sm:p-8 min-[1280px]:max-w-[70%]">
          <ProjectTag>{project.eyebrow}</ProjectTag>
          <h3 className="card-title mt-6 max-w-[320px] text-white">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[340px] body-copy text-white/75">
            {project.subtitle}
          </p>
          {project.href && <Link href={project.href} className="button-secondary mt-5 inline-flex min-h-11 w-fit items-center gap-3 rounded-sm button-text text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">{project.cta}<ArrowRight size={16} aria-hidden="true" className="button-arrow" /></Link>}
        </div>

      </div>
    </motion.article>
  );
}

function ProjectTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-8 w-fit max-w-full items-center rounded-full border border-white/[0.12] bg-[#03070b]/35 px-3.5 py-1.5 eyebrow text-white/75">
      {children}
    </span>
  );
}

function ProjectVisual({
  src,
  alt,
  objectPosition,
  featured = false,
  background = false,
  lightOverlay = false,
  strongerOverlay = false,
  priority = false,
}: {
  src: ImageProps["src"];
  alt: string;
  objectPosition?: string;
  featured?: boolean;
  background?: boolean;
  lightOverlay?: boolean;
  strongerOverlay?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={featured || background ? "absolute inset-0 z-0 min-w-0 overflow-hidden bg-[#03070b]" : "relative aspect-[16/10] min-w-0 overflow-hidden bg-[#03070b] md:aspect-auto md:min-h-full"}>
      <div className={featured ? styles.featuredImageFrame : "absolute inset-0"}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={featured ? "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1535px) calc(100vw - 96px), 1176px" : "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1279px) calc(100vw - 96px), (max-width: 1535px) calc((100vw - 120px) / 2), 576px"}
          style={{ objectPosition }}
          className={`${featured ? styles.featuredImage : ""} object-cover [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.015] motion-reduce:group-hover:scale-100 transition-transform duration-500 ease-out motion-reduce:transition-none`}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: featured
            ? "linear-gradient(90deg, #03070b 0%, #03070b 24%, rgba(3,7,11,0.98) 34%, rgba(3,7,11,0.88) 44%, rgba(3,7,11,0.68) 56%, rgba(3,7,11,0.42) 69%, rgba(3,7,11,0.16) 83%, rgba(3,7,11,0) 100%)"
            : background
              ? lightOverlay
                ? strongerOverlay
                  ? "linear-gradient(90deg, rgba(3,7,11,0.97) 0%, rgba(3,7,11,0.86) 34%, rgba(3,7,11,0.58) 53%, rgba(3,7,11,0.22) 72%, rgba(3,7,11,0) 100%)"
                  : "linear-gradient(90deg, rgba(3,7,11,0.92) 0%, rgba(3,7,11,0.78) 34%, rgba(3,7,11,0.52) 53%, rgba(3,7,11,0.2) 72%, rgba(3,7,11,0) 100%)"
                : "linear-gradient(90deg, #03070b 0%, rgba(3,7,11,0.98) 32%, rgba(3,7,11,0.84) 48%, rgba(3,7,11,0.5) 64%, rgba(3,7,11,0.12) 82%, rgba(3,7,11,0) 100%)"
              : "linear-gradient(90deg, #03070b 0%, rgba(3,7,11,0.78) 15%, rgba(3,7,11,0.18) 46%, rgba(3,7,11,0) 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(0deg, rgba(3,7,11,0.72) 0%, rgba(3,7,11,0.42) 58%, rgba(3,7,11,0.08) 100%)" }}
      />
    </div>
  );
}

function MetricsRow({
  metrics,
  compact = false,
  className = "",
}: {
  metrics: WorkMetric[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`${compact ? "grid grid-cols-3" : "flex flex-wrap gap-y-4"} ${className}`}>
      {metrics.slice(0, 3).map((metric, index) => (
        <MetricItem key={metric.label} value={metric.value} label={metric.label} separated={index > 0} compact={compact} />
      ))}
    </div>
  );
}

function MetricItem({
  value,
  label,
  separated = false,
  compact = false,
}: {
  value: string;
  label: string;
  separated?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={separated ? "min-w-0 border-l border-white/[0.1] px-2 sm:px-3" : "min-w-0 pr-2 sm:pr-3"}>
      <div className={`font-medium leading-[1.15] tracking-[-0.035em] text-white tabular-nums ${compact ? "text-[22px] sm:text-[24px] min-[1600px]:text-[28px]" : "text-[20px]"}`}>
        {value}
      </div>
      <p className="mt-2 max-w-[108px] break-words text-[12px] leading-[1.5] text-white/70">{label}</p>
    </div>
  );
}

function SelectedWorkBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#03070b]" />
      <div
        className="absolute inset-x-0 top-0 h-[440px]"
        style={{ background: "radial-gradient(ellipse at 67% 0%, rgba(28,56,70,0.045), transparent 70%)" }}
      />
      <div
        className="absolute right-[-320px] top-[180px] h-[620px] w-[620px] rounded-full blur-[220px]"
        style={{ background: "rgba(255,90,31,0.024)" }}
      />
    </div>
  );
}
