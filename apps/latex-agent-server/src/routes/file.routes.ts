import express, { Response } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import fileService from '../services/file.service';
import { AuthRequest } from '../types/express';
const router = express.Router();

/**
 * @route GET /latex/api/v1/files/:id
 * @desc 获取指定文件
 * @access 认证用户（拥有访问权限）
 */
router.get('/:id', [
  param('id').isInt().withMessage('File ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    
    try {
      const file = await fileService.getFileById(id, req.user.id);
      res.json(file);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'File not found') {
          return res.status(404).json({ error: 'File not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error getting file:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /latex/api/v1/files
 * @desc 创建新文件
 * @access 认证用户（拥有访问权限）
 */
router.post('/', [
  body('name').isString().trim().isLength({ min: 1 }).withMessage('File name is required'),
  body('type').isString().isIn(['file', 'folder']).withMessage('Type must be either file or folder'),
  body('content').optional().isString().withMessage('Content must be a string'),
  body('parent_id').optional().isInt().withMessage('Parent ID must be an integer'),
  body('workspace_id').isInt().withMessage('Workspace ID is required')
], validate, async (req: AuthRequest, res: Response) => {
  console.log('Creating file with data:', req.body);
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const fileData = {
      ...req.body,
      owner_id: req.user.id,
    };;
    
    try {
      const newFile = await fileService.createFileWithDocument(fileData);
      res.status(201).json(newFile);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
        if (error.message === 'A file with this path already exists') {
          return res.status(409).json({ error: 'A file with this path already exists' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error creating file:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/files/:id
 * @desc 更新文件
 * @access 认证用户（拥有访问权限）
 */
router.put('/:id', [
  param('id').isInt().withMessage('File ID must be an integer'),
  body('name').optional().isString().trim().isLength({ min: 1 }).withMessage('File name is required'),
  body('content').optional().isString().withMessage('Content must be a string')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    const fileData = req.body;
    
    try {
      const updatedFile = await fileService.updateFile(id, fileData, req.user.id);
      res.json(updatedFile);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'File not found') {
          return res.status(404).json({ error: 'File not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error updating file:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route DELETE /latex/api/v1/files/:id
 * @desc 删除文件
 * @access 认证用户（拥有访问权限）
 */
router.delete('/:id', [
  param('id').isInt().withMessage('File ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    
    try {
      await fileService.deleteFile(id, req.user.id);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'File not found') {
          return res.status(404).json({ error: 'File not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error deleting file:', error);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/files/:id/move
 * @desc 移动文件
 * @access 认证用户（拥有访问权限）
 */
router.put('/:id/move', [
  param('id').isInt().withMessage('File ID must be an integer'),
  body('parent_id').optional().isInt().withMessage('Parent ID must be an integer')
], validate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const id = parseInt(req.params.id, 10);
    const { parent_id } = req.body;
    
    try {
      const movedFile = await fileService.moveFile(id, parent_id, req.user.id);
      res.json(movedFile);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'File not found') {
          return res.status(404).json({ error: 'File not found' });
        }
        if (error.message === 'Permission denied') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error moving file:', error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;