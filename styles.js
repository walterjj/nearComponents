import {css} from 'lit-element';
import { nearPicoTokens, nearControlStyles } from './ui.css.js';


export function styles()
{ return [nearPicoTokens, nearControlStyles, css`
:host > near-modal{ position:fixed;
        height:100vh; 
        top:0; left:0; bottom:0; right:0; 
        background-color: rgba(0,0,0,.5); 
        display:flex; 
        justify-content:center;align-items:center;padding:2em;
        z-index:10000 }
:host([hidden]) { display: none; }
near-modal a{font-size:-3;color:#999;cursor:pointer}
.inverse {
  
  --mdc-theme-primary: white;
  
}
.container{
  max-width:800px;
  margin: 0 auto;
}

:host > near-modal > div {
  background-color:white;
  position:relative;
  color:black;
  border:solid 1px #ccc;
  box-shadow: 2px 2px 2px #000;
  display:flex; 
  flex-direction:column;
  align-items: flex-end;
  justify-content:normal;
  text-align:left;
  padding:2em;
  min-width:300px;
  max-height:90vh;
  overflow-y:auto;
  overflow-x:hidden;
}
near-modal h3 {
        width:100%;
        
}
form-actions {
  display:flex;
  gap:.75rem;
  width:100%;
  justify-content:flex-end;
  align-items:center;
  flex-wrap:wrap;
}
near-modal img{
  max-width:100%;
  max-height:50vh;
  object-fit:contain }
  
label{
        display:flex;
        flex-direction:column;
        width:100%;
        margin-bottom:1em;
}
input, textarea {
  border: none;
  border-bottom: solid 1px rgba(128,128,128,0.2);
  padding:1em 0.5em ; 
  margin-top:.2em;
  color:#888;
  width:100%;
  background-color:rgba(128,128,128, 0);
}

textarea {
        nmin-height:5em;
        border-top:solid solid rgba(128,128,128,0.2);
}
near-modal .formfield,
near-modal .near-formfield {
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
  near-icon{font-variant:none}
  .properties-icon { float:right;cursor:pointer}
  button.properties-icon {
    border:none;
    background:transparent;
    box-shadow:none;
    padding:.25rem;
    min-height:auto;
    color:var(--near-muted-color);
  }
  button.properties-icon:hover,
  button.properties-icon:focus-visible {
    color:var(--near-primary);
    background:transparent;
    border-color:transparent;
  }


}

#edit-control{position:absolute; font-size:14px; right:1px ; bottom:3px; cursor:pointer}  
 
`];
}
