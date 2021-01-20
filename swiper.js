import {LitElement, html, css } from 'lit-element'
import {Icon} from "@material/mwc-icon"
import {Formfield} from '@material/mwc-formfield'
import {Button} from '@material/mwc-button'
import {NearUser} from "./user";
import {NearResources} from "./resources";
import {urlize} from "./urlize";
import {styles} from "./styles";

//adapted from https://css-tricks.com/simple-swipe-with-vanilla-javascript/

export class NearSwiper extends LitElement {

        constructor() {
                super();
                this.current=0;
                this.addEventListener('mousedown', this.lock, false);
                this.addEventListener('touchstart', this.lock, false);
                this.addEventListener('mouseup', this.move, false);
                this.addEventListener('touchend', this.move, false);
                this.addEventListener('touchmove', e => {e.preventDefault()}, false);
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
                                console.log("setTimer",newval)
                                this.timer=window.setInterval(this.onTime.bind(this),newval);
                        }        
                };
        }

        static get properties(){
                return {
                        time:{type: Number, reflect:true}
                }
        }

        static get styles() {
                return css`
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
                return html`
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
                console.log("onTime")
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
                        let dx = this.unify(e).clientX - this.x0, s = Math.sign(dx);
                        if(dx<-10) this.next();
                        else if(dx>10) this.prev();
                        //console.log(dx);
                            
                        this.x0 = null
                      }
        };
        
        drag(e) {
                e.preventDefault();              
                if(this.x0 || this.x0 === 0)  
                  this.getSlot().style.setProperty('--tx', `${Math.round(this.unify(e).clientX - this.x0)}px`)
              };

        unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

}

customElements.define("near-swiper",NearSwiper);

