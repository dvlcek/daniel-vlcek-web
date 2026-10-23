"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { trackContactEvent } from "@/lib/contact-analytics";
import {
  PRIVACY_CHOICE_KEY, isPublicTelemetryPath, readPrivacyChoice, savePrivacyChoice,
  sanitizeTelemetryUrl, type PrivacyChoice,
} from "@/lib/privacy";

const PrivacyContext = createContext<(() => void) | null>(null);

function beforeAnalytics(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = sanitizeTelemetryUrl(event.url);
  return readPrivacyChoice()?.analytics && url ? { ...event, url } : null;
}

function beforePerformance(event: { type: "vital"; url: string; route?: string }) {
  const url = sanitizeTelemetryUrl(event.url);
  return readPrivacyChoice()?.analytics && url
    ? { ...event, url, route: new URL(url).pathname }
    : null;
}

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<PrivacyChoice | null | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setChoice(readPrivacyChoice()));
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PRIVACY_CHOICE_KEY || event.key === null) setChoice(readPrivacyChoice());
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (settingsOpen) panelRef.current?.focus();
  }, [settingsOpen]);

  useEffect(() => {
    const handleContactClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[data-contact-source]")
        : null;
      if (link?.getAttribute("href") === "/contact") {
        trackContactEvent("contact_click", link.dataset.contactSource);
      }
    };
    document.addEventListener("click", handleContactClick, true);
    return () => document.removeEventListener("click", handleContactClick, true);
  }, []);

  const openSettings = () => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSettingsOpen(true);
  };

  const choose = (analytics: boolean) => {
    setChoice(savePrivacyChoice(analytics));
    setSettingsOpen(false);
    returnFocusRef.current?.focus();
  };

  return (
    <PrivacyContext.Provider value={openSettings}>
      {children}
      {choice?.analytics && isPublicTelemetryPath(pathname) && (
        <>
          <Analytics beforeSend={beforeAnalytics} />
          <SpeedInsights beforeSend={beforePerformance} />
        </>
      )}
      {((choice === null && isPublicTelemetryPath(pathname)) || settingsOpen) && (
        <section
          ref={panelRef}
          tabIndex={-1}
          aria-labelledby="privacy-choice-heading"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-[920px] rounded-2xl border border-white/15 bg-[#071017] p-5 text-white shadow-[0_16px_60px_rgba(0,0,0,0.35)] outline-none sm:p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[500px]">
              <h2 id="privacy-choice-heading" className="text-[15px] font-medium">Your privacy choices</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/70">
                Optional Vercel analytics and performance measurement stay off unless you allow them.
                Your choice is saved on this device. You can change it in the footer.
              </p>
              <a href="/cookies" className="mt-1 inline-flex min-h-8 items-center text-[12px] text-white/80 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Cookies &amp; privacy choices</a>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button type="button" onClick={() => choose(false)} className="min-h-11 rounded-full border border-white/25 px-5 text-[13px] font-medium transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Reject optional</button>
              <button type="button" onClick={() => choose(true)} className="min-h-11 rounded-full border border-white/25 px-5 text-[13px] font-medium transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Allow analytics</button>
            </div>
          </div>
        </section>
      )}
    </PrivacyContext.Provider>
  );
}

export function PrivacySettingsButton({ className }: { className?: string }) {
  const openSettings = useContext(PrivacyContext);
  if (!openSettings) return null;
  return <button type="button" onClick={openSettings} className={className}>Privacy settings</button>;
}
