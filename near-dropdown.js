import { LitElement, html, css } from 'lit-element';
import { nearPicoTokens, nearMenuSurfaceStyles } from './ui.css.js';

export class NearDropdown extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      align: { type: String, reflect: true }
    };
  }

  static get styles() {
    return [
      nearPicoTokens,
      nearMenuSurfaceStyles,
      css`
        :host {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        [part='trigger'] {
          display: inline-flex;
          align-items: center;
        }

        [part='panel'] {
          position: absolute;
          top: calc(100% + 0.375rem);
          left: 0;
          z-index: 1000;
        }

        :host([align='end']) [part='panel'] {
          right: 0;
          left: auto;
        }

        [part='panel'][hidden] {
          display: none;
        }

        #trigger-slot::slotted(*) {
          cursor: pointer;
        }

        #content-slot::slotted(*) {
          display: block;
        }

        #content-slot::slotted(.near-menu-item) {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          width: 100%;
          min-height: 2.5rem;
          padding: 0.625rem 0.75rem;
          border: 0;
          border-radius: calc(var(--near-border-radius) - 0.125rem);
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
          text-align: left;
          text-decoration: none;
          box-sizing: border-box;
        }

        #content-slot::slotted(.near-menu-item:hover),
        #content-slot::slotted(.near-menu-item:focus-visible) {
          background: var(--near-primary-soft);
          color: var(--near-primary);
          outline: none;
        }
      `
    ];
  }

  constructor() {
    super();
    this.open = false;
    this.align = 'start';
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
  }

  updated(changedProperties) {
    if (!changedProperties.has('open')) return;

    const method = this.open ? 'addEventListener' : 'removeEventListener';
    document[method]('pointerdown', this.handleDocumentPointerDown, true);
    document[method]('keydown', this.handleDocumentKeydown);

    this.dispatchEvent(
      new CustomEvent(this.open ? 'near-opened' : 'near-closed', {
        bubbles: true,
        composed: true
      })
    );
  }

  disconnectedCallback() {
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    super.disconnectedCallback();
  }

  handleDocumentPointerDown(event) {
    if (event.composedPath().includes(this)) return;
    this.closeMenu();
  }

  handleDocumentKeydown(event) {
    if (event.key === 'Escape') this.closeMenu();
  }

  toggleMenu(force) {
    this.open = typeof force === 'boolean' ? force : !this.open;
  }

  openMenu() {
    this.toggleMenu(true);
  }

  closeMenu() {
    this.toggleMenu(false);
  }

  handleTriggerClick() {
    this.toggleMenu();
  }

  handlePanelClick(event) {
    const closeTarget = event
      .composedPath()
      .find((node) => node?.dataset?.closeMenu !== undefined || node?.closest?.('[data-close-menu]'));

    if (closeTarget) {
      this.closeMenu();
      return;
    }

    const actionTarget = event
      .composedPath()
      .find((node) => node?.tagName === 'A' || node?.tagName === 'BUTTON');

    if (actionTarget && !actionTarget.hasAttribute('data-keep-open')) this.closeMenu();
  }

  render() {
    return html`
      <span part="trigger" @click="${this.handleTriggerClick}">
        <slot id="trigger-slot" name="trigger"></slot>
      </span>
      <div part="panel" class="near-menu-panel" ?hidden="${!this.open}" @click="${this.handlePanelClick}">
        <div class="near-menu-list">
          <slot id="content-slot"></slot>
        </div>
      </div>
    `;
  }
}

try {
  window.customElements.define('near-dropdown', NearDropdown);
} catch (error) {
  // ignore duplicate registrations during local reloads
}
