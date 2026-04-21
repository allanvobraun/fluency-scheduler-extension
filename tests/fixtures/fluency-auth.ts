import "dotenv/config";

import type { BrowserContext, Page } from "@playwright/test";

type FluencyAuthEnv = {
  loginUrl: string;
  username: string;
  password: string;
};

function getRequiredEnv(name: keyof NodeJS.ProcessEnv) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function hasFluencyLoginEnv() {
  return Boolean(
    process.env.FLUENCY_BASE_URL?.trim() &&
    process.env.FLUENCY_USERNAME?.trim() &&
    process.env.FLUENCY_PASSWORD?.trim(),
  );
}

export function getFluencyAuthEnv(): FluencyAuthEnv {
  return {
    loginUrl: getRequiredEnv("FLUENCY_LOGIN_URL"),
    username: getRequiredEnv("FLUENCY_USERNAME"),
    password: getRequiredEnv("FLUENCY_PASSWORD"),
  };
}

async function submitCredentials(
  page: Page,
  username: string,
  password: string,
) {
  const submitButton = page.getByRole("button", {
    name: "Entrar",
    exact: true,
  });
  const emailInput = page.getByLabel("Email", { exact: true });

  await emailInput.waitFor({ state: "visible" });
  await emailInput.fill(username);
  await submitButton.click();

  const passwordInput = page.getByLabel("Senha", { exact: true });

  await passwordInput.waitFor({ state: "visible" });
  await passwordInput.fill(password);
  await submitButton.click();
}

export async function ensureFluencySession(context: BrowserContext) {
  const { loginUrl, username, password } = getFluencyAuthEnv();
  const page = await context.newPage();

  try {
    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });

    await submitCredentials(page, username, password);
    await page.waitForLoadState("networkidle");
  } finally {
    await page.close();
  }
}
