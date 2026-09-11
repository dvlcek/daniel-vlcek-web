"use client";

import { useRef } from "react";

import {
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

type SignalType =
  | "scattered"
  | "manual"
  | "data"
  | "decisions"
  | "potential";

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
      className="relative flex h-[86px] items-center justify-center"
    >
      {type === "scattered" && (
        <ScatteredSignal active={active} />
      )}

      {type === "manual" && (
        <ManualSignal active={active} />
      )}

      {type === "data" && (
        <DataSignal active={active} />
      )}

      {type === "decisions" && (
        <DecisionSignal active={active} />
      )}

      {type === "potential" && (
        <PotentialSignal active={active} />
      )}
    </div>
  );
}

/* ============================================================
   SCATTERED
============================================================ */

function ScatteredSignal({
  active,
}: {
  active: boolean;
}) {
  const activeCells = new Set([0, 4, 6, 8]);

  return (
    <div className="grid grid-cols-3 gap-[7px]">
      {Array.from({ length: 9 }).map((_, index) => {
        const isActive = activeCells.has(index);

        return (
          <motion.span
            key={index}
            initial={false}
            animate={
              isActive && active
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : isActive
                  ? {
                      opacity: 0.16,
                      scale: 0.72,
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                    }
            }
            transition={{
              duration: 0.4,
              delay: isActive
                ? index * 0.045
                : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={[
              "h-[13px] w-[13px] rounded-[3px]",
              isActive
                ? "bg-[var(--accent)] shadow-[0_0_16px_rgba(255,90,31,0.18)]"
                : "bg-white/[0.07]",
            ].join(" ")}
          />
        );
      })}
    </div>
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
      width: "w-[72px]",
      active: true,
    },
    {
      width: "w-[58px]",
      active: false,
    },
    {
      width: "w-[66px]",
      active: false,
    },
  ];

  return (
    <div className="flex w-[100px] flex-col gap-[10px]">
      {rows.map((row, index) => (
        <div
          key={index}
          className="flex items-center gap-3"
        >
          <motion.span
            initial={false}
            animate={
              row.active && active
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : row.active
                  ? {
                      opacity: 0.15,
                      scale: 0.7,
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                    }
            }
            transition={{
              duration: 0.4,
              delay: 0.08,
            }}
            className={[
              "h-[12px] w-[12px] shrink-0 rounded-full",
              row.active
                ? "bg-[var(--accent)] shadow-[0_0_14px_rgba(255,90,31,0.20)]"
                : "bg-white/[0.08]",
            ].join(" ")}
          />

          <motion.span
            initial={false}
            animate={
              row.active && active
                ? {
                    scaleX: 1,
                    opacity: 1,
                  }
                : row.active
                  ? {
                      scaleX: 0.15,
                      opacity: 0.15,
                    }
                  : {
                      scaleX: 1,
                      opacity: 1,
                    }
            }
            style={{
              transformOrigin: "left",
            }}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={[
              "h-[5px] rounded-full",
              row.width,
              row.active
                ? "bg-[var(--accent)]"
                : "bg-white/[0.075]",
            ].join(" ")}
          />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   DISCONNECTED DATA
============================================================ */

function DataSignal({
  active,
}: {
  active: boolean;
}) {
  return (
    <div className="relative flex items-center gap-5">
      <div className="relative">
        <div className="h-[44px] w-[44px] rounded-full border border-white/[0.08]" />

        <div className="absolute inset-[8px] rounded-full border border-white/[0.08]" />

        <div className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.11]" />
      </div>

      <motion.div
        initial={false}
        animate={
          active
            ? {
                scaleX: 1,
                opacity: 1,
              }
            : {
                scaleX: 0,
                opacity: 0,
              }
        }
        style={{
          transformOrigin: "left",
        }}
        transition={{
          duration: 0.55,
          delay: 0.12,
        }}
        className="h-px w-[28px] bg-gradient-to-r from-white/[0.12] to-[var(--accent)]/40"
      />

      <motion.div
        initial={false}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: 0.2,
                scale: 0.82,
              }
        }
        transition={{
          duration: 0.45,
          delay: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative"
      >
        <div className="h-[44px] w-[44px] rounded-full border border-[rgba(255,90,31,0.34)]" />

        <div className="absolute inset-[8px] rounded-full border border-[rgba(255,90,31,0.22)]" />

        <div className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_rgba(255,90,31,0.22)]" />
      </motion.div>
    </div>
  );
}

/* ============================================================
   SLOW DECISIONS
============================================================ */

function DecisionSignal({
  active,
}: {
  active: boolean;
}) {
  const bars = [22, 37, 58, 34, 17];

  return (
    <div className="flex h-[66px] items-end gap-[8px]">
      {bars.map((height, index) => (
        <motion.span
          key={index}
          initial={false}
          animate={
            active
              ? {
                  height,
                  opacity: 1,
                }
              : {
                  height: 5,
                  opacity: 0.18,
                }
          }
          transition={{
            duration: 0.55,
            delay: index * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={[
            "w-[8px] rounded-full",
            index === 2
              ? "bg-[var(--accent)] shadow-[0_0_14px_rgba(255,90,31,0.18)]"
              : index > 2
                ? "bg-[rgba(255,90,31,0.16)]"
                : "bg-white/[0.075]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/* ============================================================
   LOST POTENTIAL
============================================================ */

function PotentialSignal({
  active,
}: {
  active: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={
        active
          ? {
              opacity: 1,
              scale: 1,
            }
          : {
              opacity: 0.2,
              scale: 0.88,
            }
      }
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative h-[68px] w-[68px]"
    >
      <div className="absolute left-1/2 top-[4px] h-[23px] w-[23px] -translate-x-1/2 rounded-full border-[3px] border-white/[0.10]" />

      <div className="absolute bottom-[5px] left-1/2 h-[29px] w-[46px] -translate-x-1/2 rounded-t-[26px] border-[3px] border-b-0 border-white/[0.10]" />

      <motion.div
        initial={false}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: 0,
                scale: 0.4,
              }
        }
        transition={{
          delay: 0.25,
          duration: 0.35,
        }}
        className="absolute bottom-[2px] right-[2px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[rgba(255,90,31,0.13)]"
      >
        <span className="relative h-[10px] w-[10px]">
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rotate-45 rounded-full bg-[var(--accent)]" />
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 -rotate-45 rounded-full bg-[var(--accent)]" />
        </span>
      </motion.div>
    </motion.div>
  );
}