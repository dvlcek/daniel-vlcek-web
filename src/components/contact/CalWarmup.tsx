"use client";

import {
  useEffect,
} from "react";

function getEmbedUrl(
  value: string,
): string | null {
  try {
    const url = new URL(value);

    if (url.hostname === "cal.com") {
      url.hostname = "app.cal.com";
    }

    if (url.hostname === "cal.eu") {
      url.hostname = "app.cal.eu";
    }

    url.pathname =
      `${url.pathname.replace(/\/+$/, "")}/embed`;

    url.searchParams.set(
      "embed",
      "",
    );

    url.searchParams.set(
      "embedType",
      "inline",
    );

    url.searchParams.set(
      "layout",
      "month_view",
    );

    return url.toString();
  } catch {
    return null;
  }
}

export function CalWarmup() {
  useEffect(() => {
    const calLink =
      process.env
        .NEXT_PUBLIC_CAL_LINK;

    if (!calLink) {
      return;
    }

    const embedUrl =
      getEmbedUrl(calLink);

    if (!embedUrl) {
      return;
    }

    let warmed = false;

    const warm = () => {
      if (warmed) {
        return;
      }

      warmed = true;

      /*
       * Hint browser that this page
       * will probably be needed soon.
       */

      const prefetch =
        document.createElement(
          "link",
        );

      prefetch.rel =
        "prefetch";

      prefetch.href =
        embedUrl;

      document.head.appendChild(
        prefetch,
      );
    };

    /*
     * User intent = highest priority.
     */

    const handleIntent = (
      event: Event,
    ) => {
      const target =
        event.target instanceof Element
          ? event.target
          : null;

      if (
        target?.closest(
          "[data-book-trigger]",
        )
      ) {
        warm();
      }
    };

    document.addEventListener(
      "pointerover",
      handleIntent,
      {
        passive: true,
      },
    );

    document.addEventListener(
      "focusin",
      handleIntent,
    );

    document.addEventListener(
      "touchstart",
      handleIntent,
      {
        passive: true,
      },
    );

    /*
     * Warm during browser idle time.
     * Does not block hero / LCP.
     */

    const timeout =
      window.setTimeout(
        warm,
        1400,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );

      document.removeEventListener(
        "pointerover",
        handleIntent,
      );

      document.removeEventListener(
        "focusin",
        handleIntent,
      );

      document.removeEventListener(
        "touchstart",
        handleIntent,
      );
    };
  }, []);

  return null;
}