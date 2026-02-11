"use client";

import { usePathname } from "next/navigation";

const titleMap: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  "/dashboard": {
    title: "Overview",
    description: "Monitor your AI usage at a glance",
    icon: "⊞",
  },
  "/dashboard/usage": {
    title: "Usage Analytics",
    description: "Detailed breakdown of all API activity",
    icon: "◩",
  },
  "/dashboard/policies": {
    title: "Policies",
    description: "Manage rate limits, budgets, and rules",
    icon: "⬡",
  },
  "/dashboard/policies/new": {
    title: "Create Policy",
    description: "Define a new usage policy",
    icon: "⬡",
  },
  "/dashboard/api-keys": {
    title: "API Keys",
    description: "Manage authentication keys for your SDKs",
    icon: "⚿",
  },
  "/dashboard/workspaces": {
    title: "Workspaces",
    description: "Organize projects and environments",
    icon: "⧈",
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Account preferences and configuration",
    icon: "⚙",
  },
  "/dashboard/billing": {
    title: "Billing",
    description: "Plan, usage, and payment details",
    icon: "▭",
  },
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const page = titleMap[pathname] || {
    title: "Dashboard",
    description: "",
    icon: "⊞",
  };

  return (
    <header className="h-16 border-b border-surface-700/50 bg-surface-900/60 backdrop-blur-sm flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
          <span className="text-sm text-brand-400">{page.icon}</span>
        </div>
        <div>
          <h1 className="text-sm font-bold font-mono text-white">
            {page.title}
          </h1>
          <p className="hidden md:block text-[11px] font-mono text-brand-300/80 mt-0.5">
            {page.description}
          </p>
        </div>
      </div>

      {/* <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800/60 border border-surface-700/50 hover:border-brand-500/30 transition-colors">
          <span className="text-brand-400 text-xs">⌕</span>
          <input
            placeholder="Search..."
            className="bg-transparent text-xs text-white placeholder-surface-400 font-mono outline-none w-40"
          />
          <kbd className="text-[10px] text-surface-300 font-mono px-1.5 py-0.5 rounded bg-surface-700/60 border border-surface-600/40">
            ⌘K
          </kbd>
        </div>
      </div> */}
    </header>
  );
}
