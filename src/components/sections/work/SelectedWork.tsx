"use client";
import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";

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

      <div className="relative z-10 mx-auto w-full max-w-[1528px] px-5 pb-[132px] pt-20 sm:px-8 sm:pb-[144px] sm:pt-24 lg:pt-28 min-[1280px]:px-8 min-[1280px]:pb-[152px] min-[1280px]:pt-[108px] min-[1520px]:px-0">
        <div className="grid gap-16 min-[1280px]:grid-cols-[320px_minmax(0,1fr)] min-[1280px]:items-start min-[1280px]:gap-8 min-[1440px]:grid-cols-[340px_minmax(0,1fr)] min-[1440px]:gap-9">
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
            className="grid min-w-0 gap-4"
          >
            <FeaturedCaseStudy />
            <div className="grid gap-4 min-[1440px]:grid-cols-2">
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
      {/* <div className="flex items-center gap-4">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ transformOrigin: "left" }}
          className="h-px w-10 shrink-0 bg-[var(--accent)]"
        />
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/50">
          Selected Work
        </span>
      </div> */}

      <h2 className="mt-10 max-w-[350px] text-[42px] font-medium leading-[0.97] tracking-[-0.052em] min-[430px]:text-[44px] sm:max-w-[520px] sm:text-[52px] min-[1280px]:max-w-[320px] min-[1280px]:text-[52px] min-[1600px]:max-w-[350px] min-[1600px]:text-[60px]">
        <span className="block">Systems that</span>
        <span className="block">make the</span>
        <span className="block">business</span>
        <span className="block text-[var(--accent)]">move faster.</span>
      </h2>

      <p className="mt-7 max-w-[320px] text-[14px] leading-[1.72] text-white/55 sm:max-w-[420px] min-[1280px]:max-w-[310px] min-[1600px]:text-[15px]">
        A selection of digital systems built to reduce manual work, connect
        operations and create measurable business outcomes.
      </p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
        }}
        className="mt-12 grid max-w-[390px] grid-cols-3 sm:max-w-[440px] min-[1280px]:max-w-none"
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
            <div className="text-[25px] font-medium leading-none tracking-[-0.05em] text-white min-[1600px]:text-[27px]">
              <AnimatedNumber metric={metric} />
            </div>
            <p className="mt-2.5 max-w-[92px] text-[10px] leading-[1.4] text-white/52 min-[1600px]:text-[11px]">
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
        className="group mt-11 inline-flex h-[50px] items-center rounded-full border border-white/[0.14] pr-6 text-[12px] font-medium text-white/88 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03070b]"
      >
        <span className="-ml-px flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
          <ArrowRight size={16} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
        <span className="ml-5">Explore selected work</span>
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
        hidden: reduceMotion ? {} : { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease } },
      }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.24, ease }}
      className="group relative min-w-0 overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.015] transition-colors duration-300 hover:border-white/[0.14]"
    >
      <div className="relative min-h-[430px] min-[1280px]:h-[430px] min-[1440px]:h-[440px]">
        <ProjectVisual
          src={featuredCaseStudy.image}
          alt={featuredCaseStudy.imageAlt}
          priority
          featured
          objectPosition="left center"
        />

        <div className="relative z-10 flex min-h-[430px] min-w-0 max-w-[88%] flex-col p-6 [text-shadow:0_2px_16px_rgba(0,0,0,0.72)] md:max-w-[44%] md:p-7 min-[1280px]:min-h-0 min-[1440px]:p-8">
          <ProjectTag>{featuredCaseStudy.eyebrow}</ProjectTag>
          <h3 className="mt-6 max-w-[340px] text-[28px] font-medium leading-[1.04] tracking-[-0.04em] text-white min-[1440px]:text-[30px]">
            {featuredCaseStudy.title}
          </h3>
          <p className="mt-4 max-w-[330px] text-[13px] leading-[1.65] text-white/56 min-[1440px]:text-[14px]">
            {featuredCaseStudy.subtitle}
          </p>
          {featuredCaseStudy.metrics?.length ? (
            <MetricsRow metrics={featuredCaseStudy.metrics} className="mt-7" />
          ) : null}
          <p className="mt-5 max-w-[305px] text-[11px] leading-[1.55] text-white/50">
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
        hidden: reduceMotion ? {} : { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.64, ease } },
      }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.24, ease }}
      className="group relative min-w-0 overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.015] transition-colors duration-300 hover:border-white/[0.14]"
    >
      <div className="relative min-h-[350px] min-[1280px]:h-[360px] min-[1440px]:h-[372px]">
        <ProjectVisual
          src={project.image}
          alt={project.imageAlt}
          background
          lightOverlay
          strongerOverlay={id === "ai-operations"}
          objectPosition={id === "ai-operations" ? "53% center" : "70% center"}
        />

        <div className="relative z-10 flex min-h-[350px] min-w-0 max-w-[88%] flex-col p-6 [text-shadow:0_2px_14px_rgba(0,0,0,0.72)] md:max-w-[55%] min-[1280px]:min-h-0 min-[1440px]:max-w-[52%] min-[1440px]:p-7">
          <ProjectTag compact>{project.eyebrow}</ProjectTag>
          <h3 className="mt-5 max-w-[280px] text-[23px] font-medium leading-[1.05] tracking-[-0.04em] text-white min-[1600px]:text-[25px]">
            {project.title}
          </h3>
          <p className="mt-3.5 max-w-[300px] text-[12px] leading-[1.65] text-white/55 min-[1600px]:text-[13px]">
            {project.subtitle}
          </p>
          {project.metrics?.length ? (
            <MetricsRow metrics={project.metrics} compact className="mt-6" />
          ) : null}
          <div className="mt-auto pt-4">
            <CaseStudyLink href={project.href} title={project.title} compact />
          </div>
        </div>

      </div>
    </motion.article>
  );
}

function ProjectTag({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <span className={`inline-flex h-[30px] w-fit max-w-full items-center rounded-full border border-white/[0.14] font-medium uppercase text-white/68 ${compact ? "px-3 text-[9px] tracking-[0.16em]" : "px-3.5 text-[9px] tracking-[0.18em]"}`}>
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
        sizes={featured ? "(max-width: 1279px) 100vw, 1144px" : "(max-width: 1439px) 100vw, 564px"}
        style={{ objectPosition: featured ? "right center" : objectPosition }}
        className={`${featured ? "origin-right scale-[1.5] object-cover md:object-contain md:object-right" : "object-cover"} transition-transform duration-[900ms] ease-out ${featured ? "" : "group-hover:scale-[1.012]"} motion-reduce:transition-none`}
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
    <div className={`grid grid-cols-3 ${className}`}>
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
    <div className={separated ? "min-w-0 border-l border-white/[0.08] px-3" : "min-w-0 pr-3"}>
      <div className={`font-medium leading-none tracking-[-0.04em] text-white ${compact ? "text-[16px] min-[1600px]:text-[18px]" : "text-[18px] min-[1600px]:text-[20px]"}`}>
        {value}
      </div>
      <p className="mt-2 break-words text-[9px] leading-[1.35] text-white/52 min-[1600px]:text-[10px]">{label}</p>
    </div>
  );
}

function CaseStudyLink({ href, title, compact = false }: { href: string; title: string; compact?: boolean }) {
  return (
    <a
      href={href}
      aria-label={`View case study: ${title}`}
      className={`group/link inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.14] font-medium text-white/86 transition-colors duration-300 hover:border-white/[0.24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#03070b] ${compact ? "min-w-[168px] gap-7 px-5 text-[11px]" : "min-w-[184px] gap-8 px-6 text-[12px]"}`}
    >
      <span>View case study</span>
      <ArrowRight size={compact ? 12 : 13} strokeWidth={1.7} className="transition-transform duration-300 group-hover/link:translate-x-0.5" />
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
      {metric.prefix ?? ""}{value.toFixed(metric.decimals ?? 0)}{metric.suffix ?? ""}
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
