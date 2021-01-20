


export class NearLocation {

        constructor(listener=null, hashListener=null){
                //super();
                //this.path=window.decodeURIComponent(window.location.pathname);
                //this.query= window.location.search.slice(1);
                //this.hash= window.decodeURIComponent(window.location.hash.slice(1));
                if(NearLocation.instance) return;
                NearLocation.instance=this;
                this.dwell=2000;
                this.last=window.performance.now();
                this.listener=listener;
                this.hashListener=hashListener;
                window.addEventListener('hashchange',this.onHashChange.bind(this));
                window.addEventListener('popstate',this.onChange.bind(this));
                window.addEventListener('near-route',this.onChange.bind(this));
                this.onChange();
        }

        changed(){
                return(this.path != window.decodeURIComponent(window.location.pathname)
                        ||  this.query != window.location.search.substring(1)); 

        }

        onChange(){
                let changed=this.changed();
                //this.onHashChange();
                this.hash = window.decodeURIComponent(window.location.hash.substring(1));
                if(changed) {
                        this.path = window.decodeURIComponent(window.location.pathname);
                        console.log("onChange",this.path)
                        this.query = window.location.search.substring(1);
                        if(this.listener) this.listener(this); 
                }
        }


        onHashChange(){
                this.hash = window.decodeURIComponent(window.location.hash.substring(1));
                console.log("hash:",this.hash);
                if(this.hashListener) this.hashListener(this);
        }
 

};

NearLocation.instance=null;


export class NearRoute extends HTMLAnchorElement {
    constructor() {
        super()
        this.addEventListener('click', this.clickHandler.bind(this))
    }

    clickHandler(event) {
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    
        console.log("nearlink clicked",this);    
        event.preventDefault();
        window.history.pushState({}, null, this.href + window.location.search)
        window.dispatchEvent(new CustomEvent('near-route'))
    }
}

NearRoute.navigate=(href)=> {
        window.history.pushState({}, null, href)
        window.dispatchEvent(new CustomEvent('near-route'))   
}

customElements.define('near-route', NearRoute,{extends:'a'})