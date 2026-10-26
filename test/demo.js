const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const root=path.resolve(__dirname,'..');
const srv=http.createServer((q,r)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';const fp=path.join(root,f);if(!fs.existsSync(fp)){r.writeHead(404);return r.end();}
 let body=fs.readFileSync(fp); if(f==='/index.html') body=body.toString().replace(/<script src="config\.js[^"]*"><\/script>/,'<script src="test/fbmock.js"></script>');
 r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':f.endsWith('.woff2')?'font/woff2':'application/octet-stream'});r.end(body);}).listen(8766);
const tab=(p,v)=>p.evaluate(v=>{const b=document.createElement('button');b.dataset.tab=v;document.body.appendChild(b);b.click();b.remove();},v);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
const views=['resumen','lotes','labores','libro','cobros','cierre','liquidacion','precios','registrar','ajustes'];
for(const w of [390,1280]){
 const ctx=await b.newContext({viewport:{width:w,height:900},serviceWorkers:'block'});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://localhost:8766/');await p.waitForTimeout(400);
 await p.click('[data-act="demo"]');await p.waitForTimeout(600);
 for(const esc of ['hoy','freir','planta']){
  await p.selectOption('#demo-esc',esc);await p.waitForTimeout(700);
  for(const y of ['2025','2026']){ await p.selectOption('#f-year',y);await p.waitForTimeout(300);
   for(const v of views){await tab(p,v);await p.waitForTimeout(150);
    const sw=await p.evaluate(()=>document.documentElement.scrollWidth); if(sw>w) errs.push(`${w} ${esc} ${y} ${v} overflow ${sw}`);
    const bad=await p.evaluate(()=>document.querySelector('#view').innerText.match(/NaN|undefined|Algo falló|−\d+ sacos/g)); if(bad) errs.push(`${w} ${esc} ${y} ${v} ${bad}`);
    if(w===390&&y==='2025'&&['resumen','liquidacion','cobros','libro'].includes(v)) await p.screenshot({path:`test/demo-${esc}-${v}.png`,fullPage:true});
    if(w===1280&&y==='2025'&&v==='resumen') await p.screenshot({path:`test/demo-${esc}-resumen-1280.png`,fullPage:false});
   }
   await tab(p,'resumen');await p.waitForTimeout(150);
   if(w===390){const t=await p.evaluate(()=>{const d=document.querySelector('.demo-res').innerText.replace(/\n/g,' ');const h=document.querySelector('.hero').innerText.replace(/\n/g,' ');const k=[...document.querySelectorAll('.kpi')].map(x=>x.innerText.replace(/\n/g,' ')).join(' | ');return d+'\n  '+h+'\n  '+k});console.log(esc,y,t);}
  }
 }
 await ctx.close();}
console.log('errs',JSON.stringify(errs.slice(0,20)),errs.length);await b.close();srv.close();})();
