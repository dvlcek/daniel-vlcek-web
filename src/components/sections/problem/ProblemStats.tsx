const stats = [
  {
    value: "55%",
    description:
      "of knowledge workers struggle to find information they know exists.",
    source: "Atlassian State of Teams 2024",
  },
  {
    value: "50%",
    description:
      "have worked on a project only to find another team was doing the same work.",
    source: "Atlassian State of Teams 2024",
  },
  {
    value: "4.9h",
    description:
      "estimated time per week that could be saved with better processes.",
    source: "Asana Anatomy of Work 2023",
  },
];

export function ProblemStats() {
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-0">
      {stats.map((stat, index) => (
        <div
          key={stat.value}
          className={[
            index > 0
              ? "md:border-l md:border-white/[0.075] md:pl-10"
              : "",
            index < stats.length - 1 ? "md:pr-10" : "",
          ].join(" ")}
        >
          <p className="text-[48px] font-medium leading-none tracking-[-0.06em] text-white sm:text-[54px] xl:text-[60px]">
            {stat.value}
          </p>

          <p className="mt-4 max-w-[280px] text-[13px] leading-6 text-white/[0.45]">
            {stat.description}
          </p>

          <p className="mt-4 text-[10px] text-white/[0.22]">
            Source: {stat.source}
          </p>
        </div>
      ))}
    </div>
  );
}