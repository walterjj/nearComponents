import {LitElement, html, css} from "lit-element";
//import {NearRoute} from './route'
//import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'; 

export class NearMenu extends LitElement {
        static get properties() {
                return {
                  open: { type: Boolean, reflect: true }
                };
        }

        static get styles(){
                return css`
                :host{
                        display:none;
                        nright:0;
                        top:50px;
                        position:absolute;
                        z-index:99999;
                        border:solid 1px;
                        background-color:#00000080;
                        color:white;
                        padding:0;
                        min-width:100px;
                        overflow:visible;
                }
                :host a{color:white; text-decoration:none}
                ::slotted(*) { display:block}
                :host[open] {display:inline-block}                
                `;

        }


        constructor(){
                super();
                this.addEventListener("mouseenter",this.onMouseEnter);
                this.addEventListener("mouseleave",this.closeMenu);
                this.addEventListener("item-selected",this.closeMenu);
                
        }


        
        render (){
                if(this.getBoundingClientRect().right > window.innerWidth) this.style.right="0";
                return html`
                <slot></slot>
                `

        }


        onMouseEnter(e) {
                console.log('onMouseEnter');
                return true;
        }

        openMenu(update=true) {
                this.style.display="block";   
                if (update) 
                        this.setAttribute("open",""); 
        }

        closeMenu(update=true) {
                console.log('close');
                this.style.display="none";
                if (update) 
                        this.removeAttribute("open");
        }

        toggleMenu() {
                this.toggleAttribute("open");
        }

        attributeChangedCallback(name, oldval, newval) {
                //this.requestUpdate();
                //if(newval!=null) this.openMenu();
                if(name==="open") {
                      if(newval!==null) this.openMenu(false);
                      else this.closeMenu(false);  
                }
                console.log('attribute change: ', name, "value:", newval==null);
                super.attributeChangedCallback(name, oldval, newval);
        }
}

export class NearList extends LitElement {
        static get properties() {
                return {
                  open: { type: Boolean, reflect: true }
                };
        }
        static get styles(){
                return css`
                :host{
                        display:block;
                }                
                `;

        }
        constructor(){
                super();
        }

        render (){
                return html`
                <slot></slot>
                `
        }
}

export class NearListItem extends LitElement {
        static get properties() {
                return {
                        label: {type:String, reflect:true},
                        href:  {type:String, reflect:true},
                        isroute:{type:Boolean, reflect:true} 
                };
        }
        static get styles(){
                return css`
                :host{  position:relative;
                        display:block;
                        npadding:1em;
                        cursor:pointer; 
                }
                a{text-decoration:none; color:white; display:block}
                div, a {padding:1em}
                div:hover, a:hover {background-color:#88888888}
                slot{display:none;
                        position:absolute;
                        left: 50%;
                        top:-1em;
                        z-index:99999;
                        border:solid 1px;
                        background-color:#00000080;
                        padding:0;
                        min-width:100px;
                }
                :host ::slotted(*) {nmin-width:200px}
                               
                `;

        }
        constructor(){
                super();
                this.addEventListener("mouseenter",this.onMouseEnter);
                this.addEventListener("mouseleave",this.onMouseLeave);
        }

        onMouseEnter(ev) {
                let slot=this.shadowRoot.querySelector("slot")
                if(slot.assignedElements().length) slot.style.display="block";
                
        }
        onMouseLeave(ev) {
                this.shadowRoot.querySelector("slot").style.display="none";
        }

        itemSelected(e){
                let event = new CustomEvent('item-selected', { 
                        detail: { "item":this,"event":e},
                        bubbles: true, 
                        composed: true });
                    this.dispatchEvent(event);
        }

        link(){
               return html`<a @click="${this.itemSelected}" is="near-route" href="${this.href}">${this.label}</a>`
        }


        div(){
                return html`<div>${this.label}</div>`;
        }

        render (){
                return html`
                ${this.href? this.link() : this.div() }
                <slot></slot>
                `
        }
}



customElements.define("near-menu",NearMenu);
customElements.define("near-list",NearList);
customElements.define("near-list-item",NearListItem);