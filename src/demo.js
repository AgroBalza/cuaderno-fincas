// Demonstration mode: an in-memory database with the same surface as fb.js,
// filled with a simulated operation built from the plan's assumptions.
// Nothing here touches Firestore; reloading the page throws it all away.

export function memDb(seed) {
  const store = new Map(Object.entries(seed));
  const subs = new Set();
  let idc = 0;
  const notify = () => subs.forEach(s => s());
  const later = fn => setTimeout(fn, 0);
  const copy = d => JSON.parse(JSON.stringify(d));

  function Q(path, filters = [], ord = null, lim = 1e9) {
    const run = () => {
      const pre = path + '/';
      let ds = [...store.entries()].filter(([k]) => k.startsWith(pre) && !k.slice(pre.length).includes('/'))
        .map(([k, v]) => ({ id: k.slice(pre.length), v }))
        .filter(({ v }) => filters.every(([f, op, x]) => op === '>=' ? v[f] >= x : op === '<=' ? v[f] <= x : op === '==' ? v[f] === x : true));
      if (ord) ds.sort((a, b) => (a.v[ord[0]] < b.v[ord[0]] ? -1 : a.v[ord[0]] > b.v[ord[0]] ? 1 : 0) * (ord[1] === 'desc' ? -1 : 1));
      ds = ds.slice(0, lim);
      return { docs: ds.map(({ id, v }) => ({ id, data: () => v })), size: ds.length, empty: !ds.length, fromCache: false };
    };
    return {
      where: (f, op, v) => Q(path, [...filters, [f, op, v]], ord, lim),
      orderBy: (f, d = 'asc') => Q(path, filters, [f, d], lim),
      limit: n => Q(path, filters, ord, n),
      onSnapshot: next => { const s = () => next(run()); subs.add(s); later(s); return () => subs.delete(s); },
      add: async d => { const id = 'demo' + (++idc); store.set(`${path}/${id}`, copy(d)); later(notify); return { id }; },
      doc: id => D(`${path}/${id || 'demo' + (++idc)}`),
    };
  }
  function D(path) {
    const snap = () => ({ id: path.split('/').pop(), exists: store.has(path), data: () => store.get(path) });
    return {
      id: path.split('/').pop(),
      set: async d => { store.set(path, copy(d)); later(notify); },
      update: async d => { store.set(path, { ...(store.get(path) || {}), ...copy(d) }); later(notify); },
      delete: async () => { store.delete(path); later(notify); },
      onSnapshot: next => { const s = () => next(snap()); subs.add(s); later(s); return () => subs.delete(s); },
    };
  }
  return { collection: p => Q(p), doc: D };
}

// Plan assumptions (from the financial model, 2026-10-17):
// 3 farms x 200 seed sacks a year, ~6 sacks harvested per seed sack (1,200 per farm),
// four staggered plantings per farm so one farm harvests every month,
// restaurants in Caracas take ~200 sacks a month at $40, the rest goes to the truck buyer at the farm,
// freight $4 a sack to Caracas, cultivation target $15 a sack, manager pay + trips + admin $21,240 a year.
const FINCAS = [['el-baho', 'El Baho', 1], ['el-mostrenco', 'El Mostrenco', 2], ['hoyo-el-barro', 'Hoyo El Barro', 3]];
const RESTAURANTES = ['Parrilla El Llano', 'Restaurante La Casona', 'Hamburguesas Altamira', 'Cafetería El Ávila'];
const CAMIONEROS = ['Camionero José Rangel', 'Camionero Ramón Peña'];
const ENCARGADOS = ['Pedro Dávila', 'Juan Rivas', 'Carlos Uzcátegui'];

export function demoData(hoy) {
  let s = 20261026;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const vary = (x, p) => x * (1 + (rnd() * 2 - 1) * p);
  const r2 = x => Math.round(x * 100) / 100;
  const iso = d => d.toLocaleDateString('en-CA');
  const add = (date, n) => { const d = new Date(date + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
  const ym = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
  const cy = +hoy.slice(0, 4), y0 = cy - 1;
  const out = {};
  let n = 0;
  const put = (p, d) => { out[p] = d; };
  const reg = d => { if (d.fecha <= hoy) put('registros/sim' + (++n), { autor: 'demo', creado: d.fecha + 'T12:00:00', ...d }); };

  FINCAS.forEach(([id, nombre, orden], i) => put('fincas/' + id, { nombre, ha: 14, encargado: ENCARGADOS[i], orden }));
  put('ajustes/general', { kgSaco: 50, metaSacosFinca: 1200, metaCostoSaco: 15, precioRef: 25, cicloDias: 150, pctTrabajo: 33.33, pctTierra: 33.33, pctDinero: 33.34, prorrateo: 'iguales', baseEncargado: 'utilidad', presupSemilla: 90, diasCredito: 15 });
  FINCAS.forEach(([id], i) => put('miembros/encargado' + (i + 1) + '@ejemplo.com', { nombre: ENCARGADOS[i], rol: 'encargado', finca: id }));
  put('miembros/familia@ejemplo.com', { nombre: 'Papá', rol: 'familia', finca: '' });

  // Plantings: each farm sows 50 seed sacks every three months, offset by one month per farm,
  // from August two years back so the first simulated year opens with harvests already coming in.
  const lotes = [];
  FINCAS.forEach(([fid], i) => {
    for (let m = -5 + i; m <= 24; m += 3) {
      const y = y0 + Math.floor((m - 1) / 12), mes = ((m - 1) % 12 + 12) % 12 + 1;
      const siembra = `${ym(y, mes)}-${String(3 + Math.floor(rnd() * 8)).padStart(2, '0')}`;
      const cosecha = add(siembra, 150);
      const t = lotes.filter(l => l.finca === fid && l.siembra.startsWith(String(y))).length + 1;
      lotes.push({ id: `sim-${fid}-${siembra}`, finca: fid, siembra, cosecha, nombre: `Tanda ${t} · ${y}`, rend: vary(6, 0.12), costo: vary(1, 0.1) });
    }
  });
  for (const l of lotes) {
    const estado = l.cosecha <= hoy ? 'cosechado' : l.siembra <= hoy ? 'sembrado' : 'plan';
    put('lotes/' + l.id, { nombre: l.nombre, finca: l.finca, variedad: 'Granola', ha: 1.1, siembra: l.siembra, cicloDias: 150, sacosSemilla: 50, estado, notas: '' });
    // Cultivation spend along the cycle, about $4,500 for 50 seed sacks (= $15 a harvested sack at plan yield).
    const g = (d, cat, monto, desc) => reg({ tipo: 'gasto', fecha: add(l.siembra, d), finca: l.finca, lote: l.id, cat, monto: Math.round(vary(monto, 0.06) * l.costo), desc });
    g(-12, 'maquinaria', 260, 'Arada y rastra');
    g(0, 'semilla', 1500, '50 sacos de semilla certificada');
    g(0, 'fertilizante', 650, 'Abono de fondo');
    g(1, 'jornales', 260, 'Siembra');
    g(35, 'fertilizante', 550, 'Reabono');
    g(36, 'jornales', 240, 'Primer aporque');
    g(45, 'agroquimicos', 240, 'Fumigación contra la gota');
    g(65, 'agroquimicos', 240, 'Fumigación contra la gota');
    g(85, 'agroquimicos', 220, 'Fumigación contra la gota');
    g(70, 'riego', 100, 'Mantenimiento de riego');
    g(150, 'jornales', 240, 'Cosecha y selección');
    if (l.cosecha <= hoy) {
      const tot = Math.round(50 * l.rend), seg = Math.round(tot * vary(0.15, 0.25));
      reg({ tipo: 'cosecha', fecha: l.cosecha, finca: l.finca, lote: l.id, sacosPrimera: tot - seg, sacosSegunda: seg, kgSaco: 50 });
      reg({ tipo: 'gasto', fecha: l.cosecha, finca: l.finca, lote: l.id, cat: 'sacos', monto: Math.round(tot * 0.5), desc: `${tot} sacos nuevos` });
      l.primera = tot - seg; l.segunda = seg;
    } else {
      // Labor already done on the planting that is still in the ground, so the to-do list looks lived in.
      [['prep', -15], ['siembra', 0], ['desyerbe', 25], ['aporque1', 35], ['fumi1', 45], ['aporque2', 60], ['fumi2', 65], ['fumi3', 85], ['fumi4', 105]].forEach(([k, d], j) => {
        const f = add(l.siembra, d);
        if (f < add(hoy, -3) && !(j === 6 && l.finca === 'hoyo-el-barro')) put(`labores/${l.id}_${k}`, { hecho: true, fechaHecho: add(f, Math.floor(rnd() * 3)) });
      });
    }
  }

  // Sales: each harvest goes out over the next five weeks, restaurants first (primera only), the truck buyer gets the rest.
  let ri = 0;
  for (const l of lotes.filter(l => l.primera)) {
    let prim = l.primera;
    for (let w = 0; w < 4; w++) {
      const fecha = add(l.cosecha, 3 + w * 7);
      if (fecha > hoy) { prim = 0; break; }
      // ~200 sacks a month to restaurants: about 50 a week, split between two restaurants.
      for (let k = 0; k < 2; k++) {
        const sacos = Math.min(prim, Math.round(vary(25, 0.2)));
        if (sacos <= 0) continue;
        prim -= sacos;
        const precio = 40, cliente = RESTAURANTES[ri++ % RESTAURANTES.length];
        const cobro = add(fecha, 8 + Math.floor(rnd() * 14));
        const cobrado = cobro <= hoy && !(cliente === 'Hamburguesas Altamira' && fecha > add(hoy, -40));
        reg({ tipo: 'venta', fecha, finca: l.finca, lote: l.id, sacos, precio, monto: sacos * precio, comprador: cliente, canal: 'restaurante', calidad: 'primera', cobrado, ...(cobrado ? { fechaCobro: cobro } : {}) });
        reg({ tipo: 'gasto', fecha, finca: l.finca, lote: l.id, cat: 'flete', monto: sacos * 4, desc: `Flete a Caracas, ${sacos} sacos (camión del tío)` });
      }
    }
    const fecha = add(l.cosecha, 2);
    if (fecha <= hoy) {
      const cam = CAMIONEROS[Math.floor(rnd() * 2)];
      const pP = Math.round(vary(25, 0.08));
      if (prim > 0) reg({ tipo: 'venta', fecha, finca: l.finca, lote: l.id, sacos: prim, precio: pP, monto: prim * pP, comprador: cam, canal: 'camionero', calidad: 'primera', cobrado: true, fechaCobro: fecha });
      const pS = Math.round(vary(15, 0.1));
      reg({ tipo: 'venta', fecha, finca: l.finca, lote: l.id, sacos: l.segunda, precio: pS, monto: l.segunda * pS, comprador: cam, canal: 'camionero', calidad: 'segunda', cobrado: true, fechaCobro: fecha });
    }
  }

  // Management: $21,240 a year = $1,770 a month, shared by the three farms.
  for (let y = y0; y <= cy; y++) for (let m = 1; m <= 12; m++) {
    const p = ym(y, m);
    reg({ tipo: 'gasto', fecha: p + '-28', finca: 'general', cat: 'sueldo', monto: 1200, desc: 'Sueldo del gerente' });
    reg({ tipo: 'gasto', fecha: p + '-15', finca: 'general', cat: 'viajes', monto: 420, desc: 'Viaje a las fincas y a Caracas' });
    reg({ tipo: 'gasto', fecha: p + '-05', finca: 'general', cat: 'admin', monto: 150, desc: 'Contador y teléfono' });
    // Prices: Coche per 45 kg sack and the farm-gate price per 50 kg sack.
    const ola = Math.sin((m + y * 12) / 2.2);
    if (`${p}-10` <= hoy) {
      put(`precios/sim-coche-${p}`, { fecha: `${p}-10`, mercado: 'coche', producto: 'Papa', precio: r2(35 + ola * 3 + (rnd() - 0.5) * 2), kgSaco: 45, desc: 'Simulado' });
      put(`precios/sim-finca-${p}`, { fecha: `${p}-12`, mercado: 'finca', producto: 'Papa', precio: r2(25 + ola * 2.5 + (rnd() - 0.5) * 2), kgSaco: 50, desc: 'Simulado' });
    }
    const fin = new Date(y, m, 1).toLocaleDateString('en-CA');
    if (add(fin, 5) <= hoy) put(`cierres/${p}`, { anio: y, mes: m, finca: 'all', cerrado: true, fechaCierre: add(fin, 3), nota: 'Mes cerrado y reporte enviado a la familia.' });
  }
  return out;
}
