"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const motion = {
  intro: { y: 14, duration: 0.72 },
  portrait: { y: 18, duration: 0.9 },
  project: { y: 14, duration: 0.78 },
  step: { y: 12, duration: 0.65 },
  detail: { y: 8, duration: 0.55 },
  closing: { y: 16, duration: 0.85 },
} as const;

type Preset = keyof typeof motion;

/** Opt-in entrance motion. Content is visible in SSR, with JS disabled,
 * and while reduced motion is enabled. No global scroll controller. */
export function MarketingReveal() {
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const media = gsap.matchMedia();
    const completed = new WeakSet<HTMLElement>();

    media.add({
      enabled: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1100px)",
    }, (context) => {
      if (!context.conditions?.enabled) return;
      const desktop = Boolean(context.conditions.desktop);
      const targets = Array.from(section.querySelectorAll<HTMLElement>("[data-marketing-reveal]"));
      let stepIndex = 0;

      for (const target of targets) {
        const key = target.dataset.marketingReveal as Preset;
        if (!Object.prototype.hasOwnProperty.call(motion, key)) continue;
        const preset = motion[key];
        const delay = key === "step" && desktop ? stepIndex++ * 0.065 : 0;
        if (completed.has(target)) continue;
        // Do not shift content the visitor can already see on hydration,
        // history restoration or when a breakpoint changes.
        if (target.getBoundingClientRect().top < window.innerHeight * 0.9) {
          completed.add(target);
          continue;
        }
        gsap.fromTo(target,
          { y: desktop ? preset.y : Math.min(preset.y, 10), opacity: 0.88 },
          {
            y: 0,
            opacity: 1,
            duration: preset.duration,
            delay,
            ease: "power3.out",
            immediateRender: false,
            clearProps: "transform,opacity",
            onComplete: () => { completed.add(target); },
            scrollTrigger: {
              trigger: target,
              start: "top 90%",
              once: true,
              toggleActions: "play none none none",
            },
          },
        );
      }
    });
    return () => media.revert();
  }, { scope: marker });

  return <span ref={marker} hidden aria-hidden="true" />;
}
