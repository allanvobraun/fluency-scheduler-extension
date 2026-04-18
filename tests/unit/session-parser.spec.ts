import { readFileSync } from 'node:fs';
import path from 'node:path';

import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import {
  findSessionActionContainers,
  findSessionCard,
  parseSessionCard,
} from '../../src/content/dom/session-parser';

const fixturePath = path.resolve(process.cwd(), 'tests/fixtures/session-card.html');
const fixtureMarkup = readFileSync(fixturePath, 'utf8');

function setFixture(): void {
  document.body.innerHTML = fixtureMarkup;
}

describe('session parser', () => {
  it('extracts title, teacher name and schedule from a valid card', () => {
    setFixture();

    const actionContainer = findSessionActionContainers(document)[0];
    const sessionCard = actionContainer ? findSessionCard(actionContainer) : null;
    const parsedSessionCard = sessionCard
      ? parseSessionCard(sessionCard, DateTime.fromISO('2026-01-10T09:00:00', { zone: 'UTC' }))
      : null;

    expect(parsedSessionCard?.title).toBe('Intermediário Science');
    expect(parsedSessionCard?.teacherName).toBe('Aline Costa');
    expect(parsedSessionCard?.schedule.label).toBe('Sábado, 21/02 - 09h45');
  });

  it('falls back to text extraction when no teacher image is present', () => {
    setFixture();

    const actionContainer = findSessionActionContainers(document)[1];
    const sessionCard = actionContainer ? findSessionCard(actionContainer) : null;
    const parsedSessionCard = sessionCard
      ? parseSessionCard(sessionCard, DateTime.fromISO('2026-01-10T09:00:00', { zone: 'UTC' }))
      : null;

    expect(parsedSessionCard?.teacherName).toBe('Marcos Vieira');
  });

  it('returns null when the card does not contain a schedule', () => {
    setFixture();

    const actionContainer = findSessionActionContainers(document)[2];
    const sessionCard = actionContainer ? findSessionCard(actionContainer) : null;

    expect(sessionCard).toBeNull();
  });
});
