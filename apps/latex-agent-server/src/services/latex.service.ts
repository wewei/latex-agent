import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

class LaTeXService {
  private readonly TEMP_DIR = path.join(os.tmpdir(), 'latex-agent');

  constructor() {
    // 确保临时目录存在
    if (!fs.existsSync(this.TEMP_DIR)) {
      fs.mkdirSync(this.TEMP_DIR, { recursive: true });
    }
  }

  /**
   * 生成唯一文件名
   */
  private generateUniqueFilename(prefix: string, extension: string): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}.${extension}`;
  }

  /**
   * 将 LaTeX 代码转换为 PDF
   * @param latexContent LaTeX 代码内容
   * @returns PDF 文件内容作为 Buffer
   */
  async convertToPdf(latexContent: string): Promise<Buffer> {
    // 生成唯一的 TEX 文件名
    const texFilename = this.generateUniqueFilename('latex', 'tex');
    const pdfFilename = texFilename.replace('.tex', '.pdf');
    const logFilename = texFilename.replace('.tex', '.log');
    
    // 创建完整的文件路径
    const texFilePath = path.join(this.TEMP_DIR, texFilename);
    const pdfFilePath = path.join(this.TEMP_DIR, pdfFilename);
    const logFilePath = path.join(this.TEMP_DIR, logFilename);

    try {
      // 写入 LaTeX 内容到文件
      fs.writeFileSync(texFilePath, latexContent, 'utf8');
      
      // 执行 pdflatex 命令
      const { stdout, stderr } = await execAsync(
        `pdflatex -interaction=nonstopmode -output-directory "${this.TEMP_DIR}" "${texFilePath}"`,
        { 
          cwd: this.TEMP_DIR,
          env: { ...process.env, MIKTEX_DISABLE_UPDATE_CHECK: '1' }
        }
      );
      
      // 如果PDF没有生成成功，尝试分析日志文件提供更详细的错误信息
      if (!fs.existsSync(pdfFilePath)) {
        let errorMessage = 'PDF 生成失败';
        
        // 读取日志文件以提供更具体的错误
        if (fs.existsSync(logFilePath)) {
          const logContent = fs.readFileSync(logFilePath, 'utf8');
          
          // 尝试提取常见错误
          if (logContent.includes("There's no line here to end")) {
            errorMessage = `LaTeX 语法错误: 在不允许的位置使用了换行命令 (\\\\)。检查您的文档中是否在段落开始、空行或环境开始处错误地使用了换行命令。`;
          } else if (logContent.includes("Undefined control sequence")) {
            const match = logContent.match(/Undefined control sequence\.\s+[^\n]+\\([a-zA-Z0-9]+)/);
            const command = match ? match[1] : "未知命令";
            errorMessage = `LaTeX 未定义命令: \\${command}。检查命令名称是否拼写正确，或者是否缺少相关的包。`;
          } else if (logContent.includes("Missing $ inserted")) {
            errorMessage = `LaTeX 数学模式错误: 可能在普通文本中使用了数学符号，或者数学环境的开始 ($) 和结束标记不匹配。`;
          } else {
            // 尝试提取第一个错误
            const errorMatch = logContent.match(/!.*Error:(.*)/);
            if (errorMatch) {
              errorMessage = `LaTeX 错误: ${errorMatch[1].trim()}`;
            } else {
              errorMessage = `PDF 生成失败: ${stderr}`;
            }
          }
        }
        
        return Promise.reject(new Error(errorMessage));
      }
      
      // 读取生成的 PDF 文件
      const pdfBuffer = fs.readFileSync(pdfFilePath);
      
      return pdfBuffer;
    } finally {
      // 清理临时文件 (不删除日志文件以便调试)
      this.cleanupFiles(texFilePath, pdfFilePath);
    }
  }

  /**
   * 清理临时文件
   */
  private cleanupFiles(texFilePath: string, pdfFilePath: string): void {
    try {
      if (fs.existsSync(texFilePath)) fs.unlinkSync(texFilePath);
      if (fs.existsSync(pdfFilePath)) fs.unlinkSync(pdfFilePath);
      
      // 清理辅助文件
      const auxFilePath = texFilePath.replace('.tex', '.aux');
      const logFilePath = texFilePath.replace('.tex', '.log');
      
      if (fs.existsSync(auxFilePath)) fs.unlinkSync(auxFilePath);
      if (fs.existsSync(logFilePath)) fs.unlinkSync(logFilePath);
    } catch (error) {
      console.error('清理临时文件失败:', error);
    }
  }
}

export default new LaTeXService();