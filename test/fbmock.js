(function(){
const store = new Map(); const subs = [];
let idc=0;
function notify(){ subs.forEach(s=>s.fire()); }
function colDocs(path){ const pre=path+'/'; return [...store.entries()].filter(([k])=>k.startsWith(pre)&&!k.slice(pre.length).includes('/')).map(([k,v])=>({id:k.slice(pre.length),exists:true,data:()=>v,metadata:{}})); }
function query(path, filters=[], ord=null, lim=1000){
  const q={ where(f,op,v){return query(path,[...filters,[f,op,v]],ord,lim)}, orderBy(f,d='asc'){return query(path,filters,[f,d],lim)}, limit(n){return query(path,filters,ord,n)},
   run(){ let ds=colDocs(path).filter(d=>filters.every(([f,op,v])=>{const x=d.data()[f]; return op==='>='?x>=v:op==='<='?x<=v:op==='=='?x===v:true;})); if(ord) ds.sort((a,b)=>{const x=a.data()[ord[0]],y=b.data()[ord[0]]; return (x<y?-1:x>y?1:0)*(ord[1]==='desc'?-1:1)}); return ds.slice(0,lim); },
   get: async()=>{const docs=q.run(); return {docs,size:docs.length,empty:!docs.length}},
   onSnapshot(next){ const s={fire:()=>{const docs=q.run(); next({docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{}})}}; subs.push(s); setTimeout(s.fire,5); return ()=>{const i=subs.indexOf(s); if(i>=0)subs.splice(i,1)}; },
   doc(id){ return docRef(path+'/'+(id||('m'+(++idc)))); }, add: async(d)=>{ const r=docRef(path+'/'+('m'+(++idc))); await r.set(d); return r; }, path };
  return q;
}
function docRef(path){ return { id:path.split('/').pop(), path,
  get: async()=>({id:path.split('/').pop(), exists:store.has(path), data:()=>store.get(path), metadata:{}}),
  set: async(d)=>{store.set(path,JSON.parse(JSON.stringify(d))); notify();},
  update: async(d)=>{ if(!store.has(path)) throw {code:'invalid_argument'}; store.set(path,{...store.get(path),...d}); notify();},
  delete: async()=>{store.delete(path); notify();},
  onSnapshot(next){ const s={fire:()=>next({id:path.split('/').pop(),exists:store.has(path),data:()=>store.get(path),metadata:{}})}; subs.push(s); setTimeout(s.fire,5); return ()=>{}; },
  collection(p){ return query(path+'/'+p); } }; }
const db={ doc:docRef, collection:p=>query(p) };
window.__store=store; window.__notify=notify;
const authCbs=[]; let cur=null;
const auth={ onChange(cb){authCbs.push(cb); setTimeout(()=>cb(cur),10); return ()=>{}}, login: async(e,p)=>{ if(p!=='secreto') throw {code:'auth/invalid-credential'}; cur={email:e.toLowerCase(),name:''}; authCbs.forEach(c=>c(cur)); }, register: async(e,p,n)=>{ cur={email:e.toLowerCase(),name:n}; authCbs.forEach(c=>c(cur)); }, reset: async()=>{}, invite: async(e)=>{ (window.__invites=window.__invites||[]).push(e); if(window.__inviteFail) throw {code:'auth/operation-not-allowed'}; }, isLink: ()=>false, linkLogin: async()=>{}, logout: async()=>{ cur=null; authCbs.forEach(c=>c(null)); } };
window.__fbMock=(c,e,p)=>{window.__onPending=p;return {db,auth};};
window.CUADERNO_CONFIG={firebase:{},administradores:['luis@x.com']};
// seed
const put=(p,d)=>store.set(p,d);
put('miembros/pedro@x.com',{nombre:'Pedro',rol:'encargado',finca:'el-baho'});put('miembros/papa@x.com',{nombre:'Papá',rol:'familia'});
put('fincas/el-baho',{nombre:'El Baho',ha:14,encargado:'',orden:1}); put('fincas/el-mostrenco',{nombre:'El Mostrenco',ha:14,encargado:'',orden:2}); put('fincas/hoyo-el-barro',{nombre:'Hoyo El Barro',ha:14,encargado:'',orden:3});
put('ajustes/general',{kgSaco:50,metaSacosFinca:1200,metaCostoSaco:15,precioRef:25,cicloDias:150,pctTrabajo:33.33,pctTierra:33.33,pctDinero:33.34,prorrateo:'iguales',baseEncargado:'utilidad'});
put('lotes/l1',{nombre:'Tanda 1 · 2026',finca:'el-baho',variedad:'Granola',siembra:'2026-03-01',cicloDias:150,sacosSemilla:50,estado:'sembrado'});
put('lotes/l2',{nombre:'Tanda 2 · 2026',finca:'el-mostrenco',variedad:'Granola',siembra:'2026-06-01',cicloDias:150,sacosSemilla:50,estado:'sembrado'});
put('lotes/l3',{nombre:'Tanda 1 · 2027',finca:'hoyo-el-barro',variedad:'Granola',siembra:'2026-09-01',cicloDias:150,sacosSemilla:50,estado:'plan'});
const R=(id,d)=>put('registros/'+id,{autor:'luis@x.com',...d});
R('a',{tipo:'gasto',fecha:'2026-03-02',finca:'el-baho',lote:'l1',cat:'semilla',monto:1250,desc:'semilla'});
R('b',{tipo:'gasto',fecha:'2026-04-10',finca:'el-baho',lote:'l1',cat:'fertilizante',monto:900});
R('c',{tipo:'gasto',fecha:'2026-05-10',finca:'general',cat:'viajes',monto:520});
R('d',{tipo:'cosecha',fecha:'2026-08-01',finca:'el-baho',lote:'l1',sacosPrimera:250,sacosSegunda:50,kgSaco:50});
R('e',{tipo:'venta',fecha:'2026-08-03',finca:'el-baho',lote:'l1',sacos:280,precio:25,monto:7000,cobrado:true,comprador:'Pedro',canal:'camionero'});
R('f',{tipo:'venta',fecha:'2026-09-03',finca:'el-mostrenco',sacos:20,precio:40,monto:800,cobrado:false,comprador:'Plan B',canal:'restaurante'});
R('g',{tipo:'venta',fecha:'2026-10-02',finca:'el-mostrenco',sacos:15,precio:40,monto:600,cobrado:false,comprador:'Plan B',canal:'restaurante'});
R('h',{tipo:'gasto',fecha:'2026-07-02',finca:'el-mostrenco',lote:'l2',cat:'fertilizante',monto:4800});
R('i',{tipo:'venta',fecha:'2026-10-20',finca:'el-baho',sacos:30,precio:27,monto:810,cobrado:true,fechaCobro:'2026-10-24',comprador:'Pedro',canal:'camionero'});
put('cierres/2026-08',{anio:2026,mes:8,finca:'all',nota:'ok',cerrado:true,fechaCierre:'2026-09-01'});
put('precios/p1',{fecha:'2026-09-01',mercado:'coche',producto:'Papa andina',precio:35,kgSaco:45});
put('precios/p2',{fecha:'2026-10-01',mercado:'coche',producto:'Papa andina',precio:33,kgSaco:45});
put('precios/p3',{fecha:'2026-09-15',mercado:'finca',producto:'Papa',precio:25,kgSaco:50});
})();
