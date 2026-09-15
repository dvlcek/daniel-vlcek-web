export type MetricDirection = "up" | "down";

export type AnimatedMetric = {
  value: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  direction: MetricDirection;
};

export type WorkMetric = {
  value: string;
  label: string;
  detail?: string;
};

export type WorkCaseStudy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  metrics?: WorkMetric[];
  bullets?: string[];
};

export const selectedWorkIntroStats: AnimatedMetric[] = [
  {
    value: 3,
    label: "core disciplines",
    direction: "up",
  },
  {
    value: 1,
    label: "connected delivery",
    direction: "up",
  },
  {
    value: 0,
    from: 6,
    label: "template-first builds",
    direction: "down",
  },
];

export const featuredCaseStudy: WorkCaseStudy = {
  eyebrow: "Featured Case Study",

  title: "Business Platform",

  subtitle:
    "One operating system instead of fragmented tools, manual handoffs and disconnected information.",

  description:
    "A custom platform bringing customers, operations, payments and day-to-day workflows into one structured system — designed around how the business actually runs.",

  image: "/images/work/main.webp",

  imageAlt:
    "Custom business platform dashboard showing operations, customers and business data",

  href: "#business-platform",

  metrics: [
    {
      value: "Unified",
      label: "business operations",
      detail: "One system",
    },
    {
      value: "Automated",
      label: "repetitive workflows",
      detail: "Less admin",
    },
    {
      value: "Scalable",
      label: "technical foundation",
      detail: "Built for growth",
    },
  ],
};

export const secondaryCaseStudies: WorkCaseStudy[] = [
  {
    eyebrow: "Automation & Applied AI",

    title: "AI Operations System",

    subtitle:
      "Turn repetitive processes and scattered information into workflows that move on their own.",

    description:
      "Automation and applied AI connect existing tools, process information and keep critical systems synchronized.",

    image: "/images/work/ai-operations.png",

    imageAlt:
      "Automation and applied AI workflow connecting business systems",

    href: "#ai-operations",

    bullets: [
      "Removes repetitive manual work",
      "Extracts and structures information",
      "Connects the tools already in use",
    ],
  },

  {
    eyebrow: "Web & Client Platform",

    title: "Client Platform",

    subtitle:
      "A digital experience that earns trust, communicates value and moves the customer forward.",

    description:
      "High-performance client-facing platforms with strong positioning, clean UX and a technical foundation designed to scale.",

    image: "/images/work/client-platform.png",

    imageAlt:
      "Modern client-facing website and digital platform",

    href: "#client-platform",
  },
];