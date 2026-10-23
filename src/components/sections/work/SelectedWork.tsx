"use client";
import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import styles from "./SelectedWork.module.css";

import {
  featuredCaseStudy,
  secondaryCaseStudies,
  selectedWorkIntroStats,
  type AnimatedMetric as AnimatedMetricType,
  type WorkCaseStudy,
  type WorkMetric,
} from "./selectedWork.data";

const ease = [0.22, 1, 0.36, 1] as const;

export function SelectedWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="work" className="relative isolate overflow-hidden bg-[#03070b] text-white">
      <SelectedWorkBackground />

      <Container className="relative z-10 section-space max-w-[1640px] xl:px-12">
        <div className="grid gap-12 min-[1536px]:grid-cols-[320px_minmax(0,1fr)] min-[1536px]:items-start">
          <SelectedWorkIntro reduceMotion={reduceMotion} />

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
            <FeaturedCaseStudy />
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

function SelectedWorkIntro({ reduceMotion }: { reduceMotion: boolean | null }) {
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

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
        }}
        className={`${styles.introStats} mt-10 grid max-w-[440px] grid-cols-3 min-[1536px]:max-w-none`}
      >
        {selectedWorkIntroStats.map((metric, index) => (
          <motion.div
            key={metric.label}
            variants={{
              hidden: reduceMotion ? {} : { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease } },
            }}
            className={index > 0 ? "min-w-0 border-l border-white/[0.08] px-4" : "min-w-0 pr-4"}
          >
            <div className="text-[32px] font-medium leading-none tracking-[-0.04em] text-white tabular-nums sm:text-[36px]">
              <AnimatedNumber metric={metric} />
            </div>
            <p className="mt-3 max-w-[110px] break-words text-[12px] leading-[1.5] text-white/65">
              {metric.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.a
        href="#case-studies"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.48, delay: 0.27, ease }}
        className={`button-primary ${styles.introAction} group action-gap inline-flex button-size w-fit items-center justify-center rounded-full bg-[var(--accent)] button-text text-white shadow-[0_8px_30px_rgba(255,90,31,0.14)] hover:bg-[var(--accent-hover)] hover:shadow-[0_12px_35px_rgba(255,90,31,0.20)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]`}
      >
        <span>Explore selected work</span>
        <ArrowRight size={17} aria-hidden="true" strokeWidth={1.7} className="button-arrow" />
      </motion.a>
    </motion.div>
  );
}

function FeaturedCaseStudy() {
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
          src={featuredCaseStudy.image}
          alt={featuredCaseStudy.imageAlt}
          priority
          featured
        />

        <div className="relative z-10 flex min-h-[460px] md:min-h-[520px] min-w-0 max-w-full flex-col p-6 [text-shadow:0_2px_16px_rgba(0,0,0,0.72)] sm:max-w-[65%] sm:p-8 md:max-w-[56%] min-[1600px]:p-10">
          <ProjectTag>{featuredCaseStudy.eyebrow}</ProjectTag>
          <h3 className="card-title card-title--featured mt-6 max-w-[400px] text-white">
            {featuredCaseStudy.title}
          </h3>
          <p className="mt-4 max-w-[400px] body-copy text-white/75">
            {featuredCaseStudy.subtitle}
          </p>
          {featuredCaseStudy.metrics?.length ? (
            <MetricsRow metrics={featuredCaseStudy.metrics} className="mt-7" />
          ) : null}
          <p className="mt-6 max-w-[380px] small-copy text-white/65">
            One connected system for customers, operations and visibility —
            without the usual manual handoffs.
          </p>
          <div className="mt-auto pt-6">
            <CaseStudyLink href={featuredCaseStudy.href} title={featuredCaseStudy.title} />
          </div>
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
          {project.metrics?.length ? (
            <MetricsRow metrics={project.metrics} compact className="mt-6" />
          ) : null}
          <div className="mt-auto pt-6">
            <CaseStudyLink href={project.href} title={project.title} compact />
          </div>
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
        <AnimatedMetricValue value={value} label={label} />
      </div>
      <p className="mt-2 max-w-[108px] break-words text-[12px] leading-[1.5] text-white/70">{label}</p>
    </div>
  );
}

function AnimatedMetricValue({ value, label }: { value: string; label: string }) {
  const numericValue = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!numericValue) return value;

  return (
    <AnimatedNumber
      metric={{
        value: Number(numericValue[2]),
        prefix: numericValue[1],
        suffix: numericValue[3],
        decimals: numericValue[2].split(".")[1]?.length ?? 0,
        direction: "up",
        label,
      }}
    />
  );
}

function CaseStudyLink({ href, title, compact = false }: { href: string; title: string; compact?: boolean }) {
  return (
    <a
      href={href}
      aria-label={`View case study: ${title}`}
      className={`button-secondary group/link inline-flex min-h-12 w-fit max-w-full items-center justify-center rounded-full border border-white/[0.16] bg-[#03070b]/40 button-text text-white/90 backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${compact ?"gap-4 px-5" :"gap-6 px-7"}`}
    >
      <span>View case study</span>
      <ArrowRight size={compact ? 14 : 16} aria-hidden="true" strokeWidth={1.7} className="button-arrow" />
    </a>
  );
}

function AnimatedNumber({ metric }: { metric: AnimatedMetricType }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(() => {
    if (reduceMotion) return metric.value;
    if (metric.direction === "down") return metric.from ?? Math.max(metric.value + 5, metric.value * 1.5);
    return metric.from ?? 0;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      const reducedMotionFrame = requestAnimationFrame(() => {
        setValue(metric.value);
      });
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    const startValue = metric.direction === "down"
      ? metric.from ?? Math.max(metric.value + 5, metric.value * 1.5)
      : metric.from ?? 0;
    const duration = metric.direction === "down" ? 900 : 1050;
    const startTime = performance.now();
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startValue + (metric.value - startValue) * eased);
      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [inView, metric.direction, metric.from, metric.value, reduceMotion]);

  return (
    <span ref={ref}>
      <span className="sr-only">{metric.prefix ?? ""}{metric.value.toFixed(metric.decimals ?? 0)}{metric.suffix ?? ""}</span>
      <span aria-hidden="true">{metric.prefix ?? ""}{(reduceMotion ? metric.value : value).toFixed(metric.decimals ?? 0)}{metric.suffix ?? ""}</span>
    </span>
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
