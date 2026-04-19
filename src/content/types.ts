import type { DateTime } from "luxon";

export interface SessionSchedule {
  label: string;
  startsAt: DateTime;
  endsAt: DateTime;
  durationMinutes: number;
}

export interface ParsedSessionCard {
  title: string;
  teacherName: string | null;
  schedule: SessionSchedule;
  source: HTMLElement;
}

export interface SessionCardData extends ParsedSessionCard {
  actionContainer: HTMLElement;
}

export interface CalendarEvent {
  title: string;
  description: string;
  startsAt: DateTime;
  endsAt: DateTime;
  location: string;
}

export interface BootstrapOptions {
  root?: Document | HTMLElement;
  now?: () => DateTime;
}
