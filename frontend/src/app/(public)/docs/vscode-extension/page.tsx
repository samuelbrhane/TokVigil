"use client";

import DocHeader from "@/components/docs/DocHeader";
import DocTableOfContents from "@/components/docs/DocTableOfContents";
import DocSection from "@/components/docs/DocSection";
import DocNote from "@/components/docs/DocNote";
import DocSteps from "@/components/docs/DocSteps";
import DocTable from "@/components/docs/DocTable";
import DocFeature from "@/components/docs/DocFeature";

const TOC = [
  { id: "installation", title: "Installation" },
  { id: "setup", title: "Setup" },
  { id: "features", title: "Features" },
  { id: "snippets", title: "Code Snippets" },
  { id: "commands", title: "Commands" },
  { id: "test-evaluate", title: "Test Evaluate" },
];

const SNIPPET_ROWS: [string, string][] = [
  ["tvimport", "Import TokVigil SDK"],
  ["tvinit", "Initialize client"],
  ["tveval", "Evaluate request"],
  ["tvlog", "Log usage"],
  ["tvflow", "Complete flow"],
  ["tvcheck", "Check and call"],
  ["tverror", "Error handling"],
  ["tvsummary", "Get usage summary"],
  ["tvbyuser", "Get usage by user"],
  ["tvbyfeature", "Get usage by feature"],
  ["tvblocked", "Get blocked requests"],
  ["tvrecent", "Get recent usage"],
];

const COMMAND_ROWS: [string, string][] = [
  ["TokVigil: Set API Key", "Configure your API key"],
  ["TokVigil: Test Evaluate", "Test evaluate with custom parameters"],
  ["TokVigil: Open Dashboard", "Open web dashboard"],
  ["TokVigil: Insert Snippet", "Insert code snippet"],
  ["TokVigil: Refresh Usage", "Refresh usage stats in sidebar"],
];

const CODE_SETTINGS = `{
  "tokvigil.apiKey": "tv_live_...",
  "tokvigil.baseUrl": "https://api.tokvigil.com"
}`;

export default function VSCodeExtensionPage() {
  return (
    <div>
      <DocHeader
        icon="💻"
        title="VS Code Extension"
        description="Autocomplete, snippets, and usage stats directly in your editor."
      />

      <DocTableOfContents items={TOC} />

      <div className="space-y-16">
        {/* Installation */}
        <DocSection
          id="installation"
          title="Installation"
          description="Install from the VS Code Marketplace:"
        >
          <DocSteps
            steps={[
              "Open VS Code",
              'Press <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">Ctrl+Shift+X</code> to open Extensions',
              'Search for <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">TokVigil</code>',
              "Click Install",
            ]}
          />
        </DocSection>

        {/* Setup */}
        <DocSection
          id="setup"
          title="Setup"
          description="Configure your API key to enable all features:"
          code={CODE_SETTINGS}
          language="json"
        >
          <DocSteps
            steps={[
              'Press <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">Ctrl+Shift+P</code> to open Command Palette',
              'Type <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">TokVigil: Set API Key</code>',
              'Enter your API key (starts with <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">tv_live_</code>)',
            ]}
          />
          <p className="text-surface-400 mb-4">
            Or set it directly in VS Code settings:
          </p>
        </DocSection>

        {/* Features */}
        <DocSection id="features" title="Features">
          <DocFeature
            icon="📊"
            title="Sidebar Panel"
            description="View your usage stats directly in VS Code:"
            items={[
              "Workspace and environment info",
              "Total requests, tokens, and cost",
              "Top users and features",
              "Quick actions (Test, Snippet, Dashboard)",
            ]}
          />
          <DocFeature
            icon="⚡"
            title="Autocomplete"
            description="Get intelligent suggestions when typing us. in your code:"
            items={[
              "All SDK methods with documentation",
              "Parameter hints and types",
              "Works in Python, TypeScript, and JavaScript",
            ]}
          />
          <DocFeature
            icon="📚"
            title="Hover Documentation"
            description="Hover over any TokVigil method to see documentation, parameters, and examples."
          />
          <DocFeature
            icon="⚠️"
            title="Inline Validation"
            description="Get real-time warnings for common issues:"
            items={[
              "Missing TokVigil import",
              "Empty or placeholder API keys",
              "Missing required parameters",
            ]}
          />
        </DocSection>

        {/* Snippets */}
        <DocSection
          id="snippets"
          title="Code Snippets"
          description="Type a prefix and press Tab to insert a snippet:"
        >
          <DocTable headers={["Prefix", "Description"]} rows={SNIPPET_ROWS} />
        </DocSection>

        {/* Commands */}
        <DocSection
          id="commands"
          title="Commands"
          description="Access via Command Palette (Ctrl+Shift+P):"
        >
          <DocTable
            headers={["Command", "Description"]}
            rows={COMMAND_ROWS}
            highlightFirst={false}
          />
        </DocSection>

        {/* Test Evaluate */}
        <DocSection
          id="test-evaluate"
          title="Test Evaluate"
          description="Test your policies directly from VS Code without writing any code:"
        >
          <DocSteps
            steps={[
              'Press <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">Ctrl+Shift+P</code>',
              'Type <code class="px-2 py-0.5 bg-surface-800 rounded text-sm">TokVigil: Test Evaluate</code>',
              "Enter user ID, select model, and set feature",
              "See the result: allowed or blocked with reason code",
            ]}
          />
          <DocNote type="info">
            Test requests are logged to your usage stats, so you can verify
            everything works end-to-end.
          </DocNote>
        </DocSection>
      </div>
    </div>
  );
}
