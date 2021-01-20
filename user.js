'use strict';
//https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js
//https://stackoverflow.com/questions/47159568/how-to-redirect-after-confirm-amazon-cognito-using-confirmation-url

import { LitElement, html, css } from 'lit-element';


let  CognitoUserPool=null; 
let  CognitoUserAttribute=null; 
let  CognitoUser=null;  
let  AuthenticationDetails=null; 
let  CookieStorage=null; 
//CognitoUserPool=AmazonCognitoIdentity.CognitoUserPool; 
//CognitoUserAttribute=AmazonCognitoIdentity.CognitoUserAttribute; 
//CognitoUser=AmazonCognitoIdentity.CognitoUser;  
//AuthenticationDetails=AmazonCognitoIdentity.AuthenticationDetails; 
//CookieStorage=AmazonCognitoIdentity.CookieStorage; 


import {Formfield} from '@material/mwc-formfield'
import {Button} from '@material/mwc-button'
import {Icon} from '@material/mwc-icon'

import {NearMenu} from './menu.js'
import {UserPicture} from './user_picture.js'





var poolData; 
var userPool;
//window.userPool=userPool;

export var session=null;

var status= Object.freeze ({
  ANONIMOUS : 0,
  SIGNIN: 1,
  LOGGED: 2,
  SIGNUP: 3,
  CONFIRM: 4,
  FORGOT: 5,
  FORGOT_CONFIRM: 6,
  CHANGEPSW:7,
  FORCED_CHANGEPSW:8,
  MFA_REQUIRED :9,
  EDIT_PROFILE: 10,
  EDIT_PICTURE: 11
})

function i18n(template) {
  if(i18n.locale  in i18n.db)
    if(template in i18n.db[i18n.locale]) 
      return  i18n.db[i18n.locale][template];
  return template
}
i18n.locale = 'en';
i18n.db = {
  'es':{
    "authenticate": "ingresar",
    "login with your new password": "ingrese con la nueva password",
    "change password required": "se requiere cambio de password",
    "register...": "registrarse...",
    "forgot password...": "olvidé mi password...",
    "confirm...": "confirmar...",
    "Name": "Nombre",
    "New password": "Nueva password",
    "retype password": "Retipear password",
    "Register!": "Registrarme!",
    "Your confirmation code": "Código de confirmación",
    "Code": "Código",
    "Go!": "OK",
    "Your code:": "Su código",
    "Old password": "Password anterior",
    "Retype new password": "Retipear la nueva password",
    "Change password!": "Cambiar password!",
    "continue": "continuar",
    "Verification code": "Código de verificación",
    "Nickname": "Apodo",
    "Website": "Sitio Web",
    "Update!": "Actualizar!",
    "cancel": "cancelar",
    "close": "cerrar",
    "go": "OK",
    "edit profile...": "modificar perfil...",
    "change picture...": "cambiar foto...",
    "change password...": "cambiar password...",
    "logout": "salir",
    "My account...": "Mi cuenta...",
    "Edit Profile": "Modificar perfil",
    "Sign in": "Ingresar",
    "Verified! please use your email and password to signin": "Verificado! use su email y password para ingresar",
    "at least 8 characters": "mínimo 8 caracteres",
    "at least 1 uppercase letter": "al menos 1 mayúscula",
    "at least 1 lowercase letter": "al menos 1 minúscula",
    "use at least 1 number": "al menos 1 número",
    "retype match": "coinciden?",
    "resend confirmation code": "reenviar código de confirmación"
  }
  

};

export class NearUser extends LitElement {
  
  static get styles() {
  return css`
      :host > near-modal{ position:fixed;height:100vh; top:0; left:0; bottom:0; right:0; background-color: rgba(0,0,0,.5); display:flex; justify-content:center;align-items:center;padding:2em }
      :host([hidden]) { display: none; }
      near-modal a{font-size:-3;color:#999;cursor:pointer}
      .inverse {
        
        --mdc-theme-primary: #8888;
        
      }
      :host > near-modal > div {
        background-color:white;
        color:black;
        border:solid 1px #ccc;
        box-shawow: 2px 2px 2px #888;
        display:flex; 
        flex-direction:column;
        align-items: flex-end;
        justify-content:center;
        padding:4em;
        --mdc-theme-primary: #057; ;
      }
      input, textarea {
        border: none;
        border-bottom: solid 1px rgba(128,128,128,0.2);
        padding:1em 0.5em ; 
        margin-top:.2em;
        color:#888;
        nwidth:100%;
        background-color:rgba(128,128,128, 0);
      }
      near-modal mwc-formfield {
        flex-direction:column;
      }
      #name_button {
        padding:0; 
        height:56px; width:56px;     
        font-size:20px;
        border:none;
        background-color:#ffffff80;
        clip-path: circle(50% at center);}
      #name_button img {
          max-width:56px;     
          clip-path: circle(45% at center);
        }  
      `;
    }



  /**
   * Define properties. Properties defined here will be automatically 
   * observed.
   */
  static get properties() {
    return {
      name: { type: String },
      state: {type: Number},
      current: {type: CognitoUser},
      poolId: {type: String},
      clientId:{type: String},
      baseURL:{type: String},
      apiURL:{type: String},
      signInLabel:{type: String},
      noregister:{type: Boolean},
      lang:{type: String}
    };
  }

  

  /**  
   * In the element constructor, assign default property values.
   */
  constructor() {
    // Must call superconstructor first.
    super();
    // Initialize properties
    //this.loadComplete = false;
    this.lang='en';
    this.message = '';
    //this.pie = false;
    this.sub="";
    this.username="";
    this.name="";
    this.nickname="";
    this.website="";
    //this.psw="";
    this.email="";
    this.phone="";
    this.session=null;
    this.state=status.ANONIMOUS;
    this.userAttributes=null;
    this.picture=null;
    NearUser.instance=this;


    this.forgotPasswordObj={
      onSuccess: function (result) {
          //console.log('call result: ' + result);
          this.thisObj.message=i18n("login with your new password");
          this.thisObj.state=status.SIGNIN;
      },
      onFailure: function(err) {
        //console.log(err.message);
        //this.thisObj.say(err.message);
        this.thisObj.message=err.message;
        this.thisObj.state=status.FORGOT;
      },
      inputVerificationCode() {
        this.thisObj.state=status.FORGOT_CONFIRM;
      },
      thisObj:this
    }
    this.authenticateObj= {
      onSuccess: function (result) {
          //console.log("Success")    
          var accessToken = result.getAccessToken().getJwtToken();
          //console.log(accessToken);
          this.thisObj.parseAttributes(this.thisObj.cognitoUser);
          this.thisObj.currentUser=this.thisObj.cognitoUser;          
          //this.thisObj.requestUpdate();
      },

      onFailure: function(err) {
        //console.log(err.message);
        this.thisObj.say(err.message);
      },
      mfaRequired: function(codeDeliveryDetails) {
          //console.log("MFA Required");
          this.thisObj.codeDeliveryDetails=codeDeliveryDetails;
          this.thisObj.message=err.message;
          this.thisObj.state=status.MFA_REQUIRED;    
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
          //console.log("Change Password Required");
          this.thisObj.userAttributes=userAttributes;
          this.thisObj.requiredAttributes=requiredAttributes;
          this.thisObj.message=i18n("change password required");
          this.thisObj.state=status.FORCED_CHANGEPSW;        
      },
      
      thisObj: this 
    }
    


  }


  attributeChangedCallback(name, oldval, newval) {
    
    if(name=="apiURL" && newval.slice(8).indexOf('/')==-1) 
        newval+= "/near";
    super.attributeChangedCallback(name, oldval, newval);    
  }


  async initAmz() {
    if(CognitoUserPool==null) {
     await import('./amazon-cognito-identity.min.js')
     //.then(amz=>{
     //  console.log(amz);
     //})
     CognitoUserPool=AmazonCognitoIdentity.CognitoUserPool; 
     CognitoUserAttribute=AmazonCognitoIdentity.CognitoUserAttribute; 
     CognitoUser=AmazonCognitoIdentity.CognitoUser;  
     AuthenticationDetails=AmazonCognitoIdentity.AuthenticationDetails; 
     CookieStorage=AmazonCognitoIdentity.CookieStorage;
     poolData={ 
      UserPoolId : this.poolId,
      ClientId : this.clientId
    };
    userPool = new CognitoUserPool(poolData);

    this.currentUser=userPool.getCurrentUser();
    //console.log(this.currentUser)
    try{ 
      await this.checkSession();
        this.parseAttributes(this.currentUser);
      }
      catch(e){
        
      }
     console.log("Amz SDK loaded UserPool=",userPool ) 
    }
    
  }

  checkSession(){
    return new Promise((resolve,reject)=>{
      if(this.currentUser!==null) {
        this.currentUser.getSession((err,sess)=> {
          if(err) {
            this.state=status.ANONIMOUS; 
            reject(err)
          };
          this.session = sess;
          window.session= sess;
          this.groups=this.currentUser.signInUserSession.accessToken.payload['cognito:groups'];
          if(sess) console.log("idTokenExpiration",sess.getIdToken().getExpiration()-new Date().getTime()/1000); 
          this.state=status.LOGGED; 
          //this.parseAttributes(this.currentUser);
          resolve(sess);
        }); 
      }
      else reject("no user");
    })  
  }

  /**
   * Implement firstUpdated to perform one-time work on first update:
   */
  firstUpdated() {
    
    //return;
    //this.loadLazy();
    //console.log("firstUpdated()");
    //console.log("poolId "+ this.poolId);
    //console.log("clientId "+ this.clientId);
    if(this.apiURL.slice(8).indexOf('/')==-1) 
        this.apiURL+= "/near";
    if(this.lang){ 
          i18n.locale=this.lang.substr(0,2).toLowerCase();
          this.requestUpdate();
    }
    if(window.URLSearchParams && window.location.search){
      this.initAmz().then(()=>{
          const params=new URLSearchParams(window.location.search);
        const verify=params.get('verify'), code=params.get('code'), email=params.get('email');
        if(verify && code) { 
          this.confirmRegistration(verify,code);
          //window.location.search="";
        }
        else if(email && code){
          this.vcode=code;
          this.email=email;
          this.state=status.FORGOT_CONFIRM;
          //window.location.search="";
        } 

      })
    } 
    
  }

  loginForm(){
    if(ga) ga('send', 'event', 'UI', 'sign-in', window.location.href)
    return html`
    <near-modal>
     <div>
     <mwc-formfield label="Email" alignEnd>
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </mwc-formfield>
     <mwc-formfield label="Password" alignEnd>
       <input name="psw" id="psw" 
         type="password" .value="" @change="${this.changePsw}">
     </mwc-formfield>    
     <mwc-button @click="${this.authenticate}"  >${i18n`authenticate`}</mwc-button>
     <div id="message">${this.message}</div> 
     ${ this.noregister? '' : 
     html`<a dense @click="${()=>{this.state=status.SIGNUP  ;console.log('register')}}" >${i18n("register...")}</a>`}
     <a dense @click="${()=>{this.state=status.FORGOT }}" >${i18n("forgot password...")}</a>
     <a dense @click="${()=>{this.state=status.CONFIRM }}" >${i18n("confirm...")}</a>
     <a dense @click="${()=>this.state=status.ANONIMOUS}">${i18n`cancel`}</a>
     </div>
    </near-modal>`
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //console.log(`${propName} changed. oldValue: ${oldValue}`);
      if(propName=="name") { 
          var el= this.shadowRoot.getElementById("name_button");
          if (el) el.label=this.nameInitials();
      }
    });
  }


  signUpForm(){
    return html`
    <near-modal>
    <div>
     
     <mwc-formfield label="Email" alignEnd>
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Name`}" alignEnd>
       <input nclass="mdc-text-field__input" name="name" id="name" 
         type="text" .value="${this.name}" @change="${this.changeName}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`New password`}" alignEnd>
       <input name="newpsw" id="newpsw" 
         type="password"  @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </mwc-formfield>     
     <mwc-formfield label="${i18n`retype password`}" alignEnd>
       <input name="newpsw2" id="newpsw2" 
         type="password"  @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">    
     </mwc-formfield> 
          
     <div id="message">${this.message}</div>      
     <mwc-button id="proceed" @click="${this.signUp}"  >${i18n`Register!`}</mwc-button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}">${i18n`cancel`}</a>
    </div>
    </near-modal>
   `; 

  }

  confirmationForm(){
    return html`
    <near-modal>
    <div>
     <p>${i18n`Your confirmation code:`}</p>
     <mwc-formfield label="Email" alignEnd>
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Code`}" alignEnd>
       <input name="code" id="code" 
         type="number">
     </mwc-formfield>
     <div id="message">${this.message}</div>  
     <mwc-button @click="${this.confirm}"  >${i18n`Go!`}</mwc-button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}">${i18n`cancel`}</a>
     
     </div>
     </near-modal>
   `; 
  }

  mfaForm(){
    return html`
    <near-modal>
    <div>
     <p>${i18n`Your code:`}</p>
     <mwc-formfield label="${i18n`Code`}" alignEnd>
       <input name="code" id="code" 
         type="number">
     </mwc-formfield>
     <div id="message">${this.message}</div>  
     <mwc-button @click="${this.mfaCode}"  >${i18n`Go!`}</mwc-button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}">${i18n`cancel`}</a>
     
     </div>
     </near-modal>
   `; 
  }


  changePasswordForm(){
    return html`
    <near-modal>
     <div>
     ${ this.state==status.CHANGEPSW?
        html`
          <mwc-formfield label="${i18n`Old password`}" alignEnd>
            <input name="psw" id="psw" 
              type="password" .value="" @change="${this.changePsw}">
          </mwc-formfield>
        ` 
        :``
     }
     <mwc-formfield label="${i18n`New password`}" alignEnd>
     <input name="newpsw" id="newpsw" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Retype new password`}" alignEnd>
       <input name="newpsw2" id="newpsw2" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </mwc-formfield> 
     <div id="message">${this.message}</div>       
     <mwc-button id="proceed"  @click="${this.changePassword}"  >${i18n`Change password!`}</mwc-button>
     <a dense @click="${()=>this.state=status.LOGGED}">${i18n`cancel`}</a>
     </div>
    </near-modal>`
  }

  forgotPasswordForm(){
    return html`
    <near-modal>
    <div>
     
     <mwc-formfield label="Email" alignEnd>
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </mwc-formfield>
     <div id="message">${this.message}</div>      
     <mwc-button id="proceed" @click="${this.forgotPassword}">${i18n`continue`}</mwc-button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}">${i18n`cancel`}</a>
    </div>
    </near-modal>
   `; 

  }

  forgotPasswordConfirmForm(){
    return html`
    <near-modal>
     <div>
     <mwc-formfield label="${i18n`Verification code`}" alignEnd>
       <input name="vcode" id="vcode" 
         type="text" value="${this.hasOwnProperty('vcode')? this.vcode : ''}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`New password`}" alignEnd>
       <input name="newpsw" id="newpsw" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Retype new password`}" alignEnd>
       <input name="newpsw2" id="newpsw2" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </mwc-formfield> 
     <div id="message">${this.message}</div>       
     <mwc-button id="proceed"  @click="${this.confirmForgotPassword}"  >${i18n`Change password!`}</mwc-button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}">${i18n`cancel`}</a>
     </div>
    </near-modal>`
  }

  editProfileForm(){
    return html`
    <near-modal>
    <div>
  
    
     <user-picture id="picture" 
          @picture-change="${this.uploadPicture}"
          src="${this.picture}"></user-picture> 
     
     <mwc-formfield label="Email" alignEnd>
       <input disabled name="email" id="email" 
         type="email" .value="${this.email}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Name`}" alignEnd>
       <input nclass="mdc-text-field__input" name="name" id="name" 
         type="text" .value="${this.name}" nchange="${this.changeName}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Nickname`}" alignEnd>
       <input nclass="mdc-text-field__input" name="nickname" id="nickname" 
         type="text" .value="${this.nickname}" nchange="${(e)=>this.nickname=e.target.value}">
     </mwc-formfield>
     <mwc-formfield label="${i18n`Website`}" alignEnd>
       <input nclass="mdc-text-field__input" name="website" id="website" 
         type="text" .value="${this.website}" nchange="${(e)=>this.website=e.target.value}">
     </mwc-formfield>     
          
     <div id="message">${this.message}</div>
           
     <mwc-button id="proceed" @click="${this.updateAttributes}">${i18n`Update!`}</mwc-button>
     <a dense @click="${()=>this.state=status.LOGGED}">${i18n`cancel`}</a>
    </div>
    </near-modal>
   `; 

  }

  editPictureForm(){
    return html`
    <near-modal>
    <div>
     <user-picture id="picture" 
          @picture-change="${this.uploadPicture}"
          src="${this.picture}"></user-picture> 
     
     <div id="message">${this.message}</div>
     <mwc-button id="proceed" @click="${()=>this.state=status.LOGGED}" >${i18n`close`}</mwc-button>
    </div>
    </near-modal>
   `; 

  }


  say(m) {
    var el=this.shadowRoot.getElementById("message")
    if(el) el.innerHTML=m;
    else  console.log("say: "+m);
  }                  

  openMenu(){
    //this.shadowRoot.getElementById('menu').setAttribute('open',true);
    //console.log("openMenu");
    this.shadowRoot.getElementById('menu').toggleMenu();
  }

  /**
   * Define a template for the new element by implementing LitElement's
   * `render` function. `render` must return a lit-html TemplateResult.
   */
  render() {
    
    //console.log('render st:'+ this.state );

    
    if(this.currentUser) {
            if(this.state == status.CHANGEPSW || this.state == status.FORCED_CHANGEPSW) 
              return this.changePasswordForm();
            else if(this.state == status.EDIT_PROFILE)
              return this.editProfileForm();
            else if(this.state == status.EDIT_PICTURE)
              return this.editPictureForm();      
                    
            return html`
              <div>
              <button id="name_button"  class="inverse" @click="${this.openMenu}" label="" icon="arrow_drop_down" trailingicon="">
              ${ this.picture?
                html`<img src="${this.picture}">`
                : this.nameInitials()}
              </button> 
              <near-menu id="menu">
                    <near-list>
                        <near-list-item label="go" @click="${this.doAction}" ></near-list-item>
                        <near-list-item label="${i18n`edit profile...`}" @click="${()=>this.state=status.EDIT_PROFILE}"></near-list-item>
                        <near-list-item label="${i18n`change picture...`}" @click="${()=>this.state=status.EDIT_PICTURE}"></near-list-item>
                        <near-list-item label="${i18n`change password...`}" @click="${()=>this.state=status.CHANGEPSW}"></near-list-item>
                        <near-list-item label="${i18n`logout`}" @click="${this.logout}"></near-list-item>
                        
                        <near-list-item label="${i18n`My account...`}">
                          <near-list>
                            <near-list-item label="${i18n`edit profile`}" @click="${()=>this.state=status.EDIT_PROFILE}"></near-list-item>
                            <near-list-item label="${i18n`change password...`}" @click="${()=>this.state=status.CHANGEPSW}"></near-list-item>
                          </near-list>  
                        </near-list-item>
                    </near-list>
              </near-menu> 
              
              </div>
              `
    };
    if (this.state== status.ANONIMOUS) {
      let label= this.signInLabel || i18n('Sign in');
      return html`<mwc-button class="inverse" dense @click="${()=>{this.state=status.SIGNIN}}" label="${label}" icon="person" trailingicon=""></mwc-button>
      `;
    }
    else if(this.state == status.FORCED_CHANGEPSW) 
      return this.changePasswordForm();  
    else if(this.state == status.SIGNUP)
      return this.signUpForm();
    else if(this.state == status.CONFIRM)
      return this.confirmationForm();
    else if(this.state == status.FORGOT)
      return this.forgotPasswordForm();
    else if(this.state == status.FORGOT_CONFIRM)
      return this.forgotPasswordConfirmForm();
    else if(this.state == status.MFA_REQUIRED)
      return this.mfaForm();          
    this.initAmz();
    return this.loginForm();

  }

  doAction(e) {
      console.log("doAction");
      this.doUpload();
       //this.getResources("/resources/").then((data)=>{console.log(data)});
       //if(this.canEdit) console.log(this.buildPage(window.location.pathname));
       //this.getDocumentsByKey("test"); //all documentes by sub
       //this.putDocument({id:"/test1",key:"test",description:"test document1 "})
      // this.getTest("testwww");
       //this.putGeo(window.location.pathname).then((json)=>console.log("putGeo",json));
       //this.getDocumentsByGeo().then((d)=>console.log("D:",d))
  }

  canEdit(key=null) {
    if(this.sub){
        if(key && key.indexOf(this.sub.slice(-12))!=-1)
          return true;
        if(window.location.pathname.indexOf(this.sub.slice(-12))!=-1) 
          return true; 
    }
    if(this.groups)
      return (this.groups.includes('admin') 
      || this.groups.includes('editor')
      || this.groups.includes(`edit:${window.location.hostname}`)
      || this.groups.includes(`admin:${window.location.hostname}`)
    )
    return false;
  }

  static canEdit(key=null){
    
    return (NearUser.instance && NearUser.instance.canEdit(key)); 
  }
 
  canAdmin() {
    if(this.groups) {
      return (this.groups.includes('admin') || 
      this.groups.includes(`admin:${window.location.hostname}`))
    }
    return false;
  }

  

  static canAdmin(){
    //console.log("static canAdmin", NearUser.instance && NearUser.instance.canAdmin() )
    return (NearUser.instance && NearUser.instance.canAdmin()); 
  }


  canUpload(key='') {
    if(this.groups)
      for(let group of this.groups) {
        if( group.startsWith('upload:') && key.startsWith(group.slice(7)))
          return true;
      }
    return false;
  }

  static canUpload(key=''){
    
    return (NearUser.instance && NearUser.instance.canUpload(key)); 
  }


  static getApi(resource){
    return (NearUser.instance && NearUser.instance.getApi(resource)); 
  }

  canCreate() {
    if(this.canEdit()) 
      return true;
    if(this.groups)
      return (this.groups.includes('author'));
    return false;
  }

  hasRole(role){
    if(this.groups)
      return (this.groups.includes(role));
    return false;
  }

  static canCreate(){
    return (NearUser.instance && NearUser.instance.canCreate()); 
  }

  getTest(resource){
    return this.getApi(resource);
  }

  getApi(resource){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken())
      return new Promise((resolve, reject)=>{
        fetch(this.apiURL+"/"+resource,{"headers" : headers, "method":"GET"})
        .then((response)=>{
          response.json() 
           .then((data) => {
                console.log(data);
                resolve(data);
            });
           }); 
        })
    })
  }

  getResources(path){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken())
      return new Promise((resolve, reject)=>{
        fetch(this.apiURL+"/resources?path="+encodeURIComponent(path),{"headers" : headers, "method":"GET"})
        .then((response)=>{
          response.json() 
           .then((data) => {
                //console.log(data);
                resolve(data);
            });
           }); 
        })
    })   
  }
  
  getEmbed(url){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken())
      //console.log("doAction")
      return new Promise((resolve, reject)=>{
        fetch(this.apiURL+"/get-embed?url="+encodeURIComponent(url),{"headers" : headers, "method":"GET"})
        .then((response)=>{
          response.json() 
           .then((data) => {
                console.log(data);
                resolve(data);
            });
           }); 
      })
    })
  }

  doUpload(e) { 
    console.log("doUpload")
    const payload = 'hola4';
    const key="inbox/hola2.txt"
    console.log("canUpload:",this.canUpload(key))
    this.upload(key,payload,'text/plain').then( (response) => {
      console.log('call result: ' + response);                
      });
  }

 
  put(key,payload,contentType,apiResource='/put'){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      if(!contentType) contentType="text/plain";
   
      return fetch(this.apiURL+apiResource+"?key="+encodeURIComponent(key)+"&contentType="+encodeURIComponent(contentType),{"headers" : headers, "method":"GET"})
        .then((response)=>{
          //console.log(response);
          return response.json() 
          .then((data) => {
            var h= new Headers();
            h.append('Content-Type',contentType);
            h.forEach(function(v){console.log(v)})
            
            return fetch(data.uploadURL, {
              method: 'PUT',
              body: payload,
              mode: "cors",
              headers:h
            })
            
          }) 
        })        
    })
 
  }

  upload(key,payload,contentType) {
    return this.put(key,payload,contentType,'/upload')
  }

  get(key){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/get?key="+encodeURIComponent(key),{"headers" : headers, "method":"GET"})
        .then((response)=>{
          return response.json() 
          .then((data) => {
            console.log(data);
            var h= new Headers();
            h.forEach(function(v){console.log(v)})
            
            return fetch(data.signedURL, {
              method: 'GET',
              mode: "cors",
              headers:h
            })
            
          }) 
        })  
    })
  }

  buildPage(key) {
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/build?key="+encodeURIComponent(key),{"headers" : headers, "method":"PUT"})
      .then(response=> { return response.json().then(json=> console.log(json)) });
    })
  }

  putKey(keyId, key){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/documents.putKey?id="+encodeURIComponent(keyId)+"&key="+encodeURIComponent(key),{"headers" : headers, "method":"PUT"})
      .then(response=> { return response.json()});
    })
  }

  

  deleteKey(keyId, key){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/documents.deleteKey?id="+encodeURIComponent(keyId)+"&key="+encodeURIComponent(key),{"headers" : headers, "method":"PUT"})
      .then(response=> { return response.json()});
    })

  }


  putSubKey(key){
    return this.putKey(key,'sub:' + this.sub);
  } 
  
  getDocumentsByKey(key){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/documents.getByKey?key="+encodeURIComponent(key),{"headers" : headers, "method":"GET"})
      .then(response=> { return response.json()});
    })
  }

  getDocumentsByKeyPut(key,path=''){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/documents.getByKey?key="+encodeURIComponent(key)+"&path="+path,{"headers" : headers, "method":"PUT"})
      .then(response=> { return response.json()}); 
    })
  }


  getSubDocuments() {
    return this.getDocumentsByKey('sub:' + this.sub);
  }

  getDocumentsById(id){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/documents.getById?id="+encodeURIComponent(id),{"headers" : headers, "method":"GET"})
      .then(response=> { return response.json()});
    })
  }

  getDocuments(){
    return this.getDocumentsByKey(this.sub);
  }

  putSubDocument(document,id){
    document.key='sub:' + this.sub;
    return this.putDocument(document,id);
  }

  putDocument(document,id=null,key=null){
    return this.checkSession().then(()=>{
      if(id) document.id=id;
      if(key) document.key=key;
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/documents.put",{"headers" : headers, "method":"PUT","body":JSON.stringify(document)})
      .then(response=> { return response.json()});
    })
  }


  putGeo(keyId,prefix='geo',precision=10){
    if (navigator.geolocation) {
      return new Promise((resolve)=>navigator.geolocation.getCurrentPosition(position=>{
        console.log("GEOLOCATION",position);
        resolve(this.putGeoLngLat(keyId,position.coords.longitude,position.coords.latitude,prefix,precision));
        }))
    }
    return null;
  }

  putGeoLngLat(keyId, lng,lat,prefix='geo',precision=10){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      let query=
        `lat=${encodeURIComponent(lat)}`
        +`&lng=${encodeURIComponent(lng)}`
        +`&precision=${encodeURIComponent(precision)}`
        +`&prefix=${encodeURIComponent(prefix)}`
      let params={"headers" : headers, "method":"PUT"};  
      if(typeof(keyId)=='string')
        query+=`&id=${encodeURIComponent(keyId)}`
      else 
        params.body=JSON.stringify(keyId);
      return fetch(this.apiURL+`/documents.putGeo?${query}`,params )
      .then(response=> { return response.json()}); 
    })
  }


  getDocumentsByGeo(prefix='geo',precision=10){
    if (navigator.geolocation) {
      return new Promise ((resolve)=>navigator.geolocation.getCurrentPosition(position=>{            
            resolve(this.getDocumentsByGeoLngLat(position.coords.longitude,position.coords.latitude,prefix, precision))
      }));
    }
    return null;
  }

  getDocumentsByGeoLngLat(lng,lat,prefix='geo',precision=10){
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      let query=
        `lat=${encodeURIComponent(lat)}`
        +`&lng=${encodeURIComponent(lng)}`
        +`&precision=${encodeURIComponent(precision)}`
        +`&prefix=${encodeURIComponent(prefix)}`
      return fetch(this.apiURL+`/near/documents.getByGeo?${query}`,{"headers" : headers, "method":"GET"})
      .then(response=> { return response.json()});
    })
  }

  invalidate(key) {
    return this.checkSession().then(()=>{
      var headers=new Headers();
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
      return fetch(this.apiURL+"/invalidate?key="+encodeURIComponent(key),{"headers" : headers, "method":"PUT"})
      .then(response=> { return response.json()});
    })
  }

  uploadPicture() {
    const userPicture=this.shadowRoot.getElementById("picture");
    return this.checkSession().then(()=>{
      
      this.pictureFile=userPicture.getFile();
      
      if(this.pictureFile){
          var headers=new Headers();
          this.picture=`${this.baseURL}/profiles/${this.sub}/${this.pictureFile.name}`;
          if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken())
          //console.log("doAction")
          const field = this.shadowRoot.getElementById('picture');
          fetch(this.apiURL+"/profile/getpictureuploadurl?filename="+this.pictureFile.name,{"headers" : headers, "method":"GET"})
            .then((response)=>{
              console.log(response);
              response.json() 
              .then((data) => {
                fetch(data.uploadURL, {
                  method: 'PUT',
                  body: this.pictureFile,
                  mode: "cors"
                })
                .then( (response) => {
                    var attributeList = [];
                    attributeList.push(
                      new CognitoUserAttribute({
                        Name : 'picture',
                        Value : this.picture
                      }));
                      this.currentUser.updateAttributes(attributeList, function(err, result) {
                        if (err) {
                            this.say(err.message || JSON.stringify(err));
                            return;
                        }
                        console.log('call result: ' + result);
                    }.bind(this));  
                });
              }) 
            })
      } 
    })     
 
  }

  logout(){
    console.log("logout " + this.name);
    userPool.getCurrentUser().signOut();
    this.state=status.ANONIMOUS;
    this.currentUser=null;
    this.sub="";
    this.username="";
    this.name="";
    this.nickname="";
    this.website="";
    //this.psw="";
    this.email="";
    this.phone="";
    this.session=null;
    this.userAttributes=null;
    this.picture=null;
    this.pictureFile=null
  }

  changeName(e) {
        this.name=e.target.value;  
        //console.log("changed " + this.name)
      }
  changePsw(e) {
        //this.psw=e.target.value;  
        //console.log("changed")
      }

  changeNewPsw(e) {
        const check=' <span style="color:green; font-size:+1">&#10004;</span>';
        const bad=' <span style="color:red; font-size:+1">&#9940;</span>';
        let newPsw=this.shadowRoot.getElementById("newpsw").value;
        let newPsw2=this.shadowRoot.getElementById("newpsw2").value;
        let ok=true, msg="";
        //console.log(newPsw,newPsw2)
        
    
        msg+= '<ul style="text-align:right;list-style-type: none;"><li>'+i18n('at least 8 characters');
        if(newPsw.length >= 8) msg +=check;
        else {ok=false; msg+=bad;};

        msg+= "</li><li>"+i18n("at least 1 uppercase letter");
        if(newPsw.match(/[A-Z]/)) msg +=check;
        else {ok=false; msg+=bad;};

        msg+= "</li><li>"+i18n("at least 1 lowercase letter");
        if(newPsw.match(/[a-z    const userPicture=this.shadowRoot.getElementById("picture");]/)) msg +=check;
        else {ok=false; msg+=bad;};

        msg+= "</li><li>"+i18n("use at least 1 number");
        if(newPsw && newPsw.match(/[0-9]/)) msg +=check;
        else {ok=false; msg+=bad;};

        msg+="</li><li>"+i18n("retype match");
        if(newPsw == newPsw2) msg +=check;
        else {ok=false; msg+=bad;};

        msg+="</li></ul>";

        this.say(msg);
        this.shadowRoot.getElementById("proceed").disabled=!ok;  
        //console.log("changed newpsw")
  }

  changePhone(e) {
        this.phone=e.target.value;  
        //console.log("changed " + this.phone)
      }
  changeEmail(e) {
        this.email=e.target.value;  
        //console.log("changed " + this.email)
      }    
  

  parseAttributes(cognitoUser){
    if(cognitoUser)
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            this.say(err.message);
            return;
        }
        result.forEach(attr => {
          //console.log('attribute ' + attr.getName() + ' has value ' + attr.getValue());
          if(attr.getName()=="email") this.email=attr.getValue();
          if(attr.getName()=="name") this.name=attr.getValue();
          if(attr.getName()=="nickname") this.nickname=attr.getValue();
          if(attr.getName()=="website") this.website=attr.getValue();
          if(attr.getName()=="sub") this.sub=attr.getValue();
          if(attr.getName()=="cognito:username") this.username=attr.getValue();
          if(attr.getName()=="picture") this.picture=attr.getValue();
        }); 
        this.userAttributes=result;
        this.state=status.LOGGED;
        this.requestUpdate();
        let event = new CustomEvent('user-ready', { 
          detail: {  },
          bubbles: true, 
          composed: true });
        this.dispatchEvent(event);
        //console.log(result);
      }.bind(this));
  }

  updateAttributes(){
    var attributeList = [];

    attributeList.push(
      new CognitoUserAttribute({
        Name : 'name',
        Value : this.shadowRoot.getElementById("name").value
      })
    )
    attributeList.push(
      new CognitoUserAttribute({
        Name : 'nickname',
        Value : this.shadowRoot.getElementById("nickname").value
      })
    )
    attributeList.push(
      new CognitoUserAttribute({
        Name : 'website',
        Value : this.shadowRoot.getElementById("website").value
      })
    )


    

    this.currentUser.updateAttributes(attributeList, function(err, result) {
        if (err) {
            this.say(err.message || JSON.stringify(err));
            return;
        }
        //console.log('call result: ' + result);
        this.parseAttributes(this.currentUser);
    }.bind(this));

  } 


  authenticate(e) {
        //console.log("Auth!")
        var authenticationData = {
                Username : this.email, // your username here
                Password : this.shadowRoot.getElementById("psw").value, // your password here
        };
        var authenticationDetails = 
                new AuthenticationDetails(authenticationData);
        this.cognitoUser =new CognitoUser({ Username : this.email, Pool : userPool});
        this.cognitoUser.authenticateUser(authenticationDetails, this.authenticateObj);
      }
  
    signUp(e){

      let newPsw=this.shadowRoot.getElementById("newpsw").value;
      var attributeList = [];
      var attributeName = new CognitoUserAttribute({ Name : 'name',Value : this.name});

      attributeList.push(attributeName);
      //var thisObject=this;
      
      userPool.signUp(this.email, newPsw, attributeList, null, function(err, result){
          if (err) {
              console.log(err);
            
              this.say(err.message);
              return;
          }
          this.state=status.CONFIRM;
      }.bind(this), {
        "site": window.location.hostname,
        "site_url": window.location.toString()
      });

    }

    confirmRegistration(username,code){ 
      var cognitoUser = new CognitoUser( {Username : username,Pool : userPool});
      cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            console.log(err.message);
            this.say(err.message);
            return;
        }
        console.log('call result: ' + result);
        this.message=i18n("Verified! please use your email and password to signin");
        this.state=status.SIGNIN;
      }.bind(this),
      this.clientMetadata());

    }

    confirm() {
      var code=this.shadowRoot.getElementById("code").value;
      this.confirmRegistration(this.email,code);
    }

    mfaCode() {
      this.cognitoUser.sendMFACode(verificationCode, this.authenticateObj);
    }
      

    userData() {
       return {
        Username : this.email,
        Pool : userPool
        }
    }

    clientMetadata(){
      return {
        "site": window.location.hostname,
        "site_url": window.location.toString().split("?")[0]
        }
    }

    forgotPassword(){
      
      console.log('forgot passwd')
      var cognitoUser = 
              new CognitoUser(this.userData());
      cognitoUser.forgotPassword(this.forgotPasswordObj,this.clientMetadata());
    }

    resendConfirmationCode(){
      
      console.log('resend confirmation code')
      var cognitoUser = 
              new CognitoUser(this.userData());
      cognitoUser.resendConfirmationCode(function(err, result) {
                if (err) {
                  alert(err.message || JSON.stringify(err));
                  return;
                }
                console.log('call result: ' + result);
          },this.clientMetadata());
    }
    
    confirmForgotPassword() {
      var cognitoUser = new CognitoUser(this.userData());
      let newPsw=this.shadowRoot.getElementById("newpsw").value;
      let verificationCode=this.shadowRoot.getElementById("vcode").value;
      cognitoUser.confirmPassword(verificationCode, newPsw, this.forgotPasswordObj,this.clientMetadata());
    }


    changePassword() {
      let newPsw=this.shadowRoot.getElementById("newpsw").value;
      
      if(this.state==status.FORCED_CHANGEPSW) {
        this.cognitoUser.completeNewPasswordChallenge(newPsw,this.requiredAttributes,this.authenticateObj);
        return;
      }
      
      let oldPsw=this.shadowRoot.getElementById("psw").value;
      this.currentUser.changePassword(oldPsw, newPsw, function(err, result) {
          if (err) {
              this.say(err.message || JSON.stringify(err));
              return;
          }
          //console.log('call result: ' + result);
          //this.logout();
          this.state=status.LOGGED;
      }.bind(this), this.clientMetadata());
    }

    nameInitials() {
      var initials = this.name.match(/\b\w/g) || [];
      initials=initials.join('');
      //console.log(initials);
      return initials;
    }
  

}


// Register the element with the browser
customElements.define('near-user', NearUser);

NearUser.instance=null;
NearUser.status=status;



