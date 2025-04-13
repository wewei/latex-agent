export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  default_workspace_id?: number;
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
  parent_id: number | null;
  owner_id: number;
  document_id: number; // 新增字段
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  workspace_id: number;
}

export interface WorkspaceUser {
  workspace_id: number;
  user_id: number;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

export interface RecentVisit {
  id: number;
  user_id: number;
  file_id: number;
  visited_at: string;
}

/**
 * 文档内容模型
 */
export interface Document {
  id: number;
  content: string | null;
  version: number;
  hash?: string;
  created_at: string;
  updated_at: string;
}