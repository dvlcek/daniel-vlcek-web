export type Service = {
  slug: string;
  name: string;
  outcome: "Growth" | "Efficiency";
  title: string;
  description: string;
  summary: string;
  problemIntro: string;
  problems: string[];
  solutionTitle: string;
  solution: string;
  deliverables: { title: string; description: string }[];
  boundary: string;
  process: { title: string; description: string }[];
  engagements: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

export const services = [
  {
    slug: "web-development",
    name: "Web Development",
    outcome: "Growth",
    title: "Make your business easier to understand. And easier to choose.",
    description: "Custom websites, e-commerce experiences and customer-facing web applications that put your offer, your customers and the next step first.",
    summary: "Business websites, e-commerce and customer-facing experiences built for clarity, usability and a clear path to enquiry or purchase.",
    problemIntro: "Your website should help a potential customer understand the offer and take the next step with confidence.",
    problems: [
      "Visitors have to work too hard to understand what you offer or who it is for.",
      "An outdated site, slow pages or awkward mobile navigation gets in the way of enquiries.",
      "Customers need to book, buy or access a service, but the online journey is fragmented.",
    ],
    solutionTitle: "A clear experience, backed by the right technology.",
    solution: "I build business websites and web applications around the information and actions your customers need. The work can cover a new site, a focused redesign, an e-commerce experience or improvements to an existing platform. Structure, content, accessibility and performance are considered together.",
    deliverables: [
      { title: "Business websites", description: "A clear page structure, responsive layouts and content presentation that explain your offer and guide visitors towards an enquiry." },
      { title: "E-commerce experiences", description: "Product discovery, product pages and purchasing journeys, with payment and order integrations scoped around your platform and requirements." },
      { title: "Customer-facing applications", description: "Booking journeys, account areas and web interfaces that let customers use your service online." },
      { title: "Focused improvements", description: "Review and implementation of specific usability, accessibility, performance or technical SEO improvements on an existing site." },
    ],
    boundary: "This service focuses on the customer experience. If the main challenge is internal operations, custom software may be the better starting point. Content production, product data, integrations and hosting responsibilities are agreed in scope; they are not automatically included.",
    process: [
      { title: "Understand the customer journey", description: "Clarify your audience, offer, current site and the actions the experience needs to support." },
      { title: "Define the structure", description: "Agree the pages, content responsibilities, key interactions and technical requirements before implementation." },
      { title: "Build and review", description: "Develop the agreed experience and review it across screen sizes, including navigation, forms and key journeys." },
      { title: "Prepare for handover", description: "Check the agreed acceptance criteria and clarify launch, ownership and any separately scoped improvements." },
    ],
    engagements: [
      { title: "Discovery and scoping", description: "Define the audience, page structure and priorities before committing to a larger build." },
      { title: "Project implementation", description: "Build a new website, redesign an agreed part of the experience or deliver a defined web application." },
      { title: "Integration or improvement", description: "Connect a booking, commerce or business tool, or address a specific issue on an existing site, subject to technical review." },
    ],
    faqs: [
      { question: "Can you improve an existing website?", answer: "Yes. The starting point is a review of the current code, platform and goals. That helps determine whether a focused improvement or a broader rebuild is appropriate." },
      { question: "Do you build e-commerce websites?", answer: "E-commerce experiences are part of the service. The catalogue, checkout, payments, fulfilment connections and platform constraints need to be scoped for the particular business." },
      { question: "Is SEO included?", answer: "Technical foundations such as semantic pages, metadata, crawlable links and performance can be included in the agreed scope. Keyword research, ongoing content work and search campaigns need their own scope. Rankings and conversion gains are not guaranteed." },
      { question: "Who provides the content and assets?", answer: "We agree that before the build. You will need to provide or approve accurate business information, final wording and assets you have the right to publish." },
      { question: "How are cost and timing decided?", answer: "They depend on the page count, interactions, content readiness and integrations. The discovery call helps establish what needs to be scoped; a price or delivery date is not assumed before that work." },
    ],
  },
  {
    slug: "custom-software",
    name: "Custom Software",
    outcome: "Efficiency",
    title: "Software built around the way your business works.",
    description: "Internal platforms, dashboards and portals for companies whose workflows have outgrown spreadsheets and disconnected tools.",
    summary: "Internal platforms, operational dashboards and portals that give business-specific workflows a maintainable home.",
    problemIntro: "When the team has to work around its tools, important context gets lost between spreadsheets, messages and manual handoffs.",
    problems: [
      "The same customer, job or order information lives in several places and is difficult to keep consistent.",
      "Your team relies on spreadsheets and individual knowledge to keep daily operations moving.",
      "An off-the-shelf tool cannot support an important workflow without awkward workarounds.",
    ],
    solutionTitle: "One clear place to manage the work that matters.",
    solution: "I build custom business applications around your users, information and operating rules. That can mean an internal platform, a focused workflow tool or a portal connected to existing systems. We start with the essential workflow and define what genuinely needs custom development.",
    deliverables: [
      { title: "Internal business platforms", description: "Shared workspaces for managing customers, jobs, tasks or inventory, shaped around the way your team operates." },
      { title: "Operational dashboards", description: "Views of relevant business information, with the data sources, definitions and update requirements agreed in advance." },
      { title: "CRM and management tools", description: "Business-specific records and workflows for leads, bookings or service delivery, including the access rules the application needs." },
      { title: "Client and employee portals", description: "Purpose-built access to the information and actions different users need, with responsibilities and permissions defined in scope." },
    ],
    boundary: "Custom software is the right starting point when the business needs its own application or workflow. Connecting tools you already use may fit automation instead. Data migration, third-party licences and operational support are separate scope decisions.",
    process: [
      { title: "Map the real workflow", description: "Understand the people, information, rules and exceptions involved in the current process." },
      { title: "Define the essential application", description: "Agree the first useful scope, data model, access requirements and how the software will connect to existing tools." },
      { title: "Build against real scenarios", description: "Implement the agreed workflows and review them using representative, appropriately sanitized examples." },
      { title: "Verify and hand over", description: "Review acceptance criteria, document the agreed operating requirements and plan any further development separately." },
    ],
    engagements: [
      { title: "Discovery and scoping", description: "Map the workflow and assess whether custom development is justified before defining the implementation." },
      { title: "Project implementation", description: "Deliver a focused business application or an agreed extension to a suitable existing system." },
      { title: "System integration", description: "Connect the application to existing services where access, APIs and data ownership make that practical." },
    ],
    faqs: [
      { question: "Should we use an existing tool instead?", answer: "That is worth assessing first. Custom development makes sense when the workflow or integration requirements justify owning and maintaining a dedicated application." },
      { question: "Can you build a CRM, booking system or portal?", answer: "These are relevant application types. The actual scope depends on the users, business rules, access requirements and integrations involved." },
      { question: "Can existing data be moved into the application?", answer: "A migration can be scoped after reviewing the source data, its quality and your permission to use it. Import rules, validation and responsibilities need to be agreed before moving data." },
      { question: "How do you approach maintainability?", answer: "The aim is a clear architecture, documented setup and explicit business rules. Technology choices and hosting requirements should fit the application and the team responsible for operating it." },
      { question: "What happens after delivery?", answer: "Handover and operating responsibilities are agreed as part of the project. Further features or maintenance require a separate agreement; an ongoing support service or response time is not implied." },
    ],
  },
  {
    slug: "automation-ai",
    name: "Automation & AI",
    outcome: "Efficiency",
    title: "Connect your tools. Take repetitive work off your team’s plate.",
    description: "Business process automation, API integrations and applied AI workflows that move information between systems while keeping people in control.",
    summary: "Connected tools, automated handoffs and human-reviewed AI workflows for repetitive operational tasks.",
    problemIntro: "Repetitive work often happens in the gaps between systems: copying information, checking documents and chasing the next action.",
    problems: [
      "Your team repeatedly copies information between a CRM, inbox, spreadsheet or another business tool.",
      "Lead follow-ups and operational handoffs depend on someone remembering every next step.",
      "Documents and messages contain useful information that has to be extracted and checked by hand.",
    ],
    solutionTitle: "A connected workflow, with clear rules and oversight.",
    solution: "I connect existing systems and automate defined steps such as moving records, triggering follow-ups or processing documents. Where AI is appropriate, it can assist with extraction, classification or drafting. Important decisions and uncertain outputs need an explicit review path rather than an assumption that the system is always right.",
    deliverables: [
      { title: "API integrations", description: "Connections between business tools, with agreed data mappings, access permissions and handling for failed requests." },
      { title: "Lead and CRM workflows", description: "Defined handoffs for incoming enquiries, record updates and follow-up tasks across the tools involved." },
      { title: "Document processing", description: "Extraction and structuring of information from agreed document types, with validation and a route for exceptions." },
      { title: "Applied AI workflows", description: "Assistance with tasks such as classification or drafting, evaluated on representative examples and paired with appropriate human review." },
    ],
    boundary: "Automation connects or coordinates existing tools. If you need a new application for the workflow itself, custom software may be more appropriate. Provider costs, access permissions and usage limits are scoped explicitly. Sensitive data should only reach an AI provider after its use, retention settings and approval requirements have been reviewed.",
    process: [
      { title: "Choose a bounded workflow", description: "Identify the repetitive task, current tools, exceptions and the person responsible for the outcome." },
      { title: "Define the rules and data boundaries", description: "Agree which information can move, what requires human approval and how failed or uncertain steps should be handled." },
      { title: "Build and evaluate", description: "Implement the connection or workflow and test agreed scenarios using synthetic or appropriately sanitized data." },
      { title: "Review before wider use", description: "Check outputs, permissions and recovery paths, then document operating responsibilities and any next phase." },
    ],
    engagements: [
      { title: "Discovery and scoping", description: "Assess a workflow for automation, identify dependencies and decide whether AI adds useful value." },
      { title: "Focused implementation", description: "Build one defined workflow with agreed inputs, outputs, checks and exception handling." },
      { title: "Integration project", description: "Connect selected tools and define their data exchange without assuming every part of the business needs to change." },
    ],
    faqs: [
      { question: "Does the workflow need AI?", answer: "Often it does not. Clear rules and an API integration may be sufficient. AI is considered where the task involves less structured information and its outputs can be evaluated appropriately." },
      { question: "Can you connect the tools we already use?", answer: "Possibly. Feasibility depends on their APIs, account permissions, usage limits and the data that needs to move. Those dependencies need a technical review before a connection is promised." },
      { question: "What stays under human control?", answer: "We define review points based on the task. Uncertain extractions, sensitive changes or consequential decisions can require approval before an action continues. AI output should not be treated as inherently correct." },
      { question: "What about confidential information?", answer: "The scope must identify which data is necessary, who can access it and which providers would receive it. Provider retention and processing terms need review before any confidential information is used." },
      { question: "What happens if an integration fails?", answer: "Failure handling is part of defining the workflow: what can be retried, what must be flagged and who takes over. Monitoring, ongoing operation and response commitments require an explicit agreement." },
    ],
  },
] as const satisfies readonly Service[];
