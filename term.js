'use strict';
import { LitElement, html, css } from 'lit-element';

import {Terminal} from '@xterm/xterm';
import xtermCssText from './xterm.css.js';

function applyXtermStyles(shadowRoot) {
  if ('adoptedStyleSheets' in shadowRoot && 'replaceSync' in CSSStyleSheet.prototype) {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(xtermCssText);
    shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    return;
  }

  const style = document.createElement('style');
  style.textContent = xtermCssText;
  shadowRoot.appendChild(style);
}

export class NearTerm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
       
        max-width:100vw;
        max-height:90vh; 
        
        background-color: transparent;
      }
      #xterm-container {
        display:block;
        width: 100%;
        border: 1px solid #9998;
        border-radius: 5px;
        padding: 5px;
        background-color: #222;
      }
    `;
  }
  constructor() {
        super();
        this.term = null;
  }

  firstUpdated() {
    try {
      applyXtermStyles(this.shadowRoot);
    } catch (e) {
      console.error('Unable to initialize xterm styles', e);
    }

    this.term = new Terminal();
    this.term.onData(data => {
      console.log("data",data);
      this.dispatchEvent(new CustomEvent('data', { detail: data }));
    });
    this.term.onKey(e => {
      console.log("key",e);
      this.dispatchEvent(new CustomEvent('key', { detail: e }));
    });
    this.term.open(this.shadowRoot.getElementById('xterm-container'));
  }
  
  render() {
    return html`
      <div @nokeydown="${e=>this.dispatchEvent(e)}"  @mouseup="${e=>this.focus()}" id="xterm-container"></div>
    `;
  }

  write( data ) {
    this.term.write(data);
  }

  writeLn(data){
    this.term.writeln(data);
  }

  writeLine(data){
    this.term.writeln(data);
  }

  clear(){
    this.term.clear();
  }

  clean(){
    this.term.clear();
  }
}

customElements.define('near-term', NearTerm);
