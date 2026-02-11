export interface Workspace {
  id: number;
  name: string;
  owner_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Environment {
  id: number;
  workspace_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface ApiKey {
  id: number;
  workspace_id: number;
  environment_id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface ApiKeyCreated extends ApiKey {
  key: string; // full key, shown only once
}

export interface PaginatedWorkspaces {
  items: Workspace[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
