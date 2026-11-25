import type { EditorialProject } from "./projects";

/** Public-facing editorial copy only. No private business records. */
export const intelligentBusinessPlatform: EditorialProject = {
  slug: "intelligent-business-platform",
  name: "Intelligent Business Platform",
  classification: "Custom Software · Business Intelligence",
  services: ["Custom Software", "Business Intelligence", "Automation & AI"],
  ownership: "independent",
  developmentStatus: "in-development",
  status: "draft",
  // Keep the publication gate closed until the owner reviews the final claims
  // and explicitly approves a genuine, sanitized public project image.
  approvals: { classification: true, role: true, claims: false, media: false },
  role: "Independent product design & development",
  industry: "Cross-industry business operations",
  projectType: "Modular Business Software",
  scope: "CRM, Operations, Business Intelligence & Automation",
  headline: "Your business. Fully connected.",
  introduction: "A modular business platform designed to connect customers, sales, projects and operations — creating a foundation for smarter decisions, tailored automation and sustainable growth.",
  summary: "A connected business platform bringing together customer management, operational workflows and business intelligence.",
  description: "A custom-built business platform designed to centralize customer relationships, sales, projects and operational data. Its modular architecture provides a foundation for tailored automation, industry-specific analytics and AI-assisted decision-making.",
  seo: {
    title: "Intelligent Business Platform — Custom Software & AI",
    description: "Explore a modular business platform designed to connect CRM, projects, business operations, custom automation and intelligent decision-making.",
  },
  media: [
  {
    src: "/images/work/business-os-concept.webp",
    alt: "Intelligent Business Platform dashboard design concept",
    caption: "Conceptual interface illustrating the platform's design direction.",
    width: 1672,
    height: 941,
    approved: false,
  },
],
  relatedServices: [
    { title: "Custom software development", href: "/services/custom-software" },
    { title: "Automation & API integrations", href: "/services/automation-ai" },
  ],
  editorial: {
    sections: [
      {
        id: "business-challenge",
        label: "The challenge",
        heading: "A growing business shouldn't mean growing complexity.",
        paragraphs: [
          "As businesses grow, customer information, projects, financial records and operational knowledge often end up in disconnected tools. Teams spend time collecting information instead of acting on it.",
          "The challenge is not necessarily a lack of software. It is the lack of connection between the systems a company already depends on. The Intelligent Business Platform explores a different approach: building a digital foundation around the way a business actually operates.",
        ],
      },
      {
        id: "connected-foundation",
        label: "The foundation",
        heading: "One platform. A connected business.",
        paragraphs: [
          "The platform is an independent software project in active development. Its current foundation brings customer relationships, project execution and operational oversight into a shared environment.",
          "The aim is not to force companies into a rigid software product. A modular foundation can be adapted to different processes, priorities and growth ambitions. More advanced intelligence and integrations are part of its development direction.",
        ],
        capabilities: [
          { title: "Customer relationships", description: "Lead management, customer records and connected projects form the foundation of the CRM." },
          { title: "Business operations", description: "Projects, tasks, milestones and responsibilities connect planning with execution." },
          { title: "Operational visibility", description: "A central overview brings active work, deadlines and items needing attention together." },
          { title: "Controlled collaboration", description: "Role-based access and a client portal foundation support separate staff and customer experiences." },
          { title: "Connected infrastructure — direction", description: "Tailored integrations can connect websites, e-commerce, financial software and internal tools." },
          { title: "Intelligent assistance — direction", description: "Industry-specific analytics and AI-assisted workflows are planned extensions of the operational foundation." },
        ],
      },
      {
        id: "command-center",
        label: "Business Command Center / current foundation",
        heading: "See the bigger picture.",
        paragraphs: [
          "A centralized operational overview helps business owners and teams see what is happening without constantly switching between disconnected tools. Active projects, assigned tasks, deadlines and recent activity provide context for day-to-day decisions.",
          "The longer-term direction is a personalized executive environment combining operational information with revenue, profitability, forecasts, team capacity and strategic priorities. These advanced intelligence capabilities are not presented as currently delivered features.",
        ],
        checklist: [
          "Active projects and project health",
          "Assigned tasks and responsibilities",
          "Upcoming deadlines and milestones",
          "Recent activity and items requiring attention",
        ],
      },
      {
        id: "intelligent-crm",
        label: "Intelligent CRM / current foundation and direction",
        heading: "From first contact to lasting relationships.",
        paragraphs: [
          "Customer relationships should not exist independently of the work a company delivers. The CRM foundation connects leads, client profiles, contacts, activity and projects, including a structured lead-to-client conversion process.",
          "The next development direction is deeper customer intelligence: lead discovery, enrichment, qualification and AI-assisted sales recommendations. The lifecycle below illustrates the intended end-to-end approach, not a claim that every stage is already automated.",
        ],
        workflow: [
          { title: "Discover", description: "Capture potential opportunities and bring them into the sales pipeline." },
          { title: "Qualify", description: "Review fit and context; intelligent enrichment is a development direction." },
          { title: "Convert", description: "Connect a qualified lead with a structured client record." },
          { title: "Deliver", description: "Connect customer relationships with project execution and tasks." },
          { title: "Retain", description: "Build on customer history; tailored follow-up workflows can extend the relationship." },
        ],
      },
      {
        id: "business-operations",
        label: "Operations / current foundation",
        heading: "Turn business priorities into execution.",
        paragraphs: [
          "Projects, tasks, milestones, owners and deadlines are connected within one operational environment. Teams can see what needs to happen, who is responsible and where attention is required.",
          "Resource planning, reusable process templates, approvals, intelligent risk detection and operational forecasting are potential extensions. The goal is to support increasingly complex operations without introducing unnecessary administrative work.",
        ],
        capabilities: [
          { title: "Project management", description: "Structured projects with status, health, ownership and milestones." },
          { title: "Task management", description: "Assigned work, deadlines and an individual view of open responsibilities." },
          { title: "Operational history", description: "Activity and status information provide context for ongoing work." },
        ],
      },
      {
        id: "business-intelligence",
        label: "AI Business Intelligence / product direction",
        heading: "Understand more. Decide better.",
        paragraphs: [
          "The next stage focuses on transforming business information into meaningful insights. Rather than adding generic AI features, intelligent capabilities can be designed around a company's industry, processes and available data.",
          "Illustrative use case: a fashion retailer could connect its existing sales and inventory data to compare monthly performance, identify bestselling and underperforming products, detect purchasing patterns and highlight potential inventory issues. Owners could receive insights tailored to the decisions they actually need to make.",
          "This is an example of a possible tailored implementation, not an existing customer deployment or a measured commercial result.",
        ],
        checklist: [
          "Compare performance across periods",
          "Identify bestselling and underperforming products",
          "Discover changing customer purchasing patterns",
          "Highlight potential inventory and operational issues",
          "Support more informed business decisions",
        ],
      },
      {
        id: "ai-copilot",
        label: "AI Copilot / product vision",
        heading: "An intelligent layer across your business.",
        paragraphs: [
          "The longer-term direction includes an AI assistant working with authorized company context. The vision is to help teams understand information, identify priorities, prepare decisions and reduce repetitive administrative work.",
          "Potential capabilities include daily briefings, business questions, document analysis, project insights and assisted workflow execution. These would require appropriate permissions, validated data and human oversight. They are not claims of autonomous or unrestricted production access.",
        ],
        capabilities: [
          { title: "Daily intelligence", description: "Summarize relevant developments and highlight items that may need attention." },
          { title: "Business context", description: "Answer questions using information the requesting person is authorized to access." },
          { title: "Decision support", description: "Help evaluate opportunities, risks and possible next steps." },
        ],
      },
      {
        id: "custom-automation",
        label: "Custom automation / tailored solutions",
        heading: "Less manual work. More room to grow.",
        paragraphs: [
          "Every company operates differently. Instead of requiring business owners to build and maintain their own automations, workflows can be designed and implemented around their actual processes.",
          "The approach is to integrate existing systems rather than replace them unnecessarily. Websites, e-commerce, accounting software, payment systems and internal tools can form part of a connected digital environment. Integrations and automations depend on the individual engagement; the examples below are not a list of built-in platform features.",
        ],
        checklist: [
          "Customer onboarding and communication",
          "Lead qualification and routing",
          "Document processing and internal approvals",
          "Reporting and notifications",
          "Website and e-commerce integrations",
          "Financial system integrations",
        ],
      },
      {
        id: "tailored-implementation",
        label: "The approach",
        heading: "Built around your business. Not the other way around.",
        paragraphs: [
          "This is not positioned as a generic self-service SaaS subscription. The approach starts with understanding how a company operates, where it experiences friction and what it needs to achieve.",
          "A shared modular foundation supports tailored development, configuration, integrations and custom workflows. Each solution can evolve with the company's requirements, rather than forcing every company into the same operational model.",
        ],
        workflow: [
          { title: "Discover", description: "Understand the business, workflows, challenges and growth priorities." },
          { title: "Architect", description: "Design the digital infrastructure around the actual requirements." },
          { title: "Build & Connect", description: "Develop required modules and connect relevant existing systems." },
          { title: "Automate", description: "Implement reliable workflows around repetitive processes." },
          { title: "Evolve", description: "Continuously improve the system as the business develops." },
        ],
      },
      {
        id: "long-term-partnership",
        label: "Long-term partnership",
        heading: "Technology that evolves with your business.",
        paragraphs: [
          "A business system should not become another limitation as the company grows. The objective is to create a scalable foundation that can evolve through new functionality, improved processes, deeper integrations and intelligent automation.",
          "Ongoing technical collaboration can help ensure that software continues to support the business as its requirements change. The platform remains in active development; its future capabilities and custom implementations depend on the needs and constraints of each engagement.",
        ],
      },
    ],
    closing: "The goal isn't more software. It's a more connected, efficient and intelligent business.",
    relatedSlugs: ["mini-sklady"],
    cta: {
      heading: "Let's build the next version of your business.",
      subheading: "Your business. Your processes. Your system.",
      description: "Whether you need to connect existing systems, reduce manual processes or develop a custom business platform, let's explore what the right digital infrastructure could look like for your company.",
      primary: "Book a strategy call",
      secondary: "Explore more projects",
    },
  },
};
