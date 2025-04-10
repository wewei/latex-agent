import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 工作区接口
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// 创建工作区参数接口
export interface CreateWorkspaceParams {
  name: string;
  description?: string;
}

// 更新工作区参数接口
export interface UpdateWorkspaceParams {
  name?: string;
  description?: string;
}

// 工作区列表响应接口
export interface WorkspaceListResponse {
  items: Workspace[];
  total: number;
  page: number;
  pageSize: number;
}

// 工作区服务
const workspaceService = {
  // 获取工作区列表
  getList: async (params?: { page?: number; pageSize?: number }): Promise<WorkspaceListResponse> => {
    return apiClient.get(API_ENDPOINTS.workspace.list, { params });
  },
  
  // 创建工作区
  create: async (params: CreateWorkspaceParams): Promise<Workspace> => {
    return apiClient.post(API_ENDPOINTS.workspace.create, params);
  },
  
  // 更新工作区
  update: async (id: string, params: UpdateWorkspaceParams): Promise<Workspace> => {
    return apiClient.put(API_ENDPOINTS.workspace.update(id), params);
  },
  
  // 删除工作区
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.workspace.delete(id));
  },
  
  // 获取工作区详情
  getDetail: async (id: string): Promise<Workspace> => {
    return apiClient.get(API_ENDPOINTS.workspace.detail(id));
  },
};

export default workspaceService; 