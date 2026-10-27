import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { HomePageContent } from "@/components/pages/HomePageContent";

const homeMetadata = pageMetadata(siteConfig.title, siteConfig.description, "/");
export const metadata = {
  ...homeMetadata,
  alternates: { ...homeMetadata.alternates, types: { "text/markdown": "/index.md" } },
};

export default function HomePage() {
  return <HomePageContent />;
}
