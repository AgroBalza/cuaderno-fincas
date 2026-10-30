const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const root=path.resolve(__dirname,'..');
const srv=http.createServer((q,r)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';const fp=path.join(root,f);if(!fs.existsSync(fp)){r.writeHead(404);return r.end();}
 let body=fs.readFileSync(fp); if(f==='/index.html') body=body.toString().replace(/<script src="config\.js[^"]*"><\/script>/,'<script src="test/fbmock.js"></script>');
 r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':f.endsWith('.png')?'image/png':'application/octet-stream'});r.end(body);}).listen(8765);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const errs=[];
const views=['resumen','numeros','registrar','lotes','labores','libro','almacen','cobros','cierre','liquidacion','precios','guia','ajustes'];
async function session(w,dark,email,tag){
 const ctx=await b.newContext({viewport:{width:w,height:900},colorScheme:dark?'dark':'light',serviceWorkers:'block'});await ctx.route('https://ve.dolarapi.com/**',r=>r.fulfill({status:200,headers:{'access-control-allow-origin':'*','content-type':'application/json'},body:'[{"fuente":"oficial","promedio":887.3},{"fuente":"paralelo","promedio":997.87}]'}));const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(tag+' '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(tag+' '+m.text())});
 await p.goto('http://localhost:8765/');await p.waitForTimeout(400);
 await p.screenshot({path:`test/login-${tag}.png`});
 await p.fill('#lg-email',email);await p.fill('#lg-pass','secreto');await p.click('#login-form button[type=submit]');await p.waitForTimeout(500);
 const vis=[];
 for(const v of views){if(await p.evaluate(v=>{const PAR={almacen:'numeros',cierre:'numeros',liquidacion:'numeros',precios:'numeros',metas:'numeros',labores:'lotes',cobros:'libro'};const vis=x=>[...document.querySelectorAll(`[data-tab="${x}"]`)].find(e=>e.offsetParent);if(!vis(v)&&PAR[v]&&vis(PAR[v])){vis(PAR[v]).click();return true}return false},v))await p.waitForTimeout(150);
 const ok=await p.evaluate(v=>{const vis=x=>[...document.querySelectorAll(`[data-tab="${x}"]`)].find(e=>e.offsetParent);const e=vis(v);if(e){e.click();return true}const m=[...document.querySelectorAll('[data-tab="mas"]')].find(e=>e.offsetParent);if(m){m.click();return 'mas'}return false},v);
   if(ok==='mas'){await p.waitForTimeout(100);const ok2=await p.evaluate(v=>{const e=document.querySelector(`.sheet [data-tab="${v}"]`);if(e){e.click();return true}document.querySelector('.scrim')?.click();return false},v);if(!ok2){await p.waitForTimeout(100);continue}}
   else if(!ok) continue;
   await p.waitForTimeout(200);vis.push(v);
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth); if(sw>w) errs.push(tag+' '+v+' overflow '+sw);
   if(['resumen','ajustes','registrar'].includes(v)) await p.screenshot({path:`test/${v}-${tag}.png`,fullPage:true});
 }
 console.log(tag,'views',vis.join(','));
 return {p,ctx};
}
let {p,ctx}=await session(390,false,'luis@x.com','admin390');
await p.fill('#mb-email','tio@x.com');await p.fill('#mb-nombre','Tío');await p.fill('#mb-tel','0414 1234567');await p.check('input[name="mb-finca"][value="hoyo-el-barro"]');await p.click('#mb-form button[type=submit]');await p.waitForTimeout(200);
console.log('wa',await p.evaluate(()=>document.querySelector('.aviso a.primary')?.href));
console.log('tio doc',await p.evaluate(()=>JSON.stringify(window.__store.get('miembros/tio@x.com'))));
console.log('miembros',await p.evaluate(()=>[...window.__store.keys()].filter(k=>k.startsWith('miembros/')).join(',')));
await ctx.close();
({p,ctx}=await session(1200,true,'luis@x.com','admin1200')); await ctx.close();
({p,ctx}=await session(390,false,'pedro@x.com','enc390'));
console.log('enc finca opts',await p.evaluate(()=>[...document.querySelectorAll('#f-finca option')].map(o=>o.value).join(',')));
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="registrar"]')].find(e=>e.offsetParent).click());await p.waitForTimeout(150);
console.log('enc reg fincas',await p.evaluate(()=>[...document.querySelectorAll('#r-finca option')].map(o=>o.value).join(',')));
await p.fill('#r-monto','40');await p.click('#reg-form button[type=submit]');await p.waitForTimeout(200);
await p.screenshot({path:'test/enc-after.png'});
await ctx.close();
({p,ctx}=await session(390,false,'juan@x.com','obr2'));
console.log('obr2',await p.evaluate(()=>document.querySelector('.obr .eyebrow')?.textContent));await p.evaluate(()=>[...document.querySelectorAll('[data-tab="registrar"]')].find(e=>e.offsetParent).click());await p.waitForTimeout(150);
console.log('obr2 fincas',await p.evaluate(()=>[...document.querySelectorAll('#r-finca option')].map(o=>o.value).join(',')));await ctx.close();
({p,ctx}=await session(390,false,'papa@x.com','fam390')); await ctx.close();
({p,ctx}=await session(390,false,'jefe@x.com','jefe390'));
console.log('jefe plan',await p.evaluate(()=>{[...document.querySelectorAll('[data-tab="lotes"]')].find(e=>e.offsetParent)?.click();return 1}));await p.waitForTimeout(200);console.log('jefe planform',await p.evaluate(()=>!!document.querySelector('#plan-form, .plan, [data-act="lote-new"]')));await ctx.close();
({p,ctx}=await session(390,false,'nadie@x.com','none390')); await p.screenshot({path:'test/none.png'}); await ctx.close();
console.log('errs',JSON.stringify(errs));
await b.close();srv.close();})();
