import Link from "next/link";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

const barHeights: Record<Size, number[]> = {
  sm: [12, 16, 14, 18, 12],
  md: [16, 22, 18, 24, 16],
  lg: [20, 28, 22, 30, 20],
};

export default function Logo({ size = "md", href = "/" }: { size?: Size; href?: string }) {
  const content = (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div className="flex gap-0.5">
          {barHeights[size].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: `${h}px`,
                background: `linear-gradient(180deg, #F59E0B ${40 + i * 10}%, #92400E)`,
              }}
            />
          ))}
        </div>
      </div>
      <span className={cn(sizeMap[size], "font-bold tracking-tight text-surface-100 font-mono")}>
        Token<span className="text-brand-500">Fence</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
