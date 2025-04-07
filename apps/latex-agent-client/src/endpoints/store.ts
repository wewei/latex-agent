import { app } from "electron";
import crypto from 'node:crypto';
import fs from 'node:fs';
import type { Endpoint } from './types';

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
