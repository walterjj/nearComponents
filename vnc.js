'use strict';
import { LitElement, html, css } from 'lit-element';
import RFB from '@novnc/novnc/core/rfb.js';



function connectedToServer(e) {
        console.log("Connected to ",e);
    }

    // This function is called when we are disconnected
    function disconnectedFromServer(e) {
        if (e.detail.clean) {
            console.log("Disconnected",e);
        } else {
            console.log("Something went wrong, connection is closed",e);
        }
    }

 

    // When this function is called we have received
    // a desktop name from the server
    function updateDesktopName(e) {
        console.log("Desktop name is",e);
        //desktopName = e.detail.name;
    }


export class NearVNC extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        max-width:100vw;
        max-height:100vh; 
        background-color: #ccc;
      }
    `;
  }
  constructor() {
        super();
        this.rfb = null;
        this.connected = false;
  }

   // When this function is called, the server requires
    // credentials to authenticate
  credentialsAreRequired(e) {
      console.log("Credentials are required",e);
      const password = prompt("Password Required:");
      this.rfb.sendCredentials({ password: password });
  }

  connect( channel , user=null , password=null ) {
        console.log("init",channel,user,password);
        this.channel=channel;
        let options={ 
          credentials:{}, 
          shared:true,
          scaleViewport:true,
          resizeSession:true,
          background:"transparent"

        };
        if(user) options.credentials.user=user;
        else if(this.getAttribute("user")) options.credentials.user=this.getAttribute("user");
        if(password) options.credentials.password=password;
        else if(this.getAttribute("password")) options.credentials.password=this.getAttribute("password");
        
        this.rfb = new RFB(this, channel, options);
        this.rfb.addEventListener("connect",  connectedToServer);
        this.rfb.addEventListener("disconnect", disconnectedFromServer);
        this.rfb.addEventListener("credentialsrequired", this.credentialsAreRequired.bind(this));
        this.rfb.addEventListener("desktopname", updateDesktopName);
        this.rfb.addEventListener("serververification", e=>console.log("serververification",e));
        this.rfb.addEventListener("securityfailed", e=>console.log("securityfailed",e));
        this.rfb.addEventListener("capabilities", e=>console.log("capabilities",e));


        //this.rfb.connect();
        this.connected=true;
        this.dispatchEvent(new CustomEvent('connected', { detail: {connected:true} }));
  }
  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define('near-vnc',NearVNC);
