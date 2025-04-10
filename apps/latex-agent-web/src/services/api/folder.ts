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
  isShared?: boolean;
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

// 分享权限类型
export enum SharePermission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

// 分享接口
export interface Share {
  id: string;
  folderId: string;
  userId: string;
  username: string;
  email: string;
  permission: SharePermission;
  createdAt: string;
  updatedAt: string;
}

// 创建分享参数接口
export interface CreateShareParams {
  email: string;
  permission: SharePermission;
  message?: string;
}

// 分享列表响应接口
export interface ShareListResponse {
  items: Share[];
  total: number;
}

// 分享给我的文件夹接口
export interface SharedWithMeFolder {
  id: string;
  folderId: string;
  folderName: string;
  folderPath: string;
  ownerName: string;
  ownerEmail: string;
  permission: SharePermission;
  sharedAt: string;
}

// 分享给我的文件夹列表响应接口
export interface SharedWithMeResponse {
  items: SharedWithMeFolder[];
  total: number;
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
  
  // 分享文件夹
  share: async (id: string, params: CreateShareParams): Promise<{ message: string, shareId?: string }> => {
    return apiClient.post(API_ENDPOINTS.folder.share(id), params);
  },
  
  // 获取文件夹分享列表
  getShareList: async (id: string): Promise<ShareListResponse> => {
    return apiClient.get(API_ENDPOINTS.folder.shareList(id));
  },
  
  // 移除分享
  removeShare: async (id: string, shareId: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.folder.removeShare(id, shareId));
  },
  
  // 获取分享给我的文件夹列表
  getSharedWithMe: async (params?: { 
    page?: number; 
    pageSize?: number;
  }): Promise<SharedWithMeResponse> => {
    return apiClient.get(API_ENDPOINTS.folder.sharedWithMe, { params });
  },
};

export default folderService; 