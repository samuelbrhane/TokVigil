"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";

const apiKeys = [
  { id: 1, name: "Production Key", prefix: "tf_live_a1b2c3...", env: "production", created: "2025-01-15", lastUsed: "2 min ago" },
  { id: 2, name: "Development Key", prefix: "tf_test_d4e5f6...", env: "development", created: "2025-01-15", lastUsed: "1 hour ago" },
  { id: 3, name: "Staging Key", prefix: "tf_test_g7h8i9...", env: "staging", created: "2025-02-01", lastUsed: "3 days ago" },
];

const envColors: Record<string, "success" | "warning" | "brand"> = {
  production: "success",
  development: "warning",
  staging: "brand",
};

export default function ApiKeysPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      {/* Tabs + Create */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {["all", "production", "development", "staging"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-surface-500 hover:text-surface-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(!showCreate)}>
          + Create API Key
        </Button>
      </div>

      {/* Create key form */}
      {showCreate && (
        <Card className="p-6 border-brand-500/20 animate-slide-up">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">New API Key</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">Name</label>
              <input
                placeholder="e.g., Production Key"
                className="w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-2.5 text-sm text-surface-200 font-mono focus:outline-none focus:border-brand-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">Environment</label>
              <select className="w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-2.5 text-sm text-surface-200 font-mono focus:outline-none focus:border-brand-500/50">
                <option>production</option>
                <option>development</option>
                <option>staging</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">Generate Key</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Keys table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800/30">
                {["Name", "Key", "Environment", "Created", "Last Used", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-mono font-bold text-surface-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apiKeys
                .filter((k) => activeTab === "all" || k.env === activeTab)
                .map((key) => (
                  <tr key={key.id} className="border-b border-surface-800/15 hover:bg-surface-900/40 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-surface-200">{key.name}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-surface-400 bg-surface-900/60 px-2 py-1 rounded">
                        {key.prefix}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={envColors[key.env]}>{key.env}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-surface-500">{key.created}</td>
                    <td className="px-4 py-3 text-xs font-mono text-surface-500">{key.lastUsed}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs font-mono text-surface-500 hover:text-brand-400 transition-colors">Copy</button>
                        <button className="text-xs font-mono text-surface-500 hover:text-red-400 transition-colors">Revoke</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
