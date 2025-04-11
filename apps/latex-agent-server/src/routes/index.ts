import express from 'express';
import userRoutes from './user.routes';
import workspaceRoutes from './workspace.routes';
import fileRoutes from './file.routes';
import workspaceUserRoutes from './workspace-user.routes';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// 注册路由模块
router.use('/users', userRoutes);
// 认证路由
router.use('/auth', authRoutes);
router.use('/workspaces', requireAuth, workspaceRoutes);
router.use('/file', requireAuth, fileRoutes);  // 文件路由包含多个基础路径
router.use('/workspaces', requireAuth, workspaceUserRoutes);  // 工作区用户路由在工作区路由下
router.use('/health', healthRoutes);

// API 根端点
router.get('/', (_req, res) => {
  res.json({
    message: 'LaTeX Agent API v1',
    endpoints: [
      '/users',
      '/workspaces',
      '/files',
      '/health'
    ]
  });
});

export default router;