import {LitElement, html, css } from 'lit-element'
import {Icon} from "@material/mwc-icon"



export class NearEditable extends LitElement{

        static get styles() {
                return css`
                        :host{display:block}
                        .dimmer{position:fixed;top:0;bottom:0;left:0;right:0;z-order:50;background-color:#fffc;}
                        label{position:relative;font-size:small;z-order:100}
                        mwc-icon{font-size:20px;color:#8888; float:right;cursor:pointer}
                        mwc-icon:hover{color:#8884}
                
                `;
        }
 
        constructor(el){
                super();
                this.editing=false;
                if(el && el!==undefined)
                        this.el=el;
                
        }

        renderEditing(){
                return html`<div class="dimmer"></div><label>${this.el.title}<mwc-icon @click="${this.endEdit}">done</mwc-icon>
                        <input @keyup="${this.handleKeyUp}" type="text" id="edit" value="${this.value}"/></label>`
        }

        render(){
                if(this.editing)
                        return this.renderEditing();

                return html`<mwc-icon @click="${this.startEdit}">edit</mwc-icon><slot></slot>`

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