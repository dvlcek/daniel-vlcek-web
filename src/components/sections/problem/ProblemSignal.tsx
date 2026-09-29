"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

type SignalType =
  | "experience"
  | "manual"
  | "systems"
  | "opportunities"
  | "visibility";

type ProblemSignalProps = {
  type: SignalType;
};

export function ProblemSignal({
  type,
}: ProblemSignalProps) {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.6,
  });

  const reduceMotion = useReducedMotion();

  const active = reduceMotion || isInView;

  return (
    <div
      ref={ref}
      className="
        relative
        flex
        h-[64px]
        items-center
        justify-center
      "
    >
      {type === "experience" && (
        <ExperienceSignal active={active} />
      )}

      {type === "manual" && (
        <ManualSignal active={active} />
      )}

      {type === "systems" && (
        <SystemsSignal active={active} />
      )}

      {type === "opportunities" && (
        <OpportunitiesSignal active={active} />
      )}

      {type === "visibility" && (
        <VisibilitySignal active={active} />
      )}
    </div>
  );
}

/* ============================================================
   DIGITAL EXPERIENCE
============================================================ */

function ExperienceSignal({
  active,
}: {
  active: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-[58px] w-[58px]"
      initial={false}
      animate={{
        opacity: active ? 1 : 0.35,
      }}
      transition={{
        duration: 0.45,
      }}
      aria-hidden="true"
    >
      <motion.path
        d="M13 42C13 31.507 21.507 23 32 23C42.493 23 51 31.507 51 42"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0.15,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.path
        d="M32 42L43 30"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <circle
        cx="32"
        cy="42"
        r="3"
        fill="var(--accent)"
      />

      <path
        d="M18 42H15"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M49 42H46"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ============================================================
   MANUAL WORK
============================================================ */

function ManualSignal({
  active,
}: {
  active: boolean;
}) {
  const rows = [
    {
      width: 28,
      active: true,
    },
    {
      width: 34,
      active: false,
    },
    {
      width: 24,
      active: false,
    },
  ];

  return (
    <div className="flex w-[58px] flex-col gap-[8px]">
      {rows.map((row, index) => (
        <div
          key={index}
          className="flex items-center gap-[8px]"
        >
          <motion.span
            initial={false}
            animate={{
              opacity: active ? 1 : 0.3,
              scale: active ? 1 : 0.8,
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
            }}
            className={[
              "h-[7px] w-[7px] shrink-0 rounded-full",
              row.active
                ? "bg-[var(--accent)]"
                : "bg-white/[0.10]",
            ].join(" ")}
          />

          <motion.span
            initial={false}
            animate={{
              scaleX: active ? 1 : 0.25,
              opacity: active ? 1 : 0.25,
            }}
            style={{
              width: row.width,
              transformOrigin: "left",
            }}
            transition={{
              duration: 0.55,
              delay: 0.08 + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={[
              "h-[3px] rounded-full",
              row.active
                ? "bg-[var(--accent)]"
                : "bg-white/[0.10]",
            ].join(" ")}
          />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   DISCONNECTED SYSTEMS
============================================================ */

function SystemsSignal({
  active,
}: {
  active: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-[58px] w-[58px]"
      initial={false}
      animate={{
        opacity: active ? 1 : 0.35,
      }}
      transition={{
        duration: 0.45,
      }}
      aria-hidden="true"
    >
      <motion.path
        d="M20 19L32 31L46 19"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.path
        d="M32 31L20 46"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.55,
          delay: 0.1,
        }}
      />

      <circle
        cx="20"
        cy="19"
        r="6"
        fill="#03070b"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="2"
      />

      <circle
        cx="20"
        cy="46"
        r="6"
        fill="#03070b"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="2"
      />

      <circle
        cx="46"
        cy="19"
        r="6"
        fill="#03070b"
        stroke="var(--accent)"
        strokeWidth="2"
      />

      <motion.circle
        cx="46"
        cy="19"
        r="2.5"
        fill="var(--accent)"
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1 : 0.5,
        }}
        transition={{
          duration: 0.4,
          delay: 0.25,
        }}
      />
    </motion.svg>
  );
}

/* ============================================================
   LOST OPPORTUNITIES
============================================================ */

function OpportunitiesSignal({
  active,
}: {
  active: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-[58px] w-[58px]"
      initial={false}
      animate={{
        opacity: active ? 1 : 0.35,
      }}
      transition={{
        duration: 0.45,
      }}
      aria-hidden="true"
    >
      <motion.path
        d="M14 20H29"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
        }}
      />

      <motion.path
        d="M35 20H50"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.08,
        }}
      />

      <motion.path
        d="M14 32H28"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.12,
        }}
      />

      <motion.path
        d="M36 32H50"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.16,
        }}
      />

      <motion.path
        d="M14 44H29"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.2,
        }}
      />

      <motion.path
        d="M35 44H50"
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          pathLength: active ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.24,
        }}
      />

      <motion.g
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1 : 0.5,
        }}
        transition={{
          duration: 0.4,
          delay: 0.28,
        }}
        style={{
          transformOrigin: "32px 32px",
        }}
      >
        <circle
          cx="32"
          cy="32"
          r="6"
          fill="rgba(255,90,31,0.08)"
          stroke="rgba(255,90,31,0.24)"
          strokeWidth="1"
        />

        <path
          d="M29.5 29.5L34.5 34.5"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M34.5 29.5L29.5 34.5"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </motion.g>
    </motion.svg>
  );
}

/* ============================================================
   VISIBILITY
============================================================ */

function VisibilitySignal({
  active,
}: {
  active: boolean;
}) {
  const bars = [
    {
      height: 14,
      accent: false,
    },
    {
      height: 22,
      accent: false,
    },
    {
      height: 34,
      accent: true,
    },
    {
      height: 18,
      accent: false,
    },
  ];

  return (
    <div className="flex h-[48px] items-end gap-[6px]">
      {bars.map((bar, index) => (
        <motion.span
          key={index}
          initial={false}
          animate={{
            height: active ? bar.height : 4,
            opacity: active ? 1 : 0.25,
          }}
          transition={{
            duration: 0.52,
            delay: index * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={[
            "w-[6px] rounded-[2px]",
            bar.accent
              ? "bg-[var(--accent)]"
              : "bg-white/[0.10]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}