import { i, b as i$1, c as b } from './drawerbutton-DvrlMpxV.js';
import { N as NearUser, o, D } from './app-main.js';
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-formfield';

var status= Object.freeze ({
        GALLERY : 0,
        EDIT: 1
      });


class NearResources extends i {
        static get styles() {
                return i$1`
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
                        console.log ("resources1");
                        u.getResources(this.pathname+'.resources/')
                        .then(data=>{
                                console.log (data);
                                this.addResources(data);                                
                                NearResources.cache={"path":this.pathname,"data":data};
                        });
                }
                
        }

        addResources(data){
                data.Contents.forEach((item)=>{
                        const name=item.path.split('/').slice(-1)[0];
                        const resource=new Resource(null,this);
                        const url = NearUser.instance.baseURL+item.path;
                        if(item.contentType.startsWith('video'))
                              resource.setHtml(b`<video src="${url}" ></video>`);
                        else if(item.contentType.startsWith('image')) 
                              resource.setHtml(b`<img  src="${url}">`);
                        else  resource.setHtml(b`<iframe  src="${url}"></iframe>`);                                        
                        this.resources.set(name,resource);                  
                });
                this.requestUpdate();
        }


        renderSelectAspectRatio(){
                if(this.aspectRatio) return '';
                return b`
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
                return b`
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
                return b`
               
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
                return b`
                
                <div @drop="${this.onDrop}"
                        @dragover="${this.onDragover}"
                        @dragenter="${this.onDragover}"
                        @click="${this.onClick}"  >
                
                <div>
                <mwc-button icon="add" @click="${(e)=>{this.state=status.EDIT;e.stopPropagation();}}">upload</mwc-button>        
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
                        this.moveCanvas(e.screenX-this.pageX, e.screenY-this.pageY);
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
                        this.addFile(this.blob);
                }
        }

        addFile(file){
                this.state=status.GALLERY;
                this.requestUpdate().then(()=>{
                        let u=NearUser.instance;
                        if(u) new Resource(file,this).put(u);
                        else  this.files.set(file.name, file);
                });
                
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
                                this.shadowRoot.getElementById("original").innerText=`${file.size || ''} bytes ${file.name}`;
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
                console.log("render");                
                const templates=[];
                for (const resource of this.resources.values()){
                        templates.push(resource.render());                          
                }
                for (const file of this.files.values()){
                        if(file.type.startsWith('video'))
                                templates.push(b`<video src="${URL.createObjectURL(file)}" ></video>`);
                        else 
                                templates.push(b`<img  src="${URL.createObjectURL(file)}">`);       
                }
                for (const htmlData of this.htmls) {
                        templates.push(b`<img src="${htmlData}">`);  
                }

                return b`${templates}`
        }

        close(){
               this.parentElement.removeChild(this); 
        }
}



class Resource {
        constructor(file,nearResources) {
                this.file=file;
                this.nearResources=nearResources;
                if(file)
                        this.html=b`<div class="spinner">uploading...</div>`;
                
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
                                this.html= b`<video src="${url}" ></video>`;
                        else 
                                this.html= b`<img  src="${url}">`;          
                        
                        this.nearResources.requestUpdate();

                });
                
        }
        
        render() {
                return this.html;   
        }
}


customElements.define('near-resources', NearResources);

const map = [
        {'b':'A', 'l':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
        {'b':'AA','l':/[\uA732]/g},
        {'b':'AE','l':/[\u00C6\u01FC\u01E2]/g},
        {'b':'AO','l':/[\uA734]/g},
        {'b':'AU','l':/[\uA736]/g},
        {'b':'AV','l':/[\uA738\uA73A]/g},
        {'b':'AY','l':/[\uA73C]/g},
        {'b':'B', 'l':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
        {'b':'C', 'l':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
        {'b':'D', 'l':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
        {'b':'DZ','l':/[\u01F1\u01C4]/g},
        {'b':'Dz','l':/[\u01F2\u01C5]/g},
        {'b':'E', 'l':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
        {'b':'F', 'l':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
        {'b':'G', 'l':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
        {'b':'H', 'l':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
        {'b':'I', 'l':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
        {'b':'J', 'l':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
        {'b':'K', 'l':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
        {'b':'L', 'l':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
        {'b':'LJ','l':/[\u01C7]/g},
        {'b':'Lj','l':/[\u01C8]/g},
        {'b':'M', 'l':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
        {'b':'N', 'l':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
        {'b':'NJ','l':/[\u01CA]/g},
        {'b':'Nj','l':/[\u01CB]/g},
        {'b':'O', 'l':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
        {'b':'OI','l':/[\u01A2]/g},
        {'b':'OO','l':/[\uA74E]/g},
        {'b':'OU','l':/[\u0222]/g},
        {'b':'P', 'l':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
        {'b':'Q', 'l':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
        {'b':'R', 'l':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
        {'b':'S', 'l':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
        {'b':'T', 'l':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
        {'b':'TZ','l':/[\uA728]/g},
        {'b':'U', 'l':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
        {'b':'V', 'l':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
        {'b':'VY','l':/[\uA760]/g},
        {'b':'W', 'l':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
        {'b':'X', 'l':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
        {'b':'Y', 'l':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
        {'b':'Z', 'l':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
        {'b':'a', 'l':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
        {'b':'aa','l':/[\uA733]/g},
        {'b':'ae','l':/[\u00E6\u01FD\u01E3]/g},
        {'b':'ao','l':/[\uA735]/g},
        {'b':'au','l':/[\uA737]/g},
        {'b':'av','l':/[\uA739\uA73B]/g},
        {'b':'ay','l':/[\uA73D]/g},
        {'b':'b', 'l':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
        {'b':'c', 'l':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
        {'b':'d', 'l':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
        {'b':'dz','l':/[\u01F3\u01C6]/g},
        {'b':'e', 'l':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
        {'b':'f', 'l':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
        {'b':'g', 'l':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
        {'b':'h', 'l':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
        {'b':'hv','l':/[\u0195]/g},
        {'b':'i', 'l':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
        {'b':'j', 'l':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
        {'b':'k', 'l':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
        {'b':'l', 'l':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
        {'b':'lj','l':/[\u01C9]/g},
        {'b':'m', 'l':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
        {'b':'n', 'l':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
        {'b':'nj','l':/[\u01CC]/g},
        {'b':'o', 'l':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
        {'b':'oi','l':/[\u01A3]/g},
        {'b':'ou','l':/[\u0223]/g},
        {'b':'oo','l':/[\uA74F]/g},
        {'b':'p','l':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
        {'b':'q','l':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
        {'b':'r','l':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
        {'b':'s','l':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
        {'b':'t','l':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
        {'b':'tz','l':/[\uA729]/g},
        {'b':'u','l':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
        {'b':'v','l':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
        {'b':'vy','l':/[\uA761]/g},
        {'b':'w','l':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
        {'b':'x','l':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
        {'b':'y','l':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
        {'b':'z','l':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g},
    	{'b':'-','l':/\s+/g},
    	{'b':'','l':/[^a-zA-Z0-9._\/\-\(\)]/g},
    	{'b':'-','l':/\-+/g}
];

function urlize(str) {
	for(var i=0; i<map.length; i++) {
	        str = str.replace(map[i].l, map[i].b);
	}
	str = str.trim().replace(/[^-a-zA-Z0-9\s]/g, '');
	return str.toLowerCase();
}

function styles()
{ return i$1`
:host > near-modal{ position:fixed;
        height:100vh; 
        top:0; left:0; bottom:0; right:0; 
        background-color: rgba(0,0,0,.5); 
        display:flex; 
        justify-content:center;align-items:center;padding:2em;
        z-index:10000 }
:host([hidden]) { display: none; }
near-modal a{font-size:-3;color:#999;cursor:pointer}
.inverse {
  
  --mdc-theme-primary: white;
  
}
.container{
  max-width:800px;
  margin: 0 auto;
}

:host > near-modal > div {
  background-color:white;
  position:relative;
  color:black;
  border:solid 1px #ccc;
  box-shadow: 2px 2px 2px #000;
  display:flex; 
  flex-direction:column;
  align-items: flex-end;
  justify-content:normal;
  text-align:left;
  padding:2em;
  min-width:300px;
  max-height:90vh;
  overflow-y:auto;
  overflow-x:hidden;
}
near-modal h3 {
        width:100%;
        
}
near-modal img{
  max-width:100%;
  max-height:50vh;
  object-fit:contain }
  
label{
        display:flex;
        flex-direction:column;
        width:100%;
        margin-bottom:1em;
}
input, textarea {
  border: none;
  border-bottom: solid 1px rgba(128,128,128,0.2);
  padding:1em 0.5em ; 
  margin-top:.2em;
  color:#888;
  width:100%;
  background-color:rgba(128,128,128, 0);
}

textarea {
        nmin-height:5em;
        border-top:solid solid rgba(128,128,128,0.2);
}
near-modal mwc-formfield {
  flex-direction:column;
}
#name_button {
  padding:0; 
  height:56px; width:56px;     
  font-size:20px;
  border:none;
  background-color:#ffffff80;
  clip-path: circle(50% at center);}
#name_button img {
    max-width:56px;     
    clip-path: circle(45% at center);
  }
  mwc-icon{font-variant:none}
  mwc-icon.properties-icon { float:right;cursor:pointer}


}

#edit-control{position:absolute; font-size:14px; right:1px ; bottom:3px; cursor:pointer}  
 
`;
}

class NearTags extends i {
        static get styles() {
                return i$1`
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
                                console.log (data);
                                this.addTags(data);                                
                                NearTags.cache={"path":this.pathname,"data":data};
                        });
                }
                console.log("NearTags constr.  pathname:",this.pathname);
                
        }

        addTags(data){
                console.log("addTags:",data);
                data.Items.forEach((item)=>{
                        console.log("tag:", item);
                        new Tag(item.key, item);                                        
                        this.tags.set(item.key,item);                  
                });
                this.requestUpdate();
        }

        tagsHTML(){
                let r=[];
                
                this.tags.forEach((item)=>{
                        if(item.key.indexOf(':')==-1) 
                                r.push(b`<near-tag tag="${item.key}" @tag-removed="${this.deleteTag}"></near-tag>`);
                });
                return r;
        }

        render() {
                return b`
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
                console.log(e);
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
                });
        }
        
        changed(){
                const obj=this.buildObj(this.shadowRoot.getElementById("in").value);
                console.log("changed");
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
                });
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




class Tag extends i {


        static get styles() {
                return i$1`
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
                });

        }

        
        render() {
                return b`${this.tag}<mwc-icon title="remove" @click="${this.clear}">remove_circle</mwc-icon>`
        }
}


customElements.define('near-tags', NearTags);
customElements.define('near-tag', Tag);

//adapted from https://css-tricks.com/simple-swipe-with-vanilla-javascript/

class NearSwiper extends i {

        constructor() {
                super();
                this.current=0;
                this.addEventListener('mousedown', this.lock, false);
                this.addEventListener('touchstart', this.lock, false);
                this.addEventListener('mouseup', this.move, false);
                this.addEventListener('touchend', this.move, false);
                this.addEventListener('touchmove', e => {e.preventDefault();}, false);
                this.addEventListener('mousemove', this.drag, false);
                this.addEventListener('touchmove', this.drag, false);
                this.x0=null;
                this.time=0;
                this.timer=null;
                this.direction=1;

        }

        attributeChangedCallback(name, oldval, newval) {
                super.attributeChangedCallback(name, oldval, newval);
                if(name=="time"){
                        if(this.timer) {
                                window.clearInterval(this.timer);
                                this.timer=null;
                        }
                        if(newval!=0) {
                                console.log("setTimer",newval);
                                this.timer=window.setInterval(this.onTime.bind(this),newval);
                        }        
                }        }

        static get properties(){
                return {
                        time:{type: Number, reflect:true}
                }
        }

        static get styles() {
                return i$1`
                :host { position:relative;
                        display:block;
                        width:100%;
                        max-width:100%;
                        height: 100%;
                        overflow-x: hidden;
                }
                slot{   --i:0;
                        --tx:0;
                        display: flex;
                        position:relative;
                        align-items: center;
                        width: fit-content;
                        min-width: -moz-fit-content;
                        overflow-y: hidden;
                        max-height: 100vh;
                        height:100%;
                        overflow-x: visible;
                        left:calc(var(--i) * -100vw + var(--tx, 0px) );
                        ntransform: translateX(calc(var(--i) * -100vw + var(--tx, 0px) ));
                        transition: left .5s ease-out;
                                        }
                ::slotted(*) {
                        nmin-width: 100vw;
                        width: 100vw;
                        height:100%;
                        nmin-height:50vh;
                }
                #prev,#next{
                        position:absolute;
                        z-index:1000;
                        top: calc(50% - 50px);
                        font-size:100px;
                        color:#8888;
                        cursor:pointer;
                }
                #prev{left:0}
                #next{right:0}
                `
        }

        render(){
                return b`
                <slot></slot>
                <mwc-icon @click="${this.prev}" id="prev">arrow_left</mwc-icon>
                <mwc-icon @click="${this.next}" id="next">arrow_right</mwc-icon>`
        }

        getSlot(){
                if(!this.slotElement)
                        this.slotElement=this.shadowRoot.querySelector("slot");
                //console.log(this.slotElement)        
                return this.slotElement;
        }

        prev(e){
                let slot=this.getSlot();
                slot.style.setProperty('--tx','0px');
                if(this.current)
                        slot.style.setProperty('--i',--this.current);
                else return false;        
                
                return true;              
        }
        next(e){
                let slot=this.getSlot();
                slot.style.setProperty('--tx','0px');        
                if(this.current < slot.assignedElements().length-1)
                        slot.style.setProperty('--i',++this.current);
                else return false;        
                
                return true;        

        }

        onTime(){
                console.log("onTime");
                if(this.direction > 0) {
                        if(!this.next()) this.direction*=-1;                              
                }
                else {
                        if(!this.prev()) this.direction*=-1;
                }               
        }

        lock(e) {
                this.x0 = this.unify(e).clientX;
                this.time=0; 
        };

        move(e) {
                if(this.x0 || this.x0 === 0) {
                        let dx = this.unify(e).clientX - this.x0;
                        if(dx<-10) this.next();
                        else if(dx>10) this.prev();
                        //console.log(dx);
                            
                        this.x0 = null;
                      }
        };
        
        drag(e) {
                e.preventDefault();              
                if(this.x0 || this.x0 === 0)  
                  this.getSlot().style.setProperty('--tx', `${Math.round(this.unify(e).clientX - this.x0)}px`);
              };

        unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

}

customElements.define("near-swiper",NearSwiper);

class NearSpinner extends i {

        static get properties() {
                return {
                };
        }

        static get styles() {
                return i$1`
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
              return b`
              <span id="spinner"></span>
              <slot><slot>`
      }

}

customElements.define("near-spinner",NearSpinner);

class NearContent extends i{

        
        static get properties() {
                return {
                  name: { type: String, reflect: true },
                  key: { type: String, reflect: true },
                  editing: {type: Boolean,  reflect: true},
                  editonly: {type: Boolean,  reflect: true},
                  obj:{type:Object}
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
                if(o.meta) this.meta= o.meta;
                this.obj=o;
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
                                                });
                                });
                }
        }

 

        static get styles() {
                return [styles(),i$1`
                        #tags{
                        
                        margin-top:1em;
                        background-color:#ccc2;
                        border-radius:1em;
                
                        }
                `];
        }


        editButton(){
                if(NearUser.instance && NearUser.instance.canEdit())
                        return b`<mwc-icon class="properties-icon" @click="${this.beginEdit}" title="props">more_vert</mwc-icon>`
                return '';         
        }

        getHTML(){
                return b`
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
                return b`
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
                        if(!this.obj) this.loadJson();
                        return b`
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
                                b`<img @click="${this.resources}" src="${this.image}">`:''}
                        </label>
                        <label>
                        search query
                        <input name="search" id="search" 
                                @input="${this.handleInput}"
                                type="text" .value="${this.search || ''}" autofocus>
                        </label>
                        <label>
                        meta
                        <textarea id="meta" @input="${this.handleInput}" >${this.meta || ''}</textarea>
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
                };
                if(this.search) o.search=this.search;
                if(this.image) o.image=this.image;
                if(this.video) o.video=this.video;
                if(this.meta) o.meta=this.meta;        
                return o;
        }

        toIndexObject(){

                let o={
                        title: this.title,
                        description: this.description
                };
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
                console.log("beginEdit");
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
                this.meta=this.shadowRoot.getElementById("meta").value;
                this.startPending();
                this.putMeta()
                .then(()=>{
                     this.dispatchEvent(new CustomEvent("content-edited",{detail:this}));       
                })
                .finally(()=>{
                        this.stopPending();
                });
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

class NearContents extends i {

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
                        i$1`
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
                                else console.log(response);                                      
                        });
                        return;
                }
                if(!refresh && NearContents.cache && NearContents.cache.key===this.key) {
                        data=NearContents.cache.data;
                        console.log (data);
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
                                else console.log(response);                                      
                        });
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
                        });
                        
                
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
                                r.push(b`<div><a href="${url}">${item.title}</a></div>`);
                        else if(!forceLink && item.html)
                                r.push(b`${o(item.html)}`);
                                
                        else          
                          r.push(b`
                               <div>
                               <a href="${url}">
                               ${item.image? 
                                b`<img src="${item.image}">`
                                : 
                                b`<dummy-img></dummy-img>` }
                               <div class="label"> 
                               <h3>${item.title}</h3>
                               <p>${item.description}</p>
                               </div>
                               </a>
                               </div>
                        `);
                });
                if(!this.nocache && NearUser.instance && NearUser.instance.canEdit())
                        r.push(b`<mwc-button style="clear:both" outlined id="refresh" icon="redo" label="rebuild" class="properties-icon" @click="${this.refresh}" title="rebuild"></mwc-button>`);
                return r;
        }

        render() {
                return b`
               ${this.documentsHTML()}
                `;
        }
        
}

customElements.define("near-contents",NearContents);

class NearContentsSelect extends NearContents {

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
                        i$1`
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
                if (u){
                        let promise=refresh && u.canEdit()? u.getDocumentsByKeyPut(this.key) : u.getDocumentsByKey(this.key);
                        promise.then(data => this.addDocuments(data,"api data"));
                }
                else {
                        fetch(NearUser.instance.baseURL+'/'+this.key+".list.json")
                        .then((response) => {
                                if(response.ok)  
                                        response.json().then(data => this.addDocuments(data,'fetch data'));
                                else console.log(response);                                      
                        });
                }

        }

        documentsHTML(){
                let r=[];
                let hasSelected=false;
                this.documents.forEach((item)=>{
                         if(this.selected && item.id==this.selected) {
                                r.push(b`<option value="${item.id}" selected>${item.title}</option>`);
                                this.obj=item;
                                hasSelected=true;
                        } 
                        else
                                r.push(b`<option value="${item.id}">${item.title}</option>`); 
                }); 
                if(!hasSelected) {
                        this.obj=this.documents[0];
                        //this.dispatchEvent(new CustomEvent("content-selected",{detail:this}))
                }                   
                return r;
        }

        get value(){
                return this.obj;
        }

        getValue(){
                return this.obj;
        }

        handleInput(){
                let select=this.shadowRoot.getElementById("select");
                this.selected=select.value;
                if(select.selectedIndex >=0)
                        this.obj=this.documents[select.selectedIndex];
                else
                        this.obj=null;
                this.dispatchEvent(new CustomEvent("content-selected",{detail:this}));                
        }
        render() {
                return b`
                <select id="select" @change="${this.handleInput}">
               ${this.documentsHTML()}
               </select>
                `;
        }
        
}

customElements.define("near-contents-select",NearContentsSelect);


class NearContentsSwiper extends NearContents {
        static get styles() {
                return [i$1`
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
                                r.push(b`<div part="slide"><div > ${o(item.html)}</div></div>`);
                                
                        else          
                          r.push(b`
                                <a href="${url}">
                               <div part="slide"><div >
                               
                               ${item.image? 
                                b`<img src="${item.image}">`
                                : ''}
                               <h3>${item.title}</h3>
                               <p>${item.description}</p>
                               </div></div></a>
                        `);
                });
                return r;
        }

        render() {
                return b`
                <near-swiper  time="5000">
               ${this.documentsHTML()}
                </near-swiper>
                ${NearUser.instance && NearUser.instance.canEdit() ?
                 b`<mwc-button id="refresh"  outlined class="properties-icon" icon="redo" label="rebuild"  @click="${this.refresh}" title="rebuild"></mwc-icon>`
                :''}
                `;
        }

}
customElements.define("near-contents-swiper",NearContentsSwiper);

class SectionControl extends i {

    
    static get styles() {
                
        return i$1`
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
                :host mwc-icon, :host span{ color:#888; padding:2px 8px; cursor:pointer}
                :host mwc-icon{font-size:16px}
                :host mwc-icon[plus] {
                    position:absolute;right:-30px; top:-30px;
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
        });
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
       
        console.log(content);    
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
        this.classList.add("dragtarget");
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
            });
            console.log("dropped node", node);
            if(!(node.firstChild instanceof SectionControlImpl) )
                node.insertAdjacentElement("afterbegin",new SectionControlImpl(this.nearEditor));      	  
            SectionControl.dropped=true;
        }
    }

    exec(command,e,value){
        e.stopPropagation();
        e.preventDefault();
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
        console.log("typeButtons:" ,this.nearEditor.types);
        Object.keys(this.nearEditor.types).forEach(t=>{
            console.log(t);
        r.push(b`<mwc-button @click="${(e)=>this.setContent(t)}" >${t}</mwc-button>`);
        });
        return r;
    }

}


class SectionsStart extends SectionControl {

    static get styles(){
        return [super.styles,i$1`:host{border-top:none}`]
    }

    constructor(nearEditor){
    super(nearEditor);
    }

    render(){
        //return html`<mwc-icon>save</mwc-icon>`
        return b``
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
        return b`<a href="#" tabindex="0" @click="${this.addSection}"><mwc-icon plus>add</mwc-icon></a>
                    <a href="#" tabindex="0" @click="${this.addContent}"><mwc-icon>post_add</mwc-icon></a>`
    }

}

SectionControl.states= Object.freeze({
    view:0,
    code:3
});


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
        return b`
            
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
                b`<mwc-icon title="add to cart" @mousedown="${this.createProduct}">add_shopping_cart</mwc-icon>`
                : ''
            }
            <mwc-icon title="no hace nada todavía">short_text</mwc-icon>
            <mwc-icon title="clear format" @mousedown="${(e)=>this.exec('removeFormat',e)}">format_clear</mwc-icon>
            
            <mwc-icon title="code" @mousedown="${this.code}">code</mwc-icon>
            
        `
    }


    codeForm(){
        console.log("codeForm");
        return b`
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
            if(code instanceof Node) node.appendChild(code);
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
        return b`
            <div class="control">
            ${this.focused? this.editControls() : ""}
            <mwc-icon title="duplicate section" @click="${this.cloneSection}">content_copy</mwc-icon>
            <mwc-icon title="insert section" @click="${this.addSection}" plus >add</mwc-icon>
            <mwc-icon title="remove section" @click="${this.deleteSection}">delete</mwc-icon>
            </div>
            ${""}
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
        console.log('focus');
        this.focused=true;
        this.requestUpdate();
    }
    handleFocusOut(ev){
        console.log('blur');
        this.focused=false;
        this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback();  
        console.log('connected');
        this.parentElement.addEventListener('focusin',this.handleFocusIn.bind(this));
        this.parentElement.addEventListener('focusout',this.handleFocusOut.bind(this));

    }
    disconnectedCallback() {
        super.disconnectedCallback();  
        console.log('disconnected');
    }

}




class FigureControl extends SectionControl {

    constructor(nearEditor){
        super(nearEditor);
        this.state=FigureControl.states.view;
    }



    scrappedButtons(){
        let h='';
 
        return b`${h}`;
    }

    embedForm(){
        let t=[];
        t.push(b`
            <div class="form">
            <label>embed URL
            <input id="url" @input="${this.scrapURL}" value="">
            </label> 
            </div>           
        `);
        if(this.scrapped) {
            let data=this.scrapped;
            if(data.oembed)
                t.push(b`<button @click="${this.selectOembed}">oEmbed</button>`);
            if(data.og)
                t.push(b`<button @click="${this.selectOpenGraph}">opengraph</button>`);
            if(data.twitter)
                t.push(b`<button @click="${this.selectCard}">card</button>`);
            t.push(b`<div class="submit"><span id="msg"></span><mwc-icon title="done" id="donebutton" @click="${this.view}">done</mwc-icon></div>`);             
        }
        
        return t;
    }

    codeForm(){
        return b`
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
                    t=b`<div class="dropper" @click="${this.resources}"></div>`;
                break;
            case FigureControl.states.code:
                t=this.codeForm();   
                break;
            case FigureControl.states.embed:
                    t=this.embedForm();          

        }
        return b`
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
            console.log(child);
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
                caption.innerHTML=`${data.description}<br>source: <a href="${data.url}">${data.author_name} at ${data.provider_name}</a>`;
            }
            catch(e){}
        }
    }
    selectOpenGraph(e){
        let caption=this.parentElement.lastElementChild;
        let data=this.scrapped.og;
        let h=`<div><a href="${data.url}"><img src="${data.image.url}"><h3>${data.title}</h3></a></div>`;
        this.putCode(h);
       
        if(caption){
            try{
                caption.innerHTML=`${data.description}<br>source: <a href="${data.url}">${data.site_name}</a>`;
            }
            catch(e){}
        }
    }
    selectCard(e){
        let caption=this.parentElement.lastElementChild;
        let data=this.scrapped.twitter;
        let h=`<div><a href="${data.url}"><img src="${data.image}"><h3>${data.title}</h3></a></div>`;
        this.putCode(h);
       
        if(caption){
            try{
                caption.innerHTML=`source: <a href="${data.url}">${data.site.name}</a>`;
            }
            catch(e){}
        }
    }


    scrapURL(){
        
        let url=this.shadowRoot.getElementById("url").value.trim();
        
        let u=NearUser.instance;
        this.putCode('<span class="spinner"></span>');
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
        }).catch((reason)=>{this.putCode("");});
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
            if(code instanceof Node) node.appendChild(code);
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
        let el=fig.previousSibling;
        let current=fig;
        while (true) {
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
});

customElements.define('sections-start', SectionsStart);
customElements.define('sections-end', SectionsEnd);
customElements.define('section-control', SectionControlImpl);
customElements.define('figure-control', FigureControl);



// Extend the LitElement base class
class NearEditor extends HTMLDivElement {


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
        
      return b`
      <style>
      :host{display:block}
        #editControl, #editDone, #editCancel { text-decoration:none; }
        #editControl {color:#930;cursor:pointer}
        #editDone {color:green;cursor:pointer}
        #editCancel {color:red;cursor:pointer}
        .editBar {text-align:right; opacity:0.5; font-size:15px; clear:both}
        .editBar mwc-icon {font-size:1cm; text-shadow: 1mm 1mm 1mm #4448; margin:1em;}     
        .focus{border:solid 1px #ccc} 
        #status{font-size:small; color:#8888}      
      </style>
      <slot></slot>
      ${NearUser.canEdit()?
      b` 
       <div class="editBar">
       
        
        ${this.editing? 
        b`
        <mwc-icon id="editCancel" title="cancel" @click="${this.cancelEdit}">cancel</mwc-icon>
        <mwc-icon id="editDone"  title="OK" @click="${this.endEdit}" >done</mwc-icon>`
        :
        b`<mwc-icon  id="editControl" title="edit" @click="${this.startEdit}">edit</mwc-icon>`}        
       </div>
       <div id="status"></div>
       ` :''}
      `;

    }

    requestUpdate(){
        D(this.render(),this.shadowRoot, {eventContext:this, host:this, scopeName: "near-editor" });
    }

    startEdit(){
        console.log(this.constructor.name);
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
        let status=this.shadowRoot.getElementById("status");
        if(status){
            status.innerHTML="editable";
            this.requestUpdate();
        }
    }

    editToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        if(this.editing) this.endEdit();
        else this.startEdit();
    }

    editFields() {


        console.log("editFields invoked");
        let slot=this.shadowRoot.querySelector('slot');
        let elements=slot.assignedNodes({flatten:true});

            //.querySelectorAll('.medium');
        console.log(elements);
        {   let ads=this.querySelectorAll(".autoplaced-by-us, #end_content, #ad-amz");
            ads && ads.forEach(ad => { 
                console.log("remove:", ad);
                ad.parentElement.removeChild(ad);
            });
            ads=this.querySelectorAll(".googleads");
            ads && ads.forEach(ad => ad.parentElement.removeChild(ad));
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
        });
        
        this.insertBefore(new SectionsStart(this) ,this.hasChildNodes()? this.childNodes[0] : null);
       

        fields = elements.filter(el =>  el.tagName=="SECTION" );
        fields.forEach((field)=>{
            let all=field.querySelectorAll('*');
            all.forEach(element=>{
                if(element.tagName.startsWith("NEAR-"))
                    element.setAttribute('editable',true);
            });
            let el=new SectionControlImpl(this);
            field.insertBefore(el,field.hasChildNodes()? field.childNodes[0] : null);
        });        
        this.appendChild(new SectionsEnd(this));
  
        fields=this.querySelectorAll('figure');
        fields.forEach((field)=>{
            let el=new FigureControl(this);
            field.insertBefore(el,field.hasChildNodes()? field.childNodes[0] : null);
        });  

        fields = elements.filter(el =>  "classList" in el && el.classList.contains('field') );
        fields.forEach((field)=>{
            field.setAttribute('contenteditable',true);
            field.addEventListener("keyup",this.handleKeyup);
        });

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
        });

        let slot=this.shadowRoot.querySelector('slot');
        let elements=slot.assignedNodes({flatten:true});
        this.removeChild(this.querySelector('sections-start'));
        elements=this.querySelectorAll('section-control');
        elements.forEach((el)=>{
            el.parentElement.removeChild(el);
        }); 
        this.removeChild(this.querySelector('sections-end'));
        elements=this.querySelectorAll('figure-control');
        elements.forEach((el)=>{
            el.parentElement.removeChild(el);
        }); 
        elements=this.querySelectorAll('*');
        elements.forEach(element=>{  
                if(element.tagName.startsWith("NEAR-"))
                    element.removeAttribute('editable');
        }); 

    }
  
  }


    NearEditor.handleKeydown=(event)=>{
        //this.base.on
        //console.log(window.getSelection().anchorNode.parentElement);    
    };

    NearEditor.handleKeyup=(event)=>{
        window.getSelection().focusNode;
        //console.log(this.currentBlock);
        return;
    };

    NearEditor.handleMousedown=(e)=>{
        console.log(e);
        if(e.target.tagName=="A") {
            e.preventDefault();
            e.stopPropagation();
            var url=window.prompt("url?",e.target.getAttribute("href"));
            if(url) e.target.setAttribute('href',url);
        }
    };

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

};


customElements.define('near-editor', NearEditor,  { extends: "div" });

class NearSectionLibrary extends i{

    static get styles(){
        return i$1`
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
            r.push(b`<item id="${i}">${o(component.getIcon())}</item>`);
            //r.push(html`HOLA`);
        });
        return b`${r}`;
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
    }

    handleDrag(ev){
        ev.preventDefault();
        ev.stopPropagation();
        ev.dataTransfer.setData("Section",this.outerHTML);
        this.dragging=true;
    }
    
    handleDragEnd(ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.dragging=false;
    }

    firstUpdated(){
        let elements=this.shadowRoot.querySelectorAll('item');
        console.log("elements", elements);
        elements.forEach(element=>{
            this.initEventListeners(element);
        });
    }

    static add(component){
        NearSectionLibrary.components.push(component);
        console.log(NearSectionLibrary.components);
        document.querySelectorAll('near.section-library').forEach((element)=>element.requestUpdate());
    }
}

NearSectionLibrary.components=[];

window.nearSectionLibrary=NearSectionLibrary;
customElements.define('near-section-library', NearSectionLibrary);

export { NearEditor, NearSectionLibrary };
//# sourceMappingURL=editor-BUQf49_0.js.map
