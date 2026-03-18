import { LitElement, html, css } from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js'
import './near-icon.js';

export class Figure extends LitElement {

        static get properties() {
                return {
                left: {type: Boolean, attribute: 'left', reflect: true},
                right:{type: Boolean, attribute: 'right', reflect: true}                             
                };
        }

        static get styles() {
                
                return css`
                        :host {
                                margin:1em;
                                text-align:center;
                                display:table;margin:auto
                                
                        }
                        :host([left]) {
                                float:left;
                        }
                        :host([right]) {
                                float:right;
                        }
                        figure{display:table;margin:auto}
                        .control{
                                display:flex;
                                gap:.5rem;
                                justify-content:center;
                                margin-top:.5rem;
                        }
                        .control button{
                                border:none;
                                background:transparent;
                                box-shadow:none;
                                padding:0;
                                min-height:auto;
                                color:inherit;
                                cursor:pointer;
                        }
                        .dropper {
                                width:300px; height:300px;
                                background-color:#888;
                                opacity: .3;
                                border: solid 1px;
                                display:flex;
                                justify-content:center;
                                justify-items:center}
                       
                `;
                
        }

 

        constructor() {
                super();
                this.setAttribute("tabindex","-1");
                this.addEventListener("focus",this.focus,true);
                this.addEventListener("blur",this.blur,true);
                this.addEventListener("keypress",this.keypress,true);
                this.addEventListener("keydown",this.keydown,true);
                this.newHTML=null;
        }


        render() {
                return html`                      
                        ${ !this.innerHTML && this.isContentEditable ?
                                        html`<div contenteditable="false" class="dropper" 
                                         @drop="${this.onDrop}"
                                         @dragover="${this.onDragover}"
                                         @dragenter="${this.onDragover}" 
                                        >drop here</div>`       
                                :     html`<slot></slot>` }
                        
                        ${this.isContentEditable? 
                        html`<div tabindex=0 class="control">
                                <button type="button" tabindex=0 @click="${this.left}" aria-label="align left"><near-icon name="format_align_left"></near-icon></button>
                                <button type="button" tabindex=0 @click="${this.center}" aria-label="align center"><near-icon name="format_align_center"></near-icon></button>
                                <button type="button" tabindex=0 @click="${this.right}" aria-label="align right"><near-icon name="format_align_right"></near-icon></button>
                        </div>`:html``}     
                `;
        }


        attributeChangedCallback(name, oldval, newval) {
                console.log('attribute change: ', name, newval);
                super.attributeChangedCallback(name, oldval, newval);
        }

        keypress(e)
        {       if(this.isContentEditable){
                        if(e.key=="Delete")
                                this.parentElement.removeChild(this);
                        else if(e.key=="Enter") {
                                let element=document.createElement('p');
                                element.innerHTML="<br>";
                                this.parentElement.insertBefore(element,this.nextElementSibling);
                                element.focus();
                                e.stopPropagation();
                        }        
                        
                }
                console.log(e);
                this.requestUpdate();
        }
        
        keydown(e) {
                if(this.isContentEditable){
                        if(e.key=="Backspace" && !this.previousSibling){
                                let element=document.createElement('p');
                                element.innerHTML="<br>";
                                this.parentElement.insertBefore(element,this);
                                element.focus();
                        }        
                        
                }
                
                console.log(e);

        }
        focus(e) {
                console.log(e);
                this.requestUpdate();
        }
        blur(e) {
                console.log(e);
                this.requestUpdate();
        }

        left(e){ 
                console.log('left');
                this.setAttribute('left',"");
                this.removeAttribute('right');
                this.requestUpdate();
        }

        center(e){
                console.log('center');
                this.removeAttribute('left');
                this.removeAttribute('right');
                this.requestUpdate();
        }
        right(e){
                console.log('right');
                this.setAttribute('right',"");
                this.removeAttribute('left');
                this.requestUpdate();

        }     
        
        onDragover(e){
                console.log(e.dataTransfer);
                //e.dataTransfer.dropEffect = '';
                e.preventDefault();
                return true;
         
        }

        onDrop(e){
                console.log(e.dataTransfer.types);
                console.log(e.dataTransfer.getData('text/uri-list'));
                var uri= e.dataTransfer.getData('text/uri-list');
                if(uri) {
                        this.innerHTML=`<img src="${uri}"><figcaption>${uri}</figcaption>`;
                        this.requestUpdate(); 
                }
   
                e.preventDefault();
         
        }

        



}
customElements.define('near-figure', Figure);
