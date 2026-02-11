"use client";

import React from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui";

const QUICK_START_PYTHON = `# Install the SDK
pip install tokenfence

# Initialize the client
from tokenfence import TokenFence

tf = TokenFence(api_key="tf_live_...")

# Check if request is allowed
result = tf.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free"
)

if result.allowed:
    # Make your AI call
    response = openai.chat.completions.create(...)
    
    # Log the usage
    tf.log_usage(
        request_id="req_123",
        user_id="user_123",
        model="gpt-4o-mini",
        input_tokens=100,
        output_tokens=50,
        status="allowed"
    )
else:
    print(f"Blocked: {result.reason_code}")`;

const QUICK_START_TYPESCRIPT = `// Install the SDK
npm install tokenfence

// Initialize the client
import { TokenFence } from "tokenfence";

const tf = new TokenFence({ apiKey: "tf_live_..." });

// Check if request is allowed
const result = await tf.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  plan: "free",
});

if (result.allowed) {
  // Make your AI call
  const response = await openai.chat.completions.create(...);
  
  // Log the usage
  await tf.logUsage({
    requestId: "req_123",
    userId: "user_123",
    model: "gpt-4o-mini",
    inputTokens: 100,
    outputTokens: 50,
    status: "allowed",
  });
} else {
  console.log(\`Blocked: \${result.reasonCode}\`);
}`;

const CARDS = [
  {
    title: "Python SDK",
    description: "Full guide to using TokenFence with Python applications.",
    href: "/docs/sdk/python",
    icon: "🐍",
  },
  {
    title: "TypeScript SDK",
    description: "Full guide to using TokenFence with TypeScript/JavaScript.",
    href: "/docs/sdk/typescript",
    icon: "📘",
  },
  {
    title: "VS Code Extension",
    description: "Autocomplete, snippets, and usage stats in your editor.",
    href: "/docs/vscode-extension",
    icon: "💻",
  },
  {
    title: "API Reference",
    description: "Complete REST API documentation with examples.",
    href: "/docs/api-reference",
    icon: "📚",
  },
];

export default function DocsPage() {
  const [language, setLanguage] = React.useState<"python" | "typescript">(
    "python",
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-surface-400 max-w-2xl">
          Everything you need to integrate TokenFence into your AI applications.
          Control usage, enforce limits, and track spending in minutes.
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
          Get up and running with TokenFence in under 5 minutes.
        </p>

        {/* Language Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setLanguage("python")}
            className={`px-4 py-2 text-sm font-mono rounded transition-colors ${
              language === "python"
                ? "bg-brand-500 text-white"
                : "bg-surface-800 text-surface-400 hover:text-surface-200"
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setLanguage("typescript")}
            className={`px-4 py-2 text-sm font-mono rounded transition-colors ${
              language === "typescript"
                ? "bg-brand-500 text-white"
                : "bg-surface-800 text-surface-400 hover:text-surface-200"
            }`}
          >
            TypeScript
          </button>
        </div>

        <CodeBlock
          code={
            language === "python" ? QUICK_START_PYTHON : QUICK_START_TYPESCRIPT
          }
          language={language}
        />

        {/* Next Steps */}
        <div className="mt-8 p-6 bg-surface-900/50 border border-surface-800 rounded-lg">
          <h3 className="font-mono font-semibold text-surface-100 mb-4">
            Next Steps
          </h3>
          <ul className="space-y-2 text-sm text-surface-400">
            <li className="flex items-center gap-2">
              <span className="text-brand-500">1.</span>
              <Link href="/signup" className="text-brand-400 hover:underline">
                Create your account
              </Link>{" "}
              and get your API key
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">2.</span>
              <Link
                href="/docs/sdk/python"
                className="text-brand-400 hover:underline"
              >
                Read the SDK docs
              </Link>{" "}
              for your language
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">3.</span>
              Create policies in the{" "}
              <Link href="/login" className="text-brand-400 hover:underline">
                dashboard
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">4.</span>
              Install the{" "}
              <Link
                href="/docs/vscode-extension"
                className="text-brand-400 hover:underline"
              >
                VS Code extension
              </Link>{" "}
              for a better DX
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
