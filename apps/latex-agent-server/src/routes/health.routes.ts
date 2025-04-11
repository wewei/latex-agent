import express, { Request, Response } from 'express';
const router = express.Router();

/**
 * @route GET /latex/api/v1/health
 * @desc 检查 API 健康状态
 * @access 公共
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

export default router;