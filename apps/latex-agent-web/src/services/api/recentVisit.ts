import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 最近访问接口
export interface RecentVisit {
  id: number;
  user_id: number;
  file_id: number;
  visited_at: string;
  file_name?: string;
  file_path?: string;
  workspace_id?: number;
  workspace_name?: string;
}

// 最近访问列表响应接口
export interface RecentVisitListResponse {
  items: RecentVisit[];
  total: number;
}

// 最近访问服务
const recentVisitService = {
  // 记录访问
  recordVisit: async (fileId: string): Promise<RecentVisit> => {
    return apiClient.post(API_ENDPOINTS.recentVisit.record, { fileId });
  },
  
  // 获取最近访问列表
  getList: async (params?: { 
    limit?: number;
  }): Promise<RecentVisitListResponse> => {
    return apiClient.get(API_ENDPOINTS.recentVisit.list, { params });
  },

  
  // 根据工作区ID获取最近访问的文件列表
  getRecentVisitByWorkspace: async (workspaceId: string, params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<RecentVisitListResponse> => {
    return apiClient.get(API_ENDPOINTS.recentVisit.byWorkspace(workspaceId), { params });
  },
  
  // 清除所有访问记录
  clearAll: async (): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.recentVisit.clearAll);
  },
  
  // 清除特定文件的访问记录
  clearFile: async (fileId: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.recentVisit.clearFile(fileId));
  },
};

export default recentVisitService; 