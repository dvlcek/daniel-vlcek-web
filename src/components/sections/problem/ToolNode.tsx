import type { LucideIcon } from "lucide-react";

type ToolNodeProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function ToolNode({
  icon: Icon,
  title,
  description,
  className = "",
}: ToolNodeProps) {
  return (
    <div
      className={[
        "rounded-[14px]",
        "border border-white/[0.10]",
        "bg-white/[0.018]",
        "px-4 py-3.5",
        "transition-colors duration-300",
        "hover:border-white/[0.16]",
        "hover:bg-white/[0.028]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center text-white/[0.88]">
          <Icon size={25} strokeWidth={1.55} />
        </div>

        <div className="min-w-0">
          <p className="text-[13px] font-medium tracking-[-0.02em] text-white/[0.92]">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-white/[0.34]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}