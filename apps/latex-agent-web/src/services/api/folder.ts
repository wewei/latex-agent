import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 文件夹接口
export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
}

// 创建文件夹参数接口
export interface CreateFolderParams {
  name: string;
  parentId?: string | null;
  workspaceId: string;
}

// 更新文件夹参数接口
export interface UpdateFolderParams {
  name?: string;
  parentId?: string | null;
}

// 文件夹列表响应接口
export interface FolderListResponse {
  items: Folder[];
  total: number;
  page: number;
  pageSize: number;
}

// 文件夹服务
const folderService = {
  // 获取文件夹列表
  getList: async (params?: { 
    page?: number; 
    pageSize?: number;
    workspaceId?: string;
    parentId?: string | null;
  }): Promise<FolderListResponse> => {
    return apiClient.get(API_ENDPOINTS.folder.list, { params });
  },
  
  // 创建文件夹
  create: async (params: CreateFolderParams): Promise<Folder> => {
    return apiClient.post(API_ENDPOINTS.folder.create, params);
  },
  
  // 更新文件夹
  update: async (id: string, params: UpdateFolderParams): Promise<Folder> => {
    return apiClient.put(API_ENDPOINTS.folder.update(id), params);
  },
  
  // 删除文件夹
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.folder.delete(id));
  },
  
  // 获取文件夹详情
  getDetail: async (id: string): Promise<Folder> => {
    return apiClient.get(API_ENDPOINTS.folder.detail(id));
  },
};

export default folderService; 