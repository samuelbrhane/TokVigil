import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "brand";

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default: "text-surface-400 bg-surface-800/60 border-surface-700/40",
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  danger: "text-red-400 bg-red-500/10 border-red-500/20",
  brand: "text-brand-400 bg-brand-500/10 border-brand-500/20",
};

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
