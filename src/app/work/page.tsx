import { redirect } from "next/navigation";
import { WorkIndex } from "@/components/work/WorkIndex";
import { getPublishedProjects } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Selected Work", "Explore software projects, their business context and implementation with Daniel VLKO.", "/work", { index: getPublishedProjects().length > 0 });

export default function WorkPage() {
  const projects = getPublishedProjects();
  if (projects.length === 0) redirect("/#work");
  return <WorkIndex projects={projects} />;
}
