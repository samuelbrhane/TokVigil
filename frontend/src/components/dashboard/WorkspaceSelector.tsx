"use client";

import { useEffect, useState } from "react";
import { getWorkspaces } from "@/lib/workspaces";
import { Workspace } from "@/types/workspace";
import CustomSelect from "@/components/ui/CustomSelect";

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
    getWorkspaces(1, 100)
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
    <CustomSelect
      value={value?.toString() || ""}
      options={workspaces.map((ws) => ({
        label: ws.name,
        value: ws.id.toString(),
      }))}
      onChange={(val) => onChange(Number(val))}
      placeholder="Select workspace"
      className="w-48"
      maxHeight={240}
    />
  );
}
