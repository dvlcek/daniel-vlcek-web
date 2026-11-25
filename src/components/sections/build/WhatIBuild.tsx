"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/site/MarketingLink";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Container } from "@/components/ui/Container";

import styles from "./WhatIBuild.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DESKTOP_QUERY =
  "(min-width: 900px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)";

const services = [
  {
    id: "web-development",
    title: "Websites & E-commerce",
    benefit: "Built to attract. Designed to convert.",
    description:
      "High-performance websites and online stores built around your brand, your customers and your business goals.",
    capabilities: [
      "Custom websites",
      "E-commerce",
      "Website redesigns",
    ],
    image: "/images/services/web.webp",
    imageAlt: "Custom website development showcase",
    href: "/services/web-development",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    benefit: "Built around your business.",
    description:
      "Purpose-built applications and internal systems that connect your people, data and operations.",
    capabilities: [
      "Business applications",
      "CRM systems",
      "Client portals",
    ],
    image: "/images/services/business-build.webp",
    imageAlt: "Custom business software showcase",
    href: "/services/custom-software",
  },
  {
    id: "automation-ai",
    title: "Automation & AI",
    benefit: "Less work. More impact.",
    description:
      "Intelligent workflows that connect your tools, automate repetitive tasks and give your team more time to focus on growth.",
    capabilities: [
      "Workflow automation",
      "AI integration",
      "Connected systems",
    ],
    image: "/images/services/ai-build.webp",
    imageAlt: "Business automation workflow",
    href: "/services/automation-ai",
  },
] as const;

/** Find the real vertical scroll container and intervening overflow wrappers. */
function getScrollContext(element: HTMLElement) {
  const blocking: HTMLElement[] = [];
  let parent = element.parentElement;

  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = getComputedStyle(parent);
    const scrollable = /^(auto|scroll|overlay)$/.test(style.overflowY);

    if (scrollable && parent.scrollHeight > parent.clientHeight + 2) {
      return { scroller: parent, blocking };
    }

    if (style.overflowY !== "visible" && style.overflowY !== "clip") {
      blocking.push(parent);
    }

    parent = parent.parentElement;
  }

  return { scroller: window, blocking };
}

function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatIBuild() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<ScrollTrigger | null>(null);
  const clickTweenRef = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(0);
  const scrollerRef = useRef<Window | HTMLElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Native sticky where possible; local transform lock for overflow wrappers.
  useGSAP(() => {
    const root = rootRef.current;
    const area = scrollAreaRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!root || !area || !stage || !viewport || !track) return;

    const media = gsap.matchMedia();

    media.add(DESKTOP_QUERY, () => {
      root.dataset.horizontal = "true";

      const { scroller, blocking } = getScrollContext(stage);
      scrollerRef.current = scroller;
      const transformLock = blocking.length > 0;
      root.dataset.lockMode = transformLock ? "transform" : "sticky";

      const updateViewportHeight = () => {
        const height = scroller instanceof HTMLElement
          ? scroller.clientHeight
          : window.innerHeight;
        const value = `${height}px`;
        if (root.style.getPropertyValue("--services-viewport-height") !== value) {
          root.style.setProperty("--services-viewport-height", value);
        }
      };

      updateViewportHeight();

      const distance = () => Math.max(0, area.offsetHeight - stage.offsetHeight);
      const horizontalDistance = () => viewport.clientWidth * (services.length - 1);

      const updateActive = (progress: number) => {
        const index = gsap.utils.clamp(
          0, services.length - 1,
          Math.round(progress * (services.length - 1)),
        );
        if (activeRef.current !== index) {
          activeRef.current = index;
          setActiveIndex(index);
        }
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          id: "services-horizontal",
          trigger: area,
          ...(scroller instanceof HTMLElement ? { scroller } : {}),
          start: "top top",
          end: () => `+=${Math.max(1, distance())}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: updateViewportHeight,
          onUpdate: (self) => updateActive(self.progress),
          onRefresh: (self) => updateActive(self.progress),
        },
      });

      timeline.fromTo(track, { x: 0 }, { x: () => -horizontalDistance() }, 0);

      // If an overflow wrapper prevents native sticky, move the stage by
      // exactly the distance scrolled. No pin spacers or scroll hijacking.
      if (transformLock) {
        timeline.fromTo(stage, { y: 0 }, { y: distance }, 0);
      }

      triggerRef.current = timeline.scrollTrigger ?? null;
      triggerRef.current?.refresh();
      updateActive(triggerRef.current?.progress ?? 0);

      if (process.env.NODE_ENV === "development") {
        console.info("[Services]", {
          lockMode: root.dataset.lockMode,
          scroller: scroller === window ? "window" : scroller,
          blockingAncestors: blocking,
        });
      }

      const cancelClickAnimation = () => {
        clickTweenRef.current?.kill();
        clickTweenRef.current = null;
      };

      const cancelOnKey = (event: KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
          cancelClickAnimation();
        }
      };

      window.addEventListener("wheel", cancelClickAnimation, { passive: true });
      window.addEventListener("touchstart", cancelClickAnimation, { passive: true });
      window.addEventListener("pointerdown", cancelClickAnimation, { passive: true });
      window.addEventListener("keydown", cancelOnKey);

      let frame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          updateViewportHeight();
          triggerRef.current?.refresh();
        });
      });
      observer.observe(viewport);
      observer.observe(area);
      if (scroller instanceof HTMLElement) observer.observe(scroller);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("wheel", cancelClickAnimation);
        window.removeEventListener("touchstart", cancelClickAnimation);
        window.removeEventListener("pointerdown", cancelClickAnimation);
        window.removeEventListener("keydown", cancelOnKey);
        cancelClickAnimation();
        triggerRef.current = null;
        scrollerRef.current = null;
        delete root.dataset.horizontal;
        delete root.dataset.lockMode;
        root.style.removeProperty("--services-viewport-height");
      };
    });

    return () => media.revert();
  }, { scope: rootRef });

  // Native scrolling is immediate; only intentional tab clicks are eased.
  function goToService(index: number, animate = true) {
    const trigger = triggerRef.current;
    const scroller = scrollerRef.current;
    if (!trigger || !scroller) return;

    const safeIndex = gsap.utils.clamp(0, services.length - 1, index);
    const progress = safeIndex / (services.length - 1);
    const target = trigger.start + (trigger.end - trigger.start) * progress;

    clickTweenRef.current?.kill();
    clickTweenRef.current = null;

    const scrollTo = (top: number) => {
      scroller.scrollTo({ top, behavior: "instant" });
      ScrollTrigger.update();
    };

    if (!animate) {
      scrollTo(target);
      return;
    }

    const position = { y: trigger.scroll() };
    clickTweenRef.current = gsap.to(position, {
      y: target,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => scrollTo(position.y),
      onComplete: () => { clickTweenRef.current = null; },
      onInterrupt: () => { clickTweenRef.current = null; },
    });
  }

  return (
    <section
      ref={rootRef}
      id="services"
      aria-labelledby="services-heading"
      className={styles.section}
    >
      <Container className="section-space">

        {/* INTRO */}

        <div className={styles.intro}>
          <p className="eyebrow text-[#52616D]">
            What I do
          </p>

          <h2
            id="services-heading"
            className={styles.heading}
          >
            Technology that moves
            <br className="hidden md:block" />
            {" "}your business forward.
          </h2>

          <p className={styles.introDescription}>
            From your digital presence to the systems
            behind your business.
          </p>
        </div>

        {/* STICKY SCROLL AREA */}

        <div
          ref={scrollAreaRef}
          className={styles.scrollArea}
          data-services-scroll-area
        >
          <div
            ref={stageRef}
            className={styles.stage}
            data-services-stage
          >
            {/* MINIMAL NAVIGATION */}

            <nav
              className={styles.navigation}
              aria-label="Explore services"
            >
              {services.map((service, index) => (
                <button
                  key={service.id}
                  type="button"
                  aria-current={
                    activeIndex === index
                      ? "true"
                      : undefined
                  }
                  aria-controls={`service-${service.id}`}
                  onClick={() => goToService(index)}
                  className={styles.navButton}
                >
                  {service.title}
                </button>
              ))}
            </nav>

            {/* FIXED VISUAL FRAME */}

            <div
              ref={viewportRef}
              className={styles.viewport}
            >
              <div
                ref={trackRef}
                className={styles.track}
              >
                {services.map((service, index) => (
                  <article
                    key={service.id}
                    id={`service-${service.id}`}
                    className={styles.panel}
                    onFocusCapture={(event) => {
                      if (
                        event.target instanceof HTMLElement &&
                        event.target.matches(":focus-visible")
                      ) {
                        goToService(index, false);
                      }
                    }}
                  >
                    <div className={styles.content}>
                      <h3 className={styles.title}>
                        {service.title}
                      </h3>

                      <p className={styles.benefit}>
                        {service.benefit}
                      </p>

                      <p className={styles.description}>
                        {service.description}
                      </p>

                      <ul className={styles.capabilities}>
                        {service.capabilities.map(
                          (capability) => (
                            <li key={capability}>
                              {capability}
                            </li>
                          ),
                        )}
                      </ul>

                      <Link
                        href={service.href}
                        aria-label={`Learn more about ${service.title}`}
                        className={styles.serviceLink}
                      >
                        Learn more
                        <Arrow />
                      </Link>
                    </div>

                    <div className={styles.visual}>
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        sizes="
                          (min-width: 1480px) 650px,
                          (min-width: 900px) 45vw,
                          90vw
                        "
                        className={styles.image}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CLOSING STATEMENT */}

        <div className={styles.footer}>
          <p>
            One technical partner.
            Connected solutions.
          </p>

          <Link
            href="/contact"
            data-contact-source="services"
            className={styles.contactLink}
          >
            Let&apos;s build something together
            <Arrow />
          </Link>
        </div>

      </Container>
    </section>
  );
}
