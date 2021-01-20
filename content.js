import {LitElement, html, css } from 'lit-element'
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {Icon} from "@material/mwc-icon"
//import {Formfield} from '@material/mwc-formfield'
import {Button} from '@material/mwc-button'
import {NearUser} from "./user";
import {NearResources} from "./resources";
import {urlize} from "./urlize";
import {styles} from "./styles";
import {NearTags} from "./tags";
import {NearSwiper} from "./swiper";
import {NearSpinner} from "./spinner";




export class NearContent extends LitElement{

        
        static get properties() {
                return {
                  name: { type: String, reflect: true },
                  key: { type: String, reflect: true },
                  editing: {type: Boolean,  reflect: true},
                  editonly: {type: Boolean,  reflect: true},
                  o:{type:Object}
                };
        }

        constructor(){
                super();
                this.addEventListener("keydown",this.handleKeydown);
                this.pending=false;
                
                
        }

        jsonLoaded(o) {
                this.title=o.title;
                this.description=o.description;
                if(o.image) this.image= o.image;
                if(o.video) this.video= o.video;
                if(o.author) this.author= o.author;
                if(o.search) this.search= o.search;
                this.o=o;
                this.requestUpdate();
        }

        loadJson(){
                if(this.key && NearUser.instance){
                        let eKey= this.ekey(this.key); 
                        NearUser.instance.get(eKey+'.json')
                                .then(response=>{
                                        if(response.ok)
                                                response.json().then(o=>{
                                                        
                                                        this.jsonLoaded(o);
                                                })
                                })
                }
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


        editButton(){
                if(NearUser.instance && NearUser.instance.canEdit())
                        return html`<mwc-icon class="properties-icon" @click="${this.beginEdit}" title="props">more_vert</mwc-icon>`
                return '';         
        }

        getHTML(){
                return html`
                ${this.editButton()}
                ${this.editForm()}
                <slot></slot>
                <a href="${this.key}">${this.key}</a>
                `
        }

        listHTML(o) {
                return null;
        }

        createHTML(o){
                return (
                `<section id="article-header">
                <div class="e" contenteditable>
                <h1>${this.title}</h1>
                <h3>${this.description}</h3>
                </div>
                </section>` );

        }

 

        createForm(){
                return html`
                <near-modal>
                <div>
                <h3>New ${this.getType()}</h3>        
                <label>
                title
                <input name="title" id="title" 
                  type="text" .value="${this.title}" autofocus>
                </label>
                <label>
                Description
                <textarea id="description"></textarea>
                </label>
                ${this.extraFields()}
                <form-actions>
                <mwc-button @click="${this.cancel}" >cancel</mwc-button>
                <mwc-button @click="${this.create}" >OK</mwc-button>
                </form-actions>
                <near-spinner id="pending" full style="visibility:${this.pending? 'visible' :'hidden'}"></near-spinner>
                </div>
                </near-modal>`  
        }

        extraFields(){

        }

        editForm(){
                if(this.editing) {
                        if(!this.o) this.loadJson();
                        return html`
                        <near-modal>
                        <div>
                        <h3>Edit Meta</h3>      
                        <label>
                        title
                        <input name="title" id="title" 
                                @input="${this.handleInput}"
                                type="text" .value="${this.title}" autofocus>
                        </label>
                        <label>
                        Description
                        <textarea id="description"  @input="${this.handleInput}" >${this.description}</textarea>
                        </label>
                        <label>
                        Image
                        <mwc-button @click="${this.resources}">Select...</mwc-button>
                        ${this.image?
                                html`<img @click="${this.resources}" src="${this.image}">`:''}
                        </label>
                        <label>
                        search query
                        <input name="search" id="search" 
                                @input="${this.handleInput}"
                                type="text" .value="${this.search || ''}" autofocus>
                        </label>
                        ${this.extraFields()}
                        <form-actions>
                        <mwc-button @click="${this.cancelEdit}" >close</mwc-button>
                        <mwc-button disabled id="OK" @click="${this.endEdit}" >OK</mwc-button>
                        </form-actions>
                       
                        

                        <label id="tags">
                        tags
                        <near-tags obj="${JSON.stringify(this.toIndexObject())}"  title="${this.title}" description="${this.description}" image="${this.image}"></near-tags>
                        </label>
                        <near-spinner id="pending" full style="visibility:${this.pending? 'visible' :'hidden'}"></near-spinner>
                        </div>
                        </near-modal>`  
                }
        }


        startPending(){
                this.pending=true;
                let spinner=this.shadowRoot.getElementById("pending");
                console.log("spinner", spinner);
                if(spinner) spinner.style.visibility="visible";
        }
        stopPending(){
                this.pending=false;
                let spinner=this.shadowRoot.getElementById("pending");
                if(spinner) spinner.style.visibility="hidden";
        }

        logPending(text){
                let spinner=this.shadowRoot.getElementById("pending");
                if(spinner) spinner.insertAdjacentHTML('beforeend',`<div>${text}</div>`);
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
                if(!this.key)
                        return this.createForm();
                if(this.editonly)
                        return this.editForm();
                return this.getHTML();        
        }


        toObject(){

                let o={
                        title: this.title,
                        description: this.description,
                        editor:NearUser.instance.sub
                }
                if(this.search) o.search=this.search;
                if(this.image) o.image=this.image;
                if(this.video) o.video=this.video;        
                return o;
        }

        toIndexObject(){

                let o={
                        title: this.title,
                        description: this.description
                }
                if(this.image) o.image=this.image;
                if(this.video) o.video=this.video;        
                return o;
        }

        ekey(key){
                if(key.endsWith(".html")) return key.slice(0,-5); 
                return(key.endsWith("/") ? key+'index': key); 

        }
 
        put(putContent=true) {
                const u=NearUser.instance;
                const nearTags=this.shadowRoot.querySelector("near-tags");
                if(u && u.canEdit(this.key)) {
                        this.pending++;
                        let eKey= this.ekey(this.key); 
                        if(putContent) u.put(eKey+".h",this.innerHTML,"text/html");
                        return u.put(eKey+".json",JSON.stringify(this.toObject()),"text/json")
                                .then(()=>{this.logPending("build...");return u.buildPage(this.key)})
                                .then(()=>{this.logPending("sub index...");return u.putSubDocument(this.toIndexObject(),this.key)})
                                .then(()=>{
                                        this.logPending("tags...");
                                        //let nearTags=this.shadowRoot.querySelector("near-tags");
                                        if(nearTags) {
                                                nearTags.updateTags(this.toIndexObject());
                                                nearTags.style.visibility="visible";
                                                this.shadowRoot.querySelector("#OK").disabled=true;
                                                
                                        }
                                        this.pending--;
                                        
                                });
                }
        }

        

        putMeta() {
               return this.put(false);
        }


        createKey(){
                const d=new Date();
                //return `/${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${urlize(this.title)}`;
                return `/${urlize(this.title)}${NearContent.dotHtml ? '.html' : ''}`;
        }

        create(e){
                this.title=this.shadowRoot.getElementById("title").value;
                this.description=this.shadowRoot.getElementById("description").value;
                this.startPending();
                this.key=this.createKey();
                this.innerHTML=this.createHTML();
                this.put().then( ()=> this.dispatchEvent(new CustomEvent("content-create",{detail:this})))
                        .finally(()=>this.stopPending());
                 

        }

        cancel(e){
                this.dispatchEvent(new CustomEvent("content-cancel",{detail:this}));
                this.close();
        }

        close(){
                this.parentElement.removeChild(this);
        }

        beginEdit(e){
                console.log("beginEdit")
                this.editing=true;
        }

        cancelEdit(){
                this.editing=false;
                if(this.editonly) this.cancel();
        }

        endEdit(){
                this.editing=false;
                this.title=this.shadowRoot.getElementById("title").value;
                this.description=this.shadowRoot.getElementById("description").value;
                this.search=this.shadowRoot.getElementById("search").value;
                this.startPending();
                this.putMeta()
                .then(()=>{
                     this.dispatchEvent(new CustomEvent("content-edited",{detail:this}));       
                })
                .finally(()=>{
                        this.stopPending();
                        if(false && this.editonly)
                                this.close();
                })
        }

        resources(e){

                const r= new NearResources(this.key);
                console.log("resources", this.key);
                r.setAttribute("modal","");
                r.addEventListener("resource-click",this.onResourceClick.bind(this));
                document.body.appendChild(r);
        }

        onResourceClick(e){
                console.log(e);
                this.handleInput();
                const source=e.detail.clicked;
                if(source.tagName=="IMG" || source.tagName=='VIDEO') {
                    //this.parentElement.insertBefore(source,this.parentElement.children[1]);
                    //this.putCode(source);
                    if(source.tagName=='VIDEO')
                        this.video=source.getAttribute('src');
                    else    
                        this.image=source.getAttribute('src');
                    e.target.close();
                    this.requestUpdate();
                    
                }
        }
        
        getType(){
                return 'content';
        }


}




customElements.define("near-content",NearContent);

NearContent.dotHtml=true;

export class NearContents extends LitElement {

        static get properties() {
                return {
                  key: { type: String, reflect: true },
                  descending: { type:Boolean, default: false},
                  nocache:{ type:Boolean, default: false},
                  titleOnly:{type:Boolean, default: false} 
                };
        }

        static get styles() {
                return [
                        styles(),
                        css`
                        img{max-width:var(--near-contents-image-max-width)}
                        :host > div{
                                display: var(--near-contents-display);
                                position: var(--near-contents-position);
                                max-width: var(--near-contents-max-width);
                                min-width: var(--near-contents-min-width);
                                max-height: var(--near-contents-max-height);
                                min-height: var(--near-contents-min-height);
                                background-color: var(--near-contents-background-color);
                                border: var(--near-contents-border);
                                border-radius: var(--near-contents-border-radius);  
                                margin: var(--near-contents-margin);
                                padding: var(--near-contents-padding); 
                                box-shadow: var(--near-contents-box-shadow);
                                clear: var(--near-contents-clear);
                                float: var(--near-contents-float);
                                transform: var(--near-contents-transform);
                                line-height: var(--near-contents-line-height);
                                -webkit-column-break-inside: avoid;
                                -moz-column-break-inside: avoid;
                                column-break-inside: avoid;
                                break-inside:avoid-column;
                                page-break-inside: avoid;
                        }
                        h3{margin: var(--near-contents-h3-margin)}
                        p{margin: var(--near-contents-p-margin)}
                        a {color:inherit;text-decoration:none;display:block;width:100%}
                        a:hover {text-decoration:underline; opacity:.5}
                        a > img, a > video, a > dummy-img{
                                max-width: var(--near-contents-image-max-width);
                                box-shadow: var(--near-contents-image-box-shadow);
                                float: var(--near-contents-image-float);
                                margin: var(--near-contents-image-margin);
                                border-radius: var(--near-contents-border-radius);
                        }
                        a > dummy-img {display:block;min-height:150px; background-color:#8884}
                        .label {
                                position: var(--near-contents-label-position);
                                left: var(--near-contents-label-left);
                                right: var(--near-contents-label-right);
                                top: var(--near-contents-label-top);
                                bottom: var(--near-contents-label-bottom);
                                background-color: var(--near-contents-label-background-color);
                                border: var(--near-contents-label-border);
                                border-radius: var(--near-contents-label-border-radius);
                                padding: var(--near-contents-label-padding);    
                        }
                        .byline,.dateline{
                                text-align: var(--near-contents-byline-text-align);
                        }
                        #refresh {
                                position:relative;
                                top: 0;
                                right:0;
                                border-radius:1em;
                                text-align:right;
                                display:block;
                                width:auto;
                                height:auto;
                                cursor:pointer;
                                color:#8888;
                                font-size:3vh;
                                z-index:1000;
                        }

                        `
                ];
        }

        constructor(key) {
                
                super();
                this.documents = [];
                
                let u=NearUser.instance;
                if(key) this.key=key;
                else this.key=u && "sub:"+u.sub;
                
        }


        attributeChangedCallback(name, oldval, newval) {
                console.log('attribute change: ', name, newval);
                super.attributeChangedCallback(name, oldval, newval);
                if(name=="key") this.load();
        }

        updated(){
                this.dispatchEvent(new CustomEvent("content-updated",{detail:this})); 
        }

        load(refresh=false){
                let u=NearUser.instance;
                let data=null;
                if (this.nocache){  
                        if(u && u.canEdit()){
                                let promise=u.getDocumentsByKey(this.key);
                                promise.then(data => { 
                                        this.addDocuments(data,"api data");
                                                                    
                                });
                                return;
                        }
                        fetch(NearUser.instance.baseURL+'/nearcontents/'+this.key)
                        .then((response) => {
                                if(response.ok)  
                                        response.json().then(data => this.addDocuments(data,'fetch data'));
                                else console.log(response)                                      
                        })
                        return;
                }
                if(!refresh && NearContents.cache && NearContents.cache.key===this.key) {
                        data=NearContents.cache.data;
                        console.log (data)
                        this.addDocuments(data);
                        return;
                }
                if (u && u.canEdit() && refresh ){
                        let promise=refresh? u.getDocumentsByKeyPut(this.key) : u.getDocumentsByKey(this.key);
                        promise.then(data => { 
                                this.addDocuments(data,"api data");
                                alert(this.key + " updated");
                        });
                }
                else {
                        fetch((NearUser.instance.baseURL||'')+'/'+this.key+".list.json")
                        .then((response) => {
                                if(response.ok)  
                                        response.json().then(data => this.addDocuments(data,'fetch data'));
                                else console.log(response)                                      
                        })
                }

        }

        addDocuments(data,msg){
                console.log (this, msg,data);
                this.documents=data.Items;
                if(this.descending)
                        this.documents.sort((a,b) => {
                                if(b.time && a.time)
                                        return b.time > a.time? 1 : -1
                                else if(b.time) return 1;
                                else if(a.time) return -1;
                                else return b.id > a.id? 1 : -1;        
                        })
                        
                
                NearContents.cache={"key":this.key,"data":data};
                this.requestUpdate();
        }

        refresh(){
                this.load(true);
        }

        documentsHTML(forceLink=false){
                let r=[];
                this.documents.forEach((item)=>{
                        let url=item.id;
                        if(this.titleOnly)
                                r.push(html`<div><a href="${url}">${item.title}</a></div>`);
                        else if(!forceLink && item.html)
                                r.push(html`${unsafeHTML(item.html)}`)
                                
                        else          
                          r.push(html`
                               <div>
                               <a href="${url}">
                               ${item.image? 
                                html`<img src="${item.image}">`
                                : 
                                html`<dummy-img></dummy-img>` }
                               <div class="label"> 
                               <h3>${item.title}</h3>
                               <p>${item.description}</p>
                               </div>
                               </a>
                               </div>
                        `)
                });
                if(!this.nocache && NearUser.instance && NearUser.instance.canEdit())
                        r.push(html`<mwc-button style="clear:both" outlined id="refresh" icon="redo" label="rebuild" class="properties-icon" @click="${this.refresh}" title="rebuild"></mwc-button>`)
                return r;
        }

        render() {
                return html`
               ${this.documentsHTML()}
                `;
        }
        
}

customElements.define("near-contents",NearContents);

export class NearContentsSelect extends NearContents {

        static get properties() {
                return {
                  key: { type: String, reflect: true },
                  selected: { type: String, reflect: true },
                  descending: { type:Boolean, default: false}                
                };
        }

        static get styles() {
                return [
                        styles(), 
                        css`
                        img {max-width:50px; float:left;}
                        select {width:100%;padding:.5em}
                        `
                ];
        }

        constructor() {
                super();
                
        }



        load(refresh=false){
                let u=NearUser.instance;
                let data=null;
                if(false && !refresh && NearContents.cache && NearContents.cache.key===this.key) {
                        data=NearContents.cache.data;
                        console.log (data)
                        this.addDocuments(data);
                        return;
                }
                if (u){
                        let promise=refresh && u.canEdit()? u.getDocumentsByKeyPut(this.key) : u.getDocumentsByKey(this.key);
                        promise.then(data => this.addDocuments(data,"api data"));
                }
                else {
                        fetch(NearUser.instance.baseURL+'/'+this.key+".list.json")
                        .then((response) => {
                                if(response.ok)  
                                        response.json().then(data => this.addDocuments(data,'fetch data'));
                                else console.log(response)                                      
                        })
                }

        }

        documentsHTML(){
                let r=[];
                let hasSelected=false;
                this.documents.forEach((item)=>{
                         if(this.selected && item.id==this.selected) {
                                r.push(html`<option value="${item.id}" selected>${item.title}</option>`);
                                this.o=item;
                                hasSelected=true;
                        } 
                        else
                                r.push(html`<option value="${item.id}">${item.title}</option>`); 
                }); 
                if(!hasSelected) {
                        this.o=this.documents[0];
                        //this.dispatchEvent(new CustomEvent("content-selected",{detail:this}))
                }                   
                return r;
        }

        get value(){
                return this.o;
        }

        getValue(){
                return this.o;
        }

        handleInput(){
                let select=this.shadowRoot.getElementById("select");
                this.selected=select.value;
                if(select.selectedIndex >=0)
                        this.o=this.documents[select.selectedIndex]
                else
                        this.o=null;
                this.dispatchEvent(new CustomEvent("content-selected",{detail:this}));                
        }
        render() {
                return html`
                <select id="select" @change="${this.handleInput}">
               ${this.documentsHTML()}
               </select>
                `;
        }
        
}

customElements.define("near-contents-select",NearContentsSelect);


export class NearContentsSwiper extends NearContents {
        static get styles() {
                return [css`
                        :host {display:block; margin:-1em}
                        div {position:relative;}  
                        .byline{ntop:80%}
                        .dateline{ntop:85%}
                        p{display:block;text-align:center;text-shadow:2px 2px 2px #888;margin:2em}
                        img {position:absolute;vert:;z-index:-1;left:0;right:0;top:0;bottom:auto;max-width:100%;width:100% ;display:block; margin:auto}
                        h3,.byline,.dateline{nposition:absolute; nright:2em; text-align:center;ntext-shadow: 2px 2px 2px #fff;margin:.5em;}
                        h3{margin-top:0;padding:.5em;font-size:3vw;nposition:absolute; ntop:1em; nright:1em; text-align:center;
                                font-family:'Cormorant Garamond', serif;color:#000c;background-color:#fff8; font-weight:100;}
                        .byline,.dateline{font-size:2vh}
                        a {text-decoration:none; color:white}
                        
                        #refresh {
                                position:relative;
                                top:-2em;
                                text-align:right;
                                display:block;
                                width:auto;
                                height:auto;
                                cursor:pointer;
                                color:#8888;
                                font-size:3vh;
                                z-index:1000;
                        }
                       
                        `]
                        ;
        }

        documentsHTML(){
                let r=[];
                this.documents.forEach((item)=>{
                        let url=item.id;
                        if(item.html)
                                r.push(html`<div part="slide"><div > ${unsafeHTML(item.html)}</div></div>`)
                                
                        else          
                          r.push(html`
                                <a href="${url}">
                               <div part="slide"><div >
                               
                               ${item.image? 
                                html`<img src="${item.image}">`
                                : ''}
                               <h3>${item.title}</h3>
                               <p>${item.description}</p>
                               </div></div></a>
                        `)
                });
                return r;
        }

        render() {
                return html`
                <near-swiper  time="5000">
               ${this.documentsHTML()}
                </near-swiper>
                ${NearUser.instance && NearUser.instance.canEdit() ?
                 html`<mwc-button id="refresh"  outlined class="properties-icon" icon="redo" label="rebuild"  @click="${this.refresh}" title="rebuild"></mwc-icon>`
                :''}
                `;
        }

}
customElements.define("near-contents-swiper",NearContentsSwiper);

export class rawHTML {

        constructor(html) {
                this.html=html;
        }

        getHTML(){
                return this.html;
        }
}