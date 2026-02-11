"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScrollY } from "@/lib/hooks";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui";
import Logo from "./Logo";

export default function Navbar() {
  const scrollY = useScrollY();
  const pathname = usePathname();
  const scrolled = scrollY > 20;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/40"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="md" />

        {/* Desktop nav */}
        {!isAuthPage && (
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
        )}

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started →</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        {!isAuthPage && (
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`w-5 h-0.5 bg-surface-400 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-surface-400 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-surface-400 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && !isAuthPage && (
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
          </div>
        </div>
      )}
    </nav>
  );
}
