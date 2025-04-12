import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 登录请求参数接口
export interface LoginParams {
  username: string;
  password: string;
}

// 注册请求参数接口
export interface RegisterParams {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  currentWorkspace: string;
  createdAt: string;
  updatedAt: string;
}

// 登录响应接口
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    // 其他用户信息
  };
}

// 注册响应接口
export interface RegisterResponse {
  message: string;
}

// 认证服务
const authService = {
  // 登录
  login: async (params: LoginParams): Promise<LoginResponse> => {
    return apiClient.post(API_ENDPOINTS.auth.login, params);
  },
  
  // 注册
  register: async (params: RegisterParams): Promise<RegisterResponse> => {
    return apiClient.post(API_ENDPOINTS.auth.register, params);
  },
  
  // 登出
  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.auth.logout);
  },
  
  // 刷新令牌
  refreshToken: async (): Promise<{ token: string }> => {
    return apiClient.post(API_ENDPOINTS.auth.refreshToken);
  },

  getMyProfile : async (): Promise<Profile> => {
    return apiClient.get(API_ENDPOINTS.auth.myProfile);
  }
};

export default authService; 