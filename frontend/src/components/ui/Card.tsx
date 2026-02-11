import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  glow = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-surface-800/40 bg-surface-900/30",
        hover &&
          "hover:bg-surface-900/60 hover:border-brand-500/20 transition-all duration-500",
        glow && "shadow-[0_0_40px_rgba(245,158,11,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  change,
  className,
}: {
  label: string;
  value: string;
  change?: string;
  className?: string;
}) {
  const isPositive = change?.startsWith("+");
  return (
    <Card className={cn("p-5", className)}>
      <p className="text-xs font-mono text-surface-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold font-mono text-surface-100">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "mt-1 text-xs font-mono",
            isPositive ? "text-emerald-400" : "text-red-400",
          )}
        >
          {change} vs last period
        </p>
      )}
    </Card>
  );
}
