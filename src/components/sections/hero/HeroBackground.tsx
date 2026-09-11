"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function HeroBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: backgroundRef,
    offset: ["start start", "end start"],
  });

  /*
   * scrollYProgress:
   *
   * 0 = Hero je na začiatku viewportu
   * 1 = Hero sme odscrollovali preč
   */

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          scale,
          y,
          transformOrigin: "50% 70%",
        }}
      >
        <Image
          src="/images/hero/earth.png"
          alt=""
          fill
          priority
          draggable={false}
          sizes="100vw"
          className="select-none object-cover object-[center_35%]"
        />
      </motion.div>

      {/* Jemné stmavenie hornej časti kvôli navigácii a textu */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(2, 7, 11, 0.22) 0%,
              rgba(2, 7, 11, 0.06) 44%,
              rgba(2, 7, 11, 0.02) 100%
            )
          `,
        }}
      />
    </div>
  );
}