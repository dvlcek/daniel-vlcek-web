import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
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

export const metadata = pageMetadata(siteConfig.title, siteConfig.description, "/");

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className="relative">
          <Hero />
        </div>

        <Problem />
        <System />
        <WhatIBuild />
        <SelectedWork />
        <Process />
        <WhyWorkWithDaniel />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
