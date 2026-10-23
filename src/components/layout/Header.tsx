"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/ui/Container";

const navigation = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Process", href: "/#process", id: "process" },
];

export function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = menuRef.current;
    const menuButton = menuButtonRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLAnchorElement>("a")?.focus();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      menuButton?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const intersectingSections = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) intersectingSections.add(section);
          else intersectingSections.delete(section);
        });

        const visibleSections = [...intersectingSections]
          .sort(
            (a, b) =>
              Math.abs(a.getBoundingClientRect().top) -
              Math.abs(b.getBoundingClientRect().top),
          );

        setActiveSection(visibleSections[0]?.id ?? null);
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
  }, [pathname]);

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
              const isActive = pathname === "/" && activeSection === item.id;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`
                    group
                    relative
                    py-2
                    nav-text
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

          <div className="flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="min-h-11 px-2 text-xs text-white lg:hidden focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            Menu
          </button>
          {/* CTA */}
          <Link
            href="/contact" data-contact-source="header"
            className="button-secondary
              group
              flex
              min-h-11
              items-center
              gap-2 sm:gap-4
              rounded-full
              border
              border-white/30
              px-3 sm:px-5
              button-text
              text-white
              hover:border-white/50
              hover:bg-white/[0.04]
            "
          >
            <span>Let&apos;s Talk</span>

            <span
              aria-hidden="true"
              className="button-arrow hidden sm:inline text-[var(--accent)]"
            >
              →
            </span>
          </Link>
          </div>
        </div>
      </Container>
      <dialog
        ref={menuRef}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        onCancel={() => setMenuOpen(false)}
        onClose={() => setMenuOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = [...event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
          const first = items[0];
          const last = items.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first?.focus();
          }
        }}
        onClick={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-[#020608] p-0 text-white backdrop:bg-black/60 lg:hidden"
      >
        <Container>
          <div className="flex h-[82px] items-center justify-between border-b border-white/5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.28em]">Daniel VLKO</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="min-h-11 px-2 text-sm focus-visible:outline-2 focus-visible:outline-[var(--accent)]">Close menu</button>
          </div>
          <nav aria-label="Mobile sections" className="flex flex-col gap-3 py-8">
            {navigation.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setMenuOpen(false)} className="min-h-11 py-3 nav-text focus-visible:outline-2 focus-visible:outline-[var(--accent)]">{item.label}</Link>
            ))}
            <Link href="/contact" data-contact-source="header" onClick={() => setMenuOpen(false)} className="min-h-11 py-3 nav-text text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]">Let&apos;s Talk</Link>
          </nav>
        </Container>
      </dialog>
    </header>
  );
}
