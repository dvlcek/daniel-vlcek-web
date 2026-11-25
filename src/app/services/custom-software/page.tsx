import { ServicePage } from "@/components/services/ServicePage";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Custom Business Software Development",
  "Internal platforms, operational dashboards, CRM tools and portals built around your business workflows. Explore custom software development with Daniel VLKO.",
  "/services/custom-software",
);

export default function CustomSoftware() {
  return <ServicePage service={services[1]} />;
}
