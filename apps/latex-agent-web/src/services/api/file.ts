import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 文件接口
export interface File {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  workspaceId: string | null;
  documentId: string | null;
  createdAt: string;
  updatedAt: string;
  mimeType: string;
  size: number;
  isShared?: boolean;
  createdBy: string;
  updatedBy: string;
}

// 创建文件参数接口
export interface CreateFileParams {
  name: string;
  content: string;
  type: 'file' | 'folder';
  parentId?: string | null;
  workspace_id: string;
}

// 更新文件参数接口
export interface UpdateFileParams {
  name?: string;
  content?: string;
  parentId?: string | null;
}

// 文件列表响应接口
export interface FileListResponse {
  items: File[]; 
  total: number;
  page: number;
  pageSize: number;
}

// 文件内容响应接口
export interface FileContentResponse {
  content: string;
  version: number;
  updatedAt: string;
}

// 文件服务
const fileService = {
  // 获取文件列表
  getList: async (params?: { 
    page?: number; 
    pageSize?: number;
    workspaceId?: string;
    parentId?: string | null;
    searchTerm?: string;
  }): Promise<FileListResponse> => {
    return apiClient.get(API_ENDPOINTS.file.list, { params });
  },
  
  // 根据工作区ID获取文件列表
  getByWorkspace: async (workspaceId: string, params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
  }): Promise<FileListResponse> => {
    return apiClient.get(API_ENDPOINTS.file.byWorkspace(workspaceId), { params });
  },
  
  // 根据父文件夹ID获取文件列表
  getByParent: async (parentId: string, params?: {
    page?: number;
    pageSize?: number;
    workspaceId?: string;
    searchTerm?: string;
  }): Promise<FileListResponse> => {
    return apiClient.get(API_ENDPOINTS.file.byParent(parentId), { params });
  },
  
  // 创建文件
  create: async (params: CreateFileParams): Promise<File> => {
    return apiClient.post(API_ENDPOINTS.file.create, params);
  },
  
  // 更新文件
  update: async (id: string, params: UpdateFileParams): Promise<File> => {
    return apiClient.put(API_ENDPOINTS.file.update(id), params);
  },
  
  // 删除文件
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.file.delete(id));
  },
  
  // 获取文件详情
  getDetail: async (id: string): Promise<File> => {
    return apiClient.get(API_ENDPOINTS.file.detail(id));
  },
  
  // 下载文件
  download: async (id: string): Promise<Blob> => {
    return apiClient.get(API_ENDPOINTS.file.download(id), {
      responseType: 'blob'
    });
  },
  
  // 移动文件
  move: async (id: string, params: { parentId: string | null }): Promise<File> => {
    return apiClient.post(API_ENDPOINTS.file.move(id), params);
  },
  
  // 复制文件
  copy: async (id: string, params: { 
    parentId: string | null, 
    newName?: string 
  }): Promise<File> => {
    return apiClient.post(API_ENDPOINTS.file.copy(id), params);
  },
};

export default fileService;