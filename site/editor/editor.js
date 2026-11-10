var fID; //***   IFRAME ID
var TXTOBJ; //***   TEXT Obj
var format=new Array();
var viewm=new Array();
QBPATH='./editor'; SECURE=0;

browser_name = navigator.appName;
browser_version = parseFloat(navigator.appVersion); 

if (browser_name == "Microsoft Internet Explorer" && browser_version >= 4.0) { VISUAL=1;}
else { VISUAL=0;}

document.onmouseup=doMouseup
function doMouseup()
{
 var el=event.srcElement 
 if(!el.type) return

 if(el.type!='text'&&el.type!='textarea')
  {
	if(!el.name || el.name.substring(0,7)!='QBCNTRL') actualize();
    return
  }

 var visual=''
 if(el.type=='textarea' && VISUAL==0) visual=1
 	 
 if(visual) changetoIframeEditor(el);

}


function changetoIframeEditor(el)
{
   var wi= '', hi= '';
   if(el.style.height) hi= " height=" + el.style.height
   else if(el.rows) hi= " height=" + (14*el.rows+28)
   if(el.style.width) wi= " width=" + el.style.width
   else if(el.cols) wi= " width=" + (6*el.cols +25)
   	   
   var parent= el.parentElement
   while(parent.tagName != 'FORM') parent= parent.parentElement
   var oform= parent
   var fidx=0; while(document.forms[fidx] != oform) fidx++ ; // form index

   var val=''
   if(el.tagName=='TEXTAREA'){ fID= fidx+'VDevID'+el.name; val= el.innerText }
   else fID= fidx+'VDevID'+el.id

   var strx = createEditor(fID,wi,hi);
   el.outerHTML= strx
   
   iEditor(fID)

   if(el.tagName!='TEXTAREA') return
   	   
   var reg= eval("/<br>/i") ;
   if( reg.test(val) ) val= val.replace(/\n/g, "");
   else val= val.replace(/\n/g, "<br>");

   val= val.replace(/\r/g, "");
   val= val.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

   val= val.replace(/\\/g, "&#92");
   val= val.replace(/\'/g, "&#39;");

   setTimeout("document.frames['"+fID+"'].document.body.innerHTML='"+val+"';document.frames['"+fID+"'].document.createStyleSheet('../styles.css')",200)
   oform[fID.split('VDevID')[1]].value= val

}




function iEditor(idF)
{
  var obj=document.frames[idF]
  obj.document.designMode="On"
  obj.document.onmousedown= function(){  TXTOBJ=null; fID=idF; FMousedown();}  
  format[idF]='HTML'
  viewm[idF]=1;
}



function FMousedown()
{
  var objF=document.frames[fID];

  var el = objF.event.srcElement 
  doClick(el)
}




function changeAllTextareaToEditors()
{
if (document.main) {
if (document.main.newstext) {
    changetoIframeEditor(document.main.newstext)
}
}	
}



/////////////////////////////////////////////////////////////////
function  controlRows()
{
  iurl= QBPATH + '/imgedit'

  str = "<TR bgColor=LightGrey align=left valign=middle >\
<STYLE>IMG {cursor:hand}</STYLE>\
<TD nowrap>\
<a href=\"javascript:doFormatF('Cut')\"><img src='IURL/cut.gif' border=0 alt='Вырезать' width=23 height=22></a>\
<a href=\"javascript:doFormatF('Copy')\"><img src='IURL/copy.gif' border=0 alt='Копировать' width=23 height=22></a>\
<a href=\"javascript:doFormatF('Paste')\"><img src='IURL/paste.gif' border=0 alt='Вставить' width=23 height=22></a>\
<a href=\"javascript:doFormatF('SearchReplace')\"><img src='IURL/srepl.gif' border=0 alt='Поиск с заменой' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<a href=\"javascript:doFormatF('SuperScript')\"><img src='IURL/superscript.gif' border=0 alt='Верхний индекс' width=23 height=22></a>\
<a href=\"javascript:doFormatF('SubScript')\"><img src='IURL/subscript.gif' border=0 alt='Нижний индекс' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<a href=\"javascript:selectBgColor()\"><img src='IURL/bgcolor.gif' border=0 alt='Цвет фона' width=23 height=22></a>\
<a href=\"javascript:selectFgColor()\"><img src='IURL/fgcolor.gif' border=0 alt='Цвет текста' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<a href=\"javascript:doFormatF('InsertImage')\"><img src='IURL/image.gif' border=0 alt='Вставить изображение' width=23 height=22></a>\
<a href=\"javascript:doFormatF('InsertHorizontalRule')\"><img src='IURL/hr.gif' border=0 alt='Втавить горизонтальную линию' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<a href=\"javascript:doFormatF('CreateLink')\"><img src='IURL/link.gif' border=0 alt='Добавить гиперссылку' width=23 height=22></a>\
<a href=\"javascript:doFormatF('UnLink')\"><img src='IURL/unlink.gif' border=0 alt='Удалить гиперссылку' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<a href=\"javascript:doFormatF('formatBlock','<P>')\"><img src='IURL/p.gif' border=0 alt='Форматировать как абзац' width=23 height=22></a>\
<a href=\"javascript:doFormatF('RemoveFormat')\"><img src='IURL/delformat.gif' border=0 alt='Очистить форматирование' width=23 height=22></a>\
<a href=\"javascript:doFormatF('WordClean')\"><img src='IURL/unword.gif' border=0 alt='Очистить Word-форматирование' width=23 height=22></a>\
<a href=\"javascript:doFormatF('AddCut')\"><img src='IURL/page.gif' border=0 alt='Вставить жесткое разбиение разделов' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<a href=\"javascript:swapMode()\"><img src='IURL/code.gif' border=0 alt='Режим редактирования' width=23 height=22></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
</TD></TR>\
<TR><TD height=2 background=\"IURL/hl.gif\" nowrap><img src='IURL/hl.gif' border=0 width=1 height=1></TD></TR>\
<TR bgColor=LightGrey align=left valign=middle>\
<TD nowrap>\
<img src='IURL/instable.gif' border=0 alt='Вставить таблицу' width=23 height=22 onclick='insertTable()' valign=middle>\
<img src='IURL/tabprop.gif' border=0 alt='Свойства таблицы' width=23 height=22 onclick='tableProp()' valign=middle>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<img src='IURL/cellprop.gif' border=0 alt='Свойства ячейки' width=23 height=22 onclick='cellProp()' valign=middle>\
<img src='IURL/inscell.gif' border=0 alt='Вставить ячейку' width=23 height=22 onclick='insertCell()' valign=middle>\
<img src='IURL/delcell.gif' border=0 alt='Удалить ячейку' width=23 height=22 onclick='deleteCell()' valign=middle>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<img src='IURL/insrow.gif' border=0 alt='Вставить строку' width=23 height=22 onclick='insertRow()' valign=middle>\
<img src='IURL/delrow.gif' border=0 alt='Удалить строку' width=23 height=22 onclick='deleteRow()' valign=middle>\
<img src='IURL/mrgrow.gif' border=0 alt='Объединить ячейки в столбце' width=23 height=22 onclick='morerowSpan()' valign=middle>\
<img src='IURL/spltrow.gif' border=0 alt='Разбить ячейки в столбце' width=23 height=22 onclick='lessrowSpan()' valign=middle>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
<img src='IURL/inscol.gif' border=0 alt='Вставить столбец' width=23 height=22 onclick='insertCol()' valign=middle>\
<img src='IURL/delcol.gif' border=0 alt='Удалить столбце' width=23 height=22 onclick='deleteCol()' valign=middle>\
<img src='IURL/mrgcell.gif' border=0 alt='Объединить ячейки в строке' width=23 height=22 onclick='morecolSpan()' valign=middle>\
<img src='IURL/spltcell.gif' border=0 alt='Разбить ячейки в строке' width=23 height=22 onclick='lesscolSpan()' valign=middle>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22>\
</TD></TR>\
<TR><TD height=2 background=\"IURL/hl.gif\" nowrap><img src='IURL/hl.gif' border=0 width=1 height=1></TD></TR>\
<TR bgColor=LightGrey align=left valign=middle>\
<TD nowrap>\
<SELECT name='QBCNTRL1' onchange=\"doFormatF('FontName,'+this.value)\" style=\"height:22; width:98; vertical-align: middle; background:White; color:#000000; font-size: 11px\">\
<OPTION value=''>По умолчанию\
<OPTION value=Arial>Arial\
<OPTION value=\"Times New Roman\">Times New Roman\
<OPTION value='Webdings'>Webdings\
<OPTION value='Wingdings'>Wingdings\
</SELECT>\
<SELECT name='QBCNTRL2' onchange=\"doFormatF('formatBlock,'+this.value);this.value=''\" style=\"height:22; width:40; vertical-align: middle; background:White; color:#000000; font-size: 11px\">\
<OPTION value=\"H1\">H1\
<OPTION value=\"H2\">H2\
<OPTION value=\"H3\">H3\
<OPTION value=\"H4\">H4\
<OPTION value=\"H5\">H5\
<OPTION value=\"H6\">H6\
<OPTION value=\"P\" selected>Нет</OPTION>\
</SELECT>\
<SELECT name='QBCNTRL3' onchange=\"doFormatF('FontSize,'+this.value)\" style=\"height:22; width:35; vertical-align: middle; background:White; color:#000000; font-size: 11px\">\
<OPTION value=7>7\
<OPTION value=6>6\
<OPTION value=5>5\
<OPTION value=4>4\
<OPTION value=3>3\
<OPTION value=2>2\
<OPTION value=1>1\
<OPTION value=>Нет\
</OPTION>\
</SELECT>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22 align=\"middle\">\
<a href=\"javascript:doFormatF('Bold')\"><img src='IURL/bold.gif' border=0 alt='Полужирный' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('Italic')\"><img src='IURL/italic.gif' border=0 alt='Курсив' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('Underline')\"><img src='IURL/under.gif' border=0 alt='Подчеркнутый' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('StrikeThrough')\"><img src='IURL/strike.gif' border=0 alt='Перечеркнутый' width=23 height=22 align=\"middle\"></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22 align=\"middle\">\
<a href=\"javascript:doFormatF('JustifyLeft')\"><img src='IURL/left.gif' border=0 alt='По левому краю' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('JustifyCenter')\"><img src='IURL/center.gif' border=0 alt='По центру' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('JustifyRight')\"><img src='IURL/right.gif' border=0 alt='По правому краю' width=23 height=22 align=\"middle\"></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22 align=\"middle\">\
<a href=\"javascript:doFormatF('InsertOrderedList')\"><img src='IURL/numlist.gif' border=0 alt='Нумерованный список' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('InsertUnorderedList')\"><img src='IURL/bullist.gif' border=0 alt='Ненумерованный список' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('Outdent')\"><img src='IURL/outdent.gif' border=0 alt='Уменьшить отсутп' width=23 height=22 align=\"middle\"></a>\
<a href=\"javascript:doFormatF('Indent')\"><img src='IURL/indent.gif' border=0 alt='Увеличить отступ' width=23 height=22 align=\"middle\"></a>\
<img src='IURL/d.gif' border=0 width=2 hspace=2 height=22 align=\"middle\">\
</TD></TR>"

 str = str.replace(/IURL/g, iurl);

 return str ;
}



function createEditor(id,wi,hi)
{
  var strx = "<iframe id="+id+ hi +" width=100%></iframe>"

  var idA= id.split('VDevID')

  strx += "<input name="+idA[1]+" type=hidden></input>"
 
  var str="<TABLE border=0 cellspacing=0 cellpadding=0" + wi + ">"

  str += controlRows();
  
  str += "<tr><td bgColor=LightGrey>" + strx + "</td></tr>"
  
  str += "</TABLE>" ;

  return str ;

}
/////////////////////////////////////////////////////////////////






function doFormatF(arr)
{
  var objF=document.frames[fID];
  if(!objF){alert('Кликните для выбора редактора');return}
  objF.focus()

  var cmd = new Array();
  cmd = arr.split(',')

  if(cmd[0]=='SelectAll') selectAll();
  else if(cmd[0]=='Swap[Text/HTML]') swapMode(); 
  else if(cmd[0]=='Swap[Uni/View]') swapView();
  else if(cmd[0]=='InsertTable') insertTable();
  else if(cmd[0]=='TablePropeties') tableProp();
  else if(cmd[0]=='CellPropeties') cellProp();
  else if(cmd[0]=='InsertLayer') insertDivLayer();
  else if(cmd[0]=='WordClean') WordClean();
  else if(cmd[0]=='SearchReplace') SearchReplace();
  else if(cmd[0]=='AddCut') AddCut();  
  else if(cmd[0]=='EditLayerBorder') editDivBorder();
  else if(cmd[0]=='EditLayerFilter') editDivFilter();
  else if(cmd[0]=='Emotions') editEmotions(cmd[1],objF);
  else
	{
	  var edit=objF.document; 
	  if(cmd[0]=='formatBlock') edit.execCommand(cmd[0],false,"<"+cmd[1]+">")
	  else if(cmd[0]=='InsertImage' && !cmd[1] )
	   { alert('Внимание:\n"Источник рисунка" в следующем диалоговом окне должен быть URL (http://www...), а не локальным адресом!'); 
	     edit.execCommand(cmd[0],true,"") }
	  else edit.execCommand(cmd[0],false,cmd[1])
	}

}



function editEmotions(wrd,obj)
{
  var caret=obj.document.selection.createRange();
  obj.curword=caret.duplicate();
  obj.curword.text= wrd + ' '
}





function swapMode()
{
 var objF=document.frames[fID];
 if(!objF){alert('Кликните для выбора редактора');return}
 objF.focus()
 
 if(format[fID]=="HTML")
 {
  var strx=objF.document.body.innerHTML
  objF.document.body.innerText=strx
  objF.document.body.style.fontFamily='Arial'
  objF.document.body.style.fontSize=""
  objF.document.body.style.color="#000000"
  objF.document.body.style.background=""
  format[fID]="Text"
 }
 else
 {
  objF.document.body.style.fontFamily='Arial'
  objF.document.body.style.color="#000000"
  objF.document.body.style.background=""
  var strx=objF.document.body.innerText
  objF.document.body.innerHTML=strx
  format[fID]="HTML"
  viewm[fID]=1
 }

}



function selectAll()
{ 
  var objF=document.frames[fID];
  if(!objF){alert('Кликните для выбора редактора');return}
  objF.focus()
  var s=objF.document.body.createTextRange()
  s.execCommand('SelectAll')
}





function doFormatDialog(file,cmd,arg)
{ 
  var urlx= QBPATH + '/' + file

  var objF=document.frames[fID];
  if(!objF){alert('Кликните для выбора редактора');return}

  var arr=showModalDialog(urlx, arg, "font-family:Verdana;font-size:11;dialogWidth:21em;dialogHeight:23em;scrolbar:no;edge:no;help:no;status:no");
  if(arr !=null) doFormatF(cmd+','+arr)
}


function selectBgColor()
{ 
  doFormatDialog('selcolor.html','BackColor','')
}


function selectFgColor()
{ 
  doFormatDialog('selcolor.html','ForeColor','')
}


function characters()
{
  var objF=document.frames[fID];
  if(!objF){alert('Кликните для выбора редактора');return}
  objF.focus();

  var sel = objF.document.selection;
  if(sel.type=="Control") return 

  var urlx= QBPATH + '/selchar.html'
  var arr=showModalDialog(urlx, '', "font-family:Verdana;font-size:12;dialogWidth:30em;dialogHeight:34em; edge:sunken;help:no;status:no");
  if(arr==null) return

  var arrA = arr.split(';QuIcKbUiLd;')

  var strx= "<FONT FACE='" + arrA[0] + "'>" + arrA[1] + "</FONT>"

  var Range = sel.createRange();
  if(!Range.duplicate) return;
  Range.pasteHTML(strx);

}




function insertLink(linkurl)
{
  var objF=document.frames[fID];
  if(!objF && !TXTOBJ){alert('Кликните по текстовому элементу');return}


  if( objF )
  {
	objF.focus();
    var sel = objF.document.selection;
	var strx= "<A href='"+linkurl+"' target=nwin>" + linkurl + "</A>"

	var Range = sel.createRange();
	if(!Range.duplicate) return;
	Range.pasteHTML(strx);
  }
  else 
  {
	TXTOBJ.focus();
    var caret= TXTOBJ.document.selection.createRange()
	TXTOBJ.curword=caret.duplicate();
	var strx= "<A href='"+linkurl+"' target=nwin>" + linkurl + "</A>,"
	doFormat(strx,caret)
  }


}

function AddCut()
{

  var objF=document.frames[fID];
	objF.focus();
  var sel = objF.document.selection;
	var strx= "<IMG src=editor/imgedit/br.gif>"
	var Range = sel.createRange();
	if(!Range.duplicate) return;
	Range.pasteHTML(strx);
  objF.focus();
}


function field2form(str1)
{
  var str2
  var index
  var lenx
  index=str1.indexOf('<FIELDSET')
  while(index>=0)
  {
    lenx=str1.length
    str1=str1.substring(0,index) + "<FORM" + str1.substring(index+9,lenx)
    index=str1.indexOf('<FIELDSET')
   }
  index=str1.indexOf('</FIELDSET>')
  while(index>=0)
  {
    lenx=str1.length
    str1=str1.substring(0,index) + "</FORM>" + str1.substring(index+11,lenx)
    index=str1.indexOf('<FIELDSET>')
  }
  return str1
}


function form2field(str1)
{
  var str2
  var index
  var lenx
  index=str1.indexOf('<FORM')
  while(index>=0)
  {
    lenx=str1.length
    str1=str1.substring(0,index) + "<FIELDSET" + str1.substring(index+5,lenx)
    index=str1.indexOf('<FORM')
  }
  index=str1.indexOf('</FORM>')
  while(index>=0)
  {
    lenx=str1.length
    str1=str1.substring(0,index) + "</FIELDSET>" + str1.substring(index+7,lenx)
    index=str1.indexOf('</FORM>')
  }
  return str1
}






function actualize()
{
  var i=0;
  while(document.all.tags('iframe')[i])
  { 
	setHiddenValue(document.all.tags('iframe')[i].id) 
	i++
  }
}



function setHiddenValue(fid)
{ 
 if(!fid) return

 var strx= editorContents(fid)
 var idA= fid.split('VDevID')
 if(!idA[0]) return;

 var fobj= document.forms[idA[0]]
 if(!fobj) return;

 eval("document.forms[idA[0]]." +idA[1] + ".value='"+ strx +"'")
}	



function editorContents(frameID)
{
  var objF=document.frames[frameID]
  if(!objF)return

  var strx;
  if(format[frameID]=="HTML") strx=objF.document.body.innerHTML
  else strx=objF.document.body.innerText

  strx = strx.replace(/\r/g, ""); 
  strx = strx.replace(/\n/g, ""); 
  strx = strx.replace(/\'/g,"&#39;");


  // Security
  if(SECURE==1)
	{
	  strx = strx.replace(/<meta/ig, "< meta"); 
	  strx = strx.replace(/&lt;meta/ig, "&lt; meta"); 

	  strx = strx.replace(/<script/ig, "< script"); 
	  strx = strx.replace(/&lt;script/ig, "&lt; script"); 
	  strx = strx.replace(/<\/script/ig, "< /script"); 
	  strx = strx.replace(/&lt;\/script/ig, "&lt; /script"); 

	  strx = strx.replace(/<iframe/ig, "< iframe"); 
	  strx = strx.replace(/&lt;iframe/ig, "&lt; iframe"); 
	  strx = strx.replace(/<\/iframe/ig, "< /iframe"); 
	  strx = strx.replace(/&lt;\/iframe/ig, "&lt; /iframe"); 

	  strx = strx.replace(/<object/ig, "< object"); 
	  strx = strx.replace(/&lt;object/ig, "&lt; object"); 
	  strx = strx.replace(/<\/object/ig, "< /object"); 
	  strx = strx.replace(/&lt;\/object/ig, "&lt; /object"); 

	  strx = strx.replace(/<applet/ig, "< applet"); 
	  strx = strx.replace(/&lt;applet/ig, "&lt; applet"); 
	  strx = strx.replace(/<\/applet/ig, "< /applet"); 
	  strx = strx.replace(/&lt;\/applet/ig, "&lt; /applet"); 

	  strx = strx.replace(/ on/ig, " o&shy;n"); 
	  strx = strx.replace(/script:/ig, "script&shy;:"); 
    }

  return strx
}






function doFormat(arr,caret)
{
  var wrd=TXTOBJ.curword.text

  var cmd = new Array();
  cmd = arr.split(',')

  if(!cmd[0] || cmd[0]=='Swap[Text/HTML]' || cmd[0]=='Swap[Uni/View]' ) return 
  if(cmd[0]=='SelectAll') { TXTOBJ.focus(); TXTOBJ.select(); return }
  if(cmd[0]=='Cut') { caret.execCommand("Cut"); return }
  if(cmd[0]=='Copy') { caret.execCommand("Copy"); return }
  if(cmd[0]=='Paste') { caret.execCommand("Paste"); return }

  TXTOBJ.curword=caret.duplicate();
  TXTOBJ.curword.text= cmd[0]+wrd+cmd[1]
}



// VISUAL=0 : Textarea to Editor after confirmation

// VISUAL=1 : all Textarea to Editor
if(VISUAL==1) changeAllTextareaToEditors();

// VISUAL=2 : some specific iframes 
if(VISUAL==2) changeIframeToEditor('contents1','contents'); // please replace contents.. = frameId

// VISUAL=3 : all Iframe to Editor
if(VISUAL==3) changeAllIframeToEditors();

// VISUAL=4 : change only specific textarea
if(VISUAL==4) changetoIframeEditor(document.forms[xxx].yyy); // please replace xxx=formIndex and yyy=textareaName

// VISUAL>4 : no Visual-Editor, only use Rightmouse-Control


//Редактор таблиц//

var cellSelect = null
var TABLE = null
var DIV=null;
var ACTIVE=false;

function cellSelected()
{
 if(cellSelect==null){alert('No cell selected'); return 0} 
 return 1;  
}  



function insertTable()
{
  var objF=document.frames[fID];
  if(!objF){alert('Кликните для выбора редактора');return}

  var sel = objF.document.selection;
  if(sel.type=="Control") return 


  var Range = sel.createRange();
  if(!Range.duplicate) return;
  var wrd='' ;
  objF.curword=Range.duplicate();
  wrd= objF.curword.text;


  var urlx= QBPATH + '/createtable.html'
  var arr=showModalDialog(urlx, QBPATH ,  "font-family:Verdana;font-size:12;dialogWidth:24em;dialogHeight:23em; edge:sunken;help:no;status:no");
  if(arr==null) return

  var arrA= arr.split('x')
  if( !arrA[1] || isNaN(arrA[1]) ) arrA[1]=1
  arrA[1]++; arrA[1]--; // cols
  if( arrA[0]=='' || isNaN(arrA[0]) ) arrA[0]=1
  arrA[0]++; arrA[0]--; // rows
  
  var temp=''
  for(var i=0; i<arrA[0]; i++)
   {
	temp += "<TR>"
    for(var j=0; j<arrA[1]; j++)
	 {
	  if(j==0 && i==0) temp += "<TD>"+wrd+"&nbsp;</TD>"
	  else temp += "<TD>&nbsp;</TD>"
	 }
	temp += "</TR>"
   }

  var TABLESTR ='<TABLE BORDER>' + temp + '</TABLE>'

  var Range = sel.createRange();
  if(!Range.duplicate) return;
  Range.pasteHTML(TABLESTR);

  objF.focus();

}


function insertCell()
{
 if(! cellSelected()) return 
 var rowSelect= cellSelect.parentElement
 var newCell= rowSelect.insertCell(cellSelect.cellIndex+1);
 newCell.innerHTML= cellSelect.innerHTML ;

}

function deleteCell()
{
 if(! cellSelected()) return 
 var col= cellSelect.cellIndex
 var rowSelect= cellSelect.parentElement
 rowSelect.deleteCell(col)
 cellSelect = rowSelect.cells[col]
 if(!cellSelect) cellSelect = rowSelect.cells[col-1]
 if(cellSelect) currentCell(cellSelect)

}



function insertRow()
{
 if(!cellSelected()) return 
 
 var rowSelect= cellSelect.parentElement
 var tableSelect= rowSelect.parentElement
 var ridx= rowSelect.rowIndex;


 var row= tableSelect.rows[ridx]; // first row
 var idx=0; 
 for(var j=0; j<row.cells.length; j++) // j= cellIndex
  {
    if(!row.cells[j]) break;
    idx += row.cells[j].colSpan-1
  }
 
 var colx= j+idx

 var newRow= tableSelect.insertRow(ridx);
 var newCell;
 for(var i=0; i<colx; i++)
  { newCell=newRow.insertCell() }


 for(var i=0; i<=ridx; i++)
  {
	row= tableSelect.rows[i]; 
	for(var j=0; j<row.cells.length; j++) // j= cellIndex
	 {
       if(row.cells[j].rowSpan>1 && i+row.cells[j].rowSpan>ridx)
		 row.cells[j].rowSpan += 1
	 }
  }

}


function deleteRow()
{
 if(! cellSelected()) return 
 var rowSelect= cellSelect.parentElement
 var tableSelect= rowSelect.parentElement
 var ridx= rowSelect.rowIndex 

 row= rowSelect; 
 var rlen=row.cells.length;
 for(var i=0; i<rlen; i++)
  {
    if(row.cells[i].rowSpan>1)
	 {
      var newCell= tableSelect.rows[ridx+1].insertCell(i);
      newCell.rowSpan= row.cells[i].rowSpan - 1 ;
	  newCell.innerHTML= row.cells[i].innerHTML ;
	  row.cells[i].rowSpan =1
	 }
  }


 while(row.cells.length) { row.deleteCell(0); }


 for(var i=0; i<=ridx; i++)
  {
	row= tableSelect.rows[i]; 
	for(var j=0; j<row.cells.length; j++) 
	 {
       if(row.cells[j].rowSpan>1 && i+row.cells[j].rowSpan>ridx)
		 row.cells[j].rowSpan -= 1
	 }
   }

  if(row.cells.length==0) tableSelect.deleteRow(ridx)

}




function getColumnNo()
{
 if(! cellSelected()) return 
 
 var cidx= cellSelect.cellIndex
 var rowSelect= cellSelect.parentElement
 var tableSelect= rowSelect.parentElement

 var idx, row, colx ;
 var rspan = new Array() ;
 for(var i=0; i<rowSelect.rowIndex+1; i++)
  {
   row= tableSelect.rows[i]
   idx=0; 
   for(var j=0; j<row.cells.length; j++) // j= cellIndex
   	{
     if(!rspan[j+idx])rspan[j+idx]=0
	 if(!row.cells[j]) break;

	 while(rspan[j+idx]>0) { rspan[j+idx]--; idx++ }
     rspan[j+idx]=row.cells[j].rowSpan-1

   	 if(i==rowSelect.rowIndex && j==cidx){ colx=j+idx; break }

  	 idx += row.cells[j].colSpan-1
   	}
  }

 return colx

}





function getCellIndex(colx, row)
{
 var tableSelect= row.parentElement
 var rowIdx= row.rowIndex

 var rspan= new Array();
 var newCell, cs , idx;
 for(var i=0; i<rowIdx+1; i++)
  {
   row= tableSelect.rows[i]
   idx=0; 
   for(var j=0; j<=colx ; j++) // j= cellIndex
   	{
	 if(!rspan[j+idx])rspan[j+idx]=0;
   	 
	 while(rspan[j+idx]){rspan[j+idx]--; idx++ }

     if(row.cells[j]) rspan[j+idx]=row.cells[j].rowSpan-1
	 if(!row.cells[j] || (j+idx>=colx) )
   	 {
       if(i==rowIdx) return j;
	   else break;
     }
  	 idx += row.cells[j].colSpan-1
   	}
  }

}




function getMaxColumn()
{
 var rowSelect= cellSelect.parentElement
 var tableSelect= rowSelect.parentElement
 var cell, colnum=0
 for(var i=0; i<tableSelect.rows[0].cells.length ; i++) // i= cellIndex
  {
   cell= tableSelect.rows[0].cells[i]
   colnum += cell.colSpan
  }
 return colnum
}



function insertCol()
{
 if(! cellSelected()) return 
 
 var rowSelect= cellSelect.parentElement
 var tableSelect= rowSelect.parentElement
 var lines= tableSelect.rows

 var colx= getColumnNo()

 var rspan= new Array();
 var newCell, cs ;
 for(var i=0; i<lines.length; i++)
  {
   row= tableSelect.rows[i]
   idx=0; 
   for(var j=0; j<=colx ; j++) // j= cellIndex
   	{
	 if(!rspan[j+idx])rspan[j+idx]=0;
   	 
	 while(rspan[j+idx]){rspan[j+idx]--; idx++ }

     if(row.cells[j]) rspan[j+idx]=row.cells[j].rowSpan-1
	 if(!row.cells[j] || (j+idx>=colx) )
   	 {
	  if(row.cells[j-1]) cs=row.cells[j-1].colSpan
	  else cs=1
	  if(cs==1){ newCell=row.insertCell(j); break; }
	  else
		{
		  /*  for cut later ************
		  var cont= row.cells[j-1].innerHTML
		  if(cs - (j+idx-colx)>0) row.cells[j-1].colSpan= cs - (j+idx-colx)
		  newCell=row.insertCell(j)
		  newCell.runtimeStyle.backgroundColor = "#b09090" ;
          newCell=row.insertCell(j+1)
		  if(j+idx-colx>0) newCell.colSpan= j+idx-colx
		  newCell.innerHTML= cont
		  */
		  row.cells[j-1].colSpan += 1
		  break ;
	    }
   	 }
  	 idx += row.cells[j].colSpan-1
   	}
  }

}




function deleteCol()
{
 if(! cellSelected()) return 
 
 var rowSelect= cellSelect.parentElement
 var tableSelect= rowSelect.parentElement
 var lines= tableSelect.rows

 var colx= getColumnNo()

 var rspan= new Array();
 var newCell, cs ;
 for(var i=0; i<lines.length; i++)
  {
   row= tableSelect.rows[i]
   idx=0; 
   for(var j=0; j<=colx ; j++) // j= cellIndex
   	{
	 if(!rspan[j+idx])rspan[j+idx]=0;
   	 while(rspan[j+idx]){rspan[j+idx]--; idx++ }
     if(row.cells[j]) rspan[j+idx]=row.cells[j].rowSpan-1
	 if(!row.cells[j] || (j+idx>=colx) )
   	 {
	  if(row.cells[j-1]) cs=row.cells[j-1].colSpan
	  else cs=1
	  if(cs==1) row.deleteCell(j)
	  else row.cells[j-1].colSpan -= 1
	  break ;
   	 }
  	 idx += row.cells[j].colSpan-1
   	}
  }

}





function cleanupSelection()
{
  if (cellSelect!=null) 
   {
    cellSelect.runtimeStyle.backgroundColor = "" ;
    cellSelect.runtimeStyle.color = "";
   }
}


function currentCell(cell)
{
  cleanupSelection();
  var table= cell.parentElement.parentElement.parentElement
  if(cell.bgColor!='#00ffff' && table.bgColor!='#00ffff') 
    cell.runtimeStyle.backgroundColor = "cyan";  
  else cell.runtimeStyle.backgroundColor = "#00aaaa";  
  cell.runtimeStyle.color = "red";
  cellSelect= cell  
}



function doClick(el)
{
  if(el.tagName=='TABLE'){ TABLE=el; return}
  TABLE=null

  while(el.tagName !='TD' && el.tagName !='BODY') el= el.parentElement
  if(el.tagName!="TD"){ cleanupSelection(); cellSelect=null; return }
  if(el!=cellSelect) currentCell(el)
}




function cellProp()
{
  if(! cellSelected()) return 
 	 
  var twidth= screen.width/2, theight=250;
  var tposx= (screen.width- twidth)/2
  var tposy= screen.height- theight - 55

  var urlx= QBPATH + '/cellpro.html'

  var newWin1=window.open(urlx,"cell","toolbar=no,width=435,height=250, directories=no,status=no,scrollbars=yes,resizable=no,menubar=no")
  newWin1.focus()
	
}



function tableProp()
{

  if(!TABLE && !cellSelected()) return 

  var urlx= QBPATH + '/tablepro.html'
  	    	  
  newWin1=window.open(urlx,"table","toolbar=no,width=480,height=260,directories=no,status=no,scrollbars=no,resizable=no, menubar=no")
  newWin1.focus()
}



function morecolSpan()
{
  if(! cellSelected()) return 

  var maxcol= getMaxColumn()
  var colx= getColumnNo() ; // current
  if(colx+cellSelect.colSpan>=maxcol) return

  var col= cellSelect.cellIndex
  var row=cellSelect.parentElement
  if(row.cells[col+1])
  {
   cellSelect.innerHTML += row.cells[col+1].innerHTML
   cellSelect.colSpan += row.cells[col+1].colSpan
   row.deleteCell(col+1)
  }

}




function lesscolSpan()
{
  if(! cellSelected()) return 
  if(cellSelect.colSpan==1) return
  var col= cellSelect.cellIndex
  cellSelect.colSpan -= 1
  cellSelect.parentElement.insertCell(col+1)

}



function morerowSpan()
{
  if(!cellSelected()) return 

  var rowSpan= cellSelect.rowSpan
  var rowSelect=cellSelect.parentElement
  var tableSelect=rowSelect.parentElement
  var rowNum= tableSelect.rows.length
  var ridx= rowSelect.rowIndex+rowSpan; // next

  if( ridx>=rowNum) return 

  var colx= getColumnNo() ; // current
  var rowNext= tableSelect.rows[ridx]
  var cidx=getCellIndex(colx, rowNext); // Next

  cellSelect.rowSpan += rowNext.cells[cidx].rowSpan
  cellSelect.innerHTML += rowNext.cells[cidx].innerHTML
  rowNext.deleteCell(cidx)
 
}


function lessrowSpan()
{
  if(! cellSelected()) return
  if(cellSelect.rowSpan==1) return

  var rowSpan= cellSelect.rowSpan
  var rowSelect=cellSelect.parentElement
  var tableSelect=rowSelect.parentElement
  var rowNum= tableSelect.rows.length
  var ridx= rowSelect.rowIndex+rowSpan-1; // next


  var colx= getColumnNo() ; // current
  var rowNext= tableSelect.rows[ridx]
  var cidx=getCellIndex(colx, rowNext); // Next

  cellSelect.rowSpan -= 1
  rowNext.insertCell(cidx)
  rowNext.cells[cidx].colSpan = cellSelect.colSpan

}


function WordClean() {
var objF=document.frames[fID]
if(!objF)return

var D;
if(format[fID]=="HTML") D=objF.document.body.innerHTML
else D=objF.document.body.innerText

D = D.replace(/\n/g, ' '); 
D = D.replace(/\r/g, ' '); 
D = D.replace(/\&nbsp\;/g,' '); 

D = D.replace(/ class=[^\s|>]*/gi,'');
D = D.replace(/ style=\"[^>]*\"/gi,'');
D = D.replace(/ align=[^\s|>]*/gi,'');

D = D.replace(/<b [^>]*>/gi,'<b>');
D = D.replace(/<p [^>]*>/gi,'<p>');
D = D.replace(/<i [^>]*>/gi,'<i>');
D = D.replace(/<li [^>]*>/gi,'<li>');
D = D.replace(/<ul [^>]*>/gi,'<ul>');

//D = D.replace(/<b>/gi,'<strong>');
//D = D.replace(/<\/b>/gi,'</strong>'); 

D = D.replace(/<em>/gi,'<i>');
D = D.replace(/<\/em>/gi,'</i>');

D = D.replace(/<\?xml:[^>]*>/g, '');
D = D.replace(/<\/?st1:[^>]*>/g,'');
D = D.replace(/<\/?[a-z]\:[^>]*>/g,'');
D = D.replace(/<\/?font[^>]*>/gi,'');
D = D.replace(/<\/?span[^>]*>/gi,' ');
D = D.replace(/<\/?div[^>]*>/gi,' ');
D = D.replace(/<\/?pre[^>]*>/gi,' ');
//D = D.replace(/<\/?h[1-6][^>]*>/gi,' '); 

oldlen = D.length + 1; 
while(oldlen > D.length) {
oldlen = D.length; 
D = D.replace(/<([a-z][a-z]*)> *<\/\1>/gi,' ');
D = D.replace(/<([a-z][a-z]*)> *<([a-z][^>]*)> *<\/\1>/gi,'<$2>'); 
} 
D = D.replace(/<([a-z][a-z]*)><\1>/gi,'<$1>');
D = D.replace(/<\/([a-z][a-z]*)><\/\1>/gi,'<\/$1>'); 

if(format[fID]=="HTML") objF.document.body.innerHTML=D 
else objF.document.body.innerText=D 

}

//операция поиска с заменой
function SearchReplace() {
var findText =  prompt('Искать','') || '';
var replaceText = prompt('Заменить на','') || '';

if (findText != "") {
var objF=document.frames[fID]
if(!objF)return

var D;
if(format[fID]=="HTML") D=objF.document.body.innerHTML
else D=objF.document.body.innerText

oldD = "";
n=0;
while(oldD != D) {
oldD = D; 
D = D.replace(findText,"#%%#");
n++;
if (n > 10000) {
alert("Предотвращено возможное зацикливание операции!\nБыло выполнено более 10000 циклов.")
break ;
}
}
n--;

if (n < 10000){
oldD = "";
m=0;
while(oldD != D) {
oldD = D; 
D = D.replace("#%%#",replaceText);
m++;
}
}


if(format[fID]=="HTML") objF.document.body.innerHTML=D 
else objF.document.body.innerText=D 
if (0 < n < 10000) {
alert("Произведено замен: "+n);
}
}
} 


