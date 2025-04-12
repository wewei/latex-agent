import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { message } from 'antd';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    
    // 如果有 token，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果响应成功，直接返回数据
    return response.data;
  },
  async (error: AxiosError) => {
    // 获取错误响应
    const response = error.response;
    
    // 处理 401 未授权错误
    if (response && response.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      
      // 显示错误消息
      message.error('登录已过期，请重新登录');
      
      // 重定向到登录页面
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // 处理其他错误
    if (response && response.data) {
      // 显示服务器返回的错误消息
      message.error((response.data as { message: string }).message || '请求失败');
    } else {
      // 显示网络错误消息
      message.error('网络错误，请稍后重试');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 