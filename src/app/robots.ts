import type {
  MetadataRoute,
} from "next";

import {
  siteConfig,
} from "@/lib/site";

export default function robots():
  MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",

        disallow: [
          "/api/",
        ],
      },

      {
        userAgent:
          "OAI-SearchBot",

        allow: "/",

        disallow: [
          "/api/",
        ],
      },

      {
        userAgent:
          "ChatGPT-User",

        allow: "/",

        disallow: [
          "/api/",
        ],
      },
    ],

    sitemap:
      `${siteConfig.url}/sitemap.xml`,

    host:
      siteConfig.url,
  };
}