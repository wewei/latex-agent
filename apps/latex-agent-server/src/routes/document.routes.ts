import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import documentService from '../services/document.service';
import { AuthRequest } from '../types/express';

const router = Router();

/**
 * @route POST /latex/api/v1/documents
 * @desc 创建新文档
 * @access 认证用户
 */
router.post('/', [
  body('content').optional().isString().withMessage('内容必须是字符串'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const document = await documentService.createDocument(content);
    
    res.status(201).json(document);
  } catch (error) {
    console.error('创建文档错误:', error);
    const errorMessage = error instanceof Error ? error.message : '创建文档失败';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/documents/:id
 * @desc 获取文档详情
 * @access 认证用户
 */
router.get('/:id', [
  param('id').isInt().withMessage('文档ID必须是整数')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const documentId = parseInt(req.params.id);
    const document = await documentService.getDocument(documentId);
    
    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('获取文档错误:', error);
    const errorMessage = error instanceof Error ? error.message : '获取文档失败';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/documents/:id/content
 * @desc 获取文档内容
 * @access 认证用户
 */
router.get('/:id/content', [
  param('id').isInt().withMessage('文档ID必须是整数')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const documentId = parseInt(req.params.id)
    const document = await documentService.getDocument(documentId, req.user.id);
    
    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }
    
    // 只返回内容和版本信息
    res.json({
      content: document.content,
      version: document.version
    });
  } catch (error) {
    console.error('获取文档内容错误:', error);
    const errorMessage = error instanceof Error ? error.message : '获取文档内容失败';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route PUT /latex/api/v1/documents/:id
 * @desc 更新文档内容
 * @access 认证用户
 */
router.put('/:id', [
  param('id').isInt().withMessage('文档ID必须是整数'),
  body('content').isString().withMessage('内容必须是字符串')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const documentId = parseInt(req.params.id);
    const { content } = req.body;
    
    const document = await documentService.updateDocument(documentId, content);
    res.json(document);
  } catch (error) {
    console.error('更新文档错误:', error);
    const errorMessage = error instanceof Error ? error.message : '更新文档失败';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route DELETE /latex/api/v1/documents/:id
 * @desc 删除文档
 * @access 认证用户
 */
router.delete('/:id', [
  param('id').isInt().withMessage('文档ID必须是整数')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const documentId = parseInt(req.params.id);
    
    const success = await documentService.deleteDocument(documentId);
    if (success) {
      res.json({ message: '文档已成功删除' });
    } else {
      res.status(404).json({ error: '文档不存在或删除失败' });
    }
  } catch (error) {
    console.error('删除文档错误:', error);
    const errorMessage = error instanceof Error ? error.message : '删除文档失败';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /latex/api/v1/documents/search
 * @desc 搜索文档内容
 * @access 认证用户
 */
router.get('/search', [
  query('term').isString().withMessage('搜索词必须是字符串'),
  query('workspaceId').optional().isInt().withMessage('工作区ID必须是整数')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const searchTerm = req.query.term as string;
    const workspaceId = req.query.workspaceId ? parseInt(req.query.workspaceId as string) : undefined;
    
    const results = await documentService.searchDocuments(searchTerm, workspaceId);
    res.json({ items: results, total: results.length });
  } catch (error) {
    console.error('搜索文档错误:', error);
    const errorMessage = error instanceof Error ? error.message : '搜索文档失败';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;