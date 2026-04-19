import { fixture, html } from "@open-wc/testing-helpers";
import { describe, expect, it } from "vitest";

import type { CalendarButton } from "@/components/calendar-button";

describe("calendar-button", () => {
  it("renders a Google Calendar link with the configured href", async () => {
    const url = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const el = await fixture<CalendarButton>(
      html`<calendar-button href="${url}"></calendar-button>`,
    );

    await el.updateComplete;

    const link = el.shadowRoot?.querySelector<HTMLAnchorElement>("a");

    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).to.equal(url);
    expect(link?.getAttribute("target")).to.equal("_blank");
    expect(link?.getAttribute("aria-label")).to.equal(
      "Adicionar ao Google Agenda",
    );
    expect(link?.classList.contains("fluency-calendar-button")).to.equal(true);
  });
});
