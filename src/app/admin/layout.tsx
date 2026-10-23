import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Administration", "Private Daniel VLKO administration.", "/admin", { index: false, follow: false });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
