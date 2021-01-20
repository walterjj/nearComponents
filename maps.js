
import {LitElement,html,css} from 'lit-element';
import OpenLocationCode from './open-location-code.js';
import {NearDialog} from "./dialog";
import {Button} from '@material/mwc-button'
//import {mapbox_css} from './mapbox_css';
import {NearUser} from "./user";

let accessToken=null;

export class NearMap extends LitElement {

        static get properties() {
                return {
                  center: { type: Object, reflect: true , default:{lng:0,lat:0} },
                  zoom: {type: Number,  reflect: true , default:15},
                  persist: {type: String,  reflect: true}
                };
        }

        static get styles(){
                return css`
                :host{
                        max-width:100%;
                        display:block;
                        position:relative;
                        
                        
                }
                #map{   
                        width:100%;
                        height:100%;
                        nmin-width:400px;
                        nmin-height:300px;
                        margin-bottom:2em;
                }
                #map a{font-size:small}
                #canvas{
                        position:absolute;
                        left:0;top:0;
                        width:100%;height:100%;
                        z-index:1000;
                        pointer-events: none;
                }

                #lnglat,#aux{font-size:small;color:#8888}
                .mapboxgl-ctrl-top-right{position:absolute;top:0;right:0}
                `
        }

        constructor(){
                super();
                this.center=null; //{lng:0,lat:0}
                this.persist=null;
                this.zoom=15;
                this.map=null;
                //this.addEventListener("drag",(e)=>e.stopPropagation())
                this.globalInit();
                
        }

        render(){
                return html`
                <div id="map"></div>
                <canvas id="canvas" width = "300" height = "300"></canvas>
                <div id="lnglat">lng:<span id="lng">${this.map && this.map.center && this.map.center.lng}</span><br> 
                lat:<span id="lat">${this.map && this.map.center && this.map.center.lat} </span><br> 
                <span id="geohash">${this.map && this.map.center && OpenLocationCode.encode(this.map.center.lat,this.map.center.lng,10)}</span></div>
                <div id="aux"></div>
                
                `
        }

    

        attributeChangedCallback(name,oldValue,newValue){
                console.log(name+" changed", newValue)
                super.attributeChangedCallback(name, oldValue,newValue);
                if(name=='center' && this.map) {
                        console.log("CENTER ATTR", newValue)
                        this.map.setCenter(typeof newValue==="object" ? newValue : JSON.parse(newValue));
                        this.centerHandler();
                        //this.marker.setLngLat(this.center); 

                }
                if(name=='persist') {
                        //this.loadData();
                        
                }
                        
        }

        getCenter() {
                return this.map? this.map.getCenter() : this.center;
        }

        async globalInit(){
                await this.ensureToken();
                if(typeof(mapboxgl)==='undefined'){
                        let link=document.createElement("link");
                        link.href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css';
                        link.rel='stylesheet';
                        document.head.appendChild(link);
                        let script = document.createElement("script");
                        script.src='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js';
                        script.addEventListener("load",this.initMap.bind(this));
                        document.head.appendChild(script);
                }
                
        }

        centerHandler(){
                let center=this.map.getCenter();
                this.shadowRoot.getElementById("lng").innerHTML=center.lng;
                this.shadowRoot.getElementById("lat").innerHTML=center.lat;
                if(center.lng && center.lat) 
                        this.shadowRoot.getElementById("geohash").innerHTML=OpenLocationCode.encode(center.lat,center.lng,10);
                //this.shadowRoot.getElementById("aux").innerHTML=`<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}">Google Maps</a>`;
        }

        async ensureToken(){
                if(!accessToken){
                        let o=await NearUser.getApi("/mapbox");
                        console.log("ensureToken",o);
                        if(o && o.token)
                                accessToken=o.token;
                        else return false;
                }
                return true;
        }

        initMap(){
                if(typeof(mapboxgl)==='undefined')
                        return;
                mapboxgl.accessToken=accessToken;
                let container=this.shadowRoot.getElementById("map");
                let params={
                        container: container,
                        style: 'mapbox://styles/mapbox/streets-v11',
                        zoom: this.zoom,
                        preserveDrawingBuffer:true
                      }
                console.log("THIS CENTER", this.center)
                if(this.center)  params.center=typeof (this.center) === "object" ? this.center : JSON.parse(this.center);     
                this.map = new mapboxgl.Map(params);
                this.map.on("drag",this.centerHandler.bind(this));
                let nearmap=this;
                class MapControl {
                        onAdd(map) {
                            this._map = map;
                            this._container = document.createElement('mwc-button');
                            this._container.className = 'mapboxgl-ctrl';
                            this._container.textContent = 'geolocation';
                            this._container.addEventListener("click",nearmap.geolocation.bind(nearmap));
                            return this._container;
                        }
                    
                        onRemove() {
                            this._container.parentNode.removeChild(this._container);
                            this._map = undefined;
                        }
                    }

                this.map.addControl(new MapControl,"top-right");
                
                this.centerHandler();

                let c = this.shadowRoot.getElementById("canvas");
                var ctx = c.getContext("2d");
                ctx.beginPath();
                ctx.strokeStyle = "#FF0000";
                ctx.lineWidth = 2;
                //ctx.arc(container.clientWidth/2, container.clientHeight/2, 5, 0, 2 * Math.PI);
                ctx.arc(150, 150, 4, 0, 2 * Math.PI);
                ctx.stroke();
                /*this.marker = new mapboxgl.Marker({draggable: true})
                        .setLngLat(this.center)
                .addTo(this.map);*/
        }

        firstUpdated(){
                console.log("map firstUpdated ",this.center || "no center");
                super.firstUpdated();
                this.initMap();
                if (!this.center )
                        this.geolocation(); 
                
                
        }

        geolocation(){
                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(position=>{
                              this.center={ 
                                      lng: Number(position.coords.longitude),
                                      lat: Number(position.coords.latitude),
                              } ;
                              console.log("pos",position);
                        },(e)=>console.log(e),{enableHighAccuracy:true});
                }
        }

        getMapImage(){
                return this.map.getCanvas().toDataURL();
        }

        loadData(){
                if (localStorage) {
			this.center=JSON.parse(localStorage.getItem(this.persist)) || null;
                }
        }
  
        saveData(){
                let center=this.getCenter();
                center.hash=OpenLocationCode.encode(center.lat,center.lng,10);
                if (localStorage) 
                        localStorage.setItem(this.persist, JSON.stringify(center));   
        }



}

window.customElements.define("near-map",NearMap);


export class NearMapDialog extends NearDialog {

        static get properties() {
                return {
                  persist: {type: String,  reflect: true}
                };
        }

        static get styles() {
                return [super.styles,css`
                        near-map{width:300px; height:300px;}
                        }
                `];
        }

        constructor(){
                super();
                this.title="dialog";
                this.addEventListener("keydown",this.handleKeydown);
                
                
        }

        fields(){
                return html`
                <slot></slot>
                <label>
                <near-map id="nearmap"
                ></near-map>         
                </label>`   
        }

        firstUpdated(){
                super.firstUpdated();
                if(this.persist) {
                        let map=this.shadowRoot.getElementById("nearmap");
                        map.persist=this.persist;
                }
                
        }

        do(e){  let map=this.shadowRoot.getElementById("nearmap");
                this.center=map.getCenter();
                if(this.persist)
                        map.saveData();

                super.do(e);
        }

}
window.customElements.define("near-map-dialog",NearMapDialog);
