export const about = {
  introduction: "I bring software engineering, business thinking and automation together to build connected digital systems. The starting point is how the business works: its customers, its people and the information moving between them.",
  focus: [
    { label: "Growth", text: "Websites and customer-facing experiences." },
    { label: "Efficiency", text: "Software shaped around business operations." },
    { label: "Connection", text: "Integrations, automation and applied AI." },
  ],
  services: [
    { title: "Customer-facing web", text: "Business websites, e-commerce experiences and web applications that make an offer clear and give customers a useful next step.", href: "/services/web-development" },
    { title: "Business software", text: "Internal tools, dashboards and portals built around the records, rules and workflows the business actually needs.", href: "/services/custom-software" },
    { title: "Automation & applied AI", text: "Connections between existing tools and defined workflows, with human oversight where outputs or decisions need review.", href: "/services/automation-ai" },
  ],
  thinking: [
    { title: "Understand the constraint", text: "Find the bottleneck before deciding whether the answer is a new interface, a better process or a connection between tools." },
    { title: "Design the whole workflow", text: "Consider the people, data, business rules and exceptions together. A useful feature needs a clear place in the wider system." },
    { title: "Build what earns its place", text: "Reuse suitable tools and build the parts that need to fit the business. Keep the architecture proportionate to the problem." },
    { title: "Make ownership clear", text: "Keep implementation, access, responsibilities and handover understandable so the system can be maintained and improved." },
  ],
  expertise: [
    { title: "Web interfaces", text: "React, Next.js and TypeScript; responsive layouts, semantic HTML and clear server/client boundaries." },
    { title: "Business data & application rules", text: "PostgreSQL, Prisma, structured records, validation and explicit workflow states." },
    { title: "Integrations & automation", text: "API connections, provider boundaries and handling for failed or uncertain workflow steps." },
    { title: "Maintainable foundations", text: "Portable Node.js applications, clear configuration and practical operating and handover requirements." },
  ],
  collaboration: [
    { title: "Direct collaboration", text: "You speak with the person designing and building the system. Decisions and trade-offs stay connected to the work." },
    { title: "A defined scope", text: "We agree the useful outcome, deliverables and responsibilities before implementation, including what sits outside the project." },
    { title: "Working software to review", text: "Review the implementation against real scenarios and agreed criteria, then decide what needs refinement or a later phase." },
  ],
} as const;
