import { miniSklady } from "./mini-sklady";
import { pokracujStudio } from "./pokracuj-studio";
import { intelligentBusinessPlatform } from "./intelligent-business-platform";

export type ProjectMedia = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  approved: boolean;
};

type ProjectDetail = { title: string; description: string };
type ProjectLink = { title: string; href: string };

type PortfolioListing = {
  slug: string;
  name: string;
  classification: string;
  summary: string;
  description: string;
  ownership: "client" | "independent";
  developmentStatus: "live" | "in-development" | "internal" | "unconfirmed";
  status: "draft" | "published";
  media: ProjectMedia[];
};

type CaseStudy = PortfolioListing & {
  headline: string;
  approvals: { classification: boolean; role: boolean; claims: boolean; media: boolean };
  role: string | null;
  relatedServices: ProjectLink[];
};

export type EditorialProject = CaseStudy & {
  introduction: string;
  services: string[];
  industry: string;
  projectType: string;
  scope: string;
  liveUrl?: string;
  seo: { title: string; description: string };
  editorial: {
    sections: {
      id: string;
      label: string;
      heading: string;
      paragraphs: string[];
      capabilities?: ProjectDetail[];
      checklist?: string[];
      workflow?: ProjectDetail[];
      outcomes?: ProjectDetail[];
    }[];
    closing: string;
    relatedSlugs: string[];
    cta: { heading: string; subheading: string; description: string; primary: string; secondary: string };
  };
};

export type Project = CaseStudy & {
  portfolioName?: string;
  focus: string;
  headings: Record<"overview" | "challenge" | "solution" | "showcase" | "implementation" | "workflow" | "outcomes" | "related" | "cta", string>;
  showcaseIntro: string;
  challenge: string;
  solution: string;
  capabilities: { title: string; description: string }[];
  technologies: string[];
  decisions: { title: string; description: string }[];
  workflow: { title: string; description: string }[];
  outcomes: { title: string; description: string }[];
  currentStatus: string;
};

export type PublicCaseStudy = Project | EditorialProject;

// Draft wording contains no private records or approval evidence. Do not import
// this catalog into Client Components. Routes select only publication-ready items.
export const financeos: Project = {
  slug: "financeos",
  name: "FinanceOS",
  portfolioName: "VLKO Finance",
  ownership: "independent",
  developmentStatus: "internal",
  classification: "Internal software product",
  status: "draft",
  // Classification was explicitly supplied by the owner in this task.
  approvals: { classification: true, role: false, claims: false, media: false },
  role: null,
  focus: "Business workflows & financial visibility",
  headings: {
    overview: "The records behind the business.",
    challenge: "Keep the workflow connected.",
    solution: "One product. Defined responsibilities.",
    showcase: "Recorded values. Clear priorities.",
    implementation: "Architecture with business rules at its core.",
    workflow: "From a client record to a financial view.",
    outcomes: "What has been built.",
    related: "Build around your own workflow.",
    cta: "Have a similar system in mind?",
  },
  showcaseIntro: "FinanceOS product components, shown with synthetic presentation data. The figures illustrate the interface, not business results.",
  headline: "Business finance. One connected workspace.",
  summary: "An internal finance and invoicing product connecting client records, invoices, expenses and operational visibility.",
  description: "FinanceOS brings the records behind day-to-day business finance into a structured application: who you work with, what you invoice, what has been paid and which documents need attention.",
  challenge: "FinanceOS was conceived as a business finance workspace rather than a collection of separate invoice files and spreadsheets. The design challenge is to keep clients, issued documents, expenses and payment records connected, while making the meaning and limitations of financial information clear.",
  solution: "A shared workspace gives each record a defined place in the workflow. Business profiles and client details feed invoicing; issued documents have explicit lifecycle rules; recorded payments and expenses inform financial views. The dashboard distinguishes recorded values, estimates and unavailable information instead of presenting every number as equally certain.",
  capabilities: [
    { title: "Clients and business profiles", description: "Structured client records and business settings provide context for invoices and day-to-day administration." },
    { title: "Invoice management", description: "Drafting, issuance, duplication and linked corrections are represented as explicit document operations." },
    { title: "Expenses and documents", description: "Expense records, received documents and private attachments support the purchase side of the workflow." },
    { title: "Payment visibility", description: "Recorded payments and invoice status help distinguish outstanding and paid amounts. This is not a claim of live bank synchronization." },
    { title: "Financial views", description: "Cash-flow visualizations and finance-readiness summaries help organize recorded information, with estimates and unavailable values identified." },
    { title: "PDF documents", description: "Invoice PDFs are generated from validated issued-document snapshots, with private storage and scoped access." },
  ],
  technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Better Auth", "React PDF"],
  decisions: [
    { title: "Structured records before document output", description: "Invoice data and issued snapshots are explicit application records. A PDF is a generated output, rather than the only place the business information exists." },
    { title: "Business rules at the application boundary", description: "Validation, workspace scoping and state transitions sit in feature services and server boundaries, rather than relying on interface controls alone." },
    { title: "Financial meaning stays explicit", description: "Dashboard contracts distinguish exact recorded values, estimates and unavailable information. Recorded cash movements are not presented as a verified bank balance." },
    { title: "Identity and settings are part of the system", description: "Better Auth sessions, workspace membership and business-profile settings connect access and operating context to the application’s workflows." },
  ],
  workflow: [
    { title: "Set the business context", description: "A business profile and client record establish the information an invoice needs." },
    { title: "Prepare and issue", description: "Invoice drafting and issuance apply the defined validation and lifecycle rules." },
    { title: "Create the document. Record the payment.", description: "The issued snapshot supports PDF output, while payment recording updates the relevant invoice information." },
    { title: "Review the connected picture", description: "Recorded invoices, payments and expenses feed operational views and readiness checks." },
  ],
  outcomes: [
    { title: "A connected application structure", description: "Client, invoice, expense and payment workflows exist within one product architecture." },
    { title: "Explicit document and money states", description: "Issued snapshots, document status and financial-value contracts make important distinctions visible in the implementation." },
    { title: "A concrete product interface", description: "Dashboard components can be presented with synthetic records without exposing business or customer data." },
  ],
  currentStatus: "FinanceOS is an internal software product. This case study describes source-reviewed capabilities and uses synthetic presentation data. It does not establish a public SaaS launch, production acceptance or measured commercial results.",
  // Unapproved captures stay in the ignored, loopback-only review harness.
  // Add authorized public media here only after explicit asset approval.
  media: [],
  relatedServices: [
    { title: "Custom software development", href: "/services/custom-software" },
    { title: "Automation & API integrations", href: "/services/automation-ai" },
  ],
};

export { intelligentBusinessPlatform };

export { pokracujStudio };

export const vlkoMotion: PortfolioListing = {
  slug: "vlko-motion",
  name: "VLKO Motion",
  classification: "Mobile App · Product Development",
  summary: "A performance-focused mobile application for structured training, workout tracking and personal progress.",
  description: "A proprietary mobile fitness application combining workout planning, exercise management, real-time training tracking and performance analytics within a minimalist interface.",
  ownership: "independent",
  developmentStatus: "unconfirmed",
  status: "draft",
  media: [],
};

export const homepageProjects = [intelligentBusinessPlatform, miniSklady, pokracujStudio] as const;
export const projects: readonly (PublicCaseStudy | PortfolioListing)[] = [...homepageProjects, financeos, vlkoMotion];

export function isPublishedProject(project: PublicCaseStudy | PortfolioListing): project is PublicCaseStudy {
  return project.status === "published"
    && "approvals" in project
    && Object.values(project.approvals).every(Boolean)
    && Boolean(project.role?.trim())
    && project.media.length >= ("editorial" in project ? 1 : 3)
    && project.media.every(media => media.approved
      && /^\/images\/work\/[a-z0-9/_-]+\.(webp|png|jpg|jpeg)$/.test(media.src)
      && !media.src.includes("..")
      && media.width > 0 && media.height > 0
      && Boolean(media.alt.trim()) && Boolean(media.caption.trim()));
}

export function getPublishedProjects(): PublicCaseStudy[] {
  return projects.filter(isPublishedProject);
}

export function getPublishedProject(slug: string): PublicCaseStudy | undefined {
  return getPublishedProjects().find(project => project.slug === slug);
}

// Explicit development-only review of this one draft. Never alters publication,
// sitemap, approved media, or other drafts. Bind the dev server to loopback.
export function getPlatformDraftForReview(): EditorialProject | undefined {
  return process.env.NODE_ENV === "development"
    && process.env.WORK_PLATFORM_PREVIEW === "1"
    && intelligentBusinessPlatform.status === "draft"
    ? intelligentBusinessPlatform
    : undefined;
}

export function getWorkReviewProject(slug: string): PublicCaseStudy | undefined {
  const published = getPublishedProject(slug);
  if (published) return published;
  const draft = getPlatformDraftForReview();
  return draft?.slug === slug ? draft : undefined;
}

export function getWorkProjectHref(project: PublicCaseStudy | PortfolioListing): string | undefined {
  if (isPublishedProject(project)) return `/work/${project.slug}`;
  const draft = getPlatformDraftForReview();
  return draft?.slug === project.slug ? `/work/${project.slug}` : undefined;
}

export function getPortfolioEntries() {
  return projects.map(project => ({
    project,
    href: getWorkProjectHref(project),
  }));
}
