import { AboutPage } from "@/components/about/AboutPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("About Daniel — Software Developer & Automation Architect", "Meet Daniel VLKO. Explore a systems-first approach to web development, business software, connected workflows and applied AI.", "/about");

export default function About() {
  return <AboutPage />;
}
