import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/ContactPage";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact & Free Discovery Call",
  description:
    "Discuss your website, custom software or automation project. Book a free 30-minute discovery call with Daniel VLKO or get in touch by email.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <ContactPage />
      <Footer bookingHref="#booking" />
    </>
  );
}
