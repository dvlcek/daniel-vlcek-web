"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { NAVIGATION_EVENT, navigationTarget } from "./page-transition";

/** Keep Next Link's native prefetch, scroll, history and modifier-click behavior. */
export default function MarketingLink({ onNavigate, href, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props} href={href} onNavigate={onNavigate ?? (() => {
      if (typeof href !== "string") return;
      const target = navigationTarget(href, window.location.href);
      if (target) window.dispatchEvent(new CustomEvent(NAVIGATION_EVENT, { detail: target }));
    })} />
  );
}
