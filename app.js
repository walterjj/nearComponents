/**
@license

*/

import { NearUser } from "./user.js";
import { LitElement, html, css } from 'lit-element';
import { NearLocation, NearRoute } from './route.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import './near-icon.js';
import './near-dropdown.js';
import './drawerbutton.js';
import { trackGa } from './analytics.js';
import { nearPicoTokens, nearControlStyles } from './ui.css.js';


export class NearApp extends LitElement {


        static get styles() {
                return [
                nearPicoTokens,
                nearControlStyles,
                css`
  
                :host {
                        --swiper-right: 2em;
                        --container-max-width: 1024px;
                        --toolbar-width: 100%;
                        --near-toolbar-height: 50px;
                        display: block;
                        }
                a {
                        font-size: inherit;
                }
                @media only screen and (min-width:993px) {
                        :host {
                                --container-max-width: 70%;     
                        }

                }

                .toolbar {
                        position:sticky;
                        top:0;
                        z-index:1000;
                        box-sizing:border-box;
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:1rem;
                        height:var(--near-toolbar-height);
                        padding:0 1rem;
                        width:100%;
                        font-size:14px;
                        color:var(--near-primary-inverse, #fff);
                        background:var(--near-primary-background, #034);
                        box-shadow:var(--near-box-shadow);
                }
                .toolbar img {vertical-align:middle}
                .toolbar-main,
                .toolbar-actions {
                        display:flex;
                        align-items:center;
                }
                .toolbar-main {
                        gap:0.75rem;
                        min-width:0;
                        flex:1 1 auto;
                }
                .toolbar-actions {
                        gap:0.75rem;
                        justify-content:flex-end;
                        flex:1 1 auto;
                }
                .toolbar-title {
                        min-width:0;
                        font-size:1.05rem;
                        font-weight:600;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                }
                .toolbar-menu-button {
                        color:inherit;
                        border-color:transparent;
                        background:transparent;
                        box-shadow:none;
                }
                .toolbar-menu-button:hover,
                .toolbar-menu-button:focus-visible {
                        color:inherit;
                        border-color:rgb(255 255 255 / 0.35);
                        background:rgb(255 255 255 / 0.12);
                }
                .toolbar-nav {
                        display:flex;
                        align-items:center;
                        gap:0.25rem;
                        flex-wrap:wrap;
                }
                .toolbar-nav a,
                .toolbar-nav button,
                .topbar-item {
                        margin:0;
                        border:1px solid transparent;
                        border-radius:999px;
                        display:inline-flex;
                        align-items:center;
                        gap:0.4rem;
                        padding:0.625rem 0.875rem;
                        position:relative;
                        cursor:pointer;
                        text-decoration: none;
                        color:inherit;
                        background:transparent;
                        font:inherit;
                        font-variant-caps:small-caps !important;
                }
                .toolbar-nav a:hover,
                .toolbar-nav button:hover,
                .topbar-item:hover,
                .toolbar-nav a.near-selected,
                .toolbar-nav button.near-selected,
                .topbar-item.near-selected {
                        border-color:rgb(255 255 255 / 0.3);
                        background:rgb(255 255 255 / 0.12);
                        color:inherit;
                }
                .toolbar-nav near-dropdown::part(panel) {
                        margin-top:0.25rem;
                }
                .toolbar-nav near-dropdown .near-menu-item,
                .toolbar-actions near-dropdown .near-menu-item {
                        color:var(--near-color);
                }
                .toolbar-user {
                        display:flex;
                        align-items:center;
                }
                .app-shell {
                        position:relative;
                        display:block;
                        min-height:calc(100vh - var(--near-toolbar-height));
                }
                .drawer-backdrop {
                        position:fixed;
                        inset:0;
                        background:rgb(15 23 34 / 0.45);
                        opacity:0;
                        pointer-events:none;
                        transition:opacity 160ms ease;
                        z-index:990;
                }
                .drawer-panel {
                        position:fixed;
                        top:var(--near-toolbar-height);
                        left:0;
                        bottom:0;
                        width:min(19rem, calc(100vw - 2rem));
                        padding:1rem 0;
                        border-right:1px solid var(--near-border-color);
                        background:var(--near-surface-color, #fff);
                        box-shadow:var(--near-box-shadow);
                        overflow:auto;
                        transform:translateX(-105%);
                        transition:transform 160ms ease;
                        z-index:995;
                }
                .app-shell.drawer-open .drawer-backdrop {
                        opacity:1;
                        pointer-events:auto;
                }
                .app-shell.drawer-open .drawer-panel {
                        transform:translateX(0);
                }
                .app-shell.drawer-static {
                        padding-left:18rem;
                }
                .app-shell.drawer-static .drawer-backdrop {
                        display:none;
                }
                .app-shell.drawer-static .drawer-panel {
                        width:18rem;
                        transform:none;
                }
                .drawer-header {
                        display:grid;
                        gap:0.25rem;
                        padding:0 1.25rem 1rem;
                        border-bottom:1px solid var(--near-border-color);
                        margin-bottom:1rem;
                }
                .drawer-title {
                        font-size:1rem;
                        font-weight:700;
                        color:var(--near-color);
                }
                .drawer-content div > a,
                .drawer-link{
                        display:block;
                        text-align:left;
                        margin:0 0.75rem;
                        padding:.65rem .8rem;
                        border-radius:0.75rem;
                        color:var(--near-color);
                        cursor:pointer;
                        text-decoration: none;
                }
                .drawer-content div > a:hover,
                .drawer-link:hover,
                .drawer-link.near-selected {
                        background:var(--near-primary-soft);
                        color:var(--near-primary);
                }
                .drawer-group-title{
                        font-size: 0.8rem;
                        font-weight:700;
                        letter-spacing:0.08em;
                        text-transform:uppercase;
                        text-align:left;
                        color:var(--near-muted-color);
                        margin:0 1.5rem 0.75rem;
                }
                .drawer-group-separator{
                        width:calc(100% - 3rem);
                        border-top:solid 1px var(--near-border-color);
                        margin:1rem 1.5rem;
                }
                .menu-trigger near-icon {
                        font-size:0.95em;
                }
                #app-content {
                        min-width:0;
                }


                .main-content{
                        
                        min-height:calc(100vh - var(--near-toolbar-height));
                        text-align:left;
                        margin:1em;
                }

                #pages {
                        border-bottom:solid  1px #8884;
                        display:block;
                }
                #pages:empty {border:none}
                #pages > a {
                        border: 1px solid transparent;
                        border-radius: 4px 4px 0 0; 
                        position:relative;
                        bottom:-1px;
                        padding:.5em;
                        font-size:14px;
                        margin:0;
                        color:#08f;
                }
                #pages > a.near-selected {
                        border: 1px solid #8884;
                        border-bottom-color: transparent;
                        background-color:white;
                }

                .screen{
                        display: flex;        
                        flex-direction: column;
                        justify-content:center;
                        text-align: center;
                        height: calc(100vh - 60px);
                }


                header {
                        position:relative;
                        @apply --layout-horizontal;
                        @apply --layout-center-center;
                        height: calc(100vh - var(--near-toolbar-height));
                        padding: 0 16px;
                        background-image: url('/jm1440.jpg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-color: #034;
                        color: white;
                        text-align: center;
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                        

                }


                .banner {
                        background-image: url('/banner.jpg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-color: #034;
                        color: white;
                        text-align: left;
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                        margin:-1em;
                        

                }
                .banner > div {
                        max-width:800px;
                        display:flex;
                        padding-top:32px;
                        margin:0 auto ;
                        align-items:center;
                        width:100%;
                }

                .banner  img {max-width:100px;max-height:100px; opacity:.7;}
                .banner  h2 {
                        font-size: 30px;
                        font-weight: 900;
                        
                }

                .main-contentsection {
                        padding: 88px 16px;
                        min-height: calc(50vh - var(--near-toolbar-height));
                }

                header.banner {
                        height:10vh;

                }

                header > img {max-width:150px; opacity:.5}

                header >  h2 {
                        font-size: 56px;
                        font-weight: 300;
                        margin: 0;
                        
                }
                header h2 {
                        font-size: 56px;
                        font-weight: 300;
                        font-weight: 300;
                        margin: 0;
                        
                }

                header > p {
                        font-size: 32px;
                        
                }
                header  p {
                        font-size: 32px;
                        margin:0;
                        
                }
                header  blockquote {
                        position:absolute;
                        bottom:0;
                        right:0;
                        font-variant:normal;
                        max-width:400px;
                        margin:2em;
                        
                }
                header  blockquote > author {
                        margin-top:1em;
                        text-align:right;
                        display:block;
                }

                #mdsection {
                        padding: 1em 0px;
                        nfont-family: 'Cormorant Garamond', serif;
                        min-height: calc(50vh - var(--near-toolbar-height));
                }
                
                

                .container{clear:both}

                .container {
                        max-width: var(--container-max-width);
                        margin: 0 auto;
                }

                .container > * {
                        @apply --layout-flex;
                }

                .container img {
                        max-width: 100%;
                        max-height: 100%;
                }

                .ncontainer h3 {
                        font-size: 32px;
                        font-weight: 300;
                        margin: 24px 0;
                }

                .container p {
                        line-height: 1.5;
                }

                :root {
                        --container: {
                                max-width: var(--container-max-width);
                                margin: 0 auto;
                        };
                }


                @media (min-width: 600px) {
                        .toolbar iron-selector { display:inherit}
                }

                @media (max-width: 600px) {
                        .container {
                        @apply --layout-vertical;
                        }
                        header h2  {
                        font-size: 30px;
                        }
                        .banner h2 {
                        font-size: 20px;
                        }
                        header p { font-size:25px}
                        header {
                        @apply --layout-vertical;
                        }
                        header blockquote {
                        font-size:14px;
                        
                        }
                
                        .toolbar {
                        font-size:12px;
                        }
                        .tabs a {
                        margin: 12px 8px 12px;
                        }
                        

                }
                @media (max-width: 900px) {
                        .toolbar {
                                flex-wrap:wrap;
                        }
                        .toolbar-actions {
                                width:100%;
                                justify-content:space-between;
                        }
                        .toolbar-nav {
                                order:2;
                                width:100%;
                                overflow:auto;
                                flex-wrap:nowrap;
                                padding-bottom:0.25rem;
                        }
                }
                @media (max-width: 700px) {
                        .app-shell.drawer-static {
                                padding-left:0;
                        }
                        .app-shell.drawer-static .drawer-panel {
                                width:min(19rem, calc(100vw - 2rem));
                                transform:translateX(-105%);
                        }
                        .app-shell.drawer-static.drawer-open .drawer-panel {
                                transform:translateX(0);
                        }
                        .app-shell.drawer-static .drawer-backdrop {
                                display:block;
                        }
                        .toolbar-actions {
                                align-items:flex-start;
                        }
                        .toolbar-user {
                                margin-left:auto;
                        }
                }

                h3 {
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                }

                        
                figure{
                        text-align:center;
                        margin-inline-start:0;
                        margin-inline-end:0;
                        margin-block-start:0;
                        margin-block-end:0 }
                figure img, figure video, figure iframe {max-width:100%}
                figcaption{color:#888; font-size:small; font-style: italic;margin:.5em }  
                
                blockquote {color:#777; font-style:italic; font-size:larger;}

                .collapse {display:none !important}

                @media (min-width: 600px) {
                        .collapse {display:inline-block !important}
                        .toolbar iron-selector { display:inherit}
                        figure[right]{float:right; max-width:60%; margin:1em 0 1em 1em;}
                        figure[right] img, figure[left] img {}
                        figure[left]{float:left;  max-width:60%; margin:1em 1em 1em 0;}
                }
                .spinner,.spinner:after{
                        width:64px;
                        height:64px;
                        min-width:64px;
                        min-height:64px;
                        display:block;
                        nposition: fixed;
                        ntop: 50%;
                        nleft: 50%;
                        margin:32px auto; 
                        border-radius: 50%;
                }
                .spinner {
                        background-color: transparent;
                        border-top: 3px solid rgb(66,139,202);
                        border-right: 3px solid rgb(66,139,202);
                        border-bottom: 3px solid rgb(66,139,202);
                        border-left: 3px solid rgba(66,139,202,.2);
                        transform: translateZ(0);
                        animation-iteration-count: infinite;
                        animation-timing-function: linear;
                        animation-duration: .8s;
                        animation-name: spinner-loading
                }
                @keyframes spinner-loading{
                        0% {
                        transform: rotate(0deg)
                        } to {
                        transform: rotate(1turn)
                        }
                }


 
                

                h1{font-size:3em; line-height:1.1} 
                .byline,.dateline{border:none;font-size:small; text-align:right}
                .byline{font-weight:bold}
                .byline img{ margin: 0 1em 0 0; display:inline-block; max-width:50px;
                clip-path: circle(50% at center); float:left;}  
                .byline{font-weight:bold}
                .dateline{color:#8888}
                #home-swiper {height:50vh}
                @media (min-width:1000px) {
                        #home-swiper {height:90vh} 
                }
                
                .toc li{list-style-type:none}
                
        `
        ];

        }
        renderDrawerItem(item) {
                return html`
                        <a class="drawer-link ${this.isCurrentPath(item.href) ? 'near-selected' : ''}" is="near-route" href="${item.href}">${item.label}</a>
                `
        }
        renderDrawerList(item) {
                return html`
                        <div class="drawer-group-title">${item.label}</div>
                        ${item.items?.map(item => {
                        return this.renderDrawerItem(item)
                })}
                <div class="drawer-group-separator"></div>
                `
        }

        renderDrawerApps(icon="label") {
                let r=[];
                if(NearUser.instance && NearUser.instance.groups){
                        NearUser.instance.groups
                                .filter(group=>group.startsWith("app:"))
                                .forEach(group=>{
                                        let name=group.substring(4);
                                        r.push(
                                                html`<drawer-button icon="${icon}" href="/app/${name}/">${name.replace('_', ' ')}</drawer-button>`
                                        );
                                });
                }
                return r;
        }

        isCurrentPath(href='') {
                if (!href) return false;
                const pathname = window.location.pathname;
                return pathname === href || pathname.endsWith(href);
        }

        renderMenuItem(item) {
                return html`
                <a
                        class="topbar-item ${this.isCurrentPath(item.href) ? 'near-selected' : ''}"
                        data-route-link
                        is="near-route"
                        href="${item.href}"
                >${item.label}</a>
        `
        }

        renderMenuList(item) {
                return html`
                        <near-dropdown align="start">
                                 <button type="button" class="topbar-item menu-trigger" slot="trigger">
                                         ${item.label}
                                         <near-icon name="arrow_drop_down"></near-icon>
                                 </button>
                                ${item.items?.map(item => {
                                        return html`
                                        <a class="near-menu-item" is="near-route" href="${item.href}">${item.label}</a>
                                        `
                                        
                                })}
                        </near-dropdown>
        `
        }


        drawerMenu() {
                let r=[];
                if(this.component) r.push(html`${unsafeHTML(this.component.drawerMenu(this.page))}`); 
                r.push (html`
                ${this.navigationMenu?.items?.map(item => {
                        return item.items ? this.renderDrawerList(item) : this.renderDrawerItem(item)
                })}        
                `);
                r.push(this.renderDrawerApps());
                return r;
        }

        menu() {
                return html`
        
                ${this.navigationMenu?.items?.map(item => {
                        return item.items ? this.renderMenuList(item) : this.renderMenuItem(item)
                })}
          `;
        }

        pageMenu() {
                if (NearUser.canCreate() || NearUser.canEdit())
                        return html`
          <near-dropdown id="edit-menu" align="start">
            <button type="button" class="topbar-item menu-trigger" slot="trigger">Edit...
              <near-icon name="arrow_drop_down"></near-icon>
            </button>
            ${NearUser.canCreate() ?
                                        html`<button type="button" class="near-menu-item" @click="${this.newArticle}">New Article...</button>
            <button type="button" class="near-menu-item" @click="${this.articles}">Articles...</button>
            ` : ''}

            ${NearUser.canEdit() ?
                                        html`<button type="button" class="near-menu-item" @click="${this.editMeta}">Edit Meta...</button>
            `: ''}
 
            ${NearUser.canAdmin() ?
                                        html`
            <button type="button" class="near-menu-item" @click="${this.newContent}">Admin: New Content...</button>
            <button type="button" class="near-menu-item" @click="${this.invalidate}">Admin: Clear CDN Cache</button>
            `
                                        : ''}

            </near-dropdown>
         `
                return ''

        }

        userExtra() { }

        topBarTitle() {
                return html`${this.title}`;
        }

        renderTopBar() {
                return html`<header class="toolbar">
          <div class="toolbar-main">
          <button type="button" class="near-icon-button toolbar-menu-button" @click="${this.handleNavigationClick}" aria-label="Open navigation">
            <near-icon name="menu"></near-icon>
          </button>
          <div class="toolbar-title">${this.topBarTitle()}</div>
          </div>

          <div class="toolbar-actions">
          <nav class="toolbar-nav" role="navigation">
          ${this.menu()}
          ${this.pageMenu()}
          ${this.userExtra()}
          ${this.component && this.component.navMenu ? this.component.navMenu() : ''}
          </nav>
          <near-user
          class="toolbar-user"
          poolId="${this.poolId}"
          clientId="${this.clientId}"
          baseURL="${this.baseURL}"
          apiURL="${this.apiURL}" 
          lang="${this.lang}"
          @user-ready="${this.onUserReady}"
          @user-logout="${this.onUserLogout}"
          signInLabel="${this.signInLabel}"
          ?noregister="${this.noregister}"
          >user</near-user> 
          </div>
          </header>`
        }

        render() {

                return html`
        ${this.fixedTopBar ? this.renderTopBar() : ""}
        <div class="app-shell ${this.drawerStatic ? 'drawer-static' : ''} ${this.drawerOpen ? 'drawer-open' : ''}">
        <div class="drawer-backdrop" @click="${this.closeDrawer}"></div>
        <aside id="drawer" class="drawer-panel" @click="${this.handleDrawerClick}">
        <div class="drawer-header">
        <div class="drawer-title">${this.topBarTitle()}</div>
        </div>
        <div class="drawer-content">
                <div  id="drawer-menu" class="ntabs" role="navigation" >
                ${this.drawerMenu()}
                </div>
        </div>
        </aside>
        <div id="app-content">
        ${this.fixedTopBar ? "" : this.renderTopBar()}         
                <div class="main-content">     
                ${this.internalPage()}
                
                </div>
                <site-footer></site-footer> 
        </div>
        </div>`

        }

        static get properties() {
                return {
                        page: {
                                type: String,
                                reflectToAttribute: true
                        },
                        mode: {
                                type: String,
                                value: "home"

                        },
                        routeData: Object,
                        fixedTopBar: {
                                type: Boolean,
                                default: false
                        },
                        subroute: Object,
                        signedLoad: {
                                type: Boolean,
                                default: true
                        },
                        signedIn: {
                                type: Boolean,
                                default: false
                        },
                        drawerOpen: {
                                type: Boolean,
                                reflect: true
                        }
                };
        }



        constructor() {
                super();
                this.signedLoad = true;
                this.drawerOpen = false;
                this.drawerStatic = false;
                this.addEventListener("end-edit", this.endEdit.bind(this));

        }

        contentFile(path) {
                //console.log(path!=="/"? path+'.h': '/index.h')
                if (path.endsWith(".html")) return path.slice(0, -5) + '.h';
                return (path.endsWith("/") ? path + 'index.h' : path + '.h');
        }

        propsFile(path) {
                //console.log(path!=="/"? path+'.h': '/index.h')
                if (path.endsWith(".html")) return path.slice(0, -5) + '.json';
                return (path.endsWith("/") ? path + 'index.json' : path + '.json');
                //return(path!=="/"? path+'.json': '/index.json');
        }

        importComponent(name) {
                let match = window.decodeURIComponent(window.location.pathname).match(/.*\//);
                let folder = match ? match[0] : '';
                console.log("importComponent ", NearUser.instance.baseURL + folder + name + '.js')
                return import(NearUser.instance.baseURL + folder + name + '.js');
        }

        internalPage() {
                if(this.component) return html`${unsafeHTML(this.component.content(this.page))}`; 
        }

        firstUpdated() {
                document.body.removeAttribute('unresolved');
                this.nearLocation = new NearLocation(
                        this.routePageChanged.bind(this),
                        this.hashChanged.bind(this));
                //this.pageChanged(this.page);
                if (this.convertible) {
                        window.onresize = this.checkConvertible.bind(this);
                        setTimeout((() => { this.checkConvertible() }).bind(this), 500);
                }
                if(this.component && this.component.firstUpdated) this.component.firstUpdated(this);
        }

        checkConvertible() {
                console.log("resize");
                this.drawerStatic = window.innerWidth >= 800;
                this.drawerOpen = this.drawerStatic;
                this.requestUpdate();
        }

        updated() {
                super.updated();
                if(this.component && this.component.updated) this.component.updated(this);
                //this.pageChanged(this.page);
        }

        hashChanged(nearLocation) {
                return;
                let element = this.shadowRoot.getElementById(nearLocation.hash);
                if (element)
                        element.scrollIntoView({ behavior: "smooth" });
        }

        routePageChanged(nearLocation) {
                // Show the corresponding page according to the route.
                //
                // If no page was found in the route data, page will be an empty string.
                // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.

                let page = nearLocation.path.slice(1);
                console.log('routePageChanged:' + page);
                if (!page) {
                        this.page = '';
                        this.mode = 'home';
                } else if (page == "contact") {
                        this.mode = "contact"
                }
                else if (true || ['mission', 'leadership', 'forum', 'contact'].indexOf(page) !== -1) {
                        this.page = page;
                        this.mode = "mdsection";
                } else {
                        this.page = 'view404';
                }

                if (!this.drawerStatic) this.drawerOpen = false;
                window.scrollTo(0, 0);
                this.pageChanged(this.page);

        };

        onUserReady(e) {
                console.log('user ready');
                this.signedIn = true;
                this.requestUpdate();
                this.pageChanged(window.location.pathname);
                //render(this.drawerMenu(),this.shadowRoot.getElementById("drawer-menu"))

        }

        onUserLogout(e) {
                this.signedIn = false;
                console.log('user logout');
                this.requestUpdate();
        }

        endEdit(e) {
                if (!NearUser.instance.canEdit()) return;
                const editor = document.querySelector("#content");//e.target;
                const u = NearUser.instance;
                let path = this.contentFile(window.decodeURIComponent(window.location.pathname));
                console.log("write:", path)
                let tasks = [];
                tasks.push(u.put(path, editor.innerHTML, "text/html"));
                if (this.metaDirty) {
                        let props = this.propsFile(window.decodeURIComponent(window.location.pathname));
                        tasks.push(u.put(props, JSON.stringify(this.meta), "text/json"));
                }

                Promise.all(tasks).then(() => {
                        if (this.invalidateOnEndEdit) this.buildPage();
                })
                        .catch(e => console.log(e));
        }

        fixLocalLinks(element = this) {
                //const links=this.shadowRoot.querySelectorAll("a");
                const links = element.querySelectorAll("a");
                links.forEach(link => {
                        let href = link.getAttribute('href');
                        if (href
                                && !href.startsWith('http')
                                && !href.startsWith('//')
                                && !href.startsWith('#')) {
                                link.addEventListener('click', NearRoute.prototype.clickHandler.bind(link));
                                link.setAttribute("is", "near-route");
                        }
                })
        }

        makeImagesLazy(content, swapSrc = true) {
                let lazyImages = content.querySelectorAll("img");

                if ("IntersectionObserver" in window) {
                        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                                entries.forEach(function (entry) {
                                        if (entry.isIntersecting) {
                                                let lazyImage = entry.target;
                                                if (lazyImage.dataset.src)
                                                        lazyImage.src = lazyImage.dataset.src;
                                                //lazyImage.srcset = lazyImage.dataset.srcset;
                                                lazyImage.classList.remove("lazy");
                                                lazyImageObserver.unobserve(lazyImage);
                                        }
                                });
                        });

                        lazyImages.forEach(function (lazyImage) {
                                if (swapSrc) {
                                        lazyImage.dataset.src = lazyImage.src;
                                        lazyImage.src = "data:,";
                                }
                                lazyImageObserver.observe(lazyImage);
                        });
                }
        }


        onMeta(meta) {
                console.log("meta", this.meta);
                let e;
                if (meta.title) {
                        if (e = document.querySelector('title')) e.innerHTML = meta.title;
                        if (e = document.querySelector('meta[property="og:title"]')) e.setAttribute("content", meta.title);
                }
                if (meta.description) {
                        if (e = document.querySelector('meta[name="description"]')) e.setAttribute("content", meta.description);
                        if (e = document.querySelector('meta[property="og:description"]')) e.setAttribute("content", meta.description);
                }
                if (meta.canonical) {
                        if (e = document.querySelector('link[rel="canonical"]')) e.setAttribute("href", meta.canonical);
                        if (e = document.querySelector('meta[property="og:url"]')) e.setAttribute("content", meta.canonical);
                }
                else if (meta.url) {
                        if (e = document.querySelector('link[rel="canonical"]')) e.setAttribute("href", meta.url);
                        if (e = document.querySelector('meta[property="og:url"]')) e.setAttribute("content", meta.url);
                }
                if (meta.image) {
                        if (e = document.querySelector('meta[property="og:image"]')) e.setAttribute("content", meta.image);
                }
                if (meta.pages && (e = this.shadowRoot.getElementById("pages"))) {
                        e.innerHTML = "";
                        meta.pages.forEach((page) => {
                                let a = document.createElement("a", { is: 'near-route' });
                                a.setAttribute("href", page.filename);
                                a.innerHTML = page.name;
                                if (window.location.pathname.endsWith(page.filename) ||
                                        (window.location.pathname.endsWith('/') && page.filename == 'index.html'))
                                        a.classList.add('near-selected');
                                e.appendChild(a);
                        });

                }
                if (meta.toc && (e = this.shadowRoot.getElementById("toc"))) {
                        e.innerHTML = meta.toc;
                }
                if (meta.breadcrums && (e = document.getElementById("top"))) {
                        e.innerHTML = meta.breadcrums;
                }
        }

        onContent(content) {
                this.content = content;
        }

        initEditor(content = null) {
                const editorModulePath = './editor.js';
                import(editorModulePath);
                if (!content) content = document.querySelector("#content");
                content.outerHTML = '<div  id="content" is="near-editor"></div>';
                content = document.querySelector("#content");
                //if(NearUser.instance.canEdit()) 
                //        this.addEventListener("end-edit",this.endEdit.bind(this));
                return content;
        }

        pageChanged(page) {
                let baseURL = NearUser.instance ? NearUser.instance.baseURL : "";
                console.log('pageChanged:' + page);
                trackGa('set', 'page', window.location.pathname);
                trackGa('send', 'pageview');
                if (this.component) {
                        this.component.destroy && this.component.destroy(this);
                        this.component=null;
                }        
                if(this.page.startsWith('app/')){
                        this.importComponent("component").then(component=>{
                                this.component=component;
                                this.component.init && this.component.init(this,this.page,NearUser,{LitElement,html,css});
                                this.requestUpdate();
                        })
                        .catch(()=>this.component=null);
                        return;        
                } 

                this.meta = null; this.content = null;
                let content = document.querySelector("#content");
                content.innerHTML = "";

                if (content) {
                        let contentFile = this.contentFile(window.decodeURIComponent(window.location.pathname));
                        let propsFile = this.propsFile(window.decodeURIComponent(window.location.pathname));
                        if (this.signedLoad && NearUser.instance.canEdit()) {
                                console.log("via GET")
                                NearUser.instance.get(contentFile)
                                        .then((response) => {
                                                if (response.ok)
                                                        response.text().then(text => {
                                                                if (!text.startsWith("<near-")) {
                                                                        content = this.initEditor(content);
                                                                }
                                                                content.innerHTML = text;
                                                                this.fixLocalLinks();
                                                                this.hashChanged(this.nearLocation);
                                                                if(content.slotUpdated) content.slotUpdated();
                                                                //setTimeout(e=>{console.log("GET OK");},1000);
                                                        });
                                                else {
                                                        content.innerHTML = 'NONONON';
                                                        content = this.initEditor(content);
                                                }

                                        })
                                        .catch(error => console.log("e get", error))
                                NearUser.instance.get(propsFile)
                                        .then((response) => {
                                                if (response.ok)
                                                        response.json().then(meta => {
                                                                this.meta = meta;
                                                                this.onMeta(meta);
                                                        });
                                                else this.meta = {};

                                        })
                                        .catch(error => console.log("e get", error));
                                return;
                        }
                        else fetch(NearUser.instance.baseURL + contentFile)
                                .then((response) => {
                                        if (response.ok)
                                                response.text().then(text => {
                                                        content.innerHTML = text;
                                                        this.fixLocalLinks();
                                                        this.makeImagesLazy(content);
                                                        this.onContent(content);
                                                        this.hashChanged(this.nearLocation);
                                                        document.body.removeAttribute('unresolved');
                                                });
                                        else content.innerHTML = '';
                                })
                                .catch(error => console.log("e fetch", error));
                        fetch(NearUser.instance.baseURL + propsFile)
                                .then((response) => {
                                        if (response.ok) {
                                                response.json().then(meta => {
                                                        this.meta = meta;
                                                        this.onMeta(meta);
                                                });

                                        }
                                        else this.meta = {};

                                })
                                .catch(error => console.log("e fetch", error))
                }

        };

        handleNavigationClick() {
                console.log("navigationClick");
                this.drawerOpen = !this.drawerOpen;
                trackGa('send', 'event', 'UI', 'menu', window.location.href);
        }


        fixToolbar() {
                return;
        }

        drawerOpened() {
                this.fixToolbar();
        }

        drawerClosed() {
                this.fixToolbar();
        }

        openDrawer() {
                this.drawerOpen = true;
        }
        closeDrawer() {
                this.drawerOpen = false;
        }


        openMenuByName(name) {
                let menu = this.shadowRoot.getElementById(name + '-menu');
                if (menu && menu.openMenu)
                        menu.openMenu();
                else if (menu && menu.toggleMenu)
                        menu.toggleMenu();

        }
        openMenu(e) {
                this.openMenuByName(e.target.name);
        }

        handleDrawerClick(e) {
                if (this.drawerStatic) return;
                const action = e.composedPath().find(node => node?.tagName === 'A');
                if (action) this.closeDrawer();
        }

        buildPage(e) {
                if (NearUser.instance && NearUser.instance.canEdit()) {
                        NearUser.instance.buildPage(window.location.pathname).then(() => {
                                if (this.invalidateOnEndEdit) this.invalidate();
                        })
                                .catch(e => console.log(e));;
                        console.log("buildPage");
                }
        }


        async createDialogComponent(type = 'content') {
                const modulePath = type === 'article' ? './article.js' : './content.js';
                const module = await import(modulePath);
                const ComponentClass = type === 'article' ? module.NearArticle : module.NearContent;
                return new ComponentClass();
        }

        async newContent(e) {
                let el = await this.createDialogComponent('content');
                el.editonly = true;
                el.editing = true;
                el.addEventListener('content-create', (e) => {
                        console.log(e);
                        let content = e.detail;
                        content.close();
                        window.location.pathname = content.key;
                })
                document.body.appendChild(el);

        }

        async newArticle(e) {
                let el = await this.createDialogComponent('article');
                el.editonly = true;
                el.editing = true;
                el.addEventListener('content-create', (e) => {
                        console.log(e);
                        let content = e.detail;
                        content.close();
                        window.location.pathname = content.key;
                })
                document.body.appendChild(el);

        }

        articles(e) {
                console.warn('articles() is not implemented in NearApp');
        }

        async editMeta(e) {
                let el = null;
                if (this.meta && this.meta.type == "article")
                        el = await this.createDialogComponent('article');
                else
                        el = await this.createDialogComponent('content');
                el.key = window.location.pathname;
                el.editonly = true;
                el.editing = true;
                el.addEventListener('content-edited', this.buildPage)
                document.body.appendChild(el);
        }

        invalidate(e) {
                if (NearUser.instance && NearUser.instance.canEdit()) {
                        let path = window.location.pathname;
                        if (path.endsWith(".html"))
                                path = path.slice(0, -5);
                        path += "*";
                        console.log("try to invalidate", path);
                        NearUser.instance.invalidate(path).then((json) => {
                                console.log("invalidate", json);
                                alert(`Cache cleared for ${path}`);
                        });
                }
        }

        navigate(href) {
                NearRoute.navigate(href);
        }

}

window.customElements.define('near-app-base', NearApp);
