import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.open = ((url?: string | URL) => {
      (window as Window & { __openedUrl?: string }).__openedUrl = String(url ?? '');
      return null;
    }) as Window['open'];
  });
});

test('renders buttons for valid cards only', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.fluency-calendar-button')).toHaveCount(2);
  await expect(page.locator('.session-card--invalid .fluency-calendar-button')).toHaveCount(0);
});

test('adds a button for dynamically inserted cards', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Add dynamic session' }).click();

  await expect(page.locator('.fluency-calendar-button')).toHaveCount(3);
});

test('opens the expected Google Calendar link', async ({ page }) => {
  await page.goto('/');

  await page.locator('.fluency-calendar-button').first().click();

  await expect
    .poll(() => page.evaluate(() => (window as Window & { __openedUrl?: string }).__openedUrl ?? ''))
    .toContain('https://www.google.com/calendar/render');
});
