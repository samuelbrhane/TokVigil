import Link from "next/link";
import { FOOTER_COLUMNS, BRAND } from "@/lib/constants";
import { FenceMotif } from "@/components/ui";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-surface-800/40 bg-surface-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sm text-surface-500 leading-relaxed max-w-xs">
              {BRAND.description}
            </p>
            <FenceMotif />
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-surface-400">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-500 hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-surface-800/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-surface-600">
            © {new Date().getFullYear()} TokenFence. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "GitHub", "Discord"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs font-mono text-surface-600 hover:text-brand-500 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
