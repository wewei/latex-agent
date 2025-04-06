import { ipcMain } from "electron";
import { addEndpoint, getEndpoints, delEndpoint, moveEndpoint } from "./store";

export function setupEndpointsIpc() {

  ipcMain.handle("addEndpoint", (event, endpoint: string) => {
    addEndpoint(endpoint);
  });

  ipcMain.handle("getEndpoints", (event) => {
    return getEndpoints();
  });

  ipcMain.handle("delEndpoint", (event, endpoint: string) => {
    delEndpoint(endpoint);
  });

  ipcMain.handle("moveEndpoint", (event, endpoint: string, index: number) => {
    moveEndpoint(endpoint, index);
  });
};
