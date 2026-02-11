"use client";

import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";

function ProgressBar({ label, current, max, unit = "" }: { label: string; current: number; max: number; unit?: string }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isWarning = pct > 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-surface-400">{label}</span>
        <span className="text-xs font-mono text-surface-500">
          {current.toLocaleString()}{unit} / {max.toLocaleString()}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-800/60 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isWarning ? "bg-amber-500" : "bg-brand-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const invoices = [
  { date: "Feb 1, 2025", amount: "$49.00", status: "Paid" },
  { date: "Jan 1, 2025", amount: "$49.00", status: "Paid" },
  { date: "Dec 1, 2024", amount: "$49.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Current Plan */}
      <Card className="p-6 border-brand-500/20">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="brand">Current Plan</Badge>
            <h3 className="mt-3 text-2xl font-bold font-mono text-surface-100">Pro</h3>
            <p className="text-sm text-surface-500 mt-1">
              <span className="text-surface-200 font-bold">$49</span>/month · Renews Mar 1, 2025
            </p>
          </div>
          <Button variant="secondary" size="sm">Upgrade</Button>
        </div>
      </Card>

      {/* Usage This Month */}
      <Card className="p-6">
        <h3 className="text-sm font-mono font-bold text-surface-200 mb-5">Usage This Month</h3>
        <div className="space-y-5">
          <ProgressBar label="AI Requests" current={67420} max={100000} />
          <ProgressBar label="Tokens" current={18500000} max={50000000} />
          <ProgressBar label="Cost" current={89} max={200} unit="$" />
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">Payment Method</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-surface-800/60 border border-surface-700/40 flex items-center justify-center text-[10px] font-mono text-surface-400">
              VISA
            </div>
            <span className="text-sm font-mono text-surface-300">•••• •••• •••• 4242</span>
            <span className="text-xs text-surface-500">Exp 12/26</span>
          </div>
          <Button variant="ghost" size="sm">Update</Button>
        </div>
      </Card>

      {/* Invoices */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-800/30">
          <h3 className="text-sm font-mono font-bold text-surface-200">Invoices</h3>
        </div>
        <table className="w-full">
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-b border-surface-800/15 last:border-0">
                <td className="px-6 py-3 text-sm font-mono text-surface-300">{inv.date}</td>
                <td className="px-6 py-3 text-sm font-mono text-surface-400">{inv.amount}</td>
                <td className="px-6 py-3">
                  <Badge variant="success">{inv.status}</Badge>
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="text-xs font-mono text-brand-500/70 hover:text-brand-400 transition-colors">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Cancel */}
      <div className="pt-4 border-t border-surface-800/20">
        <Button variant="danger" size="sm">Cancel Subscription</Button>
      </div>
    </div>
  );
}
