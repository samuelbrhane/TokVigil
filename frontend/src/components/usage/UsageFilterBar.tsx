"use client";

import { useState, useEffect } from "react";
import { Workspace, Environment } from "@/types/workspace";
import { getWorkspaces, getEnvironments } from "@/lib/workspaces";
import CustomSelect from "@/components/ui/CustomSelect";

export interface UsageFilters {
  workspace_id: number | null;
  environment_id: number | null;
  user_id: string | null;
  days: number;
}

interface UsageFilterBarProps {
  filters: UsageFilters;
  onChange: (filters: UsageFilters) => void;
}

export const DEFAULT_FILTERS: UsageFilters = {
  workspace_id: null,
  environment_id: null,
  user_id: null,
  days: 7,
};

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function UsageFilterBar({
  filters,
  onChange,
}: UsageFilterBarProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loadingEnvs, setLoadingEnvs] = useState(false);
  const [userInput, setUserInput] = useState(filters.user_id || "");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWorkspaces(1, 100);
        setWorkspaces(data.items);
        if (data.items.length === 1) {
          onChange({
            ...filters,
            workspace_id: data.items[0].id,
            environment_id: null,
          });
        }
      } catch {
        // handle error
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!filters.workspace_id) {
      setEnvironments([]);
      return;
    }
    const load = async () => {
      setLoadingEnvs(true);
      try {
        const envs = await getEnvironments(filters.workspace_id!);
        setEnvironments(envs);
        if (envs.length === 1) {
          onChange({ ...filters, environment_id: envs[0].id });
        }
      } catch {
        // handle error
      } finally {
        setLoadingEnvs(false);
      }
    };
    load();
  }, [filters.workspace_id]);

  useEffect(() => {
    if (!filters.user_id) setUserInput("");
  }, [filters.user_id]);

  const hasScope = filters.workspace_id && filters.environment_id;

  const handleUserSubmit = () => {
    const trimmed = userInput.trim();
    onChange({ ...filters, user_id: trimmed || null });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <FilterField label="Workspace">
        <CustomSelect
          value={filters.workspace_id?.toString() || ""}
          options={workspaces.map((w) => ({
            label: w.name,
            value: w.id.toString(),
          }))}
          onChange={(val) =>
            onChange({
              ...filters,
              workspace_id: val ? parseInt(val) : null,
              environment_id: null,
              user_id: null,
            })
          }
          placeholder="Select workspace"
          className="min-w-[140px]"
          maxHeight={240}
        />
      </FilterField>

      <FilterField label="Environment">
        <CustomSelect
          value={filters.environment_id?.toString() || ""}
          options={environments.map((e) => ({
            label: e.name,
            value: e.id.toString(),
          }))}
          onChange={(val) =>
            onChange({
              ...filters,
              environment_id: val ? parseInt(val) : null,
            })
          }
          disabled={!filters.workspace_id || loadingEnvs}
          placeholder={loadingEnvs ? "Loading..." : "Select environment"}
          className="min-w-[140px]"
          maxHeight={240}
        />
      </FilterField>

      <div className="hidden md:block w-px h-8 bg-surface-700/40" />

      <FilterField label="Period">
        <CustomSelect
          value={filters.days.toString()}
          options={[
            { label: "7 days", value: "7" },
            { label: "30 days", value: "30" },
            { label: "90 days", value: "90" },
          ]}
          onChange={(val) => onChange({ ...filters, days: parseInt(val) || 7 })}
          disabled={!hasScope}
          className="min-w-[140px]"
        />
      </FilterField>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
          User
        </label>
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUserSubmit();
            }}
            placeholder="Press Enter to filter..."
            disabled={!hasScope}
            className="px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-700/40 text-xs font-mono text-surface-200 hover:border-surface-600/50 transition-colors placeholder:text-surface-500 disabled:opacity-40 disabled:cursor-not-allowed min-w-[160px]"
          />
          {filters.user_id && (
            <button
              onClick={() => {
                setUserInput("");
                onChange({ ...filters, user_id: null });
              }}
              className="px-2 py-1.5 rounded-lg text-xs font-mono text-surface-400 hover:text-white transition-colors"
              title="Clear user filter"
            >
              ✕
            </button>
          )}
        </div>
        {filters.user_id && (
          <span className="text-[10px] font-mono text-brand-400">
            Filtering: {filters.user_id}
          </span>
        )}
      </div>
    </div>
  );
}
