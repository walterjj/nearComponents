import {NearUser} from "./user.js";



function calcURL(id){
	if(NearUser.instance && NearUser.instance.baseURL){
		let baseURL=NearUser.instance.baseURL
			  +window.location.pathname.match((/(.*\/)(.*?)$/))[1];
		//console.log('baseURL:',baseURL);	  
		return baseURL+'.'+id;
	}
	return "."+id;
}
  

export function callAjax(tag,id,action,data,ajaxing,onSuccess)
{  	var url=calcURL(id);
	var s="q="+action;
	if (data) s=s+'&'+data;
	if (ajaxing) 
	    document.getElementById(tag).innerHTML='<center><img src="/static/images/ajaxing.gif"/></center>'
	//$.post(url,s,function(data,status)
	var h=new Headers();
	h.append('Content-Type','application/x-www-form-urlencoded');
	//console.log('s:',s)
	fetch(url, {
		method: 'POST',
		body: s,
		mode: "cors",
		headers:h
	      })
	      .then(response => {
		response.text()
		.then(text => {
			//console.log("R:",text)
			let e=document.getElementById(tag);
			e.innerHTML=text;
			if(s=e.getAttribute('data-onajx'))
		    		eval(s);
			if(onSuccess)
		    		eval(onSuccess);

		})
	}); 
}

export function fields(element) {
	var s="";
	if (element.hasChildNodes()) {
		for(var i=0; i < element.children.length; i++) {
			var child=element.children[i];
			if (child.classList.contains("field"))
				s+='&'+child.id+'='+encodeURIComponent(child.innerHTML);
			else if (child.hasOwnProperty("tui")) {
				s+='&'+child.id+'='+encodeURIComponent(child.tui.getHtml());
			}	
			else 
				s+=fields(child);
		}
	}
	return s;
}

export function callAjaxForm(tag,id,action,form, ajaxing, onSuccess)
{ 
	var url=calcURL(id);
	var s="q="+action;
	//data=[{q: action}];
	if (form)
	{	for(var i=0; i<form.elements.length; i++)
		{   let el=form.elements[i];
		    if (el.className=='mceEditor')
		    {	ed = tinyMCE.get(e.id);
			s=s+'&'+el.name+'='+encodeURIComponent(ed.getContent());
		    }
		    else if (el.type=='radio' || el.type=='checkbox')
		    {	if ( el.checked)
		    	    s=s+'&'+el.name+'='+encodeURIComponent(el.value);
		    }	    
		    else if(el.name && el.value)
			s=s+'&'+el.name+'='+encodeURIComponent(el.value);
		}
		s+=fields(form);    	    
	}
	
	s=s+'&loc='+encodeURIComponent(document.location);
	//s+="&p=sarmiento";
	//data.push({loc: document.location});
	//$('#'+tag).load(url,s);
	if (ajaxing) 
	    document.getElementById(tag).innerHTML='<center><img src="/static/images/ajaxing.gif"/></center>'
	//s=encodeURI(s);
	console.log('s:',s)
	var h=new Headers();
	h.append('Content-Type','application/x-www-form-urlencoded');
	
	fetch(url, {
		method: 'POST',
		body: s,
		mode: "cors",
		headers:h
		})
		.then(response => {
		response.text()
		.then(text => {
			let e=document.getElementById(tag);
			e.innerHTML=text;
			if(s=e.getAttribute('data-onajx'))
				eval(s);
			if(onSuccess)
				eval(onSuccess);

		})
	}); 
}


