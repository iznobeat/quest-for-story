// Tailnet preview: serve only the explicit public build, never repository files.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve(import.meta.dirname,'../dist');
const manifest=JSON.parse(await readFile(resolve(root,'build.json'),'utf8'));
const allowed=new Set(['build.json',...Object.keys(manifest.files)]);
const host=process.env.QFS_PREVIEW_HOST||'127.0.0.1';
const port=Number(process.env.QFS_PREVIEW_PORT||4174);
http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try{
  const path=decodeURIComponent(new URL(req.url,'http://preview.local').pathname);
  const file=path==='/'?'index.html':path.slice(1);
  if(!allowed.has(file)){res.writeHead(404);res.end('Not found');return;}
  const body=await readFile(resolve(root,file));
  res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json'})[extname(file)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,host,()=>console.log(`Private game preview: http://${host}:${port}/?episode=civ`));
