import { LitElement, html, css } from 'lit-element';
import { NearLocation } from '../route.js';
import { nearPicoTokens, nearControlStyles } from '../ui.css.js';

function detectBasePath(pathname) {
  if (pathname.startsWith('/demo/build/')) return '/demo/build';
  if (pathname === '/demo/build') return '/demo/build';
  if (pathname.startsWith('/demo/')) return '/demo';
  if (pathname === '/demo') return '/demo';
  return '';
}

function ensureTrailingSlash(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

class NearTestApp extends LitElement {
  static get properties() {
    return {
      drawerOpen: { type: Boolean, reflect: true, attribute: 'drawer-open' },
      page: { type: String },
      basePath: { type: String },
      locationPath: { type: String },
      locationHash: { type: String },
      locationQuery: { type: String },
      theme: { type: String, reflect: true }
    };
  }

  static get styles() {
    return [
      nearPicoTokens,
      nearControlStyles,
      css`
        :host {
          display: grid;
          min-height: 100vh;
          grid-template-columns: minmax(16rem, 18rem) minmax(0, 1fr);
          grid-template-rows: auto 1fr;
        }

        header {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--near-border-color);
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(14px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.9rem;
          background: var(--near-primary-background);
          color: var(--near-primary-inverse);
          box-shadow: var(--near-box-shadow);
        }

        nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        nav a {
          padding: 0.625rem 0.875rem;
          border-radius: 999px;
          color: var(--near-muted-color);
          text-decoration: none;
        }

        nav a.active {
          background: var(--near-primary-soft);
          color: var(--near-primary);
        }

        aside {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          border-right: 1px solid var(--near-border-color);
          background: rgba(255, 255, 255, 0.72);
        }

        .aside-group {
          display: grid;
          gap: 0.35rem;
        }

        .aside-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--near-muted-color);
          padding-inline: 0.5rem;
        }

        main {
          padding: 1.5rem;
          display: grid;
          gap: 1.25rem;
          align-content: start;
        }

        .hero,
        .panel {
          border: 1px solid var(--near-border-color);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: var(--near-box-shadow);
        }

        .hero {
          display: grid;
          gap: 1rem;
          padding: 1.5rem;
        }

        .hero h1,
        .panel h2 {
          margin: 0;
        }

        .hero p,
        .panel p {
          margin: 0;
          color: var(--near-muted-color);
        }

        .actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        }

        .panel {
          padding: 1.25rem;
          display: grid;
          gap: 0.9rem;
        }

        .token-list,
        .route-log {
          display: grid;
          gap: 0.625rem;
        }

        .token-item,
        .route-row {
          display: grid;
          gap: 0.25rem;
          padding: 0.75rem 0.875rem;
          border-radius: 0.75rem;
          background: rgba(0, 0, 0, 0.02);
        }

        .token-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          width: fit-content;
          padding: 0.35rem 0.625rem;
          border-radius: 999px;
          background: var(--near-primary-soft);
          color: var(--near-primary);
          font-size: 0.875rem;
        }

        .field-row {
          display: grid;
          gap: 0.75rem;
        }

        label {
          display: grid;
          gap: 0.4rem;
          font-size: 0.95rem;
        }

        near-dropdown {
          justify-self: start;
        }

        .dropdown-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-toggle {
          min-width: 8.5rem;
          justify-content: space-between;
        }

        .menu-note {
          font-size: 0.875rem;
          color: var(--near-muted-color);
        }

        .menu-button {
          display: none;
        }

        .overlay {
          display: none;
        }

        @media (max-width: 900px) {
          :host {
            grid-template-columns: minmax(0, 1fr);
          }

          .menu-button {
            display: inline-flex;
          }

          aside {
            position: fixed;
            inset: 4.5rem auto 1rem 1rem;
            width: min(18rem, calc(100vw - 2rem));
            z-index: 12;
            transform: translateX(-115%);
            transition: transform 160ms ease;
          }

          :host([drawer-open]) aside {
            transform: translateX(0);
          }

          :host([drawer-open]) .overlay {
            display: block;
          }

          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(17, 25, 40, 0.35);
            z-index: 11;
          }

          nav {
            display: none;
          }
        }
      `
    ];
  }

  constructor() {
    super();
    this.drawerOpen = false;
    this.page = 'home';
    this.basePath = detectBasePath(window.location.pathname);
    this.locationPath = window.location.pathname;
    this.locationHash = window.location.hash;
    this.locationQuery = window.location.search;
    this.theme = this.getInitialTheme();
  }

  firstUpdated() {
    this.applyTheme();
    this.nearLocation = new NearLocation(
      this.handleLocationChange.bind(this),
      this.handleLocationChange.bind(this)
    );
    this.handleLocationChange(this.nearLocation);
  }

  getInitialTheme() {
    const storedTheme = window.localStorage.getItem('near-demo-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  pageHref(page) {
    const base = this.basePath || '';
    return page === 'home' ? ensureTrailingSlash(base || '/') : `${base}/${page}`;
  }

  pageFromPath(pathname) {
    const base = this.basePath;
    const relative = base && pathname.startsWith(base)
      ? pathname.slice(base.length)
      : pathname;
    const normalized = relative.replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized || 'home';
  }

  handleLocationChange(location = this.nearLocation) {
    const pathname = location?.path || window.location.pathname;
    this.basePath = detectBasePath(pathname) || this.basePath;
    this.locationPath = pathname;
    this.locationHash = window.location.hash;
    this.locationQuery = window.location.search;
    this.page = this.pageFromPath(pathname);
    this.drawerOpen = false;
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('near-demo-theme', this.theme);
    this.applyTheme();
  }

  navLink(page, label) {
    const href = this.pageHref(page);
    return html`
      <a
        is="near-route"
        href="${href}"
        class="${this.page === page ? 'active' : ''}"
      >
        ${label}
      </a>
    `;
  }

  renderHome() {
    return html`
      <section class="hero">
        <div class="token-chip">
          <near-icon name="done"></near-icon>
          Base UI sandbox
        </div>
        <h1>nearComponents test bench</h1>
        <p>
          Esta demo valida la capa nueva sin MWC: iconos inline, dropdown,
          drawer y routing con <code>NearLocation</code>.
        </p>
        <div class="actions">
          <a class="near-button" data-variant="primary" is="near-route" href="${this.pageHref('controls')}">
            <near-icon name="edit"></near-icon>
            Ver controles
          </a>
          <a class="near-button" is="near-route" href="${this.pageHref('routing')}">
            <near-icon name="share"></near-icon>
            Ver routing
          </a>
        </div>
      </section>
      <section class="grid">
        <article class="panel">
          <h2>Qué prueba</h2>
          <p>Tokens <code>--pico-*</code>, Shadow DOM, dropdown reusable y navegación SPA.</p>
        </article>
        <article class="panel">
          <h2>Siguiente paso</h2>
          <p>Reusar estas primitives para migrar <code>app.js</code>, <code>user.js</code> y <code>nearapi.js</code>.</p>
        </article>
      </section>
    `;
  }

  renderControls() {
    return html`
      <section class="grid">
        <article class="panel">
          <h2>Buttons</h2>
          <div class="actions">
            <button type="button" data-variant="primary">
              <near-icon name="done"></near-icon>
              Primary
            </button>
            <button type="button">
              <near-icon name="cancel"></near-icon>
              Secondary
            </button>
            <button type="button" class="near-icon-button" aria-label="Open menu">
              <near-icon name="menu"></near-icon>
            </button>
          </div>
        </article>
        <article class="panel">
          <h2>Dropdown</h2>
          <near-dropdown align="end">
            <button slot="trigger" type="button" class="dropdown-trigger">
              <near-icon name="person"></near-icon>
              Account
              <near-icon name="arrow_drop_down"></near-icon>
            </button>
            <button type="button" class="near-menu-item" data-close-menu>
              <near-icon name="edit"></near-icon>
              Edit profile
            </button>
            <button type="button" class="near-menu-item" data-close-menu>
              <near-icon name="shopping_cart"></near-icon>
              Orders
            </button>
            <a class="near-menu-item" is="near-route" href="${this.pageHref('routing')}">
              <near-icon name="share"></near-icon>
              Open routing view
            </a>
          </near-dropdown>
          <p class="menu-note">
            El panel se cierra al hacer click afuera, con Escape o al activar un item.
          </p>
        </article>
        <article class="panel">
          <h2>Form fields</h2>
          <div class="field-row">
            <label>
              Email
              <input type="email" placeholder="name@example.com">
            </label>
            <label>
              Notes
              <textarea placeholder="Shadow DOM con tokens Pico"></textarea>
            </label>
          </div>
        </article>
      </section>
    `;
  }

  renderRouting() {
    return html`
      <section class="grid">
        <article class="panel">
          <h2>NearLocation</h2>
          <div class="route-log">
            <div class="route-row">
              <strong>pathname</strong>
              <code>${this.locationPath}</code>
            </div>
            <div class="route-row">
              <strong>query</strong>
              <code>${this.locationQuery || '(empty)'}</code>
            </div>
            <div class="route-row">
              <strong>hash</strong>
              <code>${this.locationHash || '(empty)'}</code>
            </div>
            <div class="route-row">
              <strong>page</strong>
              <code>${this.page}</code>
            </div>
          </div>
        </article>
        <article class="panel">
          <h2>Test navigation</h2>
          <div class="actions">
            ${this.navLink('home', 'Home')}
            ${this.navLink('controls', 'Controls')}
            ${this.navLink('routing', 'Routing')}
          </div>
          <p>
            <code>NearRoute</code> hace <code>pushState</code> y <code>NearLocation</code> reactualiza esta vista
            sin recargar la página.
          </p>
        </article>
      </section>
    `;
  }

  renderContent() {
    switch (this.page) {
      case 'controls':
        return this.renderControls();
      case 'routing':
        return this.renderRouting();
      default:
        return this.renderHome();
    }
  }

  render() {
    return html`
      <div class="overlay" @click="${this.closeDrawer}"></div>
      <header>
        <div class="brand">
          <button type="button" class="near-icon-button menu-button" @click="${this.toggleDrawer}">
            <near-icon name="menu"></near-icon>
          </button>
          <div class="brand-mark">
            <near-icon name="menu"></near-icon>
          </div>
          <div>nearComponents / demo</div>
        </div>
        <div class="header-actions">
          <nav>
            ${this.navLink('home', 'Home')}
            ${this.navLink('controls', 'Controls')}
            ${this.navLink('routing', 'Routing')}
          </nav>
          <button type="button" class="theme-toggle" @click="${this.toggleTheme}">
            <span>${this.theme === 'dark' ? 'Dark' : 'Light'}</span>
            <near-icon name="${this.theme === 'dark' ? 'moon' : 'sun'}"></near-icon>
          </button>
        </div>
      </header>

      <aside>
        <div class="aside-group">
          <div class="aside-title">Shell</div>
          <drawer-button href="${this.pageHref('home')}" icon="menu">Overview</drawer-button>
          <drawer-button href="${this.pageHref('controls')}" icon="edit">Controls</drawer-button>
          <drawer-button href="${this.pageHref('routing')}" icon="share">Routing</drawer-button>
        </div>
        <div class="aside-group">
          <div class="aside-title">Status</div>
          <div class="token-item">
            <strong>Current page</strong>
            <code>${this.page}</code>
          </div>
          <div class="token-item">
            <strong>Base path</strong>
            <code>${this.basePath || '/'}</code>
          </div>
        </div>
      </aside>

      <main>
        ${this.renderContent()}
      </main>
    `;
  }
}

window.customElements.define('near-test-app', NearTestApp);
