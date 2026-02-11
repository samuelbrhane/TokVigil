"use client";

import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import { deleteWorkspace } from "@/lib/workspaces";

interface DeleteWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
  workspaceId: number;
  workspaceName: string;
}

export default function DeleteWorkspaceModal({
  open,
  onClose,
  onDeleted,
  workspaceId,
  workspaceName,
}: DeleteWorkspaceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");

  if (!open) return null;

  const handleDelete = async () => {
    setError("");
    setLoading(true);
    try {
      await deleteWorkspace(workspaceId);
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirm("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-sm mx-4 p-6 rounded-xl border border-surface-800/40 bg-surface-900 animate-scale-in">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-lg">⚠</span>
          </div>
          <h2 className="text-lg font-bold font-mono text-white">
            Delete Workspace
          </h2>
          <p className="text-sm text-surface-400">
            This will delete{" "}
            <span className="text-white font-mono">{workspaceName}</span> and
            all its environments, API keys, and policies.
          </p>
        </div>

        <div className="mt-4">
          <InputField
            label={`Type "${workspaceName}" to confirm`}
            placeholder={workspaceName}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={handleDelete}
            disabled={loading || confirm !== workspaceName}
          >
            {loading ? "Deleting..." : "Delete Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}
