import Link from "next/link";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

const imgSize: Record<Size, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function Logo({
  size = "md",
  href = "/",
}: {
  size?: Size;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="UsageSentinel"
        className={cn(imgSize[size], "rounded-lg")}
      />
      <span
        className={cn(
          sizeMap[size],
          "font-bold tracking-tight text-surface-100 font-mono",
        )}
      >
        Token<span className="text-brand-500">Fence</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
