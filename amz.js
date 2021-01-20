import { LitElement, html, css } from 'lit-element';
import {Icon} from "@material/mwc-icon"

let icon=`
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 291.319 291.319" style="width:50px;enable-background:new 0 0 291.319 291.319;" xml:space="preserve">
<g>
	<path style="fill:#F4B459;" d="M252.089,239.901c-120.033,57.126-194.528,9.331-242.214-19.7c-2.95-1.83-7.966,0.428-3.614,5.426
		c15.886,19.263,67.95,65.692,135.909,65.692c68.005,0,108.462-37.107,113.523-43.58
		C260.719,241.321,257.169,237.78,252.089,239.901z M285.8,221.284c-3.223-4.197-19.6-4.98-29.906-3.714
		c-10.324,1.229-25.818,7.538-24.471,11.325c0.692,1.42,2.103,0.783,9.195,0.146c7.11-0.71,27.029-3.223,31.18,2.203
		c4.17,5.462-6.354,31.49-8.275,35.687c-1.857,4.197,0.71,5.28,4.197,2.485c3.441-2.795,9.668-10.032,13.847-20.274
		C285.718,238.845,288.249,224.479,285.8,221.284z"/>
	<path style="fill:#484848;" d="M221.71,149.219V53.557C221.71,37.125,205.815,0,148.689,0C91.572,0,61.184,35.696,61.184,67.85
		l47.74,4.27c0,0,10.633-32.136,35.313-32.136s22.987,19.992,22.987,24.316v20.784C135.607,86.149,57.096,95.18,57.096,161.382
		c0,71.191,89.863,74.177,119.332,28.167c1.138,1.866,2.431,3.696,4.051,5.408c10.843,11.398,25.308,24.981,25.308,24.981
		l36.852-36.415C242.658,183.513,221.71,167.071,221.71,149.219z M112.511,152.578c0-30.579,32.764-36.779,54.722-37.507v26.319
		C167.224,193.527,112.511,185.634,112.511,152.578z"/>
</g>
</svg>`

export class NearAmz extends LitElement {

        static get properties() {
                return {
                q: {type: String, reflect: true},
                shadow: {type: Boolean, reflect: true},
                contenteditable: {type: Boolean, reflect: true},
                editable:{type: Boolean, reflect: true}
                                           
                };
        }

        static get styles() {
                
                return css`
                :host .amz , ::slotted(.amz){
                        display:flex;
                        overflow-x:auto;
                }
                .item {display:block;
                        box-shadow:5px 5px 10px #888;
                        margin:.5em;
                        max-width:250px;
                        min-width:200px;
                        }
                .item a{
                        text-decoration:none;
                        display: block;
                        
                        padding:1em;
                        color:#555;
                }
                .item h5 {}
                .item .price {font-weight:bold; color:#999;}
                
                p {text-align:center;font-size:small;font-style:italic;color:#888}

                @media(max-width:600px) {
                        .item {display:block;
                        max-width:none;        
                
                }
                       
                `;
                
        }

 

        constructor() {
                super();
                //this.setAttribute("tabindex","-1");
                //this.country="US";
                this.q="k=iot&c=4";
                //this.c=4;
        }

        editForm(){
                let t=[];
                t.push(html`
                    <div class="form">
                    <label>query
                    <input id="url" @change="${(e)=> {this.q=e.target.value}}" value="${this.q}">
                    </label> 
                    </div>           
                `);
                return t;
            }
        render() {
                return html`                      
                        
                        ${this.isContentEditable || this.editable? this.editForm() : html``}
                        <div id="products"></div>
                        <slot></slot>   
                        <p style="" >Note: as an Amazon Associate we earn from qualifying purchases</p>
                          
                `;
        }


        getIcon(){
                return icon;
        }

        load(query) {
                if(!query) query=this.q;
                let target=this.shadow? 
                        this.shadowRoot.getElementById("products") : this;
                fetch(`https://idoneos.com/_pa?${query}`).then((response) => {
                        if(response.ok)  
                                response.text().then(text => {
                                        if(!text.startsWith('[{')){  
                                                target.innerHTML=text;
                                                this.dispatchEvent(new CustomEvent("amz-loaded",{}));
                                                //console.log("amz-loaded",this)
                                        }
                                        
                                });
                        else target.innerHTML='';
              
                });
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

        keypress(e)
        {       if(this.isContentEditable || this.editable){
                        if(e.key=="Delete")
                                this.parentElement.removeChild(this);
                        else if(e.key=="Enter") {
                                let element=document.createElement('p');
                                element.innerHTML="<br>";
                                this.parentElement.insertBefore(element,this.nextElementSibling);
                                element.focus();
                                e.stopPropagation();
                        }        
                        
                }
                console.log(e);
                this.requestUpdate();
        }
        
        keydown(e) {
                if(this.isContentEditable){
                        if(e.key=="Backspace" && !this.previousSibling){
                                let element=document.createElement('p');
                                element.innerHTML="<br>";
                                this.parentElement.insertBefore(element,this);
                                element.focus();
                        }        
                        
                }
                
                console.log(e);

        }
        focus(e) {
                console.log(e);
                this.requestUpdate();
        }
        blur(e) {
                console.log(e);
                this.requestUpdate();
        }

        left(e){ 
                console.log('left');
                this.setAttribute('left',"");
                this.removeAttribute('right');
                this.requestUpdate();
        }

        center(e){
                console.log('center');
                this.removeAttribute('left');
                this.removeAttribute('right');
                this.requestUpdate();
        }
        right(e){
                console.log('right');
                this.setAttribute('right',"");
                this.removeAttribute('left');
                this.requestUpdate();

        }     
        
        onDragover(e){
                console.log(e.dataTransfer);
                //e.dataTransfer.dropEffect = '';
                e.preventDefault();
                return true;
         
        }

        onDrop(e){
                console.log(e.dataTransfer.types);
                console.log(e.dataTransfer.getData('text/uri-list'));
                var uri= e.dataTransfer.getData('text/uri-list');
                if(uri) {
                        this.innerHTML=`<img src="${uri}"><figcaption>${uri}</figcaption>`;
                        this.requestUpdate(); 
                }
   
                e.preventDefault();
         
        }

        



}
customElements.define('near-amz', NearAmz);

customElements.whenDefined('near-section-library').then( ()=>{
        //nearSectionLibrary.add(new NearAmz());
});

