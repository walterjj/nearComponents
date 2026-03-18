import { LitElement, html, css } from 'lit-element';

const iconTemplates = {
  add: html`
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
  `,
  arrow_drop_down: html`
    <path d="M7 10l5 5 5-5"></path>
  `,
  arrow_right: html`
    <path d="M9 6l6 6-6 6"></path>
  `,
  cancel: html`
    <path d="M6 6l12 12"></path>
    <path d="M18 6L6 18"></path>
  `,
  close: html`
    <path d="M6 6l12 12"></path>
    <path d="M18 6L6 18"></path>
  `,
  delete: html`
    <path d="M5 7h14"></path>
    <path d="M9 7V5h6v2"></path>
    <path d="M8 7v11"></path>
    <path d="M16 7v11"></path>
    <path d="M6 7l1 13h10l1-13"></path>
  `,
  done: html`
    <path d="M5 13l4 4L19 7"></path>
  `,
  edit: html`
    <path d="M4 20l4.5-1 9.5-9.5-3.5-3.5L5 15.5 4 20z"></path>
    <path d="M13.5 6l3.5 3.5"></path>
  `,
  expand_more: html`
    <path d="M7 10l5 5 5-5"></path>
  `,
  menu: html`
    <path d="M4 7h16"></path>
    <path d="M4 12h16"></path>
    <path d="M4 17h16"></path>
  `,
  moon: html`
    <path d="M19 14.5A7.5 7.5 0 1112 5a6 6 0 007 9.5z"></path>
  `,
  more_vert: html`
    <circle cx="12" cy="6.5" r="1.5"></circle>
    <circle cx="12" cy="12" r="1.5"></circle>
    <circle cx="12" cy="17.5" r="1.5"></circle>
  `,
  person: html`
    <circle cx="12" cy="8" r="3.25"></circle>
    <path d="M5 19c1.75-3 4.1-4.5 7-4.5s5.25 1.5 7 4.5"></path>
  `,
  redo: html`
    <path d="M18 8v5h-5"></path>
    <path d="M18 13a7 7 0 10-2.05 4.95"></path>
  `,
  remove_circle: html`
    <circle cx="12" cy="12" r="8.5"></circle>
    <path d="M8 12h8"></path>
  `,
  share: html`
    <circle cx="7" cy="12" r="1.75"></circle>
    <circle cx="17" cy="7" r="1.75"></circle>
    <circle cx="17" cy="17" r="1.75"></circle>
    <path d="M8.5 11.25l7-3.5"></path>
    <path d="M8.5 12.75l7 3.5"></path>
  `,
  shopping_cart: html`
    <circle cx="10" cy="18" r="1.5"></circle>
    <circle cx="17" cy="18" r="1.5"></circle>
    <path d="M3.5 5H6l1.75 8h9l2-6H7"></path>
  `,
  sun: html`
    <circle cx="12" cy="12" r="3.5"></circle>
    <path d="M12 2.5v2.5"></path>
    <path d="M12 19v2.5"></path>
    <path d="M21.5 12H19"></path>
    <path d="M5 12H2.5"></path>
    <path d="M18.7 5.3l-1.8 1.8"></path>
    <path d="M7.1 16.9l-1.8 1.8"></path>
    <path d="M18.7 18.7l-1.8-1.8"></path>
    <path d="M7.1 7.1L5.3 5.3"></path>
  `
};

const aliases = {
  add_shopping_cart: 'shopping_cart'
};

export class NearIcon extends LitElement {
  static get properties() {
    return {
      name: { type: String, reflect: true },
      label: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1em;
        height: 1em;
        color: inherit;
        vertical-align: middle;
      }

      svg {
        display: block;
        width: 100%;
        height: 100%;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
        overflow: visible;
      }

      .fallback {
        display: inline-block;
        width: auto;
        height: auto;
        font-size: 0.75em;
        line-height: 1;
        white-space: nowrap;
      }
    `;
  }

  get iconName() {
    const raw = (this.name || this.textContent || '').trim();
    return aliases[raw] || raw;
  }

  renderFallback(name) {
    return html`<span class="fallback">${name}</span>`;
  }

  render() {
    const name = this.iconName;
    const icon = iconTemplates[name];
    const label = this.label || name || 'icon';

    if (!icon) return this.renderFallback(name);

    return html`
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label="${label}"
        focusable="false"
      >
        ${icon}
      </svg>
    `;
  }
}

try {
  window.customElements.define('near-icon', NearIcon);
} catch (error) {
  // ignore duplicate registrations during local reloads
}
