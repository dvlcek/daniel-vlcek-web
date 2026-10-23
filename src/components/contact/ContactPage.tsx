import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, Mail, Video } from "lucide-react";

import { BookingWizard } from "@/components/booking/BookingWizard";
import { Container } from "@/components/ui/Container";
import { legalContactEmail } from "@/lib/legal-details";

const focusClass = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]";

export function ContactPage() {
  return (
    <main className="bg-[#020609] text-white">
      <header className="border-b border-white/[0.08]">
        <Container>
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            <Link href="/" className={`${focusClass} inline-flex min-h-11 items-center text-[12px] font-semibold uppercase tracking-[0.24em] transition-opacity duration-150 hover:opacity-75 motion-reduce:transition-none`}>
              Daniel VLKO
            </Link>
            <Link href="/" className={`${focusClass} inline-flex min-h-11 items-center gap-2 text-[12px] text-white/65 transition-colors duration-150 hover:text-white motion-reduce:transition-none`}>
              <ArrowLeft size={15} strokeWidth={1.7} aria-hidden="true" />
              Back to website
            </Link>
          </div>
        </Container>
      </header>

      <Container className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1160px] items-start gap-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-14 xl:gap-20">
          <section aria-labelledby="contact-heading" className="min-w-0 lg:pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FF8054]">Contact</p>
            <h1 id="contact-heading" className="mt-5 max-w-[460px] text-[40px] font-medium leading-[1.08] tracking-[-0.05em] sm:text-[48px] xl:text-[56px]">
              Let’s talk about <span className="text-[#FF6A32]">your project.</span>
            </h1>
            <p className="mt-5 max-w-[400px] text-[15px] leading-7 text-white/65">
              Have something to build, improve or automate? Book a free call and we’ll find the right next step.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-[13px] text-white/70">
              <span className="inline-flex items-center gap-2"><Clock3 size={15} strokeWidth={1.7} aria-hidden="true" />30 minutes</span>
              <span className="inline-flex items-center gap-2"><Video size={15} strokeWidth={1.7} aria-hidden="true" />Video call</span>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-white/60">Free, with no obligation.</p>

            <div className="mt-8 border-t border-white/[0.09] pt-5 lg:mt-10">
              <p className="text-[13px] text-white/60">Prefer email?</p>
              <a href={`mailto:${legalContactEmail}`} className={`${focusClass} mt-1 inline-flex min-h-11 max-w-full items-center gap-3 text-[14px] text-white/90 transition-colors duration-150 hover:text-[#FF8054] motion-reduce:transition-none`}>
                <Mail size={16} strokeWidth={1.6} className="shrink-0" aria-hidden="true" />
                <span className="break-all">{legalContactEmail}</span>
                <ArrowUpRight size={15} className="shrink-0" aria-hidden="true" />
              </a>
            </div>
          </section>

          <section id="booking" aria-labelledby="booking-heading" className="min-w-0 scroll-mt-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#060B0F]">
            <div className="border-b border-white/[0.08] px-5 py-6 sm:px-7">
              <h2 id="booking-heading" className="text-[24px] font-medium leading-tight tracking-[-0.035em] sm:text-[28px]">Book a discovery call.</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/65">Choose a time, then share a little about your project.</p>
            </div>

            <BookingWizard />

            <p className="border-t border-white/[0.08] px-5 py-4 text-[12px] leading-6 text-white/60 sm:px-7">
              Your details are used to arrange your call. Read the{" "}
              <Link href="/privacy" className={`${focusClass} text-white/80 underline underline-offset-4 hover:text-white`}>privacy notice</Link>.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
