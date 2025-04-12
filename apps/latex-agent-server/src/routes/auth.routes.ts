import express, { Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth.middleware';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import { AuthRequest } from '../types/express';

const router = express.Router();

/**
 * @route POST /latex/api/v1/auth/login
 * @desc 用户登录
 * @access 公开
 */
router.post('/login', [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().withMessage('Password is required')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const result = await authService.login(username, password);
    
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Login error:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /latex/api/v1/auth/register
 * @desc 用户注册
 * @access 公开
 */
router.post('/register', [
  body('username').isString().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    try {
      // 创建用户
      const newUser = await userService.createUser({
        username,
        email,
        password_hash: password,
        is_admin: false,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
      });
      
      // 生成令牌
      const token = authService.generateToken(newUser.id, newUser.username, newUser.is_admin);
      
      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.is_admin
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({ error: error.message });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Registration error:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/auth/me
 * @desc 获取当前用户信息
 * @access 认证用户
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // 如果用户已通过认证，req.user 应该存在
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // 返回用户信息（排除敏感字段）
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      default_workspace_id: req.user.default_workspace_id,
      isAdmin: req.user.is_admin
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Get user error:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /latex/api/v1/auth/logout
 * @desc 用户登出
 * @access 认证用户
 */
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // 获取用户ID
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // 调用认证服务执行登出逻辑
    await authService.logout(userId);
    
    res.json({ 
      success: true,
      message: 'Successfully logged out' 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Logout error:', error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;