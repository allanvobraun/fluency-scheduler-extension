import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import { buildGoogleCalendarUrl, createCalendarEvent } from '@/content/calendar/google-calendar';
import { FLUENCY_LOCATION_URL } from '@/content/constants';
import type { ParsedSessionCard } from '@/content/types';

const session: ParsedSessionCard = {
  title: 'Intermediário Science',
  teacherName: 'Aline Costa',
  schedule: {
    label: '21/02 - 09h45',
    startsAt: DateTime.fromISO('2026-02-21T09:45:00', { zone: 'UTC' }),
    endsAt: DateTime.fromISO('2026-02-21T10:30:00', { zone: 'UTC' }),
    durationMinutes: 45,
  },
  source: document.body,
};

describe('google calendar url', () => {
  it('creates the expected event payload', () => {
    const event = createCalendarEvent(session);

    expect(event.title).toBe('Fluency: Intermediário Science');
    expect(event.location).toBe(FLUENCY_LOCATION_URL);
    expect(event.description).toContain('Professor(a): Aline Costa');
  });

  it('builds a calendar template url', () => {
    const url = new URL(buildGoogleCalendarUrl(createCalendarEvent(session)));

    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe('Fluency: Intermediário Science');
    expect(url.searchParams.get('dates')).toBe("20260221T094500Z/20260221T103000Z");
  });
});
