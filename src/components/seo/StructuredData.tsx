import { siteConfig } from "@/lib/site";

export function StructuredData() {
  const personId =
    `${siteConfig.url}/#person`;

  const websiteId =
    `${siteConfig.url}/#website`;

  const webpageId =
    `${siteConfig.url}/#webpage`;

  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "Person",

        "@id": personId,

        name: siteConfig.name,

        url: siteConfig.url,

        jobTitle: siteConfig.role,

        description:
          siteConfig.description,

        knowsAbout: [
          "Custom software development",
          "Business process automation",
          "Artificial intelligence",
          "AI-assisted workflows",
          "Digital platforms",
          "Operational efficiency",
        ],
      },

      {
        "@type": "WebSite",

        "@id": websiteId,

        url: `${siteConfig.url}/`,

        name: siteConfig.name,

        description:
          siteConfig.description,

        inLanguage:
          siteConfig.language,

        publisher: {
          "@id": personId,
        },
      },

      {
        "@type": "WebPage",

        "@id": webpageId,

        url: `${siteConfig.url}/`,

        name: siteConfig.title,

        description:
          siteConfig.description,

        inLanguage:
          siteConfig.language,

        isPartOf: {
          "@id": websiteId,
        },

        about: {
          "@id": personId,
        },

        mainEntity: {
          "@id": personId,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          structuredData,
        ).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}