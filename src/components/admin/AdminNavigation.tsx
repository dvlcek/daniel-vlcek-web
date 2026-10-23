"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, CalendarDays, Clock3, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import styles from "@/app/admin/AdminDashboard.module.css";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Calls & bookings", icon: CalendarDays },
  { id: "leads", label: "Leads", icon: Users },
  { id: "availability", label: "Availability", icon: Clock3 },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "system", label: "System", icon: ShieldCheck },
];

export function AdminNavigation({ timezone }: { timezone: string }) {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    let frame: number | null = null;
    const schedule = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const readingLine = window.innerWidth < 1200 ? 160 : 100;
        const positions = sections.flatMap(({ id }) => {
          const bounds = document.getElementById(id)?.getBoundingClientRect();
          return bounds ? [{ id, top: bounds.top, bottom: bounds.bottom }] : [];
        });
        const visible = positions.filter(({ top, bottom }) => top <= readingLine && bottom > readingLine);
        if (visible.length) {
          setActive((current) => visible.some(({ id }) => id === current) ? current : visible[0].id);
        } else {
          const nearest = positions.reduce<(typeof positions)[number] | undefined>((closest, section) => {
            const distance = Math.min(Math.abs(section.top - readingLine), Math.abs(section.bottom - readingLine));
            const closestDistance = closest
              ? Math.min(Math.abs(closest.top - readingLine), Math.abs(closest.bottom - readingLine))
              : Infinity;
            return distance < closestDistance ? section : closest;
          }, undefined);
          if (nearest) setActive(nearest.id);
        }
      });
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>Daniel VLKO<span>Admin workspace</span></Link>
      <nav aria-label="Admin sections" className={styles.navigation}>
        {sections.map(({ id, label, icon: Icon }) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}
            className={styles.navLink} onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
              const url = new URL(window.location.href);
              url.hash = id;
              window.history.replaceState(window.history.state, "", url);
              setActive(id);
            }}>
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <p>Booking timezone<span>{timezone}</span></p>
        <Link href="/contact" target="_blank" className={styles.previewLink}>
          Preview booking page <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
