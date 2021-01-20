import { LitElement, html, css } from 'lit-element';
import { Template } from 'lit-html';
import { NearUser } from './user';
import {Icon} from "@material/mwc-icon"
export class NearTags extends LitElement {
        static get styles() {
                return css`
                    :host {
                            
                            min-height: 120px;
                            max-width:400px;
                            border-top: solid 1px #ccc;
                            
                            color:#999;
                    }
 
                    :host .spinner{ margin:auto;min-height:100px;}
                    input{border:solid 1px #888C; border-radius:1em;padding:1px 1.5em 1px 1em; color:#888c; font-size:inherit}
                    label{display:block;text-align:center} 
                       
                    
                `;
        }
        /**
         * Define properties. Properties defined here will be automatically 
         * observed.
         */
        static get properties() {
                return {
                        obj: { type: Object, reflect: true }
                };
        }

        /**  
         * In the element constructor, assign default property values.
         */
        constructor(pathname) {
                // Must call superconstructor first.
                super();
                // Initialize properties
                //this.loadComplete = false;
                this.message = '';
                this.tags = new Map();
                let data=null;
                let u=NearUser.instance;
                if(pathname) this.pathname=pathname;
                else this.pathname=window.location.pathname;
                let shouldRefresh= !NearTags.cache || NearTags.cache.path!==this.pathname;

                if(!shouldRefresh) {
                        data=NearTags.cache.data;
                        this.addTags(data);
                }
                else if(u) {
                        u.getDocumentsById(this.pathname)
                        .then(data=>{
                                console.log (data)
                                this.addTags(data);                                
                                NearTags.cache={"path":this.pathname,"data":data};
                        })
                }
                console.log("NearTags constr.  pathname:",this.pathname)
                
        }

        addTags(data){
                console.log("addTags:",data);
                data.Items.forEach((item)=>{
                        console.log("tag:", item)
                        const tag=new Tag(item.key, item);                                        
                        this.tags.set(item.key,item);                  
                })
                this.requestUpdate();
        }

        tagsHTML(){
                let r=[];
                
                this.tags.forEach((item)=>{
                        if(item.key.indexOf(':')==-1) 
                                r.push(html`<near-tag tag="${item.key}" @tag-removed="${this.deleteTag}"></near-tag>`)
                });
                return r;
        }

        render() {
                return html`
               ${this.tagsHTML()}
                <input  id="in"
                        type="text"
                        @change="${this.changed}"
                        value="">
                `;
             
        }

        onClick(e){
                console.log(e);
                let target=null;
                if(e.path)
                        target=e.path[0];
                else if(e.originalTarget)
                        target=e.originalTarget;  
                if (target){            
                        let event = new CustomEvent('resource-click', { 
                                detail: { clicked: target },
                                bubbles: true, 
                                composed: true });
                        this.dispatchEvent(event);
                }  
        };


        
        buildObj(tag){
                
                let obj=this.obj;
                obj.id=window.location.pathname,
                obj.key=tag;
                return obj;
        }

        deleteTag(e){
                console.log(e)
                this.tags.delete(e.detail.tag);
                NearTags.cache=null;
                this.requestUpdate();
        }

        putTag(obj) {
                NearUser.instance 
                && NearUser.instance
                && NearUser.instance.canEdit()
                && NearUser.instance.putDocument(obj)
                .then((data)=>{
                        //console.log("DATA:",data);
                        this.tags.set(obj.key,obj);
                        NearTags.cache=null;
                        this.requestUpdate();
                })
        }
        
        changed(){
                const obj=this.buildObj(this.shadowRoot.getElementById("in").value)
                console.log("changed")
                //this.putTag(obj);
                NearUser.instance 
                && NearUser.instance
                && NearUser.instance.canEdit()
                && NearUser.instance.putDocument(obj)
                .then((data)=>{
                        //console.log("DATA:",data);
                        this.tags.set(obj.key,obj);
                        NearTags.cache=null;
                        this.requestUpdate();
                })
        }
        
        updateTags(object){
                this.obj=object;
                this.tags.forEach((item)=>{
                        let obj=this.buildObj(item.key);
                        this.putTag(obj);
                });
        }

        close(){
               this.parentElement.removeChild(this); 
        }
}




class Tag extends LitElement {


        static get styles() {
                return css`
                    :host {position:relative;display:inline-block;border:solid 1px #888C; border-radius:1em;padding:1px 1.5em 1px 1em; color:#888c}
                    mwc-icon{position:absolute; right:0; font-size:1.2em}                    
                `;
        }

        static get properties() {
                return {
                tag: { type: String }
                };
        }

        constructor() {
                super();
        }
        

        clear(){
                NearUser.instance 
                && NearUser.instance
                && NearUser.instance.canEdit()
                && NearUser.instance.deleteKey(window.location.pathname,this.tag)
                .then(()=> {
                        this.dispatchEvent(new CustomEvent("tag-removed",{detail:this}));
                })

        }

        
        render() {
                return html`${this.tag}<mwc-icon title="remove" @click="${this.clear}">remove_circle</mwc-icon>`
        }
}


customElements.define('near-tags', NearTags);
customElements.define('near-tag', Tag);
