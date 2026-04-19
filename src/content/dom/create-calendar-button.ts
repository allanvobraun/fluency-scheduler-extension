export function createCalendarButton(
  doc: Document,
  calendarUrl: string,
): Element {
  const template = doc.createElement("template");
  template.innerHTML = `<calendar-button href="${calendarUrl}"></calendar-button>`;
  const button = template.content.firstElementChild;
  if (!button) {
    throw new Error("Error creating element");
  }

  return button;
}
