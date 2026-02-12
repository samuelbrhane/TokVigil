"use client";

import React from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui";

const CARDS = [
  {
    title: "Python SDK",
    description: "Full guide to using UsageSentinel with Python applications.",
    href: "/docs/sdk/python",
    icon: "🐍",
  },
  {
    title: "TypeScript SDK",
    description:
      "Full guide to using UsageSentinel with TypeScript/JavaScript.",
    href: "/docs/sdk/typescript",
    icon: "📘",
  },
  {
    title: "REST API",
    description: "Use UsageSentinel from any language via HTTP requests.",
    href: "/docs/rest-api",
    icon: "🌐",
  },
  {
    title: "VS Code Extension",
    description: "Autocomplete, snippets, and usage stats in your editor.",
    href: "/docs/vscode-extension",
    icon: "💻",
  },
];

const QUICK_EXAMPLE = `from usagesentinel import UsageSentinel

us = UsageSentinel(api_key="us_live_...")

# Check if request is allowed
result = us.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    feature="chat"
)

if result.allowed:
    # Make your AI call, then log it
    us.log_usage(
        request_id="req_123",
        user_id="user_123",
        model="gpt-4o-mini",
        input_tokens=100,
        output_tokens=50,
        status="allowed"
    )`;

export default function DocsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-surface-400 max-w-2xl">
          Everything you need to integrate UsageSentinel into your AI
          applications. Control usage, enforce limits, and track spending in
          minutes.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group p-6 bg-surface-900/50 border border-surface-800 rounded-lg hover:border-brand-500/50 transition-colors"
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <h3 className="font-mono font-semibold text-surface-100 group-hover:text-brand-400 transition-colors mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-surface-500">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Start */}
      <section id="quick-start" className="scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-6">
          Quick Start
        </h2>
        <p className="text-surface-400 mb-6">
          Three steps: evaluate the request, make your AI call, log the usage.
        </p>
        <CodeBlock code={QUICK_EXAMPLE} language="python" />
      </section>

      {/* Next Steps */}
      <div className="mt-8 p-6 bg-surface-900/50 border border-surface-800 rounded-lg">
        <h3 className="font-mono font-semibold text-surface-100 mb-4">
          Next Steps
        </h3>
        <ul className="space-y-3 text-sm text-surface-400">
          <li>
            <span className="text-brand-500 mr-2">1.</span>
            <Link href="/signup" className="text-brand-400 hover:underline">
              Create your account
            </Link>{" "}
            and get your API key
          </li>
          <li>
            <span className="text-brand-500 mr-2">2.</span>
            Pick your SDK:{" "}
            <Link
              href="/docs/sdk/python"
              className="text-brand-400 hover:underline"
            >
              Python
            </Link>
            {", "}
            <Link
              href="/docs/sdk/typescript"
              className="text-brand-400 hover:underline"
            >
              TypeScript
            </Link>
            {", or "}
            <Link
              href="/docs/rest-api"
              className="text-brand-400 hover:underline"
            >
              REST API
            </Link>
          </li>
          <li>
            <span className="text-brand-500 mr-2">3.</span>
            Create policies in the{" "}
            <Link href="/dashboard" className="text-brand-400 hover:underline">
              dashboard
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
