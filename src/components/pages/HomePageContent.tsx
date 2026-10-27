import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/hero/Hero";
import { Problem } from "@/components/sections/problem/Problem";
import { System } from "@/components/sections/system/System";
import { WhatIBuild } from "@/components/sections/build/WhatIBuild";
import { SelectedWork } from "@/components/sections/work/SelectedWork";
import { Process } from "@/components/sections/process/Process";
import { WhyWorkWithDaniel } from "@/components/sections/about/WhyWorkWithDaniel";
import { FinalCTA } from "@/components/sections/contact/FinalCTA";
import { Footer } from "@/components/layout/Footer";
import { getPortfolioNavigation } from "@/lib/portfolio-navigation";
import { getPublishedProject, type Project } from "@/content/projects";

export function HomePageContent({ featuredProject = getPublishedProject("financeos") }: { featuredProject?: Project }) {
  const navigation = getPortfolioNavigation();
  const media = featuredProject?.media[0];
  const featured = featuredProject && media ? {
    eyebrow: `${featuredProject.classification} / ${featuredProject.status === "draft" ? "Local review" : "Selected work"}`,
    title: featuredProject.name,
    subtitle: featuredProject.headline,
    description: "Client records, invoices, expenses and financial views. Interface visuals use synthetic data; they are not customer results.",
    image: media.src,
    imageAlt: media.alt,
    metrics: [{ value: "Clients", label: "Structured records" }, { value: "Invoices", label: "Document workflows" }, { value: "Cashflow", label: "Operational visibility" }],
  } : undefined;
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className="relative"><Hero workHref={navigation.workHref} /></div>
        <Problem />
        <System />
        <WhatIBuild />
        <SelectedWork workHref={navigation.workHref === "/#work" ? "#case-studies" : navigation.workHref} projectHref={navigation.financeosHref} featuredProject={featured} />
        <Process />
        <WhyWorkWithDaniel />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
