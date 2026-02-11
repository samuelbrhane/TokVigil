"use client";

import { useEffect, useState } from "react";
import { getWorkspaces } from "@/lib/workspaces";
import { Workspace } from "@/types/workspace";

interface WorkspaceSelectorProps {
  value: number | null;
  onChange: (id: number) => void;
  onLoaded?: (hasWorkspaces: boolean) => void;
}

export default function WorkspaceSelector({
  value,
  onChange,
  onLoaded,
}: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = () => {
    setLoading(true);
    getWorkspaces()
      .then((data) => {
        setWorkspaces(data.items);
        if (data.items.length > 0) {
          if (!value || !data.items.find((w) => w.id === value)) {
            onChange(data.items[0].id);
          }
        }
        onLoaded?.(data.items.length > 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  if (loading) {
    return (
      <div className="h-9 w-48 bg-surface-800/40 rounded-lg animate-pulse" />
    );
  }

  if (workspaces.length === 0) {
    return (
      <p className="text-xs text-surface-500 font-mono">
        No workspaces — create one first
      </p>
    );
  }

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-surface-900/80 border border-surface-700/60 rounded-lg px-3 py-2 text-sm text-surface-200 font-mono focus:outline-none focus:border-brand-500/50"
    >
      {workspaces.map((ws) => (
        <option key={ws.id} value={ws.id}>
          {ws.name}
        </option>
      ))}
    </select>
  );
}
