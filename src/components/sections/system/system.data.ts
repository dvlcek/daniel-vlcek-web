export const workflowStages = [
  { id: "website", title: "Website", subtitle: "Customer experience", event: "New enquiry received" },
  { id: "crm", title: "CRM", subtitle: "Customer data", event: "Lead created automatically" },
  { id: "automation", title: "Automation", subtitle: "Connected workflows", event: "Follow-up prepared" },
  { id: "analytics", title: "Analytics", subtitle: "Business intelligence", event: "Business data updated" },
] as const;

export type WorkflowStep = 0 | 1 | 2 | 3 | 4;
// Ready, enquiry, CRM, automation, completed. Total cycle: 8.4 seconds.
export const stepDurations = [900, 1500, 1500, 1500, 3000] as const;
export const sampleEnquiries = 128;
export const sampleContacts = [
  { initials: "SN", name: "Studio North", status: "Qualified" },
  { initials: "AC", name: "Example Co.", status: "Active client" },
] as const;

export const benefits = [
  { title: "Less manual work", description: "Let routine tasks run automatically." },
  { title: "Connected operations", description: "Keep information moving between tools." },
  { title: "Built to scale", description: "Extend your systems as your business grows." },
] as const;
