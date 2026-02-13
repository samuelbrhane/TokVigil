import { api } from "./api";
import {
  Workspace,
  Environment,
  ApiKey,
  ApiKeyCreated,
  PaginatedWorkspaces,
} from "@/types/workspace";

// Workspaces
export async function getWorkspaces(
  page = 1,
  pageSize = 9,
): Promise<PaginatedWorkspaces> {
  return api<PaginatedWorkspaces>(
    `/workspaces?page=${page}&page_size=${pageSize}`,
  );
}

export async function getWorkspace(
  id: number,
): Promise<Workspace & { environments: Environment[] }> {
  return api(`/workspaces/${id}`);
}

export async function createWorkspace(name: string): Promise<Workspace> {
  return api<Workspace>("/workspaces", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateWorkspace(
  id: number,
  data: { name?: string; is_active?: boolean },
): Promise<Workspace> {
  return api<Workspace>(`/workspaces/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteWorkspace(id: number): Promise<void> {
  return api(`/workspaces/${id}`, { method: "DELETE" });
}

// Environments
export async function getEnvironments(
  workspaceId: number,
): Promise<Environment[]> {
  return api<Environment[]>(`/workspaces/${workspaceId}/environments`);
}

export async function createEnvironment(
  workspaceId: number,
  name: string,
): Promise<Environment> {
  return api<Environment>(`/workspaces/${workspaceId}/environments`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// API Keys
export interface PaginatedApiKeys {
  items: ApiKey[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export async function getApiKeys(
  workspaceId: number,
  page = 1,
  pageSize = 20,
): Promise<PaginatedApiKeys> {
  return api<PaginatedApiKeys>(
    `/workspaces/${workspaceId}/api-keys?page=${page}&page_size=${pageSize}`,
  );
}

export async function createApiKey(
  workspaceId: number,
  data: { name: string; environment_id: number },
): Promise<ApiKeyCreated> {
  return api<ApiKeyCreated>(`/workspaces/${workspaceId}/api-keys`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function revokeApiKey(
  workspaceId: number,
  apiKeyId: number,
): Promise<void> {
  return api(`/workspaces/${workspaceId}/api-keys/${apiKeyId}`, {
    method: "DELETE",
  });
}
