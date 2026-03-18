import { LitElement, html, svg, css } from 'lit-element';

const iconTemplates = {
  add: svg`
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
  `,
  arrow_drop_down: svg`
    <path d="M7 10l5 5 5-5"></path>
  `,
  arrow_left: svg`
    <path d="M15 6l-6 6 6 6"></path>
  `,
  arrow_right: svg`
    <path d="M9 6l6 6-6 6"></path>
  `,
  cancel: svg`
    <path d="M6 6l12 12"></path>
    <path d="M18 6L6 18"></path>
  `,
  call: svg`
    <path d="M7.5 5.5c1 2 2.3 3.8 4 5.5s3.5 3 5.5 4"></path>
    <path d="M6.5 4l3 1 1 3-2 2"></path>
    <path d="M17.5 14l3 1-1 5-4-.5-1.5-3"></path>
  `,
  call_end: svg`
    <path d="M5 15c2.5-2 11.5-2 14 0"></path>
    <path d="M9 14l-2.5 4"></path>
    <path d="M15 14l2.5 4"></path>
  `,
  close: svg`
    <path d="M6 6l12 12"></path>
    <path d="M18 6L6 18"></path>
  `,
  code: svg`
    <path d="M9 8l-4 4 4 4"></path>
    <path d="M15 8l4 4-4 4"></path>
    <path d="M13 5l-2 14"></path>
  `,
  content_copy: svg`
    <rect x="9" y="7" width="10" height="12" rx="1.5"></rect>
    <path d="M7 15H6a1 1 0 01-1-1V5.5A1.5 1.5 0 016.5 4H15a1 1 0 011 1v1"></path>
  `,
  delete: svg`
    <path d="M5 7h14"></path>
    <path d="M9 7V5h6v2"></path>
    <path d="M8 7v11"></path>
    <path d="M16 7v11"></path>
    <path d="M6 7l1 13h10l1-13"></path>
  `,
  done: svg`
    <path d="M5 13l4 4L19 7"></path>
  `,
  edit: svg`
    <path d="M4 20l4.5-1 9.5-9.5-3.5-3.5L5 15.5 4 20z"></path>
    <path d="M13.5 6l3.5 3.5"></path>
  `,
  expand_more: svg`
    <path d="M7 10l5 5 5-5"></path>
  `,
  format_bold: svg`
    <path d="M8 5h4.5a3 3 0 010 6H8z"></path>
    <path d="M8 11h5a3.5 3.5 0 010 7H8z"></path>
    <path d="M8 5v13"></path>
  `,
  format_align_left: svg`
    <path d="M5 7h14"></path>
    <path d="M5 11h10"></path>
    <path d="M5 15h14"></path>
    <path d="M5 19h10"></path>
  `,
  format_align_center: svg`
    <path d="M5 7h14"></path>
    <path d="M7 11h10"></path>
    <path d="M5 15h14"></path>
    <path d="M7 19h10"></path>
  `,
  format_align_right: svg`
    <path d="M5 7h14"></path>
    <path d="M9 11h10"></path>
    <path d="M5 15h14"></path>
    <path d="M9 19h10"></path>
  `,
  format_clear: svg`
    <path d="M5 7h11"></path>
    <path d="M7 11h7"></path>
    <path d="M9 15h3"></path>
    <path d="M6 18l12-12"></path>
  `,
  format_indent_increase: svg`
    <path d="M10 7h9"></path>
    <path d="M10 11h7"></path>
    <path d="M10 15h9"></path>
    <path d="M10 19h7"></path>
    <path d="M5 9l3 3-3 3"></path>
  `,
  format_indent_decrease: svg`
    <path d="M10 7h9"></path>
    <path d="M10 11h7"></path>
    <path d="M10 15h9"></path>
    <path d="M10 19h7"></path>
    <path d="M8 9l-3 3 3 3"></path>
  `,
  format_italic: svg`
    <path d="M9 5h8"></path>
    <path d="M7 19h8"></path>
    <path d="M14 5l-4 14"></path>
  `,
  format_list_bulleted: svg`
    <circle cx="6.5" cy="8" r="1"></circle>
    <circle cx="6.5" cy="12" r="1"></circle>
    <circle cx="6.5" cy="16" r="1"></circle>
    <path d="M10 8h8"></path>
    <path d="M10 12h8"></path>
    <path d="M10 16h8"></path>
  `,
  format_list_numbered: svg`
    <path d="M5.5 7.5v2"></path>
    <path d="M5 9.5h1.5"></path>
    <path d="M5 13c0-1 1.5-1 1.5 0 0 .6-.4 1-1.5 2h1.5"></path>
    <path d="M5 17.2c.4-.5 1.6-.5 1.6.4 0 .8-1.2 1-1.6.4m0 0c.4.8 1.6.8 1.6-.1"></path>
    <path d="M10 8h8"></path>
    <path d="M10 12h8"></path>
    <path d="M10 16h8"></path>
  `,
  format_quote: svg`
    <path d="M7 10a3 3 0 013-3v4a3 3 0 01-3 3"></path>
    <path d="M14 10a3 3 0 013-3v4a3 3 0 01-3 3"></path>
  `,
  format_underline: svg`
    <path d="M8 5v6a4 4 0 008 0V5"></path>
    <path d="M7 19h10"></path>
  `,
  image: svg`
    <rect x="4" y="6" width="16" height="12" rx="1.5"></rect>
    <circle cx="9" cy="10" r="1.5"></circle>
    <path d="M6.5 16l3.5-3.5 3 3 2-2 2.5 2.5"></path>
  `,
  link: svg`
    <path d="M10 14l4-4"></path>
    <path d="M8.5 15.5l-2 2a3 3 0 104.2 4.2l2-2"></path>
    <path d="M15.5 8.5l2-2a3 3 0 10-4.2-4.2l-2 2"></path>
  `,
  menu: svg`
    <path d="M4 7h16"></path>
    <path d="M4 12h16"></path>
    <path d="M4 17h16"></path>
  `,
  moon: svg`
    <path d="M19 14.5A7.5 7.5 0 1112 5a6 6 0 007 9.5z"></path>
  `,
  more_vert: svg`
    <circle cx="12" cy="6.5" r="1.5"></circle>
    <circle cx="12" cy="12" r="1.5"></circle>
    <circle cx="12" cy="17.5" r="1.5"></circle>
  `,
  post_add: svg`
    <path d="M7 5h7"></path>
    <path d="M7 9h5"></path>
    <path d="M7 13h3"></path>
    <path d="M6 3h9l4 4v14H6z"></path>
    <path d="M17 14v6"></path>
    <path d="M14 17h6"></path>
  `,
  keyboard_return: svg`
    <path d="M7 7l-4 5 4 5"></path>
    <path d="M3 12h11a4 4 0 014 4v1"></path>
  `,
  label: svg`
    <path d="M11 5H6.5A1.5 1.5 0 005 6.5V11"></path>
    <path d="M11 5l8 8-6 6-8-8V5h6z"></path>
    <circle cx="8.5" cy="8.5" r="1"></circle>
  `,
  person: svg`
    <circle cx="12" cy="8" r="3.25"></circle>
    <path d="M5 19c1.75-3 4.1-4.5 7-4.5s5.25 1.5 7 4.5"></path>
  `,
  redo: svg`
    <path d="M18 8v5h-5"></path>
    <path d="M18 13a7 7 0 10-2.05 4.95"></path>
  `,
  remove_circle: svg`
    <circle cx="12" cy="12" r="8.5"></circle>
    <path d="M8 12h8"></path>
  `,
  search: svg`
    <circle cx="11" cy="11" r="5.5"></circle>
    <path d="M16 16l4 4"></path>
  `,
  share: svg`
    <circle cx="7" cy="12" r="1.75"></circle>
    <circle cx="17" cy="7" r="1.75"></circle>
    <circle cx="17" cy="17" r="1.75"></circle>
    <path d="M8.5 11.25l7-3.5"></path>
    <path d="M8.5 12.75l7 3.5"></path>
  `,
  shopping_cart: svg`
    <circle cx="10" cy="18" r="1.5"></circle>
    <circle cx="17" cy="18" r="1.5"></circle>
    <path d="M3.5 5H6l1.75 8h9l2-6H7"></path>
  `,
  short_text: svg`
    <path d="M5 10h14"></path>
    <path d="M5 14h9"></path>
  `,
  sun: svg`
    <circle cx="12" cy="12" r="3.5"></circle>
    <path d="M12 2.5v2.5"></path>
    <path d="M12 19v2.5"></path>
    <path d="M21.5 12H19"></path>
    <path d="M5 12H2.5"></path>
    <path d="M18.7 5.3l-1.8 1.8"></path>
    <path d="M7.1 16.9l-1.8 1.8"></path>
    <path d="M18.7 18.7l-1.8-1.8"></path>
    <path d="M7.1 7.1L5.3 5.3"></path>
  `,
  video_library: svg`
    <rect x="4" y="6" width="16" height="12" rx="1.5"></rect>
    <path d="M10 9l5 3-5 3z"></path>
  `,
  web_asset: svg`
    <rect x="4" y="5" width="16" height="14" rx="1.5"></rect>
    <path d="M4 9h16"></path>
    <path d="M10 12l-2 2 2 2"></path>
    <path d="M14 12l2 2-2 2"></path>
  `,
  arrow_upward: svg`
    <path d="M12 19V6"></path>
    <path d="M6 12l6-6 6 6"></path>
  `,
  arrow_downward: svg`
    <path d="M12 5v13"></path>
    <path d="M6 12l6 6 6-6"></path>
  `
};

const aliases = {
  add_shopping_cart: 'shopping_cart',
  image_search: 'image',
  format_align_justify: 'format_align_left',
  keyboard_arrow_up: 'arrow_upward',
  keyboard_arrow_down: 'arrow_downward'
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
