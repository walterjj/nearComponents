import { html, css } from 'lit-element';
import { NearApp } from '../app.js';

function detectBasePath(pathname) {
  if (pathname.startsWith('/demo/build/app/')) return '/demo/build/app';
  if (pathname === '/demo/build/app') return '/demo/build/app';
  if (pathname.startsWith('/demo/app/')) return '/demo/app';
  if (pathname === '/demo/app') return '/demo/app';
  return '/demo/app';
}

function sectionCard(title, body) {
  return html`
    <article class="card">
      <h2>${title}</h2>
      <p>${body}</p>
    </article>
  `;
}

class NearAppSmoke extends NearApp {
  static get styles() {
    return [
      super.styles,
      css`
        .smoke-content {
          display: grid;
          gap: 1.25rem;
          max-width: 72rem;
          margin: 0 auto;
        }

        .hero,
        .card {
          border: 1px solid var(--near-border-color);
          border-radius: 1rem;
          background: var(--near-surface-color);
          box-shadow: var(--near-box-shadow);
        }

        .hero {
          display: grid;
          gap: 1rem;
          padding: 1.5rem;
        }

        .hero h1,
        .card h2 {
          margin: 0;
        }

        .hero p,
        .card p,
        .card li {
          margin: 0;
          color: var(--near-muted-color);
        }

        .hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        }

        .card {
          display: grid;
          gap: 0.75rem;
          padding: 1.25rem;
        }

        code {
          font-family: ui-monospace, monospace;
          font-size: 0.92em;
        }
      `
    ];
  }

  constructor() {
    super();
    this.signedLoad = true;
    this.poolId = 'us-east-1_bi3wghKiN';
    this.clientId = '7n72a8kvhpjo8bb6rs910d0rhu';
    this.baseURL = 'https://www.near.services';
    this.apiURL = 'https://api.near.services/nearservices';
    this.lang = 'es';
    this.signInLabel = 'ingresar';
    this.noregister = false;
    this.title = 'nearServices';
    this.convertible = true;
    this.fixedTopBar = true;
    this.invalidateOnEndEdit = true;
    const parts = window.location.hostname.split('.');
    this.subdomain = (parts.length > 2 && parts[0]) || 'www';
    this.firstTime = true;
    this.basePath = detectBasePath(window.location.pathname);
    this.navigationMenu = {
      items: [
        { label: 'Overview', href: `${this.basePath}/` },
        { label: 'Routing', href: `${this.basePath}/routing` },
        { label: 'Layout', href: `${this.basePath}/layout` }
      ]
    };
  }

  routePageChanged(nearLocation) {
    const path = nearLocation.path.startsWith(this.basePath)
      ? nearLocation.path.slice(this.basePath.length)
      : nearLocation.path;
    const normalized = path.replace(/^\/+/, '').replace(/\/+$/, '');
    this.page = normalized || 'home';
    this.mode = 'smoke';
    if (!this.drawerStatic) this.drawerOpen = false;
    window.scrollTo(0, 0);
    this.pageChanged(this.page);
  }

  pageChanged() {
    this.requestUpdate();
  }

  topBarTitle() {
    return html`NearApp Smoke`;
  }

  internalPage() {
    return html`<div class="smoke-content">${this.renderPage()}</div>`;
  }

  renderPage() {
    if (this.page === 'routing') {
      return html`
        <section class="hero">
          <h1>Routing smoke test</h1>
          <p>
            Esta vista usa la shell real de <code>NearApp</code> y deja afuera el
            fetch de contenido remoto para probar routing, toolbar y drawer.
          </p>
        </section>
        <section class="grid">
          ${sectionCard('Current path', window.location.pathname)}
          ${sectionCard('Current page', this.page)}
          ${sectionCard('NearLocation', 'El cambio de ruta pasa por NearRoute/NearLocation y re-renderiza la shell.')}
        </section>
      `;
    }

    if (this.page === 'layout') {
      return html`
        <section class="hero">
          <h1>Layout smoke test</h1>
          <p>
            Probá el drawer en móvil, el toolbar sticky y el menú de usuario de
            <code>near-user</code>.
          </p>
        </section>
        <section class="grid">
          ${sectionCard('Drawer', 'Debe abrir/cerrar sin MWC y quedar fijo cuando aplica el modo convertible.')}
          ${sectionCard('Menus', 'Los dropdowns de navegación y edición ahora usan near-dropdown.')}
          ${sectionCard('User', 'La integración visual con near-user ya no depende de Material Web Components.')}
        </section>
      `;
    }

    return html`
      <section class="hero">
        <h1>NearApp running without MWC</h1>
        <p>
          Esta página usa la shell real de <code>app.js</code> con toolbar,
          drawer e items de navegación propios.
        </p>
        <div class="hero-actions">
          <a class="near-button" data-variant="primary" is="near-route" href="${this.basePath}/routing">Routing</a>
          <a class="near-button" is="near-route" href="${this.basePath}/layout">Layout</a>
        </div>
      </section>
      <section class="grid">
        ${sectionCard('Toolbar', 'Header, navegación y user slot renderizados por NearApp migrado.')}
        ${sectionCard('Drawer', 'Drawer y backdrop sin mwc-drawer.')}
        ${sectionCard('Edit menu', 'El menú interno de edición ahora usa near-dropdown.')}
      </section>
    `;
  }
}

window.customElements.define('near-app-smoke', NearAppSmoke);
