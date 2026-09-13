import type { Metadata } from "next";

import { ComingSoon } from "@/components/launch/ComingSoon";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://danielvlko.com",
  ),

  title:
    "Daniel VLKO — Software Developer & Automation Architect",

  description:
    "Custom software, automation, AI-assisted workflows and digital systems built to help businesses operate smarter, faster and with less friction.",

  alternates: {
    canonical:
      "https://danielvlko.com",
  },

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title:
      "Daniel VLKO — Software Developer & Automation Architect",

    description:
      "I build systems for a more efficient tomorrow.",

    url:
      "https://danielvlko.com",

    siteName:
      "Daniel VLKO",

    type:
      "website",
  },
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}