import "./style.css";

const dynamicTemplate = document.querySelector<HTMLTemplateElement>(
  "#dynamic-session-template",
);
const dynamicSessionList = document.querySelector<HTMLElement>(
  "[data-dynamic-sessions]",
);
const addDynamicSessionButton = document.querySelector<HTMLButtonElement>(
  "#add-dynamic-session",
);

function appendDynamicSession(): void {
  if (!dynamicTemplate || !dynamicSessionList) {
    return;
  }

  const dynamicSession =
    dynamicTemplate.content.firstElementChild?.cloneNode(true);
  if (!(dynamicSession instanceof HTMLElement)) {
    return;
  }

  dynamicSessionList.append(dynamicSession);
}

addDynamicSessionButton?.addEventListener("click", appendDynamicSession);
