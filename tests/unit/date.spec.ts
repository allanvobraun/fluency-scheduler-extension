import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import { DEFAULT_SESSION_DURATION_MINUTES } from '../../src/content/constants';
import { parseSessionSchedule } from '../../src/content/calendar/date';

describe('parseSessionSchedule', () => {
  it('parses a valid Fluency schedule label', () => {
    const now = DateTime.fromISO('2026-02-01T10:00:00', { zone: 'UTC' });
    const schedule = parseSessionSchedule('Sábado, 21/02 - 09h45', now);

    expect(schedule).not.toBeNull();
    expect(schedule?.startsAt.toISO()).toBe('2026-02-21T09:45:00.000Z');
    expect(schedule?.durationMinutes).toBe(DEFAULT_SESSION_DURATION_MINUTES);
  });

  it('returns null for invalid labels', () => {
    const now = DateTime.fromISO('2026-02-01T10:00:00', { zone: 'UTC' });

    expect(parseSessionSchedule('sem data', now)).toBeNull();
  });

  it('rolls sessions into the next year when they are older than the grace window', () => {
    const now = DateTime.fromISO('2026-12-31T12:00:00', { zone: 'UTC' });
    const schedule = parseSessionSchedule('01/01 - 09h45', now);

    expect(schedule?.startsAt.year).toBe(2027);
    expect(schedule?.startsAt.month).toBe(1);
    expect(schedule?.startsAt.day).toBe(1);
  });

  it('uses the default 45 minute duration', () => {
    const now = DateTime.fromISO('2026-02-01T10:00:00', { zone: 'UTC' });
    const schedule = parseSessionSchedule('21/02 - 09h45', now);

    expect(schedule?.endsAt.diff(schedule.startsAt, 'minutes').minutes).toBe(
      DEFAULT_SESSION_DURATION_MINUTES,
    );
  });
});
