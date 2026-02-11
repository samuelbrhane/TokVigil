"use client";

import { Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { Workspace } from "@/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
  envCount: number;
  index: number;
  onClick: () => void;
  onDelete: () => void;
}

export default function WorkspaceCard({
  workspace,
  envCount,
  index,
  onClick,
  onDelete,
}: WorkspaceCardProps) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-mono font-bold cursor-pointer"
            onClick={onClick}
          >
            {workspace.name[0]?.toUpperCase()}
          </div>
          <Badge variant={workspace.is_active ? "brand" : "default"}>
            {workspace.is_active ? "active" : "inactive"}
          </Badge>
        </div>
        <div className="cursor-pointer" onClick={onClick}>
          <h3 className="text-base font-bold font-mono text-surface-200 mb-1">
            {workspace.name}
          </h3>
          <p className="text-xs text-surface-500 font-mono mb-4">
            Created {new Date(workspace.created_at).toLocaleDateString()}
          </p>
          <div className="flex gap-4 text-xs font-mono text-surface-500">
            <span>{envCount} environments</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-surface-800/30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-xs font-mono text-surface-500 hover:text-red-400 transition-colors"
          >
            Delete workspace
          </button>
        </div>
      </Card>
    </div>
  );
}
