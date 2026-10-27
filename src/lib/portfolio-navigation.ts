import { getPublishedProject, getPublishedProjects } from "@/content/projects";

// Server-side navigation derives only from the publication gate. The isolated
// local review app substitutes its own module; production has no preview flag.
export function getPortfolioNavigation(): { workHref: string; financeosHref?: string } {
  return {
    workHref: getPublishedProjects().length > 0 ? "/work" : "/#work",
    financeosHref: getPublishedProject("financeos") ? "/work/financeos" : undefined,
  };
}
