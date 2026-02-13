"use client";

import { useState, useRef, useEffect } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number; // px for dropdown max-height, default 240
}

export default function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
  maxHeight = 240,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2 w-full
          px-3 py-2 rounded-lg text-left
          bg-surface-900/80 border border-surface-700/60
          text-sm font-mono
          transition-colors
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-surface-600/80"}
          ${open ? "border-brand-500/50" : ""}
          ${selectedOption ? "text-surface-200" : "text-surface-500"}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-surface-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[180px] rounded-lg border border-surface-700/60 bg-surface-900 shadow-xl shadow-black/30 overflow-hidden">
          <ul
            className="overflow-y-auto overscroll-contain py-1"
            style={{ maxHeight }}
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-xs font-mono text-surface-500">
                No options
              </li>
            ) : (
              options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 text-sm font-mono transition-colors
                      ${
                        opt.value === value
                          ? "bg-brand-500/10 text-brand-400"
                          : "text-surface-300 hover:bg-surface-800/60 hover:text-surface-100"
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
