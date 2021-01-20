import {LitElement, html, css } from 'lit-element'


export class NearCamera extends  LitElement{  //HTMLVideoElement(){

        constructor(){
                super();
                this.constraints = {
                        audio: false,
                        video: true
                      };
        }

        render(){
                return(
                        html`<video playsinline autoplay></video>
                        <button @click="${this.snapShot}">Take snapshot</button>
                        <canvas></canvas>`
                )                
        }

        firstUpdated(){
                const video = this.shadowRoot.querySelector('video');
                const canvas = this.shadowRoot.querySelector('canvas');
                canvas.width = 480;
                canvas.height = 360;
                const button = document.querySelector('button');
                navigator.mediaDevices.getUserMedia(this.constraints)
                        .then(stream=> video.srcObject = stream)
                        .catch(error=> console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name));

        }
              
        snapShot(e){
                const video = this.shadowRoot.querySelector('video');
                const canvas = this.shadowRoot.querySelector('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        }

}


customElements.define('near-camera', NearCamera ); // { extends: "video" });
