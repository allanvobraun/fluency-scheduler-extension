# Fluency Extension

Browser extension for `academy.fluency.io` that adds an `Add to Google Calendar` button to Fluency session cards.

## What It Does

When the content script runs on the Fluency Academy site, it:

- finds session cards that contain actions like `Ver material` or `Cancelar sessão`
- parses the session title, teacher name, and schedule from the page
- converts the session date to a calendar event
- opens a prefilled Google Calendar event when the new button is clicked
- keeps working for dynamically loaded content through a `MutationObserver`

The project also includes a local sandbox page used for development and Playwright tests.

## Tech Stack

- TypeScript
- Vite
- Luxon
- Vitest
- Playwright
- ESLint

## Requirements

- Node.js 20+
- npm
- Chromium installed for Playwright

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local sandbox:

```bash
npm run dev
```

Build the extension:

```bash
npm run build
```

Sync the manifest version with `package.json`:

```bash
npm run version:sync
```

Run the quality checks:

```bash
npm run check
```

Run the CI-equivalent checks locally:

```bash
npm run check:ci
```

## Load the Extension in Chrome

Build first:

```bash
npm run build
```

Then load the generated `dist` folder as an unpacked extension:

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select the `dist` directory from this repo

After that, open a matching page under `https://academy.fluency.io/` and the extension should inject the calendar button into supported session cards.

## Environment Variables

The smoke test loads variables automatically from `.env`.

Start from:

```bash
cp .env.example .env
```

Available variables:

- `FLUENCY_BASE_URL`: page used by the smoke test
- `FLUENCY_LOGIN_URL`: optional login URL for the automated sign-in step; defaults to `FLUENCY_BASE_URL`
- `FLUENCY_USERNAME`: username or email used for the Fluency login flow
- `FLUENCY_PASSWORD`: password used for the Fluency login flow
- `PLAYWRIGHT_AUTH_STATE`: optional path used by `npm run auth:save` if you still want to save a Playwright session manually

## Testing

Unit tests:

```bash
npm run test
```

Sandbox end-to-end tests:

```bash
npm run test:e2e
```

CI-equivalent local checks:

```bash
npm run check:ci
```

Smoke test against the real Fluency site:

1. Configure `.env`
2. Build the extension
3. Run the smoke test

Commands:

```bash
npm run build
npm run test:smoke
```

`npm run test:smoke` launches persistent Chromium, signs into Fluency automatically with `FLUENCY_USERNAME` and `FLUENCY_PASSWORD`, and then runs the real-site assertion.

## Contributing

1. Install dependencies with `npm install`
2. Create `.env` from `.env.example` if you need the real-site smoke flow
3. Make changes in small, focused commits
4. Run `npm run check`
5. If you touched the real-site flow, also run `npm run build` and `npm run test:smoke`

## GitHub Actions

- Pull requests and pushes to `main` run the CI workflow for build, lint, Vitest, and the sandbox Playwright test.
- Merges to `main` trigger the release workflow, which increments the patch version, syncs `package.json` and `public/manifest.json`, tags the release, and uploads `fluency-extension.zip` to GitHub Releases.
- `package.json` is the version source of truth, and `public/manifest.json` is kept in sync automatically.

## Project Structure

- `src/content.ts`: content-script entrypoint
- `src/content/`: parsing, calendar, DOM, and bootstrap modules
- `src/background.ts`: extension background service worker
- `tests/unit/`: unit tests
- `tests/e2e/`: sandbox and real-site Playwright tests
- `public/manifest.json`: Chrome extension manifest

## License

MIT. See [LICENSE](LICENSE).
