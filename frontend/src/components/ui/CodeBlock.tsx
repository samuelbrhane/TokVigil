"use client";

import { highlightCode } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export default function CodeBlock({ code, language = "python", className = "" }: CodeBlockProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-surface-950 border border-surface-800/80 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-800/60">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-surface-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-surface-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-surface-700" />
          </div>
          <span className="text-xs font-mono text-surface-500 ml-2">{language}</span>
        </div>
        <pre className="p-5 text-sm leading-relaxed overflow-x-auto">
          <code
            className="font-mono text-surface-300"
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
      </div>
    </div>
  );
}
