import express, { Response } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { User } from 'latex-agent-dao';
import workspaceService from '../services/workspace.service';
import fileService from '../services/file.service';
import { AuthRequest } from '../types/express';
import { it } from 'node:test';

const router = express.Router();


const getUser = (req : any) : User | undefined => {
  return req.user;
}

/**
 * @route GET /latex/api/v1/workspaces
 * @desc 获取用户的所有工作区
 * @access 认证用户
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = getUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaces = await workspaceService.getUserWorkspaces(req.user.id);
    res.json(workspaces);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting workspaces:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/workspaces/:id
 * @desc 获取指定工作区
 * @access 认证用户（拥有访问权限）
 */
router.get('/:id', [
  param('id').isInt().withMessage('Workspace ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    
    try {
      const workspace = await workspaceService.getWorkspaceById(id, req.user.id);
      res.json(workspace);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting workspace:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /latex/api/v1/workspaces
 * @desc 创建新工作区
 * @access 认证用户
 */
router.post('/', [
  body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Workspace name is required (1-100 characters)'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('visibility').optional().isIn(['public', 'private', 'team']).withMessage('Visibility must be one of: public, private, team')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { name, description, visibility } = req.body;
    const newWorkspace = await workspaceService.createWorkspace(
      { name, description, visibility },
      req.user.id
    );
    
    res.status(201).json(newWorkspace);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error creating workspace:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/workspaces/:id
 * @desc 更新工作区
 * @access 认证用户（工作区所有者或管理员）
 */
router.put('/:id', [
  param('id').isInt().withMessage('Workspace ID must be an integer'),
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Workspace name must be 1-100 characters'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('visibility').optional().isIn(['public', 'private', 'team']).withMessage('Visibility must be one of: public, private, team')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    const { name, description, visibility } = req.body;
    
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(
        id,
        { name, description, visibility },
        req.user.id
      );
      
      res.json(updatedWorkspace);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error updating workspace:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route DELETE /latex/api/v1/workspaces/:id
 * @desc 删除工作区
 * @access 认证用户（工作区所有者或管理员）
 */
router.delete('/:id', [
  param('id').isInt().withMessage('Workspace ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    
    try {
      await workspaceService.deleteWorkspace(id, req.user.id);
      res.json({ message: 'Workspace deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error deleting workspace:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/workspaces/:id/members
 * @desc 获取工作区成员
 * @access 认证用户（拥有访问权限）
 */
router.get('/:id/members', [
  param('id').isInt().withMessage('Workspace ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    
    try {
      const members = await workspaceService.getWorkspaceMembers(id, req.user.id);
      res.json(members);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Workspace not found') {
          return res.status(404).json({ error: 'Workspace not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting workspace members:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/workspaces/:workspaceId/files
 * @desc 获取工作区下的所有文件
 * @access 认证用户（拥有访问权限）
 */
router.get('/:workspaceId/files', [
  param('workspaceId').isInt().withMessage('Workspace ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaceId = parseInt(req.params.workspaceId, 10);
    
    try {
      const files = await fileService.getFilesByWorkspace(workspaceId, req.user.id);
      res.json({
        items: files,
        total: files.length
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting files:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/workspaces/:workspaceId/folders/:parentId?
 * @desc 获取目录下的文件
 * @access 认证用户（拥有访问权限）
 */
router.get('/:workspaceId/folders/:parentId?', [
  param('workspaceId').isInt().withMessage('Workspace ID must be an integer'),
  param('parentId').optional().isInt().withMessage('Parent ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const workspaceId = parseInt(req.params.workspaceId, 10);
    const parentId = req.params.parentId ? parseInt(req.params.parentId, 10) : null;
    
    try {
      const files = await fileService.getFilesByParent(workspaceId, parentId, req.user.id);
      res.json(files);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting files:', error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;