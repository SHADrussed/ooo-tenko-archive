from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from pathlib import Path
from urllib.parse import urlsplit
import hashlib
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  u=urlsplit(self.path)
  if u.query and u.path=='/':
   key=hashlib.sha256((u.path+'?'+u.query).encode()).hexdigest()
   self.path='/_queries/'+key+'.html'
  super().do_GET()
 def end_headers(self):
  self.send_header('Content-Security-Policy',"default-src 'self' data:; script-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'; style-src 'self' 'unsafe-inline'")
  super().end_headers()
root=Path(__file__).parent/'site'
s=ThreadingHTTPServer(('127.0.0.1',8000),partial(Handler,directory=str(root)))
print('http://127.0.0.1:8000/',flush=True)
try:s.serve_forever()
except KeyboardInterrupt:pass
finally:s.server_close()
