"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const CalBookingEmbed = dynamic(
  () => import("./CalBookingEmbed").then((module) => module.CalBookingEmbed),
  { ssr: false, loading: () => <p role="status" className="p-6 text-[14px] text-white/70">Loading booking calendar…</p> },
);

export function CalBooking() {
  const [enabled, setEnabled] = useState(false);

  if (enabled) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between gap-4 px-2 text-[12px] text-white/65">
          <span>Calendar provided by Cal.com</span>
          <button type="button" onClick={() => setEnabled(false)} className="min-h-11 rounded-sm underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Close calendar</button>
        </div>
        <CalBookingEmbed />
      </div>
    );
  }

  return (
    <div className="flex min-h-[470px] flex-col items-center justify-center rounded-[12px] bg-[#050D13] px-6 py-10 text-center">
      <h3 className="text-[22px] font-medium tracking-[-0.025em] text-white">Choose a time to talk</h3>
      <p className="mt-4 max-w-[360px] text-[14px] leading-7 text-white/65">
        The booking calendar is provided by Cal.com. Loading it shares connection
        information with that provider, which may use its own cookies and storage.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-x-5 text-[12px] text-white/70">
        <a href="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Privacy notice</a>
        <a href="https://cal.com/privacy" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Cal.com privacy</a>
      </div>
      <button type="button" onClick={() => setEnabled(true)} className="button-primary mt-5 min-h-12 rounded-full bg-[#FF5A1F] px-7 text-[14px] font-medium text-white shadow-[0_8px_30px_rgba(255,90,31,0.14)] hover:shadow-[0_12px_35px_rgba(255,90,31,0.20)] hover:bg-[#FF6932] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Load booking calendar</button>
      <a href="mailto:hello@danielvlko.com" className="mt-4 inline-flex min-h-11 items-center rounded-sm text-[13px] text-white/70 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8054]">Contact me by email instead</a>
    </div>
  );
}
