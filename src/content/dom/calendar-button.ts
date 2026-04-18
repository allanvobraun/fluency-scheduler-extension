import calendarButtonStyles from './calendar-button.css?raw';
import calendarButtonTemplate from './calendar-button.html?raw';

const CONTENT_STYLE_ID = 'fluency-calendar-button-styles';

function createTemplate(doc: Document): HTMLTemplateElement {
  const template = doc.createElement('template');
  template.innerHTML = calendarButtonTemplate.trim();
  return template;
}

export function ensureCalendarButtonStyles(doc: Document): void {
  if (doc.getElementById(CONTENT_STYLE_ID)) {
    return;
  }

  const styleElement = doc.createElement('style');
  styleElement.id = CONTENT_STYLE_ID;
  styleElement.textContent = calendarButtonStyles;
  doc.head.append(styleElement);
}

export function createCalendarButton(
  doc: Document,
  onClick: (event: MouseEvent) => void,
): HTMLButtonElement {
  const button = createTemplate(doc).content.firstElementChild;

  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('Calendar button template must produce a button element.');
  }

  button.addEventListener('click', onClick);

  return button;
}
