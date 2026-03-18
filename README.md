# nearComponents

Coleccion de Web Components usados por `nearServices` y otros proyectos.

El objetivo actual de este repo no es preservar compatibilidad backward total. El objetivo es simplificar la base, eliminar dependencias de UI pesadas y dejar un set de componentes mas chico, predecible y facil de refactorizar en las aplicaciones que lo consumen.

## Objetivo de la migracion

- Eliminar `MWC` (`@material/mwc-*`).
- Eliminar `Material Icons` como fuente web.
- Mantener `Shadow DOM`.
- Usar `Pico.css` como fuente de tokens visuales.
- Mantener una base minima de estilos interna para componentes shadow.
- Favorecer refactors claros en apps consumidoras, aunque impliquen cambios incompatibles.

## Estado actual

Migrado o estabilizado:

- [app.js](/home/walter/idoneos/nearComponents/app.js)
- [user.js](/home/walter/idoneos/nearComponents/user.js)
- [nearapi.js](/home/walter/idoneos/nearComponents/nearapi.js)
- [drawerbutton.js](/home/walter/idoneos/nearComponents/drawerbutton.js)
- [near-icon.js](/home/walter/idoneos/nearComponents/near-icon.js)
- [near-dropdown.js](/home/walter/idoneos/nearComponents/near-dropdown.js)
- [ui.css.js](/home/walter/idoneos/nearComponents/ui.css.js)

Pendiente de migracion fuerte:

- [content.js](/home/walter/idoneos/nearComponents/content.js)
- [article.js](/home/walter/idoneos/nearComponents/article.js)
- [editor.js](/home/walter/idoneos/nearComponents/editor.js)
- [resources.js](/home/walter/idoneos/nearComponents/resources.js)
- otros modulos del stack de edicion/contenido

## Principios de refactor

- No perseguir wrappers 1:1 de MWC si el resultado sigue siendo complejo.
- Preferir HTML nativo + estilos compartidos antes que nuevos componentes innecesarios.
- Introducir componentes propios solo cuando resuelven un patron repetido.
- Si una API vieja complica la simplificacion, se cambia y se refactorizan las apps.
- La compatibilidad hacia atras es secundaria respecto de claridad, tamaño y mantenimiento.

## Arquitectura basica

El framework esta organizado en capas relativamente simples.

### 1. Shell de aplicacion

La shell vive principalmente en [app.js](/home/walter/idoneos/nearComponents/app.js).

Responsabilidades:

- toolbar principal
- drawer o sidebar
- integracion con `near-user`
- integracion con routing
- carga de pagina interna
- puntos de extension para apps derivadas

La idea es que las aplicaciones web deriven de `NearApp` y definan solo su navegacion, su contenido y, si hace falta, una normalizacion propia de rutas.

### 2. Routing

El routing vive en [route.js](/home/walter/idoneos/nearComponents/route.js).

Responsabilidades:

- `NearLocation` escucha `popstate`, `hashchange` y el evento custom `near-route`
- `NearRoute` intercepta anchors `<a is="near-route">`
- `NearRoute.navigate()` permite navegacion programatica

El router no intenta resolver layouts ni data loading. Solo publica cambios de ubicacion y deja que `NearApp` o cada componente reaccionen.

### 3. Auth y usuario

La autenticacion vive en:

- [user.js](/home/walter/idoneos/nearComponents/user.js)
- [nearapi.js](/home/walter/idoneos/nearComponents/nearapi.js)

Responsabilidades:

- login y registro con Cognito
- manejo de sesion
- lectura de atributos de usuario
- acciones autenticadas sobre API y recursos
- render de menu de cuenta

`user.js` y `nearapi.js` son similares, pero siguen separados porque se usan en contextos distintos. La idea actual no es forzarlos a una fusion, sino compartir primitives de UI y mantener separados los detalles funcionales.

### 4. Primitives de UI

La capa minima de UI vive en:

- [ui.css.js](/home/walter/idoneos/nearComponents/ui.css.js)
- [near-icon.js](/home/walter/idoneos/nearComponents/near-icon.js)
- [near-dropdown.js](/home/walter/idoneos/nearComponents/near-dropdown.js)

Responsabilidades:

- exponer tokens internos basados en `--pico-*`
- proveer estilos base para botones, campos y menus
- reemplazar iconos de webfont por SVG inline
- reemplazar menus MWC por dropdown propio

Esta capa debe permanecer chica. Si algo puede resolverse con HTML nativo + estilos base, esa es la opcion preferida.

### 5. Stack de contenido y edicion

La capa de contenido y edicion vive sobre todo en:

- [content.js](/home/walter/idoneos/nearComponents/content.js)
- [article.js](/home/walter/idoneos/nearComponents/article.js)
- [editor.js](/home/walter/idoneos/nearComponents/editor.js)
- [resources.js](/home/walter/idoneos/nearComponents/resources.js)

Responsabilidades:

- alta y edicion de contenido
- metadata de contenido y articulos
- recursos multimedia
- editor enriquecido

Esta es la capa mas legacy del framework y donde todavia queda la mayor parte del trabajo de migracion.

### 6. Tema y estilo

El framework mantiene `Shadow DOM`, por lo tanto no depende de que `Pico.css` estilice directamente el interior de cada componente.

El enfoque actual es:

- `Pico.css` como fuente de tokens visuales en el documento host
- estilos minimos internos para Shadow DOM
- sin `Light DOM`
- sin dependencias de UI pesadas

### Flujo general

En una app tipica, el flujo es este:

1. Una aplicacion deriva de `NearApp`.
2. `NearApp` monta toolbar, sidebar y `near-user`.
3. `NearLocation` detecta cambios de URL.
4. `NearApp.routePageChanged()` traduce la URL a estado interno.
5. `NearApp.pageChanged()` o `internalPage()` renderiza la vista actual.
6. Si hay edicion, `NearApp` carga el stack de contenido bajo demanda.

### Puntos de extension recomendados

Para extender el framework sin romper su simplificacion, conviene:

- derivar de `NearApp` en lugar de copiar su shell
- reutilizar `nearPicoTokens` y `nearControlStyles`
- usar `near-dropdown` para menus
- agregar iconos a `near-icon` solo si son realmente necesarios
- cargar modulos pesados de forma diferida si no pertenecen a la shell base

## Primitives nuevas

### `near-icon`

Archivo: [near-icon.js](/home/walter/idoneos/nearComponents/near-icon.js)

Reemplaza `mwc-icon` con SVG inline.

Ejemplo:

```html
<near-icon name="menu"></near-icon>
<near-icon name="person"></near-icon>
<near-icon name="cancel"></near-icon>
```

Notas:

- No depende de `Material Icons`.
- Si el icono no existe, muestra fallback textual.
- El set de iconos debe mantenerse chico y orientado a uso real.

### `near-dropdown`

Archivo: [near-dropdown.js](/home/walter/idoneos/nearComponents/near-dropdown.js)

Reemplaza menus tipo `mwc-menu`.

Ejemplo:

```html
<near-dropdown align="end">
  <button slot="trigger" type="button">Menu</button>
  <a class="near-menu-item" href="/profile">Profile</a>
  <button class="near-menu-item" type="button">Logout</button>
</near-dropdown>
```

API:

- propiedad `open`
- metodo `openMenu()`
- metodo `closeMenu()`
- metodo `toggleMenu(force?)`
- eventos `near-opened` y `near-closed`

### Tokens y estilos base

Archivo: [ui.css.js](/home/walter/idoneos/nearComponents/ui.css.js)

Expone:

- `nearPicoTokens`
- `nearControlStyles`
- `nearMenuSurfaceStyles`

Uso recomendado:

```js
import { LitElement, css, html } from 'lit-element';
import { nearPicoTokens, nearControlStyles } from './ui.css.js';

class ExampleElement extends LitElement {
  static get styles() {
    return [
      nearPicoTokens,
      nearControlStyles,
      css``
    ];
  }
}
```

## Reemplazos recomendados

### `mwc-icon`

Usar `near-icon`.

Antes:

```html
<mwc-icon>menu</mwc-icon>
```

Despues:

```html
<near-icon name="menu"></near-icon>
```

### `mwc-button`

Usar `button` nativo con `nearControlStyles`.

Antes:

```html
<mwc-button raised>Ingresar</mwc-button>
```

Despues:

```html
<button type="button" data-variant="primary">Ingresar</button>
```

### `mwc-icon-button`

Usar `button.near-icon-button`.

Antes:

```html
<mwc-icon-button icon="menu"></mwc-icon-button>
```

Despues:

```html
<button type="button" class="near-icon-button" aria-label="Menu">
  <near-icon name="menu"></near-icon>
</button>
```

### `mwc-menu` + `mwc-list-item`

Usar `near-dropdown` + anchors/buttons con clase `.near-menu-item`.

### `mwc-drawer`

Usar shell propia con:

- header propio
- `aside.drawer-panel`
- `div.drawer-backdrop`
- estado `drawerOpen`
- estado `drawerStatic`

### `mwc-top-app-bar-fixed`

Usar `header.toolbar` propio dentro de [app.js](/home/walter/idoneos/nearComponents/app.js).

## Cambios importantes para apps consumidoras

Las apps que usan este repo deberian asumir estos cambios:

- Ya no existe dependencia implícita en `Material Icons`.
- Los menus ya no usan la API/eventos de MWC.
- Los botones ya no exponen comportamiento MWC.
- El layout principal de `NearApp` usa drawer propio.
- Analytics no es obligatorio.
- `lit-html` queda como dependencia directa porque varios modulos importan directivas en forma explicita.

## `NearApp`

Componente base:

- [app.js](/home/walter/idoneos/nearComponents/app.js)
- custom element: `near-app-base`

Puntos a tener en cuenta:

- toolbar propia
- drawer propio
- menu de edicion con `near-dropdown`
- integracion con `near-user`
- carga diferida del stack de edicion para no arrastrar UI vieja en la shell inicial

Para proyectos nuevos, conviene derivar de `NearApp` y sobreescribir solo:

- `topBarTitle()`
- `pageChanged()`
- `internalPage()`
- `routePageChanged()` si hace falta normalizar rutas

## `NearUser`

Componentes:

- [user.js](/home/walter/idoneos/nearComponents/user.js)
- [nearapi.js](/home/walter/idoneos/nearComponents/nearapi.js)
- custom element: `near-user`

Notas:

- Ambos siguen existiendo porque cubren contextos distintos.
- La UI ya no depende de MWC.
- Se agrego [analytics.js](/home/walter/idoneos/nearComponents/analytics.js) para que `ga()` sea opcional.

## Routing

Archivo: [route.js](/home/walter/idoneos/nearComponents/route.js)

Expone:

- `NearLocation`
- `NearRoute`

Uso:

```html
<a is="near-route" href="/app/section">Section</a>
```

o programaticamente:

```js
NearRoute.navigate('/app/section');
```

## Demos

### Demo de primitives

```bash
pnpm install
pnpm dev:demo
```

Abre `/demo/`.

Sirve para probar:

- tokens `--pico-*`
- `near-icon`
- `near-dropdown`
- dark/light theme
- `NearRoute` y `NearLocation`

### Smoke app real con `NearApp`

```bash
pnpm dev:app
```

Abre `/demo/app/`.

Sirve para probar:

- `NearApp` real
- toolbar
- sidebar fijo en desktop
- drawer overlay en mobile
- integracion con `near-user`
- rutas reales de shell

### Build de demo

```bash
pnpm build:demo
```

## Dependencias

Runtime:

- `lit-element`
- `lit-html`

Dev:

- `es-dev-server`
- `rollup`
- `@rollup/plugin-node-resolve`

Gestor de paquetes preferido:

```bash
pnpm
```

## Estrategia para migrar proyectos consumidores

Orden recomendado:

1. Actualizar imports y quitar `@material/*`.
2. Reemplazar iconos por `near-icon`.
3. Reemplazar menus por `near-dropdown`.
4. Reemplazar botones MWC por `button` nativo.
5. Ajustar layout si la app derivaba de `NearApp`.
6. Recién despues migrar flujos de edicion avanzados.

## Checklist de limpieza final

- `rg "@material|mwc-" .`
- `rg "Material Icons|fonts.googleapis.com" .`
- `rg -- "--mdc-" .`

El objetivo es que esos barridos terminen vacios, salvo codigo legacy que se esté migrando activamente.

## Criterio de aceptacion

Se considera una migracion correcta cuando:

- la app ya no depende de MWC
- la app no usa `Material Icons`
- la shell principal funciona con Shadow DOM
- menus, drawer y auth funcionan sin dependencias de UI externas pesadas
- el refactor deja menos capas, no mas
