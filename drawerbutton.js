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
                        :host([disabled]) a{
                                pointer-events:none;
                                opacity:0.5;
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
                if(this.href.startsWith("#")) 
                return html`
                        <a href="${this.href}">
                                <mwc-icon>${this.icon || "arrow_right"}</mwc-icon>        
                                <span><slot></slot></span>
                        </a>
                        `
                else        
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
                        disabled: Boolean
                };
        }
}

try {
    window.customElements.define('drawer-button', DrawerButton);
}
catch(e) {

}

