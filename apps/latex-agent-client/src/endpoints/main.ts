import { ipcMain } from "electron";
import { addEndpoint, getEndpoints, delEndpoint, moveEndpoint } from "./store";
import type { Endpoint } from "./types";

export function setupEndpointsIpc() {
  ipcMain.handle("addEndpoint", (event, endpoint: Omit<Endpoint, 'key'>) => {
    addEndpoint(endpoint);
  });

  ipcMain.handle("getEndpoints", (event) => {
    return getEndpoints();
  });

  ipcMain.handle("delEndpoint", (event, key: string) => {
    delEndpoint(key);
  });

  ipcMain.handle("moveEndpoint", (event, key: string, index: number) => {
    moveEndpoint(key, index);
  });

  ipcMain.handle("loadEndpoint", (event, key: string) => {
    const endpoint = getEndpoints().find((e) => e.key === key);
    if (!endpoint) {
      return;
    }

    event.sender.loadURL(endpoint.url);
  });
};

