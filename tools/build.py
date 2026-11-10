#!/usr/bin/env python3
"""Build the archive with links relative to its GitHub Pages directory."""
import hashlib, html, json, pathlib, posixpath, re, shutil
from urllib.parse import urljoin, urlsplit, unquote

root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'dist'
if out.exists():
    shutil.rmtree(out)
shutil.copytree(root / 'site', out)
origins = {}
if (root / 'manifest.json').exists():
    for row in json.loads((root / 'manifest.json').read_text()):
        if len(row) >= 4 and row[0] in ('ok', 'cached'):
            origins[row[1]] = row[3]

def local_url(value, document, original):
    value = html.unescape(value)
    if not value or value.startswith(('#', 'mailto:', 'tel:', 'data:', 'javascript:')):
        return value
    url = urlsplit(urljoin(original, value))
    if url.scheme not in ('http', 'https') or url.hostname not in ('tenco.ru', 'www.tenco.ru'):
        return value
    path = unquote(url.path or '/')
    if url.query and path == '/':
        name = hashlib.sha256((path + '?' + url.query).encode()).hexdigest() + '.html'
        if (out / '_queries' / name).exists():
            path = '/_queries/' + name
    rel = posixpath.relpath(path.lstrip('/') or 'index.html', posixpath.dirname(document) or '.')
    if path.endswith('/') and not rel.endswith('/'):
        rel += '/'
    if url.query and not path.startswith('/_queries/'):
        rel += '?' + url.query
    if url.fragment:
        rel += '#' + url.fragment
    return rel

attribute = re.compile(r'''(?P<prefix>\b(?:href|src|action|background|poster)\s*=\s*)(?P<q>["'])(?P<value>.*?)(?P=q)''', re.I | re.S)
unquoted = re.compile(r'''(?P<prefix>\b(?:href|src|action|background|poster)\s*=\s*)(?P<value>[^\s"'=<>`]+)''', re.I)
css_url = re.compile(r'''url\(\s*(?P<q>["']?)(?P<value>[^)'"\s]+)(?P=q)\s*\)''', re.I)
for file in out.rglob('*'):
    if not file.is_file() or file.suffix.lower() not in ('.html', '.htm', '.css'):
        continue
    document = file.relative_to(out).as_posix()
    original = origins.get(document, 'http://www.tenco.ru/' + ('' if document == 'index.html' else document))
    text = file.read_text(encoding='utf-8', errors='replace')
    if file.suffix.lower() != '.css':
        # The archived pages use a site-root <base>, removed during sanitization.
        original = 'http://www.tenco.ru/'
        text = attribute.sub(lambda m: m['prefix'] + m['q'] + html.escape(local_url(m['value'], document, original), quote=True) + m['q'], text)
        text = unquoted.sub(lambda m: m['prefix'] + '"' + html.escape(local_url(m['value'], document, original), quote=True) + '"', text)
        csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' data:; script-src \'none\'; connect-src \'none\'; frame-src \'none\'; object-src \'none\'; form-action \'none\'; base-uri \'none\'; style-src \'self\' \'unsafe-inline\'">'
        text = re.sub(r'<head\b[^>]*>', lambda m: m.group() + csp, text, count=1, flags=re.I)
        notice = '<div style="padding:8px 12px;background:#fff7d6;color:#332900;font:14px Arial,sans-serif;text-align:center">Архивная копия сайта. Контакты, цены и наличие могут быть неактуальны.</div>'
        text = re.sub(r'<body\b[^>]*>', lambda m: m.group() + notice, text, count=1, flags=re.I)
    text = css_url.sub(lambda m: 'url(' + m['q'] + local_url(m['value'], document, original) + m['q'] + ')', text)
    file.write_text(text, encoding='utf-8')
print('Built', sum(1 for f in out.rglob('*') if f.is_file()), 'files in', out)
