import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/work/ProjectCaseStudy";
import { getPublishedProject, getPublishedProjects } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProjects().map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) notFound();
  return pageMetadata(`${project.name} — Project Case Study`, project.summary, `/work/${project.slug}`);
}

export default async function WorkProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} />;
}
