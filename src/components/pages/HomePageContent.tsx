import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/hero/Hero";
import { System } from "@/components/sections/system/System";
import { WhatIBuild } from "@/components/sections/build/WhatIBuild";
import { SelectedWork } from "@/components/sections/work/SelectedWork";
import { Process } from "@/components/sections/process/Process";
import { WhyWorkWithDaniel } from "@/components/sections/about/WhyWorkWithDaniel";
import { HomeFAQ } from "@/components/sections/faq/HomeFAQ";
import { FinalCTA } from "@/components/sections/contact/FinalCTA";
import { Footer } from "@/components/layout/Footer";

export function HomePageContent() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className="relative"><Hero /></div>
        <WhatIBuild />
        <SelectedWork />
        <System />
        <Process />
        <WhyWorkWithDaniel />
        <HomeFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
