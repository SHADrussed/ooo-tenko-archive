var agent = navigator.userAgent;
if (agent.indexOf("Opera") > -1) {
	agent = "Opera";
} else if (navigator.appName == "Microsoft Internet Explorer") {
	agent = "Microsoft Internet Explorer";
} else if (navigator.appName == "Netscape") {
	agent = "Netscape";
}

function resize(){
	if((document.all) && (window.opera)){
		document.getElementById('scroller').style.height = document.getElementById('sizer').offsetHeight - 115;
	}
}
var timer = 0;
lastid = 0;
function show(id){
	clearTimeout(timer);
	if((id != lastid) && (lastid)){
		((document.all)?document.all['menu'+lastid]:document.getElementById('menu'+lastid)).style.visibility = 'hidden';
	}
	lastid = id;
	((document.all)?document.all['menu'+lastid]:document.getElementById('menu'+lastid)).style.visibility = 'visible';
}

function hidden(id){
	timer = setTimeout("if('"+id+"' == '"+lastid+"'){((document.all)?document.all['menu"+lastid+"']:document.getElementById('menu"+lastid+"')).style.visibility = 'hidden';}", 500)
}
