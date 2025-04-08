// API 配置
export const API_CONFIG = {
  // 基础 URL，根据环境变量设置 process.env.REACT_APP_API_BASE_URL ||
  baseURL:  'http://localhost:3000/latex/api/v1/',
  
  // 请求超时时间（毫秒）
  timeout: 10000,
  
  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
};

// API 端点
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
  },
  
  // 用户相关
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
  },
  
  // 工作区相关
  workspace: {
    list: '/workspaces',
    create: '/workspaces',
    update: (id: string) => `/workspaces/${id}`,
    delete: (id: string) => `/workspaces/${id}`,
    detail: (id: string) => `/workspaces/${id}`,
  },
  
  // 文件夹相关
  folder: {
    list: '/folders',
    create: '/folders',
    update: (id: string) => `/folders/${id}`,
    delete: (id: string) => `/folders/${id}`,
    detail: (id: string) => `/folders/${id}`,
  },
  
  // 文档相关
  document: {
    list: '/documents',
    create: '/documents',
    update: (id: string) => `/documents/${id}`,
    delete: (id: string) => `/documents/${id}`,
    detail: (id: string) => `/documents/${id}`,
    upload: '/documents/upload',
    download: (id: string) => `/documents/${id}/download`,
  },
}; 