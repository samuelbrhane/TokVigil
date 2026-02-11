"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScrollY } from "@/lib/hooks";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import Logo from "./Logo";

export default function Navbar() {
  const scrollY = useScrollY();
  const pathname = usePathname();
  const scrolled = scrollY > 20;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ].includes(pathname);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/40"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="md" />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-mono transition-colors duration-200 ${
                pathname === link.href
                  ? "text-brand-400"
                  : "text-surface-400 hover:text-brand-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 rounded-lg bg-surface-800/40 animate-pulse" />
            ) : user ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started →
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`w-5 h-0.5 bg-surface-400 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`w-5 h-0.5 bg-surface-400 transition-all ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-5 h-0.5 bg-surface-400 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-950/95 backdrop-blur-xl border-b border-surface-800/40 animate-slide-down">
          <div className="px-6 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-mono text-surface-400 hover:text-brand-400 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthPage && (
              <div className="border-t border-surface-800/40 pt-4 mt-4 flex flex-col gap-2">
                {loading ? (
                  <div className="w-full h-8 rounded-lg bg-surface-800/40 animate-pulse" />
                ) : user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Dashboard →
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full">
                        Get Started →
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
