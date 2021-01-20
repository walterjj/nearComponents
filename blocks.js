import { LitElement, html, css } from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {styles} from "./styles";
import {Icon} from "@material/mwc-icon";
import {NearUser} from "./user";
import * as fa from "@fortawesome/fontawesome-free/js/fontawesome";
import * as fab from "./faicons.js";
import {NearResources} from "./resources";

function ekey(key){
        if(key.endsWith(".html")) return key.slice(0,-5); 
        return(key.endsWith("/") ? key+'index': key); 

}

function i18n(template) {
        if(i18n.locale  in i18n.db)
          if(template in i18n.db[i18n.locale]) 
            return  i18n.db[i18n.locale][template];
        return template
      }
i18n.locale = 'es';
i18n.db = {
        'es':{
          "continue": "continuar",
          "cancel": "cancelar",
          "close": "cerrar",
          "title": "título",
          "text": "texto",
          "Title": "Título",
          "Text": "Texto",
          "Description":"Descripción",
          "Image":"Imagen",

        }
        
      
};


let BlockControl={};


let style=document.createElement("style");
style.innerHTML=`
        ::part(dragtarget){
                border-top: solid 3px #0f08;
                position:absolute;
                top:0;
                display:block;
                width:100%;
                height:10px;
                background-color: #0f02;
                color:#0f08;
                text-align:center;

        }
        ::part(blockcontrol){
                border: none;
                position:absolute;
                top:0;
                right:0;
                display:block;
                nmin-width:100px;
                height:20px;
                border-radius:2px;
                background-color: #fffe;
                color:#8c8;
                z-index:1000;
                font-size:11px;
                padding:4px;
                text-align:right;
                box-shadow: 0 0 5px #0808;
                --mdc-icon-size:20px;

        }
        `
document.head.appendChild(style);




let nearBlockMixin={        
        // dragabble
        blockDragStart(ev){
                this.disableControls();
                ev.dataTransfer.setData("Block",this.outerHTML);
                this.dragging=true;
                BlockControl.dropped=false;
        },
        
        blockDrag(ev){
                ev.preventDefault();
                ev.stopPropagation();
                //ev.dataTransfer = ev.originalEvent.dataTransfer;
                ev.dataTransfer.setData("Block",this.outerHTML);
                this.dragging=true;
                BlockControl.dropped=false;
        },
            
        blockDragEnd(ev){
                ev.preventDefault();
                ev.stopPropagation();
                this.dragging=false;
                if(BlockControl.dropped) 
                    this.parentNode.removeChild(this);
                BlockControl.dropped=false;    
        },

        //dragtarget
        blockDragEnter(ev){
                ev.preventDefault();
                ev.stopPropagation();
                if(this.dragging) return;
                this.enableDragTarget();
                
        },
            
        blockDragLeave(ev){
                ev.preventDefault();
                ev.stopPropagation();
                this.disableDragTarget();
        },
            
        blockDragOver(ev){
                ev.preventDefault();
                ev.stopPropagation();
                if(this.dragging) return;
                this.enableDragTarget(); 
        },
            
            
        blockDrop(ev){
                ev.preventDefault();
                ev.stopPropagation();
                if(this.dragging) return;
                this.disableDragTarget();
                //ev.dataTransfer = ev.originalEvent.dataTransfer;
                var data=ev.dataTransfer.getData("Block");
                if (data){  
                    var node=document.createElement(null);
                    node.innerHTML=data;
                    node=node.firstChild;
                    node.removeAttribute("draggable");
                    this.parentNode.insertBefore(node,this);
                    console.log("dropped node", node);
                    BlockControl.dropped=true;
                }
        },

        blockMouseEnter(ev){
                this.enableControls();
        },

        blockMouseLeave(ev){
                this.disableControls();
        },


        blockFocusIn(ev){
                console.log("focusIn",ev);
                this.focused=true;
        },
        
        blockFocusOut(ev){
                console.log("focusOut",ev);
                this.focused=false;
        },
        

        setDragTarget(){
                this.addEventListener('drop',this.blockDrop,true);	
                this.addEventListener('dragenter',this.blockDragEnter,true);	
                this.addEventListener('dragover',this.blockDragOver,true);
                this.addEventListener('dragleave',this.blockDragLeave,true);
        },
        
        setDraggable(){
                this.addEventListener('drag',this.blockDrag);
                this.addEventListener('dragstart',this.blockDragStart);
                this.addEventListener('dragend',this.blockDragEnd);
        },

        setBlockControls(){
                this.addEventListener('mouseenter',this.blockMouseEnter);
                this.addEventListener('mouseleave',this.blockMouseLeave);
                this.addEventListener('focusin',this.blockFocusIn);
                this.addEventListener('focusout',this.blockFocusOut);
        },

        removeListeners(){
                this.removeEventListener('drop',this.blockDrop);	
                this.removeEventListener('dragenter',this.blockDragEnter);	
                this.removeEventListener('dragover',this.blockDragOver);
                this.removeEventListener('dragleave',this.blockDragLeave);
                this.removeEventListener('drag',this.blockDrag);
                this.removeEventListener('dragstart',this.blockDragStart);
                this.removeEventListener('dragend',this.blockDragEnd);
                this.removeEventListener('mouseenter',this.blockMouseEnter);
                this.removeEventListener('mouseleave',this.blockMouseLeave);
                this.removeEventListener('focusin',this.blockFocusIn);
                this.removeEventListener('focusout',this.blockFocusOut);
        },

        ensureShadow(){
                if(!this.shadowRoot) {
                        this.attachShadow({mode:"open"});
                        this.shadowRoot.innerHTML="<slot></slot>";
                }        
                return this.shadowRoot;
        },

        duplicate(){
                let node=this.cloneNode(true);
                this.parentNode.insertBefore(node,this);
        },

        add(element){
                Object.assign(element,nearBlockMixin);
                element.setDragTarget();
                element.setDraggable();
                element.setBlockControls();
                this.insertAdjacentElement("afterend", element);

        },

        enableDragTarget(){
                let shadow=this.ensureShadow();
                this.dragtarget=true;
                if(!shadow.getElementById("dragtarget")){
                        let e=document.createElement("div");
                        e.id="dragtarget";
                        e.part.add("dragtarget");
                        e.innerHTML="move here";
                        shadow.insertBefore(e,shadow.firstChild);
                        e=document.createElement("style");
                        e.id="blockstyle";
                        e.innerHTML=":host{position:relative}"
                        shadow.appendChild(e);
                }
        },

        disableDragTarget(){
                let shadow=this.ensureShadow();
                this.dragtarget=false;
                let e;
                if(e=shadow.getElementById("dragtarget")){
                        e.remove();
                        shadow.getElementById("blockstyle").remove();
                }
        },

        enableControls(){
                let shadow=this.ensureShadow();
                //this.style.position="relative";
                if(!this.editing &&  !shadow.getElementById("blockcontrol")){
                        let e=this.factory? new this.factory() : new NearBlockControl(this);
                        e.id="blockcontrol";
                        shadow.appendChild(e);
                        e=document.createElement("style");
                        e.id="blockstyle";
                        e.innerHTML=":host{position:relative}:host(empty){height:1em;}";
                        shadow.appendChild(e);
                        this.draggable=true;
                }
        },
        disableControls(){
                let shadow=this.ensureShadow();
                //this.style.position="";
                this.draggable=false;
                this.removeAttribute("draggable");
                let e;
                if(e=shadow.getElementById("blockcontrol")){
                        e.remove();
                        shadow.getElementById("blockstyle").remove();
                }
        }
}



export class NearBlockControl extends LitElement{

        static get styles(){
                return css`
                :host{
                        background-color: #ffff;
                        color:#8c8;
                        font-size:11px;
                }
                :host > #control{border: none;
                        position:absolute;
                        top:-2em;
                        left:auto;
                        right:0;
                        display:inline-block;
                        nmin-width:100px;
                        height:20px;
                        border-radius:2px;
                        z-index:1000;
                        padding:4px;
                        text-align:right;
                        box-shadow: 0 0 5px #0808;
                }

                #adder {
                        position:absolute;
                        bottom:0;
                        right:0;
                        left:0;
                        height:1px;
                        border-bottom:solid 1px #0808;
                        text-align:center;
                        box-shadow: 0 0 5px #0804;}
                #adder > mwc-icon{ position:relative;top:-.6em; padding:3px;border:solid 1px #0808; border-radius:.6em; background-color:#fff; z-index:2000; }
                #adder:hover {box-shadow: 0 0 3px #0804; color:#0804}        
                mwc-icon {
                        -mdc-icon-size:20px;
                        cursor:pointer;
                }
                ` 
        }


        constructor(controlled) {
                super();
                this.controlled=controlled;
        }

        handleEdit(e){
                this.controlled.disableControls();
                this.controlled.startEdit();
        }

        handleDuplicate(e) {
                this.controlled.duplicate();
        }

        handleDelete(e){
                this.controlled.remove();
        }

        handleAdd(e){
                this.adding=true;
                this.requestUpdate();
                return;
                let element=document.createElement("p");
                element.contentEditable=true;
                element.tabIndex=0;
                element.innerHTML="<p><br></p>";
                this.controlled.add(element);
                element.focus();

        }

        render(){
                return html`
                <div id="control">
                <mwc-icon @click="${this.handleEdit}}">edit</mwc-icon>
                <mwc-icon @click="${this.handleDuplicate}">content_copy</mwc-icon>
                <mwc-icon @click="${this.handleDelete}">delete</mwc-icon>
                </div>
                <div id="adder">
                <mwc-icon @click="${this.handleAdd}">add
                ${this.adding? html`<near-block-library></near-block-library>`:'' }
                </mwc-icon>
                </div>

                
                `       

        }

        static create(){
                return null;
        }

}

customElements.define('near-block-control', NearBlockControl);

export class NearBlock extends LitElement {

        static get properties() {
                return {
                //contenteditable: {type: Boolean, reflect: true},
                editable:{type: Boolean, reflect: true}
                                           
                };
        }

        static get styles() {
                
                return [styles(),css`
                :host { position:relative; display:block}
                :host > near-modal > div{min-width:70vw;min-height:70vh}
                #edit-control{position:absolute; font-size:14px; right:0 ; bottom:0;}
                #placeholder {background-color:#fff; border:dotted 2px #eee; color:#eee; height:50px;display:flex;justify-content:center;align-items:center;} 
                #edit-control, #placeholder {cursor:pointer}
                `];
                
        }

        constructor() {
                super();
                this.o={};
                if (NearUser.canEdit()){
                        Object.assign(this,nearBlockMixin);
                        this.setDraggable();
                        this.setDragTarget();
                        this.setBlockControls();
                }
        }


        editFields(){
                return html`
                <h3>Block</h3>        
                <label>
                ${i18n("title")}
                <input name="title" id="title"       
                  type="text" .value="${this.o.title ||''}" autofocus>
                </label>
                <label>
                ${i18n("text")}
                <textarea name="text" id="text">${this.o.textarea}</textarea>  
                </label>          
                `
        }

        editForm(){
                return html`
                <near-modal>
                <div>
                ${this.editFields()}
                <form-actions>
                <mwc-button @click="${this.cancel}" >${i18n("cancel")}</mwc-button>
                <mwc-button @click="${this.save}" >OK</mwc-button>
                </form-actions>
                </div>
                </near-modal>`  
        }    

        isEmpty(){
                let r=true;
                if(!this.innerHTML) return true;
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


        resources(e){
                let key=this.key || ekey(window.location.pathname);
                const r= new NearResources(key);
                console.log("resources", key);
                if(typeof e=="number")
                        r.setAttribute("maxwidth",e);
                r.setAttribute("modal","");
                r.addEventListener("resource-click",this.onResourceClick.bind(this));
                document.body.appendChild(r);
        }

        onResourceClick(e){
                console.log(e);
                //this.handleInput();
                const source=e.detail.clicked;
                if(source.tagName=="IMG" || source.tagName=='VIDEO') {
                    //this.parentElement.insertBefore(source,this.parentElement.children[1]);
                    //this.putCode(source);
                    if(source.tagName=='VIDEO')
                        this.o.video=source.getAttribute('src');
                    else    
                        this.o.image=source.getAttribute('src');
                    e.target.close();
                    this.requestUpdate();
                    
                }
        }

        firstUpdated() {
                let script=this.querySelector(".meta");
                if(script) { 
                        this.o=JSON.parse(script.innerText);
                        this.requestUpdate();
                }
                
        }

        getEditedHTML(){
                let h='';
                h+=`<script class="meta" type="application/json">${JSON.stringify(this.o)}</script>`
                this.o.title=this.shadowRoot.getElementById("title").value;
                this.o.text=this.shadowRoot.getElementById("text").value;
                h+=`<h2>${this.o.title}</h2>`;
                h+=`<p>${this.o.text}</p>`;
                return h;
        }


        /*get isContentEditable(){
                return false;
        }
        get contentEditable(){
                return false;
        }*/


        save(e) {
                this.editing=false;
                this.innerHTML=this.getEditedHTML();        
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
                return  'block' // `<img src="data:image/webp;base64,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">`;
        }

        load() {
   
        }

        updated(){
                this.load();
                this.contentEditable=false;
        }

        attributeChangedCallback(name, oldval, newval) {
                console.log('attribute change: ', name, newval);
                super.attributeChangedCallback(name, oldval, newval);
        }

  

}
customElements.define('near-block', NearBlock);

customElements.whenDefined('near-section-library').then( ()=>{
        nearSectionLibrary.add(new NearBlock());
});
customElements.whenDefined('near-block-library').then( ()=>{
        nearBlockLibrary.add({icon:"div",control: NearBlockControl,group:"basic",outerHTML:"<div></div>"});
});


export class NearHeader extends NearBlock {


        firstUpdated() {
                let meta=document.querySelector("near-app").meta || null;
                if(meta) { 
                        this.o.title=meta.title || '';
                        this.o.description=meta.description || '';
                        this.o.image=meta.image || null;
                        if(!this.innerHTML)
                                this.innerHTML=this.getHTML();
                        this.requestUpdate();
                        return;
                }
                let e;
                if(e=this.querySelector("img"))
                        this.o.image=e.src;
                if(e=this.querySelector("h1"))
                        this.o.title=e.innerText;
                if(e=this.querySelector("h3"))
                        this.o.description=e.innerText;                 
                this.requestUpdate();
        }

        getHTML(){
                let h='';
                if(this.o.image) h+=`<img src="${this.o.image}">`;
                h+='<div>';
                h+=`<h1>${this.o.title}</h1>`;
                h+=`<h3>${this.o.description}</h3>`;
                h+=`</div>`;
                return h; 
        }

        getEditedHTML(){
                this.o.title=this.shadowRoot.getElementById("title").value;
                this.o.description=this.shadowRoot.getElementById("description").value;
                let app=document.querySelector("near-app");
                app.meta=app.meta || {};
                Object.assign(app.meta,this.o);
                app.metaDirty=true;
                let h=this.getHTML();
                return h;
        }

        editFields(){
                return html`
                <h3>Header</h3>      
                <label>
                ${i18n`title`}
                <input name="title" id="title" 
                        type="text" .value="${this.o.title}" autofocus>
                </label>
                <label>
                ${i18n`Description`}
                <textarea id="description"  >${this.o.description}</textarea>
                </label>
                <label>
                ${i18n`Image`}
                <mwc-button @click="${this.resources}">Select...</mwc-button>
                ${this.o.image?
                        html`<img @click="${this.resources}" src="${this.o.image}">`:''}
                </label>
                <near-spinner id="pending" full style="visibility:${this.pending? 'visible' :'hidden'}"></near-spinner>
                `  
        }
        getIcon(){
                return  'header' ;
        }


}
customElements.define('near-header', NearHeader);

customElements.whenDefined('near-section-library').then( ()=>{
        nearSectionLibrary.add(new NearHeader());
});


export class NearBlockLibrary extends LitElement{

        static get styles(){
            return css`
            :host{ position:sticky; width:300px; min-height:300px; left:0; top:0px; display:grid; justify-content:space-evenly; background-color:#9c9;}
            item{  display:inline-block}
            `; 
        }
        constructor() {
            super();
        }
    
        render() {
                console.log("NearBlockLibrary");
            let r=[];
            NearBlockLibrary.components.forEach((component,i)=>{
                r.push(html`<item id="${i}">${unsafeHTML(component.icon)}</item>`);
            })
            return html`${r}`;
        }
    
    
 
        firstUpdated(){
            let elements=this.shadowRoot.querySelectorAll('item');
            console.log("elements", elements)
            elements.forEach(element=>{
                this.initEventListeners(element);
            })
        }
    
        //nearBlockLibrary.add({icon:"div",control: NearBlockControl,group:"basic",outerHTML:"<div></div>"});
        static add(component){
            let group=component.group || "basic";    
            NearBlockLibrary.components[group]= ( NearBlockLibrary.components[group] || [] ).push(component);
            console.log(NearBlockLibrary.components);
            document.querySelectorAll('near-section-library').forEach((element)=>element.requestUpdate())
        }
    }
    
    NearBlockLibrary.components={};
    
    window.nearBlockLibrary=NearBlockLibrary;
    customElements.define('near-block-library', NearBlockLibrary);

    