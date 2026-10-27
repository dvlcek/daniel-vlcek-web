import { ServicePage } from "@/components/services/ServicePage";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Web Development & E-commerce",
  "Custom business websites, e-commerce and customer-facing web applications. Explore scope, process and cooperation options with Daniel VLKO.",
  "/services/web-development",
);

export default function WebDevelopment() {
  return <ServicePage service={services[0]} />;
}
