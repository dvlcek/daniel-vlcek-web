import { ArrowUpRight } from "lucide-react";
import Link from "@/components/site/MarketingLink";
import { connection } from "next/server";
import { PrivacySettingsButton } from "@/components/site/PrivacyProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { legalContactEmail, legalDetails } from "@/lib/legal-details";
import { getPortfolioNavigation } from "@/lib/portfolio-navigation";
import { isComingSoonEnabled } from "@/lib/site";

const launchLinks = [
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
] as const;

const legalLinks = [
  { label: "Legal notice / Impressum", href: "/legal" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
] as const;

const footerLinkClass =
  "inline-flex min-h-11 w-fit items-center rounded-sm text-[11px] leading-5 text-white/70 transition-colors duration-200 hover:text-white motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]";
const footerLabelClass = "text-[10px] font-medium uppercase tracking-[0.25em] text-white/60";

export async function Footer({ variant = "site", bookingHref = "/contact", launchAware = false }: {
  variant?: "site" | "launch";
  bookingHref?: string;
  launchAware?: boolean;
}) {
  if (launchAware) await connection();
  const footerLinks = variant === "launch"
    ? [{ label: "Services", href: "#services" }, launchLinks[1]]
    : launchAware && isComingSoonEnabled() ? launchLinks : [
    { label: "Work", href: getPortfolioNavigation().workHref },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/about" },
  ];

  return (
  <footer className={variant === "launch" ? "relative z-10 w-full pt-6 text-white sm:pt-8" : "relative z-10 w-full bg-[var(--marketing-bg-dark)] pt-6 text-white sm:pt-8"}>

    {variant === "launch" ? (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(2,4,5,0.28)_35%,rgba(2,4,5,0.65)_100%)]" />
    ) : null}

    <div className={variant === "launch" ? "relative mx-auto w-full max-w-[1320px] px-5 pb-6 sm:px-8 sm:pb-8 lg:px-12 xl:px-14" : "page-container relative max-w-[var(--marketing-container)] pb-6 sm:pb-8"}>

      <div className={`mx-auto w-full border-t border-white/[0.09] pt-8 sm:pt-9 ${variant === "launch" ? "max-w-[1100px]" : "max-w-[var(--marketing-editorial)]"}`}>

        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1.05fr_0.64fr_1.18fr_1.03fr] lg:gap-x-9 xl:gap-x-12">

          <div>
            <Link
              href="/"
              aria-label="Daniel VLKO home"
              className="inline-flex min-h-11 items-center rounded-sm transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054] motion-reduce:transition-none"
            >
              <BrandLogo className="w-44" decorative />
            </Link>

            <p className="mt-2 max-w-[230px] text-[11px] leading-[1.8] text-white/65">
              Software development, automation and digital
              platforms.
            </p>
          </div>

          <nav aria-label="Footer navigation">

            <p className={footerLabelClass}>
              Explore
            </p>

            <ul className="mt-3 grid list-none grid-cols-2 gap-x-5 p-0 sm:grid-cols-1">
              {footerLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={footerLinkClass}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

          </nav>

          <div>
            <p className={footerLabelClass}>
              Company
            </p>

            <p className="mt-4 text-[12px] font-medium leading-5 text-white/85">
              {legalDetails.legalName}
            </p>

            <address className="mt-1.5 whitespace-pre-line text-[11px] not-italic leading-[1.8] text-white/65">
              {legalDetails.address}
            </address>

            <dl className="mt-3 space-y-1 text-[10px] leading-[1.7] text-white/65">

              {legalDetails.businessId && (
                <div className="flex gap-3">
                  <dt className="min-w-12">IČO</dt>
                  <dd className="tabular-nums text-white/65">
                    {legalDetails.businessId.replace(
                      /^(\d{2})(\d{3})(\d{3})$/,
                      "$1 $2 $3",
                    )}
                  </dd>
                </div>
              )}

              {legalDetails.taxId && (
                <div className="flex gap-3">
                  <dt className="min-w-12">DIČ</dt>
                  <dd className="tabular-nums text-white/65">
                    {legalDetails.taxId}
                  </dd>
                </div>
              )}

              {legalDetails.vatId && (
                <div className="flex gap-3">
                  <dt className="min-w-12">IČ DPH</dt>
                  <dd className="tabular-nums text-white/65">
                    {legalDetails.vatId}
                  </dd>
                </div>
              )}

            </dl>
          </div>

          <div className="flex flex-col items-start">

            <p className={footerLabelClass}>
              Contact
            </p>

            <a
              href={`mailto:${legalContactEmail}`}
              className={`${footerLinkClass} mt-2 break-all text-[11.5px]`}
            >
              {legalContactEmail}
            </a>

            {legalDetails.phone && (
              <a
                href={`tel:${legalDetails.phone.replace(/[^+\d]/g, "")}`}
                className={`${footerLinkClass} tabular-nums`}
              >
                {legalDetails.phone}
              </a>
            )}

            <Link
              href={bookingHref}
              data-contact-source={variant === "launch" ? "coming-soon-footer" : bookingHref === "/contact" ? "footer" : undefined}
              className={`${footerLinkClass} group mt-2 gap-2 text-white/85`}
            >
              {variant === "launch" ? "Discuss your project" : "Book a strategy call"}

              <ArrowUpRight
                size={14}
                strokeWidth={1.7}
                aria-hidden="true"
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
              />
            </Link>

          </div>

        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/[0.07] pt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

          <p className="text-[10px] leading-6 text-white/55">
            © {new Date().getFullYear()}{" "}
            {legalDetails.legalName}. All rights reserved.
          </p>

          <nav
            aria-label="Legal and privacy information"
            className="flex flex-wrap items-center gap-x-5 gap-y-1 lg:justify-end"
          >

            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={footerLinkClass}
              >
                {label}
              </Link>
            ))}

            <PrivacySettingsButton
              className={`${footerLinkClass} cursor-pointer text-[11px]!`}
            />

          </nav>

        </div>

      </div>
    </div>
  </footer>
  );
}
