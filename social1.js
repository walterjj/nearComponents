import { LitElement, html, css } from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {styles} from "./styles";
import {Icon} from "@material/mwc-icon";
import {NearUser} from "./user";
import * as fa from "@fortawesome/fontawesome-free/js/fontawesome";
import * as fab from "@fortawesome/fontawesome-free/js/brands.js";


let facebookIcon=`<svg width="40px" xmlns="http://www.w3.org/2000/svg" fill="#bbb" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>`

let twitterIcon=`<svg width="40px"  xmlns="http://www.w3.org/2000/svg" fill="#bbb" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>`

let linkedinIcon=`<svg width="40px" xmlns="http://www.w3.org/2000/svg" fill="#bbb" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>`

let whatsappIcon=`<svg width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 418.135 418.135" style="enable-background:new 0 0 418.135 418.135;" xml:space="preserve">
<g>
<path style="fill:#7AD06D;" d="M198.929,0.242C88.5,5.5,1.356,97.466,1.691,208.02c0.102,33.672,8.231,65.454,22.571,93.536
       L2.245,408.429c-1.191,5.781,4.023,10.843,9.766,9.483l104.723-24.811c26.905,13.402,57.125,21.143,89.108,21.631
       c112.869,1.724,206.982-87.897,210.5-200.724C420.113,93.065,320.295-5.538,198.929,0.242z M323.886,322.197
       c-30.669,30.669-71.446,47.559-114.818,47.559c-25.396,0-49.71-5.698-72.269-16.935l-14.584-7.265l-64.206,15.212l13.515-65.607
       l-7.185-14.07c-11.711-22.935-17.649-47.736-17.649-73.713c0-43.373,16.89-84.149,47.559-114.819
       c30.395-30.395,71.837-47.56,114.822-47.56C252.443,45,293.218,61.89,323.887,92.558c30.669,30.669,47.559,71.445,47.56,114.817
       C371.446,250.361,354.281,291.803,323.886,322.197z"/>
<path style="fill:#7AD06D;" d="M309.712,252.351l-40.169-11.534c-5.281-1.516-10.968-0.018-14.816,3.903l-9.823,10.008
       c-4.142,4.22-10.427,5.576-15.909,3.358c-19.002-7.69-58.974-43.23-69.182-61.007c-2.945-5.128-2.458-11.539,1.158-16.218
       l8.576-11.095c3.36-4.347,4.069-10.185,1.847-15.21l-16.9-38.223c-4.048-9.155-15.747-11.82-23.39-5.356
       c-11.211,9.482-24.513,23.891-26.13,39.854c-2.851,28.144,9.219,63.622,54.862,106.222c52.73,49.215,94.956,55.717,122.449,49.057
       c15.594-3.777,28.056-18.919,35.921-31.317C323.568,266.34,319.334,255.114,309.712,252.351z"/>
</g>
</svg>`

let wwwIcon=`<svg width="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 490 490" style="enable-background:new 0 0 490 490;" xml:space="preserve">
<path d="M245,0C109.69,0,0,109.69,0,245s109.69,245,245,245s245-109.69,245-245S380.31,0,245,0z M31.401,260.313h52.542
c1.169,25.423,5.011,48.683,10.978,69.572H48.232C38.883,308.299,33.148,284.858,31.401,260.313z M320.58,229.688
c-1.152-24.613-4.07-47.927-8.02-69.572h50.192c6.681,20.544,11.267,43.71,12.65,69.572H320.58z M206.38,329.885
c-4.322-23.863-6.443-47.156-6.836-69.572h90.913c-0.392,22.416-2.514,45.709-6.837,69.572H206.38z M276.948,360.51
c-7.18,27.563-17.573,55.66-31.951,83.818c-14.376-28.158-24.767-56.255-31.946-83.818H276.948z M199.961,229.688
c1.213-24.754,4.343-48.08,8.499-69.572h73.08c4.157,21.492,7.286,44.818,8.5,69.572H199.961z M215.342,129.492
c9.57-37.359,21.394-66.835,29.656-84.983c8.263,18.148,20.088,47.624,29.66,84.983H215.342z M306.07,129.492
c-9.77-40.487-22.315-73.01-31.627-94.03c11.573,8.235,50.022,38.673,76.25,94.03H306.07z M215.553,35.46
c-9.312,21.02-21.855,53.544-31.624,94.032h-44.628C165.532,74.13,203.984,43.692,215.553,35.46z M177.44,160.117
c-3.95,21.645-6.867,44.959-8.019,69.572h-54.828c1.383-25.861,5.968-49.028,12.65-69.572H177.44z M83.976,229.688H31.401
c1.747-24.545,7.481-47.984,16.83-69.572h46.902C89.122,181.002,85.204,204.246,83.976,229.688z M114.577,260.313h54.424
c0.348,22.454,2.237,45.716,6.241,69.572h-47.983C120.521,309.288,115.92,286.115,114.577,260.313z M181.584,360.51
c7.512,31.183,18.67,63.054,34.744,95.053c-10.847-7.766-50.278-38.782-77.013-95.053H181.584z M273.635,455.632
c16.094-32.022,27.262-63.916,34.781-95.122h42.575C324.336,417.068,284.736,447.827,273.635,455.632z M314.759,329.885
c4.005-23.856,5.894-47.118,6.241-69.572h54.434c-1.317,25.849-5.844,49.016-12.483,69.572H314.759z M406.051,260.313h52.548
c-1.748,24.545-7.482,47.985-16.831,69.572h-46.694C401.041,308.996,404.882,285.736,406.051,260.313z M406.019,229.688
c-1.228-25.443-5.146-48.686-11.157-69.572h46.908c9.35,21.587,15.083,45.026,16.83,69.572H406.019z M425.309,129.492h-41.242
c-13.689-32.974-31.535-59.058-48.329-78.436C372.475,68.316,403.518,95.596,425.309,129.492z M154.252,51.06
c-16.792,19.378-34.636,45.461-48.324,78.432H64.691C86.48,95.598,117.52,68.321,154.252,51.06z M64.692,360.51h40.987
c13.482,32.637,31.076,58.634,47.752,78.034C117.059,421.262,86.318,394.148,64.692,360.51z M336.576,438.54
c16.672-19.398,34.263-45.395,47.742-78.03h40.99C403.684,394.146,372.945,421.258,336.576,438.54z"/>
</svg>`

let placeIcon=`<svg width="40px" style="enable-background:new 0 0 10.134 15.626;" version="1.1" viewBox="0 0 10.134 15.626" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M7.873,0.853c-1.705-1.137-3.908-1.137-5.612,0C0.065,2.316-0.638,5.167,0.626,7.484l4.441,8.142l4.441-8.142  C10.772,5.167,10.07,2.316,7.873,0.853z M8.631,7.006l-3.563,6.533L1.504,7.006C0.49,5.146,1.053,2.859,2.816,1.685  C3.5,1.229,4.283,1,5.067,1s1.567,0.228,2.251,0.684C9.081,2.859,9.645,5.146,8.631,7.006z"/><path d="M5.067,2.083c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.122,2.5-2.5S6.446,2.083,5.067,2.083z M5.067,6.083  c-0.827,0-1.5-0.673-1.5-1.5s0.673-1.5,1.5-1.5s1.5,0.673,1.5,1.5S5.894,6.083,5.067,6.083z"/></svg>`

let instagramIcon=`<svg width="40px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" version="1.1" viewBox="0 0 384 384" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css">
<![CDATA[
 .fil0 {fill:#336699}
 .fil2 {fill:white}
 .fil1 {fill:white;fill-rule:nonzero}
]]>
</style></defs><g id="Layer_x0020_1"><g id="_521256328"><rect class="fil0" height="384" rx="37" ry="37" width="384"/><g><path class="fil1" d="M142 59l100 0c22,0 42,9 56,24 14,14 23,34 23,56l0 106c0,22 -9,41 -23,56 -14,14 -34,23 -56,23l-100 0c-22,0 -42,-9 -56,-23 -15,-15 -24,-34 -24,-56l0 -106c0,-22 9,-42 24,-56 14,-15 34,-24 56,-24zm100 23l-100 0c-16,0 -30,6 -41,16 -10,11 -17,25 -17,41l0 106c0,15 7,30 17,40 11,11 25,17 41,17l100 0c16,0 30,-6 40,-17 11,-10 17,-25 17,-40l0 -106c0,-16 -6,-30 -17,-41 -10,-10 -24,-16 -40,-16z"/><path class="fil1" d="M192 123c19,0 36,7 48,20 12,12 20,29 20,48 0,19 -8,35 -20,48 -12,12 -29,20 -48,20 -19,0 -36,-8 -48,-20 -13,-13 -20,-29 -20,-48 0,-19 7,-36 20,-48 12,-13 29,-20 48,-20zm32 35c-8,-8 -20,-13 -32,-13 -13,0 -24,5 -33,13 -8,9 -13,20 -13,33 0,12 5,24 13,32 9,8 20,13 33,13 12,0 24,-5 32,-13 8,-8 14,-20 14,-32 0,-13 -6,-24 -14,-33z"/><circle class="fil2" cx="265" cy="119" r="16"/></g></g></g></svg>`

export class NearSocial extends LitElement {

        static get properties() {
                return {
                q: {type: String, reflect: true},
                shadow: {type: Boolean, reflect: true},
                contenteditable: {type: Boolean, reflect: true},
                editable:{type: Boolean, reflect: true}
                                           
                };
        }

        static get styles() {
                
                return [styles(),css`
                :host { position:relative; display:block}
                #edit-control{position:absolute; font-size:14px; right:0 ; bottom:0;}
                #placeholder {background-color:#8884; color:#fff; height:50px;display:flex;justify-content:center;align-items:center;} 
                #edit-control, #placeholder {cursor:pointer}
                `];
                
        }

 

        constructor() {
                super();
                this.o={};
        }

        firstUpdated() {
                let script=this.querySelector("#meta_social");
                if(script) { 
                        this.o=JSON.parse(script.innerText);
                        this.requestUpdate();
                }
                
        }

        editForm(){
                return html`
                <near-modal>
                <div>
                <h3>Social</h3>        
                <label>
                www
                <input name="www" id="www" 
                  placeholder="https://www.dominio.com"      
                  type="text" .value="${this.o.www ||''}" autofocus>
                </label>
                <label>
                whatsapp
                <input name="whatsapp" id="whatsapp"
                  placeholder="5491101234567" 
                  type="text" .value="${this.o.whatsapp ||''}">
                </label>
                <label>
                facebook
                <input name="facebook" id="facebook"
                 placeholder="https://www.facebook.com/xxxxxxxxx"  
                  type="text" .value="${this.o.facebook ||''}">
                </label>
                <label>
                twitter
                @<input name="twitter" id="twitter" 
                 placeholder="twitter_user"  
                  type="text" .value="${this.o.twitter ||''}">
                </label>
                <label>
                instagram
                <input name="instagram" id="instagram" 
                 placeholder="instagram_user" 
                  type="text" .value="${this.o.instagram ||''}">
                </label>
                <label>
                address
                <input name="address" id="address" 
                 placeholder="xxxxxxxx 1234 (1420) ,  Xxxxx,  Xxxxx" 
                  type="text" .value="${this.o.address ||''}">
                </label>
                <label>
                tel
                <input name="tel" id="tel" 
                 placeholder="+54-11-12345678" 
                  type="text" .value="${this.o.tel ||''}">
                </label>
                
                <form-actions>
                <mwc-button @click="${this.cancel}" >cancel</mwc-button>
                <mwc-button @click="${this.save}" >OK</mwc-button>
                </form-actions>
                </div>
                </near-modal>`  
        }    

        isEmpty(){
                let r=true;
                Object.values(this.o).forEach(v=>{if(v) r=false});
                return r;
        }

        startEdit(){
                this.editing=true;
                this.requestUpdate();
        }

        cancel() {
                this.editing=false;
                this.requestUpdate();
        }

        save() {
                this.editing=false;
                this.o.www=this.shadowRoot.getElementById('www').value;
                this.o.whatsapp=this.shadowRoot.getElementById('whatsapp').value;
                this.o.facebook=this.shadowRoot.getElementById('facebook').value;
                this.o.twitter=this.shadowRoot.getElementById('twitter').value;
                this.o.instagram=this.shadowRoot.getElementById('instagram').value;
                this.o.address=this.shadowRoot.getElementById('address').value;
                this.o.tel=this.shadowRoot.getElementById('tel').value;
                let h=`<div style="display:flex;justify-content:space-around;text-align:center;font-size:14px">`;
                if(this.o.www) h+=`<a href="${this.o.www}" title="${this.o.www}">${wwwIcon}<br>www</a>`;
                if(this.o.whatsapp) h+=`<a href="https://wa.me/${this.o.whatsapp}" title="${this.o.whatsapp}">${whatsappIcon}<br>whatsapp</a>`;
                if(this.o.whatsapp) h+=`<a href="https://wa.me/${this.o.whatsapp}" title="${this.o.whatsapp}"><div class="social-icon"><i class="fab fa-whatsapp"></i></div>whatsapp</a>`
                if(this.o.facebook) h+=`<a href="${this.o.facebook}" title="${this.o.facebook}">${facebookIcon}<br>facebook</a>`;
                if(this.o.twitter) h+=`<a href="https://twitter.com/${this.o.twitter}" title="${this.o.twitter}">${twitterIcon}<br>www</a>`;
                if(this.o.instagram) h+=`<a href="https://www.instagram.com/${this.o.instagram}" title="${this.o.instagram}">${instagramIcon}<br>instagram</a>`;
                h+=`</div><div class="social-address" style="padding:1em;text-align:center;">`;
                if(this.o.address) h+=`${this.o.address} `;
                if(this.o.tel) h+=`<a href="tel:${this.o.tel}" title="${this.o.tel}">${this.o.tel}</a>`;
                h+="</div>"
                h+=`<script id="meta_social" type="application/json">${JSON.stringify(this.o)}</script>`
                this.innerHTML=h;
                this.requestUpdate();
                let event = new CustomEvent('end-edit', { 
                        detail: { },
                        bubbles: true, 
                        composed: true });
                this.dispatchEvent(event);
        }

        render() {
                if(this.editing) return this.editForm();
                if(this.isEmpty() && NearUser.canEdit()) return html`<div id="placeholder" @click="${this.startEdit}">Social links</div>`
                return html`                      
                        <slot></slot>
                        ${NearUser.canEdit()?
                                html`<mwc-icon id="edit-control" title="edit" @click="${this.startEdit}" >edit</mwc-icon>`:``} `
        }


        getIcon(){
                return wwwIcon;
        }

        load() {
   
        }

        updated(){
                this.load();
        }

        attributeChangedCallback(name, oldval, newval) {
                console.log('attribute change: ', name, newval);
                //if(name=="q")
                //        this.load(newval);
                super.attributeChangedCallback(name, oldval, newval);
        }

  

}
customElements.define('near-social', NearSocial);

customElements.whenDefined('near-section-library').then( ()=>{
        nearSectionLibrary.add(new NearSocial());
});

