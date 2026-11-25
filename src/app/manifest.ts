import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "VLKO",
    start_url: "/",
    scope: "/",
    lang: siteConfig.language,
    display: "standalone",
    theme_color: "#020608",
    background_color: "#020608",
    icons: [
      { src: "/brand/favicon-192.png?v=3", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/favicon-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
