import { app } from "electron";
import fs from 'node:fs';

const ENDPOINTS_FILE = 'endpoints.json';
const ENDPOINTS_PATH = app.getPath('userData') + '/' + ENDPOINTS_FILE;

let endpoints: string[] = [];

function init() {
  if (!fs.existsSync(ENDPOINTS_PATH)) {
    return;
  }

  try {
    endpoints = JSON.parse(fs.readFileSync(ENDPOINTS_PATH, 'utf8')).endpoints;
  } catch (error) {
    console.error(error);
  }
}

init();

export function addEndpoint(endpoint: string) {
  endpoints.push(endpoint);
  fs.writeFileSync(ENDPOINTS_PATH, JSON.stringify({
    endpoints,
  }));
}

export function getEndpoints() {
  return endpoints;
}

export function delEndpoint(endpoint: string) {
  if (!endpoints.includes(endpoint)) {
    return;
  }

  endpoints = endpoints.filter((e) => e !== endpoint);
  fs.writeFileSync(ENDPOINTS_PATH, JSON.stringify({
    endpoints,
  }));
}

export function moveEndpoint(endpoint: string, index: number) {
  if (!endpoints.includes(endpoint) || index < 0 || index >= endpoints.length) {
    return;
  }

  endpoints = endpoints.filter((e) => e !== endpoint);
  endpoints.splice(index, 0, endpoint);
  fs.writeFileSync(ENDPOINTS_PATH, JSON.stringify({
    endpoints,
  }));
}
