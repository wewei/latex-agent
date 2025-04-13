import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 文档接口
export interface Document {
  id: string;
  content: string;
  version?: number;
  createdAt: string;
  updatedAt: string;
  fileId?: string | null;
}

// 创建文档参数接口
export interface CreateDocumentParams {
  content?: string;
  fileId?: string | null;
  name?: string;
  workspaceId?: string;
}

// 更新文档参数接口
export interface UpdateDocumentParams {
  content: string;
}

// 文档列表响应接口
export interface DocumentListResponse {
  items: Document[];
  total: number;
  page: number;
  pageSize: number;
}

// 文档服务
const documentService = {
  // 获取文档列表
  getList: async (params?: { 
    page?: number; 
    pageSize?: number;
    workspaceId?: string;
    folderId?: string | null;
  }): Promise<DocumentListResponse> => {
    return apiClient.get(API_ENDPOINTS.document.list, { params });
  },
  
  // 创建文档
  create: async (params: CreateDocumentParams): Promise<Document> => {
    return apiClient.post(API_ENDPOINTS.document.create, params);
  },
  
  // 更新文档
  update: async (id: string, params: UpdateDocumentParams): Promise<Document> => {
    return apiClient.put(API_ENDPOINTS.document.update(id), params);
  },
  
  // 删除文档
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(API_ENDPOINTS.document.delete(id));
  },
  
  // 获取文档详情
  getDetail: async (id: string): Promise<Document> => {
    return apiClient.get(API_ENDPOINTS.document.detail(id));
  },
  
  // 获取文档内容
  getContent: async (id: string): Promise<{ content: string; version: number }> => {
    return apiClient.get(API_ENDPOINTS.document.content(id));
  },
  
  // 搜索文档内容
  search: async (params: { 
    searchTerm: string; 
    workspaceId?: string 
  }): Promise<DocumentListResponse> => {
    return apiClient.get(API_ENDPOINTS.document.search, { params });
  },
  
  // 上传文档
  upload: async (file: File, params: { folderId?: string | null; workspaceId: string }): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', params.folderId || '');
    formData.append('workspaceId', params.workspaceId);
    
    return apiClient.post(API_ENDPOINTS.document.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 下载文档
  download: async (id: string): Promise<Blob> => {
    return apiClient.get(API_ENDPOINTS.document.download(id), {
      responseType: 'blob',
    });
  },
  };

export default documentService;