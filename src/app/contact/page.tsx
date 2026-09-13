import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/ContactPage";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Free Discovery Call | Daniel VLKO",
  description:
    "Book a free discovery call to identify the bottlenecks, systems and opportunities that could help your business operate better.",
};

export default function Contact() {
  return (
    <>
      <ContactPage />
      <Footer />
    </>
  );
}