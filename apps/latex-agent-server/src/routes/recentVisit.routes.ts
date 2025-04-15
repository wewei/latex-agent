import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import recentVisitService from '../services/recentVisit.service';
import { AuthRequest } from '../types/express';

const router = Router();

// /**
//  * @route POST /latex/api/v1/recent-visits
//  * @desc 记录用户访问文件
//  * @access 认证用户
//  */
// router.post('/', [
//   body('fileId').isInt().withMessage('文件ID必须是整数'),
// ], async (req: AuthRequest, res: Response) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ error: '未授权' });
//     }

//     const { fileId } = req.body;
//     const visit = await recentVisitService.recordVisit(userId, fileId);
    
//     res.status(201).json(visit);
//   } catch (error) {
//     console.error('记录访问错误:', error);
//     const errorMessage = error instanceof Error ? error.message : '记录访问失败';
//     res.status(500).json({ error: errorMessage });
//   }
// });

/**
 * @route GET /latex/api/v1/recent-visits
 * @desc 获取用户最近访问的文件
 * @access 认证用户
 */
router.get('/', [
  query('limit').optional().isInt().withMessage('限制数量必须是整数')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    if(!req.user){
        return res.status(401).json({ error: '未授权' });
    } ; 
    const userId = req.user.id;

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const visits = await recentVisitService.getUserRecentVisits(userId, req.user.default_workspace_id, limit);
    
    res.json({ items: visits, total: visits.length });
  } catch (error) {
    console.error('获取最近访问错误:', error);
    const errorMessage = error instanceof Error ? error.message : '获取最近访问失败';
    res.status(500).json({ error: errorMessage });
  }
});

// /**
//  * @route DELETE /latex/api/v1/recent-visits
//  * @desc 清除用户的访问记录
//  * @access 认证用户
//  */
// router.delete('/', async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ error: '未授权' });
//     }

//     const success = await recentVisitService.clearUserVisits(userId);
//     if (success) {
//       res.json({ message: '访问记录已成功清除' });
//     } else {
//       res.status(404).json({ error: '清除访问记录失败' });
//     }
//   } catch (error) {
//     console.error('清除访问记录错误:', error);
//     const errorMessage = error instanceof Error ? error.message : '清除访问记录失败';
//     res.status(500).json({ error: errorMessage });
//   }
// });

// /**
//  * @route DELETE /latex/api/v1/recent-visits/file/:fileId
//  * @desc 清除特定文件的访问记录
//  * @access 认证用户
//  */
// router.delete('/file/:fileId', [
//   param('fileId').isInt().withMessage('文件ID必须是整数')
// ], async (req: AuthRequest, res: Response) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const fileId = parseInt(req.params.fileId);
//     const success = await recentVisitService.clearFileVisits(fileId);
    
//     if (success) {
//       res.json({ message: '文件访问记录已成功清除' });
//     } else {
//       res.status(404).json({ error: '清除文件访问记录失败' });
//     }
//   } catch (error) {
//     console.error('清除文件访问记录错误:', error);
//     const errorMessage = error instanceof Error ? error.message : '清除文件访问记录失败';
//     res.status(500).json({ error: errorMessage });
//   }
// });

export default router; 