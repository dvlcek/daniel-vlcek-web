"use client";

import { useEffect } from "react";

export function ConsoleEasterEgg() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      return;
    }

    const block = `
╭──────────────────────────────────────────────╮
│                                              │
│  DANIEL VLKO                                 │
│  Software Developer & Automation Architect   │
│                                              │
│  SOFTWARE    ─┐                              │
│  AUTOMATION  ─┼── SYSTEMS ──→ SCALE          │
│  AI          ─┘                              │
│                                              │
│  Built to reduce friction.                   │
│  Designed to scale.                          │
│                                              │
╰──────────────────────────────────────────────╯`;

    const blockStyle = [
      "display:block",
      "background:#071014",
      "color:#D8E0E4",
      "font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
      "font-size:12px",
      "line-height:1.55",
      "padding:14px 18px",
      "border-left:3px solid #FF5A1F",
      "border-radius:7px",
      "box-shadow:0 10px 35px rgba(0,0,0,0.25)",
    ].join(";");

    const linkStyle = [
      "color:#FF5A1F",
      "font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
      "font-size:11px",
      "font-weight:700",
      "letter-spacing:0.3px",
    ].join(";");

    const hintStyle = [
      "color:#66747C",
      "font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
      "font-size:10px",
    ].join(";");

    console.log(
      `%c${block}`,
      blockStyle,
    );

    console.log(
      "%c→ danielvlko.com",
      linkStyle,
    );

    console.log(
      "%c// systems > tasks",
      hintStyle,
    );
  }, []);

  return null;
}