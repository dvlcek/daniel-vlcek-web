import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/work/ProjectCaseStudy";
import { getPublishedProjects, getWorkReviewProject, getPlatformDraftForReview } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  const published = getPublishedProjects();
  const draft = getPlatformDraftForReview();
  return [...published, ...(draft ? [draft] : [])].map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getWorkReviewProject(slug);
  if (!project) notFound();

  if (project.status === "draft") {
    return {
      title: `${project.name} — Local draft review`,
      description: project.summary,
      robots: { index: false, follow: false },
    };
  }

  if ("editorial" in project) {
    const [hero] = project.media;
    return pageMetadata(project.seo.title, project.seo.description, `/work/${project.slug}`, {
      image: { url: hero.src, width: hero.width, height: hero.height, alt: hero.alt },
    });
  }
  return pageMetadata(`${project.name} — Project Case Study`, project.summary, `/work/${project.slug}`);
}

export default async function WorkProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getWorkReviewProject(slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} />;
}
