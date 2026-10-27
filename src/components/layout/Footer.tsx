import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { PrivacySettingsButton } from "@/components/site/PrivacyProvider";
import { legalContactEmail, legalDetails } from "@/lib/legal-details";
import { siteConfig } from "@/lib/site";
import { getPortfolioNavigation } from "@/lib/portfolio-navigation";

const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
];

const legalLinks = [
  { label: "Legal notice / Impressum", href: "/legal" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

const linkStyle = "inline-flex min-h-11 w-fit items-center rounded-sm nav-text text-white/70 transition-colors duration-200 hover:text-white motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]";
const labelStyle = "eyebrow text-white/50";

export function Footer({ bookingHref = "/contact" }: { bookingHref?: string }) {
  const navigation = navLinks.map(link => link.label === "Work" ? { ...link, href: getPortfolioNavigation().workHref } : link);
  const formattedCompanyId = legalDetails.businessId?.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1 $2 $3");

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#02070B] text-white">
      <Container className="pb-6 pt-12 md:pt-14 xl:pt-16">
        <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.65fr_1.1fr_1fr] lg:gap-x-9 xl:gap-x-14">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-[20px] font-semibold uppercase leading-[1.25] tracking-[0.15em] transition-opacity duration-200 hover:opacity-75 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-[270px] small-copy text-white/60">
              Software development, automation<br className="hidden xl:block" /> and digital platforms.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className={labelStyle}>Explore</p>
            <ul className="mt-3 grid list-none grid-cols-2 gap-x-6 p-0 sm:grid-cols-1">
              {navigation.map((link) => <li key={link.href}><Link href={link.href} className={linkStyle}>{link.label}</Link></li>)}
            </ul>
          </nav>

          <div>
            <p className={labelStyle}>Company</p>
            <p className="mt-3 text-[15px] font-medium leading-6 text-white/90">{legalDetails.legalName}</p>
            <address className="mt-2 whitespace-pre-line text-[13px] not-italic leading-6 text-white/65">
              {legalDetails.address}
            </address>
            <dl className="mt-3 space-y-1 caption text-white/60">
              <div className="flex gap-2"><dt>IČO</dt><dd className="tabular-nums text-white/75">{formattedCompanyId}</dd></div>
              {legalDetails.taxId && <div className="flex gap-2"><dt>DIČ</dt><dd className="tabular-nums text-white/75">{legalDetails.taxId}</dd></div>}
              {legalDetails.vatId && <div className="flex gap-2"><dt>IČ DPH</dt><dd className="tabular-nums text-white/75">{legalDetails.vatId}</dd></div>}
            </dl>
          </div>

          <div className="flex flex-col items-start">
            <p className={labelStyle}>Contact</p>
            <a href={`mailto:${legalContactEmail}`} className={`${linkStyle} mt-3 break-all text-[14px]`}>
              {legalContactEmail}
            </a>
            {legalDetails.phone && <a href={`tel:${legalDetails.phone.replace(/[^+\d]/g, "")}`} className={`${linkStyle} flex tabular-nums`}>{legalDetails.phone}</a>}
            <Link href={bookingHref} data-contact-source={bookingHref === "/contact" ? "footer" : undefined} className={`${linkStyle} group mt-2 gap-2 text-white/85`}>
              Discuss your project
              <ArrowUpRight size={15} aria-hidden="true" className="shrink-0 transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <p className="caption text-white/50">
            © {new Date().getFullYear()} {legalDetails.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal and privacy information" className="flex flex-wrap gap-x-5 xl:gap-x-6">
            {legalLinks.map((link) => <Link key={link.href} href={link.href} className={linkStyle}>{link.label}</Link>)}
            <PrivacySettingsButton className={`${linkStyle} cursor-pointer`} />
          </nav>
        </div>
      </Container>
    </footer>
  );
}
