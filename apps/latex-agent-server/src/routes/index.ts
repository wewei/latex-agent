import express from 'express';
import userRoutes from './user.routes';
import workspaceRoutes from './workspace.routes';
import fileRoutes from './file.routes';
import documentRoutes from './document.routes'; // 新增
import workspaceUserRoutes from './workspace-user.routes';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// 注册路由模块
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/workspaces', requireAuth, workspaceRoutes);
router.use('/files', requireAuth, fileRoutes);
router.use('/documents', requireAuth, documentRoutes); // 新增
router.use('/workspaces', requireAuth, workspaceUserRoutes);
router.use('/health', healthRoutes);

// API 根端点
router.get('/', (_req, res) => {
  res.json({
    message: 'LaTeX Agent API v1',
    endpoints: [
      '/users',
      '/workspaces',
      '/files',
      '/documents', // 更新端点列表
      '/health'
    ]
  });
});

export default router;