'use strict';

import {LitElement, html, css} from "lit-element";
import {NearUser} from "./user";
//import * as MQTT from '/mqtt.min.js'

let isLoaded=false;
async function initMqtt() {
        if(!isLoaded)
                await import('./mqtt.min.js')
       isLoaded=true;         
}

export class NearMqtt extends LitElement {
        static get properties() {
                return {
                  connected: { type: Boolean, reflect: true }
                };
        }

        static get styles(){
                return css`
                :host{  width:10px;
                        height:10px;
                        clip-path: circle(50% at center);
                        background-color:#cccc; 
                }
                :host([connected]) {
                        background-color:#0f7;
                }
                 `
        }

        render(){
                return html`<span class="${this.connected? 'connected':''}">&nbsp;</span>`;

        }


        constructor(){
                super();
                this.client=null;
                this.connected=false;
        }
        
        onMessage(topic,msg,packet){
                console.log("recv:",topic,String(msg));

        }

        subscribe(topic, f){
                this.client.subscribe(topic, function (err) {
                        if (!err) {
                          //this.client.publish('presence', 'Hello mqtt')
                        }
                        else console.log("suscribe error");
                      })
        }


        publish(topic, msg){
                this.client.publish(topic, msg);
        }

        connect(){
                initMqtt();
                return new Promise((resolve)=>{
                        NearUser.instance.getApi("ioturl").then((data)=>{
                                console.log(data.url);  
                                this.client=mqtt.connect(data.url,{clientId:"nearuser"});
                                console.log(this);
                                this.client.on('connect', function () {
                                      console.log('connect');
                                      this.connected=true;
                                      this.setAttribute("connected","");        
                                }.bind(this))
                                this.client.on('disconnect', function () {
                                        console.log('disconnect');
                                        this.connected=false;        
                                }.bind(this))
                                this.client.on('close', function () {
                                        console.log('close');
                                        this.connected=false;        
                                }.bind(this))
                                this.client.on('offline', function () {
                                        console.log('offline');
                                        this.connected=false;        
                                }.bind(this))
                                this.client.on('error', function (error) {
                                        console.log('error',error);     
                                }.bind(this))
                                    
                                this.client.on('message',this.onMessage);
                                resolve();
                          })
                })                
        }

        end(){
                this.client.end();
        }
}


customElements.define("near-mqtt",NearMqtt);