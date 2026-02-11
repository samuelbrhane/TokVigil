"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { getWorkspaces } from "@/lib/workspaces";
import { Workspace } from "@/types/workspace";
import { CreateWorkspaceModal, WorkspaceCard } from "@/components/dashboard";

export default function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data.items);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreated = (workspace: Workspace) => {
    setWorkspaces((prev) => [workspace, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-surface-800/40 rounded animate-pulse" />
          <div className="h-9 w-40 bg-surface-800/40 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-surface-800/20 border border-surface-800/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-500">
          {workspaces.length} workspace(s)
        </p>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          + Create Workspace
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⧈</div>
          <h3 className="text-lg font-bold font-mono text-surface-300 mb-2">
            No workspaces yet
          </h3>
          <p className="text-sm text-surface-500 mb-6">
            Create your first workspace to start managing AI usage.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreate(true)}
          >
            + Create Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, i) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              envCount={3}
              index={i}
              onClick={() => router.push(`/dashboard/workspaces/${ws.id}`)}
            />
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
