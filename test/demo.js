const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const root=path.resolve(__dirname,'..');
const srv=http.createServer((q,r)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';const fp=path.join(root,f);if(!fs.existsSync(fp)){r.writeHead(404);return r.end();}
 let body=fs.readFileSync(fp); if(f==='/index.html') body=body.toString().replace(/<script src="config\.js[^"]*"><\/script>/,'<script src="test/fbmock.js"></script>');
 r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':f.endsWith('.woff2')?'font/woff2':'application/octet-stream'});r.end(body);}).listen(8766);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
const views=['resumen','lotes','labores','libro','cobros','cierre','liquidacion','precios','registrar','ajustes'];
for(const [w,dark] of [[390,false],[1280,false]]){
 const ctx=await b.newContext({viewport:{width:w,height:900},colorScheme:dark?'dark':'light',serviceWorkers:'block'});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://localhost:8766/');await p.waitForTimeout(400);
 await p.click('[data-act="demo"]');await p.waitForTimeout(500);
 for(const v of views){await p.evaluate(v=>window.dispatchEvent(new Event('x')),v);
   await p.evaluate(v=>{const b=document.createElement('button');b.dataset.tab=v;document.body.appendChild(b);b.click();b.remove();},v);await p.waitForTimeout(250);
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth); if(sw>w) errs.push(w+' '+v+' overflow '+sw);
   const bad=await p.evaluate(()=>document.querySelector('#view').innerText.match(/NaN|undefined|Algo falló/g)); if(bad) errs.push(w+' '+v+' '+bad);
   await p.screenshot({path:`test/demo-${v}-${w}.png`,fullPage:true});
   if(v==='resumen'&&w===390) console.log((await p.evaluate(()=>document.querySelector('#view').innerText)).slice(0,1800));
 }
 // year 2025 summary
 await p.selectOption('#f-year','2025');await p.waitForTimeout(300);
 await p.evaluate(()=>{const b=document.createElement('button');b.dataset.tab='resumen';document.body.appendChild(b);b.click();b.remove();});await p.waitForTimeout(200);
 if(w===390){console.log('---2025---');console.log((await p.evaluate(()=>document.querySelector('#view').innerText)).slice(0,1500));
 await p.evaluate(()=>{const b=document.createElement('button');b.dataset.tab='liquidacion';document.body.appendChild(b);b.click();b.remove();});await p.waitForTimeout(200);
 console.log('---liq 2025---');console.log((await p.evaluate(()=>document.querySelector('#view').innerText)).slice(0,1200));}
 await p.screenshot({path:`test/demo-2025-${w}.png`,fullPage:true});
 await ctx.close();}
console.log('errs',JSON.stringify(errs));await b.close();srv.close();})();
