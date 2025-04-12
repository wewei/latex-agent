import { Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { userDao } from '../dao';
import { AuthRequest } from '../types/express';
/**
 * 必须登录的路由鉴权中间件
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 获取 Authorization 头
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const payload = authService.verifyToken(token);
    
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    
    // 从数据库获取用户信息
    const user = await userDao.findById(payload.userId);
    
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    
    // 将用户信息添加到请求对象
    req.user = {
      ...user,
      isAdmin: payload.isAdmin
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 可选登录的路由鉴权中间件
 * 不强制要求登录，但如果有登录信息则验证并添加到请求
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 获取 Authorization 头
    const authHeader = req.headers.authorization;
    
    // 如果没有鉴权头，直接放行
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }
    
    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const payload = authService.verifyToken(token);
    
    // 如果令牌无效，直接放行（不要求登录）
    if (!payload) {
      next();
      return;
    }
    
    // 从数据库获取用户信息
    const user = await userDao.findById(payload.userId);
    
    // 如果找到用户，将用户信息添加到请求对象
    if (user) {
      req.user = {
        ...user,
        isAdmin: payload.isAdmin
      };
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    // 可选鉴权中出错也放行
    next();
  }
};

/**
 * 仅管理员鉴权中间件
 */
export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 先执行普通用户鉴权
    await new Promise<void>((resolve, reject) => {
      requireAuth(req, res, (err?: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    // 如果 res 已经发送了响应（鉴权失败），则终止
    if (res.headersSent) {
      return;
    }
    
    // 检查是否为管理员
    if (!req.user?.isAdmin) {
      res.status(403).json({ error: 'Admin privileges required' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    // 如果 res 尚未发送响应
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};