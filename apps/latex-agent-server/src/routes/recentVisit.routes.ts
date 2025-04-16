import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import recentVisitService from '../services/recentVisit.service';
import { AuthRequest } from '../types/express';
import { ParamsOptions } from 'latex-agent-dao/dist/dao/BaseDao';
import { transferParamOption } from './common';

const router = Router();


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
    const options = transferParamOption(req);
    const visits = await recentVisitService.getUserRecentVisits(userId, req.user.default_workspace_id, options);    
    res.json(visits);
  } catch (error) {
    console.error('获取最近访问错误:', error);
    const errorMessage = error instanceof Error ? error.message : '获取最近访问失败';
    res.status(500).json({ error: errorMessage });
  }
});


export default router; 