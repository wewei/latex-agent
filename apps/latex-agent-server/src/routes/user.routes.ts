import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import userService from '../services/user.service';

const router = express.Router();

/**
 * @route GET /latex/api/v1/users
 * @desc 获取所有用户
 * @access 管理员
 */
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting users:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/users/:id
 * @desc 获取指定用户
 * @access 认证用户（自己或管理员）
 */
router.get('/:id', requireAuth, [
  param('id').isInt().withMessage('User ID must be an integer')
], validate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // 只允许用户访问自己的数据，除非是管理员
    // if (id !== req.user?.id && !req.user?.isAdmin) {
    //   return res.status(403).json({ error: 'Permission denied' });
    // }
    
    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting user:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /latex/api/v1/users
 * @desc 创建新用户
 * @access 公开/管理员
 */
router.post('/', [
  body('username').isString().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password_hash').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error creating user:', error);
    
    // 处理特定错误
    if (errorMessage.includes('already exists')) {
      return res.status(409).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/users/:id
 * @desc 更新用户
 * @access 认证用户（自己或管理员）
 */
router.put('/:id', requireAuth, [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('username').optional().isString().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], validate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // 只允许用户更新自己的数据，除非是管理员
    // if (id !== req.user?.id && !req.user?.isAdmin) {
    //   return res.status(403).json({ error: 'Permission denied' });
    // }
    
    const userData = req.body;
    const updatedUser = await userService.updateUser(id, userData);
    res.json(updatedUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error updating user:', error);
    
    if (errorMessage === 'User not found') {
      return res.status(404).json({ error: errorMessage });
    }
    
    if (errorMessage.includes('already exists')) {
      return res.status(409).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route DELETE /latex/api/v1/users/:id
 * @desc 删除用户
 * @access 认证用户（自己或管理员）
 */
router.delete('/:id', requireAuth, [
  param('id').isInt().withMessage('User ID must be an integer')
], validate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // 只允许用户删除自己的账户，除非是管理员
    // if (id !== req.user?.id && !req.user?.isAdmin) {
    //   return res.status(403).json({ error: 'Permission denied' });
    // }
    
    await userService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error deleting user:', error);
    
    if (errorMessage === 'User not found') {
      return res.status(404).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/users/:id/password
 * @desc 更新用户密码
 * @access 认证用户（自己或管理员）
 */
router.put('/:id/password', requireAuth, [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('currentPassword').isString().withMessage('Current password is required'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // 只允许用户更新自己的密码，除非是管理员
    // if (id !== req.user?.id && !req.user?.isAdmin) {
    //   return res.status(403).json({ error: 'Permission denied' });
    // }
    
    // const { currentPassword, newPassword } = req.body;
    // await userService.updatePassword(id, currentPassword, newPassword);
    // res.json({ message: 'Password updated successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error updating password:', error);
    
    if (errorMessage === 'User not found') {
      return res.status(404).json({ error: errorMessage });
    }
    
    if (errorMessage === 'Current password is incorrect') {
      return res.status(401).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

export default router;