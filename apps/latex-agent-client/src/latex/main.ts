import { ipcMain } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// 临时目录，用于存储 LaTeX 文件和生成的 PDF
const TEMP_DIR = path.join(os.tmpdir(), 'latex-agent');

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 生成唯一的文件名
const generateUniqueFilename = (prefix: string, extension: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}.${extension}`;
};

// 注册 IPC 处理器
export function registerLatexHandlers(): void {
  // 处理 LaTeX 到 PDF 的转换请求
  ipcMain.handle('latex:generate-pdf', async (_, latexContent: string) => {
    try {
      // 生成唯一的文件名
      const texFilename = generateUniqueFilename('latex', 'tex');
      const pdfFilename = generateUniqueFilename('latex', 'pdf');
      
      // 创建完整的文件路径
      const texFilePath = path.join(TEMP_DIR, texFilename);
      const pdfFilePath = path.join(TEMP_DIR, pdfFilename);
      
      // 写入 LaTeX 内容到文件
      fs.writeFileSync(texFilePath, latexContent, 'utf8');
      
      // 执行 pdflatex 命令
      const { stdout, stderr } = await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${TEMP_DIR}" "${texFilePath}"`);
      
      // 检查是否成功生成 PDF
      if (!fs.existsSync(pdfFilePath)) {
        throw new Error(`PDF 生成失败: ${stderr}`);
      }
      
      // 读取生成的 PDF 文件
      const pdfBuffer = fs.readFileSync(pdfFilePath);
      
      // 清理临时文件
      try {
        fs.unlinkSync(texFilePath);
        fs.unlinkSync(pdfFilePath);
        
        // 清理辅助文件
        const auxFilePath = texFilePath.replace('.tex', '.aux');
        const logFilePath = texFilePath.replace('.tex', '.log');
        
        if (fs.existsSync(auxFilePath)) fs.unlinkSync(auxFilePath);
        if (fs.existsSync(logFilePath)) fs.unlinkSync(logFilePath);
      } catch (cleanupError) {
        console.error('清理临时文件失败:', cleanupError);
      }
      
      // 返回 PDF 内容作为 ArrayBuffer
      return pdfBuffer.buffer;
    } catch (error) {
      console.error('LaTeX 到 PDF 转换失败:', error);
      throw error;
    }
  });
}
