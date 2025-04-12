import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types/express';

/**
 * 验证请求中间件
 * 检查请求参数是否符合验证规则
 */
export const validate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};