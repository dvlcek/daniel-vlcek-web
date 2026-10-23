import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  { index = true, follow = true }: { index?: boolean; follow?: boolean } = {},
): Metadata {
  const socialTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;
  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical: new URL(path, siteConfig.url).href },
    robots: { index, follow, googleBot: { index, follow } },
    openGraph: {
      type: "website", locale: siteConfig.locale, siteName: siteConfig.name,
      title: socialTitle, description, url: new URL(path, siteConfig.url).href,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} — Software Developer & Automation Architect` }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: ["/twitter-image"] },
  };
}
