import {
  Database,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Settings,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";

import { ToolNode } from "@/components/sections/problem/ToolNode";

const tools = [
  {
    icon: Globe,
    title: "Website",
    description: "Content, leads, SEO",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Orders, customers",
  },
  {
    icon: Users,
    title: "CRM",
    description: "Client data, sales",
  },
  {
    icon: Database,
    title: "Spreadsheets",
    description: "Data, reporting",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Communication",
  },
  {
    icon: MessageSquare,
    title: "Team tools",
    description: "Messages, tasks",
  },
  {
    icon: FileText,
    title: "Files & docs",
    description: "Scattered information",
  },
  {
    icon: Settings,
    title: "Internal systems",
    description: "Custom tools, processes",
  },
];

export function ProblemDiagram() {
  return (
    <>
      {/* =====================================================
          DESKTOP — 1280px+
      ===================================================== */}
      <div className="relative hidden h-[500px] xl:block">
        {/* CONNECTIONS */}
        <svg
          aria-hidden="true"
          viewBox="0 0 620 500"
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {/* LEFT */}
          <path
            d="M175 68 C230 68 225 205 290 235"
            stroke="rgba(255,255,255,0.17)"
          />
          <path
            d="M175 174 C230 174 235 220 290 240"
            stroke="rgba(255,255,255,0.17)"
          />
          <path
            d="M175 280 C235 280 250 260 290 250"
            stroke="rgba(255,255,255,0.17)"
          />
          <path
            d="M175 386 C235 386 245 285 290 260"
            stroke="rgba(255,255,255,0.17)"
          />

          {/* RIGHT */}
          <path
            d="M445 68 C390 68 395 205 330 235"
            stroke="rgba(255,255,255,0.17)"
          />
          <path
            d="M445 174 C390 174 385 220 330 240"
            stroke="rgba(255,255,255,0.17)"
          />
          <path
            d="M445 280 C385 280 370 260 330 250"
            stroke="rgba(255,255,255,0.17)"
          />
          <path
            d="M445 386 C385 386 375 285 330 260"
            stroke="rgba(255,255,255,0.17)"
          />

          {/* SMALL END DOTS */}
          {[
            [175, 68],
            [175, 174],
            [175, 280],
            [175, 386],
            [445, 68],
            [445, 174],
            [445, 280],
            [445, 386],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3"
              fill="rgba(255,255,255,0.52)"
            />
          ))}
        </svg>

        {/* LEFT NODES */}
        <div className="absolute left-0 top-[30px] w-[185px]">
          <ToolNode {...tools[0]} />
        </div>

        <div className="absolute left-0 top-[136px] w-[185px]">
          <ToolNode {...tools[1]} />
        </div>

        <div className="absolute left-0 top-[242px] w-[185px]">
          <ToolNode {...tools[2]} />
        </div>

        <div className="absolute left-0 top-[348px] w-[185px]">
          <ToolNode {...tools[3]} />
        </div>

        {/* RIGHT NODES */}
        <div className="absolute right-0 top-[30px] w-[185px]">
          <ToolNode {...tools[4]} />
        </div>

        <div className="absolute right-0 top-[136px] w-[185px]">
          <ToolNode {...tools[5]} />
        </div>

        <div className="absolute right-0 top-[242px] w-[185px]">
          <ToolNode {...tools[6]} />
        </div>

        <div className="absolute right-0 top-[348px] w-[185px]">
          <ToolNode {...tools[7]} />
        </div>

        {/* CENTER GUIDE */}
        <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l border-dashed border-white/[0.045]" />

        {/* CENTER FRICTION NODE */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-[-30px] rounded-full border border-white/[0.035]" />

          <div className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border border-[rgba(255,90,31,0.65)] bg-[#081117] shadow-[0_0_65px_rgba(255,90,31,0.055)]">
            <Zap
              size={31}
              strokeWidth={1.5}
              className="text-[var(--accent)]"
            />

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.30em] text-white/[0.82]">
              Friction
            </p>

            <p className="mt-2 text-center text-[7px] font-medium uppercase leading-[1.7] tracking-[0.18em] text-white/[0.30]">
              Disconnected
              <br />
              operations
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLET — 768px–1279px
      ===================================================== */}
      <div className="hidden md:block xl:hidden">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolNode
              key={tool.title}
              {...tool}
            />
          ))}
        </div>

        <div className="mx-auto my-8 h-12 w-px bg-gradient-to-b from-white/[0.14] to-[rgba(255,90,31,0.35)]" />

        <div className="mx-auto flex h-[130px] w-[130px] flex-col items-center justify-center rounded-full border border-[rgba(255,90,31,0.55)] bg-[#081117]">
          <Zap
            size={28}
            strokeWidth={1.5}
            className="text-[var(--accent)]"
          />

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/[0.78]">
            Friction
          </p>

          <p className="mt-2 text-center text-[7px] uppercase leading-[1.6] tracking-[0.15em] text-white/[0.28]">
            Disconnected
            <br />
            operations
          </p>
        </div>
      </div>

      {/* =====================================================
          MOBILE
      ===================================================== */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-2.5">
          {tools.map((tool) => (
            <ToolNode
              key={tool.title}
              {...tool}
            />
          ))}
        </div>

        <div className="mx-auto my-7 h-9 w-px bg-gradient-to-b from-white/[0.12] to-[rgba(255,90,31,0.35)]" />

        <div className="mx-auto flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full border border-[rgba(255,90,31,0.50)]">
          <Zap
            size={25}
            strokeWidth={1.5}
            className="text-[var(--accent)]"
          />

          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/[0.78]">
            Friction
          </p>
        </div>
      </div>
    </>
  );
}