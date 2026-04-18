import { DateTime } from "luxon";
import { describe, expect, it, vi } from "vitest";

import { enhanceCalendarButtons } from "../../src/content/bootstrap";

function buildMarkup(): string {
  return `
  <article class="session-card">
    <p>Sábado, 21/02 - 09h45</p>
    <p>Sessão individual</p>
    <h2>Intermediário Science</h2>
    <img alt="Aline Costa" src="/teacher.png" />
    <div class="session-card__actions">
      <button type="button">Ver material</button>
    </div>
  </article>
`;
}

describe("enhanceCalendarButtons", () => {
  it("opens the generated calendar url when the button is clicked", () => {
    document.body.innerHTML = buildMarkup();

    const openCalendar = vi.fn();

    enhanceCalendarButtons({
      now: () => DateTime.fromISO("2026-01-10T09:00:00", { zone: "UTC" }),
      openCalendar,
    });

    document
      .querySelector<HTMLButtonElement>(".fluency-calendar-button")
      ?.click();

    expect(openCalendar).toHaveBeenCalledTimes(1);
    expect(openCalendar.mock.calls[0]?.[0]).toContain(
      "google.com/calendar/render",
    );
  });
});
