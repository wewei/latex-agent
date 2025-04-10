import apiClient from './client';
import { API_ENDPOINTS } from './config';

// 用户信息接口
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 更新用户信息参数接口
export interface UpdateProfileParams {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// 修改密码参数接口
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 用户服务
const userService = {
  // 获取用户信息
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get(API_ENDPOINTS.user.profile);
  },
  
  // 更新用户信息
  updateProfile: async (params: UpdateProfileParams): Promise<UserProfile> => {
    return apiClient.put(API_ENDPOINTS.user.updateProfile, params);
  },
  
  // 修改密码
  changePassword: async (params: ChangePasswordParams): Promise<{ message: string }> => {
    return apiClient.post(API_ENDPOINTS.user.changePassword, params);
  },
};

export default userService; 