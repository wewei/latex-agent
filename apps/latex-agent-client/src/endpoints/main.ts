import { ipcMain, app } from "electron";
import { type Endpoint, FALLBACK_ENDPOINT_ID } from "./shared";
import fs from 'node:fs';
import crypto from 'node:crypto';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

export const FALLBACK_ENDPOINT: Endpoint = {
  key: FALLBACK_ENDPOINT_ID,
  name: 'Fallback',
  url: MAIN_WINDOW_WEBPACK_ENTRY,
};

const ENDPOINTS_FILE = 'endpoints.json';
const ENDPOINTS_PATH = app.getPath('userData') + '/' + ENDPOINTS_FILE;

let endpoints: Endpoint[] = [];

function readEndpoints() {
  if (!fs.existsSync(ENDPOINTS_PATH)) {
    return;
  }

  try {
    endpoints = JSON.parse(fs.readFileSync(ENDPOINTS_PATH, 'utf8')).endpoints;
  } catch (error) {
    console.error(error);
  }
}

function writeEndpoints() {
  fs.writeFileSync(ENDPOINTS_PATH, JSON.stringify({
    endpoints,
  }));
}

function init() {
  readEndpoints();
}

init();

export function addEndpoint(endpoint: Omit<Endpoint, 'key'>) {
  const key = crypto.randomUUID();
  endpoints.push({ ...endpoint, key });
  writeEndpoints();
}

export function getEndpoints() {
  return endpoints;
}

export function delEndpoint(key: string) {
  if (!endpoints.some((e) => e.key === key)) {
    return;
  }

  endpoints = endpoints.filter((e) => e.key !== key);
  writeEndpoints();
}

export function moveEndpoint(key: string, index: number) {
  if (index < 0 || index >= endpoints.length) {
    return;
  }

  const idx = endpoints.findIndex((e) => e.key === key);
  if (idx === -1 || idx === index) {
    return;
  }

  const [endpoint] = endpoints.splice(idx, 1);
  endpoints.splice(index, 0, endpoint);
  writeEndpoints();
}
export function setupEndpointsIpc() {
  ipcMain.handle("addEndpoint", (event, endpoint: Omit<Endpoint, 'key'>) => {
    addEndpoint(endpoint);
  });

  ipcMain.handle("getEndpoints", (event) => {
    return getEndpoints();
  });

  ipcMain.handle("getFallbackEndpoint", (event) => {
    return FALLBACK_ENDPOINT;
  });

  ipcMain.handle("delEndpoint", (event, key: string) => {
    delEndpoint(key);
  });

  ipcMain.handle("moveEndpoint", (event, key: string, index: number) => {
    moveEndpoint(key, index);
  });

  ipcMain.handle("loadEndpoint", (event, key: string) => {
    if (key === FALLBACK_ENDPOINT_ID) {
      event.sender.loadURL(FALLBACK_ENDPOINT.url);
      return;
    }

    const endpoint = getEndpoints().find((e) => e.key === key);
    if (!endpoint) {
      return;
    }

    event.sender.loadURL(endpoint.url);
  });
};

