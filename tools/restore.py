#!/usr/bin/env python3
import concurrent.futures, hashlib, json, pathlib, urllib.parse, urllib.request, urllib.error, re, time, subprocess, tempfile, os
from collections import Counter
root=pathlib.Path(__file__).resolve().parent.parent; site=root/'site'; stamp='20221005044154'
rows=json.loads((root/'cdx-index.json').read_text())[1:]; items={}
for ts,url,mime,*rest in rows:
 u=urllib.parse.urlsplit(url)
 if ts>stamp or u.hostname not in ('tenco.ru','www.tenco.ru'): continue
 path=urllib.parse.unquote(u.path or '/')
 if '..' in pathlib.PurePosixPath(path).parts: continue
 if u.query:
  rel='_queries/'+hashlib.sha256((u.path+'?'+u.query).encode()).hexdigest()+('.html' if mime=='text/html' else '.xml')
 elif path=='/':rel='index.html'
 elif path.endswith('/'):rel=path.lstrip('/')+'index.html'
 else:rel=path.lstrip('/')
 if not rel:continue
 if rel not in items or ts>items[rel][0]:items[rel]=(ts,url,mime)
items['index.html']=(stamp,'http://www.tenco.ru/','text/html')
print('selected',len(items),flush=True)
def fetch(item):
 rel,(ts,url,mime)=item; dest=site/rel
 if dest.exists():return ('cached',rel,ts,url)
 try:
  archive='https://web.archive.org/web/'+ts+'id_/'+url
  with tempfile.NamedTemporaryFile(delete=False) as tmp: temp=tmp.name
  try:
   proc=subprocess.run(['curl','-fsSL','--max-time','25','-o',temp,'-w','%{url_effective}',archive],capture_output=True,text=True,timeout=30)
   if proc.returncode: raise ValueError(proc.stderr.strip() or 'curl failed')
   data=pathlib.Path(temp).read_bytes(); final=proc.stdout
   if not data: raise ValueError('empty response')
  finally:
   os.unlink(temp)
  if mime=='text/html':
   choices=[(enc,data.decode(enc,errors='replace')) for enc in ('utf-8','cp1251','koi8-r')]
   def score(pair):
    s=pair[1].lower();return sum(s.count(w)*len(w) for w in ('котел','котель','прибор','компани','оборудован','продукц','документ','главная','страниц','автомат','счетчик','чебоксар','каталог','контакт','электро'))-s.count('\ufffd')*3
   enc,s=max(choices,key=score)
   if not re.search(r'<(?:html|!doctype)',s,re.I):raise ValueError('not HTML')
   s=re.sub(r'<script\b[^>]*>.*?</script\s*>','',s,flags=re.I|re.S)
   s=re.sub(r'<base\b[^>]*>','',s,flags=re.I)
   s=re.sub(r'<meta\b[^>]*charset\s*=[^>]*>','',s,flags=re.I)
   s=re.sub(r'\s+on\w+\s*=\s*(["\']).*?\1','',s,flags=re.I|re.S)
   s=re.sub(r'(?i)(href|src)=(\s*["\'])https?://(?:www\.)?tenco\.ru(?::80)?/',r'\1=\2/',s)
   s=re.sub(r'(?i)<head[^>]*>',lambda m:m.group()+'<meta charset="utf-8">',s,count=1)
   data=s.encode('utf8')
  dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
  return ('ok',rel,ts,url,final,len(data),enc if mime=='text/html' else None)
 except Exception as e:return ('error',rel,ts,url,str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 results=[]
 for i,result in enumerate(pool.map(fetch, sorted(items.items(), key=lambda item: (0 if item[1][2].startswith(("image/", "text/css")) else 1 if item[1][2] == "text/html" else 2, item[0]))),1):
  results.append(result)
  if i%20==0:
   (root/'manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
   print(i,'/',len(items),Counter(r[0] for r in results),flush=True)
(root/'manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(Counter(r[0] for r in results),flush=True)
