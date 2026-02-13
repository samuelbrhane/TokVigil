"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DASHBOARD_NAV, DASHBOARD_NAV_BOTTOM } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import Logo from "./Logo";

const icons: Record<string, string> = {
  grid: "⊞",
  chart: "◩",
  shield: "⬡",
  key: "⚿",
  layers: "⧈",
  settings: "⚙",
  "credit-card": "▭",
};

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  return (
    <>
      {/* Backdrop overlay — mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-60 bg-surface-950 border-r border-surface-800/40 flex flex-col z-50 transition-transform duration-300 ease-in-out",
          // On mobile: slide in/out
          open ? "translate-x-0" : "-translate-x-full",
          // On desktop (lg+): always visible
          "lg:translate-x-0",
        )}
      >
        {/* Logo + close button */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-surface-800/30">
          <Logo size="sm" href="/dashboard" />
          <button
            onClick={onClose}
            className="lg:hidden text-surface-400 hover:text-surface-200 transition-colors p-1"
            aria-label="Close sidebar"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {DASHBOARD_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200",
                  active
                    ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                    : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/60 border border-transparent",
                )}
              >
                <span className="text-base w-5 text-center">
                  {icons[item.icon]}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 py-3 border-t border-surface-800/30 space-y-0.5">
          {DASHBOARD_NAV_BOTTOM.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200",
                  active
                    ? "bg-brand-500/10 text-brand-400"
                    : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/60",
                )}
              >
                <span className="text-base w-5 text-center">
                  {icons[item.icon]}
                </span>
                {item.label}
              </Link>
            );
          })}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <span className="text-base w-5 text-center">⏻</span>
            Sign out
          </button>

          {/* User */}
          <div className="mt-3 flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-xs text-brand-400 font-mono font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-surface-300 font-mono truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
