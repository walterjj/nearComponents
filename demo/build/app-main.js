import { i as i$1, b as i$2, c as b, n as nearPicoTokens, a as nearControlStyles, A, E, N as NearLocation, d as NearRoute } from './drawerbutton-DZ1isS1h.js';

if (typeof window !== 'undefined' && typeof window.ga !== 'function') {
  window.ga = () => {};
}

function trackGa(...args) {
  if (typeof window !== 'undefined' && typeof window.ga === 'function') {
    window.ga(...args);
  }
}

class UserPicture extends i$1 {
        static get styles() {
                return i$2`
                    :host {
                        padding:1em;
                        nborder-top: solid 1px #ccc;
                        display:flex;
                        justify-content:center;
                        justify-items:center;
                
                    } 
                    :host > div { border: none;min-height:100px}
                    img{ width:200px ;
                         display:block;
                         clip-path: circle(50% at center);}
                        

                    .dropper {
                        width:200px; 
                        height:200px;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        background-color:#8883;
                        nopacity: .3;
                        nborder: solid 1px;
                        clip-path: circle(50% at center);         
                        }
                     input {max-width:200px}   
                
                    
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
                src: {type:String}                
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
                this.file = null;
                this.src="";
        }

        render() {
                return b`
                <div @drop="${this.onDrop}"
                        @dragover="${this.onDragover}"
                        @dragenter="${this.onDragover}" >
                ${this.src?         
                        b`<div class="dropper"><img src="${this.src}"/></div>`
                        : b`<div class="dropper">drag & drop here</div>`}       
                
                <input  id="in"
                        type="file"
                        @change="${this.changed}"        
                        value="pick"
                
                >
                </div>
                `;
        }

        onDragover(e){
                console.log(e.dataTransfer);
                //e.dataTransfer.dropEffect = '';
                e.preventDefault();
                return true;
         
        }

        onDrop(e){
                console.log(e.dataTransfer.types);
                //console.log(e.dataTransfer.getData('text/uri-list'));
                console.log(e.dataTransfer.files);
                //var htmlData= e.dataTransfer.getData('text/uri-list');
                var files = e.dataTransfer.files;
                if(files) {
                        this.file=files.item(0);
                        this.src=URL.createObjectURL(this.file);
                        this.pictureChanged();
                        this.requestUpdate(); 
                }
                e.preventDefault();
         
        }

        changed(e) {
                this.state++;
                var input = this.shadowRoot.getElementById('in');
                
                this.file=input.files.item(0);
                this.src=URL.createObjectURL(this.file);
                this.pictureChanged();
                this.requestUpdate(); 
        }

        pictureChanged(){
                let event = new CustomEvent('picture-change', { 
                        detail: { message: 'picture-change triggered.' },
                        bubbles: true, 
                        composed: true });
                this.dispatchEvent(event);
        }

        getFile(){
                return this.file;
        }

}

customElements.define('user-picture', UserPicture);

let  CognitoUserPool=null; 
let  CognitoUserAttribute=null; 
let  CognitoUser=null;  
let  AuthenticationDetails=null; 





var poolData; 
var userPool;

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
});

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
    "register": "registrarse",
    "forgot password": "olvidé mi password",
    "confirm": "confirmar",
    "Name": "Nombre",
    "New password": "Nueva password",
    "retype password": "Retipear password",
    "Register!": "Registrarme!",
    "Your confirmation code": "Código de confirmación",
    "I have a confirmation code" : "tengo un código de confirmación",
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
    "edit profile": "modificar perfil",
    "change picture": "cambiar foto",
    "change password": "cambiar password",
    "logout": "salir",
    "my account": "mi cuenta",
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

class NearUser extends i$1 {
  
  static get styles() {
  return [
    nearPicoTokens,
    nearControlStyles,
    i$2`
      :host > near-modal{ position:fixed;height:100vh; top:0; left:0; bottom:0; right:0; background-color: rgba(0,0,0,.5); display:flex; justify-content:center;align-items:center;padding:2em }
      :host([hidden]) { display: none; }
      near-modal a{font-size:-3;color:#555;cursor:pointer}
      .inverse {
        
        no--mdc-theme-primary: #8888;
        
      }
      :host > near-modal > div {
        background-color:#ffe;
        color:black;
        border:solid 2px #bbb;
        border-radius:6px;
        box-shawow: 0px 0px 8px --var(--mdc-theme-on-primary, #888);
        display:flex; 
        flex-direction:column;
        no-align-items: flex-end;
        justify-content:center;
        padding:3em;
        no-mdc-theme-primary: #057;
        width:400px;
        max-width:100vw;
      }
      input, textarea {
        border: solid 1px;
        border-bottom: solid 1px rgba(128,128,128,0.2);
        border-radius: 4px;
        padding:1em 0.5em ; 
        margin-top:.2em;
        color:#444;
        nwidth:100%;
        background-color:rgba(128,128,128, 0);
      }
      a[dense]{
        display:block;
        text-align:center;
        margin-top:.5em;
        padding:.5em;
        color:#057;
        width:100%;
      }
      label{
        display:flex;
        flex-direction:column;
      }

      #login_button {
        width:100%;
        justify-content:center;
      }
      #name_button {
        padding: 0;
        display: flex;
        height: 60px;
        width: 60px;
        font-size: 20px;
        border: none;
        background-color: rgba(255, 255, 255, 0.5);
        /* overflow: hidden; */
        clip-path: circle(50% at 50% 50%);
        align-items: center;
        justify-content: center;
      }
        #name_button img {
          object-fit:cover;
          max-width:62px;     
          clip-path: circle(50% at center);
        }
       near-modal button { margin-top:1em; margin-bottom:1em; }
       #menu::part(panel){ margin-top:.35rem; }
       .near-menu-item { color:var(--near-color); }
       #message { color:red; font-size:small; margin-top:1em; text-align:center;}
       #links{
          margin-top:3em;
       }
      `];
    }



  /**
   * Define properties. Properties defined here will be automatically 
   * observed.
   */
  static get properties() {
    return {
      name: { type: String },
      state: {type: Number},
      currentUser: {type: CognitoUser},
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
    this.extra={};
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
    };
    this.authenticateObj= {
      onSuccess: function (result) {
          //console.log("Success")    
          result.getAccessToken().getJwtToken();
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
    };
    


  }


  attributeChangedCallback(name, oldval, newval) {
    
    if(name=="apiURL" && newval.slice(8).indexOf('/')==-1) 
        newval+= "/near";
    super.attributeChangedCallback(name, oldval, newval);    
  }


  async initAmz() {
    if(CognitoUserPool==null) {
     window.AmazonCognitoIdentity=null; 
     await import('./amazon-cognito-identity.min-K3AumAfF.js');
     //AmazonCognitoIdentity=AmazonCognitoIdentity || mod.AmazonCognitoIdentity;
     //.then(amz=>{
     //  console.log(amz);
     //})
     
     CognitoUserPool=AmazonCognitoIdentity.CognitoUserPool; 
     
     CognitoUserAttribute=AmazonCognitoIdentity.CognitoUserAttribute; 
     CognitoUser=AmazonCognitoIdentity.CognitoUser;  
     AuthenticationDetails=AmazonCognitoIdentity.AuthenticationDetails; 
     AmazonCognitoIdentity.CookieStorage;
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
     console.log("Amz SDK loaded UserPool=",userPool ); 
    }
    
  }

  checkSession(){
    return new Promise((resolve,reject)=>{
      if(this.currentUser!==null) {
        this.currentUser.getSession((err,sess)=> {
          if(err) {
            this.state=status.ANONIMOUS; 
            reject(err);
          }          this.session = sess;
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

      });
    } 
    
  }

  loginForm(){
    trackGa('send', 'event', 'UI', 'sign-in', window.location.href);
    return b`
    <near-modal>
     <div>
     <label>Email
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </label>
     <label>Password
       <input name="psw" id="psw" 
         type="password" value="" @change="${this.changePsw}">
     </label>    
     <button type="button" data-variant="primary" @click="${this.authenticate}"  >${i18n`authenticate`}</button>
     <div id="message">${this.message}</div> 
     <div id="links">
     ${ this.noregister? '' : 
     b`<a dense @click="${()=>{this.state=status.SIGNUP  ;console.log('register');}}" >${i18n("register")}</a>`}
     <a dense @click="${()=>{this.state=status.FORGOT; }}" >${i18n("forgot password")}</a>
     <a dense @click="${()=>{this.state=status.CONFIRM; }}" >${i18n("I have a confirmation code")}</a>
     <a dense @click="${()=>this.state=status.ANONIMOUS}"><near-icon name="cancel"></near-icon></a>
     </div>
     </div>
    </near-modal>`
  }

  updated(changedProperties) {
    if(this.state==status.SIGNIN) { 
      if("PasswordCredential" in window) {
        navigator.credentials.get({password:true}).then(cred=>{      
          if(cred) {
            this.email=this.shadowRoot.getElementById("email").value=cred.id;
            this.shadowRoot.getElementById("psw").value=cred.password;
          }
        });
      }
    }
    changedProperties.forEach((oldValue, propName) => {
      //console.log(`${propName} changed. oldValue: ${oldValue}`);
      if(propName=="name") { 
          var el= this.shadowRoot.getElementById("name_button");
          if (el) el.label=this.nameInitials();
      }
    });
  }


  signUpForm(){
    return b`
    <near-modal>
    <div>
     
     <label>Email
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </label>
     <label>${i18n`Name`}
       <input nclass="mdc-text-field__input" name="name" id="name" 
         type="text" .value="${this.name}" @change="${this.changeName}">
     </label>
     <label>${i18n`New password`}
       <input name="newpsw" id="newpsw" 
         type="password"  @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </label>     
     <label>${i18n`retype password`}
       <input name="newpsw2" id="newpsw2" 
         type="password"  @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">    
     </label> 
          
     <div id="message">${this.message}</div>      
     <button type="button" data-variant="primary" id="proceed" @click="${this.signUp}"  >${i18n`Register!`}</button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}"><near-icon name="cancel"></near-icon></a>
    </div>
    </near-modal>
   `; 

  }

  confirmationForm(){
    return b`
    <near-modal>
    <div>
     <p>${i18n`Your confirmation code`}:</p>
     <label>Email
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </label>
     <label>${i18n`Code`}
       <input name="code" id="code" 
         type="number">
     </label>
     <div id="message">${this.message}</div>  
     <button type="button" data-variant="primary" @click="${this.confirm}"  >${i18n`Go!`}</button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}"><near-icon name="cancel"></near-icon></a>
     
     </div>
     </near-modal>
   `; 
  }

  mfaForm(){
    return b`
    <near-modal>
    <div>
     <p>${i18n`Your code:`}</p>
     <label>${i18n`Code`}
       <input name="code" id="code" 
         type="number">
     </label>
     <div id="message">${this.message}</div>  
     <button type="button" data-variant="primary" @click="${this.mfaCode}"  >${i18n`Go!`}</button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}"><near-icon name="cancel"></near-icon></a>
     
     </div>
     </near-modal>
   `; 
  }


  changePasswordForm(){
    return b`
    <near-modal>
     <div>
     ${ this.state==status.CHANGEPSW?
        b`
          <label>${i18n`Old password`}
            <input name="psw" id="psw" 
              type="password" .value="" @change="${this.changePsw}">
          </label>
        ` 
        :``
     }
     <label>${i18n`New password`}
     <input name="newpsw" id="newpsw" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </label>
     <label>${i18n`Retype new password`}
       <input name="newpsw2" id="newpsw2" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </label> 
     <div id="message">${this.message}</div>       
     <button type="button" data-variant="primary" id="proceed"  @click="${this.changePassword}"  >${i18n`Change password!`}</button>
     <a dense @click="${()=>this.state=status.LOGGED}"><near-icon name="cancel"></near-icon></a>
     </div>
    </near-modal>`
  }

  forgotPasswordForm(){
    return b`
    <near-modal>
    <div>
     
     <label>Email
       <input name="email" id="email" 
         type="email" .value="${this.email}" @change="${this.changeEmail}">
     </label>
     <div id="message">${this.message}</div>      
     <button type="button" data-variant="primary" id="proceed" @click="${this.forgotPassword}">${i18n`continue`}</button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}"><near-icon name="cancel"></near-icon></a>
    </div>
    </near-modal>
   `; 

  }

  forgotPasswordConfirmForm(){
    return b`
    <near-modal>
     <div>
     <label>${i18n`Verification code`}
       <input name="vcode" id="vcode" 
         type="text" value="${this.hasOwnProperty('vcode')? this.vcode : ''}">
     </label>
     <label>${i18n`New password`}
       <input name="newpsw" id="newpsw" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </label>
     <label>${i18n`Retype new password`}
       <input name="newpsw2" id="newpsw2" 
         type="password" .value="" @keyup="${this.changeNewPsw}"  @change="${this.changeNewPsw}">
     </label> 
     <div id="message">${this.message}</div>       
     <button type="button" data-variant="primary" id="proceed"  @click="${this.confirmForgotPassword}"  >${i18n`Change password!`}</button>
     <a dense @click="${()=>this.state=status.ANONIMOUS}"><near-icon name="cancel"></near-icon></a>
     </div>
    </near-modal>`
  }

  editProfileForm(){
    return b`
    <near-modal>
    <div>
  
    
     <user-picture id="picture" 
          @picture-change="${this.uploadPicture}"
          src="${this.picture}"></user-picture> 
     
     <label>Email
       <input disabled name="email" id="email" 
         type="email" .value="${this.email}">
     </label>
     <label>${i18n`Name`}
       <input nclass="mdc-text-field__input" name="name" id="name" 
         type="text" .value="${this.name}" nchange="${this.changeName}">
     </label>
     <label>${i18n`Nickname`}
       <input nclass="mdc-text-field__input" name="nickname" id="nickname" 
         type="text" .value="${this.nickname}" nchange="${(e)=>this.nickname=e.target.value}">
     </label>
     <label>${i18n`Website`}
       <input nclass="mdc-text-field__input" name="website" id="website" 
         type="text" .value="${this.website}" nchange="${(e)=>this.website=e.target.value}">
     </label>
     <label>${i18n`Extra`}
       <textarea  name="extra" id="extra">${JSON.stringify(this.extra,null,2)}</textarea>  
     </label>        
          
     <div id="message">${this.message}</div>
           
     <button type="button" data-variant="primary" id="proceed" @click="${this.updateAttributes}">${i18n`Update!`}</button>
     <a dense @click="${()=>this.state=status.LOGGED}"><near-icon name="cancel"></near-icon></a>
    </div>
    </near-modal>
   `; 

  }

  editPictureForm(){
    return b`
    <near-modal>
    <div>
     <user-picture id="picture" 
          @picture-change="${this.uploadPicture}"
          src="${this.picture}"></user-picture> 
     
     <div id="message">${this.message}</div>
     <button type="button" data-variant="primary" id="proceed" @click="${()=>this.state=status.LOGGED}" >${i18n`close`}</button>
    </div>
    </near-modal>
   `; 

  }


  say(m) {
    var el=this.shadowRoot.getElementById("message");
    if(el) el.innerHTML=m;
    else  console.log("say: "+m);
  }                  

  openMenu(){
    //this.shadowRoot.getElementById('menu').setAttribute('open',true);
    //console.log("openMenu");
    //this.shadowRoot.getElementById('menu').toggleMenu();
    let menu = this.shadowRoot.getElementById('menu');
    if (menu && menu.openMenu) menu.openMenu();
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
                    
            return b`
              <div>
              <near-dropdown id="menu" align="end">
                <button id="name_button" class="inverse" slot="trigger">
                ${ this.picture?
                  b`<img src="${this.picture}">`
                  : this.nameInitials()}
                </button>
                <button type="button" class="near-menu-item" @click="${this.doAction}" >go</button>
                <button type="button" class="near-menu-item" @click="${()=>this.state=status.EDIT_PROFILE}">${i18n`edit profile`}</button>
                <button type="button" class="near-menu-item" @click="${()=>this.state=status.EDIT_PICTURE}">${i18n`change picture`}</button>
                <button type="button" class="near-menu-item" @click="${()=>this.state=status.CHANGEPSW}">${i18n`change password`}</button>
                <button type="button" class="near-menu-item" @click="${this.logout}">${i18n`logout`}</button>
              </near-dropdown>
              
              </div>
              `
    }    if (this.state== status.ANONIMOUS) {
      let label= this.signInLabel || i18n('Sign in');
      return b`<button type="button" id="login_button" @click="${()=>{this.state=status.SIGNIN;}}">
        <near-icon name="person"></near-icon>
        ${label}
      </button>
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
      //this.doUpload();
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
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
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
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
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
      if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
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
    console.log("doUpload");
    const payload = 'hola4';
    const key="inbox/hola2.txt";
    console.log("canUpload:",this.canUpload(key));
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
            h.forEach(function(v){console.log(v);});
            
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
            h.forEach(function(v){console.log(v);});
            
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
        +`&prefix=${encodeURIComponent(prefix)}`;
      let params={"headers" : headers, "method":"PUT"};  
      if(typeof(keyId)=='string')
        query+=`&id=${encodeURIComponent(keyId)}`;
      else 
        params.body=JSON.stringify(keyId);
      return fetch(this.apiURL+`/documents.putGeo?${query}`,params )
      .then(response=> { return response.json()}); 
    })
  }


  getDocumentsByGeo(prefix='geo',precision=10){
    if (navigator.geolocation) {
      return new Promise ((resolve)=>navigator.geolocation.getCurrentPosition(position=>{            
            resolve(this.getDocumentsByGeoLngLat(position.coords.longitude,position.coords.latitude,prefix, precision));
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
        +`&prefix=${encodeURIComponent(prefix)}`;
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
          if (this.session) headers.append("Authorization",this.session.idToken.getJwtToken());
          //console.log("doAction")
          this.shadowRoot.getElementById('picture');
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
              }); 
            });
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
    this.pictureFile=null;
    this.groups=null;
    let event = new CustomEvent('user-logout', { 
      detail: {  },
      bubbles: true, 
      composed: true });
    this.dispatchEvent(event);
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
        else {ok=false; msg+=bad;}
        msg+= "</li><li>"+i18n("at least 1 uppercase letter");
        if(newPsw.match(/[A-Z]/)) msg +=check;
        else {ok=false; msg+=bad;}
        msg+= "</li><li>"+i18n("at least 1 lowercase letter");
        if(newPsw.match(/[a-z    const userPicture=this.shadowRoot.getElementById("picture");]/)) msg +=check;
        else {ok=false; msg+=bad;}
        msg+= "</li><li>"+i18n("use at least 1 number");
        if(newPsw && newPsw.match(/[0-9]/)) msg +=check;
        else {ok=false; msg+=bad;}
        msg+="</li><li>"+i18n("retype match");
        if(newPsw == newPsw2) msg +=check;
        else {ok=false; msg+=bad;}
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
          console.log('attribute ' + attr.getName() + ' has value ' + attr.getValue());
          if(attr.getName()=="email") this.email=attr.getValue();
          if(attr.getName()=="name") this.name=attr.getValue();
          if(attr.getName()=="nickname") this.nickname=attr.getValue();
          if(attr.getName()=="website") this.website=attr.getValue();
          if(attr.getName()=="sub") this.sub=attr.getValue();
          if(attr.getName()=="cognito:username") this.username=attr.getValue();
          if(attr.getName()=="picture") this.picture=attr.getValue();
          if(attr.getName()=="custom:properties") {
            try {
              this.extra=JSON.parse(attr.getValue());
            } catch (error) {
              console.log("properties", error);
            } 
            
          }
        }); 
        this.userAttributes=result;
        this.state=status.LOGGED;
        this.groups=cognitoUser.signInUserSession.accessToken.payload['cognito:groups'];
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
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name : 'nickname',
        Value : this.shadowRoot.getElementById("nickname").value
      })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name : 'website',
        Value : this.shadowRoot.getElementById("website").value
      })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name : 'custom:properties',
        Value : this.shadowRoot.getElementById("extra").value
      })
    );


    

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
        if ("PasswordCredential" in window) {
          let credential = new PasswordCredential({
            id: this.shadowRoot.getElementById("email").value,
            name: this.name, // In case of a login, the name comes from the server.
            password: authenticationData.Password
          }); 
          navigator.credentials.store(credential).then(() => {
            console.info("Credential stored in the user agent's credential manager.");
          }, (err) => {
            console.error("Error while storing the credential: ", err);
          });
        }
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
      
      console.log('forgot passwd');
      var cognitoUser = 
              new CognitoUser(this.userData());
      cognitoUser.forgotPassword(this.forgotPasswordObj,this.clientMetadata());
    }

    resendConfirmationCode(){
      
      console.log('resend confirmation code');
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

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={CHILD:2},e$1=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class e extends i{constructor(i){if(super(i),this.it=A,i.type!==t.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(r){if(r===A||null==r)return this._t=void 0,this.it=r;if(r===E)return r;if("string"!=typeof r)throw Error(this.constructor.directiveName+"() called with a non-string value");if(r===this.it)return this._t;this.it=r;const s=[r];return s.raw=s,this._t={_$litType$:this.constructor.resultType,strings:s,values:[]}}}e.directiveName="unsafeHTML",e.resultType=1;const o=e$1(e);

/**
@license

*/



class NearApp extends i$1 {


        static get styles() {
                return [
                nearPicoTokens,
                nearControlStyles,
                i$2`
  
                :host {
                        --swiper-right: 2em;
                        --container-max-width: 1024px;
                        --toolbar-width: 100%;
                        --near-toolbar-height: 50px;
                        display: block;
                        }
                a {
                        font-size: inherit;
                }
                @media only screen and (min-width:993px) {
                        :host {
                                --container-max-width: 70%;     
                        }

                }

                .toolbar {
                        position:sticky;
                        top:0;
                        z-index:1000;
                        box-sizing:border-box;
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:1rem;
                        height:var(--near-toolbar-height);
                        padding:0 1rem;
                        width:100%;
                        font-size:14px;
                        color:var(--near-primary-inverse, #fff);
                        background:var(--near-primary-background, #034);
                        box-shadow:var(--near-box-shadow);
                }
                .toolbar img {vertical-align:middle}
                .toolbar-main,
                .toolbar-actions {
                        display:flex;
                        align-items:center;
                }
                .toolbar-main {
                        gap:0.75rem;
                        min-width:0;
                        flex:1 1 auto;
                }
                .toolbar-actions {
                        gap:0.75rem;
                        justify-content:flex-end;
                        flex:1 1 auto;
                }
                .toolbar-title {
                        min-width:0;
                        font-size:1.05rem;
                        font-weight:600;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                }
                .toolbar-menu-button {
                        color:inherit;
                        border-color:transparent;
                        background:transparent;
                        box-shadow:none;
                }
                .toolbar-menu-button:hover,
                .toolbar-menu-button:focus-visible {
                        color:inherit;
                        border-color:rgb(255 255 255 / 0.35);
                        background:rgb(255 255 255 / 0.12);
                }
                .toolbar-nav {
                        display:flex;
                        align-items:center;
                        gap:0.25rem;
                        flex-wrap:wrap;
                }
                .toolbar-nav a,
                .toolbar-nav button,
                .topbar-item {
                        margin:0;
                        border:1px solid transparent;
                        border-radius:999px;
                        display:inline-flex;
                        align-items:center;
                        gap:0.4rem;
                        padding:0.625rem 0.875rem;
                        position:relative;
                        cursor:pointer;
                        text-decoration: none;
                        color:inherit;
                        background:transparent;
                        font:inherit;
                        font-variant-caps:small-caps !important;
                }
                .toolbar-nav a:hover,
                .toolbar-nav button:hover,
                .topbar-item:hover,
                .toolbar-nav a.near-selected,
                .toolbar-nav button.near-selected,
                .topbar-item.near-selected {
                        border-color:rgb(255 255 255 / 0.3);
                        background:rgb(255 255 255 / 0.12);
                        color:inherit;
                }
                .toolbar-nav near-dropdown::part(panel) {
                        margin-top:0.25rem;
                }
                .toolbar-nav near-dropdown .near-menu-item,
                .toolbar-actions near-dropdown .near-menu-item {
                        color:var(--near-color);
                }
                .toolbar-user {
                        display:flex;
                        align-items:center;
                }
                .app-shell {
                        position:relative;
                        display:block;
                        min-height:calc(100vh - var(--near-toolbar-height));
                }
                .drawer-backdrop {
                        position:fixed;
                        inset:0;
                        background:rgb(15 23 34 / 0.45);
                        opacity:0;
                        pointer-events:none;
                        transition:opacity 160ms ease;
                        z-index:990;
                }
                .drawer-panel {
                        position:fixed;
                        top:var(--near-toolbar-height);
                        left:0;
                        bottom:0;
                        width:min(19rem, calc(100vw - 2rem));
                        padding:1rem 0;
                        border-right:1px solid var(--near-border-color);
                        background:var(--near-surface-color, #fff);
                        box-shadow:var(--near-box-shadow);
                        overflow:auto;
                        transform:translateX(-105%);
                        transition:transform 160ms ease;
                        z-index:995;
                }
                .app-shell.drawer-open .drawer-backdrop {
                        opacity:1;
                        pointer-events:auto;
                }
                .app-shell.drawer-open .drawer-panel {
                        transform:translateX(0);
                }
                .app-shell.drawer-static {
                        padding-left:18rem;
                }
                .app-shell.drawer-static .drawer-backdrop {
                        display:none;
                }
                .app-shell.drawer-static .drawer-panel {
                        width:18rem;
                        transform:none;
                }
                .drawer-header {
                        display:grid;
                        gap:0.25rem;
                        padding:0 1.25rem 1rem;
                        border-bottom:1px solid var(--near-border-color);
                        margin-bottom:1rem;
                }
                .drawer-title {
                        font-size:1rem;
                        font-weight:700;
                        color:var(--near-color);
                }
                .drawer-content div > a,
                .drawer-link{
                        display:block;
                        text-align:left;
                        margin:0 0.75rem;
                        padding:.65rem .8rem;
                        border-radius:0.75rem;
                        color:var(--near-color);
                        cursor:pointer;
                        text-decoration: none;
                }
                .drawer-content div > a:hover,
                .drawer-link:hover,
                .drawer-link.near-selected {
                        background:var(--near-primary-soft);
                        color:var(--near-primary);
                }
                .drawer-group-title{
                        font-size: 0.8rem;
                        font-weight:700;
                        letter-spacing:0.08em;
                        text-transform:uppercase;
                        text-align:left;
                        color:var(--near-muted-color);
                        margin:0 1.5rem 0.75rem;
                }
                .drawer-group-separator{
                        width:calc(100% - 3rem);
                        border-top:solid 1px var(--near-border-color);
                        margin:1rem 1.5rem;
                }
                .menu-trigger near-icon {
                        font-size:0.95em;
                }
                #app-content {
                        min-width:0;
                }


                .main-content{
                        
                        min-height:calc(100vh - var(--near-toolbar-height));
                        text-align:left;
                        margin:1em;
                }

                #pages {
                        border-bottom:solid  1px #8884;
                        display:block;
                }
                #pages:empty {border:none}
                #pages > a {
                        border: 1px solid transparent;
                        border-radius: 4px 4px 0 0; 
                        position:relative;
                        bottom:-1px;
                        padding:.5em;
                        font-size:14px;
                        margin:0;
                        color:#08f;
                }
                #pages > a.near-selected {
                        border: 1px solid #8884;
                        border-bottom-color: transparent;
                        background-color:white;
                }

                .screen{
                        display: flex;        
                        flex-direction: column;
                        justify-content:center;
                        text-align: center;
                        height: calc(100vh - 60px);
                }


                header {
                        position:relative;
                        @apply --layout-horizontal;
                        @apply --layout-center-center;
                        height: calc(100vh - var(--near-toolbar-height));
                        padding: 0 16px;
                        background-image: url('/jm1440.jpg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-color: #034;
                        color: white;
                        text-align: center;
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                        

                }


                .banner {
                        background-image: url('/banner.jpg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-color: #034;
                        color: white;
                        text-align: left;
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                        margin:-1em;
                        

                }
                .banner > div {
                        max-width:800px;
                        display:flex;
                        padding-top:32px;
                        margin:0 auto ;
                        align-items:center;
                        width:100%;
                }

                .banner  img {max-width:100px;max-height:100px; opacity:.7;}
                .banner  h2 {
                        font-size: 30px;
                        font-weight: 900;
                        
                }

                .main-contentsection {
                        padding: 88px 16px;
                        min-height: calc(50vh - var(--near-toolbar-height));
                }

                header.banner {
                        height:10vh;

                }

                header > img {max-width:150px; opacity:.5}

                header >  h2 {
                        font-size: 56px;
                        font-weight: 300;
                        margin: 0;
                        
                }
                header h2 {
                        font-size: 56px;
                        font-weight: 300;
                        font-weight: 300;
                        margin: 0;
                        
                }

                header > p {
                        font-size: 32px;
                        
                }
                header  p {
                        font-size: 32px;
                        margin:0;
                        
                }
                header  blockquote {
                        position:absolute;
                        bottom:0;
                        right:0;
                        font-variant:normal;
                        max-width:400px;
                        margin:2em;
                        
                }
                header  blockquote > author {
                        margin-top:1em;
                        text-align:right;
                        display:block;
                }

                #mdsection {
                        padding: 1em 0px;
                        nfont-family: 'Cormorant Garamond', serif;
                        min-height: calc(50vh - var(--near-toolbar-height));
                }
                
                

                .container{clear:both}

                .container {
                        max-width: var(--container-max-width);
                        margin: 0 auto;
                }

                .container > * {
                        @apply --layout-flex;
                }

                .container img {
                        max-width: 100%;
                        max-height: 100%;
                }

                .ncontainer h3 {
                        font-size: 32px;
                        font-weight: 300;
                        margin: 24px 0;
                }

                .container p {
                        line-height: 1.5;
                }

                :root {
                        --container: {
                                max-width: var(--container-max-width);
                                margin: 0 auto;
                        };
                }


                @media (min-width: 600px) {
                        .toolbar iron-selector { display:inherit}
                }

                @media (max-width: 600px) {
                        .container {
                        @apply --layout-vertical;
                        }
                        header h2  {
                        font-size: 30px;
                        }
                        .banner h2 {
                        font-size: 20px;
                        }
                        header p { font-size:25px}
                        header {
                        @apply --layout-vertical;
                        }
                        header blockquote {
                        font-size:14px;
                        
                        }
                
                        .toolbar {
                        font-size:12px;
                        }
                        .tabs a {
                        margin: 12px 8px 12px;
                        }
                        

                }
                @media (max-width: 900px) {
                        .toolbar {
                                flex-wrap:wrap;
                        }
                        .toolbar-actions {
                                width:100%;
                                justify-content:space-between;
                        }
                        .toolbar-nav {
                                order:2;
                                width:100%;
                                overflow:auto;
                                flex-wrap:nowrap;
                                padding-bottom:0.25rem;
                        }
                }
                @media (max-width: 700px) {
                        .app-shell.drawer-static {
                                padding-left:0;
                        }
                        .app-shell.drawer-static .drawer-panel {
                                width:min(19rem, calc(100vw - 2rem));
                                transform:translateX(-105%);
                        }
                        .app-shell.drawer-static.drawer-open .drawer-panel {
                                transform:translateX(0);
                        }
                        .app-shell.drawer-static .drawer-backdrop {
                                display:block;
                        }
                        .toolbar-actions {
                                align-items:flex-start;
                        }
                        .toolbar-user {
                                margin-left:auto;
                        }
                }

                h3 {
                        font-family: 'Raleway', sans-serif;
                        font-variant: small-caps;
                }

                        
                figure{
                        text-align:center;
                        margin-inline-start:0;
                        margin-inline-end:0;
                        margin-block-start:0;
                        margin-block-end:0 }
                figure img, figure video, figure iframe {max-width:100%}
                figcaption{color:#888; font-size:small; font-style: italic;margin:.5em }  
                
                blockquote {color:#777; font-style:italic; font-size:larger;}

                .collapse {display:none !important}

                @media (min-width: 600px) {
                        .collapse {display:inline-block !important}
                        .toolbar iron-selector { display:inherit}
                        figure[right]{float:right; max-width:60%; margin:1em 0 1em 1em;}
                        figure[right] img, figure[left] img {}
                        figure[left]{float:left;  max-width:60%; margin:1em 1em 1em 0;}
                }
                .spinner,.spinner:after{
                        width:64px;
                        height:64px;
                        min-width:64px;
                        min-height:64px;
                        display:block;
                        nposition: fixed;
                        ntop: 50%;
                        nleft: 50%;
                        margin:32px auto; 
                        border-radius: 50%;
                }
                .spinner {
                        background-color: transparent;
                        border-top: 3px solid rgb(66,139,202);
                        border-right: 3px solid rgb(66,139,202);
                        border-bottom: 3px solid rgb(66,139,202);
                        border-left: 3px solid rgba(66,139,202,.2);
                        transform: translateZ(0);
                        animation-iteration-count: infinite;
                        animation-timing-function: linear;
                        animation-duration: .8s;
                        animation-name: spinner-loading
                }
                @keyframes spinner-loading{
                        0% {
                        transform: rotate(0deg)
                        } to {
                        transform: rotate(1turn)
                        }
                }


 
                

                h1{font-size:3em; line-height:1.1} 
                .byline,.dateline{border:none;font-size:small; text-align:right}
                .byline{font-weight:bold}
                .byline img{ margin: 0 1em 0 0; display:inline-block; max-width:50px;
                clip-path: circle(50% at center); float:left;}  
                .byline{font-weight:bold}
                .dateline{color:#8888}
                #home-swiper {height:50vh}
                @media (min-width:1000px) {
                        #home-swiper {height:90vh} 
                }
                
                .toc li{list-style-type:none}
                
        `
        ];

        }
        renderDrawerItem(item) {
                return b`
                        <a class="drawer-link ${this.isCurrentPath(item.href) ? 'near-selected' : ''}" is="near-route" href="${item.href}">${item.label}</a>
                `
        }
        renderDrawerList(item) {
                return b`
                        <div class="drawer-group-title">${item.label}</div>
                        ${item.items?.map(item => {
                        return this.renderDrawerItem(item)
                })}
                <div class="drawer-group-separator"></div>
                `
        }

        renderDrawerApps(icon="label") {
                let r=[];
                if(NearUser.instance && NearUser.instance.groups){
                        NearUser.instance.groups
                                .filter(group=>group.startsWith("app:"))
                                .forEach(group=>{
                                        let name=group.substring(4);
                                        r.push(
                                                b`<drawer-button icon="${icon}" href="/app/${name}/">${name.replace('_', ' ')}</drawer-button>`
                                        );
                                });
                }
                return r;
        }

        isCurrentPath(href='') {
                if (!href) return false;
                const pathname = window.location.pathname;
                return pathname === href || pathname.endsWith(href);
        }

        renderMenuItem(item) {
                return b`
                <a
                        class="topbar-item ${this.isCurrentPath(item.href) ? 'near-selected' : ''}"
                        data-route-link
                        is="near-route"
                        href="${item.href}"
                >${item.label}</a>
        `
        }

        renderMenuList(item) {
                return b`
                        <near-dropdown align="start">
                                 <button type="button" class="topbar-item menu-trigger" slot="trigger">
                                         ${item.label}
                                         <near-icon name="arrow_drop_down"></near-icon>
                                 </button>
                                ${item.items?.map(item => {
                                        return b`
                                        <a class="near-menu-item" is="near-route" href="${item.href}">${item.label}</a>
                                        `
                                        
                                })}
                        </near-dropdown>
        `
        }


        drawerMenu() {
                let r=[];
                if(this.component) r.push(b`${o(this.component.drawerMenu(this.page))}`); 
                r.push (b`
                ${this.navigationMenu?.items?.map(item => {
                        return item.items ? this.renderDrawerList(item) : this.renderDrawerItem(item)
                })}        
                `);
                r.push(this.renderDrawerApps());
                return r;
        }

        menu() {
                return b`
        
                ${this.navigationMenu?.items?.map(item => {
                        return item.items ? this.renderMenuList(item) : this.renderMenuItem(item)
                })}
          `;
        }

        pageMenu() {
                if (NearUser.canCreate() || NearUser.canEdit())
                        return b`
          <near-dropdown id="edit-menu" align="start">
            <button type="button" class="topbar-item menu-trigger" slot="trigger">Edit...
              <near-icon name="arrow_drop_down"></near-icon>
            </button>
            ${NearUser.canCreate() ?
                                        b`<button type="button" class="near-menu-item" @click="${this.newArticle}">New Article...</button>
            <button type="button" class="near-menu-item" @click="${this.articles}">Articles...</button>
            ` : ''}

            ${NearUser.canEdit() ?
                                        b`<button type="button" class="near-menu-item" @click="${this.editMeta}">Edit Meta...</button>
            `: ''}
 
            ${NearUser.canAdmin() ?
                                        b`
            <button type="button" class="near-menu-item" @click="${this.newContent}">Admin: New Content...</button>
            <button type="button" class="near-menu-item" @click="${this.invalidate}">Admin: Clear CDN Cache</button>
            `
                                        : ''}

            </near-dropdown>
         `
                return ''

        }

        userExtra() { }

        topBarTitle() {
                return b`${this.title}`;
        }

        renderTopBar() {
                return b`<header class="toolbar">
          <div class="toolbar-main">
          <button type="button" class="near-icon-button toolbar-menu-button" @click="${this.handleNavigationClick}" aria-label="Open navigation">
            <near-icon name="menu"></near-icon>
          </button>
          <div class="toolbar-title">${this.topBarTitle()}</div>
          </div>

          <div class="toolbar-actions">
          <nav class="toolbar-nav" role="navigation">
          ${this.menu()}
          ${this.pageMenu()}
          ${this.userExtra()}
          ${this.component && this.component.navMenu ? this.component.navMenu() : ''}
          </nav>
          <near-user
          class="toolbar-user"
          poolId="${this.poolId}"
          clientId="${this.clientId}"
          baseURL="${this.baseURL}"
          apiURL="${this.apiURL}" 
          lang="${this.lang}"
          @user-ready="${this.onUserReady}"
          @user-logout="${this.onUserLogout}"
          signInLabel="${this.signInLabel}"
          ?noregister="${this.noregister}"
          >user</near-user> 
          </div>
          </header>`
        }

        render() {

                return b`
        ${this.fixedTopBar ? this.renderTopBar() : ""}
        <div class="app-shell ${this.drawerStatic ? 'drawer-static' : ''} ${this.drawerOpen ? 'drawer-open' : ''}">
        <div class="drawer-backdrop" @click="${this.closeDrawer}"></div>
        <aside id="drawer" class="drawer-panel" @click="${this.handleDrawerClick}">
        <div class="drawer-header">
        <div class="drawer-title">${this.topBarTitle()}</div>
        </div>
        <div class="drawer-content">
                <div  id="drawer-menu" class="ntabs" role="navigation" >
                ${this.drawerMenu()}
                </div>
        </div>
        </aside>
        <div id="app-content">
        ${this.fixedTopBar ? "" : this.renderTopBar()}         
                <div class="main-content">     
                ${this.internalPage()}
                
                </div>
                <site-footer></site-footer> 
        </div>
        </div>`

        }

        static get properties() {
                return {
                        page: {
                                type: String,
                                reflectToAttribute: true
                        },
                        mode: {
                                type: String,
                                value: "home"

                        },
                        routeData: Object,
                        fixedTopBar: {
                                type: Boolean,
                                default: false
                        },
                        subroute: Object,
                        signedLoad: {
                                type: Boolean,
                                default: true
                        },
                        signedIn: {
                                type: Boolean,
                                default: false
                        },
                        drawerOpen: {
                                type: Boolean,
                                reflect: true
                        }
                };
        }



        constructor() {
                super();
                this.signedLoad = true;
                this.drawerOpen = false;
                this.drawerStatic = false;
                this.addEventListener("end-edit", this.endEdit.bind(this));

        }

        contentFile(path) {
                //console.log(path!=="/"? path+'.h': '/index.h')
                if (path.endsWith(".html")) return path.slice(0, -5) + '.h';
                return (path.endsWith("/") ? path + 'index.h' : path + '.h');
        }

        propsFile(path) {
                //console.log(path!=="/"? path+'.h': '/index.h')
                if (path.endsWith(".html")) return path.slice(0, -5) + '.json';
                return (path.endsWith("/") ? path + 'index.json' : path + '.json');
                //return(path!=="/"? path+'.json': '/index.json');
        }

        importComponent(name) {
                let match = window.decodeURIComponent(window.location.pathname).match(/.*\//);
                let folder = match ? match[0] : '';
                console.log("importComponent ", NearUser.instance.baseURL + folder + name + '.js');
                return import(NearUser.instance.baseURL + folder + name + '.js');
        }

        internalPage() {
                if(this.component) return b`${o(this.component.content(this.page))}`; 
        }

        firstUpdated() {
                document.body.removeAttribute('unresolved');
                this.nearLocation = new NearLocation(
                        this.routePageChanged.bind(this),
                        this.hashChanged.bind(this));
                //this.pageChanged(this.page);
                if (this.convertible) {
                        window.onresize = this.checkConvertible.bind(this);
                        setTimeout((() => { this.checkConvertible(); }).bind(this), 500);
                }
                if(this.component && this.component.firstUpdated) this.component.firstUpdated(this);
        }

        checkConvertible() {
                console.log("resize");
                this.drawerStatic = window.innerWidth >= 800;
                this.drawerOpen = this.drawerStatic;
                this.requestUpdate();
        }

        updated() {
                super.updated();
                if(this.component && this.component.updated) this.component.updated(this);
                //this.pageChanged(this.page);
        }

        hashChanged(nearLocation) {
                return;
        }

        routePageChanged(nearLocation) {
                // Show the corresponding page according to the route.
                //
                // If no page was found in the route data, page will be an empty string.
                // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.

                let page = nearLocation.path.slice(1);
                console.log('routePageChanged:' + page);
                if (!page) {
                        this.page = '';
                        this.mode = 'home';
                } else if (page == "contact") {
                        this.mode = "contact";
                }
                else {
                        this.page = page;
                        this.mode = "mdsection";
                }

                if (!this.drawerStatic) this.drawerOpen = false;
                window.scrollTo(0, 0);
                this.pageChanged(this.page);

        };

        onUserReady(e) {
                console.log('user ready');
                this.signedIn = true;
                this.requestUpdate();
                this.pageChanged(window.location.pathname);
                //render(this.drawerMenu(),this.shadowRoot.getElementById("drawer-menu"))

        }

        onUserLogout(e) {
                this.signedIn = false;
                console.log('user logout');
                this.requestUpdate();
        }

        endEdit(e) {
                if (!NearUser.instance.canEdit()) return;
                const editor = document.querySelector("#content");//e.target;
                const u = NearUser.instance;
                let path = this.contentFile(window.decodeURIComponent(window.location.pathname));
                console.log("write:", path);
                let tasks = [];
                tasks.push(u.put(path, editor.innerHTML, "text/html"));
                if (this.metaDirty) {
                        let props = this.propsFile(window.decodeURIComponent(window.location.pathname));
                        tasks.push(u.put(props, JSON.stringify(this.meta), "text/json"));
                }

                Promise.all(tasks).then(() => {
                        if (this.invalidateOnEndEdit) this.buildPage();
                })
                        .catch(e => console.log(e));
        }

        fixLocalLinks(element = this) {
                //const links=this.shadowRoot.querySelectorAll("a");
                const links = element.querySelectorAll("a");
                links.forEach(link => {
                        let href = link.getAttribute('href');
                        if (href
                                && !href.startsWith('http')
                                && !href.startsWith('//')
                                && !href.startsWith('#')) {
                                link.addEventListener('click', NearRoute.prototype.clickHandler.bind(link));
                                link.setAttribute("is", "near-route");
                        }
                });
        }

        makeImagesLazy(content, swapSrc = true) {
                let lazyImages = content.querySelectorAll("img");

                if ("IntersectionObserver" in window) {
                        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                                entries.forEach(function (entry) {
                                        if (entry.isIntersecting) {
                                                let lazyImage = entry.target;
                                                if (lazyImage.dataset.src)
                                                        lazyImage.src = lazyImage.dataset.src;
                                                //lazyImage.srcset = lazyImage.dataset.srcset;
                                                lazyImage.classList.remove("lazy");
                                                lazyImageObserver.unobserve(lazyImage);
                                        }
                                });
                        });

                        lazyImages.forEach(function (lazyImage) {
                                if (swapSrc) {
                                        lazyImage.dataset.src = lazyImage.src;
                                        lazyImage.src = "data:,";
                                }
                                lazyImageObserver.observe(lazyImage);
                        });
                }
        }


        onMeta(meta) {
                console.log("meta", this.meta);
                let e;
                if (meta.title) {
                        if (e = document.querySelector('title')) e.innerHTML = meta.title;
                        if (e = document.querySelector('meta[property="og:title"]')) e.setAttribute("content", meta.title);
                }
                if (meta.description) {
                        if (e = document.querySelector('meta[name="description"]')) e.setAttribute("content", meta.description);
                        if (e = document.querySelector('meta[property="og:description"]')) e.setAttribute("content", meta.description);
                }
                if (meta.canonical) {
                        if (e = document.querySelector('link[rel="canonical"]')) e.setAttribute("href", meta.canonical);
                        if (e = document.querySelector('meta[property="og:url"]')) e.setAttribute("content", meta.canonical);
                }
                else if (meta.url) {
                        if (e = document.querySelector('link[rel="canonical"]')) e.setAttribute("href", meta.url);
                        if (e = document.querySelector('meta[property="og:url"]')) e.setAttribute("content", meta.url);
                }
                if (meta.image) {
                        if (e = document.querySelector('meta[property="og:image"]')) e.setAttribute("content", meta.image);
                }
                if (meta.pages && (e = this.shadowRoot.getElementById("pages"))) {
                        e.innerHTML = "";
                        meta.pages.forEach((page) => {
                                let a = document.createElement("a", { is: 'near-route' });
                                a.setAttribute("href", page.filename);
                                a.innerHTML = page.name;
                                if (window.location.pathname.endsWith(page.filename) ||
                                        (window.location.pathname.endsWith('/') && page.filename == 'index.html'))
                                        a.classList.add('near-selected');
                                e.appendChild(a);
                        });

                }
                if (meta.toc && (e = this.shadowRoot.getElementById("toc"))) {
                        e.innerHTML = meta.toc;
                }
                if (meta.breadcrums && (e = document.getElementById("top"))) {
                        e.innerHTML = meta.breadcrums;
                }
        }

        onContent(content) {
                this.content = content;
        }

        initEditor(content = null) {
                const editorModulePath = './editor.js';
                import(editorModulePath);
                if (!content) content = document.querySelector("#content");
                content.outerHTML = '<div  id="content" is="near-editor"></div>';
                content = document.querySelector("#content");
                //if(NearUser.instance.canEdit()) 
                //        this.addEventListener("end-edit",this.endEdit.bind(this));
                return content;
        }

        pageChanged(page) {
                NearUser.instance ? NearUser.instance.baseURL : "";
                console.log('pageChanged:' + page);
                trackGa('set', 'page', window.location.pathname);
                trackGa('send', 'pageview');
                if (this.component) {
                        this.component.destroy && this.component.destroy(this);
                        this.component=null;
                }        
                if(this.page.startsWith('app/')){
                        this.importComponent("component").then(component=>{
                                this.component=component;
                                this.component.init && this.component.init(this,this.page,NearUser,{LitElement: i$1,html: b,css: i$2});
                                this.requestUpdate();
                        })
                        .catch(()=>this.component=null);
                        return;        
                } 

                this.meta = null; this.content = null;
                let content = document.querySelector("#content");
                content.innerHTML = "";

                if (content) {
                        let contentFile = this.contentFile(window.decodeURIComponent(window.location.pathname));
                        let propsFile = this.propsFile(window.decodeURIComponent(window.location.pathname));
                        if (this.signedLoad && NearUser.instance.canEdit()) {
                                console.log("via GET");
                                NearUser.instance.get(contentFile)
                                        .then((response) => {
                                                if (response.ok)
                                                        response.text().then(text => {
                                                                if (!text.startsWith("<near-")) {
                                                                        content = this.initEditor(content);
                                                                }
                                                                content.innerHTML = text;
                                                                this.fixLocalLinks();
                                                                this.hashChanged(this.nearLocation);
                                                                if(content.slotUpdated) content.slotUpdated();
                                                                //setTimeout(e=>{console.log("GET OK");},1000);
                                                        });
                                                else {
                                                        content.innerHTML = 'NONONON';
                                                        content = this.initEditor(content);
                                                }

                                        })
                                        .catch(error => console.log("e get", error));
                                NearUser.instance.get(propsFile)
                                        .then((response) => {
                                                if (response.ok)
                                                        response.json().then(meta => {
                                                                this.meta = meta;
                                                                this.onMeta(meta);
                                                        });
                                                else this.meta = {};

                                        })
                                        .catch(error => console.log("e get", error));
                                return;
                        }
                        else fetch(NearUser.instance.baseURL + contentFile)
                                .then((response) => {
                                        if (response.ok)
                                                response.text().then(text => {
                                                        content.innerHTML = text;
                                                        this.fixLocalLinks();
                                                        this.makeImagesLazy(content);
                                                        this.onContent(content);
                                                        this.hashChanged(this.nearLocation);
                                                        document.body.removeAttribute('unresolved');
                                                });
                                        else content.innerHTML = '';
                                })
                                .catch(error => console.log("e fetch", error));
                        fetch(NearUser.instance.baseURL + propsFile)
                                .then((response) => {
                                        if (response.ok) {
                                                response.json().then(meta => {
                                                        this.meta = meta;
                                                        this.onMeta(meta);
                                                });

                                        }
                                        else this.meta = {};

                                })
                                .catch(error => console.log("e fetch", error));
                }

        };

        handleNavigationClick() {
                console.log("navigationClick");
                this.drawerOpen = !this.drawerOpen;
                trackGa('send', 'event', 'UI', 'menu', window.location.href);
        }


        fixToolbar() {
                return;
        }

        drawerOpened() {
                this.fixToolbar();
        }

        drawerClosed() {
                this.fixToolbar();
        }

        openDrawer() {
                this.drawerOpen = true;
        }
        closeDrawer() {
                this.drawerOpen = false;
        }


        openMenuByName(name) {
                let menu = this.shadowRoot.getElementById(name + '-menu');
                if (menu && menu.openMenu)
                        menu.openMenu();
                else if (menu && menu.toggleMenu)
                        menu.toggleMenu();

        }
        openMenu(e) {
                this.openMenuByName(e.target.name);
        }

        handleDrawerClick(e) {
                if (this.drawerStatic) return;
                const action = e.composedPath().find(node => node?.tagName === 'A');
                if (action) this.closeDrawer();
        }

        buildPage(e) {
                if (NearUser.instance && NearUser.instance.canEdit()) {
                        NearUser.instance.buildPage(window.location.pathname).then(() => {
                                if (this.invalidateOnEndEdit) this.invalidate();
                        })
                                .catch(e => console.log(e));                        console.log("buildPage");
                }
        }


        async createDialogComponent(type = 'content') {
                const modulePath = type === 'article' ? './article.js' : './content.js';
                const module = await import(modulePath);
                const ComponentClass = type === 'article' ? module.NearArticle : module.NearContent;
                return new ComponentClass();
        }

        async newContent(e) {
                let el = await this.createDialogComponent('content');
                el.editonly = true;
                el.editing = true;
                el.addEventListener('content-create', (e) => {
                        console.log(e);
                        let content = e.detail;
                        content.close();
                        window.location.pathname = content.key;
                });
                document.body.appendChild(el);

        }

        async newArticle(e) {
                let el = await this.createDialogComponent('article');
                el.editonly = true;
                el.editing = true;
                el.addEventListener('content-create', (e) => {
                        console.log(e);
                        let content = e.detail;
                        content.close();
                        window.location.pathname = content.key;
                });
                document.body.appendChild(el);

        }

        articles(e) {
                console.warn('articles() is not implemented in NearApp');
        }

        async editMeta(e) {
                let el = null;
                if (this.meta && this.meta.type == "article")
                        el = await this.createDialogComponent('article');
                else
                        el = await this.createDialogComponent('content');
                el.key = window.location.pathname;
                el.editonly = true;
                el.editing = true;
                el.addEventListener('content-edited', this.buildPage);
                document.body.appendChild(el);
        }

        invalidate(e) {
                if (NearUser.instance && NearUser.instance.canEdit()) {
                        let path = window.location.pathname;
                        if (path.endsWith(".html"))
                                path = path.slice(0, -5);
                        path += "*";
                        console.log("try to invalidate", path);
                        NearUser.instance.invalidate(path).then((json) => {
                                console.log("invalidate", json);
                                alert(`Cache cleared for ${path}`);
                        });
                }
        }

        navigate(href) {
                NearRoute.navigate(href);
        }

}

window.customElements.define('near-app-base', NearApp);

function detectBasePath(pathname) {
  if (pathname.startsWith('/demo/build/app/')) return '/demo/build/app';
  if (pathname === '/demo/build/app') return '/demo/build/app';
  if (pathname.startsWith('/demo/app/')) return '/demo/app';
  if (pathname === '/demo/app') return '/demo/app';
  return '/demo/app';
}

function sectionCard(title, body) {
  return b`
    <article class="card">
      <h2>${title}</h2>
      <p>${body}</p>
    </article>
  `;
}

class NearAppSmoke extends NearApp {
  static get styles() {
    return [
      super.styles,
      i$2`
        .smoke-content {
          display: grid;
          gap: 1.25rem;
          max-width: 72rem;
          margin: 0 auto;
        }

        .hero,
        .card {
          border: 1px solid var(--near-border-color);
          border-radius: 1rem;
          background: var(--near-surface-color);
          box-shadow: var(--near-box-shadow);
        }

        .hero {
          display: grid;
          gap: 1rem;
          padding: 1.5rem;
        }

        .hero h1,
        .card h2 {
          margin: 0;
        }

        .hero p,
        .card p,
        .card li {
          margin: 0;
          color: var(--near-muted-color);
        }

        .hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        }

        .card {
          display: grid;
          gap: 0.75rem;
          padding: 1.25rem;
        }

        code {
          font-family: ui-monospace, monospace;
          font-size: 0.92em;
        }
      `
    ];
  }

  constructor() {
    super();
    this.signedLoad = true;
    this.poolId = 'us-east-1_bi3wghKiN';
    this.clientId = '7n72a8kvhpjo8bb6rs910d0rhu';
    this.baseURL = '';
    this.apiURL = 'https://api.near.services/nearservices';
    this.lang = 'es';
    this.signInLabel = 'ingresar';
    this.noregister = false;
    this.title = 'nearServices';
    this.convertible = true;
    this.fixedTopBar = true;
    this.invalidateOnEndEdit = true;
    const parts = window.location.hostname.split('.');
    this.subdomain = (parts.length > 2 && parts[0]) || 'www';
    this.firstTime = true;
    this.basePath = detectBasePath(window.location.pathname);
    this.navigationMenu = {
      items: [
        { label: 'Overview', href: `${this.basePath}/` },
        { label: 'Routing', href: `${this.basePath}/routing` },
        { label: 'Layout', href: `${this.basePath}/layout` }
      ]
    };
  }

  routePageChanged(nearLocation) {
    const path = nearLocation.path.startsWith(this.basePath)
      ? nearLocation.path.slice(this.basePath.length)
      : nearLocation.path;
    const normalized = path.replace(/^\/+/, '').replace(/\/+$/, '');
    this.page = normalized || 'home';
    this.mode = 'smoke';
    if (!this.drawerStatic) this.drawerOpen = false;
    window.scrollTo(0, 0);
    this.pageChanged(this.page);
  }

  pageChanged() {
    this.requestUpdate();
  }

  topBarTitle() {
    return b`NearApp Smoke`;
  }

  internalPage() {
    return b`<div class="smoke-content">${this.renderPage()}</div>`;
  }

  renderPage() {
    if (this.page === 'routing') {
      return b`
        <section class="hero">
          <h1>Routing smoke test</h1>
          <p>
            Esta vista usa la shell real de <code>NearApp</code> y deja afuera el
            fetch de contenido remoto para probar routing, toolbar y drawer.
          </p>
        </section>
        <section class="grid">
          ${sectionCard('Current path', window.location.pathname)}
          ${sectionCard('Current page', this.page)}
          ${sectionCard('NearLocation', 'El cambio de ruta pasa por NearRoute/NearLocation y re-renderiza la shell.')}
        </section>
      `;
    }

    if (this.page === 'layout') {
      return b`
        <section class="hero">
          <h1>Layout smoke test</h1>
          <p>
            Probá el drawer en móvil, el toolbar sticky y el menú de usuario de
            <code>near-user</code>.
          </p>
        </section>
        <section class="grid">
          ${sectionCard('Drawer', 'Debe abrir/cerrar sin MWC y quedar fijo cuando aplica el modo convertible.')}
          ${sectionCard('Menus', 'Los dropdowns de navegación y edición ahora usan near-dropdown.')}
          ${sectionCard('User', 'La integración visual con near-user ya no depende de Material Web Components.')}
        </section>
      `;
    }

    return b`
      <section class="hero">
        <h1>NearApp running without MWC</h1>
        <p>
          Esta página usa la shell real de <code>app.js</code> con toolbar,
          drawer e items de navegación propios.
        </p>
        <div class="hero-actions">
          <a class="near-button" data-variant="primary" is="near-route" href="${this.basePath}/routing">Routing</a>
          <a class="near-button" is="near-route" href="${this.basePath}/layout">Layout</a>
        </div>
      </section>
      <section class="grid">
        ${sectionCard('Toolbar', 'Header, navegación y user slot renderizados por NearApp migrado.')}
        ${sectionCard('Drawer', 'Drawer y backdrop sin mwc-drawer.')}
        ${sectionCard('Edit menu', 'El menú interno de edición ahora usa near-dropdown.')}
      </section>
    `;
  }
}

window.customElements.define('near-app-smoke', NearAppSmoke);
//# sourceMappingURL=app-main.js.map
