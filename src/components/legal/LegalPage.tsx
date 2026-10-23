import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { legalDetails } from "@/lib/legal-details";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="min-h-[70vh] bg-[#F6F3EE] text-[#071017]">
        <Container className="py-10 sm:py-16">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-sm text-[14px] text-[#52616D] transition-colors hover:text-[#071017] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2410C]">
            <ArrowLeft size={16} aria-hidden="true" /> Back to the website
          </Link>
          <article className="mx-auto mt-8 max-w-[800px] pb-12">
            <h1 className="text-[36px] font-medium leading-[1.1] tracking-[-0.04em] sm:text-[48px]">{title}</h1>
            <p className="mt-5 text-[16px] leading-7 text-[#52616D]">{intro}</p>
            {!legalDetails.reviewed && (
              <aside aria-label="Draft status" className="mt-7 rounded-xl border border-[#071017]/15 bg-white/60 p-5 text-[14px] leading-6 text-[#374854]">
                <strong className="font-semibold text-[#071017]">Draft for review — not ready for publication.</strong>{" "}
                {legalDetails.legalName
                  ? "Public company and tax registration details have been verified. The data-processing arrangements and remaining disclosure requirements still need review before publication."
                  : "The operator's legal identity, business registration and processing arrangements still need confirmation."}
                {" "}These pages do not establish legal compliance.
              </aside>
            )}
            <div className="mt-10 space-y-9 text-[15px] leading-7 text-[#52616D] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#071017]/30 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#C2410C] [&_h2]:mb-3 [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.02em] [&_h2]:text-[#071017] [&_p+p]:mt-3">
              {children}
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
