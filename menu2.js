import { css, LitElement, html } from "lit-element";


class NearMenu2 extends LitElement{

    static get styles(){
        return css`
            :host{
                position:relative;
            }
            .content{
                position:absolute;
                background-color:var(--background-color,white);
                width:var(--width,10em);
                border-radius:0.2em;
            }
            .invisible{
                display:none;
            }
        `
    }

    render(){
        return html`
            
            <div class="title" @click=${this.toggleMenu}><slot name="title"></slot></div>
            <div @click="${this.closeMenu}" class="content invisible"><slot></slot></div>
        `
    }

    toggleMenu(){
        this.open? this.shadowRoot.querySelector(".content").classList.add("invisible") :
        this.shadowRoot.querySelector(".content").classList.remove("invisible")

        this.open = !this.open;
    }

    closeMenu(){
        this.shadowRoot.querySelector(".content").classList.add("invisible")
        this.open = false;
    }

    constructor(){
        super();
        this.open = false;
        this.addEventListener("mouseleave",this.closeMenu.bind(this));
    }

}


window.customElements.define('near-menu2',NearMenu2);