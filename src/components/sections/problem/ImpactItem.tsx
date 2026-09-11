import type { LucideIcon } from "lucide-react";

type ImpactItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ImpactItem({
  icon: Icon,
  title,
  description,
}: ImpactItemProps) {
  return (
    <div className="flex gap-5 py-6 first:pt-2">
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[rgba(255,90,31,0.30)] bg-[rgba(255,90,31,0.025)] text-[var(--accent)]">
        <Icon size={24} strokeWidth={1.55} />
      </div>

      <div className="pt-1">
        <h3 className="text-[16px] font-medium tracking-[-0.025em] text-white/[0.92]">
          {title}
        </h3>

        <p className="mt-2 max-w-[260px] text-[13px] leading-6 text-white/[0.38]">
          {description}
        </p>
      </div>
    </div>
  );
}