"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotionPreference(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getMotionPreference = () => window.matchMedia(reducedMotionQuery).matches;
const getServerMotionPreference = () => false;

type AnimatedStatProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
};

export function AnimatedStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1100,
}: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.7,
  });

  const reduceMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, getServerMotionPreference);

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (reduceMotion) return;

    const start = performance.now();

    let animationFrame = 0;

    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * eased);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, isInView, reduceMotion, value]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
      {prefix}
      {(reduceMotion ? value : displayValue).toFixed(decimals)}
      {suffix}
      </span>
      <span className="sr-only">{prefix}{value.toFixed(decimals)}{suffix}</span>
    </span>
  );
}
