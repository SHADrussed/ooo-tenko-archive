<!--//

 // проверка броузера
browser_name = navigator.appName;
browser_version = parseFloat(navigator.appVersion); 

if (browser_name == "Netscape" && browser_version >= 3.0) { roll = 'true'; }
else if (browser_name == "Microsoft Internet Explorer" && browser_version >= 3.0) { roll = 'true';}
else { roll = 'false'; }

 // смена изображений при наведении мыши
function msover(img,ref,txt)
{if (roll == 'true') { document.images[img].src = ref; };window.status=txt;}

function msout(img,ref)
{if (roll == 'true') { document.images[img].src = ref; };window.status='';}

 // инициализация изображений
if (roll == 'true')
{ 
a=new Image(115,28);a.src="hmeny3.gif"; a1=new Image(115,28);a1.src="hmeny31.gif";
b=new Image(107,28);b.src="hmeny4.gif"; b1=new Image(107,28);b1.src="hmeny41.gif";
c=new Image(61,28);c.src="hmeny4.gif"; c1=new Image(61,28);c1.src="hmeny41.gif";
d=new Image(65,24);d.src="top.gif"; d1=new Image(65,24);d1.src="top1.gif";
}

//-->
