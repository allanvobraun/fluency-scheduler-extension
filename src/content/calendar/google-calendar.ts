import {
  FLUENCY_LOCATION_URL,
  GOOGLE_CALENDAR_URL,
} from '@/content/constants';
import { formatGoogleCalendarDate } from '@/content/calendar/date';
import type { CalendarEvent, ParsedSessionCard } from '@/content/types';

export function createCalendarEvent(session: ParsedSessionCard): CalendarEvent {
  const descriptionLines = ['Sessão de conversação na Fluency Academy'];

  if (session.teacherName) {
    descriptionLines.push(`Professor(a): ${session.teacherName}`);
  }

  descriptionLines.push(`Link: ${FLUENCY_LOCATION_URL}`);

  return {
    title: `Fluency: ${session.title}`,
    description: descriptionLines.join('\n'),
    startsAt: session.schedule.startsAt,
    endsAt: session.schedule.endsAt,
    location: FLUENCY_LOCATION_URL,
  };
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const url = new URL(GOOGLE_CALENDAR_URL);

  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title);
  url.searchParams.set(
    'dates',
    `${formatGoogleCalendarDate(event.startsAt)}/${formatGoogleCalendarDate(event.endsAt)}`,
  );
  url.searchParams.set('details', event.description);
  url.searchParams.set('location', event.location);

  return url.toString();
}
