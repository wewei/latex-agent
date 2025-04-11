export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  visibility: 'public' | 'private' | 'team';
  owner_id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface File {
  id: number;
  name: string;
  path: string;
  parent_id?: number;
  owner_id: number;
  workspace_id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface WorkspaceUser {
  workspace_id: number;
  user_id: number;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}