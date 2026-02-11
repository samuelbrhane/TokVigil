"use client";

import React from "react";
import { CodeBlock } from "@/components/ui";

const SNIPPETS = [
  { prefix: "tfimport", description: "Import TokenFence SDK" },
  { prefix: "tfinit", description: "Initialize client" },
  { prefix: "tfeval", description: "Evaluate request" },
  { prefix: "tflog", description: "Log usage" },
  { prefix: "tfflow", description: "Complete flow" },
  { prefix: "tferror", description: "Error handling" },
  { prefix: "tfsummary", description: "Get usage summary" },
  { prefix: "tfbyuser", description: "Get usage by user" },
  { prefix: "tfbyfeature", description: "Get usage by feature" },
  { prefix: "tfblocked", description: "Get blocked requests" },
  { prefix: "tfcheck", description: "Check and call" },
  { prefix: "tfrecent", description: "Get recent usage" },
];

const COMMANDS = [
  { command: "TokenFence: Set API Key", description: "Configure your API key" },
  {
    command: "TokenFence: Test Evaluate",
    description: "Test evaluate with custom parameters",
  },
  { command: "TokenFence: Open Dashboard", description: "Open web dashboard" },
  { command: "TokenFence: Insert Snippet", description: "Insert code snippet" },
  {
    command: "TokenFence: Refresh Usage",
    description: "Refresh usage stats in sidebar",
  },
];

export default function VSCodeExtensionPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💻</span>
          <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight">
            VS Code Extension
          </h1>
        </div>
        <p className="text-lg text-surface-400 max-w-2xl">
          Autocomplete, snippets, and usage stats directly in your editor.
        </p>
      </div>

      {/* Installation */}
      <section id="installation" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Installation
        </h2>
        <p className="text-surface-400 mb-6">
          Install from the VS Code Marketplace:
        </p>
        <ol className="space-y-3 text-surface-400 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">1.</span>
            Open VS Code
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">2.</span>
            Press{" "}
            <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
              Ctrl+Shift+X
            </code>{" "}
            to open Extensions
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">3.</span>
            Search for "TokenFence"
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">4.</span>
            Click Install
          </li>
        </ol>
      </section>

      {/* Setup */}
      <section id="setup" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Setup
        </h2>
        <p className="text-surface-400 mb-6">
          Configure your API key to enable all features:
        </p>
        <ol className="space-y-3 text-surface-400 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">1.</span>
            Press{" "}
            <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
              Ctrl+Shift+P
            </code>{" "}
            to open Command Palette
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">2.</span>
            Type "TokenFence: Set API Key"
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">3.</span>
            Enter your API key (starts with{" "}
            <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
              tf_live_
            </code>
            )
          </li>
        </ol>
        <p className="text-surface-400">
          You can also set it in VS Code settings:
        </p>
        <CodeBlock
          code={`{
  "tokenfence.apiKey": "tf_live_...",
  "tokenfence.baseUrl": "https://api.tokenfence.io"
}`}
          language="json"
        />
      </section>

      {/* Features */}
      <section id="features" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Features
        </h2>

        {/* Sidebar */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-surface-200 mb-3">
            📊 Sidebar Panel
          </h3>
          <p className="text-surface-400 mb-4">
            View your usage stats directly in VS Code:
          </p>
          <ul className="space-y-2 text-surface-400 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Workspace and environment info
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Total requests, tokens, and cost
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Top users and features
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Quick actions (Test, Snippet, Dashboard)
            </li>
          </ul>
        </div>

        {/* Autocomplete */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-surface-200 mb-3">
            ⚡ Autocomplete
          </h3>
          <p className="text-surface-400 mb-4">
            Get intelligent suggestions when typing{" "}
            <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
              tf.
            </code>
            :
          </p>
          <ul className="space-y-2 text-surface-400 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              All SDK methods with documentation
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Parameter hints and types
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Works in Python, TypeScript, and JavaScript
            </li>
          </ul>
        </div>

        {/* Hover Docs */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-surface-200 mb-3">
            📚 Hover Documentation
          </h3>
          <p className="text-surface-400">
            Hover over any TokenFence method to see documentation, parameters,
            and examples.
          </p>
        </div>

        {/* Inline Validation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-surface-200 mb-3">
            ⚠️ Inline Validation
          </h3>
          <p className="text-surface-400 mb-4">Get real-time warnings for:</p>
          <ul className="space-y-2 text-surface-400 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Missing TokenFence import
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Empty or placeholder API keys
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              Missing required parameters
            </li>
          </ul>
        </div>
      </section>

      {/* Snippets */}
      <section id="snippets" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Code Snippets
        </h2>
        <p className="text-surface-400 mb-6">
          Type a prefix and press{" "}
          <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
            Tab
          </code>{" "}
          to insert a snippet:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-400 font-mono font-medium">
                  Prefix
                </th>
                <th className="text-left py-3 px-4 text-surface-400 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {SNIPPETS.map((snippet) => (
                <tr
                  key={snippet.prefix}
                  className="border-b border-surface-800/50"
                >
                  <td className="py-3 px-4 font-mono text-brand-400">
                    {snippet.prefix}
                  </td>
                  <td className="py-3 px-4 text-surface-300">
                    {snippet.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Commands */}
      <section id="commands" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Commands
        </h2>
        <p className="text-surface-400 mb-6">
          Access via Command Palette (
          <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
            Ctrl+Shift+P
          </code>
          ):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-400 font-medium">
                  Command
                </th>
                <th className="text-left py-3 px-4 text-surface-400 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {COMMANDS.map((cmd) => (
                <tr
                  key={cmd.command}
                  className="border-b border-surface-800/50"
                >
                  <td className="py-3 px-4 font-mono text-surface-200">
                    {cmd.command}
                  </td>
                  <td className="py-3 px-4 text-surface-400">
                    {cmd.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Test Evaluate */}
      <section id="test-evaluate" className="scroll-mt-28">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Test Evaluate
        </h2>
        <p className="text-surface-400 mb-6">
          Test your policies directly from VS Code:
        </p>
        <ol className="space-y-3 text-surface-400">
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">1.</span>
            Press{" "}
            <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
              Ctrl+Shift+P
            </code>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">2.</span>
            Type "TokenFence: Test Evaluate"
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">3.</span>
            Enter user ID, select model, and set plan/feature
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 font-mono">4.</span>
            See the result: allowed or blocked with reason code
          </li>
        </ol>
        <p className="text-surface-400 mt-6">
          Test requests are logged to your usage stats, so you can verify
          everything works.
        </p>
      </section>
    </div>
  );
}
