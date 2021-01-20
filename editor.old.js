

 


import { LitElement, html, css } from 'lit-element';
import {Icon} from "@material/mwc-icon"
//import {IconButton} from "@material/mwc-icon-button";
import {NearResources} from "./resources";
import {NearUser} from "./user";
import { Button } from '@material/mwc-button';
//import {getMediumDragging, getNearToolbar,nearToolbarControls} from "./medium";
//import {Figure} from "./figure";
import {NearContent} from "./content";



class SectionControl extends LitElement {

    
    static get styles() {
                
        return css`
                :host {
                        min-height:20px;
                        nwidth:100%;
                        border-top:solid 1px #8888;
                        border-right:solid 1px #8888;
                        border-radius:10px;   
                        padding-left:20px;
                        display:flex;
                        flex-wrap:wrap; 
                        justify-content:flex-end;
                        font-size:12px;
                        opacity: 0.5;
                        position:relative;
                        top:0;
                        margin-top:1em;
                        
                }
                :host([dragtarget]) {
                    border-top:solid 5px #f80; 
                    flex-basis: 100%;   

                }
                :host mwc-icon, :host span{ color:#888; padding:2px 8px; cursor:pointer}
                :host mwc-icon{font-size:16px}
                :host mwc-icon[plus] {
                    position:absolute;left:0; top:-10px;
                    font-size:24px;
                    display:inline-block;
                    border:solid 1px;
                    border-radius:0.75em;            
                    background-color:#fff;
                    box-shadow:1px 1px 2px #000;
                    padding:2px;
                }
                :host mwc-icon[disabled]{
                    color:#0004;
                    cursor:none;
                }
                :host span{font-size:12px}
                .dropper{min-width:200px; min-height:200px;margin:auto; 
                    flex-basis:100%; background-color:#8888; 
                    display:flex; flex-direction:column;}
                    
                .form {width:100%;background-color:#8884; text-align:left;}
                .form textarea{box-sizing:border-box;width:100%;padding:1em;height:100px; color:#000}
                .form button{border:none; color:#000}
                .form button[disabled]{border:none; color:#ccc}
                .form mwc-icon{ font-size:24px; color:#000; }
                .form #msg{color:red}
                .form .submit {display:block;text-align:right};
            
        `;
    
    }
    constructor(nearEditor) {
        super();
        this.contentEditable=false;
        this.nearEditor=nearEditor;
    }

    initEditables(node){
        const elements=node.querySelectorAll('.e');
        let first=null;
        elements.forEach((element)=>{
            if(!first) first=element;
            element.setAttribute('contenteditable','');
            //element.addEventListener("keyup",this.handleKeyup);
            //element.addEventListener("keydown",this.handleKeydown);
            //field.addEventListener("mouseup",this.handleKeyup);
            element.addEventListener("keyup",NearEditor.handleKeyup);
            element.addEventListener("keydown",NearEditor.handleKeydown);
            element.addEventListener("drop",NearEditor.handleDrop);
            element.addEventListener("mousedown",NearEditor.handleMousedown);
        })
        try{
            first.focus();
        }
        catch(e){}

    }

    createSection(content=null) {
        
    }

    addSection1(content){	
        var node=document.createElement("section");
        node.appendChild(new SectionControlImpl(this.nearEditor));
       
        console.log(content)    
        if(content) {
            if(content instanceof String) node.insertAdjacentHTML("beforeend",content);
            else if(content instanceof Node) node.appendChild(content);
        }
        node.insertAdjacentHTML("beforeend",'<div class="e" placeholder="..."></div>');

        if(this instanceof SectionsStart)
            this.parentNode.insertBefore(node,this.nextSibling);
        else
            this.parentNode.parentNode.insertBefore(node,this.parentNode.nextSibling);
        this.initEditables(node);
        return node;  
    }

    addSection(content){	
        var node=document.createElement("section");
        if(!content || content instanceof Event) {
            node.innerHTML='';
            if(content instanceof Event) content.preventDefault();
            let types=this.nearEditor.types;
            if(types) {
                let values=Object.values(types);
                if (values.length==1)
                    node.innerHTML=values[0];
            }
            else
                    node.innerHTML='<div class="e" placeholder="..."></div>';

        }
        else if(typeof(content) == "string")node.innerHTML=content;
        else if(content instanceof Node) node.appendChild(content); 
        node.insertAdjacentElement("afterbegin",new SectionControlImpl(this.nearEditor));
        //console.log(typeof(content))    
        if(this instanceof SectionsEnd)
            this.parentNode.insertBefore(node,this);
        else
            this.parentNode.parentNode.insertBefore(node,this.parentNode);
        this.initEditables(node);
        return node;  
    }

    addContent(){
        this.addSection('<near-content></near-content>');
    }


    deleteSection(){
        if(window.confirm('delete?')) this.parentElement.parentElement.removeChild(this.parentElement);
    }

    cloneSection(){
        const node=this.parentElement.cloneNode(true);
        this.parentElement.parentElement.insertBefore(node,this.parentElement);
    }

    sectionDragEnter(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if(this.dragging) return;
        this.classList.add("dragtarget")
        this.setAttribute('dragtarget',"");
        
    }
    
    sectionDragLeave(ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.classList.remove("dragtarget");
        this.removeAttribute('dragtarget');
    }
    
    sectionDragOver(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if(this.dragging) return;
        this.dragtarget=true;
        this.classList.add("dragtarget");
        this.setAttribute('dragtarget',"");  
    }
    
    
    sectionDragStart(ev){
        ev.dataTransfer.setData("Section",this.parentElement.outerHTML);
        this.dragging=true;
        SectionControl.dropped=false;
    }

    sectionDrag(ev){
        ev.preventDefault();
        ev.stopPropagation();
        //ev.dataTransfer = ev.originalEvent.dataTransfer;
        ev.dataTransfer.setData("Section",this.parentElement.outerHTML);
        this.dragging=true;
        SectionControl.dropped=false;
    }
    
    sectionDragEnd(ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.dragging=false;
        if(SectionControl.dropped) 
            this.parentNode.parentNode.removeChild(this.parentNode);
        SectionControl.dropped=false;    
    }
    
    
    sectionDrop(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if(this.dragging) return;
        this.classList.remove("dragtarget");
        this.removeAttribute('dragtarget');
        //ev.dataTransfer = ev.originalEvent.dataTransfer;
        var data=ev.dataTransfer.getData("Section");
        if (data){  
            var node=document.createElement("section");
            //node.setAttribute("contenteditable", "");
           
            if(this instanceof SectionsEnd)
                this.parentNode.insertBefore(node,this);
            else
                this.parentNode.parentNode.insertBefore(node,this.parentNode);
            node.outerHTML=data;      	  
            SectionControl.dropped=true;
        }
    }

    exec(command,e,value){
        e.stopPropagation();
        e.preventDefault()
        //console.log(document.activeElement);
        document.execCommand(command, false,value);
    }



    setContent(t){
        
        console.log("event",t);
        this.parentElement.insertAdjacentHTML('beforeend',this.nearEditor.types[t]);
        this.initEditables(this.parentElement);
    }

    typeButtons(){
        let r=[];
        console.log("typeButtons:" ,this.nearEditor.types)
        Object.keys(this.nearEditor.types).forEach(t=>{
            console.log(t)
        r.push(html`<mwc-button @click="${(e)=>this.setContent(t)}" >${t}</mwc-button>`)
        })
        return r;
    }

}


class SectionsStart extends SectionControl {
    constructor(nearEditor){
    super(nearEditor);
    }

    render(){
        //return html`<mwc-icon>save</mwc-icon>`
        return html``
    }

}

class SectionsEnd extends SectionControl {
    constructor(nearEditor){
        super(nearEditor);
        this.addEventListener('drop',this.sectionDrop,true);	
        this.addEventListener('dragenter',this.sectionDragEnter,true);	
        this.addEventListener('dragover',this.sectionDragOver,true);
        this.addEventListener('dragleave',this.sectionDragLeave,true);
    }

    render(){
        return html`<a href="#" tabindex="0" @click="${this.addSection}"><mwc-icon plus>add</mwc-icon></a>
                    <a href="#" tabindex="0" @click="${this.addContent}"><mwc-icon>post_add</mwc-icon></a>`
    }

}

SectionControl.states= Object.freeze({
    view:0,
    code:3
})


class SectionControlImpl extends SectionControl {
    constructor(nearEditor){
    super(nearEditor);
        //draggable target
        this.addEventListener('drag',this.sectionDrag);
        this.addEventListener('dragstart',this.sectionDragStart);
        this.addEventListener('dragend',this.sectionDragEnd);

        //drop target 
        this.addEventListener('drop',this.sectionDrop,true);	
        this.addEventListener('dragenter',this.sectionDragEnter,true);	
        this.addEventListener('dragover',this.sectionDragOver,true);
        this.addEventListener('dragleave',this.sectionDragLeave,true);
        this.draggable=true;
        this.state=SectionControl.states.view;
    }


    editControls() {
        return html`
            
            <mwc-icon title="bold" @mousedown="${(e)=>this.exec('bold',e)}">format_bold</mwc-icon>
            <mwc-icon title="italic" @mousedown="${(e)=>this.exec('italic',e)}">format_italic</mwc-icon>
            <mwc-icon title="underline" @mousedown="${(e)=>this.exec('underline',e)}">format_underline</mwc-icon>
            <mwc-icon title="link" @mousedown="${(e)=>this.exec('createLink',e,window.prompt("url?","https://"))}">link</mwc-icon>

            <span title="header 1" @mousedown="${(e)=>this.exec('formatBlock',e,'h1')}">H1</span>
            <span title="header 2" @mousedown="${(e)=>this.exec('formatBlock',e,'h2')}">H2</span>
            <span title="header 3" @mousedown="${(e)=>this.exec('formatBlock',e,'h3')}">H3</span>
            
                
            <mwc-icon title="gallery" @mousedown="${this.insertImage}">image</mwc-icon>
            <mwc-icon title="embed" @mousedown="${this.insertVideo}">video_library</mwc-icon>
            <mwc-icon title="insert code" @mousedown="${this.insertCode}">web_asset</mwc-icon>

            <mwc-icon title="blockquote" @mousedown="${(e)=>this.exec('formatBlock',e,'blockquote')}">format_quote</mwc-icon>
            <mwc-icon title="indent" @mousedown="${(e)=>this.exec('indent',e)}">format_indent_increase</mwc-icon>
            <mwc-icon title="outdent" @mousedown="${(e)=>this.exec('outdent',e)}">format_indent_decrease</mwc-icon>
            <mwc-icon title="align left" @mousedown="${(e)=>this.exec('justifyLeft',e)}">format_align_left</mwc-icon>
            <mwc-icon title="align center" @mousedown="${(e)=>this.exec('justifyCenter',e)}">format_align_center</mwc-icon>
            <mwc-icon title="align right" @mousedown="${(e)=>this.exec('justifyRight',e)}">format_align_right</mwc-icon>
            <mwc-icon title="justify" @mousedown="${(e)=>this.exec('justifyFull',e)}">format_align_justify</mwc-icon>
            <mwc-icon title="numbered list" @mousedown="${(e)=>this.exec('insertOrderedList',e)}">format_list_numbered</mwc-icon>
            <mwc-icon title="bulleted list" @mousedown="${(e)=>this.exec('insertUnorderedList',e)}">format_list_bulleted</mwc-icon>
            ${ "nearCart" in window?
                html`<mwc-icon title="add to cart" @mousedown="${this.createProduct}">add_shopping_cart</mwc-icon>`
                : ''
            }
            <mwc-icon title="no hace nada todavía">short_text</mwc-icon>
            <mwc-icon title="clear format" @mousedown="${(e)=>this.exec('removeFormat',e)}">format_clear</mwc-icon>
            
            <mwc-icon title="code" @mousedown="${this.code}">code</mwc-icon>
            
        `
    }


    codeForm(){
        console.log("codeForm")
        return html`
            <div class="form">
            <label>HTML
            <textarea id="code" @input="${this.checkHTMLEvent}">${this.getCode()}</textarea>
            </label>
            <div class="submit"><span id="msg"></span><mwc-icon title="OK" disabled id="okbutton" @mousedown="${this.putCodeFromForm}">done</mwc-icon></div>
            </div>
        `;
    }


    code(e){
        console.log("code");
        this.state=SectionControl.states.code;
        this.requestUpdate();
    }


    getCode(){
        let node=this.parentElement.cloneNode(true);
        node.removeChild(node.children[0]);
        return node.innerHTML.trim();
    }

    putCode(code){
        let node=this.parentElement;
        node.innerHTML="";        
        node.appendChild(this);        
        if(code){
            if(code instanceof Node) node.appendChild(code)
            else {
                console.log(typeof code);
                node.insertAdjacentHTML("beforeend",code);
            }
        }       
    }

    putCodeFromForm(e){
        let code=this.shadowRoot.getElementById("code").value.trim();
        this.putCode(code);
        this.state=SectionControl.states.view;
        this.requestUpdate(); 
    }


    checkHTML(code){
        let doc = document.createElement('div');
        doc.innerHTML = code;
        //console.log(doc.innerHTML,code)
        return ( doc.innerHTML === code );
    }

    checkHTMLEvent(e) {
        let code=e.target.value.trim();
        let okButton=this.shadowRoot.getElementById("okbutton");
        let msgSpan=this.shadowRoot.getElementById("msg");
        if (this.checkHTML(code)) {
            okButton.removeAttribute("disabled");
            msgSpan.innerHTML="";
        }
        else { 
            okButton.setAttribute("disabled","");
            msgSpan.innerHTML="invalid HTML";
        }    
    }


    render(){
        if(this.state==SectionControl.states.code)
            return this.codeForm();
        return html`
            <div class="control">
            ${this.focused? this.editControls() : ""}
            <mwc-icon title="duplicate section" @click="${this.cloneSection}">content_copy</mwc-icon>
            <mwc-icon title="insert section" @click="${this.addSection}" plus >add</mwc-icon>
            <mwc-icon title="remove section" @click="${this.deleteSection}">delete</mwc-icon>
            </div>
            ${this.parentElement.childElementCount<2?
            html`<div class="dropper">${this.typeButtons()}</div>` : ""}
            `
    }

    createProduct(){
        this.parentElement.insertAdjacentHTML("beforeend",'<near-product><span slot="description"></span><span slot="price" ></span></near-product>');
    }
    
    createFigure(h) {
        
        const node=document.createElement('figure');
        const fc=new FigureControl(this.nearEditor);
        node.appendChild(fc);
        const target=this.parentElement;
        //target.insertBefore(node,ev.target);
        //target.insertBefore(node,target.children.length > 1? target.childNodes[1] : null);
        target.appendChild(node);
        node.insertAdjacentHTML("beforeend",h+'<figcaption class="e">caption</figcaption>');
        fc.initEditables(node);
        return fc;
            //this.innerHTML=`<img src="${uri}"><figcaption>${uri}</figcaption>`;
            //this.requestUpdate(); 
        
    }


 

    insertImage(e){
        e.stopPropagation();
        e.preventDefault();
        this.createFigure("").resources();


    }

    insertVideo(e){
        e.stopPropagation();
        e.preventDefault();
        this.createFigure("").embed();

    }

    insertCode(e){
        e.stopPropagation();
        e.preventDefault();
        this.createFigure("").code();
    }

    handleFocusIn(ev){
        console.log('focus')
        this.focused=true;
        this.requestUpdate();
    }
    handleFocusOut(ev){
        console.log('blur');
        this.focused=false;
        this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback()  
        console.log('connected')
        this.parentElement.addEventListener('focusin',this.handleFocusIn.bind(this));
        this.parentElement.addEventListener('focusout',this.handleFocusOut.bind(this));

    }
    disconnectedCallback() {
        super.disconnectedCallback()  
        console.log('disconnected')
    }

}




class FigureControl extends SectionControl {

    constructor(nearEditor){
        super(nearEditor);
        this.state=FigureControl.states.view;
    }



    scrappedButtons(){
        let h='';
 
        return html`${h}`;
    }

    embedForm(){
        let t=[];
        t.push(html`
            <div class="form">
            <label>embed URL
            <input id="url" @input="${this.scrapURL}" value="">
            </label> 
            </div>           
        `);
        if(this.scrapped) {
            let data=this.scrapped;
            if(data.oembed)
                t.push(html`<button @click="${this.selectOembed}">oEmbed</button>`);
            if(data.og)
                t.push(html`<button @click="${this.selectOpenGraph}">opengraph</button>`);
            if(data.twitter)
                t.push(html`<button @click="${this.selectCard}">card</button>`);
            t.push(html`<div class="submit"><span id="msg"></span><mwc-icon title="done" id="donebutton" @click="${this.view}">done</mwc-icon></div>`);             
        }
        
        return t;
    }

    codeForm(){
        return html`
            <div class="form">
            <label>HTML
            <textarea id="code" @input="${this.checkHTMLEvent}">${this.getCode()}</textarea>
            </label>
            <div class="submit"><span id="msg"></span><mwc-icon title="OK" disabled id="okbutton" @mousedown="${this.putCodeFromForm}">done</mwc-icon></div>
            </div>
        `;
    }

    render(){
        let t=null;
        switch(this.state){
            case FigureControl.states.view: 
                if(this.parentElement.children.length<3)
                    t=html`<div class="dropper" @click="${this.resources}"></div>`;
                break;
            case FigureControl.states.code:
                t=this.codeForm();   
                break;
            case FigureControl.states.embed:
                    t=this.embedForm();          

        }
        return html`
            <div class="control">
            <mwc-icon title="link" @mousedown="${this.link}">link</mwc-icon>
            <mwc-icon title="gallery" @click="${this.resources}">image_search</mwc-icon>
            <mwc-icon title="embed" @click="${this.embed}">video_library</mwc-icon>
            <mwc-icon title="code" @click="${this.code}">code</mwc-icon>
            <mwc-icon title="float left" @mousedown="${this.left}">format_align_left</mwc-icon>
            <mwc-icon title="center" @mousedown="${this.center}">format_align_center</mwc-icon>
            <mwc-icon title="float right" @mousedown="${this.right}">format_align_right</mwc-icon>
            <mwc-icon title="up" @mousedown="${this.upward}">arrow_upward</mwc-icon>
            <mwc-icon title="down" @mousedown="${this.downward}">arrow_downward</mwc-icon>
            <mwc-icon title="delete" @click="${this.deleteSection}">delete</mwc-icon>
            </div>
            ${t}
        `;
        
    }

    view(){
        this.state=FigureControl.states.view;
        this.requestUpdate();
    }
   

    getResourcesFolder(){
        let folder=null;
        this.parentElement.parentElement.childNodes.forEach(child =>{
            console.log(child)
            if(child instanceof NearContent ) {
                
                folder=child.key;
            }
        });
        return folder;
    }

    resources(e){

        const r= new NearResources(this.getResourcesFolder());
        console.log("resources", this.getResourcesFolder());
        r.setAttribute("modal","");
        r.addEventListener("resource-click",this.onResourceClick.bind(this));
        document.querySelector("body").appendChild(r);
    }

    link(e){
        //let selection = document.getSelection();
        //selection.setBaseAndExtent(this.nextElementSibling, 0, this.nextElementSibling,0);
        this.exec('createLink',e,window.prompt("url?","https://"));
    }

    embed(e){
        this.state=FigureControl.states.embed;
        this.requestUpdate();
    }
    checkEmbedEvent(e){
        let okButton=this.shadowRoot.getElementById("okbutton");
        okButton.removeAttribute("disabled");
    }


    selectOembed(e){
        let caption=this.parentElement.lastElementChild;
        let data=this.scrapped.oembed;
        this.putCode(data.html);
       
        if(caption){
            try{
                caption.innerHTML=`${data.description}<br>source: <a href="${data.url}">${data.author_name} at ${data.provider_name}</a>`
            }
            catch(e){}
        }
    }
    selectOpenGraph(e){
        let caption=this.parentElement.lastElementChild;
        let data=this.scrapped.og;
        let h=`<div><a href="${data.url}"><img src="${data.image.url}"><h3>${data.title}</h3></a></div>`
        this.putCode(h);
       
        if(caption){
            try{
                caption.innerHTML=`${data.description}<br>source: <a href="${data.url}">${data.site_name}</a>`
            }
            catch(e){}
        }
    }
    selectCard(e){
        let caption=this.parentElement.lastElementChild;
        let data=this.scrapped.twitter;
        let h=`<div><a href="${data.url}"><img src="${data.image}"><h3>${data.title}</h3></a></div>`
        this.putCode(h);
       
        if(caption){
            try{
                caption.innerHTML=`source: <a href="${data.url}">${data.site.name}</a>`
            }
            catch(e){}
        }
    }


    scrapURL(){
        
        let url=this.shadowRoot.getElementById("url").value.trim();
        
        let u=NearUser.instance;
        this.putCode('<span class="spinner"></span>')
        u.getEmbed(url).then((data)=>{
            if(data) {
                this.scrapped=data;
                if(data.oembed)
                    this.selectOembed();
                else if(data.og)
                    this.selectOpenGraph();
                else if(data.twitter)
                    this.selectCard();
                else
                    this.putCode("");                   
                this.requestUpdate(); 
                console.log(data);
            }
            else this.putCode("");  
        }).catch((reason)=>{this.putCode("")})
    }

    code(e){
        this.state=FigureControl.states.code;
        this.requestUpdate();
    }

    getCode(){
        let node=this.parentElement.cloneNode(true);
        node.removeChild(node.children[0]);
        node.removeChild(node.querySelector("figcaption"));
        return node.innerHTML.trim();
    }

    putCode(code){
        let node=this.parentElement;
        let figCaption=node.lastElementChild;
        //node.childNodes.forEach((child)=>child.remove());
        node.innerHTML="";        
        node.appendChild(this);        
        if(code){
            if(code instanceof Node) node.appendChild(code)
            else {
                console.log(typeof code);
                node.insertAdjacentHTML("beforeend",code);
            }
        }       
        node.appendChild(figCaption);
        
    }

    putCodeFromForm(e){
        let code=this.shadowRoot.getElementById("code").value.trim();
        this.putCode(code);
        this.state=FigureControl.states.view;
        this.requestUpdate(); 
    }


    checkHTML(code){
        let doc = document.createElement('div');
        doc.innerHTML = code;
        //console.log(doc.innerHTML,code)
        return ( doc.innerHTML === code );
    }

    checkHTMLEvent(e) {
        let code=e.target.value.trim();
        let okButton=this.shadowRoot.getElementById("okbutton");
        let msgSpan=this.shadowRoot.getElementById("msg");
        if (this.checkHTML(code)) {
            okButton.removeAttribute("disabled");
            msgSpan.innerHTML="";
        }
        else { 
            okButton.setAttribute("disabled","");
            msgSpan.innerHTML="invalid HTML";
        }    
    }

    onResourceClick(e){
        console.log(e);
        const source=e.detail.clicked;
        if(source.tagName=="IMG" || source.tagName=='VIDEO') {
            //this.parentElement.insertBefore(source,this.parentElement.children[1]);
            this.putCode(source);
            if(source.tagName=='VIDEO')
                source.setAttribute("controls","");
            e.target.close();
            this.requestUpdate();
            
        }
    }

    left(){
        this.parentElement.setAttribute('left',"");
        this.parentElement.removeAttribute('right');
        //this.requestUpdate();
    }
    center(e){
        
        this.parentElement.removeAttribute('left');
        this.parentElement.removeAttribute('right');
        //this.requestUpdate();
    }
    right(e){
        this.parentElement.setAttribute('right',"");
        this.parentElement.removeAttribute('left');
        //this.requestUpdate();
    }

    upward(){
        let fig=this.parentElement;
        let el=fig.previousSibling
        let current=fig;
        while (true) {
            let p=el;
            if(el instanceof SectionControl || el instanceof NearEditor) return;
            else if(!el) { 
                current=current.parentElement; 
                el=current.previousSibling;
            }    
            else if(el.hasChildNodes() && el.tagName=="DIV")
                el=el.lastChild;
            else break;
        }
        console.log(el);
        if(el) {
            el.parentElement.insertBefore(fig,el);
        }
    }
      
    downward(){
        let fig=this.parentElement;
        let el=fig.nextSibling;
        let current=fig;
        while (el && el.tagName=="DIV" && el.hasChildNodes())
            el=el.firstChild;
        while (!el && current.parentElement.tagName=="DIV") { 
            current=current.parentElement; 
            el=current.nextSibling; 
        }
        if(el) {
            el.parentElement.insertBefore(fig,el.nextSibling);
        }
    }


}

FigureControl.states= Object.freeze({
        view:0,
        resources:1,
        embed:2,
        code:3
})

customElements.define('sections-start', SectionsStart);
customElements.define('sections-end', SectionsEnd);
customElements.define('section-control', SectionControlImpl);
customElements.define('figure-control', FigureControl);



// Extend the LitElement base class
export class NearEditor extends LitElement {


    constructor() {
        super();
        this.editing=false;
        this.editor=null;
        this.currentBlock=null;
        this.alleditable=false;
        //this.shadowRoot.addEventListener("slotchange", (e=>{console.log("slotchanged");this.requestUpdate("slotupdated",false)}).bind(this));
        this.types={
            "Section": `<div class="e" placeholder="..."></div>`,
     //       "Content": `<near-content></near-content>`
        };
    }

    static get styles() {
        return css`
        :host{display:block}
        #editControl, #editDone, #editCancel { text-decoration:none; }
        #editControl {color:#930}
        #editDone {color:green}
        #editCancel {color:red}
        .editBar {text-align:right; opacity:0.5; font-size:15px; clear:both}
        .editBar mwc-icon {font-size:1cm; text-shadow: 1mm 1mm 1mm #4448; margin:1em;}
        .medium-editor-toolbar li button { height:30px; min-width:30px} 
        .medium-editor-toolbar li button mwc-icon{ font-size:15px}
        .focus{border:solid 1px #ccc} 
        #status{font-size:small; color:#8888}       
        `
    }

    static get properties() {
        return {
        alleditable: {type: Boolean, reflect: true}                   
        };
    }

    setTypes(types) {
        this.types=types;
    }

    render(){
 
      return html`
      <slot></slot>
      ${NearUser.canEdit()?
      html` 
       <div class="editBar">
        
        ${this.editing? 
        html`
        <a id="editCancel" href="#" title="cancel" @click="${this.cancelEdit}" ><mwc-icon >cancel</mwc-icon></a>
        <a id="editDone" href="#" title="OK" @click="${this.endEdit}" ><mwc-icon >done</mwc-icon></a>`
        :
        html`<a id="editControl" title="edit" href="#" @click="${this.startEdit}" ><mwc-icon >edit</mwc-icon></a>`}        
       </div>
       <div id="status"></div>
       ` :''}
      `;

    }


    startEdit(){
        this.editing=true;
        this.editFields();
        this.requestUpdate();
        let event = new CustomEvent('start-edit', { 
            detail: {  },
            bubbles: true, 
            composed: true });
        this.dispatchEvent(event);
    }

    endEdit(done=true){
        this.editing=false;
        this.endEditFields();
        this.requestUpdate();
        if(done){
            let event = new CustomEvent('end-edit', { 
                detail: { },
                bubbles: true, 
                composed: true });
                this.dispatchEvent(event);
        }       
    }

    cancelEdit(){
        this.endEdit(false);
    }

    slotUpdated(){
        this.shadowRoot.getElementById("status").innerHTML="editable";
        this.requestUpdate();
    }

    editToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        if(this.editing) this.endEdit();
        else this.startEdit()
    }

    editFields() {


        console.log("editFields invoked");
        var slot=this.shadowRoot.querySelector('slot');
        var elements=slot.assignedNodes({flatten:true});

            //.querySelectorAll('.medium');
        console.log(elements);
        {   let ads=this.querySelectorAll(".autoplaced-by-us, #end_content, #ad-amz");
            ads && ads.forEach(ad => { 
                console.log("remove:", ad)
                ad.parentElement.removeChild(ad);
            });
            ads=this.querySelectorAll(".googleads");
            ads && ads.forEach(ad => ad.parentElement.removeChild(ad))
            let lazies=this.querySelectorAll("img[data-src]");
            lazies && lazies.forEach(lazy => {
                lazy.src=lazy.dataset.src;
                delete lazy.dataset.src;
            });

        }
        //console.log(elements.filter(el => "classList" in el  && el.classList.contains('e') ));
        //var fields = elements.filter(el =>  "classList" in el && el.classList.contains('e') );
        var fields=this.querySelectorAll(this.alleditable? '.e,section' : '.e');
        console.log(fields);
        fields.forEach((field)=>{
            field.setAttribute('contenteditable','');
            field.addEventListener("keyup",NearEditor.handleKeyup);
            field.addEventListener("keydown",NearEditor.handleKeydown);
            field.addEventListener("drop",NearEditor.handleDrop);
            field.addEventListener("mousedown",NearEditor.handleMousedown);
            //field.addEventListener("mouseover",NearEditor.handleMouseover);
        })
        
        this.insertBefore(new SectionsStart(this) ,this.hasChildNodes()? this.childNodes[0] : null);
        fields = elements.filter(el =>  el.tagName=="SECTION" );
        fields.forEach((field)=>{
            let el=new SectionControlImpl(this);
            field.insertBefore(el,field.hasChildNodes()? field.childNodes[0] : null);
        })        
        this.appendChild(new SectionsEnd(this));
  
        fields=this.querySelectorAll('figure');
        fields.forEach((field)=>{
            let el=new FigureControl(this);
            field.insertBefore(el,field.hasChildNodes()? field.childNodes[0] : null);
        })  

        fields = elements.filter(el =>  "classList" in el && el.classList.contains('field') )
        fields.forEach((field)=>{
            field.setAttribute('contenteditable','true');
            field.addEventListener("keyup",this.handleKeyup);
        })

        document.querySelectorAll("near-figure")
                .forEach((nearFigure) => nearFigure.requestUpdate());
        
    
    }
    
    endEditFields() {
        
        var fields=this.querySelectorAll(this.alleditable? '.e,section' : '.e'); 
        fields.forEach((field)=>{
            field.removeAttribute('contenteditable');
            field.removeEventListener("keyup",NearEditor.handleKeyup);
            field.removeEventListener("keydown",NearEditor.handleKeydown);
            field.removeEventListener("drop",NearEditor.handleDrop);
            field.removeEventListener("mousedown",NearEditor.handleMousedown);
        })

        this.removeChild(this.querySelector('sections-start'));
        var elements=this.querySelectorAll('section-control');
        elements.forEach((el)=>{
            el.parentElement.removeChild(el);
        }) 
        this.removeChild(this.querySelector('sections-end'));
        var elements=this.querySelectorAll('figure-control');
        elements.forEach((el)=>{
            el.parentElement.removeChild(el);
        }) 
    }
    /*
    handleKeydown(event) {
        //this.base.on
        //console.log(window.getSelection().anchorNode.parentElement);
       
        
    }

    handleKeyup(event) {
        let focusNode=window.getSelection().focusNode;
        //console.log(this.currentBlock);
        return;
    }

    handleDrop(ev){
        ev.preventDefault();
        ev.stopPropagation();
        console.log("DROP");
        console.log(ev);
        console.log(ev.dataTransfer.types);
        console.log(ev.dataTransfer.getData('text/uri-list'));
        var h= ev.dataTransfer.getData('text/html');
        console.log(h);
        if(h) {
            const node=document.createElement('figure');
            const fc=new FigureControl();
            node.appendChild(fc);
            ev.target.parentElement.insertBefore(node,ev.target);
            node.insertAdjacentHTML("beforeend",h+'<figcaption class="e">caption</figcaption>');
            fc.initEditables(node);
                //this.innerHTML=`<img src="${uri}"><figcaption>${uri}</figcaption>`;
                //this.requestUpdate(); 
        }
 
    }

    handleMousedown(e){
        console.log(e);
        if(e.target.tagName=="A") {
            e.preventDefault();
            e.stopPropagation();
            var url=window.prompt("url?",e.target.getAttribute("href"));
            if(url) e.target.setAttribute('href',url);
        }
    }
    */
    

  }


    NearEditor.handleKeydown=(event)=>{
        //this.base.on
        //console.log(window.getSelection().anchorNode.parentElement);    
    }

    NearEditor.handleKeyup=(event)=>{
        let focusNode=window.getSelection().focusNode;
        //console.log(this.currentBlock);
        return;
    }

    NearEditor.handleMousedown=(e)=>{
        console.log(e);
        if(e.target.tagName=="A") {
            e.preventDefault();
            e.stopPropagation();
            var url=window.prompt("url?",e.target.getAttribute("href"));
            if(url) e.target.setAttribute('href',url);
        }
    }

    NearEditor.handleDrop=(ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        console.log("DROP");
        console.log(ev);
        console.log(ev.dataTransfer.types);
        console.log(ev.dataTransfer.getData('text/uri-list'));
        var h= ev.dataTransfer.getData('text/html');
        console.log(h);
        if(h) {
            const node=document.createElement('figure');
            const fc=new FigureControl();
            node.appendChild(fc);
            ev.target.parentElement.insertBefore(node,ev.target);
            node.insertAdjacentHTML("beforeend",h+'<figcaption class="e">caption</figcaption>');
            fc.initEditables(node);
                //this.innerHTML=`<img src="${uri}"><figcaption>${uri}</figcaption>`;
                //this.requestUpdate(); 
        }

}


  customElements.define('near-editor', NearEditor);

