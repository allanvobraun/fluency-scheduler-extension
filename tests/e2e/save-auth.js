import 'dotenv/config';

import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import readline from 'node:readline/promises';
import process, { stdin as input, stdout as output } from 'node:process';

import { chromium } from '@playwright/test';

const defaultAuthStatePath = resolve(process.cwd(), 'playwright/.auth/fluency.json');

function getRequiredBaseUrl() {
  const value = process.env.FLUENCY_BASE_URL?.trim();
  if (!value) {
    throw new Error('FLUENCY_BASE_URL is required.');
  }

  return value;
}

function getLoginUrl(baseUrl) {
  return process.env.FLUENCY_LOGIN_URL?.trim() || baseUrl;
}

function getAuthStatePath() {
  return resolve(process.cwd(), process.env.PLAYWRIGHT_AUTH_STATE?.trim() || defaultAuthStatePath);
}

async function ensureParentDirectory(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function waitForConfirmation() {
  if (!input.isTTY || !output.isTTY) {
    throw new Error('The auth helper requires an interactive terminal.');
  }

  const terminal = readline.createInterface({ input, output });

  try {
    await terminal.question('Finish logging in, then press Enter here to save the session. ');
  } finally {
    terminal.close();
  }
}

async function saveAuthState() {
  const baseUrl = getRequiredBaseUrl();
  const loginUrl = getLoginUrl(baseUrl);
  const authStatePath = getAuthStatePath();

  await ensureParentDirectory(authStatePath);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  globalThis.console.log(`Opening ${loginUrl}`);
  globalThis.console.log(`Will save auth state to ${authStatePath}`);

  try {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    await waitForConfirmation();
    await context.storageState({ path: authStatePath });
  } finally {
    await browser.close();
  }

  globalThis.console.log(`Saved auth state to ${authStatePath}`);
  globalThis.console.log(
    `Run the smoke test with FLUENCY_BASE_URL="${baseUrl}" PLAYWRIGHT_AUTH_STATE="${authStatePath}" npm run test:e2e:real`,
  );
}

saveAuthState().catch(function handleError(error) {
  const message = error instanceof Error ? error.message : String(error);
  globalThis.console.error(message);
  process.exitCode = 1;
});
