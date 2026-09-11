"use client";

import { BarChart3, Box, Settings2, Users, Zap } from "lucide-react";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const CONNECTOR_POINTS = {
  top: [350, 163] as const,
  right: [495, 260] as const,
  bottom: [350, 357] as const,
  left: [206, 260] as const,
};

export function SystemDiagram() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* ======================================================
          DESKTOP / LARGE LAPTOP
      ====================================================== */}
      <div className="relative hidden h-[520px] w-full xl:block">
        {/* ORBIT */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.96,
                }
          }
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.75,
            ease,
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-[400px]
            w-[400px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-dashed
            border-[#13212b]/15
          "
        />

        {/* ====================================================
            ORBIT LABELS
        ==================================================== */}

        <OrbitLabel
          label="People"
          className="left-[19.7%] top-[24%]"
          dotSide="right"
        />

        <OrbitLabel
          label="Data"
          className="right-[22%] top-[24%]"
          dotSide="left"
        />

        <OrbitLabel
          label="Process"
          className="left-[18.4%] bottom-[24%]"
          dotSide="right"
        />

        <OrbitLabel
          label="Growth"
          className="right-[19%] bottom-[24%]"
          dotSide="left"
        />

        {/* ====================================================
    CONNECTOR LINES — CLEAN VERSION
==================================================== */}

        {/* LINES — UNDER CARDS */}
        <svg
          aria-hidden="true"
          viewBox="0 0 700 520"
          fill="none"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        >
          {/* vertical */}
          <motion.path
            d={`
      M${CONNECTOR_POINTS.top[0]} ${CONNECTOR_POINTS.top[1]}
      L${CONNECTOR_POINTS.bottom[0]} ${CONNECTOR_POINTS.bottom[1]}
    `}
            stroke="rgba(255,90,31,0.52)"
            strokeWidth="1.05"
            strokeLinecap="round"
            initial={
              reduceMotion
                ? false
                : {
                    pathLength: 0,
                    opacity: 0,
                  }
            }
            whileInView={{
              pathLength: 1,
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease,
            }}
          />

          {/* horizontal */}
          <motion.path
            d={`
      M${CONNECTOR_POINTS.left[0]} ${CONNECTOR_POINTS.left[1]}
      L${CONNECTOR_POINTS.right[0]} ${CONNECTOR_POINTS.right[1]}
    `}
            stroke="rgba(255,90,31,0.52)"
            strokeWidth="1.05"
            strokeLinecap="round"
            initial={
              reduceMotion
                ? false
                : {
                    pathLength: 0,
                    opacity: 0,
                  }
            }
            whileInView={{
              pathLength: 1,
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.24,
              ease,
            }}
          />
        </svg>

        {/* CONNECTION DOTS — ALWAYS ABOVE CARDS */}
        <svg
          aria-hidden="true"
          viewBox="0 0 700 520"
          fill="none"
          className="pointer-events-none absolute inset-0 z-[30] h-full w-full"
        >
          {[
            CONNECTOR_POINTS.top,
            CONNECTOR_POINTS.right,
            CONNECTOR_POINTS.bottom,
            CONNECTOR_POINTS.left,
          ].map(([cx, cy], index) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3"
              fill="#FF5A1F"
              stroke="#F6F3EE"
              strokeWidth="2"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0,
                    }
              }
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.3 + index * 0.055,
                duration: 0.3,
              }}
            />
          ))}
        </svg>

        {/* ====================================================
            CLIENTS
        ==================================================== */}

        <SystemNode
          icon={Users}
          title="Clients"
          description={
            <>
              Happier clients.
              <br />
              Stronger relationships.
            </>
          }
          className="
            absolute
            left-1/2
            top-[25px]
            w-[190px]
            -translate-x-1/2
          "
          delay={0.14}
        />

        {/* ====================================================
            OPERATIONS
        ==================================================== */}

        <SystemNode
          icon={Settings2}
          title="Operations"
          description={
            <>
              Smoother workflows.
              <br />
              Greater efficiency.
            </>
          }
          className="
            absolute
            left-[4%]
            top-1/2
            w-[190px]
            -translate-y-1/2
          "
          delay={0.2}
        />

        {/* ====================================================
            AUTOMATION — CENTER
        ==================================================== */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.92,
                }
          }
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.6,
          }}
          transition={{
            duration: 0.6,
            delay: 0.12,
            ease,
          }}
          className="
            absolute
            left-1/2
            top-1/2
            z-10
            flex
            h-[132px]
            w-[190px]
            -translate-x-1/2
            -translate-y-1/2
            flex-col
            items-center
            justify-center
            rounded-[16px]
            border
            border-[#FF5A1F]
            bg-[#FFF4EA]
            shadow-[0_18px_50px_rgba(255,90,31,0.08)]
          "
        >
          <Zap size={29} strokeWidth={1.7} className="text-[#FF5A1F]" />

          <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.03em] text-[#071017]">
            Automation
          </h3>

          <p className="mt-1 text-center text-[11px] leading-[1.45] text-[#63717B]">
            Connects people, tools
            <br />
            and data.
          </p>
        </motion.div>

        {/* ====================================================
            DATA
        ==================================================== */}

        <SystemNode
          icon={BarChart3}
          title="Data & Insights"
          description={
            <>
              Turn data into
              <br />
              clear decisions.
            </>
          }
          className="
            absolute
            right-[4%]
            top-1/2
            w-[190px]
            -translate-y-1/2
          "
          delay={0.26}
        />

        {/* ====================================================
            FOUNDATION
        ==================================================== */}

        <SystemNode
          icon={Box}
          title="Foundation"
          description={
            <>
              Scalable, secure, built
              <br />
              for what&apos;s next.
            </>
          }
          className="
            absolute
            bottom-[25px]
            left-1/2
            w-[190px]
            -translate-x-1/2
          "
          delay={0.32}
        />
      </div>

      {/* ======================================================
          TABLET
      ====================================================== */}

      <div className="hidden md:block xl:hidden">
        <div className="mx-auto max-w-[650px]">
          {/* CLIENT */}
          <SystemNode
            icon={Users}
            title="Clients"
            description="Happier clients. Stronger relationships."
          />

          <div className="mx-auto h-8 w-px bg-[#FF5A1F]/35" />

          {/* MIDDLE */}
          <div className="grid grid-cols-3 items-center gap-4">
            <SystemNode
              icon={Settings2}
              title="Operations"
              description="Smoother workflows."
            />

            <div className="rounded-[16px] border border-[#FF5A1F] bg-[#FFF4EA] px-4 py-6 text-center">
              <Zap size={26} className="mx-auto text-[#FF5A1F]" />

              <p className="mt-2 text-sm font-semibold text-[#071017]">
                Automation
              </p>

              <p className="mt-1 text-[10px] text-[#63717B]">
                Connects people, tools and data.
              </p>
            </div>

            <SystemNode
              icon={BarChart3}
              title="Data & Insights"
              description="Clearer decisions."
            />
          </div>

          <div className="mx-auto h-8 w-px bg-[#FF5A1F]/35" />

          <SystemNode
            icon={Box}
            title="Foundation"
            description="Scalable. Secure. Built for what's next."
          />
        </div>
      </div>

      {/* ======================================================
          MOBILE
      ====================================================== */}

      <div className="md:hidden">
        <div className="relative mx-auto flex max-w-[340px] flex-col items-center">
          <MobileSystemNode
            icon={Users}
            title="Clients"
            description="Better client experience."
          />

          <Connector />

          <MobileSystemNode
            icon={Settings2}
            title="Operations"
            description="Smoother workflows."
          />

          <Connector accent />

          <div className="w-full rounded-[16px] border border-[#FF5A1F] bg-[#FFF4EA] px-5 py-5 text-center">
            <Zap
              size={25}
              strokeWidth={1.7}
              className="mx-auto text-[#FF5A1F]"
            />

            <h3 className="mt-2 text-[15px] font-semibold text-[#071017]">
              Automation
            </h3>

            <p className="mt-1 text-[11px] text-[#63717B]">
              Connects people, tools and data.
            </p>
          </div>

          <Connector accent />

          <MobileSystemNode
            icon={BarChart3}
            title="Data & Insights"
            description="Turn data into clear decisions."
          />

          <Connector />

          <MobileSystemNode
            icon={Box}
            title="Foundation"
            description="Built for what's next."
          />
        </div>
      </div>
    </>
  );
}

/* ============================================================
   DESKTOP / TABLET NODE
============================================================ */

type SystemNodeProps = {
  icon: typeof Users;
  title: string;
  description: React.ReactNode;
  className?: string;
  delay?: number;
};

function SystemNode({
  icon: Icon,
  title,
  description,
  className = "",
  delay = 0,
}: SystemNodeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 10,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.45,
      }}
      transition={{
        duration: 0.55,
        delay,
        ease,
      }}
      className={[
        `
          flex
          min-h-[128px]
          flex-col
          items-center
          justify-center
          rounded-[16px]
          border
          border-[#14232E]/12
          bg-white/70
          px-4
          py-5
          text-center
          shadow-[0_12px_34px_rgba(7,16,23,0.035)]
          backdrop-blur-sm
        `,
        className,
      ].join(" ")}
    >
      <Icon size={28} strokeWidth={1.65} className="text-[#071017]" />

      <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.025em] text-[#071017]">
        {title}
      </h3>

      <p className="mt-1 text-[11px] leading-[1.45] text-[#687781]">
        {description}
      </p>
    </motion.div>
  );
}

/* ============================================================
   ORBIT LABEL
============================================================ */

type OrbitLabelProps = {
  label: string;
  className: string;
  dotSide: "left" | "right";
};

function OrbitLabel({ label, className, dotSide }: OrbitLabelProps) {
  return (
    <div
      className={`
        absolute
        z-20
        flex
        items-center
        gap-4
        ${className}
      `}
    >
      {dotSide === "left" && (
        <span className="h-[7px] w-[7px] rounded-full bg-[#687987]" />
      )}

      <span className="text-[8px] font-semibold uppercase tracking-[0.34em] text-[#60707D]">
        {label}
      </span>

      {dotSide === "right" && (
        <span className="h-[7px] w-[7px] rounded-full bg-[#687987]" />
      )}
    </div>
  );
}

/* ============================================================
   MOBILE
============================================================ */

function MobileSystemNode({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <div className="w-full rounded-[15px] border border-[#14232E]/10 bg-white/70 px-5 py-4 text-center">
      <Icon size={23} className="mx-auto text-[#071017]" />

      <p className="mt-2 text-sm font-semibold text-[#071017]">{title}</p>

      <p className="mt-1 text-[10px] text-[#687781]">{description}</p>
    </div>
  );
}

function Connector({ accent = false }: { accent?: boolean }) {
  return (
    <div
      className={[
        "h-7 w-px",
        accent ? "bg-[#FF5A1F]/50" : "bg-[#14232E]/12",
      ].join(" ")}
    />
  );
}
