import { ipcRenderer } from 'electron';
import { LatexApi } from './shared';

// 定义 LaTeX API
export const latex: LatexApi = {
  // 将 LaTeX 内容转换为 PDF
  generatePdf: async (latexContent: string): Promise<ArrayBuffer> => {
    return await ipcRenderer.invoke('latex:generate-pdf', latexContent);
  }
};
