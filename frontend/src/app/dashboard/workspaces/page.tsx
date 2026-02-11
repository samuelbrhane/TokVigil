"use client";

import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";

const workspaces = [
  { id: 1, name: "Team Workspace", owner: "luka@tokenfence.io", envs: 3, members: 4, plan: "pro" },
  { id: 2, name: "Side Project", owner: "luka@tokenfence.io", envs: 1, members: 1, plan: "free" },
];

export default function WorkspacesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-500">{workspaces.length} workspace(s)</p>
        <Button variant="primary" size="sm">+ Create Workspace</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((ws) => (
          <Card key={ws.id} hover className="p-6 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-mono font-bold">
                {ws.name[0]}
              </div>
              <Badge variant="brand">{ws.plan}</Badge>
            </div>
            <h3 className="text-base font-bold font-mono text-surface-200 mb-1">{ws.name}</h3>
            <p className="text-xs text-surface-500 font-mono mb-4">{ws.owner}</p>
            <div className="flex gap-4 text-xs font-mono text-surface-500">
              <span>{ws.envs} environments</span>
              <span>{ws.members} members</span>
            </div>
          </Card>
        ))}

        {/* Add workspace card */}
        <button className="p-6 rounded-xl border border-dashed border-surface-800/40 hover:border-brand-500/30 transition-colors flex flex-col items-center justify-center text-surface-600 hover:text-brand-400 min-h-[180px]">
          <span className="text-2xl mb-2">+</span>
          <span className="text-xs font-mono">New Workspace</span>
        </button>
      </div>
    </div>
  );
}
