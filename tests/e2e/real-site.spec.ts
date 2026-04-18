import path from 'node:path';

import { test, expect } from '@playwright/test';

const fluencyBaseUrl = process.env.FLUENCY_BASE_URL;
const authStatePath = process.env.PLAYWRIGHT_AUTH_STATE;

test.skip(!fluencyBaseUrl || !authStatePath, 'FLUENCY_BASE_URL and PLAYWRIGHT_AUTH_STATE are required.');

test.use({
  storageState: authStatePath,
});

test('shows the calendar button on the real Fluency page', async ({ page }) => {
  await page.goto(fluencyBaseUrl!);
  await page.addScriptTag({
    path: path.resolve(process.cwd(), 'dist/content.js'),
    type: 'module',
  });

  await expect(page.locator('.fluency-calendar-button').first()).toBeVisible();
});
