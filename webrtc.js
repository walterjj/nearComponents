'use strict';

import { LitElement, html, css} from 'lit-element';

const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
};

export class NearWebrtc extends LitElement {
        startButton=null;
        callButton=null;
        hangupButton=null;
        localVideo=null;
        remoteVideo=null;
        localStream=null;
        pc1=null;
        pc2=null;


        static get styles() {
                return css`
                button {
                        margin: 0 20px 0 0;
                        width: 83px;
                      }
                      
                      button#hangupButton {
                          margin: 0;
                      }
                      
                      video {
                        --width: 45%;
                        width: var(--width);
                        height: calc(var(--width) * 0.75);
                        margin: 0 0 20px 0;
                        vertical-align: top;
                      }
                      
                      video#localVideo {
                        margin: 0 20px 20px 0;
                      }
                      
                      div.box {
                        margin: 1em;
                      }
                      
                      @media screen and (max-width: 400px) {
                        button {
                          width: 83px;
                          margin: 0 11px 10px 0;
                        }
                      
                        video {
                          height: 90px;
                          margin: 0 0 10px 0;
                          width: calc(50% - 7px);
                        }
                        video#localVideo {
                          margin: 0 10px 20px 0;
                        }
                      
                      }
                `;
        }

        

        render(){
                return html`
                <video id="localVideo" playsinline autoplay muted></video>
                <video id="remoteVideo" playsinline autoplay></video>
            
                <div class="box">
                    <button @click="${this.start}" id="startButton">Start</button>
                    <button @click="${this.call}" id="callButton">Call</button>
                    <button @click="${this.hangup}" id="hangupButton">Hang Up</button>
                </div>
                `

        }
        constructor() {  
                super();      
        }

        updated(){
                this.startButton = this.shadowRoot.getElementById('startButton');
                this.callButton = this.shadowRoot.getElementById('callButton');
                this.hangupButton = this.shadowRoot.getElementById('hangupButton');
                this.callButton.disabled = true;
                this.hangupButton.disabled = true;
                
                this.localVideo = this.shadowRoot.getElementById('localVideo');
                this.remoteVideo = this.shadowRoot.getElementById('remoteVideo');

                this.localVideo.addEventListener('loadedmetadata', function() {
                        console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
                });

                this.remoteVideo.addEventListener('loadedmetadata', function() {
                        console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
                });

                this.remoteVideo.addEventListener('resize', () => {
                        console.log(`Remote video size changed to ${this.videoWidth}x${this.videoHeight}`);
                });
        }

        getName(pc) {
                return (pc === this.pc1) ? 'pc1' : 'pc2';
        }

        getOtherPc(pc) {
                return (pc === this.pc1) ? this.pc2 : this.pc1;
        }

        async  start() {
                console.log('Requesting local stream');
                this.startButton.disabled = true;
                try {
                        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
                        console.log('Received local stream');
                        this.localVideo.srcObject = stream;
                        this.localStream = stream;
                        this.callButton.disabled = false;
                } catch (e) {
                        alert(`getUserMedia() error: ${e.name}`);
                }
        }

        getSelectedSdpSemantics() {                
                return {};
        }

        call() {
                this.callButton.disabled = true;
                this.hangupButton.disabled = false;
                console.log('Starting call');
                const videoTracks = this.localStream.getVideoTracks();
                const audioTracks = this.localStream.getAudioTracks();
                if (videoTracks.length > 0) {
                        console.log(`Using video device: ${videoTracks[0].label}`);
                }
                if (audioTracks.length > 0) {
                        console.log(`Using audio device: ${audioTracks[0].label}`);
                }
                const configuration = this.getSelectedSdpSemantics();
                console.log('RTCPeerConnection configuration:', configuration);
                this.pc1 = new RTCPeerConnection(configuration);
                console.log('Created local peer connection object pc1');
                this.pc1.addEventListener('icecandidate', (e => this.onIceCandidate(this.pc1, e)).bind(this));
                this.pc2 = new RTCPeerConnection(configuration);
                console.log('Created remote peer connection object pc2');
                this.pc2.addEventListener('icecandidate', (e => this.onIceCandidate(this.pc2, e)).bind(this));
                this.pc1.addEventListener('iceconnectionstatechange', (e => this.onIceStateChange(this.pc1, e)).bind(this));
                this.pc2.addEventListener('iceconnectionstatechange', (e => this.onIceStateChange(this.pc2, e)).bind(this));
                this.pc2.addEventListener('track', this.gotRemoteStream.bind(this));

                this.localStream.getTracks().forEach(track => this.pc1.addTrack(track, this.localStream));
                console.log('Added local stream to pc1');

              
                console.log('pc1 createOffer start');
                this.pc1.createOffer(offerOptions)
                .then(offer => this.onCreateOfferSuccess(offer))
                .catch(e => this.onCreateSessionDescriptionError(e));
                
        }

        onCreateSessionDescriptionError(error) {
                console.log(`Failed to create session description: ${error.toString()}`);
        }

        async  onCreateOfferSuccess(desc) {
                //console.log(`Offer from pc1\n${desc.sdp}`);
                console.log('pc1 setLocalDescription start');
                try {
                        await this.pc1.setLocalDescription(desc);
                        this.onSetLocalSuccess(this.pc1);
                } catch (e) {
                        this.onSetSessionDescriptionError(e);
                }

                console.log('pc2 setRemoteDescription start');
                try {
                        await this.pc2.setRemoteDescription(desc);
                        this.onSetRemoteSuccess(this.pc2);
                } catch (e) {
                        this.onSetSessionDescriptionError(e);
                }

                console.log('pc2 createAnswer start');
                // Since the 'remote' side has no media stream we need
                // to pass in the right constraints in order for it to
                // accept the incoming offer of audio and video.
                try {
                        const answer = await this.pc2.createAnswer();
                        await this.onCreateAnswerSuccess(answer);
                } catch (e) {
                        this.onCreateSessionDescriptionError(e);
                }
        }

        onSetLocalSuccess(pc) {
                console.log(`${this.getName(pc)} setLocalDescription complete`);
        }

        onSetRemoteSuccess(pc) {
                console.log(`${this.getName(pc)} setRemoteDescription complete`);
        }

        onSetSessionDescriptionError(error) {
                console.log(`Failed to set session description: ${error.toString()}`);
        }

        gotRemoteStream(e) {
                if (this.remoteVideo.srcObject !== e.streams[0]) {
                        this.remoteVideo.srcObject = e.streams[0];
                        console.log('pc2 received remote stream');
                }
        }

        async  onCreateAnswerSuccess(desc) {
                //console.log(`Answer from pc2:\n${desc.sdp}`);á
                console.log('pc2 setLocalDescription start');
                try {
                        await this.pc2.setLocalDescription(desc);
                        this.onSetLocalSuccess(this.pc2);
                } catch (e) {
                        this.onSetSessionDescriptionError(e);
                }
                console.log('pc1 setRemoteDescription start');
                try {
                        await this.pc1.setRemoteDescription(desc);
                        this.onSetRemoteSuccess(this.pc1);
                } catch (e) {
                        this.onSetSessionDescriptionError(e);
                }
        }

        async  onIceCandidate(pc, event) {
                console.log("ON ICE CANDIDATE", pc, event)
                try {
                        await (this.getOtherPc(pc).addIceCandidate(event.candidate));
                        this.onAddIceCandidateSuccess(pc);
                } catch (e) {
                        this.onAddIceCandidateError(pc, e);
                }
                console.log(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
        }

        onAddIceCandidateSuccess(pc) {
                console.log(`${this.getName(pc)} addIceCandidate success`);
        }

        onAddIceCandidateError(pc, error) {
                console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
        }

        onIceStateChange(pc, event) {
                if (pc) {
                        console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
                        console.log('ICE state change event: ', event);
                }
        }

        hangup() {
                console.log('Ending call');
                this.pc1.close();
                this.pc2.close();
                this.pc1 = null;
                this.pc2 = null;
                this.hangupButton.disabled = true;
                this.callButton.disabled = false;
        }

}

window.customElements.define('near-webrtc', NearWebrtc);