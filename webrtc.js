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
			this.publish(`sessions/${this.sessionId}/${to}`,JSON.stringify(message));
		});
	};


	on(command, callback, from = null) {
		this.listeners.push({ command: command, callback: callback, from: from });
	}

	removeListeners(command,  from) {
		this.listeners = this.listeners.filter(function (listener) {
			return listener.command != command && listener.from != from;
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
		super.setupEvents();
		this.client.on('connect', function () {
                        console.log('connect ', this.sessionId, '/',this.clientId);
                        this.connected=true;
			this.subscribe(`sessions/${this.sessionId}/${this.clientId}`);
			this.subscribe(`sessions/${this.sessionId}/all`);
			this.subscribe(`sessions/${this.sessionId}/backend`);
			
                }.bind(this));
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

	connect(sessionID, options){
		this.sessionId = sessionID	
		console.log('Connecting to MQTT');
                // validar clientId.
		return super.connect(options);
	}

	connect(sessionId, options){
		this.sessionId = sessionId
		if(!options) options={
                        reconnectPeriod: 10000,
                        clientId : 'nearuser_' + Math.random().toString(16).substr(2, 8)
                };
		options.reconnectPeriod= options.reconnectPeriod || 10000;
                this.clientId=options.clientId;	
		options.will={
			topic:`sessions/${sessionId}/all`,
			payload:`{
				"command":"peerDisconnected",
				"from":"${this.clientId}"
			}`,
			qos:1,
			retain:false
		}
		console.log('Connecting to MQTT');
		return super.connect(options);
	}


	disconnect(){
		console.log('Disconnect')
		/*if (timerId) {  
			clearTimeout(timerId);
			timerId = 0;  
		} */ 
		this.end();
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
	},
	{
	  urls: "turn:openrelay.metered.ca:80",
	  username: "openrelayproject",
	  credential: "openrelayproject",
	},
	{
	  urls: "turn:openrelay.metered.ca:443",
	  username: "openrelayproject",
	  credential: "openrelayproject",
	},
]

class PeerConnection{ 
        
        constructor(peerId, meet, stream=null, mediaConstraints=null) {
		//super();
                this.peer = null;
                this.meet = meet;
                this.peerConfig = {
                        //iceTransportPolicy: "relay",
			sdpSemantics: 'unified-plan',
                        iceServers: iceServers || []
                };
                this.pcOptions = mediaConstraints || { "optional": [{ "DtlsSrtpKeyAgreement": true }] };
                this.mediaConstraints = { offerToReceiveAudio: true, offerToReceiveVideo: true };
                this.earlyCandidates = [];
                this.mainChannel = null
                this.audioChannel = null
                this.peerId = peerId
                this.stream=stream
		this.setPeerId(peerId);
		this.createPeerConnection();

        }

        emit(name, object) {
                this.meet.emit(name, object);
        }

	setPeerId(id) {
		this.peerId = id
		signaling.on('answer', this.onAnswer.bind(this), this.peerId)
		
		signaling.on('addIceCandidate', this.onAddIceCandidate.bind(this), this.peerId);
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

	async connect(){
		this.createOffer();
	}

	async onAddIceCandidate(data){
		const candidates = data.candidates
		console.log('addIceCandidate ', this.peer.iceConnectionState);
		//if(this.peer.iceConnectionState!="gathering") return;
		for (let i = 0; i < candidates.length; i++) {
			//console.log('candidate:', candidates[i])
			this.emit("event",{ type: "ice", "candidate": candidates[i] });
			let candidate = new RTCIceCandidate(candidates[i]);

			console.log("Adding ICE candidate :" + JSON.stringify(candidate));
			try {
				await this.peer.addIceCandidate(candidate)
			} catch (error) {
				console.error("addIceCandidate error: " + JSON.stringify(error))
			}
		}
	}

	async disconnect(){
		if (this.peer) {
			this.peer.close();
			signaling.removeListeners("addIceCandidate", this.peerId);
			signaling.removeListeners("answer", this.peerId);  
			this.peer = null;
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

	getConnectionState(){
		if (this.peer)
			return this.peer.iceConnectionState;
		else
			return "uninitialized"
	}


	async onAnswer(answer){
		console.log('onAnswer:', answer)
		await this.onReceiveCall(answer);
		
	}

	async onOffer(offer){
		console.log('onOffer:', offer)
		
		if (this.stream) {
			this.peer.addStream(this.stream);
		}
		await this.onReceiveCall(offer)
		const answer = await this.peer.createAnswer()
		try {
			await this.peer.setLocalDescription(answer)
		} catch (error) {
			console.error('Error setLocalDescription: ', error)
		}
		let data={
			sdp:answer.sdp,
			type:answer.type
		}
		signaling.send(this.peerId, 'answer', data)
	}

	async createOffer(stream){
		try {
			
			let peerid = this.peerId
			if (stream) {
				this.peer.addStream(stream);
			}
			this.mainChannel=this.createDataChannel("MainDataChannel");
			// create Offer
			const offer = await this.peer.createOffer(this.mediaConstraints)
			console.log("Create Offer, send to ", offer, this.peerId)
			await this.peer.setLocalDescription(offer)
			
			let data = { 
				peerid: peerid,
				sdp: offer.sdp,
				type: offer.type
			}
			console.log("Local Description", data, offer)
			signaling.send(peerid, 'call', data)
			
			
		} catch (e) {
			this.disconnect();
			console.error("connect error: " + e);
		}
	}


	createPeerConnection(){
		console.log("createPeerConnection config: " + JSON.stringify(this.peerConfig) + " option: " + JSON.stringify(this.pcOptions));
		this.peer = new RTCPeerConnection(this.peerConfig, this.pcOptions);
		// clear early candidates
		this.earlyCandidates.length = 0;

		this.peer.onicecandidate = this.onIceCandidate.bind(this);
		this.peer.ontrack =  this.onTrack.bind(this); 
		this.peer.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
		this.peer.ondatachannel = this.onDataChannel.bind(this); 
		//this.peer.onconnectionstatechange = (event,state) => { console.log("connection state:",event,state) };



		console.log("Created RTCPeerConnnection with config: " + JSON.stringify(this.peerConfig) + "option:" + JSON.stringify(this.pcOptions));
		return this.peer;
	}

	createDataChannel(label){
		try {
			let dataChannel = this.peer.createDataChannel(label);
			dataChannel.onopen = () => {
				console.log(label + " open");
				dataChannel.send(label + "openned");
				this.emit("event" , {
					"type": label,
					"status": "ChannelOpenned"
				});
			}
			dataChannel.onmessage = (evt) => {
				console.log("datachannel recv:", evt);
				this.emit(label, evt);
			}
			return dataChannel;
		} catch (e) {
			console.error("Cannot create datachannel error: " + e);
			return null;
		}
	}

        async onIceConnectionStateChange(evt){
                this.emit(evt.type,{
                        connectionState: (this.peer && this.peer.iceConnectionState) || "disconnected",
			peerId: this.peerId,
			peer: this.peer || null,
                        peerConnenction: this
                });
        }

        async  onTrack(evt){
                this.meet.onTrack(evt, this.peerId);
        }

        async onDataChannel(evt) {
                const channelName = evt.channel.label
                console.log("Remote datachannel created:");
		if (channelName === "MainDataChannel")
                        this.mainChannel = evt.channel
                else if (channelName === "AudioDataChannel")
                        this.audioChannel = evt.channel
                
			evt.channel.onopen = function () {
                        console.log("remote datachannel open, label: " + channelName);
                        
                }
                evt.channel.onmessage = (evt) => {
			console.log("datachannel recv:", evt);
			this.emit(channelName, evt);
		}
        }

	async onIceCandidate(event){
		console.log('onIceCandidate!!', event)
		if (event.candidate) {
			if (this.peer.currentRemoteDescription) {
				this.sendIceCandidate(this.peerId, event.candidate);
			} else {
				console.log('earlyCandidates:', event.candidate)
				this.earlyCandidates.push(event.candidate);
			}
		}
	}


	sendIceCandidate (peerid, candidates){
		if (Array.isArray(candidates) === false) // Always send an array
			candidates = [candidates]

		console.log('sendIceCandidate -> ', this.peerId, candidates)
		signaling.send(peerid, 'addIceCandidate', {
			peerid: peerid,
			candidates: candidates
		});
	}

	async onReceiveCall(dataJson){
		try {
			var descr = new RTCSessionDescription(dataJson);

			await this.peer.setRemoteDescription(descr)

			console.log("setRemoteDescription OK");
			if(this.earlyCandidates.length > 0){
				this.sendIceCandidate(this.peerId, this.earlyCandidates);
				this.earlyCandidates.length = 0
			}
		} catch (error) {
			console.error("setRemoteDescription error:" + JSON.stringify(error));
		}
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
 
                `;
        }

        renderPeers(){
                return html`
			<div id="peers">
				${this.peers.forEach(peer => html`
					<video id="${peer.peerId}" playsinline autoplay></video>
				`)}
			</div>
                `
        }

        render(){
                return html`
                <video id="mainVideo" playsinline autoplay muted></video>
                ${this.renderPeers()}
                <div class="box">
                    <button @click="${e=>this.select(0)}" >0</button>
                    <button @click="${e=>this.select(1)}" >1</button>
                    <button @click="${e=>this.select(2)}" >2</button>
		    <button @click="${e=>this.select(3)}" >3</button>
		    <button @click="${e=>this.select(4)}" >4</button>
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

	async init(sessionId){
		this.sessionId=sessionId;
		signaling.on("peerConnected", this.onPeerConnected.bind(this));
		signaling.on("peerDisconnected", this.onPeerDisconnected.bind(this));
		signaling.on("call", this.onCall.bind(this));
                this.stream= await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
		signaling.send("all","peerConnected",{"from": this.clientId , "sessionId": this.sessionId});

	}

	onPeerConnected(data){
		console.log('onPeerConnected', data)
		if(data.from==this.clientId) return;
		let peer=new PeerConnection(data.from,this,this.stream);
		//peer.on("track", this.onTrack.bind(this));
		this.peers.set(data.from,peer);
		this.onPeerAdded(peer);
		peer.connect(this.stream);
	}

	onPeerDisconnected(data){
		let peer=this.peers.get(data.from);
		peer.disconnect();
		if(this.shadowRoot.getElementById(data.from)){
			this.shadowRoot.getElementById(data.from).remove();
		}
		this.peers.delete(data.from)
		this.onPeerRemoved(peer);	
	}
        
	onPeerAdded(peer){
		this.requestUpdate();
		if(peer.peer && peer.peer.getReceivers) {
			let receiver = peer.peer.getReceivers().find((r)=>{
				return r.track.kind == "video";});
			if(receiver) this.setTrack(peer.peerId, receiver.track);
		}	

	}
	onPeerRemoved(peer){
		this.requestUpdate();
	}

	onCall(data){
		console.log('call data: ', data)
		if (data.from == this.clientId) return;
		let peer=new PeerConnection(data.from,this,this.stream);
		//peer.on("track", this.onTrack.bind(this));
		this.onPeerAdded(peer);
		this.peers.set(data.from,peer);
		peer.onOffer(data);
	}


	setTrack(track, peerId){
		console.log('addtrack', peerId);
		let video;
		let mediaStream=new MediaStream();
		mediaStream.addTrack(track);
		if (peerId.startsWith("nearuser")) 
                	video = this.shadowRoot.getElementById(peerId);
		else
			video = this.shadowRoot.getElementById("mainVideo");	
                video.srcObject = mediaStream;
        }

        onTrack(event, peerId){
		console.log('ontrack', event, peerId);
		this.setTrack(event.track, peerId);
        }

	sendCommand (command, data) {
		this.peers.forEach(peer=>{
			peer.sendCommand(command, data);
		})
	}

	
	disconnect(){
		this.peers.forEach(peer=>{
			peer.sendCommand(command, data);
		})
		signaling.disconnect()
	}

	emit(event, data){
		this.dispatchEvent(new CustomEvent(event, {detail: data}));
	}
}








window.customElements.define('near-meet', PeerConnectionMeet);
