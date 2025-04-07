import { ipcRenderer } from "electron";
import type { Endpoint } from "./shared";
import { FALLBACK_ENDPOINT_ID } from "./shared";

export const endpoints = {
  add: (endpoint: Omit<Endpoint, 'key'>) => ipcRenderer.invoke('addEndpoint', endpoint),
  get: () => ipcRenderer.invoke('getEndpoints'),
  getFallback: () => ipcRenderer.invoke('getFallbackEndpoint'),
  del: (key: string) => ipcRenderer.invoke('delEndpoint', key),
  move: (key: string, index: number) => ipcRenderer.invoke('moveEndpoint', key, index),
  load: (key: string) => ipcRenderer.invoke('loadEndpoint', key),
  loadFallback: () => ipcRenderer.invoke('loadEndpoint', FALLBACK_ENDPOINT_ID),
}
