import { ipcMain } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// 使用自定义临时目录，避免 Windows 短路径名中的特殊字符
const TEMP_DIR = path.join(os.homedir(), 'latex-agent-temp');
console.log(TEMP_DIR);

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

// 处理 MiKTeX 更新警告
const handleMiktexUpdateWarning = async (): Promise<void> => {
  try {
    // 运行 MiKTeX 更新检查命令，忽略结果
    await execAsync('mpm --update-db');
  } catch (error) {
    console.warn('MiKTeX 更新检查失败，继续执行:', error);
  }
};

// 注册 IPC 处理器
export function registerLatexHandlers(): void {
  // 处理 LaTeX 到 PDF 的转换请求
  ipcMain.handle('latex:generate-pdf', async (_, latexContent: string) => {
    try {
      // 处理 MiKTeX 更新警告
      await handleMiktexUpdateWarning();
      
      // 生成唯一的 TEX 文件名
      const texFilename = generateUniqueFilename('latex', 'tex');
      // 从 TEX 文件名派生 PDF 文件名
      const pdfFilename = texFilename.replace('.tex', '.pdf');
      
      // 创建完整的文件路径
      const texFilePath = path.join(TEMP_DIR, texFilename);
      const pdfFilePath = path.join(TEMP_DIR, pdfFilename);
      
      // 写入 LaTeX 内容到文件
      fs.writeFileSync(texFilePath, latexContent, 'utf8');
      
      // 执行 pdflatex 命令
      const { stdout, stderr } = await execAsync(
        `pdflatex -interaction=nonstopmode -output-directory "${TEMP_DIR}" "${texFilePath}"`,
        { 
          // 设置工作目录为临时目录，避免路径问题
          cwd: TEMP_DIR,
          // 忽略 MiKTeX 更新警告
          env: { ...process.env, MIKTEX_DISABLE_UPDATE_CHECK: '1' }
        }
      );
      console.log(pdfFilePath);
      
      // 检查是否成功生成 PDF
      if (!fs.existsSync(pdfFilePath)) {
        throw new Error(`PDF 生成失败: ${stderr}`);
      }
      console.log('PDF 生成成功');
      
      // 读取生成的 PDF 文件
      const pdfBuffer = fs.readFileSync(pdfFilePath);
      
      // 清理临时文件
      try {
        fs.unlinkSync(texFilePath);
        fs.unlinkSync(pdfFilePath);
        
        // 清理辅助文件
        const auxFilePath = texFilePath.replace('.tex', '.aux');
        const logFilePath = texFilePath.replace('.tex', '.log');
        const dviFilePath = texFilePath.replace('.tex', '.dvi');
        
        if (fs.existsSync(auxFilePath)) fs.unlinkSync(auxFilePath);
        if (fs.existsSync(logFilePath)) fs.unlinkSync(logFilePath);
        if (fs.existsSync(dviFilePath)) fs.unlinkSync(dviFilePath);
        console.log('清理临时文件成功');
      } catch (cleanupError) {
        console.error('清理临时文件失败:', cleanupError);
      }

      console.log('PDF 内容:', pdfBuffer);
      
      // 返回 PDF 内容作为 ArrayBuffer
      return pdfBuffer.buffer;
    } catch (error) {
      console.error('LaTeX 到 PDF 转换失败:', error);
      throw error;
    }
  });
}
