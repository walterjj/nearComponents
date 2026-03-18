import {LitElement, html, css } from 'lit-element'
import './near-icon.js';



export class NearEditable extends LitElement{

        static get styles() {
                return css`
                        :host{display:block}
                        .dimmer{position:fixed;top:0;bottom:0;left:0;right:0;z-order:50;background-color:#fffc;}
                        label{position:relative;font-size:small;z-order:100}
                        button{
                                font-size:20px;
                                color:#8888;
                                float:right;
                                cursor:pointer;
                                border:none;
                                background:transparent;
                                box-shadow:none;
                                padding:0;
                                min-height:auto;
                        }
                        button:hover{color:#8884}
                
                `;
        }
 
        constructor(el){
                super();
                this.editing=false;
                if(el && el!==undefined)
                        this.el=el;
                
        }

        renderEditing(){
                return html`<div class="dimmer"></div><label>${this.el.title}<button type="button" @click="${this.endEdit}" aria-label="done"><near-icon name="done"></near-icon></button>
                        <input @keyup="${this.handleKeyUp}" type="text" id="edit" value="${this.value}"/></label>`
        }

        render(){
                if(this.editing)
                        return this.renderEditing();

                return html`<button type="button" @click="${this.startEdit}" aria-label="edit"><near-icon name="edit"></near-icon></button><slot></slot>`

        }

        handleKeyUp(e){
                if(e.key=="Enter")
                        this.endEdit(e);
        }

        get value(){
                return this.el.innerText;
        }

        endEdit(e){
                this.editing=false;
                this.el.innerText=this.shadowRoot.getElementById("edit").value;
                this.requestUpdate();

        }

        startEdit(e){
                this.editing=true;
                //this.el.contentEditable=true;
                //this.el.focus();
                this.requestUpdate();
                console.log(this)
        }

        log(){
                console.log(this);
        }
}

export function setEditable(el){
        el.attachShadow({mode:"open"});
        el.shadowRoot.appendChild(new NearEditable(el))
        el.shadowRoot.appendChild(document.createElement("slot"))
}

customElements.define("near-editable",NearEditable);
