import type { EditorialProject } from "./projects";

export const miniSklady: EditorialProject = {
  slug: "mini-sklady",
  name: "Mini Sklady",
  classification: "Web Development · Business Automation",
  services: ["Web Development", "Custom Software", "Business Automation"],
  ownership: "client",
  developmentStatus: "live",
  status: "published",
  approvals: { classification: true, role: true, claims: true, media: true },
  role: "Development & Ongoing Management",
  industry: "Self-storage",
  projectType: "Digital Business Infrastructure",
  scope: "Website, Custom Software & Automation",
  liveUrl: "https://miniskladyslovensko.sk/",
  headline: "From a business idea to an automated rental business.",
  introduction: "A complete digital platform for a self-storage business, connecting online reservations, recurring payments, automated invoicing and business management.",
  summary: "A complete self-storage platform connecting online reservations, recurring payments and automated business operations.",
  description: "A custom-built digital infrastructure for a self-storage business, designed to automate the rental lifecycle and reduce manual administration.",
  seo: {
    title: "Mini Sklady — Self-Storage Platform Case Study",
    description: "See how Mini Sklady connects online storage reservations, recurring payments, automated invoicing and rental operations in one live platform.",
  },
  media: [{
    src: "/images/work/mini-sklady.webp",
    alt: "Mini Sklady homepage showing a corridor of orange self-storage units",
    caption: "The public Mini Sklady website, where customers explore storage options and start a reservation.",
    width: 1800, height: 923, approved: true,
  }],
  relatedServices: [
    { title: "Web development", href: "/services/web-development" },
    { title: "Custom software development", href: "/services/custom-software" },
    { title: "Automation & API integrations", href: "/services/automation-ai" },
  ],
  editorial: {
    sections: [
      {
        id: "starting-point",
        label: "The starting point",
        heading: "A business idea. A blank canvas.",
        paragraphs: [
          "Mini Sklady started with a business idea and a straightforward request: a website where customers could rent storage space.",
          "The business had no existing digital infrastructure, customer management system or established operational workflow. The opportunity was to build the digital foundation for the whole business.",
        ],
      },
      {
        id: "solution",
        label: "The solution",
        heading: "A complete digital foundation.",
        paragraphs: [
          "The platform was designed to minimize manual administration from day one. Customers can compare storage options, select a rental start date and complete their reservation online.",
          "The solution connects the customer-facing website with payment processing, invoicing, customer communication and internal business management.",
        ],
        capabilities: [
          { title: "Online reservations", description: "Customers can explore storage options, check availability and reserve their preferred rental start date online." },
          { title: "Recurring payments", description: "Automated monthly billing connects the rental agreement with the customer’s payment lifecycle." },
          { title: "Automated invoicing", description: "The platform generates and sends invoices automatically when it processes payments." },
          { title: "Digital access", description: "Customers receive a generated access code and entry instructions once their rental begins and payment is confirmed." },
          { title: "Business management", description: "A dedicated administration platform centralizes storage availability, reservations, contracts, customer information and payment status." },
          { title: "Lifecycle automation", description: "Connected workflows manage customer communication, recurring billing, payment issues and rental cancellations." },
        ],
      },
      {
        id: "customer-experience",
        label: "The customer experience",
        heading: "One connected rental lifecycle.",
        paragraphs: [
          "Customers can reserve storage space in advance without creating an account. Billing begins on the selected rental start date. Once payment is confirmed, the customer automatically receives access information.",
          "The rental continues through recurring monthly payments until cancellation.",
        ],
        workflow: [
          { title: "Discover", description: "Explore storage options and select a suitable unit." },
          { title: "Reserve", description: "Choose a rental start date and reserve online without an immediate rental charge." },
          { title: "Pay", description: "Billing begins on the selected rental start date." },
          { title: "Access", description: "Receive automatically generated access information after successful payment." },
          { title: "Manage", description: "Recurring payments, invoices and customer communication run automatically." },
          { title: "Complete", description: "Cancellation workflows manage the end of the rental." },
        ],
      },
      {
        id: "business-management",
        label: "Business management",
        heading: "Everything under control.",
        paragraphs: [
          "A custom administration platform connects customer activity with daily rental operations. Business owners manage availability, reservations, agreements, invoices and payment status in one place.",
          "Integrated lead tracking and analytics help owners see how customers interact with the business and how it develops over time.",
        ],
        checklist: [
          "Storage availability and occupancy",
          "Customer and reservation management",
          "Rental agreements and invoicing",
          "Payment status and recurring billing",
          "Lead tracking and business analytics",
          "Automated customer communication",
        ],
      },
      {
        id: "automation",
        label: "Automation by design",
        heading: "Less administration. More capacity to grow.",
        paragraphs: [
          "Automated workflows connect reservations, payment processing, invoicing and customer communication. Routine transactions run without individual manual processing. The platform was designed to reduce the need for dedicated staff to handle day-to-day rental administration.",
          "Defined processes handle failed payments and cancellations, so business owners can focus on oversight and exceptions.",
        ],
      },
      {
        id: "outcome",
        label: "The outcome",
        heading: "Built to operate. Designed to grow.",
        paragraphs: [
          "The platform is live and supports an active rental business. Its automated workflows let the company serve more customers without a proportional increase in administrative workload.",
        ],
        outcomes: [
          { title: "Built from the ground up", description: "A complete digital foundation for a new self-storage business." },
          { title: "Connected operations", description: "Reservations, payments, invoicing and administration work within one system." },
          { title: "Less manual work", description: "Routine administrative processes run automatically while the owners remain in control." },
          { title: "Ready to grow", description: "The infrastructure is designed to support a growing customer base and ongoing business development." },
        ],
      },
      {
        id: "partnership",
        label: "Ongoing partnership",
        heading: "A long-term technology partnership.",
        paragraphs: [
          "The collaboration continues beyond launch. Hosting, infrastructure maintenance, technical support and ongoing improvements help the business stay reliable and prepared for growth.",
        ],
      },
    ],
    closing: "A website was the initial request. A connected digital business infrastructure was the solution.",
    relatedSlugs: [],
    cta: {
      heading: "Have a business idea?",
      subheading: "Let’s build the infrastructure behind it.",
      description: "From customer-facing experiences to connected business systems and intelligent automation, let’s build a solution around the way your business works.",
      primary: "Book a strategy call",
      secondary: "Explore more projects",
    },
  },
};
