import { LitElement, html, css} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {render} from 'lit-html';
import {NearResources} from "./resources";
import {NearUser} from "./user";
import './near-icon.js';
import { nearPicoTokens, nearControlStyles } from './ui.css.js';
//import {getMediumDragging, getNearToolbar,nearToolbarControls} from "./medium";
//import {Figure} from "./figure";
import {NearContent} from "./content";


class SectionControl extends LitElement {

    
    static get styles() {
                
        return [nearPicoTokens, nearControlStyles, css`
                :host {
                        min-height:10px;
                        nwidth:100%;
                        border-top:solid 1px #8888;
                        nborder-right:solid 1px #8888;
                        border-radius:0px;   
                        padding-left:20px;
                        display:flex;
                        flex-wrap:wrap; 
                        justify-content:flex-end;
                        font-size:12px;
                        opacity: 0.5;
                        position:relative;
                        top:0;
                        margin-top:0;
                        z-index:10;
                        
                }
                :host([dragtarget]) {
                    border-top:solid 5px #f80; 
                    flex-basis: 100%;   

                }
                a {
                    color: inherit;
                }
                .icon-action,
                .toolbar-label {
                    min-height: auto;
                    padding: 2px 8px;
                    border: none;
                    border-radius: 0.5rem;
                    background: transparent;
                    box-shadow: none;
                    color: #888;
                    cursor: pointer;
                }
                .icon-action near-icon {
                    width: 1rem;
                    height: 1rem;
                }
                .icon-action[plus] {
                    position:absolute;right:-30px; top:-30px;
                    font-size:24px;
                    display:inline-block;
                    border:solid 1px;
                    border-radius:0.75em;            
                    background-color:#fff;
                    box-shadow:1px 1px 2px #000;
                    padding:2px;
                }
                .icon-action[disabled]{
                    color:#0004;
                    cursor:none;
                }
                .toolbar-label{font-size:12px}
                .dropper{min-width:200px; min-height:200px;margin:auto; 
                    flex-basis:100%; background-color:#8888; 
                    display:flex; flex-direction:column;}
                    
                .form {width:100%;background-color:#8884; text-align:left;}
                .form textarea{box-sizing:border-box;width:100%;padding:1em;height:100px; color:#000}
                .form button{border:none; color:#000}
                .form button[disabled]{border:none; color:#ccc}
                .form .icon-action near-icon{ width:1.5rem; height:1.5rem; }
                .form #msg{color:red}
                .form .submit {display:block;text-align:right}
            
        `];
    
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
            let types=this.nearEditor.types || null;
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
            var node=document.createElement(null);
            //node.setAttribute("contenteditable", "");
            node.innerHTML=data;
            node=node.firstChild;
            if(this instanceof SectionsEnd)
                this.parentNode.insertBefore(node,this);
            else
                this.parentNode.parentNode.insertBefore(node,this.parentNode);
            node.childNodes.forEach(field=>{
                if(field.tagName.startsWith("NEAR-"))
                    field.setAttribute('editable',true);
            })
            console.log("dropped node", node);
            if(!(node.firstChild instanceof SectionControlImpl) )
                node.insertAdjacentElement("afterbegin",new SectionControlImpl(this.nearEditor));      	  
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
        r.push(html`<button type="button" class="type-button" @click="${() => this.setContent(t)}">${t}</button>`)
        })
        return r;
    }

}


class SectionsStart extends SectionControl {

    static get styles(){
        return [super.styles,css`:host{border-top:none}`]
    }

    constructor(nearEditor){
    super(nearEditor);
    }

    render(){
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
        return html`
            <button type="button" class="icon-action" plus @click="${this.addSection}" aria-label="add section">
                <near-icon name="add"></near-icon>
            </button>
            <button type="button" class="icon-action" @click="${this.addContent}" aria-label="add content">
                <near-icon name="post_add"></near-icon>
            </button>
        `
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
            
            <button type="button" class="icon-action" title="bold" @mousedown="${(e)=>this.exec('bold',e)}"><near-icon name="format_bold"></near-icon></button>
            <button type="button" class="icon-action" title="italic" @mousedown="${(e)=>this.exec('italic',e)}"><near-icon name="format_italic"></near-icon></button>
            <button type="button" class="icon-action" title="underline" @mousedown="${(e)=>this.exec('underline',e)}"><near-icon name="format_underline"></near-icon></button>
            <button type="button" class="icon-action" title="link" @mousedown="${(e)=>this.exec('createLink',e,window.prompt("url?","https://"))}"><near-icon name="link"></near-icon></button>

            <button type="button" class="toolbar-label" title="header 1" @mousedown="${(e)=>this.exec('formatBlock',e,'h1')}">H1</button>
            <button type="button" class="toolbar-label" title="header 2" @mousedown="${(e)=>this.exec('formatBlock',e,'h2')}">H2</button>
            <button type="button" class="toolbar-label" title="header 3" @mousedown="${(e)=>this.exec('formatBlock',e,'h3')}">H3</button>
            
                
            <button type="button" class="icon-action" title="gallery" @mousedown="${this.insertImage}"><near-icon name="image"></near-icon></button>
            <button type="button" class="icon-action" title="embed" @mousedown="${this.insertVideo}"><near-icon name="video_library"></near-icon></button>
            <button type="button" class="icon-action" title="insert code" @mousedown="${this.insertCode}"><near-icon name="web_asset"></near-icon></button>

            <button type="button" class="icon-action" title="blockquote" @mousedown="${(e)=>this.exec('formatBlock',e,'blockquote')}"><near-icon name="format_quote"></near-icon></button>
            <button type="button" class="icon-action" title="indent" @mousedown="${(e)=>this.exec('indent',e)}"><near-icon name="format_indent_increase"></near-icon></button>
            <button type="button" class="icon-action" title="outdent" @mousedown="${(e)=>this.exec('outdent',e)}"><near-icon name="format_indent_decrease"></near-icon></button>
            <button type="button" class="icon-action" title="align left" @mousedown="${(e)=>this.exec('justifyLeft',e)}"><near-icon name="format_align_left"></near-icon></button>
            <button type="button" class="icon-action" title="align center" @mousedown="${(e)=>this.exec('justifyCenter',e)}"><near-icon name="format_align_center"></near-icon></button>
            <button type="button" class="icon-action" title="align right" @mousedown="${(e)=>this.exec('justifyRight',e)}"><near-icon name="format_align_right"></near-icon></button>
            <button type="button" class="icon-action" title="justify" @mousedown="${(e)=>this.exec('justifyFull',e)}"><near-icon name="format_align_justify"></near-icon></button>
            <button type="button" class="icon-action" title="numbered list" @mousedown="${(e)=>this.exec('insertOrderedList',e)}"><near-icon name="format_list_numbered"></near-icon></button>
            <button type="button" class="icon-action" title="bulleted list" @mousedown="${(e)=>this.exec('insertUnorderedList',e)}"><near-icon name="format_list_bulleted"></near-icon></button>
            ${ "nearCart" in window?
                html`<button type="button" class="icon-action" title="add to cart" @mousedown="${this.createProduct}"><near-icon name="add_shopping_cart"></near-icon></button>`
                : ''
            }
            <button type="button" class="icon-action" title="no hace nada todavia"><near-icon name="short_text"></near-icon></button>
            <button type="button" class="icon-action" title="clear format" @mousedown="${(e)=>this.exec('removeFormat',e)}"><near-icon name="format_clear"></near-icon></button>
            
            <button type="button" class="icon-action" title="code" @mousedown="${this.code}"><near-icon name="code"></near-icon></button>
            
        `
    }


    codeForm(){
        console.log("codeForm")
        return html`
            <div class="form">
            <label>HTML
            <textarea id="code" @input="${this.checkHTMLEvent}">${this.getCode()}</textarea>
            </label>
            <div class="submit"><span id="msg"></span><button type="button" class="icon-action" title="OK" disabled id="okbutton" @mousedown="${this.putCodeFromForm}"><near-icon name="done"></near-icon></button></div>
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
            <button type="button" class="icon-action" title="duplicate section" @click="${this.cloneSection}"><near-icon name="content_copy"></near-icon></button>
            <button type="button" class="icon-action" title="insert section" @click="${this.addSection}" plus><near-icon name="add"></near-icon></button>
            <button type="button" class="icon-action" title="remove section" @click="${this.deleteSection}"><near-icon name="delete"></near-icon></button>
            </div>
            ${false && this.parentElement && this.parentElement.childElementCount<2?
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
                t.push(html`<button type="button" @click="${this.selectOembed}">oEmbed</button>`);
            if(data.og)
                t.push(html`<button type="button" @click="${this.selectOpenGraph}">opengraph</button>`);
            if(data.twitter)
                t.push(html`<button type="button" @click="${this.selectCard}">card</button>`);
            t.push(html`<div class="submit"><span id="msg"></span><button type="button" class="icon-action" title="done" id="donebutton" @click="${this.view}"><near-icon name="done"></near-icon></button></div>`);             
        }
        
        return t;
    }

    codeForm(){
        return html`
            <div class="form">
            <label>HTML
            <textarea id="code" @input="${this.checkHTMLEvent}">${this.getCode()}</textarea>
            </label>
            <div class="submit"><span id="msg"></span><button type="button" class="icon-action" title="OK" disabled id="okbutton" @mousedown="${this.putCodeFromForm}"><near-icon name="done"></near-icon></button></div>
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
            <button type="button" class="icon-action" title="link" @mousedown="${this.link}"><near-icon name="link"></near-icon></button>
            <button type="button" class="icon-action" title="gallery" @click="${this.resources}"><near-icon name="image_search"></near-icon></button>
            <button type="button" class="icon-action" title="embed" @click="${this.embed}"><near-icon name="video_library"></near-icon></button>
            <button type="button" class="icon-action" title="code" @click="${this.code}"><near-icon name="code"></near-icon></button>
            <button type="button" class="icon-action" title="float left" @mousedown="${this.left}"><near-icon name="format_align_left"></near-icon></button>
            <button type="button" class="icon-action" title="center" @mousedown="${this.center}"><near-icon name="format_align_center"></near-icon></button>
            <button type="button" class="icon-action" title="float right" @mousedown="${this.right}"><near-icon name="format_align_right"></near-icon></button>
            <button type="button" class="icon-action" title="up" @mousedown="${this.upward}"><near-icon name="arrow_upward"></near-icon></button>
            <button type="button" class="icon-action" title="down" @mousedown="${this.downward}"><near-icon name="arrow_downward"></near-icon></button>
            <button type="button" class="icon-action" title="delete" @click="${this.deleteSection}"><near-icon name="delete"></near-icon></button>
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
export class NearEditor extends HTMLDivElement {


    constructor() {
        super();
        this.editing=false;
        this.editor=null;
        this.currentBlock=null;
        this.alleditable=false;
        this.types={
            "Section": `<div class="e" placeholder="..."></div>`,
     //       "Content": `<near-content></near-content>`
        };
        this.addEventListener("end-edit",this.handleEndEdit.bind(this));
        this.attachShadow({mode:"open"});
    }


    handleEndEdit(e){
        if(this.editing) {
            e.stopPropagation();
            e.preventDefault();
            console.log ("end edit stopped");
        }
        console.log ("end edit allowed");
    }

    connectedCallback(){
        //super.connectedCallback();
        //this.shadowRoot.innerHTML=this.render().getHTML();
        
        this.requestUpdate();
        if (window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }

    static get properties() {
        return {
        alleditable: {type: Boolean, reflect: true}                   
        };
    }

    static get observedAttributes() { 
        return ['alleditable']; 
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name==='alleditable') {
            this.alleditable=newValue!==null;
            console.log("alleditable",this.alleditable);
        }
    }

    setTypes(types) {
        this.types=types;
    }

    render(){
        
      return html`
      <style>
      :host{display:block}
        #editControl, #editDone, #editCancel { text-decoration:none; }
        #editControl {color:#930;cursor:pointer}
        #editDone {color:green;cursor:pointer}
        #editCancel {color:red;cursor:pointer}
        .editBar {text-align:right; opacity:0.5; font-size:15px; clear:both}
        .editBar button {
            min-height:auto;
            padding:0.5rem;
            border:none;
            background:transparent;
            box-shadow:none;
        }
        .editBar near-icon {width:2rem; height:2rem;}
        .focus{border:solid 1px #ccc} 
        #status{font-size:small; color:#8888}      
      </style>
      <slot></slot>
      ${NearUser.canEdit()?
      html` 
       <div class="editBar">
       
        
        ${this.editing? 
        html`
        <button type="button" id="editCancel" title="cancel" @click="${this.cancelEdit}"><near-icon name="cancel"></near-icon></button>
        <button type="button" id="editDone"  title="OK" @click="${this.endEdit}" ><near-icon name="done"></near-icon></button>`
        :
        html`<button type="button" id="editControl" title="edit" @click="${this.startEdit}"><near-icon name="edit"></near-icon></button>`}        
       </div>
       <div id="status"></div>
       ` :''}
      `;

    }

    requestUpdate(){
        render(this.render(),this.shadowRoot, {eventContext:this, host:this, scopeName: "near-editor" });
    }

    startEdit(){
        console.log(this.constructor.name)
        this.editing=true;
        this.editFields();
        this.requestUpdate();
        let event = new CustomEvent('start-edit', { 
            detail: {  },
            bubbles: true, 
            composed: true });
        this.dispatchEvent(event);
        let panel=document.getElementById('panel');
        if(panel) panel.innerHTML=`<near-section-library style="position:fixed;"></near-section-library>`;
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
        let panel=document.getElementById('panel');
        if(panel) panel.innerHTML="";       
    }

    cancelEdit(){
        this.endEdit(false);
    }

    slotUpdated(){
        let status=this.shadowRoot.getElementById("status")
        if(status){
            status.innerHTML="editable";
            this.requestUpdate();
        }
    }

    editToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        if(this.editing) this.endEdit();
        else this.startEdit()
    }

    editFields() {


        console.log("editFields invoked");
        let slot=this.shadowRoot.querySelector('slot');
        let elements=slot.assignedNodes({flatten:true});

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
            field.setAttribute('contenteditable',true);
            field.addEventListener("keyup",NearEditor.handleKeyup);
            field.addEventListener("keydown",NearEditor.handleKeydown);
            field.addEventListener("drop",NearEditor.handleDrop);
            field.addEventListener("mousedown",NearEditor.handleMousedown);
            //field.addEventListener("mouseover",NearEditor.handleMouseover);
        })
        
        this.insertBefore(new SectionsStart(this) ,this.hasChildNodes()? this.childNodes[0] : null);
       

        fields = elements.filter(el =>  el.tagName=="SECTION" );
        fields.forEach((field)=>{
            let all=field.querySelectorAll('*');
            all.forEach(element=>{
                if(element.tagName.startsWith("NEAR-"))
                    element.setAttribute('editable',true);
            })
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
            field.setAttribute('contenteditable',true);
            field.addEventListener("keyup",this.handleKeyup);
        })

        document.querySelectorAll("near-figure")
                .forEach((nearFigure) => nearFigure.requestUpdate());
        
    
    }
    
    endEditFields() {
        
        let fields=this.querySelectorAll(this.alleditable? '.e,section' : '.e'); 
        fields.forEach((field)=>{
            field.removeAttribute('contenteditable');
            field.removeEventListener("keyup",NearEditor.handleKeyup);
            field.removeEventListener("keydown",NearEditor.handleKeydown);
            field.removeEventListener("drop",NearEditor.handleDrop);
            field.removeEventListener("mousedown",NearEditor.handleMousedown);
        })

        let slot=this.shadowRoot.querySelector('slot');
        let elements=slot.assignedNodes({flatten:true});
        this.removeChild(this.querySelector('sections-start'));
        elements=this.querySelectorAll('section-control');
        elements.forEach((el)=>{
            el.parentElement.removeChild(el);
        }) 
        this.removeChild(this.querySelector('sections-end'));
        elements=this.querySelectorAll('figure-control');
        elements.forEach((el)=>{
            el.parentElement.removeChild(el);
        }) 
        elements=this.querySelectorAll('*');
        elements.forEach(element=>{  
                if(element.tagName.startsWith("NEAR-"))
                    element.removeAttribute('editable');
        }) 

    }
  
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


customElements.define('near-editor', NearEditor,  { extends: "div" });

export class NearComponent {
 
    
    initEventListeners(){
        this.addEventListener('drag',this.handleDrag);
        this.addEventListener('dragstart',this.handleDragStart);
        this.addEventListener('dragend',this.handleDragEnd);
    }

    handleDragStart(ev){
        ev.dataTransfer.setData("Section",outerHTML);
        this.dragging=true;
        NearComponent.dropped=false;
    }

    handleDrag(ev){
        ev.preventDefault();
        ev.stopPropagation();
        ev.dataTransfer.setData("Section",this.outerHTML);
        this.dragging=true;
        NearComponent.dropped=false;
    }
    
    handleDragEnd(ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.dragging=false;
        NearComponent.dropped=false;    
    }

};

export class NearSectionLibrary extends LitElement{

    static get styles(){
        return css`
        :host{ display:grid; justify-content:space-evenly}
        item{  display:inline-block}
        `; 
    }
    constructor() {
        super();
    }

    render() {
        let r=[];
        nearSectionLibrary.components.forEach((component,i)=>{
            //console.log("RENDER COMPONENT",component.getIcon())
            r.push(html`<item id="${i}">${unsafeHTML(component.getIcon())}</item>`);
            //r.push(html`HOLA`);
        })
        return html`${r}`;
    }


    initEventListeners(element){
        //element.addEventListener('drag',this.handleDrag.bind(element));
        element.addEventListener('dragstart',this.handleDragStart.bind(element));
        element.addEventListener('dragend',this.handleDragEnd.bind(element));
        element.draggable=true;
    }

    handleDragStart(ev){
        ev.dataTransfer.setData("Section",`<section>${nearSectionLibrary.components[this.id].outerHTML}</section>`);
        this.dragging=true;
        NearComponent.dropped=false;
    }

    handleDrag(ev){
        ev.preventDefault();
        ev.stopPropagation();
        ev.dataTransfer.setData("Section",this.outerHTML);
        this.dragging=true;
        NearComponent.dropped=false;
    }
    
    handleDragEnd(ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.dragging=false;
        NearComponent.dropped=false;    
    }

    firstUpdated(){
        let elements=this.shadowRoot.querySelectorAll('item');
        console.log("elements", elements)
        elements.forEach(element=>{
            this.initEventListeners(element);
        })
    }

    static add(component){
        NearSectionLibrary.components.push(component);
        console.log(NearSectionLibrary.components);
        document.querySelectorAll('near.section-library').forEach((element)=>element.requestUpdate())
    }
}

NearSectionLibrary.components=[];

window.nearSectionLibrary=NearSectionLibrary;
customElements.define('near-section-library', NearSectionLibrary);
