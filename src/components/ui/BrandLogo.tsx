import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function BrandLogo({ className = "w-40", decorative = false, surface = "dark" }: {
  className?: string;
  decorative?: boolean;
  surface?: "light" | "dark";
}) {
  return (
    <Image
      src={surface === "dark" ? "/brand/logo-horizontal-dark-800.png" : "/brand/logo-horizontal-light-800.png"}
      alt={decorative ? "" : siteConfig.name}
      width={800}
      height={surface === "dark" ? 178 : 159}
      className={`block h-auto shrink-0 ${className}`}
      unoptimized
    />
  );
}

/** The surrounding brand text supplies the accessible name wherever this mark is used. */
export function BrandSymbol({ size = 28 }: { size?: number }) {
  return <Image src="/brand/symbol-color-256.png" alt="" width={size} height={size} className="shrink-0 object-contain" unoptimized />;
}