"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";

const navigation = [
  { label: "Work", href: "#work", id: "work" },
  { label: "Services", href: "#services", id: "services" },
  { label: "About", href: "#about", id: "about" },
  { label: "Process", href: "#process", id: "process" },
  { label: "Insights", href: "#insights", id: "insights" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavigation = (id: string) => {
    setActiveSection(id);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container>
        <div className="flex h-[82px] items-center justify-between border-b border-white/5 text-white">
          {/* Brand */}
          <Link
            href="/"
            className="
              text-[13px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-white
              transition-opacity
              duration-200
              hover:opacity-75
            "
          >
            Daniel VLKO
          </Link>

          {/* Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 lg:flex"
          >
            {navigation.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    group
                    relative
                    py-2
                    text-[13px]
                    font-medium
                    transition-colors
                    duration-200
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/65 hover:text-white"
                    }
                  `}
                >
                  {item.label}

                  <span
                    aria-hidden="true"
                    className={`
                      absolute
                      bottom-0
                      left-1/2
                      h-px
                      -translate-x-1/2
                      bg-[var(--accent)]
                      transition-[width,opacity]
                      duration-300
                      ease-out
                      ${
                        isActive
                          ? "w-full opacity-100"
                          : "w-0 opacity-70 group-hover:w-full group-hover:opacity-100"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <Link
            href="/contact"
            className="
              group
              flex
              h-10
              items-center
              gap-4
              rounded-full
              border
              border-white/30
              px-5
              text-[13px]
              font-medium
              text-white
              transition-all
              duration-200
              hover:border-white/50
              hover:bg-white/[0.04]
            "
          >
            <span>Let&apos;s Talk</span>

            <span
              aria-hidden="true"
              className="
                text-[var(--accent)]
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </header>
  );
}