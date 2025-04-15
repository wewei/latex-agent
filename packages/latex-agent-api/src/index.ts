export type LatexApi = {
  generatePdf: (latexContent: string) => Promise<ArrayBuffer>;
};

declare global {
  interface Window {
    electron?: {
      latex?: LatexApi;
    };
  }
}

declare const window: Window;

export const makeElectronLatexApi = (): LatexApi | null => {
  if (typeof window.electron?.latex?.generatePdf === "function") {
    return window.electron.latex;
  }

  return null;
};

export const makeHttpLatexApi = (url: string): LatexApi => {
  return {
    generatePdf: async (latexContent: string): Promise<ArrayBuffer> => {

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latexContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      return response.arrayBuffer();
    }
  }
}
