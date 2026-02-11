"use client";

import { useState } from "react";
import { Button, InputField } from "@/components/ui";
import { createApiKey } from "@/lib/workspaces";
import { Environment, ApiKeyCreated } from "@/types/workspace";

interface CreateApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (key: ApiKeyCreated) => void;
  workspaceId: number;
  environments: Environment[];
}

export default function CreateApiKeyModal({
  open,
  onClose,
  onCreated,
  workspaceId,
  environments,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [envId, setEnvId] = useState<number>(environments[0]?.id || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const key = await createApiKey(workspaceId, {
        name,
        environment_id: envId,
      });
      setCreatedKey(key.key);
      onCreated(key);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    setEnvId(environments[0]?.id || 0);
    setCreatedKey(null);
    setError("");
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md mx-4 p-6 rounded-xl border border-surface-800/40 bg-surface-900 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold font-mono text-white">
            {createdKey ? "API Key Created" : "Create API Key"}
          </h2>
          <button
            onClick={handleClose}
            className="text-surface-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {createdKey ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
              ⚠ Copy this key now. You won't be able to see it again.
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-surface-200 bg-surface-800/60 px-3 py-2.5 rounded-lg break-all">
                {createdKey}
              </code>
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Button
              variant="primary"
              className="w-full mt-2"
              size="sm"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Key name"
                placeholder="e.g. Production Key"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium tracking-wider uppercase text-surface-400">
                  Environment
                </label>
                <select
                  value={envId}
                  onChange={(e) => setEnvId(Number(e.target.value))}
                  className="w-full bg-surface-900/80 border border-surface-700/60 rounded-lg px-4 py-2.5 text-sm text-surface-200 font-mono focus:outline-none focus:border-brand-500/50"
                >
                  {environments.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Key"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
