'use strict';
import { LitElement, html, css } from 'lit-element';


export class TimePicker extends LitElement {
        static get properties() {
                return {
                        from : { type: Number,reflect:true },
                        to : { type: Number,reflect:true },
                        refresh : { type: Number,reflect:true },
                        options: { type: Array, reflect:true }
                };
        }

        constructor() {
                super();
                this.from = new Date().getTime();
                this.to = new Date().getTime();
                this.refresh = 60;
                this.open = false;
                //this.timeOptions={options:[]};
        }

        firstUpdated(){
                this.select=this.shadowRoot.getElementById("select");
        }

        updated(){
                if(this.select.value=="range"){
                        this.shadowRoot.getElementById("from").valueAsNumber=this.from;
                        this.shadowRoot.getElementById("to").valueAsNumber=this.to;
                }
        }

        attributeChangedCallback(name, oldval, newval) { 
                super.attributeChangedCallback(name, oldval, newval);
                console.log("attributeChangedCallback",name,oldval,newval);
                if (name=="options"){
                        //this.options=JSON.parse(newval);
                        //this.requestUpdate();
                }
        }

        static get styles() {
                return css`
                :host {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        background-color: transparent;
                        color: var(--timepicker-text-color, #fff);
                        font-size: small;
                }
                
                input,select{
                        background-color:var(--shiftpicker-background-color, #222);
                        color: var(--shiftpicker-text-color, #fff);
                        padding:0.5em;
                        border: solid 1px var(--shiftpicker-text-color, #333);
                        border-radius: 0.5em;
                        font-size: small;
                        color-scheme: dark;
                }
                        `;
        }

        
        renderExtra() {
                if(this.select && this.select.value=="range")
                        return html`
                        <div id="period">
                                <input @change="${this.onPeriodChange}" id="from" type="date">
                                <input @change="${this.onPeriodChange}" id="to" type="date">
                        </div>`;
                        return '';       

        }

        renderTimeOptions(){
                let r=[];
                for (let option of this.options) {
                        console.log("option",option);
                        r.push(html`<option value="${option.value}">${option.label}</option>`);
                }
                return r;
        }

        render() {
                console.log("render",this.options);
                return html`
                <select  id="select" @change="${this.onSelect}">
                        ${this.renderTimeOptions()}
                </select> 
                <div id="extra">
                        ${this.renderExtra()}
                </div>
                
                `;
        }
        
        setOptions(options){
                this.options=options;
        }

        onPeriodChange(e){
                console.log("onPeriodChange",e);
                this.from=this.shadowRoot.getElementById("from").valueAsNumber;
                this.to=this.shadowRoot.getElementById("to").valueAsNumber;
                this.dispatchEvent(new CustomEvent('change', { detail: { value: `from=${this.from}&to=${this.to}` },bubbles:true }));
        }
        onSelect(e){
                console.log("select",this.select.value);
                this.requestUpdate();
                if(this.select.value!="range"){
                        this.dispatchEvent(new CustomEvent('change', { detail: { value: this.select.value },bubbles:true }));
                }
        }
}


customElements.define('near-timepicker', TimePicker);
