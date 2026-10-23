import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { legalDetails } from "@/lib/legal-details";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/contact", ...(legalDetails.reviewed ? ["/legal", "/privacy", "/cookies"] : [])];
  return paths.map(path => ({ url: new URL(path, siteConfig.url).href, priority: path === "/" ? 1 : 0.7 }));
}
