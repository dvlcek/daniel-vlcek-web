"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useInView,
  useReducedMotion,
} from "motion/react";

type AnimatedStatProps = {
  value: number;
  suffix?: string;
  decimals?: number;
};

export function AnimatedStat({
  value,
  suffix = "",
  decimals = 0,
}: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.7,
  });

  const reduceMotion = useReducedMotion();

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const duration = 1100;
    const start = performance.now();

    let animationFrame = 0;

    const update = (now: number) => {
      const elapsed = now - start;

      const progress = Math.min(elapsed / duration, 1);

      // Smooth deceleration.
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
  }, [isInView, reduceMotion, value]);

  return (
    <span
      ref={ref}
      aria-label={`${value}${suffix}`}
    >
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}