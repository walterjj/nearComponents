export class NearLocation {

        constructor(listener=null, hashListener=null){
                if(NearLocation.instance) {
                        if (listener) NearLocation.instance.listener = listener;
                        if (hashListener) NearLocation.instance.hashListener = hashListener;
                        return NearLocation.instance;
                }
                this.dwell=2000;
                this.last=window.performance.now();
                this.listener=listener;
                this.hashListener=hashListener;
                this.boundOnHashChange=this.onHashChange.bind(this);
                this.boundOnChange=this.onChange.bind(this);
                NearLocation.instance=this;
                window.addEventListener('hashchange',this.boundOnHashChange);
                window.addEventListener('popstate',this.boundOnChange);
                window.addEventListener('near-route',this.boundOnChange);
                this.onChange();
        }

        readPath(){
                return window.decodeURIComponent(window.location.pathname);
        }

        readQuery(){
                return window.location.search.substring(1);
        }

        readHash(){
                return window.decodeURIComponent(window.location.hash.substring(1));
        }

        changed(){
                return(this.path != this.readPath()
                        ||  this.query != this.readQuery());

        }

        hashChanged(){
                return(this.hash != this.readHash());
        }

        onChange(){
                let changed=this.changed();
                if(changed) {
                        this.path = this.readPath();
                        this.query = this.readQuery();
                        if(this.listener) this.listener(this); 
                }
                else this.onHashChange();
        }


        onHashChange(){
                const changed = this.hashChanged();
                this.hash = this.readHash();
                if(changed && this.hashListener) this.hashListener(this);
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
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (this.target && this.target !== '_self') return;
        if (this.hasAttribute('download')) return;

        const url = new URL(this.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        event.preventDefault();
        NearRoute.navigate(`${url.pathname}${url.search}${url.hash}`);
    }
}

NearRoute.navigate=(href)=> {
        if (!href) return;
        const target = new URL(href, window.location.href);
        const nextHref = `${target.pathname}${target.search}${target.hash}`;
        const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (nextHref === currentHref) {
                window.dispatchEvent(new CustomEvent('near-route'));
                return;
        }
        window.history.pushState({}, null, nextHref)
        window.dispatchEvent(new CustomEvent('near-route'))   
}

try {
        customElements.define('near-route', NearRoute,{extends:'a'})
} catch (error) {
        // ignore duplicate registrations during local reloads
}
