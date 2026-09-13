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

  /*
   * Zem je už na začiatku mierne vyššie.
   * Pri scrollovaní sa približuje a pomaly klesá.
   */
  const scale = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [1.06, 1.11, 1.2],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [-72, -40, 30],
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [1, 0.98, 0.72],
  );

  const blur = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    ["blur(0px)", "blur(0px)", "blur(5px)"],
  );

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* EARTH */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale,
          y,
          opacity,
          filter: blur,
          transformOrigin: "50% 60%",
        }}
      >
        <Image
          src="/images/hero/earth.webp"
          alt=""
          fill
          priority
          draggable={false}
          sizes="100vw"
          className="select-none object-cover object-[center_42%]"
        />
      </motion.div>

      {/* TOP DARKENING */}
      <div
        className="absolute inset-x-0 top-0 h-[30%]"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(2, 5, 8, 0.48) 0%,
              rgba(2, 5, 8, 0.18) 55%,
              transparent 100%
            )
          `,
        }}
      />

      {/* DARK AURA BEHIND HERO TEXT */}
      <div
        className="
          absolute
          left-1/2
          top-[16%]
          h-[390px]
          w-[900px]
          max-w-[95vw]
          -translate-x-1/2
          rounded-full
          blur-[35px]
        "
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(1, 5, 8, 0.72) 0%,
              rgba(1, 5, 8, 0.48) 38%,
              rgba(1, 5, 8, 0.16) 65%,
              transparent 78%
            )
          `,
        }}
      />

      {/* SIDE VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 45%,
              rgba(0,0,0,0.12) 72%,
              rgba(0,0,0,0.34) 100%
            )
          `,
        }}
      />

      {/* ======================================================
          CINEMATIC HERO → PROBLEM FADE

          Koniec je presne rovnaký ako Problem background.
      ====================================================== */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38vh]"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(3,7,11,0) 0%,
              rgba(3,7,11,0.04) 20%,
              rgba(3,7,11,0.14) 38%,
              rgba(3,7,11,0.38) 58%,
              rgba(3,7,11,0.76) 80%,
              #03070b 100%
            )
          `,
        }}
      />

      {/* VERY LIGHT BLUR ONLY AT THE VERY BOTTOM */}
      <div
        className="absolute inset-x-0 bottom-0 h-[16vh] backdrop-blur-[2px]"
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