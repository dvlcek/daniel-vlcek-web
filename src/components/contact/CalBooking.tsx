"use client";

import { useEffect } from "react";

import Cal, {
  getCalApi,
} from "@calcom/embed-react";

const namespace = "discovery-call";

export function CalBooking() {
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ??
    "YOUR_CAL_USERNAME/discovery";

  useEffect(() => {
    void (async () => {
      const cal = await getCalApi({
        namespace,
      });

      cal("ui", {
        theme: "dark",

        hideEventTypeDetails: true,

        showTimezoneWhenEventDetailsHidden: true,

        layout: "month_view",

        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#FF5A1F",
            "cal-brand-emphasis": "#FF6932",
            "cal-brand-text": "#FFFFFF",
            "cal-brand-subtle": "#351811",
            "cal-brand-accent": "#FFFFFF",

            "cal-text": "#C9D2D7",
            "cal-text-emphasis": "#FFFFFF",
            "cal-text-subtle": "#778792",
            "cal-text-muted": "#55656F",

            "cal-bg": "#050D13",
            "cal-bg-emphasis": "#0A151D",
            "cal-bg-subtle": "#081219",
            "cal-bg-muted": "#071017",
            "cal-bg-inverted": "#F6F3EE",

            "cal-border": "#17242D",
            "cal-border-emphasis": "#31414B",
            "cal-border-subtle": "#111D25",

            "radius-xl": "9px",
            "radius-2xl": "11px",
            "radius-3xl": "13px",
            "radius-full": "9999px",
          },
        },
      });
    })();
  }, []);

  return (
    <div
      className="
        relative

        min-h-[470px]
        w-full

        overflow-hidden

        rounded-[12px]

        bg-[#050D13]
      "
    >
      <Cal
        namespace={namespace}
        calLink={calLink}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "470px",
          overflow: "hidden",
        }}
        config={{
          layout: "month_view",
          theme: "dark",
        }}
      />
    </div>
  );
}