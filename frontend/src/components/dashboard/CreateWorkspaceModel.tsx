"use client";

import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import { createWorkspace } from "@/lib/workspaces";
import { Workspace } from "@/types/workspace";

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (workspace: Workspace) => void;
}

export default function CreateWorkspaceModal({
  open,
  onClose,
  onCreated,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const workspace = await createWorkspace(name);
      onCreated(workspace);
      setName("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 p-6 rounded-xl border border-surface-800/40 bg-surface-900 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold font-mono text-white">
            Create Workspace
          </h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Workspace name"
            placeholder="e.g. My SaaS App"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <p className="text-xs text-surface-500">
            Each workspace gets 3 default environments: development, staging,
            and production.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
