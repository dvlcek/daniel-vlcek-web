import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { legalDetails } from "@/lib/legal-details";
import { getPublishedProjects } from "@/content/projects";

// Match the runtime launch gate; do not advertise pages rewritten to noindex.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getPublishedProjects();
  const fullSite = process.env.COMING_SOON_ENABLED === "false";
  const paths = [
    ...(fullSite ? ["/", "/services", "/services/web-development", "/services/custom-software", "/services/automation-ai", "/about"] : []),
    "/contact",
    ...(fullSite && projects.length > 0 ? ["/work", ...projects.map(project => `/work/${project.slug}`)] : []),
    ...(legalDetails.reviewed ? ["/legal", "/privacy", "/cookies"] : []),
  ];
  return paths.map(path => ({ url: new URL(path, siteConfig.url).href, priority: path === "/" ? 1 : 0.7 }));
}
