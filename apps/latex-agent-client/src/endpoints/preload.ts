import { ipcRenderer } from "electron";
import type { Endpoint } from "./types";

export const endpoints = {
  add: (endpoint: Omit<Endpoint, 'key'>) => ipcRenderer.invoke('addEndpoint', endpoint),
  get: () => ipcRenderer.invoke('getEndpoints'),
  del: (key: string) => ipcRenderer.invoke('delEndpoint', key),
  move: (key: string, index: number) => ipcRenderer.invoke('moveEndpoint', key, index),
  load: (key: string) => ipcRenderer.invoke('loadEndpoint', key),
}
