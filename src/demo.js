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

// Three scenarios, all from the financial model (Modelo financiero, 2026-10-17):
// - hoy: what the farms do today, Granola sold whole to the truck buyer at the farm, ~1,200 sacks per farm.
// - freir: a frying variety, yield +10% from better seed and soil work, ~200 sacks a month to Caracas restaurants at $40.
// - planta: yield +15%, a small plant washes, peels, cuts and vacuum-packs the potatoes (own plus ~400 sacks a month
//   bought from neighbours at $27) and sells 2.5 kg bags to ~8 restaurant clients at $1.40/kg.
// Every scenario carries cultivation at ~$4,500 per 50 seed sacks and manager pay + trips + admin of $21,240 a year.
export const ESCENARIOS = {
  hoy: {
    nombre: 'Hoy', largo: 'Como trabajamos hoy',
    supuestos: ['Papa Granola, unos 1.200 sacos por finca al año.', 'Todo se vende entero al camionero en la finca: primera a ~$27 y segunda a ~$14 (promedio $25).', 'Cultivo a $15 por saco; sueldo, viajes y contador $21.240 al año.'],
  },
  freir: {
    nombre: 'Para freír', largo: 'Papa para freír a restaurantes de Caracas',
    supuestos: ['Variedad para freír (Iniafrit), semilla y manejo de suelo mejorados: 10% más sacos.', 'Unos 200 sacos al mes de primera a restaurantes de Caracas a $40, con flete de $4 y selección de $1 por saco.', 'El resto (primera que sobra y segunda) al camionero en la finca.', 'El tercio del encargado se calcula a precio de finca; lo que se gana de más queda para tierra y dinero.'],
  },
  planta: {
    nombre: 'Papa cortada', largo: 'El futuro: papa cortada en bolsas',
    supuestos: ['Rendimiento 15% más alto. La primera se lava, pela, corta y empaca al vacío en bolsas de 2,5 kg.', 'Se compran ~400 sacos al mes de papa apta a vecinos a $27.', 'Se vende a ~8 clientes en Caracas a $1,40 el kilo ($3,50 la bolsa); de un saco de 50 kg salen 40 kg cortados.', 'Planta: 6 obreros ($1.500/mes), bolsas y energía $0,10/kg, flete refrigerado $0,12/kg.', 'Préstamo de $105.000 (máquinas, cuarto frío y galpón) a 4 años al 12%: cuota de $2.765 al mes.', 'No incluye impuesto sobre la renta.'],
  },
};
const FINCAS = [['el-baho', 'El Baho', 1], ['el-mostrenco', 'El Mostrenco', 2], ['hoyo-el-barro', 'Hoyo El Barro', 3]];
const RESTAURANTES = ['Parrilla El Llano', 'Restaurante La Casona', 'Hamburguesas Altamira', 'Cafetería El Ávila'];
const CLIENTES_PLANTA = ['Hamburguesas Altamira', 'Parrilla El Llano', 'Pollos Los Próceres', 'Burger Las Mercedes', 'Restaurante La Casona', 'Arepera Sabana Grande', 'Comida Rápida Chacao', 'Club Social El Cafetal'];
const CAMIONEROS = ['Camionero José Rangel', 'Camionero Ramón Peña'];
const ENCARGADOS = ['Pedro Dávila', 'Juan Rivas', 'Carlos Uzcátegui'];

export function demoData(hoy, esc = 'hoy') {
  let s = 20261026;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const vary = (x, p) => x * (1 + (rnd() * 2 - 1) * p);
  const r2 = x => Math.round(x * 100) / 100;
  const iso = d => d.toLocaleDateString('en-CA');
  const add = (date, n) => { const d = new Date(date + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
  const ym = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
  const cy = +hoy.slice(0, 4), y0 = cy - 1;
  const P = { hoy: { rend: 6, variedad: 'Granola' }, freir: { rend: 6.6, variedad: 'Iniafrit (para freír)' }, planta: { rend: 6.9, variedad: 'Iniafrit (para freír)' } }[esc] || { rend: 6, variedad: 'Granola' };
  const out = {};
  let n = 0;
  const put = (p, d) => { out[p] = d; };
  const reg = d => { if (d.fecha <= hoy) put('registros/sim' + String(++n).padStart(5, '0'), { autor: 'demo', creado: d.fecha + 'T12:00:00', ...d }); };

  FINCAS.forEach(([id, nombre, orden], i) => put('fincas/' + id, { nombre, ha: 14, encargado: ENCARGADOS[i], orden }));
  put('ajustes/general', { kgSaco: 50, metaSacosFinca: 1200, metaCostoSaco: 15, precioRef: 25, cicloDias: 150, pctTrabajo: 33.33, pctTierra: 33.33, pctDinero: 33.34, prorrateo: 'iguales', baseEncargado: esc === 'hoy' ? 'utilidad' : 'precioFinca', presupSemilla: 90, diasCredito: 15 });
  FINCAS.forEach(([id], i) => put('miembros/encargado' + (i + 1) + '@ejemplo.com', { nombre: ENCARGADOS[i], rol: 'encargado', finca: id }));
  put('miembros/familia@ejemplo.com', { nombre: 'Papá', rol: 'familia', finca: '' });

  // Plantings: each farm sows 50 seed sacks every three months, offset by one month per farm,
  // from mid two years back so the first simulated year opens with harvests already coming in.
  const lotes = [];
  FINCAS.forEach(([fid], i) => {
    for (let m = -5 + i; m <= 24; m += 3) {
      const y = y0 + Math.floor((m - 1) / 12), mes = ((m - 1) % 12 + 12) % 12 + 1;
      const siembra = `${ym(y, mes)}-${String(3 + Math.floor(rnd() * 8)).padStart(2, '0')}`;
      const t = lotes.filter(l => l.finca === fid && l.siembra.startsWith(String(y))).length + 1;
      lotes.push({ id: `sim-${fid}-${siembra}`, finca: fid, siembra, cosecha: add(siembra, 150), nombre: `Tanda ${t} · ${y}`, rend: vary(P.rend, 0.1), costo: vary(1, 0.1) });
    }
  });
  for (const l of lotes) {
    const estado = l.cosecha <= hoy ? 'cosechado' : l.siembra <= hoy ? 'sembrado' : 'plan';
    put('lotes/' + l.id, { nombre: l.nombre, finca: l.finca, variedad: P.variedad, ha: 1.1, siembra: l.siembra, cicloDias: 150, sacosSemilla: 50, estado, notas: '' });
    // Cultivation spend along the cycle, about $4,500 for 50 seed sacks.
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
      l.primera = tot - seg; l.segunda = seg;
    } else {
      // Labour already done on plantings still in the ground, so the to-do list looks lived in.
      [['prep', -15], ['siembra', 0], ['desyerbe', 25], ['aporque1', 35], ['fumi1', 45], ['aporque2', 60], ['fumi2', 65], ['fumi3', 85], ['fumi4', 105]].forEach(([k, d], j) => {
        const f = add(l.siembra, d);
        if (f < add(hoy, -3) && !(j === 6 && l.finca === 'hoyo-el-barro')) put(`labores/${l.id}_${k}`, { hecho: true, fechaHecho: add(f, Math.floor(rnd() * 3)) });
      });
    }
  }
  const cosechados = lotes.filter(l => l.primera != null);
  const camion = (l, fecha, sacos, precio, calidad) => { if (sacos > 0) reg({ tipo: 'venta', fecha, finca: l.finca, lote: l.id, sacos, precio, monto: sacos * precio, comprador: CAMIONEROS[Math.floor(rnd() * 2)], canal: 'camionero', calidad, cobrado: true, fechaCobro: fecha }); };
  const credito = (fecha, cliente, tarde) => { const cobro = add(fecha, 8 + Math.floor(rnd() * 14)); const cobrado = cobro <= hoy && !(cliente === tarde && fecha > add(hoy, -40)); return { cobrado, ...(cobrado ? { fechaCobro: cobro } : {}) }; };

  if (esc === 'hoy') {
    // Two truck loads per harvest, everything sold whole at the farm.
    for (const l of cosechados) {
      const a = Math.round(l.primera * 0.55);
      camion(l, add(l.cosecha, 2), a, Math.round(vary(27, 0.06)), 'primera');
      camion(l, add(l.cosecha, 9), l.primera - a, Math.round(vary(27, 0.06)), 'primera');
      camion(l, add(l.cosecha, 9), l.segunda, Math.round(vary(14, 0.08)), 'segunda');
    }
  }

  if (esc === 'freir') {
    // ~200 sacks a month to restaurants: about 50 a week for four weeks after each harvest, split between two clients.
    let ri = 0;
    for (const l of cosechados) {
      let prim = l.primera;
      for (let w = 0; w < 4; w++) {
        const fecha = add(l.cosecha, 3 + w * 7);
        if (fecha > hoy) { prim = 0; break; }
        for (let k = 0; k < 2; k++) {
          const sacos = Math.min(prim, Math.round(vary(25, 0.2)));
          if (sacos <= 0) continue;
          prim -= sacos;
          const cliente = RESTAURANTES[ri++ % RESTAURANTES.length];
          reg({ tipo: 'venta', fecha, finca: l.finca, lote: l.id, sacos, precio: 40, monto: sacos * 40, comprador: cliente, canal: 'restaurante', calidad: 'primera', ...credito(fecha, cliente, 'Hamburguesas Altamira') });
          reg({ tipo: 'gasto', fecha, finca: l.finca, lote: l.id, cat: 'flete', monto: sacos * 4, desc: `Flete a Caracas, ${sacos} sacos (camión del tío)` });
          reg({ tipo: 'gasto', fecha, finca: l.finca, lote: l.id, cat: 'sacos', monto: sacos, desc: `Selección y sacos nuevos, ${sacos} sacos` });
        }
      }
      camion(l, add(l.cosecha, 2), prim, Math.round(vary(26, 0.06)), 'primera');
      camion(l, add(l.cosecha, 2), l.segunda, Math.round(vary(15, 0.08)), 'segunda');
    }
  }

  if (esc === 'planta') {
    // Stock per farm in sacks of whole potato waiting to be cut; each delivery draws on the farm holding the most.
    const stock = Object.fromEntries(FINCAS.map(([f]) => [f, 0]));
    const ev = [];
    for (const l of cosechados) {
      ev.push([l.cosecha, () => { stock[l.finca] += l.primera; }]);
      ev.push([add(l.cosecha, 2), () => camion(l, add(l.cosecha, 2), l.segunda, Math.round(vary(15, 0.08)), 'segunda')]);
    }
    const start = `${y0 - 1}-12-01`;
    for (let d = start; d <= hoy; d = add(d, 1)) {
      const day = +d.slice(8, 10), dow = new Date(d + 'T12:00:00').getDay();
      ev.filter(e => e[0] === d).forEach(e => e[1]());
      if (day === 2) FINCAS.forEach(([f]) => {
        // Neighbour purchases: ~133 sacks a month per farm.
        const sacos = Math.round(vary(133, 0.12));
        reg({ tipo: 'cosecha', compra: true, fecha: d, finca: f, sacosPrimera: sacos, sacosSegunda: 0, kgSaco: 50, desc: 'Papa apta comprada a productores vecinos' });
        reg({ tipo: 'gasto', fecha: d, finca: f, cat: 'compra_papa', monto: sacos * 27, desc: `${sacos} sacos a $27` });
        stock[f] += sacos;
      });
      if (dow === 1) {
        // Monday deliveries: up to ~165 sacks a week of whole potato, cut into 2.5 kg bags.
        const total = Object.values(stock).reduce((a, b) => a + b, 0);
        let semana = Math.min(total, Math.round(vary(165, 0.08)));
        let kgSemana = 0;
        CLIENTES_PLANTA.forEach((cliente, k) => {
          const share = Math.round(semana / (CLIENTES_PLANTA.length - k) * vary(1, 0.15));
          const sacos = Math.min(semana, share);
          if (sacos <= 0) return;
          semana -= sacos;
          const f = Object.keys(stock).sort((a, b) => stock[b] - stock[a])[0];
          stock[f] -= sacos;
          const kg = sacos * 40, bolsas = Math.round(kg / 2.5);
          kgSemana += kg;
          reg({ tipo: 'venta', fecha: d, finca: f, sacos, precio: 56, monto: r2(bolsas * 3.5), bolsas, kgCortada: bolsas * 2.5, producto: 'cortada', comprador: cliente, canal: 'restaurante', calidad: 'primera', desc: `${bolsas} bolsas de 2,5 kg a $3,50`, ...credito(d, cliente, 'Burger Las Mercedes') });
          reg({ tipo: 'gasto', fecha: d, finca: f, cat: 'sacos', monto: sacos, desc: `Selección, ${sacos} sacos` });
        });
        if (kgSemana) {
          reg({ tipo: 'gasto', fecha: d, finca: 'general', cat: 'flete', monto: Math.round(kgSemana * 0.12), desc: `Flete refrigerado a Caracas, ${Math.round(kgSemana).toLocaleString('es-VE')} kg` });
          reg({ tipo: 'gasto', fecha: d, finca: 'general', cat: 'planta', monto: Math.round(kgSemana * 0.06), desc: 'Bolsas al vacío, antioxidante y etiquetas' });
          reg({ tipo: 'gasto', fecha: d, finca: 'general', cat: 'planta', monto: Math.round(kgSemana * 0.04), desc: 'Electricidad, agua y gasoil del cuarto frío' });
        }
      }
      if (day === 25) {
        reg({ tipo: 'gasto', fecha: d, finca: 'general', cat: 'planta', monto: 1500, desc: 'Obreros de la planta (6)' });
        reg({ tipo: 'gasto', fecha: d, finca: 'general', cat: 'planta', monto: 2765, desc: 'Cuota del préstamo de la planta ($105.000 a 4 años, 12%)' });
      }
    }
  }

  // Management: $21,240 a year = $1,770 a month, shared by the three farms.
  for (let y = y0 - 1; y <= cy; y++) for (let m = 1; m <= 12; m++) {
    const p = ym(y, m);
    reg({ tipo: 'gasto', fecha: p + '-28', finca: 'general', cat: 'sueldo', monto: 1000, desc: 'Sueldo del gerente' });
    reg({ tipo: 'gasto', fecha: p + '-15', finca: 'general', cat: 'viajes', monto: 520, desc: 'Viaje Caracas–Mérida' });
    reg({ tipo: 'gasto', fecha: p + '-05', finca: 'general', cat: 'admin', monto: 250, desc: 'Contador, permisos y teléfono' });
    if (y < y0) continue;
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
