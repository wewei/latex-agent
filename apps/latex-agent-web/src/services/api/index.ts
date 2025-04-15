import authService from './auth';
import userService from './user';
import workspaceService from './workspace';
import folderService from './folder';
import documentService from './document';
import fileService from './file';
import recentVisitService from './recentVisit';
import { API_CONFIG, API_ENDPOINTS } from './config';
import apiClient from './client';
import { LoginParams, RegisterParams } from './auth';

// 导出所有服务
export {
  authService,
  userService,
  workspaceService,
  folderService,
  documentService,
  fileService,
  recentVisitService,
  API_CONFIG,
  API_ENDPOINTS,
  apiClient
};

export type {
  LoginParams,
  RegisterParams
};

// 导出默认对象
export default {
  auth: authService,
  user: userService,
  workspace: workspaceService,
  folder: folderService,
  document: documentService,
  file: fileService,
  recentVisit: recentVisitService,
  config: API_CONFIG,
  endpoints: API_ENDPOINTS,
  client: apiClient,
}; 