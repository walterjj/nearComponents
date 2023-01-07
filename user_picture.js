import { LitElement, html, css } from 'lit-element';
import {Icon} from "@material/mwc-icon"


export class UserPicture extends LitElement {
        static get styles() {
                return css`
                    :host {
                        padding:1em;
                        nborder-top: solid 1px #ccc;
                        display:flex;
                        justify-content:center;
                        justify-items:center;
                
                    } 
                    :host > div { border: none;min-height:100px}
                    img{ width:200px ;
                         display:block;
                         clip-path: circle(50% at center);}
                        

                    .dropper {
                        width:200px; 
                        height:200px;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        background-color:#8883;
                        nopacity: .3;
                        nborder: solid 1px;
                        clip-path: circle(50% at center);         
                        }
                     input {max-width:200px}   
                
                    
                `;
        }
        /**
         * Define properties. Properties defined here will be automatically 
         * observed.
         */
        static get properties() {
                return {
                name: { type: String },
                state: {type: Number},
                src: {type:String}                
                };
        }

        /**  
         * In the element constructor, assign default property values.
         */
        constructor() {
                // Must call superconstructor first.
                super();
                // Initialize properties
                //this.loadComplete = false;
                this.file = null;
                this.src="";
        }

        render() {
                return html`
                <div @drop="${this.onDrop}"
                        @dragover="${this.onDragover}"
                        @dragenter="${this.onDragover}" >
                ${this.src?         
                        html`<div class="dropper"><img src="${this.src}"/></div>`
                        : html`<div class="dropper">drag & drop here</div>`}       
                
                <input  id="in"
                        type="file"
                        @change="${this.changed}"        
                        value="pick"
                
                >
                </div>
                `;
        }

        onDragover(e){
                console.log(e.dataTransfer);
                //e.dataTransfer.dropEffect = '';
                e.preventDefault();
                return true;
         
        }

        onDrop(e){
                console.log(e.dataTransfer.types);
                //console.log(e.dataTransfer.getData('text/uri-list'));
                console.log(e.dataTransfer.files);
                //var htmlData= e.dataTransfer.getData('text/uri-list');
                var files = e.dataTransfer.files;
                if(files) {
                        this.file=files.item(0);
                        this.src=URL.createObjectURL(this.file);
                        this.pictureChanged();
                        this.requestUpdate(); 
                }
                e.preventDefault();
         
        }

        changed(e) {
                this.state++;
                var input = this.shadowRoot.getElementById('in');
                
                this.file=input.files.item(0);
                this.src=URL.createObjectURL(this.file);
                this.pictureChanged();
                this.requestUpdate(); 
        }

        pictureChanged(){
                let event = new CustomEvent('picture-change', { 
                        detail: { message: 'picture-change triggered.' },
                        bubbles: true, 
                        composed: true });
                this.dispatchEvent(event);
        }

        getFile(){
                return this.file;
        }

}

customElements.define('user-picture', UserPicture);


