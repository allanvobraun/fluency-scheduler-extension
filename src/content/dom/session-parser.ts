import type { DateTime } from "luxon";

import {
  DATE_TEXT_PATTERN,
  DEFAULT_SESSION_TITLE,
  SESSION_ACTION_LABELS,
  SESSION_BUTTON_CLASS_NAME,
  SESSION_TYPE_LABELS,
} from "@/content/constants";
import { parseSessionSchedule } from "@/content/calendar/date";
import type { ParsedSessionCard } from "@/content/types";

const TEXT_NODE_SELECTOR = "p, span, div, h1, h2, h3, h4, h5, h6, strong";

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function includesAnyLabel(value: string, labels: readonly string[]): boolean {
  return labels.some(function includesLabel(label) {
    return value.includes(label);
  });
}

function getTextElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TEXT_NODE_SELECTOR));
}

function findNextTextSibling(element: Element): string | null {
  let sibling = element.nextElementSibling;

  while (sibling) {
    const text = normalizeText(sibling.textContent);
    if (text) {
      return text;
    }

    sibling = sibling.nextElementSibling;
  }

  return null;
}

function findHeadingText(root: HTMLElement): string | null {
  return (
    normalizeText(root.querySelector("h1, h2, h3, h4, h5, h6")?.textContent) ||
    null
  );
}

function findDateLabel(root: HTMLElement): string | null {
  return root.textContent?.match(DATE_TEXT_PATTERN)?.[0] ?? null;
}

function isTeacherCandidate(text: string, title: string): boolean {
  if (!text || text === title) {
    return false;
  }

  if (
    includesAnyLabel(text, SESSION_ACTION_LABELS) ||
    includesAnyLabel(text, SESSION_TYPE_LABELS)
  ) {
    return false;
  }

  if (DATE_TEXT_PATTERN.test(text)) {
    return false;
  }

  return text.length >= 4 && text.length <= 40;
}

function extractTitle(root: HTMLElement): string {
  const textElements = getTextElements(root);
  const typeElement = textElements.find((el) =>
    includesAnyLabel(normalizeText(el.textContent), SESSION_TYPE_LABELS),
  );

  const siblingTitle = typeElement ? findNextTextSibling(typeElement) : null;
  if (siblingTitle) {
    return siblingTitle;
  }

  return findHeadingText(root) ?? DEFAULT_SESSION_TITLE;
}

function extractTeacherName(root: HTMLElement, title: string): string | null {
  const teacherFromImage = normalizeText(
    root.querySelector<HTMLImageElement>("img[alt]")?.alt,
  );
  if (teacherFromImage) {
    return teacherFromImage;
  }

  const teacherCandidate = getTextElements(root)
    .map(function getElementText(element) {
      return normalizeText(element.textContent);
    })
    .filter(function filterTeacherCandidates(text) {
      return isTeacherCandidate(text, title);
    })
    .at(-1);

  return teacherCandidate ?? null;
}

function isSessionActionButton(button: HTMLButtonElement): boolean {
  return includesAnyLabel(
    normalizeText(button.textContent),
    SESSION_ACTION_LABELS,
  );
}

function countActionContainers(root: HTMLElement): number {
  return findSessionActionContainers(root).length;
}

export function findSessionActionContainers(
  root: Document | HTMLElement,
): HTMLElement[] {
  const containers = new Set<HTMLElement>();

  for (const button of root.querySelectorAll<HTMLButtonElement>("button")) {
    if (isSessionActionButton(button) && button.parentElement) {
      containers.add(button.parentElement);
    }
  }

  return [...containers];
}

export function hasCalendarButton(container: HTMLElement): boolean {
  return (
    container.querySelector("calendar-button") !== null ||
    container.querySelector(`.${SESSION_BUTTON_CLASS_NAME}`) !== null
  );
}

export function findSessionCard(
  actionContainer: HTMLElement,
): HTMLElement | null {
  let currentElement: HTMLElement | null = actionContainer;

  while (currentElement && currentElement.tagName !== "BODY") {
    if (
      findDateLabel(currentElement) &&
      countActionContainers(currentElement) === 1
    ) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}

export function parseSessionCard(
  root: HTMLElement,
  now: DateTime,
): ParsedSessionCard | null {
  const dateLabel = findDateLabel(root);
  if (!dateLabel) {
    return null;
  }

  const schedule = parseSessionSchedule(dateLabel, now);
  if (!schedule) {
    return null;
  }

  const title = extractTitle(root);

  return {
    title,
    teacherName: extractTeacherName(root, title),
    schedule,
    source: root,
  };
}
