import { LitElement, html, css } from 'lit-element';
import { Template } from 'lit-html';
import { NearUser } from './user';
import {Icon} from "@material/mwc-icon"
import {Button} from "@material/mwc-button"


var status= Object.freeze ({
        GALLERY : 0,
        EDIT: 1
      })


export class NearResources extends LitElement {
        static get styles() {
                return css`
                    :host {
                            position:fixed;
                            bottom:0;left:0;right:0;
                            min-height: 120px;
                            border-top: solid 1px #ccc;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            color:#999;
                            z-index:100000;
                    }
                    :host([modal]){
                        top:0;
                        npadding:10vh;
                        background-color:#8888;
                    }     
                    :host > div { 
                        position:relative;    
                        display:block; 
                        border: solid 1px red;
                        min-height:100px;
                        min-width:80%; 
                        background-color:#fff; 
                        overflow-y:scroll;
                        }
                    .flex {
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    }    
                    :host([modal]) > div { height:80vh;min-height:80vh}
                    :host .spinner{ margin:auto;min-height:100px;}
                    img, video {max-height:20vh;margin:2px; cursor:pointer}
                    #preview{border:dotted 1px red;max-width:70%; max-height:70vh; cursor:move}
                    #editpanel{display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;min-height:80%}
                    #info{display:flex;flex-direction:column; font-size:11px}
                    #info > input{font-size:11px;padding:6px;border-radius:6px;border: solid 1px #8888}
                    .overlay{position:fixed; 
                        top:0;bottom:0;
                        left:0;right:0;
                        background-color:#8888;
                        nz-index:1;
                        }
                    label{display:block;text-align:center}
                    fieldset{border-radius:6px;border:solid 1px #8884}
                    fieldset > label {text-align:left} 
                    mwc-icon.close{position:absolute; right:0;top:0; cursor:pointer;}

                    @media(min-width:600px){
                            #editpanel{flex-direction:row}
                    }   
                    
                `;
        }
        /**
         * Define properties. Properties defined here will be automatically 
         * observed.
         */
        static get properties() {
                return {
                name: { type: String },
                state: {type: Number},
                modal:{ type: Boolean},
                maxwidth: {type: Number},
                aspectRatio: {type: Number}                
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
                this.message = 'Hello World from TopElement';
                this.files = new Map();
                this.resources = new Map();
                this.htmls = [];//["/images/jm.jpeg","/images/deseo_de_logro.png"];
                let data=null;
                this.state=status.GALLERY;
                this.zoom=1;
                this.selectedMaxwidth=600;
                let u=NearUser.instance;
                if(pathname) this.pathname=pathname;
                else this.pathname=window.location.pathname;
                let shouldRefresh=NearResources.filesAdded || !NearResources.cache || NearResources.cache.path!==this.pathname; 
                if(NearResources.cache && NearResources.cache.path===this.pathname) {
                        data=NearResources.cache.data;
                        this.addResources(data);
                }
                if (u && shouldRefresh) {
                        console.log ("resources1")
                        u.getResources(this.pathname+'.resources/')
                        .then(data=>{
                                console.log (data)
                                this.addResources(data);                                
                                NearResources.cache={"path":this.pathname,"data":data};
                        })
                }
                
        }

        addResources(data){
                data.Contents.forEach((item)=>{
                        const name=item.path.split('/').slice(-1)[0];
                        const resource=new Resource(null,this);
                        const url = NearUser.instance.baseURL+item.path;
                        if(item.contentType.startsWith('video'))
                              resource.setHtml(html`<video src="${url}" ></video>`);
                        else if(item.contentType.startsWith('image')) 
                              resource.setHtml(html`<img  src="${url}">`);
                        else  resource.setHtml(html`<iframe  src="${url}"></iframe>`);                                        
                        this.resources.set(name,resource);                  
                })
                this.requestUpdate();
        }


        renderSelectAspectRatio(){
                if(this.aspectRatio) return '';
                return html`
                <fieldset> 
                <legend>Aspect ratio</legend>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(0)}" name="aspect">original</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(2)}" name="aspect">2:1</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(1.7777)}" name="aspect">16:9</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(1.3333)}" name="aspect">4:3</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(1)}" name="aspect" >1:1</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(0.75)}" name="aspect">3:4</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(0.5625)}" name="aspect">9:16</label>
                <label><input type="radio" @input="${()=>this.setSelectedAspectRatio(0.5)}" name="aspect">1:2</label>              
                </fieldset>`
        }

        renderSelectMaxWidth(){
                if(this.maxwidth) return '';
                return html`
                <fieldset> 
                <legend>max. width</legend>
                <label><input type="radio" @input="${()=>this.setSelectedMaxWidth(300)}" name="maxwidth">300px</label>
                <label><input type="radio" @input="${()=>this.setSelectedMaxWidth(468)}" name="maxwidth">468px</label>
                <label><input type="radio" @input="${()=>this.setSelectedMaxWidth(640)}" name="maxwidth">640px</label>
                <label><input type="radio" @input="${()=>this.setSelectedMaxWidth(728)}" name="maxwidth">728px</label>
                <label><input type="radio" @input="${()=>this.setSelectedMaxWidth(970)}" name="maxwidth">970px</label>
                <label><input type="radio" @input="${()=>this.setSelectedMaxWidth(1200)}" name="maxwidth">1200px</label>
             
                </fieldset>`
        }

        renderEdit(){
                return html`
               
                <div @drop="${this.onDrop}"
                        @dragover="${this.onDragover}"
                        @dragenter="${this.onDragover}"
                        }" >
                <label nfor="in" class="custom-file-upload">
                Resources
                
                <input  id="in"
                        type="file" multiple
                        @change="${this.changed}"
                        value="pick">
                </label> 
                <div id="editpanel">       
                        <canvas id="preview" width="800" height="600"
                                @mousedown="${this.canvasMouseDown}" 
                                @mouseup="${this.canvasMouseUp}" 
                                @mousemove="${this.canvasMouseMove}"
                                @mouseout="${()=>this.moving=false}"
                                @touchstart="${this.canvasTouchStart}"
                                @touchmove="${this.canvasTouchMove}" 
                                @touchend="${this.canvasTouchEnd}"
                                @wheel="${this.canvasWheel}"
                                ></canvas>
                        <div id="info">
                                <fieldset>
                                <legend>zoom</legend>
                                <input id="zoom" type="range" min="100" max="1000" value="${this.zoom*100}" @input="${this.setZoom}"/>
                                </fieldset>
                                <fieldset><legend>original</legend><span id="original"></span></fieldset>
                                <fieldset><legend>output</legend><span id="output"></span>
                                <br><input type="text" id="name">
                                </fieldset>
                                <div class="flex">
                                ${this.renderSelectAspectRatio()}
                                ${this.renderSelectMaxWidth()}
                                </div>
                                <mwc-button outlined @click="${this.upload}">ok</mwc-button>
                                
                        </div>
                </div>
                
                <mwc-icon class="close" @click="${()=>this.state=status.GALLERY}" title="back">keyboard_return</mwc-icon>
                </div>`;

        }  

        render() {
                //console.log(this.resources)
                if(this.state==status.EDIT)
                        return this.renderEdit();
                return html`
                
                <div @drop="${this.onDrop}"
                        @dragover="${this.onDragover}"
                        @dragenter="${this.onDragover}"
                        @click="${this.onClick}"  >
                
                <div>
                <mwc-button icon="add" @click="${(e)=>{this.state=status.EDIT;e.stopPropagation()}}">upload</mwc-button>        
                </div>
                ${this.imageList()}
                <mwc-icon class="close" @click="${this.close}" title="close">close</mwc-icon>
                </div>`;
             
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


        onDragover(e){
                console.log(e.dataTransfer);
                //e.dataTransfer.dropEffect = '';
                e.preventDefault();
                return true;
         
        }


        updatePreview(){
                if(this.source){
                        let canvas=this.shadowRoot.querySelector('canvas');
                        let context=canvas.getContext("2d");
                        
                        let scale=this.zoom*canvas.width/this.source.width;
                        context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
                        context.fill();
                        context.setTransform(scale,0,0,scale,this.offsetX*scale,this.offsetY*scale);
                        //context.setTransform(scale,0,0,scale,0,0);
                        context.translate(canvas.width/(2*scale),canvas.height/(2*scale));
                        //context.drawImage(this.source, sx, sy, sWidth, sHeight, 0, 0, canvas.width, dHeight);
                        
                        context.drawImage(this.source, -this.source.width/2, -this.source.height/2);
                        //context.arc(0,0,10,0,4);
                        //context.strokeStyle = "red";
                        //context.stroke();
                        if(!this.moving) canvas.toBlob((blob)=>{
                                this.blob=blob;
                                this.shadowRoot.getElementById("output").innerText=`${blob.size} bytes , ${blob.type}`;
                                this.shadowRoot.getElementById("zoom").value=this.zoom*100;
                        }, "image/webp", .7);
                }
                
        }

        moveCanvas(dx,dy){
                this.offsetX+=dx;
                this.offsetY+=dy;
                this.updatePreview();
        }

        canvasMouseDown(e){
                this.moving=true;
                this.pageX=e.screenX;
                this.pageY=e.screenY;
                //console.log("mouseDown",e)
        }
       
        canvasMouseUp(e){
                this.moving=false;
                this.updatePreview();
                //console.log("mouseUp",e)
        }

        canvasMouseMove(e){
                if(this.moving) {
                        this.moveCanvas(e.screenX-this.pageX, e.screenY-this.pageY)
                        this.pageX=e.screenX;
                        this.pageY=e.screenY;
                }
                //console.log("mouseMove",e)
        }

        canvasTouchStart(e){
                let t=e.touches;
                this.pageX=t[0].pageX;
                this.pageY=t[0].pageY;
                this.moving=true;
                //console.log(e);
        }
        canvasTouchMove(e){
                if(e.touches.length==2){
                        let t=e.touches;
                        let dx=t[1].pageX-t[0].pageX;
                        let dy=t[1].pageY-t[0].pageY;
                        let d=Math.abs(dx)+Math.abs(dy);
                        if(this.touchDistance){
                                let c=d/this.touchDistance;
                                this.zoom*=c;
                                if(this.zoom < 1 ) this.zoom=1;
                                if(this.zoom > 10 ) this.zoom=10;
                                this.updatePreview();
                        }
                        this.touchDistance=d;
                }
                else if(e.touches.length==1) {
                        let t=e.touches;
                        let dx=t[0].pageX-this.pageX;
                        let dy=t[0].pageY-this.pageY;
                        this.pageX=t[0].pageX;
                        this.pageY=t[0].pageY;
                        this.moveCanvas(dx,dy);
                }
                e.stopPropagation();
                e.preventDefault();
        }
        canvasTouchEnd(e){
                this.touchDistance=0;
                this.moving=false;
                this.updatePreview();
                //console.log(e);
        }

        canvasWheel(e){
                console.log(e);
                if(e.deltaY > 0) {
                        this.zoom +=.5;
                        if(this.zoom > 10 ) this.zoom=10;
                }
                else {
                        this.zoom -=.5;
                        if(this.zoom < 1 ) this.zoom=1;
                }
                this.updatePreview();
                e.stopPropagation();
                e.preventDefault();
        }

        setZoom(e){
                console.log(e);
                this.zoom=this.shadowRoot.getElementById("zoom").value/100;
                this.updatePreview();
                
        }


        setSelectedAspectRatio(ratio){
                this.selectedAspectRatio=ratio;
                this.setSource();
        }

        setSelectedMaxWidth(maxwidth){
                this.selectedMaxwidth=maxwidth;
                this.setSource();
        }

        setSource(src=null){
                if(!src) src=this.src;
                else this.src=src;        
                if(!src) return;     
                let canvas=this.shadowRoot.querySelector('canvas');
                let img=new Image();
                img.src=src;
                img.crossOrigin="anonymous";
                img.onload= ()=> {
                        let maxwidth= this.maxwidth || this.selectedMaxwidth || 0;
                        let aspectRatio = this.aspectRatio || this.selectedAspectRatio || img.width/img.height;
                        if(img.width <= maxwidth){
                              canvas.width=img.width;
                              canvas.height=img.width/aspectRatio;
                        }
                        else {
                              canvas.width=maxwidth;
                              canvas.height=maxwidth/aspectRatio;
                              //canvas.height=img.height * this.maxwidth/img.width;
                        }
                        this.zoom=1;
                        this.offsetX=0;
                        this.offsetY=(canvas.height-img.height*canvas.width/img.width)/2;
                        this.source=img;
                        this.destName=this.originalName.replace(/\..*$/,"").replace(" ","_")+`-${canvas.width}x${canvas.height}.webp`;
                        this.shadowRoot.getElementById("name").value=this.destName;
                        this.updatePreview();

                };
                
        }


        upload(e){
                if(this.blob) {
                        this.blob.name=this.destName;
                        this.addFile(this.blob)
                }
        }

        addFile(file){
                this.state=status.GALLERY;
                this.requestUpdate().then(()=>{
                        let u=NearUser.instance;
                        if(u) new Resource(file,this).put(u);
                        else  this.files.set(file.name, file);
                })
                
        }

        addFiles(files){
                
                if(this.state==status.EDIT){
                        
                        let reader  = new FileReader();
                        reader.onloadend = (function () {
                                this.setSource(reader.result);
                        }).bind(this);
                        let file;
                        if (file=files.item(0)) {
                                reader.readAsDataURL(file);
                                this.originalName=file.name;
                                this.shadowRoot.getElementById("original").innerText=`${file.size || ''} bytes ${file.name}`
                        }
                        
                        //this.requestUpdate();
                        return;
                }

                let u=NearUser.instance;
                for (var i=0; i< files.length; i++){  
                        
                        if(u) new Resource(files.item(i),this).put(u);
                        else  this.files.set(files.item(i).name, files.item(i) );
                          
                        
                }
                NearResources.filesAdded=true;        

        }

        onDrop(e){
                console.log(e.dataTransfer.types);
                console.log(e.dataTransfer.getData('text/uri-list'));
                var htmlData= e.dataTransfer.getData('text/uri-list');
                e.preventDefault();
                if(htmlData) {
                        this.state=status.EDIT;
                        this.requestUpdate().then(()=>this.setSource(htmlData));
                        return; 
                }
                {
                        this.state=status.EDIT;
                        const news=e.dataTransfer.files;
                        
                        this.requestUpdate().then(()=>this.addFiles(news));   
                }
                //this.state++;        
                
         
        }

        changed(e) {
                //this.state++;
                var input = this.shadowRoot.getElementById('in');
                console.log("input files", input.files);
                if (input) { 
                        this.addFiles(input.files);      
                        this.requestUpdate();   
                }
                
        }

        imageList() {
                console.log("render")                
                const templates=[];
                for (const resource of this.resources.values()){
                        templates.push(resource.render());                          
                }
                for (const file of this.files.values()){
                        if(file.type.startsWith('video'))
                                templates.push(html`<video src="${URL.createObjectURL(file)}" ></video>`);
                        else 
                                templates.push(html`<img  src="${URL.createObjectURL(file)}">`);       
                }
                for (const htmlData of this.htmls) {
                        templates.push(html`<img src="${htmlData}">`);  
                }

                return html`${templates}`
        }

        close(){
               this.parentElement.removeChild(this); 
        }
}

function basePath(path){
        if(!path || path==('/')) return '/';
        let p='/'+path.split('/').slice(1,-1).join('/')+'/';
        return (p=='//'? '/' : p)
}



class Resource {
        constructor(file,nearResources) {
                this.file=file;
                this.nearResources=nearResources;
                if(file)
                        this.html=html`<div class="spinner">uploading...</div>`;
                
        }
        setHtml(h) {
                this.html=h;
        }

        resourcePath(name){
                return `${this.nearResources.pathname}.resources/${name}`;  
        }

        put(u){ this.nearResources.resources.set(this.file.name,this);
                this.nearResources.requestUpdate();
                u.put(this.resourcePath(this.file.name),this.file,this.file.type)
                .then((response) => { 
                        if(response.ok && response.ok==true)
                                console.log(this,response);
                        let url=null;        
                        url=u.baseURL+this.resourcePath(this.file.name);
                        if(this.file.type.startsWith('video'))
                                this.html= html`<video src="${url}" ></video>`;
                        else 
                                this.html= html`<img  src="${url}">`;          
                        
                        this.nearResources.requestUpdate();

                });
                
        }
        
        render() {
                return this.html;   
        }
}


customElements.define('near-resources', NearResources);
