import type { SimpleIcon } from "simple-icons";

type BrandIconProps = {
  icon: SimpleIcon;
  size?: number;
  color?: string;
  className?: string;
};

export function BrandIcon({
  icon,
  size = 28,
  color,
  className = "",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      fill={color ?? `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  );
}