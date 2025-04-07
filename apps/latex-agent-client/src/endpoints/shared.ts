export type Endpoint = {
  key: string;
  name: string;
  url: string;
};

export const FALLBACK_ENDPOINT_ID = '@FALLBACK';

declare global {
  interface Window {
    electron: {
      endpoints: {
        add: (endpoint: Omit<Endpoint, 'key'>) => Promise<void>;
        del: (key: string) => Promise<void>;
        move: (key: string, index: number) => Promise<void>;
        get: () => Promise<Endpoint[]>;
        getFallback: () => Promise<Endpoint>;
        load: (key: string) => Promise<void>;
        loadFallback: () => Promise<void>;
      };
    };
  }
}
