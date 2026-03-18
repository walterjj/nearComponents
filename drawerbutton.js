import { LitElement, html, css } from 'lit-element';
import './near-icon.js';
import { nearPicoTokens } from './ui.css.js';

export class DrawerButton extends LitElement {
        static get styles() {
                return [
                        nearPicoTokens,
                        css`
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
                                background-color:var(--pico-primary-hover, #489DD0);
                                color:var(--pico-primary-inverse, white);
                        }
                        near-icon{
                                flex:none;
                        }
                        span{
                                padding-left:1em;
                        }
                `
                ];
        }

        render() {
                if(this.href.startsWith("#")) 
                return html`
                        <a href="${this.href}">
                                <near-icon name="${this.icon || "arrow_right"}"></near-icon>
                                <span><slot></slot></span>
                        </a>
                        `
                else        
                return html`
                        <a is="near-route" href="${this.href}">
                                <near-icon name="${this.icon || "arrow_right"}"></near-icon>
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
