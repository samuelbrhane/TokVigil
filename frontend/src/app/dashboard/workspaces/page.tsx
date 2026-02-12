"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { getWorkspaces } from "@/lib/workspaces";
import { PaginatedWorkspaces } from "@/types/workspace";
import { Workspace } from "@/types/workspace";
import Pagination from "@/components/dashboard/Pagination";
import {
  CreateWorkspaceModal,
  DeleteWorkspaceModal,
  WorkspaceCard,
} from "@/components/dashboard";

export default function WorkspacesPage() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedWorkspaces | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Workspace | null>(null);

  const fetchWorkspaces = async (p: number) => {
    setLoading(true);
    try {
      const result = await getWorkspaces(p);
      setData(result);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces(page);
  }, [page]);

  const handleCreated = (workspace: Workspace) => {
    fetchWorkspaces(page);
  };

  const handleDeleted = () => {
    fetchWorkspaces(page);
    setDeleteTarget(null);
  };

  const workspaces = data?.items || [];

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-400 text-sm font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-500">
          {data?.total || 0} workspace(s)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
          {workspaces.map((ws, i) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              envCount={3}
              index={i}
              onClick={() => router.push(`/dashboard/workspaces/${ws.id}`)}
              onDelete={() => setDeleteTarget(ws)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && (
        <Pagination
          page={data.page}
          totalPages={data.total_pages}
          hasNext={data.has_next}
          hasPrev={data.has_prev}
          onPageChange={setPage}
        />
      )}

      <CreateWorkspaceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {deleteTarget && (
        <DeleteWorkspaceModal
          open={true}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
          workspaceId={deleteTarget.id}
          workspaceName={deleteTarget.name}
        />
      )}
    </div>
  );
}
