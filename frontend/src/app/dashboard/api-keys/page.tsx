"use client";

import { useEffect, useState } from "react";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import WorkspaceSelector from "@/components/dashboard/WorkspaceSelector";
import CreateApiKeyModal from "@/components/dashboard/CreateApiKeyModal";
import RevokeApiKeyModal from "@/components/dashboard/RevokeApiKeyModal";
import { getApiKeys, getEnvironments } from "@/lib/workspaces";
import { ApiKey, Environment } from "@/types/workspace";

const envColors: Record<string, "success" | "warning" | "brand"> = {
  production: "success",
  development: "warning",
  staging: "brand",
};

export default function ApiKeysPage() {
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);

  const fetchData = async (wsId: number) => {
    setLoading(true);
    try {
      const [keys, envs] = await Promise.all([
        getApiKeys(wsId),
        getEnvironments(wsId),
      ]);
      setApiKeys(keys);
      setEnvironments(envs);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) fetchData(workspaceId);
  }, [workspaceId]);

  const handleWorkspaceChange = (id: number) => {
    setWorkspaceId(id);
    setActiveTab("all");
    setInitialized(true);
  };

  const handleRevoked = () => {
    if (workspaceId) fetchData(workspaceId);
    setRevokeTarget(null);
  };

  const handleCreated = () => {
    if (workspaceId) fetchData(workspaceId);
  };

  const getEnvName = (envId: number) =>
    environments.find((e) => e.id === envId)?.name || "unknown";

  const envTabs = ["all", ...environments.map((e) => e.name)];

  const filteredKeys = apiKeys.filter(
    (k) => activeTab === "all" || getEnvName(k.environment_id) === activeTab,
  );

  return (
    <div className="space-y-6">
      {/* Workspace selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-surface-500 font-mono">Workspace:</span>
          <WorkspaceSelector
            value={workspaceId}
            onChange={handleWorkspaceChange}
          />
        </div>
      </div>

      {!initialized ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm font-mono">Loading...</p>
          </div>
        </div>
      ) : !workspaceId ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⚿</div>
          <h3 className="text-lg font-bold font-mono text-surface-300 mb-2">
            Select a workspace
          </h3>
          <p className="text-sm text-surface-500">
            Choose a workspace to manage its API keys.
          </p>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-surface-800/20 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Tabs + Create */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {envTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                      : "text-surface-500 hover:text-surface-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreate(true)}
            >
              + Create API Key
            </Button>
          </div>

          {/* Keys table */}
          {filteredKeys.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⚿</div>
              <h3 className="text-lg font-bold font-mono text-surface-300 mb-2">
                No API keys
              </h3>
              <p className="text-sm text-surface-500 mb-6">
                Create your first API key to start using the SDK.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreate(true)}
              >
                + Create API Key
              </Button>
            </div>
          ) : (
            <Card className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-800/30">
                      {[
                        "Name",
                        "Key",
                        "Environment",
                        "Created",
                        "Last Used",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[11px] font-mono font-bold text-surface-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeys.map((key) => (
                      <tr
                        key={key.id}
                        className="border-b border-surface-800/15 hover:bg-surface-900/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-surface-200">
                          {key.name}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs font-mono text-surface-400 bg-surface-900/60 px-2 py-1 rounded">
                            {key.key_prefix}...
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              envColors[getEnvName(key.environment_id)] ||
                              "brand"
                            }
                          >
                            {getEnvName(key.environment_id)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-surface-500">
                          {new Date(key.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-surface-500">
                          {key.last_used_at
                            ? new Date(key.last_used_at).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRevokeTarget(key)}
                            className="text-surface-500 hover:text-red-400"
                          >
                            Revoke
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {workspaceId && environments.length > 0 && (
        <CreateApiKeyModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
          workspaceId={workspaceId}
          environments={environments}
        />
      )}

      {revokeTarget && workspaceId && (
        <RevokeApiKeyModal
          open={true}
          onClose={() => setRevokeTarget(null)}
          onRevoked={handleRevoked}
          workspaceId={workspaceId}
          apiKeyId={revokeTarget.id}
          apiKeyName={revokeTarget.name}
        />
      )}
    </div>
  );
}
