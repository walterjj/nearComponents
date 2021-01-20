import {LitElement, html, css } from 'lit-element'
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {Icon} from "@material/mwc-icon"
import {Formfield} from '@material/mwc-formfield'
import {Button} from '@material/mwc-button'
import {NearUser} from "./user";
import {NearResources} from "./resources";
import {urlize} from "./urlize";
import {styles} from "./styles";
import {NearTags} from "./tags";
import {NearSwiper} from "./swiper";


export class NearDialog extends LitElement{

        
        static get properties() {
                return {
                 
                };
        }

        constructor(){
                super();
                this.title="dialog";
                this.addEventListener("keydown",this.handleKeydown);
                
                
        }


        static get styles() {
                return [styles(),css`
                        #tags{
                        
                        margin-top:1em;
                        background-color:#ccc2;
                        border-radius:1em;
                
                        }
                `];
        }



        form(){
                return html`
                <near-modal>
                <div>
                <h3>${this.getTitle()}</h3>        

                ${this.fields()}
                <form-actions>
                <mwc-button @click="${this.cancel}" >cancel</mwc-button>
                <mwc-button @click="${this.do}" >OK</mwc-button>
                </form-actions>
                </div>
                </near-modal>`  
        }


        getTitle(){
                return this.title;

        }

        fields(){

        }



        handleInput(){
                this.shadowRoot.querySelector("#OK").disabled=false;
                //if (this.key)
                  //      this.shadowRoot.querySelector("near-tags").style.visibility="hidden";
        }

        handleKeydown(event){
                if(event.keyCode==27)
                        this.cancelEdit();   
        }

        render(){
                return this.form();        
        }

        cancel(e){
                this.dispatchEvent(new CustomEvent("cancel",{detail:this}));
                this.close();
        }

        do(e){
                this.dispatchEvent(new CustomEvent("done",{detail:this}));
                this.close();
        }

        close(){
                this.parentElement.removeChild(this);
        }

    


}




customElements.define("near-dialog",NearDialog);
