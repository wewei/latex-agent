import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth.middleware';
import workspaceUserService from '../services/workspace-user.service';

const router = express.Router();

/**
 * @route POST /latex/api/v1/workspaces/:workspaceId/users
 * @desc 添加用户到工作区
 * @access 认证用户（工作区所有者或管理员）
 */
router.post('/:workspaceId/users', requireAuth, [
  param('workspaceId').isInt().withMessage('Workspace ID must be an integer'),
  body('userId').isInt().withMessage('User ID is required'),
  body('role').optional().isIn(['owner', 'editor', 'viewer']).withMessage('Role must be one of: owner, editor, viewer')
], validate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaceId = parseInt(req.params.workspaceId, 10);
    const { userId, role = 'viewer' } = req.body;
    
    try {
      const result = await workspaceUserService.addUserToWorkspace(
        workspaceId,
        userId,
        role,
        req.user.id
      );
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'User not found') {
          return res.status(404).json({ error: 'User not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
        if (error.message === 'User is already a member of this workspace') {
          return res.status(409).json({ error: 'User is already a member of this workspace' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error adding user to workspace:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/workspaces/:workspaceId/users/:userId/role
 * @desc 更新工作区中用户的角色
 * @access 认证用户（工作区所有者或管理员）
 */
router.put('/:workspaceId/users/:userId/role', requireAuth, [
  param('workspaceId').isInt().withMessage('Workspace ID must be an integer'),
  param('userId').isInt().withMessage('User ID must be an integer'),
  body('role').isIn(['owner', 'editor', 'viewer']).withMessage('Role must be one of: owner, editor, viewer')
], validate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaceId = parseInt(req.params.workspaceId, 10);
    const userIdToUpdate = parseInt(req.params.userId, 10);
    const { role } = req.body;
    
    try {
      const result = await workspaceUserService.updateUserRole(
        workspaceId,
        userIdToUpdate,
        role,
        req.user.id
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'User is not a member of this workspace') {
          return res.status(404).json({ error: 'User is not a member of this workspace' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error updating user role:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route DELETE /latex/api/v1/workspaces/:workspaceId/users/:userId
 * @desc 从工作区移除用户
 * @access 认证用户（工作区所有者、自己或管理员）
 */
router.delete('/:workspaceId/users/:userId', requireAuth, [
  param('workspaceId').isInt().withMessage('Workspace ID must be an integer'),
  param('userId').isInt().withMessage('User ID must be an integer')
], validate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaceId = parseInt(req.params.workspaceId, 10);
    const userIdToRemove = parseInt(req.params.userId, 10);
    
    try {
      const result = await workspaceUserService.removeUserFromWorkspace(
        workspaceId,
        userIdToRemove,
        req.user.id
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'User is not a member of this workspace') {
          return res.status(404).json({ error: 'User is not a member of this workspace' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
        if (error.message === 'The workspace owner cannot be removed') {
          return res.status(403).json({ error: 'The workspace owner cannot be removed' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error removing user from workspace:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/workspaces/:workspaceId/transfer
 * @desc 转移工作区所有权
 * @access 认证用户（工作区所有者或管理员）
 */
router.put('/:workspaceId/transfer', requireAuth, [
  param('workspaceId').isInt().withMessage('Workspace ID must be an integer'),
  body('newOwnerId').isInt().withMessage('New owner ID is required')
], validate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaceId = parseInt(req.params.workspaceId, 10);
    const { newOwnerId } = req.body;
    
    try {
      const result = await workspaceUserService.transferOwnership(
        workspaceId,
        newOwnerId,
        req.user.id
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'New owner not found') {
          return res.status(404).json({ error: 'New owner not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
        if (error.message === 'New owner must be a member of the workspace') {
          return res.status(400).json({ error: 'New owner must be a member of the workspace' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error transferring ownership:', error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;