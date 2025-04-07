/**
 * LaTeX 相关的接口声明
 */

// 定义 LaTeX API 接口
export type LatexApi = {
  /**
   * 将 LaTeX 内容转换为 PDF
   * @param latexContent LaTeX 内容
   * @returns PDF 内容的 ArrayBuffer
   */
  generatePdf: (latexContent: string) => Promise<ArrayBuffer>;
} 