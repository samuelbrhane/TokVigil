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

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
}

export default function DashboardHeader({
  onMenuToggle,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const page = titleMap[pathname] || {
    title: "Dashboard",
    description: "",
    icon: "⊞",
  };

  return (
    <header className="h-16 border-b border-surface-700/50 bg-surface-900/60 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-surface-400 hover:text-surface-200 transition-colors p-1 -ml-1"
            aria-label="Open sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

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
    </header>
  );
}
