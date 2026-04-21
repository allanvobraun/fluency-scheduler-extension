import "dotenv/config";

import { test, expect } from "../fixtures/real-browser-fixtures";
import { hasFluencyLoginEnv } from "../fixtures/fluency-auth";

const fluencyBaseUrl = process.env.FLUENCY_BASE_URL?.trim();

test.skip(
  !hasFluencyLoginEnv(),
  "FLUENCY_BASE_URL, FLUENCY_USERNAME, and FLUENCY_PASSWORD are required.",
);

test("shows the calendar button on the real Fluency page", async ({ page }) => {
  await page.goto(fluencyBaseUrl!);
  await page.pause();

  await expect(page.locator(".fluency-calendar-button").first()).toBeVisible({
    timeout: 1000,
  });
});
