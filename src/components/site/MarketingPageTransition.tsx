"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createPageTransition } from "./page-transition";
import styles from "./MarketingPageTransition.module.css";

export function MarketingPageTransition() {
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const previous = useRef<string | null>(null);
  const controller = useRef<ReturnType<typeof createPageTransition> | null>(null);

  useLayoutEffect(() => {
    if (!cover.current || !mark.current) return;
    const instance = createPageTransition(cover.current, mark.current);
    controller.current = instance;
    return () => { instance.dispose(); controller.current = null; previous.current = null; };
  }, []);

  useLayoutEffect(() => {
    if (!pathname) return;
    if (previous.current !== null) controller.current?.commit(previous.current, pathname);
    previous.current = pathname;
  }, [pathname]);

  return (
    <div ref={cover} className={styles.cover} aria-hidden="true">
      <span ref={mark} className={styles.mark} />
    </div>
  );
}
