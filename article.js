import {LitElement, html, css } from 'lit-element'
import {Icon} from "@material/mwc-icon"
import {Formfield} from '@material/mwc-formfield'
import {Button} from '@material/mwc-button'
import {NearUser} from "./user";
import {NearResources} from "./resources";
import {urlize} from "./urlize";
import {styles} from "./styles";
import {NearContent,NearContents, NearContentsSelect} from "./content";

export class NearArticle extends NearContent {


        static get styles() {
                return [super.styles,css`
                        .byline {font-size:small }
                        .byline img{ max-width:50px; clip-path: circle(50% at center); margin:5px; vertical-align: middle;}
                        }
                `];
        }

        constructor() {
                super();
        }



        jsonLoaded(o){
                if(o.author && o.author.id)
                        this.selected=o.author.id;
                super.jsonLoaded(o);        
        }

        ensure(){
                if(!this.o) this.o={};
        }

        handleSelectAuthor(e){
                this.ensure();
                this.o.author=this.author=e.target.value;
                this.shadowRoot.querySelector(".byline").innerHTML=
                 `${this.o.author.image? `<img src="${this.o.author.image}">` : ``}
                 ${this.o.author.title|| this.o.author.name}`;
                
                
        }

        handleDateInput(e){
                this.ensure();
                this.o.date=this.date=e.target.value;
                this.handleInput(e);
        }

        extraFields(){
                return html`
                <label>
                Author
                ${NearUser.canAdmin()? html`
                <near-contents-select key="Author" selected="${this.selected}" @content-selected="${this.handleSelectAuthor}">
                </near-contents-select> 
                ` : '' }
                <div class="byline">
                ${this.o.author && this.o.author.image? html`<img src="${this.o.author.image}">` : ``}
                ${this.o.author && (this.o.author.title|| this.o.author.name)}</div>                       
                </label>
                <label>
                Publication Date
                <input type="date" value="${this.o? this.o.date || '' : ''}" @input="${this.handleDateInput}"></input>
                </label>`
        }

        createKey(){
                const d=new Date();
                let key = `/${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${urlize(this.title)}`;
                if(NearArticle.creatorSuffix && !NearUser.canAdmin())
                        key+='-' + NearUser.instance.sub.slice(-12);
                if(NearContent.dotHtml) 
                        key+='.html';
                return key;        
        }


        createForm(){
                this.ensure();
                this.o.author={};
                this.o.author.name=NearUser.instance.name;
                if(NearUser.instance.picture) this.o.author.image=NearUser.instance.picture;
                return super.createForm();
        } 
 
        createHTML(o){
                
                if(!o) { 
                        this.ensure();
                        o=this.o;
                }
                let h=
                `<section id="article-header"><div class="e" contenteditable>
                <h1>${this.title}</h1>
                <h3>${this.description}</h3>
                </div></section>`
                h+=`<section><div class="e">`;
                if(o.author ){
                        h+=`<div class="byline">`;
                        h+=`<a href="${o.author.id}">`;
                        if(o.author.image)
                                h+=`<img src="${o.author.image}">`;
                        if(o.author.title)
                                h+=`<h4>${o.author.title}</h4>`;
                        if(o.author.name)
                                h+=`<h4>${o.author.name}</h4>`;        
                        h+="</a>";
                        if(o.author.description)
                                h+=`<p>${o.author.description}</p>` 

                        h+='</div>'
                }
                if(o.date)        
                        h+=`<div class="dateline">${o.date}</div>`;
                h+=`</div></section>`;
                return h;
        }


        listHTML(o){
                if(!o) o=this.o;

                let h='<div>';
                h+=`<a href="${this.key}">`;
                if(this.image) 
                        h+=`<img src="${this.image}">`;
                h+=`<h3>${this.title}</h3></a>`;
                h+=`<p>${this.description}</p>`;
                if(o.author && o.author.title)
                        h+=`<div class="byline">${o.author.title}</div>`;
                else if(o.author && o.author.name)
                        h+=`<div class="byline">${o.author.name}</div>`;        
                if(o.date)        
                        h+=`<div class="dateline">${o.date}</div>`;
                h+=`</div>\n`
                return h;
        }

        toObject(){
                let o=super.toObject();
                if(this.o.author) o.author=this.o.author;
                if(this.o.date) o.date=this.o.date;  
                o.type="article";   
                return o;
        }

        toIndexObject(){
                let o=super.toIndexObject();
                if(this.o.author) o.author=this.o.author;
                if(this.o.date) o.date=this.o.date;
                o.type="article"; 
                o.html=this.listHTML(o);     
                return o;
        }

        getType(){
                return 'article';
        }


}

customElements.define("near-article",NearArticle);

NearArticle.creatorSuffix=true;

