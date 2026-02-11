"use client";

import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/usage": "Usage Analytics",
  "/dashboard/policies": "Policies",
  "/dashboard/policies/new": "Create Policy",
  "/dashboard/api-keys": "API Keys",
  "/dashboard/workspaces": "Workspaces",
  "/dashboard/settings": "Settings",
  "/dashboard/billing": "Billing",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const title = titleMap[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-surface-800/30 bg-surface-950/80 backdrop-blur-sm flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold font-mono text-surface-100">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40">
          <span className="text-surface-600 text-xs">⌕</span>
          <input
            placeholder="Search..."
            className="bg-transparent text-xs text-surface-300 placeholder-surface-600 font-mono outline-none w-40"
          />
          <kbd className="text-[10px] text-surface-600 font-mono px-1 py-0.5 rounded bg-surface-800/60">⌘K</kbd>
        </div>
        {/* Notifications */}
        <button className="w-8 h-8 rounded-lg bg-surface-900/60 border border-surface-800/40 flex items-center justify-center text-surface-500 hover:text-brand-400 transition-colors">
          <span className="text-sm">⊙</span>
        </button>
      </div>
    </header>
  );
}
