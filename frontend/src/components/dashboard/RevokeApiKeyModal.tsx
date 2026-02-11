"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { revokeApiKey } from "@/lib/workspaces";

interface RevokeApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onRevoked: () => void;
  workspaceId: number;
  apiKeyId: number;
  apiKeyName: string;
}

export default function RevokeApiKeyModal({
  open,
  onClose,
  onRevoked,
  workspaceId,
  apiKeyId,
  apiKeyName,
}: RevokeApiKeyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleRevoke = async () => {
    setError("");
    setLoading(true);
    try {
      await revokeApiKey(workspaceId, apiKeyId);
      onRevoked();
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
      <div className="relative w-full max-w-sm mx-4 p-6 rounded-xl border border-surface-800/40 bg-surface-900 animate-scale-in">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-lg">⚠</span>
          </div>
          <h2 className="text-lg font-bold font-mono text-white">
            Revoke API Key
          </h2>
          <p className="text-sm text-surface-400">
            Are you sure you want to revoke{" "}
            <span className="text-white font-mono">{apiKeyName}</span>? Any
            applications using this key will stop working immediately.
          </p>
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={handleRevoke}
            disabled={loading}
          >
            {loading ? "Revoking..." : "Revoke Key"}
          </Button>
        </div>
      </div>
    </div>
  );
}
