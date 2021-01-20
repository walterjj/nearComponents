/**
@license

*/


import {Drawer} from '@material/mwc-drawer'
import {TopAppBarFixed} from '@material/mwc-top-app-bar-fixed'

import {IconButton} from '@material/mwc-icon-button'
import {Icon} from '@material/mwc-icon'




import  {NearUser} from "./user.js";
import  {NearEditor} from "./editor.js";
import {NearMenu} from './menu.js'
import {LitElement, html, css } from 'lit-element';
import {NearLocation, NearRoute} from './route.js';
import {NearContent} from  './content.js'
import {NearArticle} from  './article.js'


export class NearApp extends LitElement {


  static get styles() {
        return css`
  
                :host {
                        --swiper-right: 2em;
                        --container-max-width: 1024px;   
                        --toolbar-width: 100%;     
                        display: block;
                        }
                a {
                        font-size: inherit;
                }
                @media only screen and (min-width:993px) {
                        :host {
                                --container-max-width: 70%;     
                        }

                }

                

                mwc-top-app-bar-fixed {
                }
                .toolbar {
                        display:flex;
                       font-size:14px;
                }
                .toolbar img {vertical-align:middle}
                .toolbar near-selector {
                        display:flex;
                        align-items:center;
                }


                .main-content{
                        
                        min-height:calc(100vh - 64px);
                        text-align:left;
                        margin:1em;
                }

                .tabs {
                        height: 100%;
                        @apply --layout-horizontal;
                }

                .tabs > a {
                        margin: 12px 16px 12px;
                        border-bottom: 1px solid #fff8;
                        display:inline-block;
                        position:relative;
                        text-decoration: none;
                        color:white;
                }
  
                near-selector > a.near-selected {
                        border-bottom:solid 1px #fff2;
                }

                .tabs > a:hover{ color:#fffc;}

                #pages {
                        border-bottom:solid  1px #8884;
                        display:block;
                }
                #pages:empty {border:none}
                #pages > a {
                        border: 1px solid transparent;
                        border-radius: 4px 4px 0 0; 
                        position:relative;
                        bottom:-1px;
                        padding:.5em;
                        font-size:14px;
                        margin:0;
                        color:#08f;
                }
                #pages > a.near-selected {
                        border: 1px solid #8884;
                        border-bottom-color: transparent;
                        background-color:white;
                }

                screen{
                        display: flex;        
                        flex-direction: column;
                        justify-content:center;
                        text-align: center;
                        color:white;
                        
                        text-shadow: 0px 0px 1vh #000,0px 0px 3vh #000, 0px 0px 5vh #fff;
                        height: calc(100vh - 60px);
                }


                

                .banner {
                        background-image: url('/banner.jpg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-color: #034;
                        color: white;
                        text-align: left;
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                        margin:-1em;
                        

                }
                .banner > div {
                        max-width:800px;
                        display:flex;
                        padding-top:32px;
                        margin:0 auto ;
                        align-items:center;
                        width:100%;
                }

                .banner  img {max-width:100px;max-height:100px; opacity:.7;}
                .banner  h2 {
                        font-size: 30px;
                        font-weight: 900;
                        
                }

        

                mwc-drawer {
                        display:block;
                        nposition:fixed;
                        width:100%;
                        noverflow:scroll;
                }


                
                
                .drawer-content div > a{
                        display:block;
                        z-index:99999;
                        text-align:right;
                        padding:.5em;
                        color:#555;
                        text-decoration: none;
                }
                .drawer-content h2{
                        font-size: 1em;
                        text-align:right;
                        padding:3em .5em 0 0;
                        margin:0;
                        color:#ccc;
                        border-bottom: solid 1px #ccc;
                }

                .main-contentsection {
                        padding: 88px 16px;
                        font-family: 'Cormorant Garamond', serif;
                        min-height: calc(50vh - 64px);
                }

                header.banner {
                        height:10vh;

                }

                header > img {max-width:150px; opacity:.5}

                header >  h2 {
                        font-size: 56px;
                        font-weight: 300;
                        margin: 0;
                        
                }
                header h2 {
                        font-size: 56px;
                        font-weight: 300;
                        font-weight: 300;
                        margin: 0;
                        
                }

                header > p {
                        font-size: 32px;
                        
                }
                header  p {
                        font-size: 32px;
                        margin:0;
                        
                }
                header  blockquote {
                        position:absolute;
                        bottom:0;
                        right:0;
                        font-variant:normal;
                        max-width:400px;
                        margin:2em;
                        
                }
                header  blockquote > author {
                        margin-top:1em;
                        text-align:right;
                        display:block;
                }

                #mdsection {
                        padding: 1em 0px;
                        nfont-family: 'Cormorant Garamond', serif;
                        min-height: calc(50vh - 64px);
                }
                
                



                .container {
                        max-width: var(--container-max-width);
                        margin: 0 auto;
                }

                .container > * {
                        @apply --layout-flex;
                }

                .container img {
                        max-width: 100%;
                        max-height: 100%;
                }

                .ncontainer h3 {
                        font-size: 32px;
                        font-weight: 300;
                        margin: 24px 0;
                }

                .container p {
                        line-height: 1.5;
                }

                :root {
                        --container: {
                                max-width: var(--container-max-width);
                                margin: 0 auto;
                        };
                }


                @media (min-width: 600px) {
                        .toolbar iron-selector { display:inherit}
                }

                @media (max-width: 600px) {
                        .container {
                        @apply --layout-vertical;
                        }
                        header h2  {
                        font-size: 30px;
                        }
                        .banner h2 {
                        font-size: 20px;
                        }
                        header p { font-size:25px}
                        header {
                        @apply --layout-vertical;
                        }
                        header blockquote {
                        font-size:14px;
                        
                        }
                
                        .toolbar {
                        font-size:12px;
                        }
                        .tabs a {
                        margin: 12px 8px 12px;
                        }
                        

                }

                h3 {
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                }

                        
                figure{
                        text-align:center;
                        margin-inline-start:0;
                        margin-inline-end:0;
                        margin-block-start:0;
                        margin-block-end:0 }
                figure img, figure video, figure iframe {max-width:100%}
                figcaption{color:#888; font-size:small; font-style: italic;margin:.5em }  
                
                blockquote {color:#777; font-style:italic; font-size:larger;}

                .collapse {display:none !important}

                @media (min-width: 600px) {
                        .collapse {display:inline-block !important}
                        .toolbar iron-selector { display:inherit}
                        figure[right]{float:right; max-width:60%; margin:1em 0 1em 1em;}
                        figure[right] img, figure[left] img {}
                        figure[left]{float:left;  max-width:60%; margin:1em 1em 1em 0;}
                }
                .spinner,.spinner:after{
                        width:64px;
                        height:64px;
                        min-width:64px;
                        min-height:64px;
                        display:block;
                        nposition: fixed;
                        ntop: 50%;
                        nleft: 50%;
                        margin:32px auto; 
                        border-radius: 50%;
                }
                .spinner {
                        background-color: transparent;
                        border-top: 3px solid rgb(66,139,202);
                        border-right: 3px solid rgb(66,139,202);
                        border-bottom: 3px solid rgb(66,139,202);
                        border-left: 3px solid rgba(66,139,202,.2);
                        transform: translateZ(0);
                        animation-iteration-count: infinite;
                        animation-timing-function: linear;
                        animation-duration: .8s;
                        animation-name: spinner-loading
                }
                @keyframes spinner-loading{
                        0% {
                        transform: rotate(0deg)
                        } to {
                        transform: rotate(1turn)
                        }
                }

                near-contents{
                        --near-contents-max-width:100%;
                        --near-contents-display:block;
                        --near-contents-clear:both;
                        --near-contents-border: none 1px #ccc; 
                        --near-contents-margin; .5em 0;
                        --near-contents-padding:1em; 
                        --near-contents-box-shadow: 2px 2px 4px #8888;
                        --near-contents-image-max-width: 150px;
                        --near-contents-image-float:right;
                        --near-contents-image-margin: 1em;
                        --near-contents-byline-text-align:right;
                        --near-contents-font-family: 'Cormorant Garamond';
                        text-align:left;
                }
                
                near-contents a{ color:#555; text-decoration:none}
                near-contents a:hover{ color:#c88; text-decoration:underline}
                @media(max-width:600px) {
                        near-contents{
                        --near-contents-image-max-width: 100px;
                        --near-contents-image-float:right;
                        --near-contents-image-margin: 1em 0; 
                        }
                }

                
                .articles {
                        --near-contents-display:inline-block;
                        --near-contents-max-width:200px;
                       
                        --near-contents-border: solid 1px #ccc; 
                        --near-contents-margin; 0 0 2px 2px;
                        --near-contents-padding:1em; 
                        --near-contents-box-shadow: 2px 2px 2px #888;
                
                }
                

                h1{font-size:3em; line-height:1.1} 
                .byline,.dateline{border:none;font-size:small; text-align:right}
                .byline{font-weight:bold}
                .byline img{ margin: 0 1em 0 0; display:inline-block; max-width:50px;
                clip-path: circle(50% at center); float:left;}  
                .byline{font-weight:bold}
                .dateline{color:#8888}
                #home-swiper {height:50vh}
                @media (min-width:1000px) {
                        #home-swiper {height:90vh} 
                }
                
                .toc li{list-style-type:none}
                
        `;

  }

 

  pageMenu(){
        if(NearUser.canEdit())
         return html`
          <a name="edit" href="#" @click="${this.openMenu}" >Edit...
            <near-menu id="edit-menu">
            <near-list>
            
            <near-list-item @click="${this.newArticle}"  label="New Article..."></near-list-item>
            <hr>
            <near-list-item @click="${this.editMeta}"  label="Edit Meta..."></near-list-item>
            <near-list-item @click="${this.articles}" label="Articles..."></near-list-item>
            ${NearUser.canAdmin?
            html`
            <hr>
            admin
            <near-list-item @click="${this.newContent}"  label="New Content..."></near-list-item>
            <near-list-item @click="${this.invalidate}" label="Clear CDN Cache"></near-list-item>
            `
            :''}
               
            </near-list>  
            </near-menu></a>
         `
        return ''        

  }
  
  userExtra(){}

  topBarTitle(){
    return html`${this.title}`;      
  }
  render() {
    
    return html`
     <mwc-top-app-bar-fixed dense class="toolbar">
        <mwc-icon-button slot="navigationIcon" icon="menu" @click="${this.handleNavigationClick}"></mwc-icon-button>
        <div slot="title">${this.topBarTitle()}</div>
 
        <near-selector class="tabs" role="navigation" slot="actionItems">
            ${this.menu()}
            ${this.pageMenu()}
            ${this.userExtra()}  
        </near-selector>
        
        <near-user 
         slot="actionItems"
         poolId="${this.poolId}"
          clientId="${this.clientId}"
          baseURL="${this.baseURL}"
          apiURL="${this.apiURL}" 
          lang="${this.lang}"
          @user-ready="${this.onUserReady}"
          signInLabel="${this.signInLabel}"
          ?noregister="${this.noregister}"
          >user</near-user> 
         
        </mwc-top-app-bar-fixed>
      <mwc-drawer id="drawer" nhasHeader   type="modal" nclick="${this.closeDrawer}">
      <span slot="title">${this.topBarTitle()}</span>
      <span slot="subtitle"></span>
      <div class="drawer-content">

        <div  class="ntabs" role="navigation" slot="actionItems" >
            ${this.drawerMenu()}
        </div>
      </div> 
      <div id="app-content" slot="appContent">
     
        
        <div class="main-content">     
          ${this.internalPage()}     
        </div>
      <site-footer></site-footer> 
    </div>
  </mwc-drawer>`
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true
      },
      mode:{
        type:String,
        value:"home"

      },
      routeData: Object,
      subroute: Object,
      signedLoad: {
              type:Boolean,
              default: true
      }
    };
  }

  

  constructor() {
          super();
          this.signedLoad=true;
          
  }

  contentFile(path){
        //console.log(path!=="/"? path+'.h': '/index.h')
        if(path.endsWith(".html")) return path.slice(0,-5)+'.h'; 
        return(path.endsWith("/") ? path+'index.h': path+'.h');
  }

  propsFile(path){
        //console.log(path!=="/"? path+'.h': '/index.h')
        if(path.endsWith(".html")) return path.slice(0,-5)+'.json'; 
        return(path.endsWith("/") ? path+'index.json': path+'.json'); 
        //return(path!=="/"? path+'.json': '/index.json');
  }


  firstUpdated(){
        document.body.removeAttribute('unresolved');  
        this.nearLocation=new NearLocation(
                this.routePageChanged.bind(this),
                this.hashChanged.bind(this));
        //this.pageChanged(this.page);
        if(this.convertible) {
                window.onresize=this.checkConvertible.bind(this);
                this.checkConvertible(); 
        }
               
  }

  checkConvertible(){
          console.log("resize");
          let drawer=this.shadowRoot.getElementById("drawer");
          if(drawer){
                if(window.innerWidth >= 800) {
                        drawer.setAttribute("type","dismissible");
                        drawer.removeEventListener("click", this.closeDrawer.bind(this));
                        this.drawerStatic=true;
                        this.openDrawer();
                        
                  }
                  else  {
                        this.shadowRoot.getElementById("drawer").setAttribute("type","modal");
                        drawer.addEventListener("click", this.closeDrawer.bind(this));
                        this.drawerStatic=false;
                        this.closeDrawer();
                  }
          }

  }

  updated() {
        super.updated();
        //this.pageChanged(this.page);
   }

  hashChanged(nearLocation) {
        return;  
        let element=this.shadowRoot.getElementById(nearLocation.hash);
        if(element)
                element.scrollIntoView({behavior:"smooth"});
  } 

  routePageChanged(nearLocation) {
      // Show the corresponding page according to the route.
      //
      // If no page was found in the route data, page will be an empty string.
      // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
      
      let page=nearLocation.path.slice(1); 
      console.log('routePageChanged:'+ page );
      if (!page) {
        this.page = '';
        this.mode = 'home';
      } else if(page=="contact") {
        this.mode ="contact"
      }
      else if (true || ['mission', 'leadership', 'forum', 'contact'].indexOf(page) !== -1) {
        this.page = page;
        this.mode = "mdsection";
      } else {
        this.page = 'view404';
      }
    
      let drawer=this.shadowRoot.getElementById("drawer")
      if (drawer && !this.drawerStatic) drawer.open=false;
      window.scrollTo(0,0);

      const links=this.shadowRoot.querySelectorAll("near-selector a");
      links.forEach( link => {
        console.log(link,window.location.pathname,link.href );      
        if(window.location.pathname==link.getAttribute('href')|| window.location.pathname.endsWith(link.getAttribute('href')) )
                link.classList.add('near-selected');
        else 
                link.classList.remove('near-selected');   
                      
        })
      this.pageChanged(this.page);
      
  };
  
  onUserReady(e){
    console.log('user ready');
    this.pageChanged(window.location.pathname);
    
  }

  endEdit(e) {
    const editor=e.target;
    const u=NearUser.instance;
    let path=this.contentFile(window.decodeURIComponent(window.location.pathname));
    console.log("write:",path)
    u.put(path,editor.innerHTML,"text/html");
  }

  fixLocalLinks(e=this) {
        //const links=this.shadowRoot.querySelectorAll("a");
        const links=e.querySelectorAll("a");
        links.forEach( link => {
          let href=link.getAttribute('href');
          if(href 
                && !href.startsWith('http') 
                && !href.startsWith('//')
                && !href.startsWith('#'))
                  link.addEventListener('click', NearRoute.prototype.clickHandler.bind(link));
                  link.setAttribute("is","near-route");                     
          })
  }

  makeImagesLazy(content) {
        let lazyImages=content.querySelectorAll("img");

        if ("IntersectionObserver" in window) {
                let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                  entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                      let lazyImage = entry.target;
                      lazyImage.src = lazyImage.dataset.src;
                      //lazyImage.srcset = lazyImage.dataset.srcset;
                      lazyImage.classList.remove("lazy");
                      lazyImageObserver.unobserve(lazyImage);
                    }
                  });
                });
            
                lazyImages.forEach(function(lazyImage) {
                  lazyImage.dataset.src=lazyImage.src;
                  lazyImage.src="data:,";      
                  lazyImageObserver.observe(lazyImage);
                });
        }
  }


  onMeta(meta){
          console.log("meta", this.meta);
          let e;
          if(meta.title){
                if(e=document.querySelector('title')) e.innerHTML=meta.title;
                if(e=document.querySelector('meta[property="og:title"]')) e.setAttribute("content",meta.title);
          }
          if(meta.description){ 
                if(e=document.querySelector('meta[name="description"]')) e.setAttribute("content",meta.description);
                if(e=document.querySelector('meta[property="og:description"]')) e.setAttribute("content",meta.description);
          }
          if(meta.canonical){ 
                if(e=document.querySelector('link[rel="canonical"]')) e.setAttribute("href",meta.canonical);
                if(e=document.querySelector('meta[property="og:url"]')) e.setAttribute("content",meta.canonical);
          }
          else  if(meta.url){ 
                if(e=document.querySelector('link[rel="canonical"]')) e.setAttribute("href",meta.url);
                if(e=document.querySelector('meta[property="og:url"]')) e.setAttribute("content",meta.url);
          }
          if(meta.image){ 
                if(e=document.querySelector('meta[property="og:image"]')) e.setAttribute("content",meta.image);
          }
          if(meta.pages && (e=this.shadowRoot.getElementById("pages"))) {
                  e.innerHTML="";
                  meta.pages.forEach((page) => {
                          let a=document.createElement("a",{is:'near-route'});
                          a.setAttribute("href",page.filename);
                          a.innerHTML=page.name;
                          if(window.location.pathname.endsWith(page.filename) ||
                            (window.location.pathname.endsWith('/') && page.filename=='index.html') )
                                a.classList.add('near-selected');
                          e.appendChild(a);
                  } );

          }
          if(meta.toc && (e=this.shadowRoot.getElementById("toc"))) {
                  e.innerHTML=meta.toc;
          }
          if(meta.breadcrums && (e=document.getElementById("top"))) {
                e.innerHTML=meta.breadcrums;
          }
  }

  onContent(content){
        this.content=content;
  }

  pageChanged(page) {
        let baseURL=NearUser.instance? NearUser.instance.baseURL :"";  
        console.log('pageChanged:'+ page );
        if(ga){
                (async ()=> {
                ga('set', 'page', window.location.pathname);
                ga('send', 'pageview');}) ();
        }

        this.meta=null; this.content=null;
        //let content=this.shadowRoot.querySelector("#content");
        if(NearUser.instance.canEdit())  
                //this.innerHTML=`<div id="top"></div><near-editor  id="content"></near-editor>`;
                document.querySelector("#content").outerHTML='<near-editor  id="content"></near-editor>';
        let content=document.querySelector("#content");
        content.innerHTML="";
        if(NearUser.instance.canEdit()) 
                content.addEventListener("end-edit",this.endEdit.bind(this));
        if(content) {
            let contentFile=this.contentFile(window.decodeURIComponent(window.location.pathname));
            let propsFile=this.propsFile(window.decodeURIComponent(window.location.pathname));      
            if(this.signedLoad && NearUser.instance.canEdit()) {
                    console.log("via GET")
                    NearUser.instance.get(contentFile)
                            .then((response) => {
                                    if(response.ok)  
                                            response.text().then(text => {
                                                     content.innerHTML=text;
                                                     this.fixLocalLinks();
                                                     this.hashChanged(this.nearLocation);
                                                });
                                    else content.innerHTML='';  
                                    
                                    })
                            .catch(error => console.log("e get",error))
                    NearUser.instance.get(propsFile)
                    .then((response) => {
                            if(response.ok)  
                                    response.json().then(meta => {
                                            this.meta=meta;
                                            this.onMeta(meta);    
                                        });
                            else this.meta={};
                            
                            })
                    .catch(error => console.log("e get",error))        
                    return;                      
            }    
            else fetch(NearUser.instance.baseURL+contentFile)
            .then((response) => {
                    if(response.ok)  
                            response.text().then(text => {
                                content.innerHTML=text;
                                this.fixLocalLinks();
                                this.makeImagesLazy(content);
                                this.onContent(content);
                                this.hashChanged(this.nearLocation);
                                document.body.removeAttribute('unresolved');
                           });
                    else content.innerHTML='';  
            })
            .catch(error => console.log("e fetch",error));
            fetch(NearUser.instance.baseURL+propsFile)
            .then((response) => {
                    if(response.ok){  
                            response.json().then(meta => { 
                                    this.meta=meta;
                                    this.onMeta(meta);
                                });
                            
                    }
                    else this.meta={};
                    
            })
            .catch(error => console.log("e fetch",error))            
         }
           
  };

  handleNavigationClick() {
    console.log("navigationClick");
    let drawer=this.shadowRoot.getElementById("drawer")
    if(drawer) drawer.open=!drawer.open;
    if(ga) ga('send', 'event', 'UI', 'menu', window.location.href)   
  }


  openDrawer(){
        this.shadowRoot.getElementById("drawer").open=true;
        if(this.drawerStatic)
                this.style["--toolbar-width"]="calc(100vw - 256px)";    
        
                  
  }
  closeDrawer(){      
        this.shadowRoot.getElementById("drawer").open=false;
               
  }


  openMenuByName(name){
        let menu=this.shadowRoot.getElementById(name+'-menu');
        menu && menu.toggleMenu();
            
  }
  openMenu(e){
        this.openMenuByName(e.target.name);      
  }

  buildPage(e){
        if(NearUser.instance && NearUser.instance.canEdit()) {
                NearUser.instance.buildPage(window.location.pathname);
                console.log("buildPage");
        }
  }


  newContent(e){
        let el=new NearContent();
        el.editonly=true;
        el.editing=true;
        el.addEventListener('content-create', (e)=>{
                console.log(e);
                let content=e.detail;
                content.close();
                window.location.pathname=content.key;
        })
        document.body.appendChild(el);

  }

  newArticle(e){
        let el=new NearArticle();
        el.editonly=true;
        el.editing=true;
        el.addEventListener('content-create', (e)=>{
                console.log(e);
                let content=e.detail;
                content.close();
                window.location.pathname=content.key;
        })
        document.body.appendChild(el);

  }
  
  editMeta(e){
        let el=null;
        if(this.meta && this.meta.type=="article")
              el=new NearArticle();
        else      
              el=new NearContent();
        el.key=window.location.pathname;
        el.editonly=true;
        el.editing=true;
        el.addEventListener('content-edited', this.buildPage)
        document.body.appendChild(el);
  }

  invalidate(e) {
        if(NearUser.instance && NearUser.instance.canEdit()) {
                NearUser.instance.invalidate("/*");
        }
  }

  navigate(href) {
          NearRoute.navigate(href);
  }

}

window.customElements.define('near-app-base', NearApp);
