import { ServicePage } from "@/components/services/ServicePage";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Business Automation, API Integrations & Applied AI",
  "Connect business tools, automate repetitive workflows and apply AI with human oversight. Explore automation and integration services from Daniel VLKO.",
  "/services/automation-ai",
);

export default function AutomationAI() {
  return <ServicePage service={services[2]} />;
}
