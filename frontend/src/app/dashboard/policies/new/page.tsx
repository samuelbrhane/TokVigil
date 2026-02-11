"use client";

import Link from "next/link";
import { Button, InputField } from "@/components/ui";
import Card from "@/components/ui/Card";

export default function NewPolicyPage() {
  return (
    <div className="max-w-2xl">
      <form className="space-y-8">
        {/* Basic Info */}
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">Basic Info</h3>
          <div className="space-y-4">
            <InputField label="Policy Name" placeholder="e.g., free-plan-chat" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">
                  Plan
                </label>
                <select className="w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-3 text-sm text-surface-200 font-mono focus:outline-none focus:border-brand-500/50">
                  <option>free</option>
                  <option>pro</option>
                  <option>enterprise</option>
                </select>
              </div>
              <InputField label="Feature" placeholder="e.g., chat, summarize" />
            </div>
          </div>
        </Card>

        {/* Request Limits */}
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">Request Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Requests Per Day" type="number" placeholder="50" />
            <InputField label="Requests Per Month" type="number" placeholder="500" />
          </div>
        </Card>

        {/* Token Limits */}
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">Token Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tokens Per Day" type="number" placeholder="100000" />
            <InputField label="Tokens Per Month" type="number" placeholder="1000000" />
          </div>
        </Card>

        {/* Budget */}
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">Budget Limits (USD)</h3>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Per Day" type="number" placeholder="1.00" />
            <InputField label="Per Month" type="number" placeholder="10.00" />
            <InputField label="Per Request (max)" type="number" placeholder="0.05" />
          </div>
        </Card>

        {/* Model Restrictions */}
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">Model Restrictions</h3>
          <div className="space-y-2">
            {["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "claude-3-sonnet", "claude-3-haiku"].map((model) => (
              <label key={model} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500/20"
                  defaultChecked={model.includes("mini") || model.includes("3.5")}
                />
                <span className="text-sm font-mono text-surface-300">{model}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="primary" type="submit">
            Create Policy
          </Button>
          <Link href="/dashboard/policies">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
