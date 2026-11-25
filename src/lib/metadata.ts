import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  { index = true, follow = true, image }: {
    index?: boolean; follow?: boolean;
    image?: { url: string; width: number; height: number; alt: string };
  } = {},
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
      images: [image ?? { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} — Software Developer & Automation Architect` }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [image ? { url: image.url, alt: image.alt } : "/twitter-image"] },
  };
}
