import { LitElement, html, css } from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {styles} from "./styles";
import {Icon} from "@material/mwc-icon";
import {NearUser} from "./user";
import * as fa from "@fortawesome/fontawesome-free/js/fontawesome";
import * as fab from "./faicons.js";
import {NearBlock} from "./blocks";


export class NearSocial extends NearBlock {

        static get nproperties() {
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
                #placeholder {background-color:#fff; border:dotted 2px #eee; color:#eee; height:50px;display:flex;justify-content:center;align-items:center;} 
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
                let h=`<div class="social-icons">`;
                if(this.o.www) h+=`<a href="${this.o.www}" title="${this.o.www}"><div class="social-icon"><i class="fab fa-globe"></i></div>www</a>`;
                if(this.o.whatsapp) h+=`<a href="https://wa.me/${this.o.whatsapp}" title="${this.o.whatsapp}"><div class="social-icon"><i class="fab fa-whatsapp"></i></div>whatsapp</a>`
                if(this.o.facebook) h+=`<a href="${this.o.facebook}" title="${this.o.facebook}"><div class="social-icon"><i class="fab fa-facebook"></i></div>facebook</a>`;
                if(this.o.twitter) h+=`<a href="https://twitter.com/${this.o.twitter}" title="${this.o.twitter}"><div class="social-icon"><i class="fab fa-twitter"></i></div>twitter</a>`;
                if(this.o.instagram) h+=`<a href="https://www.instagram.com/${this.o.instagram}" title="${this.o.instagram}"><div class="social-icon"><i class="fab fa-instagram"></i></div>instagram</a>`;
                h+=`</div><div class="social-address">`;
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
                if(this.isEmpty() && NearUser.canEdit()) return  html`<div id="placeholder" @click="${this.startEdit}">${unsafeHTML(this.getIcon())}</div>`
                return html`                      
                        <slot></slot>
                        ${NearUser.canEdit()?
                                html`<mwc-icon id="edit-control" title="edit" @click="${this.startEdit}" >edit</mwc-icon>`:``} `
        }


        getIcon(){
                return  `<img src="data:image/webp;base64,UklGRqoHAABXRUJQVlA4IJ4HAAAQJQCdASrIACsAPlEci0WjoaEfhAA4BQS0gGr5zyYMQq8Qgf/oA//+Iu6Zn0Y3q8f+3JbF+/4n8jOuj8q+1/qt5A+oLNB9kv0/9q83f8N4A8AL1N/jN5FzvzAvY/6N/vu+5/uPQj62f6r0Wv9/6b/2n/Y+J94l7AH8v/rv/H/vHulfyX/n/0vms/Mf8d7Av83/svpqexn9uPZO/aI42xPGRrH871i3TnkjAMEjGHDkZq6IQVJZl6YrbiAWHlPKN8uAnsXp8UHUAkX/07mjsgOf+4SyJTB9NAHwuI3/Ocu5qsghXU/ar89PhDDUSQqh2bS6XJXMMkAe08HNsWLculRmgWC+ZsBizQZ7sMjsMZs4tvUOlQn05G066M0HPqZZ76RsGJf/pR3dVG+4QHW6lWd8AAD+/4KjeDJezeYcyOPv2qgSRHw2m8zdU/2t14VID3FPwfFGMgNRLDa5y1Phk+vCN493KuyPC0M+zOwnVdB0Bv80qeQouR7etwfQPHjnG+PgJXc7f2Uzb7s7nFnWof0CutQlkkmzL5FjX/7OzAOSJ+BblwgOEJ7qRUhd3ptBvxIXj4j0iSf3O8kDOfev81kksKksfs+ICoeWOuWU/bb5iEa0yY16vP0AtuPjCI6y6Zgq//7/kyU8QIoMWZMBfVAidyUcCuSI+pv5PtyMSC3b/xX5RdbWdv1HErlP2LmhInbF6K5L0TeWB19/h3NU0EX1QSYdUmTeEGdDYJ9UXNKXO3c1rt7VjSYdoyTLlwtVgZ0w3q5EHhZUglsaLvLac23EoPJuPY15BgbIgUDEX4Kg4Y8cwsv0j0IQ/knALF97B/mZjQnHyU7H49ZdHq4aoJrMQmaNQXSRQD2QxIzuqcArmLJqFr1AhVa/hjd+Y2gmvkV0UC6/Lcv+L1J1vRoBrGkbtBUkk3RYEARu47lW3VBXM5hJTNPQc6cUwgL5Fbe1C9Gj5102FQDeF+ho0hyFzfmjQoZ0JFsqDE/XLKVhceyoSGZSWG3AiLy/AmJoH8J4bj7orWFPYFkeMUzxC19U9bP/VHm9MHJhhDJyg2hvZpopuAEEsmPyXTP/h+oyu2b6s7er/EseIiD4wLQ/wCQyN93Ifz3MIDjtBJ9WmxhMawL7BH811uojnQXW0rF1ztnKbKxZElarlojfipKy+MnbpTvY/K1trQS3Yzbl83PwMS8zIV0bfkcyq5RsAVj+vT+8cPlW3YrJiWKd3+IHqnLrU4ksfvdEwaa7msLCNCukKfwHYeFeQoVKd1UjjqzX0lTfC9LGuwkT6P5db2aiyV3Sih1Ye4njOwHwuu9HM//69Fh7ns8j2YMu3FCVjxHuj7jTU3XgxJEgzP/US1jpXoeWrCE3g9duSsawZ1GVPgndxQPIkBGBmNur5hbdtoyMdaITNaOzAnN9NBDf/lsTsTWHdYKzcQmhGbwbrMbjdERTXypAodq+YdHKKYpHYT24tj4Pj8evioppQxxEEfBQRSHDQ+sP424JR1WLhApHKdB89Coc8/SSKAgK4q+N0I+FjxirtMBV6IqAU2eebk+hhZ1sKiltbzrvQgmwnbnHSv8/HDvLgCu3X2ScKMkLsiwI22uy+hW7P+igdvWHU7xR62eOJ33wJNO8WGLdnZpPROrjhOHLOKhrN8oAJ8PZ8SJN1H4a5hHUXoxAmZU76dcwnlBWULcWC4oFe0Rts3KkfcbGvJY5XW+PUIm+6l6QNRvDT1PP4U4Xt90TjwVk8nOupeLelIH6dVQEkBrdmP0Ge9bzZbWKMpFMro3aMCKt3dDfFnGmiFZI/gxdjzPpGwDpWlv9qCqq2mfTpY7dWAe+XbRofP3acCWpd3QQ3cypRVkVeESffqedl8d3Frn4Hp/G6sfvtVFqw0/Sc8cs8cfXyngI015Iy6TBNGdWv0tv501Gp89YS7a1ORuEK40MiAYJ7ZCgq60mBp2XshnhXTYC0eSI7H1vDuNF2tZfY6MSa9R9jW8yoFia/47D1vjBzySTAaS81/WybqhGLDoELhK3X6njgrmPlcTCz3AVpEb7Kx9VWWXZW6td2iRZVt/xHXL/MAkqRtAJ+vTQ1aDhPcv3I59iSxOFrUIM0MTc0NxEQuWxWTOmxCsBdh7dcrdVyaL/6oVPX27Z38Ntn5p9DMX9C2LdgF3gfsASbCWlPnQncJPGGHHW1dDjnFK5yjay15iabEHxtMtb3RhNbOKkduJmijm2o0NDlgzVK0ol+7CM3kEFAtGMEFm/+e/vk9L8SMKnx6JvVEtVgLi8V+o66lnhDh4THjkhWAouta3MiBzaM5rxCBmVqA8OnPnYYZ/5wRasa2CwMYrrnVSCxpgn+HrHY3bYAeR55MBBE/ZSlz+pGliObvIGAjbNccz5RMuz+yzj1CUh/Gz8Yj+dhrC3UDHzJiMrSDLVDvj0CcGxzcafItDxqquFhgii4aMXL7YI5aAWt+4xzkVVCKG09tlNKHF0WsmrJuvR0B9PsXH1eR68AjdYLos66Fq7Ey5A0lbkOfmiVOYJz6I95cO4vlTDeO1pCMkUoD5KVVs49eg5vrcISw9Im+/mN8tDe2TevtkAXtJMpfgrz+qdrDZsOC+QII0rIQGAAAA=">`;
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

