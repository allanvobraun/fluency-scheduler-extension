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

Run the quality checks:

```bash
npm run check
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

The smoke-test flow and auth helper load variables automatically from `.env`.

Start from:

```bash
cp .env.example .env
```

Available variables:

- `FLUENCY_BASE_URL`: page used by the smoke test
- `FLUENCY_LOGIN_URL`: optional login URL used by the auth helper; defaults to `FLUENCY_BASE_URL`
- `PLAYWRIGHT_AUTH_STATE`: path where Playwright stores the authenticated session

## Testing

Unit tests:

```bash
npm run test
```

Sandbox end-to-end tests:

```bash
npm run test:e2e
```

Smoke test against the real Fluency site:

1. Configure `.env`
2. Save an authenticated Playwright session
3. Build the extension
4. Run the smoke test

Commands:

```bash
npm run auth:save
npm run build
npm run test:smoke
```

`npm run auth:save` opens a headed browser, waits for you to log in manually, and saves the authenticated session to `PLAYWRIGHT_AUTH_STATE`.

## Contributing

1. Install dependencies with `npm install`
2. Create `.env` from `.env.example` if you need the real-site smoke flow
3. Make changes in small, focused commits
4. Run `npm run check`
5. If you touched the real-site flow, also run `npm run auth:save`, `npm run build`, and `npm run test:smoke`

## Project Structure

- `src/content.ts`: content-script entrypoint
- `src/content/`: parsing, calendar, DOM, and bootstrap modules
- `src/background.ts`: extension background service worker
- `tests/unit/`: unit tests
- `tests/e2e/`: sandbox and real-site Playwright tests
- `public/manifest.json`: Chrome extension manifest

## License

MIT. See [LICENSE](LICENSE).
