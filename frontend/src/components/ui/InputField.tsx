import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export default function InputField({
  label,
  icon,
  error,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-500 transition-colors">
            {icon}
          </span>
        )}
        <input
          className={cn(
            "w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-3 text-sm text-surface-200 placeholder-surface-600 font-mono",
            "focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 focus:bg-surface-900",
            "transition-all duration-200",
            icon && "pl-10",
            error && "border-red-500/50",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 font-mono">{error}</p>
      )}
    </div>
  );
}
