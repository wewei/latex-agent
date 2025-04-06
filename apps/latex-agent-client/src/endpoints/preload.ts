import { ipcRenderer } from "electron";

export const endpoints = {
  add: (endpoint: string) => ipcRenderer.invoke('addEndpoint', endpoint),
  get: () => ipcRenderer.invoke('getEndpoints'),
  del: (endpoint: string) => ipcRenderer.invoke('delEndpoint', endpoint),
  move: (endpoint: string, index: number) => ipcRenderer.invoke('moveEndpoint', endpoint, index),
}
