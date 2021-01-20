import {LitElement, html, css } from 'lit-element'
import {Icon} from "@material/mwc-icon"
import {Formfield} from '@material/mwc-formfield'
import {Button} from '@material/mwc-button'
import {NearUser} from "./user";
import {NearResources} from "./resources";
import {urlize} from "./urlize";
import {styles} from "./styles";
import {NearContent,NearContents, NearContentsSelect} from "./content";
import {NearBlock} from "./blocks";


var states= Object.freeze ({
        LIST: 0,
        DELIVERY: 1,
        WHATSAPP: 2,
        PAYPAL_COMPLETION:3,
        editing:4
      })
      


function i18n(template) {
        if(i18n.locale  in i18n.db)
                if(template in i18n.db[i18n.locale]) 
                        return  i18n.db[i18n.locale][template];
        return template
}

i18n.locale = 'en';
let lang= ((navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language).slice(0,2);
lang=lang || "en";

i18n.db = {
        'es':{
                "remove": "quitar",

                "Name": "Nombre",
                "Address":"Dirección",
                "Phone":"Teléfono",
                "Send":"Enviar",
                "send":"enviar",
                "Send to":"Enviar a",
                "Deliver to":"Enviar a",
                "deliver to":"enviar a",
                "Order":"Pedir",
                "order":"pedir",
                "qty":"cant",
                "each":"c/u",
                "price":"precio",
                "cancel": "cancelar",
                "message":"mensaje",
                "close": "cerrar",
                "order via":"pedir por",
                "go": "OK",
                "currency": "moneda",
                "language": "idioma",
                "cart properties": "propiedades del carrito",
                "Price": "Precio",
                "Description" : "Descripción",
                "Image": "Imagen"
 
        }


};



export class NearCart extends LitElement {

        static get styles() {
                return [styles(),css`

                :host{  
                        position:fixed;
                        bottom:auto;
                        top:100vh;
                        right:0px;
                        height:auto;
                        padding:8px 8px 0px 8px;
                        
                        border-radius:1em 1em 0 0;
                        box-shadow:5px 5px 20px #0008;
                        background-color:#ffe;
                        font-size:10pt;
                        max-width:500px;
                        min-width:320px;
                        margin:auto; 
                        line-height:1.1em;
                        transition: bottom 2s, top 2s;
                        max-height:50vh;
                        z-index:10;
                        
                }

                

                :host(.active){
                        top:auto;
                        bottom:0;
                        overflow-y:auto;
                }

                #items{max-height:40vh; overflow-y:auto}
                thead, thead tr th{position:sticky;top:0; background-color:#ffe}

                #open, #close{
                        cursor:pointer;
                        font-size:40px;
                        color:#fff;
                        nclip-path:circle(50% at center);
                        text-shadow:0 0 10px #fff;
                        padding:0;
                        width:100%;
                        
                }
                #open{display:block}
                #close{display:none}
                :host(.active)  #open {display:none}
                :host(.active)  #close {display:block}

                #shopping_cart {display:none;font-size:12pt;max-width:500px; padding:10px;margin:auto; text-align:center}
                #bottom_panel.active #shopping_cart {display:block;}
                #deactivate_panel {display:none}
                #bottom_panel.active #deactivate_panel {display:inline-block;}	
                #bottom_panel.active #activate_panel {display:none;}
                #bottom_controls {text-align:center;font-size:11px;z-index:4;width:100*;color:white }
                #bottom{position:fixed; bottom:0;right:0;
                        display:flex;
                        justify-content: flex-end;
                        min-width:230px;
                        max-width:100%;
                        border-radius:10px;
                        border-right:none;
                        margin: 0;
                        align-items:center; z-index:4;
                        color:white; padding:8px; background-color: var(--app-primary-color)
                }
                :host(.active) #bottom{
                        position:static;
                        width:100%;
                        border-radius:0;
                        margin: 0 -8px}

                #bottom button {background-color:#8882; text-transform:uppercase; border: solid 1px white; font-weight:normal;padding:.5em;color:white; border-radius:5px; box-shadow:0px 0px 3px #fff; }
                #bottom button:hover{ background-color:#fff4; box-shadow:0px 0px 5px #fff; }        
                .badget {background-color:#ffe;border:solid 1px orange; color:orange; border-radius:.6rem; padding:.1rem; white-space:nowrap; margin:.5rem }
                .badget > div {display:inline-block; }

                .headerRow > div { display: inline-block;}
                .itemRow > div { display: inline-block;vertical-align: middle;}
                .itemRow{border-bottom:solid 1px white; }
                .itemRow.odd{background-color:#ffd }
                .itemRow,.itemHeader {text-align:right; }
        
                tr{vertical-align:middle}
                th{text-align:center}
                
                .item-name {width:150px;max-width:150px;text-align:left;margin:.5em;line-height:1.1em;}
                .item-price {width:80px;text-align:right; white-space:nowrap}
                .item-decrement,.item-increment {width:10px; margin:.2em;text-align:center;}
                .itemRow > .item-decrement, .itemRow >.item-increment {background-color:#fff;border:solid 1px orange;border-radius:.2em;padding:.2em; margin:.2em }
                .item-quantity {width:20px;text-align:center}
                .item-total, #total {width:80px;text-align:right; font-weight: bold;margin:.5em; white-space:nowrap;}
                .item-remove {width:30px;  }
                .item-increment a , .item-decrement a {text-decoration:none; color:#999 }
                .item-remove a {text-decoration:none; background-color:white; color:#ff0000; display:inline-block;margin:2px;border:solid 1px; border-radius:.3em; }
                .item-controls {display:flex; flex-direction:column; text-align:center }
                .item-controls mwc-icon{color:#8888;cursor:pointer; }
                #total{font-size:larger;}
                .total > div {display:inline-block;padding:.5em}
                .total_label{font-weight:bold;text-align:right}
                #total_row td{border-top:solid 2px #888}
                #edit-control{position:absolute; font-size:14px; right:1px ; bottom:3px; cursor:pointer}

        
                .deliveryto {
                        max-width:450px; 
                        margin:1em auto;
                        padding:2em;
                        position:static;
                        background-color: #fff;
                        border: solid 1px #eec;
                        border-radius:1em;
                        box-shadow: .2em .2em .2em #555;
                }
                
                .deliveryto > div {display:block; width:100% } 
                
                #geolocation{margin:1em 0; text-align: center }
                #geolocation img {display:block;max-width: 100%}
                
                .checkout {font-size:30px ;margin:2em}
                form-actions{display:block;width:100%;text-align:right}
                form-actions .wa {
                        padding:.5em;
                        display:inline-block;
                        font-size:13px;
                        background-color:#070;
                        color:white;
                        text-decoration:none;
                        text-align:center;
                        width:100px;
                        margin:4px;
                        box-shadow:3px 3px 3px #0008;
                }

                form-actions .wa:hover{
                        opacity:70%;
                }        
        
                .complete{
                        padding:2em;
                        text-align:center;
                        font-weight:bold;
                }
                `];
        }


        static get properties() {
                return {
                  state: {type: Number},
                  mapsAPI: {type: String},
                  lang:{type: String},
                  whatsapp:{type: String},
                  paypal:{type: String},
                  mercadopago:{type: String},
                  currency:{type:String},
                  cartId:{type:String}
                };
        }

              
        constructor() {
                super();
                //console.log("NearCart constructor");
                
                this.currency="$";
                this.lang=lang;
                this.state=states.LIST;
                this.whatsapp=null;
                this.mercadopago=null;
                this.paypal=null;
                this.cartId="";
                this.loadData();
                window.nearCart=this;
                
        }

        attributeChangedCallback(name, oldval, newval) {
                super.attributeChangedCallback(name, oldval, newval);
                if(name=="paypal") this.initPayPal(newval);
                if(name=="cartId" || name=="cartid") this.loadData(newval);
        }

        initPayPal(paypalID="sb") {
                let script=document.createElement("script");
                script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURI(paypalID)}&currency=USD`;
                script.onload=this.payPalButtons;
                document.head.appendChild(script);
                this.innerHTML=`<div id="paypal-button-container"></div>`;
                //this.payPalButtons();

        }

        getTotal(){
                return this.data.total.toFixed(2);
        }

        getPaypalItems(){
                let paypalItems=[];
                this.data.items.forEach((item)=>{
                        paypalItems.push({
                                name:item.name,
                                unit_amount: {currency_code:'USD', value: item.price.toFixed(2)},
                                quantity: item.qty.toFixed(0)
                        })
                });
                //console.log("ITEMS", paypalItems);
                return paypalItems
        }

        paypalCompletion(details){
                this.state=states.PAYPAL_COMPLETION;
                this.paypalDetails=details;
                this.clearCart();
        }

        payPalButtons(){
                //console.log("payPalButtons")
                paypal.Buttons({
                        createOrder: function(data, actions) {
                          // This function sets up the details of the transaction, including the amount and line item details.
                          return actions.order.create({
                            purchase_units: [{
                              amount: {
                                currency_code:"USD",      
                                value:  window.nearCart.getTotal(),
                                breakdown:{
                                        item_total:{
                                                currency_code:"USD",  
                                                value:window.nearCart.getTotal()
                                        }
                                }
                              },
                              items: window.nearCart.getPaypalItems()
                            }]
                          });
                        },
                        onApprove: function(data, actions) {
                          // This function captures the funds from the transaction.
                          return actions.order.capture().then(function(details) {
                            // This function shows a transaction success message to your buyer.
                            window.nearCart.paypalCompletion(details);
                            //alert('Transaction completed by ' + details.payer.name.given_name);
                          });
                        }
                      }).render('#paypal-button-container');
                      //This function displays Smart Payment Buttons on your web page.
        }

        firstUpdated(){
                if(this.lang){ 
                        i18n.locale=this.lang.substr(0,2).toLowerCase();
                        this.requestUpdate();
                }
               
                
        }

        updated(){
                super.updated();
                if(false && 'paypal' in window)
                        this.payPalButtons();
        }

        renderItem(item,i){
                //console.log("renderItem", item,i , this);
                return html`
                <tr>
                <td class="item-name">${item.name}</td>
                <td class="item-price">${this.currency}  ${item.price.toFixed(2) || ''}</td>
                <td class="item-quantity"> ${item.qty}</td>
                <td class="item-controls">
                        <mwc-icon title="+" @click="${()=>this.increaseQTY(i)}">keyboard_arrow_up</mwc-icon>
                       
                        <mwc-icon title="-" @click="${()=>this.decreaseQTY(i)}">keyboard_arrow_down</mwc-icon>
                </td>
                <td class="item-total">${this.currency} ${(item.price * item.qty).toFixed(2) || ''}</td>
                <td class="item-controls"> <mwc-icon title="${i18n("remove")}" @click="${()=>this.removeItem(i)}">delete</mwc-icon></td> 
                </tr>
                `;
        }

        renderItems(){
                let r=[];
                this.data.items.forEach((item,i)=>{
                        r.push(this.renderItem(item,i));
                });
                return r;
        }

        renderCart(){
                
                return html`
                <thead><tr><th>item</th><th>${i18n("each")}</th><th colspan="2">${i18n("qty")}</th><th>total</th></tr></thead>
                <tbody>${this.renderItems()}</tbody>`
                
        }


        editForm(){
                return html`
                <near-modal>
                <div>
                <h3>${i18n("cart properties")}</h3>        
                <label>
                ${i18n("Whatsapp")}
                <input name="whatsapp" id="whatsapp" 
                  type="text" .value="${this.whatsapp || ''}" autofocus>
                </label>
                <label>
                ${i18n("Mercadopago")}
                <input name="mercadopago" id="mercadopago" 
                type="text" .value="${this.mercadopago || ''}" autofocus>
                </label>
                <label>
                ${i18n("Paypal")}
                <input name="paypal" id="paypal" 
                type="text" .value="${this.paypal || ''}" autofocus>
                </label>
                <label>
                ${i18n("currency")}
                <input name="currency" id="currency" 
                type="text" .value="${this.currency || '$'}" autofocus>
                </label>
                <label>
                ${i18n("language")}
                <input name="lang" id="lang" 
                type="text" .value="${this.lang || ''}" autofocus>
                </label>
                <label>
                ${i18n("cart Id")}
                <input name="cartid" id="cartid" 
                type="text" .value="${this.cartId || window.location.pathname}" autofocus>
                </label>
                <form-actions>
                <mwc-button @click="${this.cancel}" >${i18n("cancel")}</mwc-button>
                <mwc-button @click="${this.endEdit}" >${i18n("OK")}</mwc-button>
                </form-actions>
                </div>
                </near-modal>`  
        }

        updateAttribute(attr,value){
                this[attr]=value;
                if(value) this.setAttribute(attr.toLowerCase(),value);
                else this.removeAttribute(attr.toLowerCase());
        }

        endEdit(){
                
                this.updateAttribute("whatsapp",this.shadowRoot.getElementById("whatsapp").value || "");
                this.updateAttribute("paypal",this.shadowRoot.getElementById("paypal").value || "");
                this.updateAttribute("mercadopago",this.shadowRoot.getElementById("mercadopago").value || "");
                this.updateAttribute("currency",this.shadowRoot.getElementById("currency").value || '$');
                this.updateAttribute("cartId",this.shadowRoot.getElementById("cartid").value || window.location.pathname);
                this.state=states.LIST;
                let event = new CustomEvent('end-edit', { 
                        detail: { },
                        bubbles: true, 
                        composed: true });
                this.dispatchEvent(event);

        }


        deliveryForm(){
                return html`
                <near-modal>
                <div>
                <h3>${i18n("deliver to")}</h3>        
                <label>
                ${i18n("Name")}
                <input name="name" id="name" @change="${this.handleDeliveryInput}"
                  type="text" .value="${this.data.name || ''}" autofocus>
                </label>
                <label>
                ${i18n("Address")}
                <textarea id="address"  @change="${this.handleDeliveryInput}" >${this.data.address || ''}</textarea>
                </label>
                <label>
                ${i18n("Phone")}
                <input name="phone" id="phone" @change="${this.handleDeliveryInput}"
                  type="text" .value="${this.data.phone || ''}" autofocus>
                </label>
                ${false && "geolocation" in navigator?
                html`
                <label>
                <input type="checkbox" id="geolocation-checkbox" @change="${this.geo}" value="${i18n("Send my geolocation")}"></input>
                <div id="geolocation"></div>
                </label>
                `
                :''}
                
                <form-actions>
                <mwc-button @click="${this.cancel}" >${i18n("cancel")}</mwc-button>
                <mwc-button @click="${this.send}" >${i18n("send")}</mwc-button>
                </form-actions>
                </div>
                </near-modal>`  
        }

        handleDeliveryInput(e){
                this.data[e.target.id]=e.target.value;
                this.saveData();
        }

        geo(e){

                if(e.target.checked) {
                        this.updateGeolocation();
                        this.data.geolocation=true;
                }
                else {
                        this.shadowRoot.getElementById('geolocation').innerHTML='';
                        this.data.geolocation=false;
                }
                this.saveData();
                                                               
        }
        updateGeolocation () {
                navigator.geolocation.getCurrentPosition((position) => {
                        var latitude  = position.coords.latitude;
                        var longitude = position.coords.longitude;

                        //var html=`<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}">ver en Google maps</a>`;
                        var html=`<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURI(this.data.address)}">ver en Google maps</a>`;
                        this.shadowRoot.getElementById('geolocation').innerHTML=html;
                        this.data.geolocation="https://www.google.com/maps/dir/?api=1&query="+latitude+','+longitude;
     
                     })
        }


        sendForm(){
                let msg=`${i18n("Order")}\n`;
                this.data.items.forEach((item)=>{
                        msg+=`${item.qty} ${item.name}, ${this.currency}${item.price.toFixed(2)}`;
                        if(item.qty >1 ) 
                                msg+=` ${this.currency}${item.total.toFixed(2)}`;
                        msg+='\n';
                        
                });
                msg+=    `\nTotal ${this.currency}${this.data.total.toFixed(2)}`
                        +`\n\n${i18n("Send to")} ${this.data.name}, ${this.data.address}, ${this.data.phone}\n`
                        //+`https://www.google.com/maps/search/?api=1&query=${encodeURI(this.data.address)}\n`

                let href=`https://wa.me/${this.whatsapp}?lang=${this.lang}&text=`+encodeURI(msg);
                let hrefWeb=`https://web.whatsapp.com/send?phone=+${this.whatsapp}?l=${this.lang}&text=`+encodeURI(msg);
                
                return html`
                <near-modal>
                <div>
                <label>${i18n("message")}</label>
                <pre>${msg}</pre>
                <form-actions>
                <mwc-button @click="${this.cancel}" >${i18n("cancel")}</mwc-button>
                <a class="wa" target="_blank" href="${hrefWeb}"  @click="${this.done}" >${i18n("order via")}<br>web WHATSAPP</a>
                <a class="wa" target="_blank" href="${href}"  @click="${this.done}" >${i18n("order via")}<br>WHATSAPP</a>
                </form-actions>
                </div>
                </near-modal>
                `;        
        }

        render(){
                if(this.state==states.LIST) {
                        if((this.data.items && this.data.items.length>0) || NearUser.canEdit) {
                                return html`
                                
                                <div id="items"><table>${this.renderCart()}</table></div>
                                <div id="bottom">
                                <mwc-icon id="open" title="view cart" @click="${this.openCart}">shopping_cart</mwc-icon>
                                <mwc-icon id="close" title="hide cart" @click="${this.closeCart}">expand_more</mwc-icon>        
                                ${this.data.total && 
                                        html`<span id="total_row"><span class="total_label">Total</span><span id="total">${this.currency} ${this.data.total.toFixed(2)}</span></span>`}

                                <form-actions >
                                ${ this.whatsapp?
                                html`<button outlined condensed @click="${()=>this.state=states.DELIVERY}">${i18n("order")}</button>`:''}
                                <br/>        
                                <slot></slot>
                                ${NearUser.canEdit()?
                                        html`<mwc-icon id="edit-control" title="edit" @click="${()=>this.state=states.editing}" >edit</mwc-icon>`:``} 
                                </form-actions>
                                </div>        
                                `;
                                }
                                else
                                        return html``; 

                }
                else if(this.state==states.DELIVERY) {
                        return this.deliveryForm();
                }
                else if(this.state==states.WHATSAPP) {
                        return this.sendForm();
                }
                else if(this.state==states.PAYPAL_COMPLETION) {
                        return html`<div class="complete"><h3>Transaction completed</h3>Thank you for your order!`;
                }
                else if(this.state==states.editing) {
                        return this.editForm();
                }  
                        
        }

        recalc(){
                let total=0;
                if(this.data.items){
                        this.data.items.forEach((item,i)=>{
                                item.total=item.price*item.qty;
                                total+=item.total;
                        });
                }
                this.data.total=total;
                this.saveData();
                this.requestUpdate();
        }
        addItem(item){
                this.openCart(); 
                if(this.data.items===undefined)
                        this.data.items=[];
                for (let i = 0; i < this.data.items.length; i++) {
                      if(this.data.items[i].name==item.name 
                        && this.data.items[i].price==item.price) {
                                this.data.items[i].qty+=item.qty;
                                this.recalc();
                                return;     
                        }
                        
                }        
                this.data.items.push(item);
                this.recalc();
                       

        }

        cancel(){
                this.state=states.LIST;
        }

        send(){
                this.state=states.WHATSAPP;
        }
        done(){
                this.state=states.LIST;
        }

        openCart(){
                this.classList.add("active");
        }

        closeCart(){
                this.classList.remove("active");
        }

        toggleCart(e){
                if(this.classList.contains("active"))
                        this.closeCart();
                else
                        this.openCart();
        }

        removeItem(i){
                this.data.items.splice(i,1);
                this.recalc();
        }

        increaseQTY(i){
                this.data.items[i].qty++;
                this.recalc();
        }

        decreaseQTY(i){
                this.data.items[i].qty--;
                if(this.data.items[i].qty <=0) 
                        this.removeItem(i);
                else 
                        this.recalc();
        }

        loadData(cartId=null){
                if (localStorage) {
			this.data=JSON.parse(localStorage.getItem("cart"+(cartId || this.cartId))) || {};
                }
                else this.data={};
        }
        saveData(){
                if (localStorage) 
                        localStorage.setItem("cart"+this.cartId, JSON.stringify(this.data));   
        }

        clearCart(){
                this.data.items=[];
                this.recalc();
                
        }






}

customElements.define("near-cart",NearCart);

export class NearProduct extends NearBlock {

  

        static get styles() {
                return [styles(),css`
                        :host {
                                display:grid;
                                grid-template-columns:auto 50px 100px ;
                                width:100%;
                                max-width:100%;
                        }
                        :host > div:nth-child(2),
                        :host > div:nth-child(3) {
                                justify-content:flex-end;
                        }
                        :host > *:not(style){display:flex;align-items:center;}
                        ::slotted(span) {
                                min-height:1em;
                                min-width:1em;
                                display:inline-block;
                        }
                        
                        ::slotted(span[slot=description]) {
                                
                                
                        }
                        ::slotted(span[slot=price]) {
                                text-align:right;                                
                                
                        }
                        ::slotted(span:empty) {
                                border: solid 1px #8888;
                                min-width:20px;
                        }
                        ::slotted(img) { max-width:100%;}
                        ::slotted(img:hover) {max-width:fit-content;position:absolute; border:solid 1px #8888}

                        input[type=number] {width:30px;margin:3px; text-align:right}
                        mwc-icon-button[icon=delete], mwc-icon-button[icon=add], mwc-icon-button[icon=edit] {color:#8888; font-size:x-small; z-index:1000; margin-left:12px}
                        div {white-space:nowrap}
                        slot[name=description]{white-space:normal}
                        style{display:none}; 
                `];
        }

        constructor() {
                super();
                //console.log("constructor:", this.innerHTML)
                if(false && !this.innerHTML){
                        this.innerHTML=`
                        <span slot="description" ></span>
                        <span slot="price" ></span>
                        `
                }
                this.addEventListener("keydown",this.handleKey.bind(this),true)
  
        }

        firstUpdated(){
                //console.log("firstUpdated:", this.innerHTML)
                let e;
                e=this.querySelector("img");
                if(e) this.o.image=e.src;
                e=this.querySelector('span[slot="description"]');
                if(e) this.o.description=e.innerText;
                e=this.querySelector('span[slot="price"]');
                if(e) this.o.price=e.innerText;
                if(!window.nearCart)
                        this.insertAdjacentHTML("beforebegin","<near-cart></near-cart>")
                
        }


        editFields(){
                return html`
                <h3>${i18n`Producto`}</h3>      
                <label>
                ${i18n`Description`}
                <textarea id="description"  >${this.o.description}</textarea>
                </label>
                <label>
                ${i18n("Price")}
                <input name="price" id="price" 
                type="text" .value="${this.o.price || ''}" autofocus>
                </label>
                <label>
                <label>
                ${i18n`Image`}
                <mwc-button @click="${()=>this.resources(300)}">Select...</mwc-button>
                ${this.o.image?
                        html`<img @click="${()=>this.resources(300)}" src="${this.o.image}">`:''}
                </label>
                `  
        }
        getIcon(){
                return  '<mwc-icon>shopping_cart</mwc-icon> prod.' ;
        }

        getEditedHTML(){
                let h='';
                this.o.description=this.shadowRoot.getElementById("description").value;
                this.o.price=this.shadowRoot.getElementById("price").value;
                if(this.o.image) h+=`<img src="${this.o.image}" slot="image">`
                h+=`<span slot="description">${this.o.description}</span>`;
                h+=`<span slot="price">${this.o.price}</span>`;
                
                return h;
        }

        render(){
                if(this.editing) return this.editForm();
                return html`
                <div><slot name="image"></slot><slot name="description" ></slot></div>
                <div>${window.nearCart && window.nearCart.currency}<slot  name="price" tabindex="0"></slot></div>
                <div><input type="number" id="qty" value="1"><mwc-icon-button title="add to cart" @click="${this.addToCart}" icon="add_shopping_cart" ></mwc-icon-button>
                ${false && NearUser.canEdit()? 
                html`<mwc-icon-button title="delete" @click="${this.delete}" icon="delete" ></mwc-icon-button>
                     <mwc-icon-button title="dup" @click="${this.duplicate}" icon="add" ></mwc-icon-button>
                     <mwc-icon-button title="edit" @click="${this.startEdit}" icon="edit" ></mwc-icon-button>` 
                :''}
                </div>
                `
        }

        handleKey(e){
                console.log("handleKey",e);
        }

        addToCart(){
                let item={
                        name:this.querySelector("[slot=description]").innerText,
                        qty:Number(this.shadowRoot.getElementById("qty").value),
                        price:Number(this.querySelector("[slot=price]").innerText)
                }
                window.nearCart.addItem(item);
        }

        delete(){
                if(confirm("delete?")) this.parentElement.removeChild(this);
        }

        duplicate(){
                let clone= this.cloneNode(true);
                this.insertAdjacentElement("afterend", clone);
        }

       



}

customElements.define("near-product",NearProduct);
customElements.whenDefined('near-section-library').then( ()=>{
        nearSectionLibrary.add(new NearProduct());
});

export class NearProductGroup extends LitElement{
        static get properties() {
                return {
                contenteditable: {type: Boolean, reflect: true}                   
                };
        }

}