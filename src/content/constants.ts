export const DATE_TEXT_PATTERN = /(?:[^,\d]+,\s*)?(\d{2})\/(\d{2})\s*-\s*(\d{2})h(\d{2})/i;
export const DEFAULT_SESSION_DURATION_MINUTES = 45;
export const DEFAULT_SESSION_TITLE = 'Sessão de Conversação';
export const FLUENCY_LOCATION_URL = 'https://academy.fluency.io/';
export const GOOGLE_CALENDAR_URL = 'https://www.google.com/calendar/render';
export const SESSION_BUTTON_CLASS_NAME = 'fluency-calendar-button';
export const YEAR_ROLLOVER_GRACE_HOURS = 24;

export const SESSION_ACTION_LABELS = ['Ver material', 'Cancelar sessão'] as const;
export const SESSION_TYPE_LABELS = ['Sessão individual', 'Sessão em grupo'] as const;
