import { pageMetadata } from "@/lib/metadata";
import { ComingSoon } from "@/components/launch/ComingSoon";
import { Footer } from "@/components/layout/Footer";

export const metadata = pageMetadata("Website launch in progress", "Daniel VLKO is preparing the website. Contact Daniel to discuss software development and automation.", "/coming-soon", { index: false, follow: false });

export default function ComingSoonPage() {
  return <><ComingSoon /><Footer /></>;
}
