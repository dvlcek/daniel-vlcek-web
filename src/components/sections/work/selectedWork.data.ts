import { financeos, homepageProjects, isPublishedProject, vlkoMotion } from "@/content/projects";

export type WorkCaseStudy = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  imageAlt: string;
  imageReady?: boolean;
  href?: string;
  cta?: string;
};

function toWorkCaseStudy(
  project: (typeof homepageProjects)[number] | typeof financeos | typeof vlkoMotion,
  id = project.slug,
  title = project.name,
  preferredImage = "",
): WorkCaseStudy {
  const [media] = project.media;
  const published = isPublishedProject(project);
  return {
    id,
    eyebrow: project.classification,
    title,
    subtitle: project.summary,
    description: project.description,
    image: media?.src ?? preferredImage,
    imageAlt: media?.alt ?? "",
    imageReady: Boolean(media),
    href: published ? `/work/${project.slug}` : undefined,
    cta: published ? "View case study" : undefined,
  };
}

const [featured, ...secondary] = homepageProjects;
export const internalCaseStudy = toWorkCaseStudy(featured, "business-os", featured.name, "/images/work/business-os.webp");
export const websiteCaseStudies = secondary.map(project => toWorkCaseStudy(project));
export const productCaseStudies = [
  toWorkCaseStudy(financeos, "vlko-finance", financeos.portfolioName, "/images/work/vlko-finance.webp"),
  toWorkCaseStudy(vlkoMotion, vlkoMotion.slug, vlkoMotion.name, "/images/work/vlko-motion.webp"),
];

export const featuredCaseStudy: WorkCaseStudy = {
  id: "daniel-vlko",

  eyebrow: "Web Development · Brand Experience",

  title: "Daniel VLKO",

  subtitle:
    "A technology studio website combining custom design, purposeful motion and an integrated discovery experience.",

  description:
    "A custom-developed website designed around clear service positioning, responsive experiences, performance and a distinctive visual identity.",

  image: "/images/work/daniel-vlko-website.webp",

  imageAlt:
    "Daniel VLKO website with cinematic Earth hero",
};

/* =====================================================
   LEGACY CONCEPTS

   Preserved for existing consumers.
   Excluded from the homepage gallery.
===================================================== */

export const secondaryCaseStudies: WorkCaseStudy[] = [
  {
    id: "ai-operations",

    eyebrow: "Automation · Workflow Concept",

    title: "Automation & Applied AI",

    subtitle:
      "An intelligent workflow concept connecting business systems, document processing and automated operations.",

    image: "/images/services/automation-applied-ai.png",

    imageAlt:
      "Conceptual intelligent automation workflow",

    href: "/services/automation-ai",

    cta: "Explore automation & AI",
  },

  {
    id: "business-platform",

    eyebrow: "Custom Software · Interface Concept",

    title: "Business Platform",

    subtitle:
      "An interface concept for managing customer relationships and business information.",

    image: "/images/work/ai-operation.png",

    imageAlt:
      "Conceptual business management dashboard",

    href: "/services/custom-software",

    cta: "Explore custom software",
  },
];

/* =====================================================
   HOMEPAGE — SELECTED WORK

   One featured project is rendered separately.
   Two secondary projects form the homepage grid.
===================================================== */

export const selectedProjects: WorkCaseStudy[] = [
  ...websiteCaseStudies,
];

/* =====================================================
   FULL PORTFOLIO

   Can be consumed by the /work page.
===================================================== */

export const allProjects: WorkCaseStudy[] = [
  internalCaseStudy,
  ...websiteCaseStudies,
  ...productCaseStudies,
];
