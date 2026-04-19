import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("calendar-button")
export class CalendarButton extends LitElement {
  @property({ type: String })
  href = "";

  static styles = css`
    .fluency-calendar-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-left: 12px;
      padding: 0;
      border: 1px solid #d5dfeb;
      border-radius: 999px;
      background: #f4f8fc;
      color: #37506a;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(16, 35, 59, 0.08);
      transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        color 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease;
    }

    .fluency-calendar-button:hover {
      transform: translateY(-1px);
      border-color: #0f6b98;
      background: #0f6b98;
      color: #ffffff;
      box-shadow: 0 6px 14px rgba(15, 107, 152, 0.2);
    }

    .fluency-calendar-button:focus-visible {
      outline: 3px solid rgba(56, 189, 248, 0.32);
      outline-offset: 2px;
    }

    .fluency-calendar-button__icon {
      display: inline-flex;
    }

    .fluency-calendar-button svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;

  render() {
    return html`
      <a
        class="fluency-calendar-button"
        title="Adicionar ao Google Agenda"
        aria-label="Adicionar ao Google Agenda"
        target="_blank"
        rel="noopener noreferrer"
        href="${this.href}"
      >
        <span class="fluency-calendar-button__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M12 14v4"></path>
            <path d="M10 16h4"></path>
          </svg>
        </span>
      </a>
    `;
  }
}
