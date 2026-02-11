"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DOCS_NAV = [
  {
    title: "Getting Started",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Quick Start", href: "/docs#quick-start" },
    ],
  },
  {
    title: "SDKs",
    links: [
      { label: "Python SDK", href: "/docs/sdk/python" },
      { label: "TypeScript SDK", href: "/docs/sdk/typescript" },
    ],
  },
  {
    title: "Tools",
    links: [{ label: "VS Code Extension", href: "/docs/vscode-extension" }],
  },
  {
    title: "Reference",
    links: [{ label: "API Reference", href: "/docs/api-reference" }],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-8">
              {DOCS_NAV.map((section) => (
                <div key={section.title}>
                  <h4 className="font-mono text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`block text-sm transition-colors ${
                            pathname === link.href
                              ? "text-brand-400 font-medium"
                              : "text-surface-400 hover:text-surface-200"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 pb-24">{children}</main>
        </div>
      </div>
    </div>
  );
}
