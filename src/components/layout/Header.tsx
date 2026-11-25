import { connection } from "next/server";
import { isComingSoonEnabled } from "@/lib/site";
import { HeaderNavigation } from "./HeaderNavigation";
import { getPortfolioNavigation } from "@/lib/portfolio-navigation";

export async function Header({ launchAware = false }: { launchAware?: boolean }) {
  if (launchAware) await connection();
  return <HeaderNavigation workHref={getPortfolioNavigation().workHref} launch={launchAware && isComingSoonEnabled()} />;
}
