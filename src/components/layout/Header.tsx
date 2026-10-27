import { HeaderNavigation } from "./HeaderNavigation";
import { getPortfolioNavigation } from "@/lib/portfolio-navigation";

export function Header() {
  return <HeaderNavigation workHref={getPortfolioNavigation().workHref} />;
}
