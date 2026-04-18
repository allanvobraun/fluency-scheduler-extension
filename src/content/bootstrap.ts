import { DateTime } from "luxon";

import {
  buildGoogleCalendarUrl,
  createCalendarEvent,
} from "./calendar/google-calendar";
import {
  createCalendarButton,
  ensureCalendarButtonStyles,
} from "./dom/calendar-button";
import {
  findSessionActionContainers,
  findSessionCard,
  hasCalendarButton,
  parseSessionCard,
} from "./dom/session-parser";
import type { BootstrapOptions, SessionCardData } from "./types";

function getDocument(root: Document | HTMLElement): Document {
  return root instanceof Document ? root : root.ownerDocument;
}

function getObservationTarget(root: Document | HTMLElement): HTMLElement {
  return root instanceof Document ? root.body : root;
}

function openCalendarAction(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function collectSessionCards(
  root: Document | HTMLElement,
  now: DateTime,
): SessionCardData[] {
  const sessions: SessionCardData[] = [];

  for (const actionContainer of findSessionActionContainers(root)) {
    if (hasCalendarButton(actionContainer)) {
      continue;
    }

    const sessionCard = findSessionCard(actionContainer);
    if (!sessionCard) {
      continue;
    }

    const parsedSessionCard = parseSessionCard(sessionCard, now);
    if (!parsedSessionCard) {
      continue;
    }

    sessions.push({
      ...parsedSessionCard,
      actionContainer,
    });
  }

  return sessions;
}

export function enhanceCalendarButtons(options: BootstrapOptions = {}): void {
  const root = options.root ?? document;
  const doc = getDocument(root);
  const now = DateTime.local();

  ensureCalendarButtonStyles(doc);

  for (const session of collectSessionCards(root, now)) {
    const calendarButton = createCalendarButton(doc, (event) => {
      event.preventDefault();
      event.stopPropagation();

      const calendarUrl = buildGoogleCalendarUrl(createCalendarEvent(session));
      openCalendarAction(calendarUrl);
    });

    session.actionContainer.append(calendarButton);
  }
}

export function observeCalendarButtons(
  options: BootstrapOptions = {},
): MutationObserver {
  const root = options.root ?? document;
  const observer = new MutationObserver(() => {
    enhanceCalendarButtons(options);
  });

  observer.observe(getObservationTarget(root), {
    childList: true,
    subtree: true,
  });

  return observer;
}

export function bootstrapCalendarButtons(
  options: BootstrapOptions = {},
): MutationObserver {
  enhanceCalendarButtons(options);
  return observeCalendarButtons(options);
}
