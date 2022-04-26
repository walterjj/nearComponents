'use strict';

import {LitElement, html, css} from "lit-element";
import {NearUser} from "./user";
//import * as MQTT from './mqtt.min.js';
import * as MQTT from 'mqtt/dist/mqtt.min.js';


let isLoaded=false;
async function initMqtt() {
        if(!isLoaded)
        {        await import('./mqtt.min.js');
                 console.log("mqtt loaded", JSON.stringify(mqtt));
        }
       isLoaded=true;         
}

export class NearMqtt extends LitElement {
        static get properties() {
                return {
                  connected: { type: Boolean, reflect: true },
                  endpoint: { type: String }
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
                this.dispatchEvent(new CustomEvent('message', { detail: {topic:topic,msg:msg} }));

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

        setupEvents(){
                this.client.on('connect', function () {
                        console.log('connect');
                        this.connected=true;
                        this.setAttribute("connected","");
                        this.dispatchEvent(new CustomEvent('connect'));
                             
                }.bind(this))
                this.client.on('disconnect', function () {
                          console.log('disconnect');
                          this.connected=false;
                          this.dispatchEvent(new CustomEvent('disconnect'));        
                }.bind(this))
                this.client.on('close', function () {
                          console.log('close');
                          this.connected=false;
                          this.dispatchEvent(new CustomEvent('close'));        
                }.bind(this))
                this.client.on('offline', function () {
                          console.log('offline');
                          this.connected=false;
                          this.dispatchEvent(new CustomEvent('offline'));        
                }.bind(this))
                this.client.on('error', function (error) {
                          console.log('error',error);     
                }.bind(this))
                      
                this.client.on('message',this.onMessage.bind(this));

        }

        connect(options=null){
                //initMqtt();
                if(!options) options={
                        reconnectPeriod: 10000,
                        clientId: 'nearuser_' + Math.random().toString(16).substr(2, 8)
                };
                console.log("connecting to",this.endpoint,options);               
                if(this.endpoint) {
                        return new Promise((resolve,reject)=>{
                                this.client=window.mqtt.connect(this.endpoint,options);
                                this.setupEvents();
                                resolve();
                        });
                };
                return new Promise((resolve)=>{
                        NearUser.instance.getApi("ioturl").then((data)=>{
                                console.log(data.url);  
                                this.client=window.mqtt.connect(data.url,options);
                                console.log(this);
                                this.setupEvents();
                                resolve();
                          })
                })                
        }

        end(){
                this.client.end();
        }
}


customElements.define("near-mqtt",NearMqtt);