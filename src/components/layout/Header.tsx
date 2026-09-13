import Link from "next/link";

import { Container } from "@/components/ui/Container";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Insights", href: "#insights" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container>
        <div className="flex h-[82px] items-center justify-between border-b border-white/5 text-white">
          <Link
            href="/"
            className="text-[13px] font-semibold uppercase tracking-[0.28em] text-white"
          >
            Daniel VLKO
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 lg:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="group flex h-10 items-center gap-4 rounded-full border border-white/30 px-5 text-[13px] font-medium text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/5"
          >
            <span>Let&apos;s Talk</span>
            <span
              aria-hidden="true"
              className="text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </header>
  );
}
