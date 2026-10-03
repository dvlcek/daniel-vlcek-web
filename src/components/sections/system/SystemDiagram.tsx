"use client";

import { useRef } from "react";
import { BarChart3, Globe2, Settings2, Users, Zap } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";

import styles from "./SystemDiagram.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

// Shared content and connection anchors keep every breakpoint consistent.
const nodes = [
  {
    id: "customers",
    icon: Users,
    title: "Customers",
    lines: ["Enquiries captured.", "Follow-ups on time."],
    delay: 0.12,
    signalDelay: "0.3s",
  },
  {
    id: "operations",
    icon: Settings2,
    title: "Operations",
    lines: ["Tasks routed.", "Less copying by hand."],
    delay: 0.24,
    signalDelay: "0.9s",
  },
  {
    id: "automation",
    icon: Zap,
    title: "Automation",
    lines: ["The right action.", "At the right time."],
    delay: 0.18,
    signalDelay: "0.6s",
  },
  {
    id: "insights",
    icon: BarChart3,
    title: "Data & Insights",
    lines: ["See every enquiry.", "Know what converts."],
    delay: 0.3,
    signalDelay: "1.2s",
  },
  {
    id: "website",
    icon: Globe2,
    title: "Website & CRM",
    lines: ["Fast pages.", "Customer data in sync."],
    delay: 0.06,
    signalDelay: "0s",
  },
] as const;

const flowLabels = [
  { label: "Enquiries", position: "labelTopLeft", delay: "0.3s", dotFirst: false },
  { label: "Insights", position: "labelTopRight", delay: "1.2s", dotFirst: true },
  { label: "Tasks", position: "labelBottomLeft", delay: "0.9s", dotFirst: false },
  { label: "Updates", position: "labelBottomRight", delay: "0s", dotFirst: true },
] as const;

export function SystemDiagram() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();

  return (
    <figure ref={ref} className={styles.figure} aria-labelledby="system-diagram-caption">
      <div className={styles.network} data-animated={isInView && !reduceMotion}>
        <div aria-hidden="true" className={styles.orbit} />
        {flowLabels.map(({ label, position, delay, dotFirst }) => (
          <div
            key={label}
            className={`${styles.flowLabel} ${styles[position]}`}
            style={{ animationDelay: delay }}
          >
            {dotFirst && <span aria-hidden="true" className={styles.flowDot} />}
            <span className={styles.flowText}>
              {label}
              <span aria-hidden="true" className={styles.labelHighlight}>{label}</span>
            </span>
            {!dotFirst && <span aria-hidden="true" className={styles.flowDot} />}
          </div>
        ))}
        {nodes.map(({ id, icon: Icon, title, lines, delay, signalDelay }) => (
          <div key={id} className={`${styles.position} ${styles[id]}`}>
            {id !== "automation" && (
              <span aria-hidden="true" className={styles.connection}>
                <motion.span
                  className={styles.line}
                  initial={false}
                  animate={{ opacity: isInView ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.25 }}
                />
                <span className={styles.port} />
                <span className={styles.packet} style={{ animationDelay: signalDelay }} />
              </span>
            )}
            <motion.div
              initial={false}
              animate={
                isInView && !reduceMotion
                  ? { opacity: [0.65, 1], transform: ["translateY(8px)", "translateY(0px)"] }
                  : { opacity: 1, transform: "translateY(0px)" }
              }
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease }}
              className={`${styles.node} ${id === "automation" ? styles.hub : ""}`}
            >
              <span aria-hidden="true" className={styles.glow} style={{ animationDelay: signalDelay }} />
              <Icon aria-hidden="true" size={27} strokeWidth={1.65} className={styles.icon} />
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>
                {lines[0]}
                <br />
                {lines[1]}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
      <figcaption id="system-diagram-caption" className={styles.caption}>
        <span aria-hidden="true" className={styles.statusDot} />
        One enquiry. Every next step connected.
      </figcaption>
    </figure>
  );
}
