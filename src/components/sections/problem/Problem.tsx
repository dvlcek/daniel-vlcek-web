import {
  BarChart3,
  Clock,
  FileText,
} from "lucide-react";

import { ImpactItem } from "@/components/sections/problem/ImpactItem";
import { ProblemDiagram } from "@/components/sections/problem/ProblemDiagram";
import { ProblemStats } from "@/components/sections/problem/ProblemStats";
import { Container } from "@/components/ui/Container";

export function Problem() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-[#071017] text-white"
    >
      {/* SUBTLE BACKGROUND DEPTH */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 55% 40%, rgba(15,35,46,0.12), transparent 40%)",
        }}
      />

      <Container className="relative py-20 md:py-24 xl:py-28">
        {/* TOP LABEL */}
        <div className="mb-12 flex items-center gap-4 xl:mb-10">
          <span className="h-px w-8 bg-[var(--accent)]" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.36em] text-white/[0.35]">
            The Problem
          </span>
        </div>

        {/* =====================================================
            MAIN DESKTOP GRID
        ===================================================== */}
        <div
          className="
            grid gap-16

            xl:grid-cols-[minmax(320px,0.85fr)_minmax(500px,1.35fr)_minmax(260px,0.72fr)]
            xl:items-center
            xl:gap-10

            2xl:grid-cols-[minmax(360px,0.9fr)_minmax(560px,1.35fr)_minmax(280px,0.72fr)]
            2xl:gap-14
          "
        >
          {/* LEFT — MESSAGE */}
          <div className="max-w-[540px]">
            <p className="mb-7 text-[8px] font-semibold uppercase tracking-[0.38em] text-white/[0.27]">
              Different tools. Same friction.
            </p>

            <h2
              className="
                text-[42px]
                font-medium
                leading-[1.01]
                tracking-[-0.055em]

                sm:text-[50px]
                md:text-[56px]

                xl:text-[48px]
                2xl:text-[56px]
              "
            >
              The problem
              <br />
              isn&apos;t one tool.
              <br />
              It&apos;s the{" "}
              <span className="text-[var(--accent)]">
                friction
              </span>
              <br />
              between
              <br />
              everything.
            </h2>

            <p className="mt-8 max-w-[440px] text-[14px] leading-7 text-white/[0.45] sm:text-[15px]">
              Websites, tools, data and workflows can all work on their own —
              and still slow the business down when they don&apos;t work
              together.
            </p>

            <p className="mt-8 text-[8px] font-semibold uppercase tracking-[0.36em] text-white/[0.25]">
              Small gaps. Bigger costs.
            </p>
          </div>

          {/* CENTER — SYSTEM MAP */}
          <div className="min-w-0">
            <ProblemDiagram />
          </div>

          {/* RIGHT — IMPACT */}
          <div className="xl:border-l xl:border-white/[0.075] xl:pl-8 2xl:pl-10">
            <p className="mb-4 text-[8px] font-semibold uppercase tracking-[0.38em] text-white/[0.30]">
              The Impact
            </p>

            <div className="divide-y divide-white/[0.065]">
              <ImpactItem
                icon={Clock}
                title="More manual work"
                description="Teams spend time on repetitive tasks instead of high-value work."
              />

              <ImpactItem
                icon={FileText}
                title="Lost context"
                description="Important information is scattered across different tools and people."
              />

              <ImpactItem
                icon={BarChart3}
                title="Slower decisions"
                description="No clear view of what's happening leads to delays and missed opportunities."
              />
            </div>

            <p className="mt-6 text-[7px] font-semibold uppercase tracking-[0.35em] text-white/[0.20]">
              Good businesses deserve better systems.
            </p>
          </div>
        </div>

        {/* =====================================================
            RESEARCH / PROOF
        ===================================================== */}
        <div className="mt-16 border-t border-white/[0.075] pt-10 xl:mt-14">
          <div
            className="
              grid gap-12

              xl:grid-cols-[minmax(0,1fr)_250px]
              xl:gap-14
            "
          >
            <ProblemStats />

            {/* OPPORTUNITY */}
            <div className="border-t border-white/[0.075] pt-8 xl:border-l xl:border-t-0 xl:pl-9 xl:pt-0">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--accent)]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.36em] text-white/[0.30]">
                  The Opportunity
                </span>
              </div>

              <p className="mt-7 text-[19px] font-medium leading-[1.35] tracking-[-0.03em] text-white/[0.90]">
                Better systems create faster teams, happier clients and real
                growth.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}