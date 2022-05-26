import { LitElement, html, css } from 'lit-element';

export class DrawerButton extends LitElement {
        static get styles() {
                return css`
                        :host{
                                display:flex;
                                align-items:center;
                                padding-left:3em;
                                
                        }
                        a{
                                text-decoration:none;
                                display:flex;
                                padding:1em 0.5em;
                                width:100%;
                                color:inherit;
                        }
                        :host(:hover){
                                background-color:#489DD0;
                                color:white;
                        }
                        span{
                                padding-left:1em;
                        }
                `;
        }
        render() {
                return html`
                <a is="near-route" href="${this.href}">
                        <mwc-icon>${this.icon || "arrow_right"}</mwc-icon>        
                        <span><slot></slot></span>
                 </a>
                `
        }

        static get properties() {
                return {
                        icon: String,
                        href: String,
                };
        }
}

try {
    window.customElements.define('drawer-button', DrawerButton);
}
catch(e) {

}

