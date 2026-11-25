export const siteConfig = {
  name: "Daniel VLKO",

  title:
    "Daniel VLKO | Software Developer & Automation Architect",

  description:
    "Work directly with Daniel VLKO on business websites, custom software and AI automation. Book a discovery call to discuss what your company needs.",

  shortDescription:
    "Websites, custom business software and AI automation by Daniel VLKO.",

  url: "https://danielvlko.com",

  locale: "en_US",

  language: "en",

  role:
    "Software Developer & Automation Architect",

  services: [
    "Custom software development",
    "Business process automation",
    "AI-assisted workflows",
    "Digital platforms",
    "Operational efficiency systems",
  ],
} as const;

/** Presentation gate for public navigation on routes open during launch. */
export function isComingSoonEnabled() {
  return process.env.COMING_SOON_ENABLED !== "false";
}
