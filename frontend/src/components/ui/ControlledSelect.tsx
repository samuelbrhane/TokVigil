"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ControlledOption = { label: string; value: string };

type Props = {
  label?: string;
  value: string;
  options: ControlledOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;

  // ✅ control the dropdown height here
  maxMenuHeightClassName?: string; // e.g. "max-h-60"
};

export default function ControlledSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
  maxMenuHeightClassName = "max-h-60",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((o) => o.value === value)?.label || "";
  }, [value, options]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col gap-1 relative">
      {label && (
        <label className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center justify-between gap-2",
          "px-3 py-1.5 rounded-lg",
          "bg-surface-900/60 border border-surface-700/40",
          "text-xs font-mono text-surface-200",
          "hover:border-surface-600/50 transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "min-w-[140px]",
          className,
        ].join(" ")}
      >
        <span className={value ? "text-surface-200" : "text-surface-500"}>
          {value ? selectedLabel : placeholder}
        </span>
        <span className="text-surface-500">▾</span>
      </button>

      {open && !disabled && (
        <div
          className={[
            "absolute top-full mt-2 z-50 w-full",
            "rounded-lg border border-surface-700/40 bg-surface-950",
            "shadow-lg",
          ].join(" ")}
        >
          <div
            className={[maxMenuHeightClassName, "overflow-y-auto py-1"].join(
              " ",
            )}
          >
            {/* placeholder option */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={[
                "w-full text-left px-3 py-2 text-xs font-mono",
                "text-surface-400 hover:bg-surface-900/60",
              ].join(" ")}
            >
              {placeholder}
            </button>

            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 text-xs font-mono",
                    active
                      ? "bg-brand-500/10 text-brand-300"
                      : "text-surface-200 hover:bg-surface-900/60",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
