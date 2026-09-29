"use client";

import Image from "next/image";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import { useRef } from "react";

export function HeroBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: backgroundRef,
    offset: ["start start", "end start"],
  });

  /* =========================================================
     EARTH SCROLL MOTION

     Initial state:
     - slightly smaller
     - noticeably lower
     - headline gets more visual authority

     Scroll:
     - Earth slowly approaches
     - moves downward
     - subtle blur only near the end
  ========================================================= */

  const scale = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [1, 1.08, 1.2],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [-18, 8, 72],
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [1, 0.98, 0.72],
  );

  const blur = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [
      "blur(0px)",
      "blur(0px)",
      "blur(5px)",
    ],
  );

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
        bg-black
      "
    >
      {/* =====================================================
          EARTH
      ===================================================== */}
      <motion.div
        className="
          absolute
          inset-0
          will-change-transform
        "
        style={{
          scale,
          y,
          opacity,
          filter: blur,
          transformOrigin: "50% 66%",
        }}
      >
        {/* ===================================================
            MOBILE
        =================================================== */}
        <Image
          src="/images/hero/pp.jpg"
          alt=""
          fill
          priority
          draggable={false}
          sizes="100vw"
          className="
            select-none
            object-contain
            object-center
            translate-y-[13vh]
            scale-[1]
            md:hidden
          "
        />

        {/* ===================================================
            DESKTOP
        =================================================== */}
        <Image
          src="/images/hero/pp.jpg"
          alt=""
          fill
          priority
          draggable={false}
          sizes="100vw"
          className="
            hidden
            select-none
            object-cover
            object-[center_8%]
            scale-[0.88]
            md:block
          "
        />
      </motion.div>

      {/* =====================================================
          TOP DARKENING
      ===================================================== */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[32%]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(2, 5, 8, 0.62) 0%,
              rgba(2, 5, 8, 0.26) 56%,
              transparent 100%
            )
          `,
        }}
      />

      {/* =====================================================
          DARK AURA BEHIND HERO COPY

          This is intentionally invisible as an element.
          It only lowers the contrast of Earth beneath text.
      ===================================================== */}
      <div
        className="
          absolute
          left-1/2
          top-[15%]
          h-[430px]
          w-[980px]
          max-w-[96vw]
          -translate-x-1/2
          rounded-full
          blur-[32px]
        "
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(1, 4, 7, 0.84) 0%,
              rgba(1, 4, 7, 0.62) 34%,
              rgba(1, 4, 7, 0.28) 58%,
              rgba(1, 4, 7, 0.08) 72%,
              transparent 82%
            )
          `,
        }}
      />

      {/* =====================================================
          LIGHT CENTER VIGNETTE

          Keeps the sides cinematic while preserving
          detail around the planet.
      ===================================================== */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 42%,
              rgba(0,0,0,0.10) 68%,
              rgba(0,0,0,0.30) 100%
            )
          `,
        }}
      />

      {/* =====================================================
          CINEMATIC HERO → NEXT SECTION FADE
      ===================================================== */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[38vh]
        "
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(3,7,11,0) 0%,
              rgba(3,7,11,0.03) 20%,
              rgba(3,7,11,0.10) 38%,
              rgba(3,7,11,0.32) 58%,
              rgba(3,7,11,0.70) 80%,
              #03070b 100%
            )
          `,
        }}
      />

      {/* =====================================================
          VERY SUBTLE BOTTOM BLUR
      ===================================================== */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[14vh]
          backdrop-blur-[2px]
        "
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black)",
          maskImage:
            "linear-gradient(to bottom, transparent, black)",
        }}
      />
    </div>
  );
}