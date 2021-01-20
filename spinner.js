import {LitElement,html,css} from 'lit-element';

export class NearSpinner extends LitElement {

        static get properties() {
                return {
                };
        }

        static get styles() {
                return css`
                :host{
                        font-size:small;
                }        
                #spinner {
                        /* Spinner size and color */
                        width: 1.5rem;
                        height: 1.5rem;
                        border-top-color: #444;
                        border-left-color: #444;
                        nmargin:auto;
                
                        /* Additional spinner styles */
                        animation: spinner 400ms linear infinite;
                        border-bottom-color: transparent;
                        border-right-color: transparent;
                        border-style: solid;
                        border-width: 2px;
                        border-radius: 50%;  
                        box-sizing: border-box;
                        display: block;
                        vertical-align: middle;
                        z-index:1000;
                }
                
                /* Animation styles */
                @keyframes spinner {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                }
                
                
                /* Optional — create your own variations! */

                :host([full]){
                        position:absolute;
                        left:0;
                        right:0;
                        top:0;
                        bottom:0;
                        width:100%;
                        height:100%;
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        justify-content:center;
                        background-color:#8884;
                        color:green;
                }

                :host([large]) #spinner{
                        width: 5rem;
                        height: 5rem;
                        border-width: 6px;
                }
                
                :host([slow]) #spinner {
                        animation: spinner 1s linear infinite;
                }
                
                :host([blue]) #spinner{
                        border-top-color: #09d;
                        border-left-color: #09d;
                }
      ` }

      constructor(){
              super();
              //this.shadowRoot.addEventListener("slotchange", (e=>{console.log("slotchanged");this.requestUpdate("slotupdated",false)}).bind(this));
      }

      render() {
              return html`
              <span id="spinner"></span>
              <slot><slot>`
      }

}

customElements.define("near-spinner",NearSpinner);