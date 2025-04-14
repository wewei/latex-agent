import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import latexService from '../services/latex.service';

const router = Router();

/**
 * @route GET /latex/api/v1/latex/convert
 * @desc 将 LaTeX 代码转换为 PDF
 * @access 认证用户
 */
router.get('/convert', [
  query('code').isString().withMessage('LaTeX代码必须是字符串')
    .isLength({ min: 1, max: 10000 }).withMessage('LaTeX代码长度必须在1-10000之间')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const latexCode = req.query.code as string;
    console.log('Received LaTeX code:', latexCode);
    
    // 转换为PDF
    const pdfBuffer = await latexService.convertToPdf(latexCode);
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // 发送PDF二进制流
    res.send(pdfBuffer);
  } catch (error) {
    console.error('LaTeX 转换错误:', error);
    const errorMessage = error instanceof Error ? error.message : '转换 LaTeX 失败';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /latex/api/v1/latex/convert
 * @desc 将 LaTeX 代码转换为 PDF (适用于较长的代码)
 * @access 认证用户
 */
router.post('/convert', async (req: Request, res: Response) => {
  try {
    console.log('Received LaTeX code:', req.body);

    if (!req.body.latexContent || typeof req.body.latexContent !== 'string') {
      return res.status(400).json({ error: 'LaTeX代码必须提供且为字符串' });
    }

    const latexContent = req.body.latexContent;
    
    console.log('Received LaTeX code:', latexContent);
    // 转换为PDF
    const pdfBuffer = await latexService.convertToPdf(latexContent);
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // 发送PDF二进制流
    res.send(pdfBuffer);
  } catch (error) {
    console.error('LaTeX 转换错误:', error);
    const errorMessage = error instanceof Error ? error.message : '转换 LaTeX 失败';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;