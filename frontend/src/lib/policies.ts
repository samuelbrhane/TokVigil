import { api } from "./api";
import { Policy, PaginatedPolicies, PolicyFormData } from "@/types/policy";

export async function getPolicies(
  workspaceId: number,
  page = 1,
  pageSize = 20,
  filters?: { plan?: string; feature?: string; is_active?: boolean },
): Promise<PaginatedPolicies> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (filters?.plan) params.set("plan", filters.plan);
  if (filters?.feature) params.set("feature", filters.feature);
  if (filters?.is_active !== undefined)
    params.set("is_active", String(filters.is_active));

  return api<PaginatedPolicies>(
    `/policies/${workspaceId}?${params.toString()}`,
  );
}

export async function getPolicy(
  workspaceId: number,
  policyId: number,
): Promise<Policy> {
  return api<Policy>(`/policies/${workspaceId}/${policyId}`);
}

export async function createPolicy(
  workspaceId: number,
  data: PolicyFormData,
): Promise<Policy> {
  return api<Policy>(`/policies/${workspaceId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePolicy(
  workspaceId: number,
  policyId: number,
  data: Partial<PolicyFormData>,
): Promise<Policy> {
  return api<Policy>(`/policies/${workspaceId}/${policyId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePolicy(
  workspaceId: number,
  policyId: number,
): Promise<void> {
  return api(`/policies/${workspaceId}/${policyId}`, { method: "DELETE" });
}
