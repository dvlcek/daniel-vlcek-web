import type {
  Metadata,
  Viewport,
} from "next";

import type {
  ReactNode,
} from "react";

import {
  Analytics,
} from "@vercel/analytics/next";

import {
  SpeedInsights,
} from "@vercel/speed-insights/next";

import {
  siteConfig,
} from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    siteConfig.url,
  ),

  title: {
    default:
      siteConfig.title,

    template:
      `%s | ${siteConfig.name}`,
  },

  description:
    siteConfig.description,

  applicationName:
    siteConfig.name,

  authors: [
    {
      name:
        siteConfig.name,

      url:
        siteConfig.url,
    },
  ],

  creator:
    siteConfig.name,

  publisher:
    siteConfig.name,

  category:
    "technology",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",

    locale:
      siteConfig.locale,

    url: "/",

    siteName:
      siteConfig.name,

    title:
      siteConfig.title,

    description:
      siteConfig.description,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      siteConfig.title,

    description:
      siteConfig.description,
  },

  robots: {
    index: true,

    follow: true,

    googleBot: {
      index: true,

      follow: true,

      "max-image-preview":
        "large",

      "max-snippet": -1,

      "max-video-preview":
        -1,
    },
  },

  formatDetection: {
    email: false,

    address: false,

    telephone: false,
  },
};

export const viewport: Viewport = {
  width:
    "device-width",

  initialScale: 1,

  viewportFit:
    "cover",

  colorScheme:
    "dark",

  themeColor:
    "#020608",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="text/markdown"
          href="/index.md"
        />

        <link
          rel="describedby"
          href="/llms.txt"
        />
      </head>

      <body>
        {children}

        <Analytics />

        <SpeedInsights />
      </body>
    </html>
  );
}