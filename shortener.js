
const alphabet="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";

let group=0;

function shortener(uuid) {
        let suuid="";
        let id=uuid.toLowerCase().replace(/-/g,'');
        for(let i=0;i<id.length;i+=2) {
                let n=parseInt(id.substr(i,2),16);
                let g=Math.floor(n/64)
                n=n%64;
                if(g!=group) {
                      //suuid+=alphabet[g];
                      group=g;
                }      
                suuid+=alphabet[n];
                //if(n<4) suuid+=alphabet[n];        
        }
        return suuid;
}