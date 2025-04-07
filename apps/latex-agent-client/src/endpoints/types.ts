export type Endpoint = {
  key: string;
  name: string;
  url: string;
};

declare global {
  interface Window {
    electron: {
      endpoints: {
        add: (endpoint: Omit<Endpoint, 'key'>) => Promise<void>;
        del: (key: string) => Promise<void>;
        move: (key: string, index: number) => Promise<void>;
        get: () => Promise<Endpoint[]>;
      };
    };
  }
}
