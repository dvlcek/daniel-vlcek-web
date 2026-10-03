"use client";
import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
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

      <div className="relative z-10 mx-auto w-full max-w-[1640px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:py-28">
        <div className="grid gap-12 min-[1280px]:grid-cols-[300px_minmax(0,1fr)] min-[1280px]:items-start min-[1280px]:gap-10 min-[1440px]:grid-cols-[340px_minmax(0,1fr)] min-[1600px]:gap-12">
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
            className="grid min-w-0 scroll-mt-24 gap-5"
          >
            <FeaturedCaseStudy />
            <div className="grid items-stretch gap-5 min-[1280px]:grid-cols-2">
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
      </div>
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
      className="min-w-0 min-[1280px]:sticky min-[1280px]:top-28"
    >
      <div className="flex items-center gap-4">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ transformOrigin: "left" }}
          className="h-px w-10 shrink-0 bg-[var(--accent)]"
        />
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/65">
          Selected Work
        </span>
      </div>

      <h2 className="mt-7 max-w-[580px] text-[44px] font-medium leading-[1.04] tracking-[-0.045em] sm:text-[60px] min-[1280px]:max-w-[340px] min-[1280px]:text-[52px] min-[1440px]:text-[58px]">
        <span className="block">Less busywork.</span>
        <span className="block text-[var(--accent)]">More business.</span>
      </h2>

      <p className="mt-6 max-w-[460px] text-[16px] leading-[1.75] text-white/70 min-[1280px]:max-w-[340px]">
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
        className="mt-10 grid max-w-[440px] grid-cols-3 min-[1280px]:max-w-none"
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
        className="group mt-10 inline-flex min-h-[52px] items-center justify-center gap-5 rounded-full bg-[var(--accent)] px-7 text-sm font-medium text-white shadow-[0_8px_30px_rgba(255,90,31,0.14)] transition-[background-color,box-shadow] duration-200 hover:bg-[var(--accent-hover)] hover:shadow-[0_12px_35px_rgba(255,90,31,0.20)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        <span>Explore selected work</span>
        <ArrowRight size={17} aria-hidden="true" strokeWidth={1.7} className="transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1 motion-reduce:transform-none" />
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
      <div className="relative min-h-[460px]">
        <ProjectVisual
          src={featuredCaseStudy.image}
          alt={featuredCaseStudy.imageAlt}
          priority
          featured
          objectPosition="left center"
        />

        <div className="relative z-10 flex min-h-[460px] min-w-0 max-w-full flex-col p-6 [text-shadow:0_2px_16px_rgba(0,0,0,0.72)] sm:max-w-[65%] sm:p-8 md:max-w-[60%] min-[1600px]:max-w-[54%] min-[1600px]:p-10">
          <ProjectTag>{featuredCaseStudy.eyebrow}</ProjectTag>
          <h3 className="mt-6 max-w-[400px] text-[30px] font-medium leading-[1.12] tracking-[-0.035em] text-white sm:text-[34px]">
            {featuredCaseStudy.title}
          </h3>
          <p className="mt-4 max-w-[400px] text-[15px] leading-[1.7] text-white/75">
            {featuredCaseStudy.subtitle}
          </p>
          {featuredCaseStudy.metrics?.length ? (
            <MetricsRow metrics={featuredCaseStudy.metrics} className="mt-7" />
          ) : null}
          <p className="mt-6 max-w-[380px] text-[13px] leading-[1.65] text-white/65">
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

        <div className="relative z-10 flex h-full min-h-[380px] min-w-0 max-w-full flex-col p-6 [text-shadow:0_2px_14px_rgba(0,0,0,0.72)] sm:max-w-[65%] sm:p-7 min-[1280px]:max-w-[90%] min-[1440px]:max-w-[84%] min-[1600px]:max-w-[78%] min-[1600px]:p-8">
          <ProjectTag compact>{project.eyebrow}</ProjectTag>
          <h3 className="mt-6 max-w-[320px] text-[26px] font-medium leading-[1.12] tracking-[-0.035em] text-white min-[1600px]:text-[28px]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[340px] text-[14px] leading-[1.7] text-white/75">
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

function ProjectTag({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <span className={`inline-flex min-h-8 w-fit max-w-full items-center rounded-full border border-white/[0.12] bg-[#03070b]/35 px-3.5 py-1.5 text-[10px] font-medium uppercase leading-[1.5] text-white/75 ${compact ? "tracking-[0.12em]" : "tracking-[0.16em]"}`}>
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
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={featured ? "(max-width: 1279px) 100vw, 1156px" : "(max-width: 1279px) 100vw, 568px"}
        style={{ objectPosition: featured ? "right center" : objectPosition }}
        className={`${featured ? "origin-right scale-[1.5] object-cover md:object-contain md:object-right [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.515] motion-reduce:group-hover:scale-[1.5]" : "object-cover [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.015] motion-reduce:group-hover:scale-100"} transition-transform duration-500 ease-out motion-reduce:transition-none`}
      />
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
      className={`group/link inline-flex min-h-12 w-fit max-w-full items-center justify-center rounded-full border border-white/[0.16] bg-[#03070b]/40 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06] hover:text-white motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${compact ? "gap-4 px-5" : "gap-5 px-7"}`}
    >
      <span>View case study</span>
      <ArrowRight size={compact ? 14 : 16} aria-hidden="true" strokeWidth={1.7} className="transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover/link:translate-x-1 motion-reduce:transform-none" />
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
