'use strict';

import { LitElement, html, css} from 'lit-element';

import {NearMqtt} from "./pubsub.js";

let signaling= null;

export class Signaling extends NearMqtt {
	
	sessionId = '';
	listeners = [];
	timerId = 0;

	constructor() {
		super();
		Signaling.instance = this;
		signaling = this;
	}

	send(to, command, data = {}, action = '') {
		return new Promise((resolve, reject) => {

			let message = {
				'command': command,
				//'message': json,
				'sessionID': this.sessionId,
				'to': to,
				'from': this.clientId
			}
			Object.assign(message, data);

			console.log("send:", command, message)			
			this.publish(`sessions/${this.sessionId}/${to}`,JSON.stringify(message),null,()=>{resolve()});
		});
	};


	on(command, callback, from = null) {
		this.listeners.push({ command: command, callback: callback, from: from });
	}

	removeListeners(command,  from) {
		this.listeners = this.listeners.filter(function (listener) {
			return listener.command != command || listener.from != from;
		});
	}

	resetListeners(){
		this.listeners = [];
	}

	updateListeners(fromOld, fromNew) {
		this.listeners = this.listeners.map(function (listener) {
			if (listener.from == fromOld) {
				listener.from = fromNew;
			}
			return listener;
		});
	}


	setupEvents(){
		//super.setupEvents();
		this.client.on('connect', function (connack) {
                        console.log('connect ', this.sessionId, '/',this.clientId);
                        this.connected=true;
			if(!connack.sessionPresent){
				this.subscribe(`sessions/${this.sessionId}/${this.clientId}`);
				this.subscribe(`sessions/${this.sessionId}/all`);
				this.subscribe(`sessions/${this.sessionId}/backend`);
			}
			this.listeners.forEach(listener => {
				if (listener.command=="connect")
					listener.callback(connack);
				
			});
			this.dispatchEvent(new CustomEvent('connect'));
			
                }.bind(this));
		this.client.on('reconnect', function () {
                        console.log('reconnect');
                        //this.connected=false;
                        this.dispatchEvent(new CustomEvent('reconnect'));        
                }.bind(this))
                this.client.on('disconnect', function () {
                          console.log('disconnect');
                          this.connected=false;
			  this.listeners.forEach(listener => {
				if (listener.command=="disconnect")
					listener.callback({});
				
			  });
                          this.dispatchEvent(new CustomEvent('disconnect'));        
                }.bind(this))
                this.client.on('close', function () {
                          console.log('close');
                          this.connected=false;
			  this.listeners.forEach(listener => {
				if (listener.command=="close")
					listener.callback({});
				
			  });
                          this.dispatchEvent(new CustomEvent('close'));        
                }.bind(this))
                this.client.on('offline', function () {
                          console.log('offline');
                          //this.connected=false;
                          this.dispatchEvent(new CustomEvent('offline'));        
                }.bind(this))
                this.client.on('error', function (error) {
                          console.log('error',error);     
                }.bind(this))
		this.client.on('message',this.onMessage.bind(this));
	}

	onMessage(topic,msg,packet){
                //console.log("recv:",topic,msg);
		let data = JSON.parse(msg);
		let command=data.command || '';
		if(data.from && data.from==this.clientId)
			return;
		console.log('Received:',topic, data);	
		this.listeners.forEach(listener => {
			if (command==listener.command &&
				(!listener.from || 
					(data.from
					&& listener.from==data.from
					)
				)) {
				listener.callback(data);
			}
		});
                super.onMessage(topic,msg,packet);
        }

	/*connect(sessionID, options){
		this.sessionId = sessionID	
		console.log('Connecting to MQTT');
                // validar clientId.
		return super.connect(options);
	}*/

	connect(sessionId, options=null){
		this.sessionId = sessionId
		if(!options) options={
                        reconnectPeriod: 10000,
			keepAlive: 15,
                        clientId : 'nearuser_' + Math.random().toString(16).substr(2, 8)
                };
		options.reconnectPeriod= options.reconnectPeriod || 10000;
		options.keepAlive= options.keepAlive || 15;
                this.clientId=options.clientId;	
		options.will={
			topic:`sessions/${sessionId}/all`,
			payload:`{
				"command":"peerDisconnected",
				"from":"${this.clientId}"
			}`,
			qos:0,
			retain:false
		}
		console.log('Connecting to MQTT Signaling');
		return super.connect(options);
	}


	disconnect(callback=null){
		console.log('Disconnect')
		/*if (timerId) {  
			clearTimeout(timerId);
			timerId = 0;  
		} */ 
		this.end(null,null,callback);
	}

	keepAlive() { 
		var timeout = 20000;  
		timerId = setTimeout(keepAlive, timeout);  
	}  
	
}

Signaling.instance=null;
Signaling.getInstance= () => {
	return( Signaling.instance || (Signaling.instance=new Signaling())) 
}

customElements.define("near-signaling",Signaling);

//----------------------------------------------------------
// PeerConnection




let iceServers=[
	{ urls: [
		"stun:stun.l.google.com:19302",
		"stun:stun1.l.google.com:19302",
		"stun:stun2.l.google.com:19302",
		"stun:stun3.l.google.com:19302"
		]
	}
]

class PeerConnection{ 
        
        constructor(peerId, meet, stream=null, mediaConstraints={ offerToReceiveAudio: true, offerToReceiveVideo: true }) {
		//super();
                this.peer = null;
                this.meet = meet;
                this.peerConfig = {
                        //iceTransportPolicy: "relay",
			sdpSemantics: 'unified-plan',
                        bundlePolicy: 'max-bundle',
                        iceServers: iceServers || []
                };
                this.pcOptions =  { "optional": [{ "DtlsSrtpKeyAgreement": true }] };
                this.mediaConstraints = mediaConstraints ;
                this.earlyCandidates = [];
                this.mainChannel = null
                this.audioChannel = null
                this.peerId = peerId
                this.stream=stream
                this.makingOffer = false;
	        this.ignoreOffer = false;
	        this.isSettingRemoteAnswerPending = false;
	        this.deferNegotiation = false;
		this.setPeerId(peerId);
		this.polite = false;

        }

        emit(name, object) {
                this.meet.emit(name,object,this);
        }

	setPeerId(id) {
                if(id!=this.peerId){
			this.peer=null;
			this.peerId = id			
		}
		this.checkPeer();
	}

	checkPeer(){
		if(this.peer && this.peer.connectionState=='closed'){
			this.peer=null;
		}
                if(!this.peer){
			this.deferNegotiation=true;
                        this.createPeerConnection();
                }
	}

        
        getPeerId() {
                return this.peerId;
        }

	setPeerType(type){
		this.peerType = type	
	}

	setStream(s){
		this.stream = s
	}

	addIceServers(iceServers) {
		this.peerConfig.iceServers = this.peerConfig.iceServers.concat(iceServers);
	}

	async connect(stream=null){
		if (stream) this.stream=stream;
		this.deferNegotiation = true;
		this.polite=true;
		this.makeOffer();
		//this.createOffer();
	}


	close(){
		if (this.peer && this.peer.connectionState != 'closed') {
			this.peer.close();

		}	 
	}
	

	async disconnect1(){
		if (this.peer) {
			this.close();
			try {
				await signaling.send("all", "peerDisconnected", {
					peerid: this.peerId
				})
				//peer.close();
			} catch (e) {
				console.error("Failure close peer connection:" + e);
			} finally {
				//peer = null;
			}
		}
	}

        async disconnect() {
		if (this.peer) {
			this.closing=true;
			this.peer.close();
			return new Promise((resolve, reject) => {
				let time=Date.now();
				while(Date.now()-time<1000){					
					let state = this.getConnectionState();
					console.log('connection state:', state);
					if(state=='closed'){
						this.emit("iceconnectionstatechange", {  status:"closed"});
						this.emit("connectionstatechange", {  status:"closed"});
						this.emit("signalingstatechange", { status:"closed"});
						this.emit("hangup",{ status:"disconnected"});
						//peer=null;
						this.closing=false;
						resolve(true);
						this.emit(
							"collisionstatechange",
							{"status": ""});
						return;
					}
					this.emit("iceconnectionstatechange", {status:"aborted"});
					this.emit("connectionstatechange", {status:"aborted"});
					this.emit("signalingstatechange", {status:"aborted"});
					this.emit("hangup", {status:"disconnected"});
				};
				this.closing=false;
				//peer=null;
				resolve(true);
			})
		}
		return Promise.resolve(true);
	}

	getConnectionState(){
		if (this.peer)
			return this.peer.iceConnectionState;
		else
			return "uninitialized"
	}

	setTracks(){
		let transceivers=this.peer.getTransceivers();
		let size = transceivers.length;
		console.log("setTracks transceivers:",transceivers,size);
		if(this.stream){
			this.stream.getTracks().forEach(track => {
				let transceiver=transceivers.find(t=>(t.sender.track==null || t.sender.track.kind==track.kind));
				if(transceiver)
					transceiver.sender.replaceTrack(track);
				else
					transceiver=this.peer.addTransceiver(track);
				transceiver.direction = 'sendrecv';				
			});
		}
	}
	
	async makeOffer(){
		try {
			this.makingOffer = true;
			this.earlyCandidates.length = 0;
			this.setTracks();
			await this.peer.setLocalDescription();
			//signaling.send({description: peer.localDescription});
			signaling.send(this.peerId, 'signaling', { 
				description: this.peer.localDescription.toJSON(),
			});
			this.emit(
                                "collisionstatechange",
				{       "status": "offer sent -->"
                                });
		} catch (err) {
			console.error(err);
		} finally {
			this.makingOffer = false;
			this.deferNegotiation = false;
		}

	}

	// https://www.rfc-editor.org/rfc/rfc8838#name-pairing-newly-gathered-loca
	// https://developer.mozilla.org/es/docs/Web/API/RTCPeerConnection
        async onSignaling ({ description, candidate }){
		this.checkPeer();
                this.deferNegotiation = false;
                try {
                        if (description) {
                                const offerCollision = (description.type == "offer") &&
                                                (this.makingOffer || this.peer.signalingState != "stable");

                                this.ignoreOffer = !this.polite && offerCollision;
                                if (this.ignoreOffer) {
                                        this.emit(
                                                "collisionstatechange",
                                                {       "status": "--> offer ignored"
                                                });
                                        
                                        return;
                                }
                                if(offerCollision ){

                                }
                                await this.peer.setRemoteDescription(description);
                                console.log("Remote description set:", description.type, " transceivers:", this.peer.getTransceivers().length);
                                if(this.earlyCandidates.length > 0){
                                        for (let candidate of this.earlyCandidates) {
                                                try{
                                                        this.peer.addIceCandidate(candidate);
                                                }catch(e){
                                                        console.error("addIceCandidate error: " + e);
                                                }
                                        }
                                        this.earlyCandidates.length = 0
                                }
                                let eventMsg = "--> " + description.type + " accepted"
                                if (description.type == "offer") {
                                        this.deferNegotiation = true;
					
                                        await this.peer.setLocalDescription();
					this.setTracks();
                                        signaling.send(this.peerId, 'signaling', {description:this.peer.localDescription.toJSON()});
                                        this.deferNegotiation = false;
                                        eventMsg+=", answer sent -->";
                                }
                                this.emit(
                                        "collisionstatechange",
                                        { "status": eventMsg
                                        });
                        } else if(candidate) {
                                try {
                                        if (this.peer.remoteDescription) {
                                                await this.peer.addIceCandidate(candidate)
                                        } else {
                                                this.earlyCandidates.push(candidate);
                                        }
                                } catch (err) {
                                        console.error("addIceCandidate error: ", err);
                                        //if (!ignoreOffer) throw err; // Suppress ignored offer's candidates
                                }
                        }
                } catch(err) {
                        console.error(err);
                }
	}

	

        async onNegotiationNeeded(){
                if(!this.deferNegotiation){
                        this.makeOffer();
                }

        }

        onSignalingStateChange(evt){
                console.log("signaling state change: " + this.peer.signalingState);
                this.emit("signalingstatechange",{"status": this.peer.signalingState});
		this.meet.onSignalingStateChange(this,this.peer.signalingState);
		if(this.peer.signalingState=="closed") this.peer=null;

        }

        onConnectionStateChange(evt){
                if(!this.peer) return;
                console.log("connection state change: " + this.peer.connectionState);
                if(!this.closing) {
                        if (this.peer.connectionState === "failed") {
                                this.disconnect();
                        }
                }
                
                this.emit("connectionstatechange",
                        {       "status":this.peer.connectionState,
                                "peerId": this.peerId
                        });
                if(this.peer.connectionState=="closed"){
                        signaling.send(this.peerId, "peerDisconnected", {
                                peerid: this.peerId
                        })
                        console.log ("peer.iceConnectionState",this.peer.iceConnectionState);
                        this.emit("peerDisconnected",{"status": "disconnected"});
                        
                }
        }

        onIceGatheringStateChange(evt){
                console.log("ice gathering state change: " + this.peer.iceGatheringState);
                switch(this.peer.iceGatheringState) {
                        case "new":
                                this.earlyCandidates.length = 0;
                          break;
                        case "gathering":
                          /* collection of candidates has begun */
                          break;
                        case "complete":
                          /* collection of candidates is finished */
                          break;
                }

        }

        createPeerConnection(){
		console.log("createPeerConnection config: " + JSON.stringify(this.peerConfig) + " option: " + JSON.stringify(this.pcOptions));
		if(this.peer) this.peer=null;
                this.peer = new RTCPeerConnection(this.peerConfig);
		// clear early candidates
		this.earlyCandidates.length = 0;

		this.peer.onicecandidate = ({candidate}) => signaling.send(this.peerId, 'signaling', { candidate });
		this.peer.ontrack =  this.onTrack.bind(this); 
		this.peer.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
                this.peer.onnegotiationneeded = this.onNegotiationNeeded.bind(this);
		this.peer.ondatachannel = this.onDataChannel.bind(this); 
                this.peer.onsignalingstatechange = this.onSignalingStateChange.bind(this);
                this.peer.onconnectionstatechange = this.onConnectionStateChange.bind(this);
                this.peer.onicegatheringstatechange = this.onIceGatheringStateChange.bind(this);

		//this.peer.onconnectionstatechange = (event,state) => { console.log("connection state:",event,state) };
                this.mainChannel=this.createDataChannel("MainDataChannel",{negotiated:true,id:10});
		this.proxyDataChannel=this.createDataChannel("ProxyDataChannel",{negotiated:true,id:11});


		console.log("Created RTCPeerConnnection with config: " + JSON.stringify(this.peerConfig) + "option:" + JSON.stringify(this.pcOptions));
		return this.peer;
	}

	createDataChannel(label, options=null){
		try {
			let dataChannel = this.peer.createDataChannel(label,options);
			dataChannel.onopen = (evt => this.emit(label, evt,this)).bind(this);
                	dataChannel.onmessage = (evt => this.emit(label, evt, this)).bind(this);	
			return dataChannel;
		} catch (e) {
			console.error("Cannot create datachannel error: " + e);
			return null;
		}
	}

        async onIceConnectionStateChange(evt){
		//this.meet.onIceConnectionStateChange(evt, this.peerId);
                if (this.peer.iceConnectionState === "failed") {
                        this.peer.restartIce();
                }
		/*
			if(data.connectionState=="complete"){
				for(let receiver of data.peer.getReceivers()){
					this.setTrack(receiver.track,data.peerId);
				}
			}
			
			//this.setTrack(event.track, peerId);
		*/
                this.meet.onIceConnectionStateChange(evt.type,{
                        connectionState: (this.peer && this.peer.iceConnectionState) || "disconnected",
			peerId: this.peerId,
			peer: this.peer || null,
                        peerConnection: this
                });
        }

        async  onTrack(evt){
                this.meet.onTrack(evt, this.peerId);
        }

        async onDataChannel(evt) {
                const channelName = evt.channel.label
                console.log("Remote datachannel created:");
		this[channelName[0].toLowerCase()+channelName.slice(1)] = evt.channel;
		if (channelName === "MainDataChannel")
                        this.mainChannel = evt.channel
                else if (channelName === "AudioDataChannel")
                        this.audioChannel = evt.channel
                
			evt.channel.onopen = function () {
                        console.log("remote datachannel open, label: " + channelName);
                        
                }
		evt.channel.onopen = (evt => this.emit(channelName, evt,this)).bind(this);
                evt.channel.onmessage = (evt => this.emit(channelName, evt, this)).bind(this);						
        }

	sendCommand(command, data = null){
		if (this.peer) {
			if (this.peer.iceConnectionState === 'connected') {
				const message = {
					command: command
				}
				if (data) message.data = data;
				this.mainChannel.send(JSON.stringify(message));
				console.log("Command sent")
			} else {
				throw new Error("Error: Tried to SendCommand but is not connected")
			}
		} else {
			throw new Error("Error: Tried to SendCommand but is not connected")
		}
	}
}


//-------------------------------------------------------------------
const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
};

export class PeerConnectionMeet extends LitElement {

        static get styles() {
                return css`
		:host {
			
		}
		#mainVideo {
			position:relative;	
			height: fit-content;
			min-height: 100%;
			object-fit: cover;
			width: fit-content;
			min-width: 100%;
		}
		#overlay{
			position:absolute;
			top:100px;
			left:0;
			width:100%;
			bottom:0;
		}
		#mainVideo.contain {
			object-fit: contain;
		}
		#peers{ position:fixed; top:60px; right:0; width:100px; bottom:auto;
			display:flex; flex-direction:column;	
		}
		#peers > video{
			margin:5px;
			box-shadow: 0px 0px 5px #000;
		}
		#controls {
			position:fixed; bottom:0; left:0; width:100%;
			opacity:0.7;
		}
		#controls button {
			padding:10px;
			margin:10px;
			border-radius:10px;
		}
		#status { color:#0f0;}
		@media screen and (max-width: 600px) {
			#peers{flex-direction:row; left:auto; width:auto;right:0; height:80px}
		}
		#call_end{
			--mdc-theme-secondary: red;
			--mdc-theme-on-secondary: white;
		}
		#call_controls{
			position:fixed; bottom:100; right:0;
			opacity:0.7;
			display:flex;
			flex-direction:column;
		}
                `;
        }

	static get properties() {
                return {
                session: { type: String }       
                };
        }

        renderPeers(){
                return html`
			<div id="peers">
			</div>
                `
        }

        render(){
                return html`
                <video id="mainVideo" playsinline autoplay muted></video>
		<div id="overlay"></div>
		<div id="status"></div>
                ${this.renderPeers()}
		<div id="call_controls">
		<mwc-fab id="call" mini icon="call" @click="${this.connect}"></mwc-fab>
		<mwc-fab id="call_end" mini icon="call_end" @click="${this.disconnect}"></mwc-fab>
		</div>
                <div id="controls" class="box">
                </div>
                `

        }

	select(source){
		this.peers.forEach(peer => {
			if(peer.mainChannel)
				peer.mainChannel.send(JSON.stringify({
					command: "select",
					data: source
				}))
		})
	}


        constructor(){
		super();
                this.peers=new Map();
		this.clientId=signaling.clientId;
		//REMEMBER ICE SERVERS
        }


	attributeChangedCallback(attrName, oldVal, newVal){
		console.log("onAttributeChanged", attrName, oldVal, newVal)
		if(attrName=="session"){
			this.init(newVal);
		}
		super.attributeChangedCallback(attrName, oldVal, newVal);
	}

	async init(sessionId){
		this.sessionId=sessionId;
		signaling.resetListeners();
		signaling.on("connect", this.onConnect.bind(this));
		signaling.on("disconnect", this.onDisconnect.bind(this));
		signaling.on("close", this.onDisconnect.bind(this));
		signaling.on("peerConnected", this.onPeerConnected.bind(this));
		signaling.on("peerDisconnected", this.onPeerDisconnected.bind(this));
                signaling.on("signaling", this.onSignaling.bind(this));
                this.stream= await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
	}

	async connect(){
		signaling.send("all","peerConnected",{"from": this.clientId , "sessionId": this.sessionId});
	}

	//-------------------------------------------------------------------
	//Element removed from DOM
	disconnectedCallback(){
		this.disconnect();
	}


	onConnect(connack){
		//signaling.send("all","peerConnected",{"from": this.clientId , "sessionId": this.sessionId});
	}

	onDisconnect(){
		for(const [peerId, peer] of this.peers){
			peer.close();
			
		}
		this.peers.clear();
	}


	removePeer(peerId){
		let peer=this.peers.get(peerId);
		if(peer) {
			peer.close();
			this.peers.delete(peerId);
			this.onPeerRemoved(peer);
			if(peerId.startsWith("nearuser")){
				let video=this.shadowRoot.getElementById(peerId);
				if(video) video.remove();
			}
		}
	}

	onPeerConnected(data){
		console.log('onPeerConnected', data)
		if(data.from==this.clientId) return;
		//if(this.peers.has(data.from)) return;
		let peer = this.peers.get(data.from);
		if(!peer){
			//let stream=data.from.startsWith("nearuser")? this.stream : null;
			peer=new PeerConnection(data.from,this,this.stream);
			//peer.on("track", this.onTrack.bind(this));
			this.peers.set(data.from,peer);
			this.onPeerAdded(peer);
		}
		peer.connect();
	}

	onPeerDisconnected(data){
		this.removePeer(data.from);		
	}
        
	onPeerAdded(peer){
		//this.requestUpdate();
		
		if(peer.peerId.startsWith("nearuser")){
			let video=document.createElement("video");
			video.id=peer.peerId;
			video.playsinline=true;
			video.autoplay=true;
			this.shadowRoot.getElementById("peers").appendChild(video);
		}
		if(peer.peer) {
			for(let receiver of peer.peer.getReceivers()){
				this.setTrack( receiver.track, peer.peerId);
			}
		}	

	}
	onPeerRemoved(peer){
		console.log("onPeerRemoved", peer);		
	}

	

        onSignaling(data){
		console.log('signaling data: ', data)
		if (data.from == this.clientId) return;
		let peer= this.peers.get(data.from);
                if(!peer){ 
			//let stream=data.from.startsWith("nearuser")? this.stream : null;
                        peer=new PeerConnection(data.from,this,this.stream);
                        this.onPeerAdded(peer);
		        this.peers.set(data.from,peer);
                }
		//peer.on("track", this.onTrack.bind(this));
		peer.onSignaling(data);
	}


	setTrack(track, peerId){
		console.log('addtrack', peerId);
		let video;
		if (peerId.startsWith("nearuser")) 
                	video = this.shadowRoot.getElementById(peerId);
		else
			video = this.shadowRoot.getElementById("mainVideo");	
		let mediaStream=video.srcObject || new MediaStream();
		let oldTrack=mediaStream.getTracks().find(t => t.kind==track.kind);
		if(oldTrack) mediaStream.removeTrack(oldTrack);
		mediaStream.addTrack(track);
		video.srcObject=mediaStream;
	}

	setStream(stream, peerId){
		console.log('setStream', peerId);
		let video;
		if (peerId.startsWith("nearuser")) 
                	video = this.shadowRoot.getElementById(peerId);
		else
			video = this.shadowRoot.getElementById("mainVideo");	
		
                video.srcObject = stream;
        }

        onTrack(event, peerId){
		console.log('ontrack', event, peerId);
		//if(event.transceiver.direction=="recvonly")
		this.setTrack(event.track, peerId);
		//this.setStream(event.streams[0], peerId);
        }

	onIceConnectionStateChange(event, peerId){
		console.log('onIceConnectionStateChange', event, peerId);
	}

	onSignalingStateChange(peer, state){
		let peerId=peer.peerId;
		let video;
		console.log('onSignalingStateChange', peer.peerId, state);
		if (peerId.startsWith("nearuser")) 
                	video = this.shadowRoot.getElementById(peerId);
		else
			video = this.shadowRoot.getElementById("mainVideo");
		video.title=state;	
		if(state == "closed"){
			let peerId=peer.peerId;
			this.removePeer(peerId);
		}
	}

	sendCommand (command, data) {
		this.peers.forEach(peer=>{
			peer.sendCommand(command, data);
		})
	}

	
	disconnect(){
		return new Promise((resolve,reject)=>{
			signaling.send("all","peerDisconnected",{"from": this.clientId , "sessionId": this.sessionId})
				.then(()=>{
					this.peers.forEach(peer=>{
						if(peer)
							peer.close();
					});
					resolve();
				});
		});
	}

	onMainDataChannel(description,peerConnection){
		let controls=this.shadowRoot.getElementById("controls");
		let overlay=this.shadowRoot.getElementById("overlay");
		console.log("onMainDataChannel", description);
		controls.innerHTML="";
		overlay.innerHTML="";
		for(let scene of description.scenes){
			let button=document.createElement("button");
			button.innerText=scene.title || scene.name || scene.index;
			button.onclick=()=>{
				this.select(scene.index);
			}
			controls.appendChild(button);
			
		}
		if(description.current) {
			let scene=description.current;
			if(scene.form){
				console.log("current:", scene);
				overlay.innerHTML=scene.form;
				for (let child of overlay.children) {
					if(child.tagName.toLowerCase()=="near-vnc"){
						child.connect(peerConnection.proxyDataChannel,null,null);
					}
				}

			}

		}
		this.requestUpdate();
	}

	emit(eventName, evt, peerConnection){
		console.log("meet.emit", eventName, evt);
		if(eventName=="MainDataChannel" && evt.type!="open"){
			try{	
				let description=JSON.parse(evt.data);
				this.onMainDataChannel(description,peerConnection);
			}
			catch(e){
				console.log("MainDataChannel", e);	
			}
			return;
		}
		else if(eventName=="ProxyDataChannel"){
			if(evt.type=="open"){
				try{	
					console.log("ProxyDataChannel", evt);
					//peerConnection.proxyDataChannel=evt.target;
				}
				catch(e){
					console.log("ProxyDataChannel", e);	
				}
			}
			else console.log("ProxyDataChannel data", evt);	
			return;
		}
		else if(eventName=="iceconnectionstatechange")
			this.shadowRoot.getElementById("status").innerHTML=eventName+' '+evt.status; //+ " " + JSON.stringify(data);
		this.dispatchEvent(new CustomEvent(eventName, {detail: evt}));
	}
}








window.customElements.define('near-meet', PeerConnectionMeet);
