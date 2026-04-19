import { DateTime } from 'luxon';

import {
  DATE_TEXT_PATTERN,
  DEFAULT_SESSION_DURATION_MINUTES,
  YEAR_ROLLOVER_GRACE_HOURS,
} from '@/content/constants';
import type { SessionSchedule } from '@/content/types';

function isWholeNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function parseSessionSchedule(
  label: string,
  now: DateTime,
): SessionSchedule | null {
  const match = label.match(DATE_TEXT_PATTERN);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const hour = Number(match[3]);
  const minute = Number(match[4]);

  if (![day, month, hour, minute].every(isWholeNumber)) {
    return null;
  }

  let startsAt = DateTime.fromObject(
    { year: now.year, month, day, hour, minute },
    { zone: now.zone },
  );

  if (!startsAt.isValid) {
    return null;
  }

  if (startsAt < now.minus({ hours: YEAR_ROLLOVER_GRACE_HOURS })) {
    startsAt = startsAt.plus({ years: 1 });
  }

  const endsAt = startsAt.plus({ minutes: DEFAULT_SESSION_DURATION_MINUTES });

  return {
    label: match[0].trim(),
    startsAt,
    endsAt,
    durationMinutes: DEFAULT_SESSION_DURATION_MINUTES,
  };
}

export function formatGoogleCalendarDate(value: DateTime): string {
  return value.toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");
}
