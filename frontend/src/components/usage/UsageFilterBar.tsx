"use client";

import { useState, useEffect } from "react";
import { Workspace, Environment } from "@/types/workspace";
import { getWorkspaces, getEnvironments } from "@/lib/workspaces";

export interface UsageFilters {
  workspace_id: number | null;
  environment_id: number | null;
  user_id: string | null;
  feature: string | null;
  model: string | null;
  status: string | null;
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
  feature: null,
  model: null,
  status: null,
  days: 7,
};

function SelectFilter({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "All",
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-700/40 text-xs font-mono text-surface-200 hover:border-surface-600/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed appearance-none cursor-pointer min-w-[140px]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextFilter({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-700/40 text-xs font-mono text-surface-200 hover:border-surface-600/50 transition-colors placeholder:text-surface-500 disabled:opacity-40 disabled:cursor-not-allowed min-w-[140px]"
      />
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

  // Load workspaces on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWorkspaces(1, 100);
        setWorkspaces(data.items);
        // Auto-select first workspace if only one
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

  // Load environments when workspace changes
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
        // Auto-select first environment if only one
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

  const hasScope = filters.workspace_id && filters.environment_id;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Required: Workspace */}
      <SelectFilter
        label="Workspace"
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
          })
        }
        placeholder="Select workspace"
      />

      {/* Required: Environment */}
      <SelectFilter
        label="Environment"
        value={filters.environment_id?.toString() || ""}
        options={environments.map((e) => ({
          label: e.name,
          value: e.id.toString(),
        }))}
        onChange={(val) =>
          onChange({ ...filters, environment_id: val ? parseInt(val) : null })
        }
        disabled={!filters.workspace_id || loadingEnvs}
        placeholder={loadingEnvs ? "Loading..." : "Select environment"}
      />

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-surface-700/40" />

      {/* Date Range */}
      <SelectFilter
        label="Period"
        value={filters.days.toString()}
        options={[
          { label: "7 days", value: "7" },
          { label: "30 days", value: "30" },
          { label: "90 days", value: "90" },
        ]}
        onChange={(val) => onChange({ ...filters, days: parseInt(val) || 7 })}
        disabled={!hasScope}
      />

      {/* Optional: Status */}
      <SelectFilter
        label="Status"
        value={filters.status || ""}
        options={[
          { label: "Allowed", value: "allowed" },
          { label: "Blocked", value: "blocked" },
        ]}
        onChange={(val) => onChange({ ...filters, status: val || null })}
        disabled={!hasScope}
        placeholder="All"
      />

      {/* Optional: User */}
      <TextFilter
        label="User"
        value={filters.user_id || ""}
        onChange={(val) => onChange({ ...filters, user_id: val || null })}
        placeholder="Filter by user..."
        disabled={!hasScope}
      />

      {/* Optional: Model */}
      <TextFilter
        label="Model"
        value={filters.model || ""}
        onChange={(val) => onChange({ ...filters, model: val || null })}
        placeholder="Filter by model..."
        disabled={!hasScope}
      />

      {/* Optional: Feature */}
      <TextFilter
        label="Feature"
        value={filters.feature || ""}
        onChange={(val) => onChange({ ...filters, feature: val || null })}
        placeholder="Filter by feature..."
        disabled={!hasScope}
      />

      {/* Clear filters */}
      {(filters.user_id ||
        filters.model ||
        filters.feature ||
        filters.status) && (
        <button
          onClick={() =>
            onChange({
              ...filters,
              user_id: null,
              feature: null,
              model: null,
              status: null,
            })
          }
          className="px-3 py-1.5 rounded-lg text-xs font-mono text-surface-400 hover:text-white transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
