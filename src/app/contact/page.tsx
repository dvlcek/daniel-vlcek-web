import { pageMetadata } from "@/lib/metadata";
import { ContactPage } from "@/components/contact/ContactPage";
import { Footer } from "@/components/layout/Footer";

export const metadata = pageMetadata("Contact & Free Discovery Call", "Discuss your website, custom software or automation project. Book a free 30-minute discovery call with Daniel VLKO or get in touch by email.", "/contact");

export default function Contact() {
  return (
    <>
      <ContactPage />
      <Footer bookingHref="#booking" />
    </>
  );
}
