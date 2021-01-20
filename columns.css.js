import {css} from 'lit-element';

export function columnsStyles() {
return css`        
.columns {
        -webkit-column-count: 1;
        -webkit-column-gap: 10px;
        -webkit-column-fill: auto;
        -moz-column-count: 1;
        -moz-column-gap: 10px;
        -moz-column-fill: auto;
       column-count:1;
        column-width: 300px; -moz-column-width: 300px; -webkit-column-width: 300px;
        column-gap: 15px;
        column-fill: auto;
}
.columns near-contents div  {
        display: inline-block;
        background: #FEFEFE;
        border: 2px solid #FAFAFA;
        box-shadow: 3px 5px 25px  #ccc;
        margin: 0 2px 15px;
        -webkit-column-break-inside: avoid;
        -moz-column-break-inside: avoid;
        column-break-inside: avoid;
        padding: 15px;
        padding-bottom: 5px;
        background: -webkit-linear-gradient(45deg, #FFF, #F9F9F9);
        opacity: 1;
        -webkit-transition: all .2s ease;
        -moz-transition: all .2s ease;
        -o-transition: all .2s ease;
        transition: all .2s ease;
}
@media (min-width: 600px) {
        .columns {
                -webkit-column-count: 2;
                -moz-column-count: 2;
                column-count: 2;
        }
}

@media (min-width: 900px) {
        .columns {
                -webkit-column-count: 3;
                -moz-column-count: 3;
                column-count: 3;
        }
}

@media (min-width: 1200px) {
        .columns {
                -webkit-column-count: 4;
                -moz-column-count: 4;
                column-count: 4;
        }
}
`
}
