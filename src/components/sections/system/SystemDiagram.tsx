"use client";

import { useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useInView } from "motion/react";
import { sampleContacts, sampleEnquiries, workflowStages } from "./system.data";
import styles from "./SystemDiagram.module.css";

type Stage = (typeof workflowStages)[number];

// Both states occupy the same grid cell: no mounting, reflow or phase-driven React updates.
function Swap({ before, after }: { before: ReactNode; after: ReactNode }) {
  return <span className={styles.swap}>
    <span className={styles.before}>{before}</span>
    <span className={styles.after}>{after}</span>
  </span>;
}

function Module({ stage, children }: { stage: Stage; children: ReactNode }) {
  return <section className={`${styles.module} ${styles[stage.id]}`}>
    <header className={styles.moduleHeader}>
      <div className={styles.moduleTitle}><h3>{stage.title}</h3><p>{stage.subtitle}</p></div>
      <span className={styles.moduleState}><span className={styles.stateDot} /></span>
    </header>
    {children}
  </section>;
}

function Website() {
  return <Module stage={workflowStages[0]}>
    <div className={styles.browser}>
      <div className={styles.browserBar}><span /><span /><span /><span className={styles.browserAddress}>example.com</span></div>
      <div className={styles.browserPage}>
        <div className={styles.browserBrand}>YOUR BUSINESS <span>Menu</span></div>
        <div className={styles.browserHeadline}>Let&apos;s build<br />something better.</div>
        <span className={styles.mockCta}>Get in touch</span>
      </div>
    </div>
    <div className={styles.event}><Swap before="Awaiting enquiry" after="Enquiry received" /></div>
  </Module>;
}

function CRM() {
  return <Module stage={workflowStages[1]}>
    <div className={styles.crmLabel}><span>Contacts</span><Swap before="2 records" after="3 records" /></div>
    <div className={styles.contactList}>
      {sampleContacts.map((contact) => <div className={styles.contact} key={contact.initials}>
        <span className={styles.contactName}>{contact.name}</span><span className={styles.contactStatus}>{contact.status}</span>
      </div>)}
      <div className={`${styles.contact} ${styles.newContact}`}>
        <span className={styles.contactName}><Swap before="Awaiting data" after="New contact" /></span>
        <span className={styles.contactStatus}><Swap before="Pending" after="New lead" /></span>
      </div>
    </div>
  </Module>;
}

function Automation() {
  return <Module stage={workflowStages[2]}>
    <div className={styles.automationFlow}>
      {["Trigger", "Process", "Action"].map((title, index) => <div className={styles.action} key={title}>
        <span className={styles.actionNumber}>0{index + 1}</span>
        <span>{title}</span>
      </div>)}
    </div>
    <div className={styles.event}><Swap before="Waiting for trigger" after="Follow-up prepared" /></div>
  </Module>;
}

function Analytics() {
  return <Module stage={workflowStages[3]}>
    <div className={styles.metric}><div><p>Total enquiries</p><strong><Swap before={sampleEnquiries} after={sampleEnquiries + 1} /></strong><span className={`${styles.increment} ${styles.after}`}>+1</span></div><span className={styles.metricPeriod}>This month</span></div>
    <svg className={styles.chart} viewBox="0 0 240 51" preserveAspectRatio="none">
      {[8, 25, 42].map((y) => <path key={y} d={`M0 ${y} H240`} stroke="#e8e4de" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
      <path d="M0 43 L30 35 L60 39 L90 23 L120 30 L150 19 L180 25 L210 15 L240 13" className={styles.before} stroke="#7a8790" strokeWidth="1.7" fill="none" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <path d="M0 43 L30 35 L60 39 L90 23 L120 30 L150 19 L180 25 L210 15 L240 5" className={styles.after} stroke="#c2410c" strokeWidth="1.7" fill="none" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  </Module>;
}

const coreTraces = [
  { stage: 1, d: "M8 14 H17 L25 25", x: 8, y: 14 },
  { stage: 2, d: "M39 25 L47 14 H56", x: 56, y: 14 },
  { stage: 3, d: "M25 39 L17 50 H8", x: 8, y: 50 },
  { stage: 4, d: "M39 39 L47 50 H56", x: 56, y: 50 },
] as const;

function DataCore() {
  return <div className={styles.hub}>
    <svg className={styles.coreSymbol} viewBox="0 0 64 64" fill="none">
      {coreTraces.map(({ stage, d, x, y }) => <g key={stage}>
        <path d={d} className={styles.coreTrace} />
        <path d={d} pathLength={1} className={styles.corePacket} data-stage={stage} />
        <circle cx={x} cy={y} r="2.4" className={styles.corePort} data-stage={stage} />
      </g>)}
      <path d="M32 8 V20 M32 44 V56 M8 32 H20 M44 32 H56" className={styles.coreTrace} />
      <rect x="21" y="21" width="22" height="22" rx="4" className={styles.coreChip} />
      <rect x="27" y="27" width="10" height="10" rx="2" className={styles.coreCenter} />
    </svg>
    <strong>Your business</strong>
    <span className={styles.hubSubtitle}>Connected systems</span>
  </div>;
}

function Connections({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  const topStep = left ? 1 : 2;
  const bottomStep = left ? 3 : 4;
  const top = left ? "M0 24 Q50 24 50 37 T100 50" : "M0 50 Q50 50 50 37 T100 24";
  const bottom = left ? "M100 50 Q50 50 50 63 T0 76" : "M0 50 Q50 50 50 63 T100 76";
  return <svg className={`${styles.connections} ${left ? styles.leftConnections : styles.rightConnections}`} viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d={top} className={styles.wire} data-stage={topStep} /><path d={bottom} className={styles.wire} data-stage={bottomStep} />
    <path d={top} pathLength="1" className={styles.signal} data-stage={topStep} />
    <path d={bottom} pathLength="1" className={styles.signal} data-stage={bottomStep} />
  </svg>;
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
function getPageVisibility() { return document.visibilityState === "visible"; }
function getServerVisibility() { return false; }

export function SystemDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const captionId = useId();
  const inView = useInView(ref, { amount: "some" });
  const [paused, setPaused] = useState(false);
  const pageVisible = useSyncExternalStore(subscribeVisibility, getPageVisibility, getServerVisibility);
  const playing = inView && pageVisible && !paused;

  // CSS owns the complete 5.8s timeline; React only controls whether it runs.
  // The visual demo is decorative. Its complete meaning is available as static text.
  return <figure className={styles.figure} aria-labelledby={captionId}>
    <div className={styles.diagram} ref={ref} data-playing={playing} aria-hidden="true">
      <DataCore />
      <Connections side="left" /><Connections side="right" />
      <Website /><CRM /><Automation /><Analytics />
    </div>
    <figcaption className={styles.controls}>
      <span id={captionId} className={styles.caption}>
        <span className={styles.workflowLabel}>Example workflow</span>
        <span className={styles.captionSeparator} aria-hidden="true">·</span>
        <span>Sample data</span>
        <span className={styles.srOnly}>A website enquiry creates a CRM contact, prepares an automated follow-up and updates analytics. No information is submitted.</span>
      </span>
      <button type="button" className={styles.pauseButton} aria-label={paused ? "Resume workflow animation" : "Pause workflow animation"} title={paused ? "Resume animation" : "Pause animation"} onClick={() => setPaused((current) => !current)}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </figcaption>
  </figure>;
}
