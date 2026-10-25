
import { initFb } from './fb.js';
// ---------- constants ----------
const TABS = [
  ['resumen', 'Resumen'], ['registrar', 'Registrar'], ['lotes', 'Lotes y siembra'], ['labores', 'Labores'], ['libro', 'Libro'],
  ['cobros', 'Por cobrar'], ['cierre', 'Cierre del mes'], ['liquidacion', 'Liquidación'], ['precios', 'Precios'], ['guia', 'Rutina'], ['ajustes', 'Ajustes'],
];
const ICONS = {
  resumen: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  registrar: '<path d="M12 5v14M5 12h14"/>',
  lotes: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7z"/><path d="M12 14c0-3-2-6-7-6 0 3 2 6 7 6z"/>',
  libro: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/>',
  liquidacion: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  precios: '<path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/>',
  guia: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>',
  ajustes: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  labores: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  cobros: '<path d="M3 7a2 2 0 0 1 2-2h12v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16" cy="14.5" r="1.3"/>',
  cierre: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9.5 17v-3M12.5 17v-6M15.5 17v-4"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  salir: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  mas: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  gasto: '<path d="M12 3v13M6.5 10.5 12 16l5.5-5.5"/><path d="M5 21h14"/>',
  cosecha: '<path d="M6 9h12l1.5 11a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
  venta: '<path d="M12 21V8M6.5 13.5 12 8l5.5 5.5"/><path d="M5 3h14"/>',
  precio: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
  alerta: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chispa: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
};
const icon = (n, cls = '') => `<svg viewBox="0 0 24 24" class="ico ${cls}" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const TAB_SUB = { labores: 'Qué toca hacer en cada lote', cobros: 'Quién debe y desde cuándo', cierre: 'Reporte mensual para la familia', liquidacion: 'Utilidad y reparto en tercios', precios: 'Coche y precio en finca', guia: 'Quién anota qué y cada cuánto', ajustes: 'Fincas, metas y reparto' };
const CATS = [
  { id: 'semilla', n: 'Semilla', g: 'cultivo' },
  { id: 'fertilizante', n: 'Fertilizante y abono', g: 'cultivo' },
  { id: 'agroquimicos', n: 'Agroquímicos', g: 'cultivo' },
  { id: 'jornales', n: 'Jornales', g: 'cultivo' },
  { id: 'riego', n: 'Riego y agua', g: 'cultivo' },
  { id: 'maquinaria', n: 'Maquinaria y combustible', g: 'cultivo' },
  { id: 'otros_cultivo', n: 'Otros del cultivo', g: 'cultivo' },
  { id: 'sacos', n: 'Sacos y selección', g: 'venta' },
  { id: 'flete', n: 'Flete', g: 'venta' },
  { id: 'otros_venta', n: 'Otros de la venta', g: 'venta' },
  { id: 'sueldo', n: 'Sueldo del gerente', g: 'gestion' },
  { id: 'viajes', n: 'Viajes', g: 'gestion' },
  { id: 'admin', n: 'Contador, permisos y teléfono', g: 'gestion' },
  { id: 'otros_gestion', n: 'Otros de gestión', g: 'gestion' },
];
const CAT_BY = Object.fromEntries(CATS.map(c => [c.id, c]));
const GROUPS = { cultivo: 'Cultivo', venta: 'Venta y flete', gestion: 'Gestión' };
const CANALES = { camionero: 'Camionero en finca', coche: 'Mercado de Coche', restaurante: 'Restaurante', otro: 'Otro' };
const CALIDADES = { primera: 'Primera', segunda: 'Segunda', mezclada: 'Mezclada' };
const MERCADOS = { finca: 'En finca', coche: 'Coche (Caracas)', otro: 'Otro' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_L = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DEF = { kgSaco: 50, metaSacosFinca: 1200, metaCostoSaco: 15, precioRef: 25, cicloDias: 150, pctTrabajo: 33.33, pctTierra: 33.33, pctDinero: 33.34, prorrateo: 'iguales', baseEncargado: 'utilidad', presupSemilla: 90, diasCredito: 15 };

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const N = x => { const n = Number(x); return Number.isFinite(n) ? n : 0; };
function nf(x, d = 0) { try { return N(x).toLocaleString('es-VE', { minimumFractionDigits: d, maximumFractionDigits: d }); } catch { return N(x).toFixed(d); } }
function usd(x, d) { const v = N(x); if (d === undefined) d = (Math.abs(v) < 10 && v % 1 !== 0) ? 2 : 0; return (v < 0 ? '−$' : '$') + nf(Math.abs(v), d); }
const sacosTxt = n => nf(n) + (N(n) === 1 ? ' saco' : ' sacos');
function today() { try { return new Date().toLocaleDateString('en-CA'); } catch { return new Date().toISOString().slice(0, 10); } }
function addDays(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + N(n)); return d.toLocaleDateString('en-CA'); }
function daysBetween(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
function fdate(iso) { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${+d} ${MESES[+m - 1]}`; }
function fdateY(iso) { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${+d} ${MESES[+m - 1]} ${y}`; }
function parseNum(s) {
  if (s === null || s === undefined) return null;
  let t = String(s).trim().replace(/[$\s]/g, ''); if (!t) return null;
  if (t.includes('.') && t.includes(',')) t = t.replace(/\./g, '').replace(',', '.'); else t = t.replace(',', '.');
  const n = Number(t); return Number.isFinite(n) ? n : null;
}
const isoOk = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
const sum = (arr, fn) => arr.reduce((a, x) => a + N(fn(x)), 0);
const sacosCosecha = r => N(r.sacosPrimera) + N(r.sacosSegunda);
const catGroup = id => (CAT_BY[id] || {}).g || 'cultivo';
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { } };

// ---------- state ----------
const S = {
  status: 'connecting', db: null, user: null, sample: null, downloads: null, imagesOk: false,
  uid: null, canAdmin: false, rol: null, miFinca: '', auth: 'checking', loginMode: 'in', loginErr: '', loginBusy: false, miembros: [], unsubs: [], online: navigator.onLine !== false,
  year: new Date().getFullYear(), finca: lsGet('cf-finca') || 'all', view: 'resumen',
  fincas: [], lotes: [], regs: [], precios: [], cfg: { ...DEF }, labores: [], cierres: [], pend: [],
  loaded: { fincas: false, lotes: false, regs: false, precios: false, cfg: false, labores: false, cierres: false, pend: false },
  movLab: null, labNew: false, cierreMes: null, cierreAi: { busy: false, error: '' }, prefLote: '', prefFinca: '',
  names: {}, regTipo: 'gasto', editing: null, editingLote: null, proposals: [], ai: { busy: false, error: '' },
  libro: { tipo: 'all', mes: 'all', q: '' }, confirm: null, unsubRegs: null, skipRestore: false, saving: false,
};
const h0 = (location.hash || '').slice(1);
if (TABS.some(t => t[0] === h0)) S.view = h0; else { const v = lsGet('cf-view'); if (TABS.some(t => t[0] === v)) S.view = v; }

const fincaName = id => id === 'general' ? 'Todas (general)' : ((S.fincas.find(f => f.id === id) || {}).nombre || id || '—');
const loteName = id => (S.lotes.find(l => l.id === id) || {}).nombre || '';
const ready = () => S.status === 'ok' && S.loaded.fincas && S.loaded.regs && S.loaded.lotes && S.loaded.cfg;
const canWrite = () => !!S.db && (S.rol === 'admin' || S.rol === 'encargado');
const ROLES = { admin: 'Administrador', encargado: 'Encargado de finca', familia: 'Familia (solo ver)', lector: 'Analista (solo ver)' };
const ROLE_TABS = { encargado: ['resumen', 'registrar', 'lotes', 'labores', 'libro', 'guia', 'ajustes'], familia: ['resumen', 'lotes', 'labores', 'libro', 'cobros', 'cierre', 'liquidacion', 'precios', 'guia', 'ajustes'] };
ROLE_TABS.lector = ROLE_TABS.familia;
const tabOk = id => { const r = ROLE_TABS[S.rol]; return !r || r.includes(id); };

// ---------- calculations ----------
function shareOf(f) {
  const n = S.fincas.length || 1;
  if (S.cfg.prorrateo === 'sacos') {
    const cos = S.regs.filter(r => r.tipo === 'cosecha');
    const tot = sum(cos, sacosCosecha);
    if (tot > 0) return sum(cos.filter(r => r.finca === f), sacosCosecha) / tot;
  }
  return 1 / n;
}
function stats(f, monthFilter) {
  const inM = r => monthFilter === undefined || +String(r.fecha).slice(5, 7) === monthFilter;
  const own = S.regs.filter(r => (f === 'all' || r.finca === f) && inM(r));
  const gen = f === 'all' ? [] : S.regs.filter(r => r.tipo === 'gasto' && r.finca === 'general' && inM(r));
  const sh = f === 'all' ? 0 : shareOf(f);
  const g = own.filter(r => r.tipo === 'gasto');
  const byG = grp => sum(g.filter(r => catGroup(r.cat) === grp), r => r.monto) + sh * sum(gen.filter(r => catGroup(r.cat) === grp), r => r.monto);
  const cultivo = byG('cultivo'), venta = byG('venta'), gestion = byG('gestion');
  const cos = own.filter(r => r.tipo === 'cosecha');
  const sacos = sum(cos, sacosCosecha), primera = sum(cos, r => r.sacosPrimera);
  const vs = own.filter(r => r.tipo === 'venta');
  const ventas = sum(vs, r => r.monto), sacosV = sum(vs, r => r.sacos);
  const porCobrar = sum(vs.filter(r => !r.cobrado), r => r.monto);
  const gastos = cultivo + venta + gestion;
  return {
    cultivo, venta, gestion, gastos, sacos, primera, ventas, sacosV, porCobrar, utilidad: ventas - gastos, share: sh,
    stock: sacos - sacosV, costoSaco: sacos ? cultivo / sacos : null, costoSacoTotal: sacos ? gastos / sacos : null,
    precioProm: sacosV ? ventas / sacosV : null, nCos: cos.length, nVen: vs.length, nGas: g.length,
  };
}
function liquidar(f) {
  const st = stats(f), c = S.cfg;
  const pT = N(c.pctTrabajo) / 100, pL = N(c.pctTierra) / 100, pD = N(c.pctDinero) / 100;
  let baseEnc = st.utilidad;
  if (c.baseEncargado === 'precioFinca') baseEnc = st.sacos * N(c.precioRef) - st.cultivo - st.gestion;
  const enc = Math.max(0, baseEnc) * pT;
  const resto = st.utilidad - enc;
  const tierra = (pL + pD) > 0 ? resto * pL / (pL + pD) : resto / 2;
  return { ...st, baseEnc, enc, tierra, dinero: resto - tierra };
}
function loteInfo(l) {
  const est = l.siembra ? addDays(l.siembra, l.cicloDias || S.cfg.cicloDias) : null;
  const regs = S.regs.filter(r => r.lote === l.id);
  const cosechados = sum(regs.filter(r => r.tipo === 'cosecha'), sacosCosecha);
  const gasto = sum(regs.filter(r => r.tipo === 'gasto'), r => r.monto);
  const lastCos = regs.filter(r => r.tipo === 'cosecha').map(r => r.fecha).sort().pop() || null;
  const presup = N(l.presupuesto) || N(l.sacosSemilla) * N(S.cfg.presupSemilla) || null;
  return { est, cosechados, gasto, lastCos, presup, pctPres: presup ? gasto / presup : null, rend: N(l.sacosSemilla) ? cosechados / N(l.sacosSemilla) : null, costoSaco: cosechados ? gasto / cosechados : null };
}

// ---------- render plumbing ----------
let rq = 0;
function render() { if (rq) return; rq = requestAnimationFrame(() => { rq = 0; doRender(); }); }
function snapForm(root) {
  const m = {};
  root.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
    if (el.type === 'file') return;
    m[el.id] = el.type === 'checkbox' ? el.checked : el.value;
  });
  const a = document.activeElement;
  return { m, focus: a && a.id && root.contains(a) ? a.id : null, sel: a && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null };
}
function restoreForm(root, k) {
  for (const [id, v] of Object.entries(k.m)) {
    const el = document.getElementById(id); if (!el || !root.contains(el)) continue;
    if (el.type === 'checkbox') el.checked = v; else if (el.tagName === 'SELECT') { if ([...el.options].some(o => o.value === v)) el.value = v; } else el.value = v;
  }
  syncLotes(root);
  if (k.focus) { const el = document.getElementById(k.focus); if (el) { el.focus({ preventScroll: true }); try { if (k.sel && el.setSelectionRange) el.setSelectionRange(k.sel[0], k.sel[1]); } catch { } } }
}
function doRender() {
  const v = $('#view');
  const keep = S.skipRestore ? null : snapForm(v);
  S.skipRestore = false;
  document.body.classList.toggle('out', S.auth !== 'in' || !S.rol || S.rol === 'none');
  if (S.auth !== 'in' || !S.rol || S.rol === 'none') { v.innerHTML = gateHtml(); return; }
  if (!tabOk(S.view)) S.view = 'resumen';
  renderHeader();
  let html;
  try { html = (VIEWS[S.view] || VIEWS.resumen)(); } catch (e) { console.error(e); html = `<div class="notice">Algo falló al mostrar esta sección: ${esc(e.message)}</div>`; }
  v.innerHTML = html;
  syncLotes(v);
  if (keep) restoreForm(v, keep);
  resolveNames();
}
function renderHeader() {
  const cur = S.view;
  const tabName = (TABS.find(t => t[0] === cur) || [])[1] || '';
  const tEl = $('#appbar-t'); if (tEl.textContent !== tabName) tEl.textContent = tabName;
  const side = `<div class="side-brand"><span class="logo">${icon('lotes')}</span><div><b>Cuaderno de las Fincas</b><small>Agropecuaria Santo Domingo</small></div></div>
    ${canWrite() ? `<button class="sn cta" data-tab="registrar">${icon('registrar')}Registrar</button>` : '<div style="height:8px"></div>'}
    ${TABS.filter(t => t[0] !== 'registrar' && tabOk(t[0])).map(([id, n]) => `<button class="sn" data-tab="${id}" ${cur === id ? 'aria-current="page"' : ''}>${icon(id)}${n}</button>`).join('')}
    <div class="side-foot">Santo Domingo, Mérida</div>`;
  const hk = cur + '|' + S.rol;
  const sd = $('#side'); if (sd.dataset.k !== hk) { sd.innerHTML = side; sd.dataset.k = hk; }
  let more = ['labores', 'cobros', 'cierre', 'liquidacion', 'precios', 'guia', 'ajustes'].filter(tabOk);
  if (S.rol === 'encargado') { more.splice(more.indexOf('labores'), 1); more.unshift('lotes'); }
  const bt = (id, label, extra = '') => `<button class="bt ${extra}" data-tab="${id}" ${cur === id || (id === 'mas' && more.includes(cur)) ? 'aria-current="page"' : ''}>${extra === 'fab' ? `<span class="fab-c">${icon('registrar')}</span>` : icon(id)}<span>${label}</span></button>`;
  const bottom = `<div class="bottom-in">${bt('resumen', 'Inicio')}${S.rol === 'encargado' ? bt('labores', 'Labores') : bt('lotes', 'Lotes')}${canWrite() ? bt('registrar', 'Registrar', 'fab') : bt('cierre', 'Cierre')}${bt('libro', 'Libro')}${bt('mas', 'Más')}</div>`;
  const bm = $('#bottom'); if (bm.dataset.k !== hk) { bm.innerHTML = bottom; bm.dataset.k = hk; }
  const sr = $('#sheet-root');
  const sheet = S.sheet ? `<div class="scrim" data-act="sheet-close"></div><div class="sheet" role="dialog" aria-label="Más secciones"><div class="grab"></div><div class="sheet-list">${more.map(id => `<button data-tab="${id}"><span class="ic">${icon(id)}</span><span>${(TABS.find(t => t[0] === id) || [])[1]}<small>${TAB_SUB[id] || ''}</small></span></button>`).join('')}<button data-act="logout"><span class="ic">${icon('salir')}</span><span>Cerrar sesión<small>${esc(S.email || '')}</small></span></button></div></div>` : '';
  if (sr.dataset.k !== String(!!S.sheet)) { sr.innerHTML = sheet; sr.dataset.k = String(!!S.sheet); }
  const cy = new Date().getFullYear(), ys = new Set([S.year]);
  for (let y = Math.min(2024, cy - 2); y <= cy + 10; y++) ys.add(y);
  S.lotes.forEach(l => { const y = +String(l.siembra || '').slice(0, 4); if (y > 1999 && y < 2200) ys.add(y); });
  const ysel = $('#f-year');
  const yopts = [...ys].sort().map(y => `<option value="${y}" ${y === S.year ? 'selected' : ''}>${y}</option>`).join('');
  if (ysel.dataset.k !== yopts) { ysel.innerHTML = yopts; ysel.dataset.k = yopts; }
  ysel.value = String(S.year);
  const fsel = $('#f-finca');
  const fopts = S.rol === 'encargado' ? S.fincas.filter(f => f.id === S.miFinca).map(f => `<option value="${esc(f.id)}">${esc(f.nombre)}</option>`).join('') : `<option value="all">Las tres fincas</option>` + S.fincas.map(f => `<option value="${esc(f.id)}">${esc(f.nombre)}</option>`).join('');
  if (fsel.dataset.k !== fopts) { fsel.innerHTML = fopts; fsel.dataset.k = fopts; }
  if (S.rol === 'encargado') S.finca = S.miFinca;
  else if (S.finca !== 'all' && S.fincas.length && !S.fincas.some(f => f.id === S.finca)) S.finca = 'all';
  const nt = $('#net'); if (nt) nt.hidden = S.online;
  fsel.value = S.finca;
}
function syncLotes(root) {
  root.querySelectorAll('select[data-lote-for]').forEach(sel => {
    const fs = document.getElementById(sel.dataset.loteFor); const fv = fs ? fs.value : '';
    [...sel.options].forEach(o => { if (o.value) o.hidden = !!fv && fv !== 'general' && o.dataset.finca !== fv; });
    const cur = sel.selectedOptions[0]; if (cur && cur.hidden) sel.value = '';
  });
}
let toastT = 0;
function toast(msg) { if (!S.online && /guard|anot|agreg|hecha|cobrad|marcad|borrad|cambi|creand|creado/i.test(msg)) msg += '. Se sube cuando haya señal'; const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3200); }
async function resolveNames() {
  return;
  const ids = [...new Set(S.regs.map(r => r.autor).filter(Boolean))].filter(id => !(id in S.names));
  if (!ids.length) return;
  try { const ps = await S.user.profiles(ids); let ch = false; for (const id of ids) { const n = (ps[id] && ps[id].name) || ''; S.names[id] = n; if (n) ch = true; } if (ch && S.view === 'libro') render(); } catch { }
}

// ---------- small renderers ----------
const kpi = (l, v, s, cls = '') => `<div class="kpi ${cls}"><span class="kpi-l">${l}</span><span class="kpi-v">${v}</span><span class="kpi-s">${s || '&nbsp;'}</span></div>`;
const opt = (v, n, sel) => `<option value="${esc(v)}" ${String(sel) === String(v) ? 'selected' : ''}>${esc(n)}</option>`;
function fincaOptions(sel, withGeneral) { if (S.rol === 'encargado') return S.fincas.filter(f => f.id === S.miFinca).map(f => opt(f.id, f.nombre, sel)).join(''); return S.fincas.map(f => opt(f.id, f.nombre, sel)).join('') + (withGeneral ? opt('general', 'Todas las fincas (gasto general)', sel) : ''); }
function loteOptions(sel) {
  const ls = [...S.lotes].sort((a, b) => String(b.siembra || '').localeCompare(String(a.siembra || '')));
  return `<option value="">Sin lote</option>` + ls.map(l => `<option value="${esc(l.id)}" data-finca="${esc(l.finca)}" ${sel === l.id ? 'selected' : ''}>${esc(l.nombre)} · ${esc(fincaName(l.finca))}</option>`).join('');
}
function catOptions(sel) { return Object.entries(GROUPS).map(([g, gn]) => `<optgroup label="${gn}">${CATS.filter(c => c.g === g).map(c => opt(c.id, c.n, sel)).join('')}</optgroup>`).join(''); }
const fld = (id, label, inner, cls = '') => `<div class="field ${cls}"><label for="${id}">${label}</label>${inner}</div>`;
const inp = (id, val, attrs = '') => `<input id="${id}" name="${id}" value="${esc(val ?? '')}" ${attrs}>`;
const numIn = (id, val, ph = '') => inp(id, val, `inputmode="decimal" autocomplete="off" placeholder="${ph}"`);
function defaultFinca() { return S.finca !== 'all' ? S.finca : (S.fincas[0] || {}).id || ''; }
function notReady() {
  if (S.status === 'noconfig') return `<div class="notice"><strong>Falta conectar la base de datos.</strong><p>Hay que poner los datos de Firebase en config.js.</p></div>`;
  return `<div class="skel"></div><div class="skel"></div><p class="muted small">Abriendo el cuaderno…</p>`;
}
function readonlyNote() { return canWrite() ? '' : `<div class="notice"><strong>Solo puedes ver.</strong><p>Para registrar datos, pídele a Luis que te cambie el tipo de usuario.</p></div>`; }

// ---------- views ----------
const VIEWS = {};

VIEWS.resumen = () => {
  if (!ready()) return notReady();
  const f = S.finca, st = stats(f), c = S.cfg;
  const nF = f === 'all' ? (S.fincas.length || 3) : 1;
  const meta = nF * N(c.metaSacosFinca);
  const titulo = f === 'all' ? 'Las tres fincas' : fincaName(f);
  const vacio = !S.regs.length;
  const pct = meta ? Math.min(100, st.sacos / meta * 100) : 0;
  let out = `<section><div class="hero">
      <div><div class="hl">Utilidad ${S.year} · ${esc(titulo)}</div><div class="hv">${usd(st.utilidad)}</div><div class="hs">Ventas menos todos los gastos, incluidos sueldo y viajes</div></div>
      <div style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between;gap:8px" class="hs"><span>${nf(st.sacos)} de ${nf(meta)} sacos de la meta</span><span class="num">${nf(pct)}%</span></div><div class="bar"><i style="width:${pct.toFixed(1)}%"></i></div></div>
      <div class="hero-row"><div><span>Ventas</span><b>${usd(st.ventas)}</b></div><div><span>Gastos</span><b>${usd(st.gastos)}</b></div><div><span>Sacos vendidos</span><b>${nf(st.sacosV)}</b></div></div>
    </div>`;
  if (vacio) {
    out += `<div class="empty"><h3>Todavía no hay registros de ${S.year}.</h3>
      <p class="muted">Empieza por un gasto, una cosecha o una venta. Cada encargado registra lo de su finca desde su teléfono, aunque no tenga señal.</p>
      <div class="btns">${canWrite() ? '<button class="btn primary" data-go="registrar">Registrar el primero</button>' : ''}${S.canAdmin ? '<button class="btn" data-go="lotes">Planificar la siembra</button>' : ''}<button class="btn" data-go="guia">Ver la rutina</button></div></div>`;
  }
  const costoCls = st.costoSaco == null ? '' : (st.costoSaco <= N(c.metaCostoSaco) ? 'good' : 'bad');
  out += `<div class="kpis">
    ${kpi('Costo del cultivo por saco', st.costoSaco == null ? '—' : usd(st.costoSaco, 2), `meta ${usd(c.metaCostoSaco)} · con todo ${st.costoSacoTotal == null ? '—' : usd(st.costoSacoTotal, 2)}`, costoCls)}
    ${kpi('Precio promedio por saco', st.precioProm == null ? '—' : usd(st.precioProm, 2), `referencia en finca ${usd(c.precioRef)}`)}
    ${kpi('Sacos en finca', nf(Math.max(0, st.stock)), 'cosechados sin vender')}
    ${kpi('Por cobrar', usd(st.porCobrar), 'ventas sin pagar', st.porCobrar > 0 ? 'warn' : '')}
  </div></section>`;

  // month chart
  const months = [...Array(12)].map((_, i) => stats(f, i + 1));
  out += `<section><div class="sec-head"><h3>Mes a mes</h3><div class="legend"><span><i style="background:var(--papa)"></i>Ventas</span><span><i style="background:var(--tierra)"></i>Gastos</span><span><i style="background:var(--paramo)"></i>Sacos cosechados</span></div></div>
    <div class="panel">${monthChart(months)}</div></section>`;

  // fincas table
  if (f === 'all' && S.fincas.length) {
    const rows = S.fincas.map(fc => ({ fc, s: stats(fc.id) }));
    out += `<section><h3>Por finca</h3><div class="tbl"><table><thead><tr><th>Finca</th><th class="r">Sacos</th><th class="r">Sacos por saco de semilla</th><th class="r">Ventas</th><th class="r">Gastos</th><th class="r">Utilidad</th><th class="r">Costo cultivo/saco</th><th class="r">En finca</th><th class="r">Por cobrar</th></tr></thead><tbody>
      ${rows.map(({ fc, s }) => { const sem = sum(S.lotes.filter(l => l.finca === fc.id && l.estado !== 'plan' && String(l.siembra || '').startsWith(String(S.year))), l => l.sacosSemilla); return `<tr><td>${esc(fc.nombre)}</td><td class="r num">${nf(s.sacos)}</td><td class="r num">${sem && s.sacos ? nf(s.sacos / sem, 1) : '—'}</td><td class="r num">${usd(s.ventas)}</td><td class="r num">${usd(s.gastos)}</td><td class="r num ${s.utilidad < 0 ? 'neg' : ''}">${usd(s.utilidad)}</td><td class="r num">${s.costoSaco == null ? '—' : usd(s.costoSaco, 2)}</td><td class="r num">${nf(s.stock)}</td><td class="r num">${usd(s.porCobrar)}</td></tr>`; }).join('')}
      <tr class="total"><td>Total</td><td class="r num">${nf(st.sacos)}</td><td class="r num"></td><td class="r num">${usd(st.ventas)}</td><td class="r num">${usd(st.gastos)}</td><td class="r num">${usd(st.utilidad)}</td><td class="r num">${st.costoSaco == null ? '—' : usd(st.costoSaco, 2)}</td><td class="r num">${nf(st.stock)}</td><td class="r num">${usd(st.porCobrar)}</td></tr>
      </tbody></table></div><p class="hint">Los gastos generales (sueldo, viajes, contador) se reparten entre las fincas ${S.cfg.prorrateo === 'sacos' ? 'según los sacos que cosechó cada una' : 'en partes iguales'}. Se cambia en Ajustes.</p></section>`;
  }

  // agenda + alerts
  const hoy = today();
  const lotesF = S.lotes.filter(l => f === 'all' || l.finca === f);
  const proximas = lotesF.filter(l => l.estado === 'sembrado').map(l => ({ l, i: loteInfo(l) })).filter(x => x.i.est && !x.i.cosechados).sort((a, b) => a.i.est.localeCompare(b.i.est)).slice(0, 6);
  const alerts = [];
  lotesF.filter(l => l.estado === 'sembrado').forEach(l => { const i = loteInfo(l); if (i.est && i.est < hoy && !i.cosechados) alerts.push(['bad', `${esc(l.nombre)} (${esc(fincaName(l.finca))}) debía cosecharse el ${fdate(i.est)} y no tiene cosecha registrada.`, 'registrar', 'Registrar cosecha']); });
  lotesF.filter(l => l.estado === 'plan' && l.siembra && l.siembra < hoy).slice(0, 4).forEach(l => alerts.push(['', `El plan decía sembrar ${esc(l.nombre)} (${esc(fincaName(l.finca))}) el ${fdate(l.siembra)}. ¿Ya se sembró?`, 'lotes', 'Ver lotes']));
  if (st.stock > 0) alerts.push(['', `Quedan ${sacosTxt(st.stock)} cosechados sin venta registrada.`, 'registrar', 'Registrar venta']);
  { const pend = S.pend.filter(r => r.tipo === 'venta' && !r.cobrado && (f === 'all' || r.finca === f)), lim = N(c.diasCredito) || 15; const venc = sum(pend.filter(r => daysBetween(r.fecha, hoy) > lim), r => r.monto), tot = sum(pend, r => r.monto);
    if (tot > 0) alerts.push([venc ? 'bad' : '', venc ? `Hay ${usd(venc)} en ventas vencidas, de ${usd(tot)} por cobrar.` : `Hay ${usd(tot)} en ventas por cobrar.`, 'cobros', 'Ver cobros']); }
  lotesF.filter(l => l.estado === 'sembrado').forEach(l => { const i = loteInfo(l); if (i.pctPres > 1) alerts.push(['bad', `${esc(l.nombre)} (${esc(fincaName(l.finca))}) ya gastó ${usd(i.gasto)}, ${nf(i.pctPres * 100)}% de su presupuesto de ${usd(i.presup)}.`, 'lotes', 'Ver lote']); else if (i.pctPres > 0.85 && i.est && i.est > hoy) alerts.push(['', `${esc(l.nombre)} (${esc(fincaName(l.finca))}) va en ${nf(i.pctPres * 100)}% del presupuesto y faltan ${daysBetween(hoy, i.est)} días para cosechar.`, 'lotes', 'Ver lote']); });
  { const g = labGroups(labItems(), hoy); if (g.atras.length) alerts.unshift(['bad', `${g.atras.length === 1 ? 'Hay 1 labor atrasada' : `Hay ${g.atras.length} labores atrasadas`} en el campo.`, 'labores', 'Ver labores']); else if (g.semana.length) alerts.push(['info', `Esta semana ${g.semana.length === 1 ? 'toca 1 labor' : `tocan ${g.semana.length} labores`}. Manda el mensaje a los encargados.`, 'labores', 'Ver labores']); }
  { const d = new Date(); if (S.year === d.getFullYear() && d.getMonth() > 0 && S.loaded.cierres) { const m = d.getMonth(), pref = `${S.year}-${String(m).padStart(2, '0')}`; if (!S.cierres.some(x => x.id === cierreId(S.year, m, f) && x.cerrado) && S.regs.some(r => r.fecha.startsWith(pref))) alerts.push(['info', `Falta cerrar ${MESES_L[m - 1].toLowerCase()} y mandar el reporte a la familia.`, 'cierre', 'Hacer el cierre']); } }
  const lastCoche = S.precios.filter(p => p.mercado === 'coche').map(p => p.fecha).sort().pop();
  if (S.canAdmin && (!lastCoche || daysBetween(lastCoche, hoy) > 14)) alerts.push(['info', lastCoche ? `El último precio de Coche es del ${fdate(lastCoche)}. Anota el de esta semana.` : 'Todavía no hay precios de Coche anotados. Anotarlo cada semana muestra cuándo conviene vender.', 'registrar', 'Anotar precio']);
  out += `<div class="split"><section><h3>Próximas cosechas</h3>${proximas.length ? `<div class="list">${proximas.map(({ l, i }) => { const d = daysBetween(hoy, i.est); return `<div class="item"><span class="av t-cosecha">${icon('cosecha', 's')}</span><div><div class="t">${esc(l.nombre)}</div><div class="s">${esc(fincaName(l.finca))} · ${esc(l.variedad || 'papa')} · cosecha ${fdate(i.est)}</div></div><div class="a">${d < 0 ? `<span class="chip c-warn">hace ${-d} días</span>` : `<span class="muted small">en ${d} días</span>`}</div></div>`; }).join('')}</div>` : `<div class="empty"><p class="muted">No hay lotes sembrados. Crea los lotes de la siembra escalonada en "Lotes y siembra".</p><button class="btn" data-go="lotes">Ir a lotes</button></div>`}</section>
    <section><h3>Pendientes</h3>${alerts.length ? `<div class="alerts">${alerts.map(([cls, t, go, b]) => `<div class="alert ${cls}"><span class="ai">${icon(cls === 'info' ? 'precio' : cls === 'bad' ? 'alerta' : 'reloj', 's')}</span><span>${t}</span><button class="btn ghost" data-go="${go}">${b} →</button></div>`).join('')}</div>` : `<p class="muted">Nada pendiente.</p>`}</section></div>`;
  return out;
};

function monthChart(months) {
  const W = chartW(), H = 230, L = 48, B = 26, T = 10;
  const maxv = Math.max(10, ...months.map(m => Math.max(m.ventas, m.gastos)));
  const step = niceStep(maxv / 4), top = Math.ceil(maxv / step) * step;
  const maxs = Math.max(1, ...months.map(m => m.sacos));
  const cw = (W - L - 8) / 12, y = v => T + (H - T - B) * (1 - v / top);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ventas, gastos y sacos cosechados por mes">`;
  for (let t = 0; t <= top + 0.001; t += step) s += `<line class="grid" x1="${L}" x2="${W - 4}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/><text class="ax" x="${L - 6}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end">${t >= 1000 ? '$' + nf(t / 1000) + 'k' : '$' + nf(t)}</text>`;
  months.forEach((m, i) => {
    const x0 = L + i * cw + cw * 0.16, bw = cw * 0.3;
    if (m.ventas > 0) s += `<rect class="b-v" x="${x0.toFixed(1)}" y="${y(m.ventas).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y(0) - y(m.ventas)).toFixed(1)}" rx="2"><title>${MESES_L[i]}: ventas ${usd(m.ventas)}</title></rect>`;
    if (m.gastos > 0) s += `<rect class="b-g" x="${(x0 + bw + 2).toFixed(1)}" y="${y(m.gastos).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y(0) - y(m.gastos)).toFixed(1)}" rx="2"><title>${MESES_L[i]}: gastos ${usd(m.gastos)}</title></rect>`;
    s += `<text class="ax" x="${(L + i * cw + cw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${MESES[i]}</text>`;
  });
  // harvest dots row
  months.forEach((m, i) => { if (m.sacos > 0) { const r = 3 + 6 * Math.sqrt(m.sacos / maxs); s += `<circle class="b-p" cx="${(L + i * cw + cw / 2).toFixed(1)}" cy="${(T + 8).toFixed(1)}" r="${r.toFixed(1)}"><title>${MESES_L[i]}: ${sacosTxt(m.sacos)} cosechados</title></circle>`; } });
  return s + '</svg>';
}
function chartW() { return Math.round(Math.max(320, Math.min(680, (window.innerWidth || 680) - 64))); }
function niceStep(x) { const p = Math.pow(10, Math.floor(Math.log10(Math.max(x, 1)))); const n = x / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }

VIEWS.registrar = () => {
  if (!ready()) return notReady();
  if (!canWrite()) return readonlyNote();
  let out = '';
  // Claude reader
  if (S.sample) {
    out += `<section><div class="sec-head"><div><p class="eyebrow">Lo más rápido</p><h2>Pegar el reporte del encargado</h2></div></div>
      <div class="panel"><p class="muted small">Pega el reporte de WhatsApp o sube la foto de una factura o del cuaderno. Claude lo convierte en registros y tú los revisas antes de guardarlos.</p>
      ${fld('ai-text', 'Mensaje', `<textarea id="ai-text" placeholder="Ej.: El Baho, lunes: 4 jornales a 8$, 3 sacos de abono 10-20-20 a 38$ c/u. Se sacaron 60 sacos del lote Tanda 2, 52 de primera. Vendí 50 a Pedro a 26$, pagó.">${''}</textarea>`)}
      <div class="grid">${S.imagesOk ? fld('ai-foto', 'Fotos (facturas o cuaderno)', `<input type="file" id="ai-foto" accept="image/jpeg,image/png,image/webp" multiple>`) : ''}</div>
      <div class="btns"><button class="btn primary" data-act="ai-read" ${S.ai.busy ? 'disabled' : ''}>${icon('chispa', 's')}${S.ai.busy ? 'Leyendo…' : 'Leer con Claude'}</button>${S.ai.busy ? `<button class="btn" data-act="ai-stop">Detener</button>` : ''}</div>
      ${S.ai.error ? `<div class="notice">${esc(S.ai.error)}</div>` : ''}</div>
      ${S.proposals.length ? proposalsHtml() : ''}</section>`;
  }
  // manual form
  const t = S.regTipo, ed = S.editing ? S.regs.find(r => r.id === S.editing) || S.precios.find(p => p.id === S.editing) : null;
  const e = ed || {};
  const df = e.finca || S.prefFinca || defaultFinca();
  out += `<section><div class="sec-head"><div><p class="eyebrow">${ed ? 'Corrigiendo un registro' : 'A mano'}</p><h2>${ed ? 'Editar registro' : 'Nuevo registro'}</h2></div>${ed ? `<button class="btn" data-act="cancel-edit">Cancelar</button>` : ''}</div>
    ${ed ? '' : `<div class="seg" role="group" aria-label="Tipo de registro" ${S.canAdmin ? '' : 'style="grid-template-columns:repeat(3,minmax(0,1fr))"'}>${[['gasto', 'Gasto'], ['cosecha', 'Cosecha'], ['venta', 'Venta'], ['precio', 'Precio']].filter(x => x[0] !== 'precio' || S.canAdmin).map(([k, n]) => `<button data-tipo="${k}" aria-pressed="${t === k}"><span class="tile t-${k}">${icon(k)}</span>${n}</button>`).join('')}</div>`}
    <form class="panel" id="reg-form" data-tipo="${t}"><div class="grid">
    ${fld('r-fecha', 'Fecha', inp('r-fecha', e.fecha || today(), 'type="date" required'))}`;
  if (t === 'precio') {
    out += fld('r-mercado', 'Mercado', `<select id="r-mercado">${Object.entries(MERCADOS).map(([k, n]) => opt(k, n, e.mercado || 'coche')).join('')}</select>`)
      + fld('r-producto', 'Producto', inp('r-producto', e.producto || 'Papa andina blanca', 'list="dl-prod"') + `<datalist id="dl-prod"><option value="Papa andina blanca"><option value="Papa Granola"><option value="Papa María Bonita"><option value="Papa amarilla"></datalist>`)
      + fld('r-precio', 'Precio por saco ($)', numIn('r-precio', e.precio, '35'))
      + fld('r-kg', 'Kilos del saco', numIn('r-kg', e.kgSaco ?? 45, '45'))
      + fld('r-desc', 'Fuente', inp('r-desc', e.desc, 'placeholder="Ej.: llamada a un mayorista, 2001online"'), 'wide');
  } else {
    out += fld('r-finca', 'Finca', `<select id="r-finca" data-act-change="finca">${fincaOptions(df, t === 'gasto')}</select>`)
      + fld('r-lote', 'Lote', `<select id="r-lote" data-lote-for="r-finca">${loteOptions(e.lote || S.prefLote || '')}</select>`);
    if (t === 'gasto') {
      out += fld('r-cat', 'Categoría', `<select id="r-cat">${catOptions(e.cat || 'jornales')}</select>`)
        + fld('r-monto', 'Monto ($)', numIn('r-monto', e.monto, '0'))
        + fld('r-cant', 'Cantidad (opcional)', numIn('r-cant', e.cantidad, 'Ej.: 4'))
        + fld('r-unidad', 'Unidad', inp('r-unidad', e.unidad, 'placeholder="jornales, sacos, litros…"'))
        + fld('r-desc', 'Detalle', inp('r-desc', e.desc, 'placeholder="Ej.: abono 10-20-20, 3 sacos de 50 kg"'), 'wide');
    } else if (t === 'cosecha') {
      out += fld('r-prim', 'Sacos de primera', numIn('r-prim', e.sacosPrimera, '0'))
        + fld('r-seg', 'Sacos de segunda', numIn('r-seg', e.sacosSegunda, '0'))
        + fld('r-kg', 'Kilos por saco', numIn('r-kg', e.kgSaco ?? S.cfg.kgSaco))
        + fld('r-desc', 'Notas', inp('r-desc', e.desc, 'placeholder="Ej.: papa sana, algo de gusano en el borde"'), 'wide');
    } else {
      out += fld('r-comprador', 'Comprador', inp('r-comprador', e.comprador, 'list="dl-comp" placeholder="Nombre"') + `<datalist id="dl-comp">${[...new Set(S.regs.filter(r => r.comprador).map(r => r.comprador))].slice(0, 30).map(c => `<option value="${esc(c)}">`).join('')}</datalist>`)
        + fld('r-canal', 'A quién se vendió', `<select id="r-canal">${Object.entries(CANALES).map(([k, n]) => opt(k, n, e.canal || 'camionero')).join('')}</select>`)
        + fld('r-calidad', 'Calidad', `<select id="r-calidad">${Object.entries(CALIDADES).map(([k, n]) => opt(k, n, e.calidad || 'mezclada')).join('')}</select>`)
        + fld('r-sacos', 'Sacos vendidos', numIn('r-sacos', e.sacos, '0'))
        + fld('r-precio', 'Precio por saco ($)', numIn('r-precio', e.precio, String(S.cfg.precioRef)))
        + fld('r-kg', 'Kilos por saco', numIn('r-kg', e.kgSaco ?? S.cfg.kgSaco))
        + `<div class="field"><span class="hint">&nbsp;</span><label class="check"><input type="checkbox" id="r-cobrado" ${e.cobrado === false ? '' : 'checked'}> Ya se cobró</label></div>`
        + fld('r-desc', 'Notas', inp('r-desc', e.desc), 'wide');
    }
  }
  out += `</div><span class="hint" id="r-total"></span><button class="btn primary block" type="submit" ${S.saving ? 'disabled' : ''}>${ed ? 'Guardar cambios' : 'Guardar ' + { gasto: 'gasto', cosecha: 'cosecha', venta: 'venta', precio: 'precio' }[t]}</button></form></section>`;
  return out;
};

function proposalsHtml() {
  const ps = S.proposals;
  return `<div class="sec-head"><h3>Claude preparó ${ps.length} ${ps.length === 1 ? 'registro' : 'registros'}. Revísalos.</h3></div>
  ${ps.map((p, i) => {
    const id = k => `ai-${i}-${k}`;
    let fields = fld(id('fecha'), 'Fecha', inp(id('fecha'), p.fecha || today(), 'type="date"'));
    if (p.tipo === 'precio') {
      fields += fld(id('mercado'), 'Mercado', `<select id="${id('mercado')}">${Object.entries(MERCADOS).map(([k, n]) => opt(k, n, p.mercado || 'coche')).join('')}</select>`)
        + fld(id('producto'), 'Producto', inp(id('producto'), p.producto || 'Papa'))
        + fld(id('precio'), 'Precio por saco ($)', numIn(id('precio'), p.precio))
        + fld(id('kg'), 'Kilos del saco', numIn(id('kg'), p.kgSaco ?? 45));
    } else {
      fields += fld(id('finca'), 'Finca', `<select id="${id('finca')}">${fincaOptions(p.finca || defaultFinca(), p.tipo === 'gasto')}</select>`)
        + fld(id('lote'), 'Lote', `<select id="${id('lote')}" data-lote-for="${id('finca')}">${loteOptions(p.lote || '')}</select>`);
      if (p.tipo === 'gasto') fields += fld(id('cat'), 'Categoría', `<select id="${id('cat')}">${catOptions(p.cat || 'otros_cultivo')}</select>`) + fld(id('monto'), 'Monto ($)', numIn(id('monto'), p.monto)) + fld(id('cant'), 'Cantidad', numIn(id('cant'), p.cantidad)) + fld(id('unidad'), 'Unidad', inp(id('unidad'), p.unidad));
      if (p.tipo === 'cosecha') fields += fld(id('prim'), 'Sacos de primera', numIn(id('prim'), p.sacosPrimera)) + fld(id('seg'), 'Sacos de segunda', numIn(id('seg'), p.sacosSegunda)) + fld(id('kg'), 'Kilos por saco', numIn(id('kg'), p.kgSaco ?? S.cfg.kgSaco));
      if (p.tipo === 'venta') fields += fld(id('comprador'), 'Comprador', inp(id('comprador'), p.comprador)) + fld(id('canal'), 'A quién', `<select id="${id('canal')}">${Object.entries(CANALES).map(([k, n]) => opt(k, n, p.canal || 'camionero')).join('')}</select>`) + fld(id('calidad'), 'Calidad', `<select id="${id('calidad')}">${Object.entries(CALIDADES).map(([k, n]) => opt(k, n, p.calidad || 'mezclada')).join('')}</select>`) + fld(id('sacos'), 'Sacos', numIn(id('sacos'), p.sacos)) + fld(id('precio'), 'Precio por saco ($)', numIn(id('precio'), p.precio)) + fld(id('kg'), 'Kilos por saco', numIn(id('kg'), p.kgSaco ?? S.cfg.kgSaco)) + `<div class="field"><span class="hint">&nbsp;</span><label class="check"><input type="checkbox" id="${id('cobrado')}" ${p.cobrado === false ? '' : 'checked'}> Ya se cobró</label></div>`;
    }
    fields += fld(id('desc'), 'Detalle', inp(id('desc'), p.desc), 'wide');
    return `<div class="prop" id="prop-${i}"><div class="sec-head"><label class="check"><input type="checkbox" id="${id('on')}" ${p.on === false ? '' : 'checked'}> Guardar este</label>
      <select id="${id('tipo')}" data-ai-tipo="${i}" aria-label="Tipo" style="width:auto">${[['gasto', 'Gasto'], ['cosecha', 'Cosecha'], ['venta', 'Venta'], ['precio', 'Precio de mercado']].map(([k, n]) => opt(k, n, p.tipo)).join('')}</select></div>
      ${p.duda ? `<div class="duda"><strong>Revisa:</strong> ${esc(p.duda)}</div>` : ''}<div class="grid">${fields}</div></div>`;
  }).join('')}
  <div class="btns"><button class="btn primary" data-act="ai-save" ${S.saving ? 'disabled' : ''}>Guardar los marcados</button><button class="btn" data-act="ai-clear">Descartar</button></div>`;
}

VIEWS.lotes = () => {
  if (!ready()) return notReady();
  const f = S.finca, y = S.year, hoy = today();
  const ls = S.lotes.filter(l => (f === 'all' || l.finca === f)).filter(l => { const i = loteInfo(l); const a = l.siembra || '', b = i.lastCos || i.est || a; return a.slice(0, 4) <= String(y) && b.slice(0, 4) >= String(y); })
    .sort((a, b) => (a.finca + a.siembra).localeCompare(b.finca + b.siembra));
  let out = `<section><div class="sec-head"><div><p class="eyebrow">${y}</p><h2>Lotes y siembra escalonada</h2></div>${canWrite() ? `<div class="btns"><button class="btn primary" data-act="lote-new">Nuevo lote</button></div>` : ''}</div>
    <p class="muted small">Cada lote es una tanda de siembra. El cuaderno calcula cuándo se cosecha cada una y cuánto rindió.</p>`;
  if (S.editingLote) out += loteForm();
  out += `<div class="panel">${ls.length ? timeline(ls) : `<p class="muted">No hay lotes en ${y}${f === 'all' ? '' : ' para ' + esc(fincaName(f))}. Crea uno o genera el plan de siembra escalonada abajo.</p>`}
    <div class="legend"><span><i style="background:var(--sunk);border:1px dashed var(--muted)"></i>Planificado</span><span><i style="background:var(--paramo)"></i>Sembrado</span><span><i style="background:var(--papa)"></i>Cosechado</span><span><i style="background:var(--bad);width:2px"></i>Hoy</span></div></div>`;
  if (ls.length) {
    out += `<div class="lotes">${ls.map(l => {
      const i = loteInfo(l), d = i.est ? daysBetween(hoy, i.est) : null;
      const conf = S.confirm === 'lote:' + l.id;
      return `<div class="lote"><div class="lote-h"><div><div class="t" style="font-weight:700">${esc(l.nombre)}</div><div class="s muted small">${esc(fincaName(l.finca))} · ${esc(l.variedad || 'papa')}${l.ha ? ' · ' + nf(l.ha, 1) + ' ha' : ''}</div></div><span class="chip c-${esc(l.estado || 'plan')}">${{ plan: 'Planificado', sembrado: 'Sembrado', cosechado: 'Cosechado' }[l.estado] || 'Planificado'}</span></div>
        <dl class="kv"><dt>Siembra</dt><dd>${fdateY(l.siembra)}</dd><dt>Cosecha estimada</dt><dd>${fdateY(i.est)}${l.estado === 'sembrado' && d !== null ? ` · ${d >= 0 ? 'en ' + d : 'hace ' + (-d)} d` : ''}</dd>
        <dt>Semilla</dt><dd>${l.sacosSemilla ? sacosTxt(l.sacosSemilla) : '—'}</dd><dt>Cosechado</dt><dd>${i.cosechados ? sacosTxt(i.cosechados) : '—'}</dd>
        <dt>Sacos por saco de semilla</dt><dd>${i.rend == null || !i.cosechados ? '—' : nf(i.rend, 1)}</dd><dt>Gastos anotados</dt><dd>${usd(i.gasto)}</dd><dt>Costo por saco</dt><dd>${i.costoSaco == null ? '—' : usd(i.costoSaco, 2)}</dd></dl>
        ${i.presup ? `<div class="budget"><div class="bh"><span>Presupuesto: ${usd(i.gasto)} de ${usd(i.presup)}</span><span class="num">${nf(i.pctPres * 100)}%</span></div><div class="bar2 ${i.pctPres > 1 ? 'over' : i.pctPres > 0.85 ? 'near' : ''}"><i style="width:${Math.min(100, i.pctPres * 100).toFixed(1)}%"></i></div></div>` : ''}
        ${l.notas ? `<p class="small muted">${esc(l.notas)}</p>` : ''}
        ${canWrite() ? `<div class="btns">${l.estado === 'plan' ? `<button class="btn" data-act="lote-estado" data-id="${esc(l.id)}" data-v="sembrado">Ya se sembró</button>` : ''}${l.estado === 'sembrado' ? `<button class="btn" data-act="lote-estado" data-id="${esc(l.id)}" data-v="cosechado">Ya se cosechó</button>` : ''}<button class="btn ghost" data-act="lote-edit" data-id="${esc(l.id)}">Editar</button>${conf ? `<button class="btn danger" data-act="lote-del" data-id="${esc(l.id)}">Sí, borrar</button><button class="btn ghost" data-act="confirm-no">No</button>` : `<button class="btn ghost danger" data-act="confirm" data-k="lote:${esc(l.id)}">Borrar</button>`}</div>` : ''}</div>`;
    }).join('')}</div>`;
  }
  out += `</section>`;
  const pr = ls.filter(l => l.estado !== 'plan').map(l => ({ l, i: loteInfo(l) })).filter(x => x.i.presup);
  if (pr.length) out += `<section><h3>Presupuesto contra lo real</h3><div class="tbl"><table><thead><tr><th>Lote</th><th>Finca</th><th class="r">Presupuesto</th><th class="r">Gastado</th><th class="r">Queda</th><th class="r">Usado</th></tr></thead><tbody>
    ${pr.map(({ l, i }) => `<tr><td>${esc(l.nombre)}</td><td>${esc(fincaName(l.finca))}</td><td class="r num">${usd(i.presup)}</td><td class="r num">${usd(i.gasto)}</td><td class="r num ${i.presup - i.gasto < 0 ? 'neg' : ''}">${usd(i.presup - i.gasto)}</td><td class="r num ${i.pctPres > 1 ? 'neg' : ''}">${nf(i.pctPres * 100)}%</td></tr>`).join('')}
    <tr class="total"><td>Total</td><td></td><td class="r num">${usd(sum(pr, x => x.i.presup))}</td><td class="r num">${usd(sum(pr, x => x.i.gasto))}</td><td class="r num">${usd(sum(pr, x => x.i.presup - x.i.gasto))}</td><td class="r num">${nf(sum(pr, x => x.i.gasto) / sum(pr, x => x.i.presup) * 100)}%</td></tr></tbody></table></div>
    <p class="hint">Solo cuenta los gastos anotados con ese lote. Si el lote no tiene presupuesto propio, se calcula con ${usd(S.cfg.presupSemilla)} por saco de semilla (se cambia en Ajustes).</p></section>`;
  if (S.canAdmin) out += planForm();
  return out;
};

function timeline(ls) {
  const y = S.year, W = 700, rowH = 22, L = 150, T = 22;
  const start = new Date(y, 0, 1), end = new Date(y + 1, 0, 1), span = end - start;
  const x = iso => { const d = new Date(iso + 'T12:00:00'); return L + Math.max(0, Math.min(1, (d - start) / span)) * (W - L - 6); };
  const H = T + ls.length * rowH + 6;
  let s = `<div class="tbl" style="border:0;background:none;box-shadow:none"><svg class="chart" viewBox="0 0 ${W} ${H}" style="min-width:560px" role="img" aria-label="Calendario de lotes del año">`;
  for (let m = 0; m < 12; m++) { const xm = L + (m / 12) * (W - L - 6); s += `<line class="grid" x1="${xm.toFixed(1)}" x2="${xm.toFixed(1)}" y1="${T - 6}" y2="${H}"/><text class="ax" x="${(xm + (W - L - 6) / 24).toFixed(1)}" y="12" text-anchor="middle">${MESES[m]}</text>`; }
  let prevF = null;
  ls.forEach((l, k) => {
    const i = loteInfo(l), yy = T + k * rowH;
    const a = l.siembra, b = i.lastCos && l.estado === 'cosechado' ? i.lastCos : i.est;
    if (prevF !== null && prevF !== l.finca) s += `<line class="grid" x1="0" x2="${W}" y1="${yy - 1}" y2="${yy - 1}"/>`;
    prevF = l.finca;
    const lbl = `${fincaName(l.finca).replace('Hoyo El Barro', 'Hoyo E. B.')} · ${l.nombre}`;
    s += `<text class="lbl" x="0" y="${yy + 14}">${esc(lbl.length > 24 ? lbl.slice(0, 23) + '…' : lbl)}</text>`;
    if (a && b) { const x1 = x(a), x2 = Math.max(x(b), x1 + 3); s += `<rect class="lot-${esc(l.estado || 'plan')}" x="${x1.toFixed(1)}" y="${yy + 4}" width="${(x2 - x1).toFixed(1)}" height="${rowH - 8}" rx="3"><title>${esc(l.nombre)}: ${fdateY(a)} → ${fdateY(b)}</title></rect>`; }
  });
  const t = today(); if (t.startsWith(String(y))) { const xt = x(t); s += `<line class="today" x1="${xt.toFixed(1)}" x2="${xt.toFixed(1)}" y1="${T - 6}" y2="${H}"/>`; }
  return s + '</svg></div>';
}

function loteForm() {
  const l = S.editingLote === 'new' ? {} : (S.lotes.find(x => x.id === S.editingLote) || {});
  return `<form class="panel" id="lote-form"><h3>${S.editingLote === 'new' ? 'Nuevo lote' : 'Editar ' + esc(l.nombre)}</h3><div class="grid">
    ${fld('l-nombre', 'Nombre', inp('l-nombre', l.nombre, 'required placeholder="Ej.: Tanda 3 · 2027"'))}
    ${fld('l-finca', 'Finca', `<select id="l-finca">${fincaOptions(l.finca || defaultFinca(), false)}</select>`)}
    ${fld('l-variedad', 'Variedad', inp('l-variedad', l.variedad || 'Granola', 'list="dl-var"') + '<datalist id="dl-var"><option value="Granola"><option value="María Bonita"><option value="Andina blanca"></datalist>')}
    ${fld('l-ha', 'Hectáreas', numIn('l-ha', l.ha, 'Ej.: 0,7'))}
    ${fld('l-siembra', 'Fecha de siembra', inp('l-siembra', l.siembra || today(), 'type="date" required'))}
    ${fld('l-ciclo', 'Días hasta la cosecha', numIn('l-ciclo', l.cicloDias ?? S.cfg.cicloDias))}
    ${fld('l-semilla', 'Sacos de semilla', numIn('l-semilla', l.sacosSemilla, 'Ej.: 33'))}
    ${fld('l-presup', 'Presupuesto del cultivo ($)', numIn('l-presup', l.presupuesto, `Vacío: ${nf(S.cfg.presupSemilla)} por saco de semilla`))}
    ${fld('l-estado', 'Estado', `<select id="l-estado">${[['plan', 'Planificado'], ['sembrado', 'Sembrado'], ['cosechado', 'Cosechado']].map(([k, n]) => opt(k, n, l.estado || 'sembrado')).join('')}</select>`)}
    ${fld('l-notas', 'Notas', inp('l-notas', l.notas, 'placeholder="Ej.: semilla certificada, tablón de arriba"'), 'wide')}
  </div><div class="btns"><button class="btn primary" type="submit">Guardar lote</button><button class="btn" type="button" data-act="lote-cancel">Cancelar</button></div></form>`;
}

function planForm() {
  const y = S.year + (new Date().getMonth() >= 9 && S.year === new Date().getFullYear() ? 1 : 0);
  return `<section><details class="box"><summary>Generar el plan de siembra escalonada</summary><div class="in">
    <p class="muted small">Crea los lotes planificados de un año: cada finca siembra en tandas, una por mes, y las fincas arrancan en meses distintos para que salga papa todo el año. Con 4 tandas por finca y 4 meses de diferencia, siempre hay una finca cosechando.</p>
    <form id="plan-form" class="grid">
      ${fld('p-anio', 'Año', numIn('p-anio', y))}
      ${fld('p-tandas', 'Tandas por finca', numIn('p-tandas', 4))}
      ${fld('p-semilla', 'Sacos de semilla por finca al año', numIn('p-semilla', 200))}
      ${fld('p-ciclo', 'Días hasta la cosecha', numIn('p-ciclo', S.cfg.cicloDias))}
      ${fld('p-variedad', 'Variedad', inp('p-variedad', 'Granola'))}
      ${S.fincas.map((fc, i) => fld('p-mes-' + fc.id, 'Mes en que empieza ' + esc(fc.nombre), `<select id="p-mes-${esc(fc.id)}">${MESES_L.map((m, k) => opt(k + 1, m, [1, 5, 9][i] || 1)).join('')}</select>`)).join('')}
      <div class="field wide"><div class="btns"><button class="btn primary" type="submit">Crear los lotes planificados</button></div><span class="hint">Los lotes quedan como "Planificado". Cuando se siembren, márcalos con "Ya se sembró" y corrige la fecha si cambió.</span></div>
    </form></div></details></section>`;
}

VIEWS.libro = () => {
  if (!ready()) return notReady();
  const L = S.libro, f = S.finca, q = L.q.trim().toLowerCase();
  let rs = S.regs.filter(r => (f === 'all' || r.finca === f || (r.finca === 'general' && L.tipo !== 'cosecha')))
    .filter(r => L.tipo === 'all' || r.tipo === L.tipo || (L.tipo === 'cobrar' && r.tipo === 'venta' && !r.cobrado))
    .filter(r => L.mes === 'all' || +r.fecha.slice(5, 7) === +L.mes)
    .filter(r => !q || [r.desc, r.comprador, (CAT_BY[r.cat] || {}).n, loteName(r.lote), fincaName(r.finca)].join(' ').toLowerCase().includes(q));
  const gastos = sum(rs.filter(r => r.tipo === 'gasto'), r => r.monto), ventas = sum(rs.filter(r => r.tipo === 'venta'), r => r.monto), sacos = sum(rs.filter(r => r.tipo === 'cosecha'), sacosCosecha);
  let out = `<section><div class="sec-head"><div><p class="eyebrow">${S.year}${f !== 'all' ? ' · ' + esc(fincaName(f)) : ''}</p><h2>Libro de registros</h2></div><div class="btns">${S.downloads ? `<button class="btn" data-act="csv">Descargar para Excel</button>` : ''}</div></div>
    <div class="grid">
      ${fld('lb-tipo', 'Mostrar', `<select id="lb-tipo" data-libro="tipo">${[['all', 'Todo'], ['gasto', 'Gastos'], ['cosecha', 'Cosechas'], ['venta', 'Ventas'], ['cobrar', 'Ventas por cobrar']].map(([k, n]) => opt(k, n, L.tipo)).join('')}</select>`)}
      ${fld('lb-mes', 'Mes', `<select id="lb-mes" data-libro="mes"><option value="all">Todo el año</option>${MESES_L.map((m, i) => opt(i + 1, m, L.mes)).join('')}</select>`)}
      ${fld('lb-q', 'Buscar', inp('lb-q', L.q, 'data-libro="q" placeholder="abono, Pedro, Tanda 2…" autocomplete="off"'))}
    </div>
    <p class="small muted num">${rs.length} registros · gastos ${usd(gastos)} · ventas ${usd(ventas)} · ${sacosTxt(sacos)} cosechados</p>`;
  if (!rs.length) { out += `<div class="empty"><p class="muted">${S.regs.length ? 'Ningún registro coincide con el filtro.' : `Todavía no hay registros de ${S.year}.`}</p>${canWrite() ? '<button class="btn primary" data-go="registrar">Registrar</button>' : ''}</div></section>`; return out; }
  out += `<div class="list">`;
  let curM = null;
  for (const r of rs) {
    const m = r.fecha.slice(0, 7);
    if (m !== curM) { curM = m; const rm = rs.filter(x => x.fecha.startsWith(m)); out += `<div class="month-h"><span>${MESES_L[+m.slice(5) - 1]} ${m.slice(0, 4)}</span><span class="num">${usd(sum(rm.filter(x => x.tipo === 'venta'), x => x.monto))} · ${usd(-sum(rm.filter(x => x.tipo === 'gasto'), x => x.monto))}</span></div>`; }
    out += itemHtml(r);
  }
  return out + `</div></section>`;
};
function itemHtml(r) {
  let t = '', a = '', chip = '';
  if (r.tipo === 'gasto') { t = (CAT_BY[r.cat] || {}).n || 'Gasto'; a = `<span class="neg">${usd(-N(r.monto))}</span>`; chip = '<span class="chip c-gasto">Gasto</span>'; }
  if (r.tipo === 'cosecha') { t = `Cosecha · ${sacosTxt(sacosCosecha(r))}`; a = `${nf(sacosCosecha(r))}<small>sacos</small>`; chip = '<span class="chip c-cosecha">Cosecha</span>'; }
  if (r.tipo === 'venta') { t = `Venta · ${sacosTxt(r.sacos)} a ${usd(r.precio, 2)}${r.comprador ? ' · ' + esc(r.comprador) : ''}`; a = `<span class="pos">${usd(r.monto)}</span>`; chip = `<span class="chip c-venta">Venta</span>${r.cobrado ? '' : ' <span class="chip c-warn">Por cobrar</span>'}`; }
  const sub = [fincaName(r.finca), r.lote ? loteName(r.lote) : '', r.tipo === 'cosecha' ? `${nf(r.sacosPrimera)} de primera, ${nf(r.sacosSegunda)} de segunda` : '', r.tipo === 'venta' ? (CANALES[r.canal] || '') : '', r.cantidad ? `${nf(r.cantidad, r.cantidad % 1 ? 1 : 0)} ${r.unidad || ''}` : '', r.desc].filter(Boolean).map(esc).join(' · ');
  const who = r.autor ? (S.names[r.autor] || '') : '';
  const conf = S.confirm === 'reg:' + r.id;
  const mine = S.canAdmin || r.autor === S.uid;
  return `<div class="item"><span class="av t-${esc(r.tipo)}">${icon(r.tipo, 's')}</span><div><div class="t">${t}</div><div class="s">${fdate(r.fecha)} · ${sub}${r.tipo === 'venta' && !r.cobrado ? ' <span class="chip c-warn">Por cobrar</span>' : ''}${who || r.fuente === 'claude' ? ` · <span class="small">${who ? 'por ' + esc(who) : ''}${r.fuente === 'claude' ? (who ? ', ' : '') + 'leído por Claude' : ''}</span>` : ''}</div></div><div class="a">${a}</div>
    ${canWrite() && mine ? `<div class="acts">${r.tipo === 'venta' && !r.cobrado ? `<button class="btn ghost" data-act="cobrar" data-id="${esc(r.id)}">Marcar cobrada</button>` : ''}<button class="btn ghost" data-act="edit" data-id="${esc(r.id)}">Editar</button>${conf ? `<button class="btn danger" data-act="del" data-id="${esc(r.id)}">Sí, borrar</button><button class="btn ghost" data-act="confirm-no">No</button>` : `<button class="btn ghost danger" data-act="confirm" data-k="reg:${esc(r.id)}">Borrar</button>`}</div>` : ''}</div>`;
}

VIEWS.liquidacion = () => {
  if (!ready()) return notReady();
  const c = S.cfg, fs = S.finca === 'all' ? S.fincas : S.fincas.filter(f => f.id === S.finca);
  const L = fs.map(f => ({ f, q: liquidar(f.id) }));
  const tot = k => sum(L, x => x.q[k]);
  const row = (label, k, sign = 1, cls = '') => `<tr class="${cls}"><td>${label}</td>${L.map(x => `<td class="r num ${x.q[k] * sign < 0 && cls ? 'neg' : ''}">${usd(sign * x.q[k])}</td>`).join('')}${L.length > 1 ? `<td class="r num">${usd(sign * tot(k))}</td>` : ''}</tr>`;
  const hdr = `<tr><th></th>${L.map(x => `<th class="r">${esc(x.f.nombre)}</th>`).join('')}${L.length > 1 ? '<th class="r">Total</th>' : ''}</tr>`;
  const txt = liqTexto(L);
  return `<section><div class="sec-head"><div><p class="eyebrow">${S.year}</p><h2>Liquidación y reparto</h2></div></div>
    <p class="muted small">Cuánto dejó cada finca en el año y cómo se reparte entre quien trabaja, quien pone la tierra y quien pone el dinero. Los porcentajes se cambian en Ajustes.</p>
    <div class="tbl"><table><thead>${hdr}</thead><tbody>
      <tr><td>Sacos cosechados</td>${L.map(x => `<td class="r num">${nf(x.q.sacos)}</td>`).join('')}${L.length > 1 ? `<td class="r num">${nf(tot('sacos'))}</td>` : ''}</tr>
      ${row('Ventas', 'ventas')}
      ${row('− Gastos del cultivo', 'cultivo', -1)}
      ${row('− Venta y flete', 'venta', -1)}
      ${row('− Gestión (sueldo, viajes, contador)', 'gestion', -1)}
      ${row('= Utilidad', 'utilidad', 1, 'total')}
      ${row(`Encargado (${nf(c.pctTrabajo, 1)}%)`, 'enc')}
      ${row(`Tierra (${nf(c.pctTierra, 1)}%)`, 'tierra')}
      ${row(`Dinero (${nf(c.pctDinero, 1)}%)`, 'dinero')}
    </tbody></table></div>
    <p class="hint">${c.baseEncargado === 'precioFinca' ? `El tercio del encargado se calcula sobre la cosecha a precio de finca (${usd(c.precioRef)} el saco) menos cultivo y gestión. Lo que se gana de más vendiendo mejor queda para tierra y dinero.` : 'El tercio del encargado se calcula sobre la utilidad real.'} Si la utilidad es negativa, el encargado no cobra parte y la pérdida la cubren tierra y dinero.</p>
    <div class="panel"><h3>Texto para mandar a la familia</h3><pre class="tpl" id="liq-txt">${esc(txt)}</pre><div class="btns"><button class="btn" data-act="copy" data-src="liq-txt">Copiar</button></div></div></section>`;
};
function liqTexto(L) {
  const lines = [`Liquidación ${S.year} · Agropecuaria Santo Domingo`, ''];
  for (const { f, q } of L) {
    lines.push(`${f.nombre}: ${nf(q.sacos)} sacos cosechados, ventas ${usd(q.ventas)}, gastos ${usd(q.gastos)}, utilidad ${usd(q.utilidad)}.`);
    lines.push(`  Encargado ${usd(q.enc)} · Tierra ${usd(q.tierra)} · Dinero ${usd(q.dinero)}`);
  }
  if (L.length > 1) lines.push('', `Total: ventas ${usd(sum(L, x => x.q.ventas))}, utilidad ${usd(sum(L, x => x.q.utilidad))}.`);
  return lines.join('\n');
}

VIEWS.precios = () => {
  if (S.status !== 'ok' || !S.loaded.precios) return notReady();
  const ps = [...S.precios].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const per50 = p => N(p.kgSaco) ? N(p.precio) / N(p.kgSaco) * 50 : N(p.precio);
  let out = `<section><div class="sec-head"><div><p class="eyebrow">Mercado</p><h2>Precios de la papa</h2></div>${canWrite() ? `<button class="btn primary" data-act="new-precio">Anotar precio</button>` : ''}</div>
    <p class="muted small">Precio por saco llevado a 50 kg para poder comparar. Anotar Coche cada semana muestra si conviene vender en finca o llevar a Caracas.</p>`;
  if (!ps.length) return out + `<div class="empty"><p class="muted">Todavía no hay precios anotados.</p></div></section>`;
  out += `<div class="panel">${priceChart(ps, per50)}<div class="legend"><span><i style="background:var(--papa)"></i>Coche</span><span><i style="background:var(--paramo)"></i>En finca</span><span><i style="background:var(--tierra)"></i>Otro</span></div></div>
    <div class="tbl"><table><thead><tr><th>Fecha</th><th>Mercado</th><th>Producto</th><th class="r">Precio</th><th class="r">Kg</th><th class="r">$ por 50 kg</th><th>Fuente</th><th></th></tr></thead><tbody>
    ${ps.slice(0, 80).map(p => `<tr><td class="num">${fdateY(p.fecha)}</td><td>${esc(MERCADOS[p.mercado] || p.mercado)}</td><td>${esc(p.producto)}</td><td class="r num">${usd(p.precio, 2)}</td><td class="r num">${nf(p.kgSaco)}</td><td class="r num">${usd(per50(p), 2)}</td><td class="small muted">${esc(p.desc || '')}</td><td>${canWrite() ? (S.confirm === 'pre:' + p.id ? `<button class="btn danger" data-act="del-precio" data-id="${esc(p.id)}">Sí, borrar</button>` : `<button class="btn ghost danger" data-act="confirm" data-k="pre:${esc(p.id)}">Borrar</button>`) : ''}</td></tr>`).join('')}
    </tbody></table></div></section>`;
  return out;
};
function priceChart(ps, per50) {
  const W = chartW(), H = 220, L = 44, B = 24, T = 10;
  const pts = [...ps].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const t0 = new Date(pts[0].fecha + 'T12:00:00').getTime(), t1 = Math.max(t0 + 86400000 * 7, new Date(pts[pts.length - 1].fecha + 'T12:00:00').getTime());
  const vals = pts.map(per50), lo = Math.max(0, Math.floor(Math.min(...vals, N(S.cfg.precioRef)) / 5) * 5 - 5), hi = Math.ceil(Math.max(...vals, N(S.cfg.precioRef)) / 5) * 5 + 5;
  const x = iso => L + (new Date(iso + 'T12:00:00').getTime() - t0) / (t1 - t0) * (W - L - 10), y = v => T + (H - T - B) * (1 - (v - lo) / (hi - lo || 1));
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Precio de la papa por saco de 50 kg">`;
  const st = niceStep((hi - lo) / 4);
  for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) s += `<line class="grid" x1="${L}" x2="${W - 6}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="ax" x="${L - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">$${nf(v)}</text>`;
  s += `<text class="ax" x="${L}" y="${H - 6}">${fdateY(pts[0].fecha)}</text><text class="ax" x="${W - 6}" y="${H - 6}" text-anchor="end">${fdateY(pts[pts.length - 1].fecha)}</text>`;
  [['coche', 'a'], ['finca', 'b'], ['otro', 'c']].forEach(([m, k]) => {
    const q = pts.filter(p => p.mercado === m); if (!q.length) return;
    if (q.length > 1) s += `<polyline class="ln-${k}" points="${q.map(p => `${x(p.fecha).toFixed(1)},${y(per50(p)).toFixed(1)}`).join(' ')}"/>`;
    q.forEach(p => { s += `<circle class="pt-${k}" cx="${x(p.fecha).toFixed(1)}" cy="${y(per50(p)).toFixed(1)}" r="3.5"><title>${fdateY(p.fecha)} · ${esc(MERCADOS[m])}: ${usd(per50(p), 2)} por 50 kg</title></circle>`; });
  });
  return s + '</svg>';
}

VIEWS.guia = () => `<section class="prose"><p class="eyebrow">Cómo llevar las fincas</p><h2>La rutina de gestión</h2>
  <p>El cuaderno solo sirve si se llena siempre igual. Esta es la rutina que convierte lo que pasa en las fincas en números confiables, para la familia, para un banco o para un inversionista.</p></section>
  <section class="prose"><h3>Quién anota qué</h3><ul>
    <li><strong>Encargado de cada finca:</strong> registra en la app, desde su teléfono, los jornales, compras, cosecha y ventas de su finca, y marca las labores que va haciendo. Funciona sin señal.</li>
    <li><strong>Luis:</strong> revisa lo que registran los encargados, anota sueldo, viajes, contador y el precio de Coche de la semana, y hace el cierre de cada mes.</li>
    <li><strong>Papá y la familia:</strong> entran con su usuario de solo ver y revisan el Resumen, el Cierre del mes y la Liquidación.</li></ul></section>
  <section class="prose"><h3>Cada cuánto</h3><ol>
    <li><strong>Cada día:</strong> toda compra con factura o nota, aunque sea en una hoja del cuaderno con foto. Ningún pago sin anotar.</li>
    <li><strong>Cada lunes:</strong> Luis revisa lo registrado la semana anterior, anota el precio de Coche y le manda a cada encargado sus labores de la semana desde "Labores".</li>
    <li><strong>Cada viernes:</strong> revisar "Por cobrar" y mandar el recordatorio a quien tenga una venta vencida.</li>
    <li><strong>Cada fin de mes:</strong> hacer el "Cierre del mes": revisar las cifras, escribir el comentario del gerente y mandar el reporte a la familia.</li>
    <li><strong>Al cerrar cada cosecha:</strong> registrar los sacos de primera y de segunda del lote. Así se sabe qué tanda rindió mejor.</li>
    <li><strong>Cada fin de año:</strong> Liquidación y reparto, mandar el texto a la familia, comparar con las metas y generar el plan de siembra del año siguiente.</li></ol></section>
  <section class="prose"><h3>Las cinco cifras que miramos</h3><ul>
    <li><strong>Costo del cultivo por saco.</strong> Meta: ${usd(S.cfg.metaCostoSaco)} o menos. Es la cifra que más preguntará un inversionista.</li>
    <li><strong>Sacos por saco de semilla.</strong> Hoy cerca de 6 (1.200 de 200). Con mejor semilla y suelo, la meta es 7 a 8.</li>
    <li><strong>Precio promedio de venta.</strong> Frente a ${usd(S.cfg.precioRef)} en finca y al precio de Coche de esa semana.</li>
    <li><strong>Utilidad por finca.</strong> Cuál finca y cuál encargado rinden más, con datos y no con impresiones.</li>
    <li><strong>Ventas por cobrar.</strong> Cuando se venda a restaurantes, cobrar a tiempo importa tanto como vender.</li></ul></section>
  <section class="prose"><h3>Reglas sencillas</h3><ul>
    <li>Cada gasto va a una finca. Si es de todas (sueldo, viajes, contador), va como gasto general y el cuaderno lo reparte.</li>
    <li>Si un gasto es de una tanda, se elige el lote. Así se sabe el costo de cada tanda.</li>
    <li>Siempre anotar los kilos del saco. Hay sacos de 45, 50 y 60 kg.</li>
    <li>Un error se corrige con "Editar". No se anota dos veces.</li></ul></section>
  <section class="panel"><h3>Plantilla para un encargado sin la app</h3><p class="muted small">Si algún encargado prefiere mandar su reporte por WhatsApp, que use este orden. Tú lo registras en la app.</p>
  <pre class="tpl" id="tpl-enc">${esc(PLANTILLA)}</pre><div class="btns"><button class="btn" data-act="copy" data-src="tpl-enc">Copiar plantilla</button></div></section>
  <section class="prose"><h3>Lo que sigue</h3><ol>
    <li><strong>Ahora:</strong> registros, costos por lote, liquidación y plan de siembra.</li>
    <li><strong>Con los primeros meses de datos:</strong> comparar el costo real con el modelo financiero y ajustar el plan.</li>
    <li><strong>Al vender a restaurantes:</strong> cada venta queda ligada a su lote. Eso es trazabilidad: decirle al cliente de qué finca y qué tanda viene su papa.</li>
    <li><strong>Más adelante:</strong> inventario de abono y semilla, y un pluviómetro por finca para anotar la lluvia.</li></ol></section>`;
const PLANTILLA = `REPORTE · [finca] · semana del [fecha]
Jornales: [cuántos] a $[pago] (lote: [tanda])
Compras: [qué] [cantidad] $[monto]
Cosecha: [sacos de primera] primera, [sacos de segunda] segunda, lote [tanda], sacos de [kg] kg
Ventas: [sacos] a $[precio] a [comprador], cobrado sí/no
Novedades: [lluvia, plagas, problemas]`;

VIEWS.ajustes = () => {
  if (!ready()) return notReady();
  const c = S.cfg, adm = S.canAdmin;
  const dis = adm ? '' : 'disabled';
  let out = `<section><div class="sec-head"><div><p class="eyebrow">Configuración</p><h2>Ajustes</h2></div></div>
    <div class="panel"><h3>Tu cuenta</h3><p class="small">${esc(S.names[S.email] || '')} ${esc(S.email || '')}<br><span class="muted">${esc(ROLES[S.rol] || '')}${S.rol === 'encargado' ? ' · ' + esc(fincaName(S.miFinca)) : ''}</span></p><div class="btns"><button class="btn" data-act="logout">${icon('salir', 's')}Cerrar sesión</button></div></div>`;
  if (!adm) return out + `<div class="notice"><p>Solo el administrador puede cambiar las metas, el reparto y los usuarios.</p></div></section>`;
  out += `<form class="panel" id="cfg-form"><h3>Fincas</h3>
      ${S.fincas.map(f => `<div class="grid">${fld('fc-n-' + f.id, 'Nombre', inp('fc-n-' + f.id, f.nombre, dis))}${fld('fc-ha-' + f.id, 'Hectáreas', numIn('fc-ha-' + f.id, f.ha).replace('<input', `<input ${dis}`))}${fld('fc-e-' + f.id, 'Encargado', inp('fc-e-' + f.id, f.encargado, dis + ' placeholder="Nombre"'))}</div>`).join('')}
      <h3>Metas y referencias</h3><div class="grid">
      ${fld('c-kg', 'Kilos por saco (normal)', numIn('c-kg', c.kgSaco).replace('<input', `<input ${dis}`))}
      ${fld('c-meta', 'Meta de sacos por finca al año', numIn('c-meta', c.metaSacosFinca).replace('<input', `<input ${dis}`))}
      ${fld('c-costo', 'Meta de costo del cultivo por saco ($)', numIn('c-costo', c.metaCostoSaco).replace('<input', `<input ${dis}`))}
      ${fld('c-pref', 'Precio de referencia en finca ($)', numIn('c-pref', c.precioRef).replace('<input', `<input ${dis}`))}
      ${fld('c-ciclo', 'Días de siembra a cosecha', numIn('c-ciclo', c.cicloDias).replace('<input', `<input ${dis}`))}
      ${fld('c-presup', 'Presupuesto del cultivo por saco de semilla ($)', numIn('c-presup', c.presupSemilla).replace('<input', `<input ${dis}`))}
      ${fld('c-cred', 'Días de crédito a clientes', numIn('c-cred', c.diasCredito).replace('<input', `<input ${dis}`))}
      </div>
      <h3>Reparto</h3><div class="grid">
      ${fld('c-pt', 'Encargado (%)', numIn('c-pt', c.pctTrabajo).replace('<input', `<input ${dis}`))}
      ${fld('c-pl', 'Tierra (%)', numIn('c-pl', c.pctTierra).replace('<input', `<input ${dis}`))}
      ${fld('c-pd', 'Dinero (%)', numIn('c-pd', c.pctDinero).replace('<input', `<input ${dis}`))}
      ${fld('c-base', 'Parte del encargado sobre', `<select id="c-base" ${dis}>${opt('utilidad', 'La utilidad real', c.baseEncargado)}${opt('precioFinca', 'La cosecha a precio de finca', c.baseEncargado)}</select>`)}
      ${fld('c-pror', 'Gastos generales se reparten', `<select id="c-pror" ${dis}>${opt('iguales', 'En partes iguales', c.prorrateo)}${opt('sacos', 'Según los sacos cosechados', c.prorrateo)}</select>`)}
      </div>
      <div class="btns"><button class="btn primary" type="submit">Guardar ajustes</button></div>
    </form>`;
  out += usuariosHtml() + importHtml();
  return out + '</section>';
};

// ---------- labores ----------
const LAB_BASE = [
  { k: 'prep', d: -15, n: 'Preparar el suelo', det: 'Arar, rastrear y encalar si hace falta.' },
  { k: 'siembra', d: 0, n: 'Sembrar', det: 'Semilla sana y abono de fondo.' },
  { k: 'desyerbe', d: 25, n: 'Desyerbar y revisar plagas', det: 'Revisar gusano blanco y palomilla.' },
  { k: 'aporque1', d: 35, n: 'Primer aporque y reabono', det: 'Aporcar y echar el segundo abono.' },
  { k: 'fumi1', d: 45, n: 'Fumigar contra la gota', det: 'Preventivo contra la gota (tizón). Más seguido si llueve mucho.' },
  { k: 'aporque2', d: 60, n: 'Segundo aporque', det: '' },
  { k: 'fumi2', d: 65, n: 'Fumigar contra la gota', det: 'Segunda aplicación.' },
  { k: 'fumi3', d: 85, n: 'Fumigar contra la gota', det: 'Tercera aplicación.' },
  { k: 'fumi4', d: 105, n: 'Fumigar contra la gota', det: 'Cuarta aplicación, si el clima lo pide.' },
  { k: 'madurez', d: -20, fin: true, n: 'Revisar madurez', det: 'Dejar secar o cortar el follaje y parar el riego.' },
  { k: 'cosecha', d: 0, fin: true, n: 'Cosechar', det: 'Separar primera y segunda y anotar los sacos del lote.' },
];
function labItems(all) {
  const out = [], byId = Object.fromEntries(S.labores.map(x => [x.id, x]));
  for (const l of S.lotes) {
    if (!isoOk(l.siembra) || l.estado === 'cosechado') continue;
    const ciclo = N(l.cicloDias) || N(S.cfg.cicloDias) || 150, info = loteInfo(l);
    for (const b of LAB_BASE) {
      const id = `${l.id}_${b.k}`, d = byId[id] || {};
      let hecho = !!d.hecho;
      if (!d.id && l.estado !== 'plan' && (b.k === 'prep' || b.k === 'siembra')) hecho = true;
      if (b.k === 'cosecha' && info.cosechados) hecho = true;
      out.push({ id, k: b.k, lote: l.id, finca: l.finca, nombre: b.n, det: b.det, fecha: isoOk(d.fecha) ? d.fecha : addDays(l.siembra, b.fin ? ciclo + b.d : b.d), hecho, omitida: !!d.omitida && !hecho, fechaHecho: d.fechaHecho || null });
    }
  }
  for (const d of S.labores) if (d.custom && isoOk(d.fecha)) out.push({ id: d.id, k: 'custom', custom: true, lote: d.lote || '', finca: d.finca, nombre: d.nombre || 'Labor', det: d.notas || '', fecha: d.fecha, hecho: !!d.hecho, omitida: !!d.omitida, fechaHecho: d.fechaHecho || null });
  return out.filter(x => all || S.finca === 'all' || x.finca === S.finca).sort((a, b) => a.fecha.localeCompare(b.fecha));
}
const labPend = x => !x.hecho && !x.omitida;
function labGroups(items, hoy) {
  const p = items.filter(labPend);
  return {
    atras: p.filter(x => x.fecha < hoy && x.fecha >= addDays(hoy, -90)),
    semana: p.filter(x => x.fecha >= hoy && x.fecha <= addDays(hoy, 7)),
    prox: p.filter(x => x.fecha > addDays(hoy, 7) && x.fecha <= addDays(hoy, 35)),
    luego: p.filter(x => x.fecha > addDays(hoy, 35)),
    hechas: items.filter(x => x.hecho || x.omitida).filter(x => (x.fechaHecho || x.fecha) >= addDays(hoy, -30)).sort((a, b) => String(b.fechaHecho || b.fecha).localeCompare(String(a.fechaHecho || a.fecha))),
  };
}
function labHtml(x, hoy) {
  const d = daysBetween(hoy, x.fecha);
  const chip = x.hecho ? '<span class="chip c-cosecha">Hecha</span>' : x.omitida ? '<span class="chip c-plan">No aplica</span>' : d < 0 ? `<span class="chip c-bad">Atrasada ${-d} d</span>` : d <= 7 ? `<span class="chip c-warn">${d === 0 ? 'Hoy' : 'En ' + d + ' d'}</span>` : `<span class="muted small">en ${d} d</span>`;
  const sub = [fincaName(x.finca), x.lote ? loteName(x.lote) : '', (x.hecho && x.fechaHecho ? 'hecha el ' + fdate(x.fechaHecho) : fdate(x.fecha)), x.det].filter(Boolean).map(esc).join(' · ');
  let acts = '';
  if (canWrite()) {
    if (S.movLab === x.id) acts = `<form class="lab-move" id="lab-move-form" data-id="${esc(x.id)}">${inp('lm-fecha', x.fecha, 'type="date" aria-label="Nueva fecha"')}<button class="btn primary" type="submit">Guardar</button><button class="btn ghost" type="button" data-act="lab-mover-no">Cancelar</button></form>`;
    else if (labPend(x)) acts = `<div class="acts">${x.k === 'cosecha' ? `<button class="btn ghost ok" data-act="lab-cos" data-id="${esc(x.id)}">Registrar cosecha</button>` : `<button class="btn ghost ok" data-act="lab-hecho" data-id="${esc(x.id)}">Hecha</button>`}<button class="btn ghost" data-act="lab-mover" data-id="${esc(x.id)}">Cambiar fecha</button><button class="btn ghost" data-act="lab-omitir" data-id="${esc(x.id)}">No aplica</button>${x.custom ? (S.confirm === 'lab:' + x.id ? `<button class="btn danger" data-act="lab-del" data-id="${esc(x.id)}">Sí, borrar</button>` : `<button class="btn ghost danger" data-act="confirm" data-k="lab:${esc(x.id)}">Borrar</button>`) : ''}</div>`;
    else if (x.k !== 'cosecha') acts = `<div class="acts"><button class="btn ghost" data-act="lab-undo" data-id="${esc(x.id)}">Deshacer</button></div>`;
  }
  return `<div class="item"><span class="av t-lab ${labPend(x) && d < 0 ? 'late' : ''}">${icon('labores', 's')}</span><div><div class="t">${esc(x.nombre)}</div><div class="s">${sub}</div></div><div class="a">${chip}</div>${acts}</div>`;
}
function labTexto(fid, hoy) {
  const g = labGroups(labItems(true).filter(x => x.finca === fid), hoy);
  const ln = x => `- ${loteName(x.lote) || 'General'}: ${x.nombre}${x.fecha < hoy ? ` (era para el ${fdate(x.fecha)})` : ` (${fdate(x.fecha)})`}`;
  const lines = [`Labores de la semana · ${fincaName(fid)} · ${fdate(hoy)} al ${fdate(addDays(hoy, 7))}`];
  if (g.atras.length) lines.push('', 'Atrasadas:', ...g.atras.map(ln));
  lines.push('', 'Esta semana:', ...(g.semana.length ? g.semana.map(ln) : ['- Nada programado']));
  lines.push('', 'Cuando termines cada una, avísame con la fecha y lo que se gastó.');
  return lines.join('\n');
}
VIEWS.labores = () => {
  if (!ready()) return notReady();
  const hoy = today(), items = labItems(), g = labGroups(items, hoy);
  const sec = (title, arr, empty) => `<section><h3>${title}${arr.length ? ` <span class="muted small num">${arr.length}</span>` : ''}</h3>${arr.length ? `<div class="list">${arr.map(x => labHtml(x, hoy)).join('')}</div>` : `<p class="muted small">${empty}</p>`}</section>`;
  let out = `<section><div class="sec-head"><div><p class="eyebrow">Calendario de labores</p><h2>Qué toca hacer en cada lote</h2></div>${canWrite() ? `<button class="btn" data-act="lab-new">${icon('registrar', 's')}Agregar labor</button>` : ''}</div>
    <p class="muted small">Sale solo de la fecha de siembra de cada lote, con el plan base de la papa: aporques, abonos y fumigaciones. Si el encargado lo hace distinto, cambia la fecha o márcala como "No aplica".</p>
    <div class="kpis">${kpi('Atrasadas', nf(g.atras.length), 'pasó la fecha y no se ha hecho', g.atras.length ? 'bad' : 'good')}${kpi('Esta semana', nf(g.semana.length), 'próximos 7 días')}${kpi('Próximas semanas', nf(g.prox.length), 'del día 8 al 35')}${kpi('Hechas', nf(g.hechas.filter(x => x.hecho).length), 'últimos 30 días')}</div></section>`;
  if (S.labNew && canWrite()) {
    out += `<form class="panel" id="lab-form"><h3>Nueva labor</h3><div class="grid">
      ${fld('lb-nombre', 'Qué hay que hacer', inp('lb-nombre', '', 'required placeholder="Ej.: arreglar la manguera del riego"'))}
      ${fld('lb-finca', 'Finca', `<select id="lb-finca">${fincaOptions(defaultFinca(), false)}</select>`)}
      ${fld('lb-lote', 'Lote', `<select id="lb-lote" data-lote-for="lb-finca">${loteOptions('')}</select>`)}
      ${fld('lb-fecha', 'Fecha', inp('lb-fecha', today(), 'type="date" required'))}
      ${fld('lb-notas', 'Detalle', inp('lb-notas', ''), 'wide')}
    </div><div class="btns"><button class="btn primary" type="submit">Guardar labor</button><button class="btn" type="button" data-act="lab-new-no">Cancelar</button></div></form>`;
  }
  if (!items.length) return out + `<div class="empty"><p class="muted">No hay lotes sembrados ni planificados. Las labores salen de los lotes.</p><button class="btn" data-go="lotes">Ir a lotes</button></div>`;
  out += sec('Atrasadas', g.atras, 'Nada atrasado.') + sec('Esta semana', g.semana, 'Nada programado para esta semana.') + sec('Próximas semanas', g.prox, 'Nada en las próximas semanas.');
  if (g.luego.length) out += `<section><details class="box"><summary>Más adelante (${g.luego.length})</summary><div class="in"><div class="list">${g.luego.slice(0, 80).map(x => labHtml(x, hoy)).join('')}</div></div></details></section>`;
  if (g.hechas.length) out += `<section><details class="box"><summary>Hechas en los últimos 30 días (${g.hechas.length})</summary><div class="in"><div class="list">${g.hechas.map(x => labHtml(x, hoy)).join('')}</div></div></details></section>`;
  const fs = S.finca === 'all' ? S.fincas : S.fincas.filter(f => f.id === S.finca);
  out += `<section><h3>Mensaje para cada encargado</h3><p class="muted small">Mándalo cada lunes por WhatsApp. Así el encargado sabe qué se espera de él esa semana.</p>
    ${fs.map(f => `<div class="panel"><pre class="tpl" id="lab-txt-${esc(f.id)}">${esc(labTexto(f.id, hoy))}</pre><div class="btns"><button class="btn" data-act="copy" data-src="lab-txt-${esc(f.id)}">Copiar para ${esc(f.nombre)}</button></div></div>`).join('')}</section>`;
  return out;
};
async function labSet(id, patch) {
  const it = labItems(true).find(x => x.id === id) || {};
  const old = S.labores.find(d => d.id === id) || {};
  const { id: _i, ...rest } = old;
  await S.db.doc('labores/' + id).set({ lote: it.lote || '', finca: it.finca || '', k: it.k || 'custom', ...rest, ...patch, autor: S.uid || null, actualizado: new Date().toISOString() });
}
async function guardarLabor() {
  const d = { custom: true, nombre: val('lb-nombre').trim(), finca: val('lb-finca'), lote: val('lb-lote'), fecha: val('lb-fecha'), notas: val('lb-notas').trim(), hecho: false, creado: new Date().toISOString(), autor: S.uid || null };
  if (!d.nombre || !isoOk(d.fecha)) return toast('Pon qué hay que hacer y la fecha.');
  await S.db.collection('labores').add(d);
  S.labNew = false; S.skipRestore = true; toast('Labor agregada'); render();
}

// ---------- cuentas por cobrar ----------
const cliName = r => String(r.comprador || '').trim() || 'Sin nombre';
VIEWS.cobros = () => {
  if (!ready() || !S.loaded.pend) return notReady();
  const hoy = today(), lim = N(S.cfg.diasCredito) || 15;
  const ps = S.pend.filter(r => r.tipo === 'venta' && !r.cobrado && (S.finca === 'all' || r.finca === S.finca));
  const by = {};
  for (const r of ps) (by[cliName(r)] = by[cliName(r)] || []).push(r);
  const clis = Object.entries(by).map(([n, rs]) => { rs.sort((a, b) => a.fecha.localeCompare(b.fecha)); return { n, rs, tot: sum(rs, r => r.monto), dias: daysBetween(rs[0].fecha, hoy) }; }).sort((a, b) => b.dias - a.dias);
  const total = sum(clis, c => c.tot), vencido = sum(ps.filter(r => daysBetween(r.fecha, hoy) > lim), r => r.monto);
  let out = `<section><div class="hero">
      <div><div class="hl">Por cobrar${S.finca === 'all' ? '' : ' · ' + esc(fincaName(S.finca))}</div><div class="hv">${usd(total)}</div><div class="hs">${clis.length ? `${clis.length} ${clis.length === 1 ? 'cliente' : 'clientes'} · crédito de ${lim} días` : 'Nadie te debe'}</div></div>
      <div class="hero-row"><div><span>Vencido</span><b>${usd(vencido)}</b></div><div><span>Al día</span><b>${usd(total - vencido)}</b></div><div><span>Ventas sin pagar</span><b>${nf(ps.length)}</b></div></div>
    </div></section>`;
  if (!clis.length) out += `<div class="empty"><p class="muted">No hay ventas por cobrar. Cuando registres una venta sin marcar "Ya se cobró", aparece aquí.</p></div>`;
  else out += `<section><h3>Quién debe</h3><div class="lotes">${clis.map((c, i) => {
    const venc = c.dias > lim;
    const rec = [`Hola ${c.n === 'Sin nombre' ? '' : c.n.split(' ')[0]}, te escribo de Agropecuaria Santo Domingo.`, `Te paso el saldo pendiente: ${usd(c.tot, 2)}.`, ...c.rs.map(r => `- ${fdateY(r.fecha)}: ${sacosTxt(r.sacos)} a ${usd(r.precio, 2)} = ${usd(r.monto, 2)}`), 'Avísame cuándo puedes hacer el pago. ¡Gracias!'].join('\n');
    return `<div class="lote"><div class="lote-h"><div><div class="t" style="font-weight:700">${esc(c.n)}</div><div class="s muted small">${c.rs.length} ${c.rs.length === 1 ? 'entrega' : 'entregas'} · la más vieja del ${fdate(c.rs[0].fecha)}</div></div>${venc ? `<span class="chip c-bad">Vencida ${c.dias} d</span>` : `<span class="chip c-warn">${c.dias} d</span>`}</div>
      <div class="cli-tot num">${usd(c.tot, 2)}</div>
      <div class="list flat">${c.rs.map(r => `<div class="row"><span>${fdate(r.fecha)} · ${esc(fincaName(r.finca))}<small>${sacosTxt(r.sacos)} a ${usd(r.precio, 2)}</small></span><b class="num">${usd(r.monto, 2)}</b>${canWrite() ? `<button class="btn ghost ok" data-act="cobrar" data-id="${esc(r.id)}">Cobrada</button>` : ''}</div>`).join('')}</div>
      <pre class="tpl" id="rec-${i}" hidden>${esc(rec)}</pre>
      <div class="btns"><button class="btn" data-act="copy" data-src="rec-${i}">Copiar recordatorio</button>${canWrite() && c.rs.length > 1 ? (S.confirm === 'cli:' + c.n ? `<button class="btn primary" data-act="cobrar-cli" data-k="${esc(c.n)}">Sí, todo cobrado</button><button class="btn ghost" data-act="confirm-no">No</button>` : `<button class="btn ghost" data-act="confirm" data-k="cli:${esc(c.n)}">Pagó todo</button>`) : ''}</div></div>`;
  }).join('')}</div></section>`;
  // clients of the year
  const vs = S.regs.filter(r => r.tipo === 'venta' && (S.finca === 'all' || r.finca === S.finca));
  if (vs.length) {
    const cy = {};
    for (const r of vs) { const c = cy[cliName(r)] = cy[cliName(r)] || { n: cliName(r), canal: r.canal, sacos: 0, monto: 0, pend: 0, dias: [] }; c.sacos += N(r.sacos); c.monto += N(r.monto); if (!r.cobrado) c.pend += N(r.monto); if (r.cobrado && isoOk(r.fechaCobro)) c.dias.push(Math.max(0, daysBetween(r.fecha, r.fechaCobro))); }
    const rows = Object.values(cy).sort((a, b) => b.monto - a.monto);
    out += `<section><h3>Clientes de ${S.year}</h3><div class="tbl"><table><thead><tr><th>Cliente</th><th>Tipo</th><th class="r">Sacos</th><th class="r">Compró</th><th class="r">Precio promedio</th><th class="r">Días en pagar</th><th class="r">Debe</th></tr></thead><tbody>
      ${rows.map(c => `<tr><td>${esc(c.n)}</td><td>${esc(CANALES[c.canal] || '')}</td><td class="r num">${nf(c.sacos)}</td><td class="r num">${usd(c.monto)}</td><td class="r num">${c.sacos ? usd(c.monto / c.sacos, 2) : '—'}</td><td class="r num">${c.dias.length ? nf(sum(c.dias, d => d) / c.dias.length) : '—'}</td><td class="r num ${c.pend ? 'neg' : ''}">${usd(c.pend)}</td></tr>`).join('')}
      </tbody></table></div><p class="hint">"Días en pagar" cuenta desde la venta hasta el día en que se marcó cobrada. Las ventas que se anotaron como cobradas al momento no entran en ese promedio.</p></section>`;
  }
  return out;
};

// ---------- cierre del mes ----------
function defaultCierreMes() { const d = new Date(); return S.year === d.getFullYear() ? Math.max(1, d.getMonth() + (d.getDate() >= 25 ? 1 : 0)) : 12; }
const cierreId = (y, m, f) => `${y}-${String(m).padStart(2, '0')}${f === 'all' ? '' : '-' + f}`;
const per50 = p => N(p.kgSaco) ? N(p.precio) / N(p.kgSaco) * 50 : N(p.precio);
function cierreData(m) {
  const f = S.finca, y = S.year, pref = `${y}-${String(m).padStart(2, '0')}`, hoy = today();
  const st = stats(f, m), prev = m > 1 ? stats(f, m - 1) : null;
  const ytd = { ventas: 0, gastos: 0, sacos: 0, utilidad: 0 };
  for (let i = 1; i <= m; i++) { const s = stats(f, i); ytd.ventas += s.ventas; ytd.gastos += s.gastos; ytd.sacos += s.sacos; ytd.utilidad += s.utilidad; }
  const nF = f === 'all' ? (S.fincas.length || 3) : 1, metaY = nF * N(S.cfg.metaSacosFinca);
  const fincas = (f === 'all' ? S.fincas : S.fincas.filter(x => x.id === f)).map(fc => ({ fc, s: stats(fc.id, m) }));
  const lotesF = S.lotes.filter(l => f === 'all' || l.finca === f);
  const sembrados = lotesF.filter(l => l.estado !== 'plan' && String(l.siembra || '').startsWith(pref));
  const cl = {};
  for (const r of S.regs.filter(r => r.tipo === 'cosecha' && r.fecha.startsWith(pref) && (f === 'all' || r.finca === f))) { const k = r.lote || 'sin-' + r.finca; const c = cl[k] = cl[k] || { lote: S.lotes.find(l => l.id === r.lote), finca: r.finca, sacos: 0, primera: 0 }; c.sacos += sacosCosecha(r); c.primera += N(r.sacosPrimera); }
  const cosechas = Object.values(cl).map(c => ({ ...c, rend: c.lote && N(c.lote.sacosSemilla) ? loteInfo(c.lote).cosechados / N(c.lote.sacosSemilla) : null }));
  const sobre = lotesF.filter(l => l.estado !== 'plan').map(l => ({ l, i: loteInfo(l) })).filter(x => x.i.presup && x.i.gasto > x.i.presup);
  const labs = labItems();
  const labHechas = labs.filter(x => x.hecho && String(x.fechaHecho || '').startsWith(pref)).length;
  const labAtras = labs.filter(x => labPend(x) && x.fecha < hoy && x.fecha >= addDays(hoy, -90)).length;
  const pend = S.pend.filter(r => r.tipo === 'venta' && !r.cobrado && (f === 'all' || r.finca === f));
  const lim = N(S.cfg.diasCredito) || 15;
  const coche = S.precios.filter(p => p.mercado === 'coche' && p.fecha.startsWith(pref));
  const doc = S.cierres.find(c => c.id === cierreId(y, m, f)) || null;
  return { m, y, f, pref, st, prev, ytd, metaY, metaHoy: metaY * m / 12, fincas, sembrados, cosechas, sobre, labHechas, labAtras,
    porCobrar: sum(pend, r => r.monto), vencido: sum(pend.filter(r => daysBetween(r.fecha, hoy) > lim), r => r.monto), clientes: new Set(pend.map(cliName)).size,
    coche: coche.length ? sum(coche, per50) / coche.length : null, doc, titulo: f === 'all' ? 'Las tres fincas' : fincaName(f) };
}
function deltaTxt(cur, prev, m) { if (prev == null) return ''; const d = cur - prev; return `${d >= 0 ? '+' : '−'}${usd(Math.abs(d)).replace('−', '')} frente a ${MESES_L[m - 2].toLowerCase()}`; }
function cierreTexto(D, nota) {
  const { st } = D, mes = `${MESES_L[D.m - 1]} ${D.y}`;
  const L = [`Cierre de ${mes} · Agropecuaria Santo Domingo`, D.titulo, ''];
  L.push(`Ventas: ${usd(st.ventas)} (${sacosTxt(st.sacosV)}${st.precioProm ? `, promedio ${usd(st.precioProm, 2)} el saco` : ''})`);
  L.push(`Gastos: ${usd(st.gastos)} (cultivo ${usd(st.cultivo)}, venta y flete ${usd(st.venta)}, gestión ${usd(st.gestion)})`);
  L.push(`Utilidad del mes: ${usd(st.utilidad)}${D.prev ? ` (en ${MESES_L[D.m - 2].toLowerCase()}: ${usd(D.prev.utilidad)})` : ''}`);
  L.push(`Cosecha: ${sacosTxt(st.sacos)}${st.sacos ? ` (${nf(st.primera)} de primera)` : ''}`);
  if (D.coche) L.push(`Precio en Coche: ${usd(D.coche, 2)} por saco de 50 kg en promedio`);
  L.push('', `En el año hasta ${MESES_L[D.m - 1].toLowerCase()}: ventas ${usd(D.ytd.ventas)}, utilidad ${usd(D.ytd.utilidad)}, ${nf(D.ytd.sacos)} sacos (la meta a esta fecha es ${nf(D.metaHoy)}).`);
  if (D.fincas.length > 1) { L.push('', 'Por finca:'); D.fincas.forEach(({ fc, s }) => L.push(`- ${fc.nombre}: ventas ${usd(s.ventas)}, gastos ${usd(s.gastos)}, utilidad ${usd(s.utilidad)}, ${sacosTxt(s.sacos)}`)); }
  if (D.sembrados.length || D.cosechas.length) {
    L.push('', 'Lotes:');
    D.sembrados.forEach(l => L.push(`- Se sembró ${l.nombre} en ${fincaName(l.finca)}${l.sacosSemilla ? ` (${sacosTxt(l.sacosSemilla)} de semilla)` : ''}`));
    D.cosechas.forEach(c => L.push(`- Se cosecharon ${sacosTxt(c.sacos)} de ${c.lote ? c.lote.nombre : 'un lote sin nombre'} en ${fincaName(c.finca)}${c.rend ? `, ${nf(c.rend, 1)} sacos por saco de semilla` : ''}`));
  }
  const ojo = [];
  if (D.porCobrar) ojo.push(`Por cobrar ${usd(D.porCobrar)} de ${D.clientes} ${D.clientes === 1 ? 'cliente' : 'clientes'}${D.vencido ? `, ${usd(D.vencido)} vencido` : ''}.`);
  D.sobre.forEach(x => ojo.push(`${x.l.nombre} (${fincaName(x.l.finca)}) se pasó del presupuesto: ${usd(x.i.gasto)} de ${usd(x.i.presup)}.`));
  if (D.labAtras) ojo.push(`${D.labAtras} ${D.labAtras === 1 ? 'labor atrasada' : 'labores atrasadas'} en el campo.`);
  if (ojo.length) L.push('', 'Para estar pendientes:', ...ojo.map(t => '- ' + t));
  if (nota && String(nota).trim()) L.push('', 'Comentario del gerente:', String(nota).trim());
  return L.join('\n');
}
VIEWS.cierre = () => {
  if (!ready() || !S.loaded.cierres) return notReady();
  if (!S.cierreMes || S.cierreMes > 12) S.cierreMes = defaultCierreMes();
  const D = cierreData(S.cierreMes), st = D.st, doc = D.doc;
  const mes = MESES_L[D.m - 1];
  const pctMeta = D.metaHoy ? D.ytd.sacos / D.metaHoy * 100 : 0;
  let out = `<section><div class="sec-head"><div><p class="eyebrow">Reporte para la familia</p><h2>Cierre de ${mes} ${D.y}</h2></div>
      <label class="pill"><select id="ci-mes" aria-label="Mes del cierre">${MESES_L.map((n, i) => opt(i + 1, n, D.m)).join('')}</select></label></div>
    ${doc && doc.cerrado ? `<div class="notice ok"><p><strong>Mes cerrado</strong> el ${fdateY(doc.fechaCierre)}${doc.autor && S.names[doc.autor] ? ' por ' + esc(S.names[doc.autor]) : ''}. Si cambias registros de ${mes.toLowerCase()}, vuelve a guardar el cierre.</p></div>` : ''}
    <div class="hero">
      <div><div class="hl">Utilidad de ${mes.toLowerCase()} · ${esc(D.titulo)}</div><div class="hv">${usd(st.utilidad)}</div><div class="hs">${D.prev ? deltaTxt(st.utilidad, D.prev.utilidad, D.m) : 'Primer mes del año'}</div></div>
      <div class="hero-row"><div><span>Ventas</span><b>${usd(st.ventas)}</b></div><div><span>Gastos</span><b>${usd(st.gastos)}</b></div><div><span>Sacos cosechados</span><b>${nf(st.sacos)}</b></div></div>
    </div>
    <div class="kpis">
      ${kpi('Precio promedio', st.precioProm == null ? '—' : usd(st.precioProm, 2), D.coche ? `Coche ${usd(D.coche, 2)} por 50 kg` : 'sin precio de Coche anotado')}
      ${kpi('Costo del cultivo por saco', st.costoSaco == null ? '—' : usd(st.costoSaco, 2), `meta ${usd(S.cfg.metaCostoSaco)}`, st.costoSaco == null ? '' : st.costoSaco <= N(S.cfg.metaCostoSaco) ? 'good' : 'bad')}
      ${kpi('Utilidad del año', usd(D.ytd.utilidad), `ventas ${usd(D.ytd.ventas)} hasta ${mes.toLowerCase()}`, D.ytd.utilidad < 0 ? 'bad' : '')}
      ${kpi('Sacos del año', nf(D.ytd.sacos), `${nf(pctMeta)}% de la meta a esta fecha (${nf(D.metaHoy)})`, pctMeta >= 95 ? 'good' : pctMeta >= 75 ? 'warn' : 'bad')}
      ${kpi('Por cobrar hoy', usd(D.porCobrar), D.vencido ? `${usd(D.vencido)} vencido` : `${D.clientes} ${D.clientes === 1 ? 'cliente' : 'clientes'}`, D.vencido ? 'bad' : '')}
      ${kpi('Labores', `${nf(D.labHechas)} hechas`, D.labAtras ? `${D.labAtras} atrasadas hoy` : 'nada atrasado', D.labAtras ? 'warn' : '')}
    </div></section>`;
  if (D.fincas.length > 1) {
    out += `<section><h3>Por finca en ${mes.toLowerCase()}</h3><div class="tbl"><table><thead><tr><th>Finca</th><th class="r">Sacos</th><th class="r">Ventas</th><th class="r">Gastos</th><th class="r">Utilidad</th><th class="r">Precio promedio</th></tr></thead><tbody>
      ${D.fincas.map(({ fc, s }) => `<tr><td>${esc(fc.nombre)}</td><td class="r num">${nf(s.sacos)}</td><td class="r num">${usd(s.ventas)}</td><td class="r num">${usd(s.gastos)}</td><td class="r num ${s.utilidad < 0 ? 'neg' : ''}">${usd(s.utilidad)}</td><td class="r num">${s.precioProm == null ? '—' : usd(s.precioProm, 2)}</td></tr>`).join('')}
      <tr class="total"><td>Total</td><td class="r num">${nf(st.sacos)}</td><td class="r num">${usd(st.ventas)}</td><td class="r num">${usd(st.gastos)}</td><td class="r num">${usd(st.utilidad)}</td><td class="r num">${st.precioProm == null ? '—' : usd(st.precioProm, 2)}</td></tr></tbody></table></div></section>`;
  }
  const lotesHtml = [...D.sembrados.map(l => `<div class="item"><span class="av t-cosecha">${icon('lotes', 's')}</span><div><div class="t">Se sembró ${esc(l.nombre)}</div><div class="s">${esc(fincaName(l.finca))} · ${fdate(l.siembra)}${l.sacosSemilla ? ' · ' + sacosTxt(l.sacosSemilla) + ' de semilla' : ''}</div></div><div class="a"></div></div>`),
    ...D.cosechas.map(c => `<div class="item"><span class="av t-venta">${icon('cosecha', 's')}</span><div><div class="t">${esc(c.lote ? c.lote.nombre : 'Cosecha sin lote')} · ${sacosTxt(c.sacos)}</div><div class="s">${esc(fincaName(c.finca))} · ${nf(c.primera)} de primera${c.rend ? ' · ' + nf(c.rend, 1) + ' sacos por saco de semilla' : ''}</div></div><div class="a"></div></div>`)].join('');
  const ojo = [];
  if (D.vencido) ojo.push(['bad', `${usd(D.vencido)} en ventas vencidas.`, 'cobros', 'Ver cobros']);
  D.sobre.forEach(x => ojo.push(['bad', `${esc(x.l.nombre)} (${esc(fincaName(x.l.finca))}) se pasó del presupuesto: ${usd(x.i.gasto)} de ${usd(x.i.presup)}.`, 'lotes', 'Ver lote']));
  if (D.labAtras) ojo.push(['', `${D.labAtras} ${D.labAtras === 1 ? 'labor atrasada' : 'labores atrasadas'}.`, 'labores', 'Ver labores']);
  if (!D.coche) ojo.push(['info', `No hay precios de Coche anotados en ${mes.toLowerCase()}.`, 'precios', 'Ver precios']);
  out += `<div class="split"><section><h3>Lotes del mes</h3>${lotesHtml ? `<div class="list">${lotesHtml}</div>` : `<p class="muted small">No se sembró ni se cosechó en ${mes.toLowerCase()}.</p>`}</section>
    <section><h3>Para estar pendientes</h3>${ojo.length ? `<div class="alerts">${ojo.map(([cls, t, go, b]) => `<div class="alert ${cls}"><span class="ai">${icon(cls === 'info' ? 'precio' : cls === 'bad' ? 'alerta' : 'reloj', 's')}</span><span>${t}</span><button class="btn ghost" data-go="${go}">${b} →</button></div>`).join('')}</div>` : '<p class="muted small">Todo en orden.</p>'}</section></div>`;
  const nota = doc ? doc.nota || '' : '';
  out += `<section><div class="panel"><h3>Comentario del gerente</h3><p class="muted small">Tres o cuatro líneas: qué salió bien, qué preocupa y en qué te vas a enfocar el mes que viene. Es lo que más lee la familia.</p>
    <textarea id="ci-nota" placeholder="Ej.: Buen mes de ventas en Caracas. Preocupa el costo del abono en El Mostrenco. En noviembre: sembrar la tanda 3 y cobrar a Plan B.">${esc(nota)}</textarea>
    ${S.cierreAi.error ? `<div class="notice">${esc(S.cierreAi.error)}</div>` : ''}
    <div class="btns">${S.canAdmin ? `<button class="btn primary" data-act="ci-save" ${S.saving ? 'disabled' : ''}>${doc && doc.cerrado ? 'Guardar cambios' : 'Guardar y cerrar el mes'}</button>` : ''}${S.sample ? `<button class="btn" data-act="ci-ai" ${S.cierreAi.busy ? 'disabled' : ''}>${icon('chispa', 's')}${S.cierreAi.busy ? 'Redactando…' : 'Borrador con Claude'}</button>` : ''}</div></div></section>`;
  out += `<section><div class="panel"><h3>Para mandar a la familia</h3><pre class="tpl" id="ci-txt">${esc(cierreTexto(D, nota))}</pre>
    <div class="btns"><button class="btn" data-act="copy" data-src="ci-txt">Copiar para WhatsApp</button>${S.downloads ? `<button class="btn" data-act="ci-dl">Descargar reporte</button>` : ''}</div>
    <p class="hint">El reporte descargado se abre en cualquier navegador y se puede imprimir o guardar como PDF.</p></div></section>`;
  const hechos = S.cierres.filter(c => c.cerrado && String(c.id).startsWith(String(D.y)) && (c.finca || 'all') === S.finca).sort((a, b) => String(a.id).localeCompare(String(b.id)));
  out += `<section><h3>Meses de ${D.y}</h3><div class="months">${MESES.map((n, i) => { const c = hechos.find(x => x.id === cierreId(D.y, i + 1, S.finca)); return `<button class="mo ${c ? 'done' : ''} ${i + 1 === D.m ? 'cur' : ''}" data-act="ci-go" data-v="${i + 1}" aria-label="${MESES_L[i]}${c ? ', cerrado' : ''}">${n}</button>`; }).join('')}</div><p class="hint">En verde, los meses cerrados.</p></section>`;
  return out;
};
async function guardarCierre() {
  if (S.saving) return;
  const m = S.cierreMes, D = cierreData(m);
  S.saving = true;
  await S.db.doc('cierres/' + cierreId(D.y, m, D.f)).set({ anio: D.y, mes: m, finca: D.f, nota: val('ci-nota').trim(), cerrado: true, fechaCierre: today(), autor: S.uid || null,
    resumen: { ventas: D.st.ventas, gastos: D.st.gastos, utilidad: D.st.utilidad, sacos: D.st.sacos, sacosVendidos: D.st.sacosV, porCobrar: D.porCobrar } });
  S.saving = false; toast(`Cierre de ${MESES_L[m - 1].toLowerCase()} guardado`); render();
}
async function redactarCierre() {
  const D = cierreData(S.cierreMes);
  S.cierreAi = { busy: true, error: '' }; render();
  try {
    const r = await S.sample(`Eres el gerente de Agropecuaria Santo Domingo, tres fincas familiares de papa en Santo Domingo, Mérida, Venezuela. Escribe el comentario del gerente para el cierre del mes que se le manda a la familia por WhatsApp.
Reglas: español de Venezuela, sobrio y claro, de 3 a 5 oraciones, sin saludo ni firma, sin emojis ni viñetas. Di qué salió bien, qué preocupa y en qué hay que enfocarse el mes que viene. Usa solo las cifras de abajo y no inventes datos. Si casi no hay registros, dilo y recomienda registrar todo.

${cierreTexto(D, '')}`, { cache: false });
    const t = String(r && r.text || '').trim();
    const el = document.getElementById('ci-nota');
    if (el && t) el.value = t;
    S.cierreAi = { busy: false, error: t ? '' : 'Claude no devolvió texto. Prueba otra vez.' };
  } catch (e) {
    const c = e && e.code;
    S.cierreAi = { busy: false, error: c === 'cancelled' ? '' : c === 'rate_limited' ? 'Claude está ocupado o llegaste al límite de uso. Prueba más tarde.' : 'No se pudo redactar. Escríbelo a mano.' };
  }
  render();
}
function cierreHtmlDoc(D, nota) {
  const st = D.st, mes = `${MESES_L[D.m - 1]} ${D.y}`, e = esc;
  const row = (a, b) => `<tr><td>${a}</td><td class="r">${b}</td></tr>`;
  const fincas = D.fincas.length > 1 ? `<h2>Por finca</h2><table><tr><th>Finca</th><th class="r">Sacos</th><th class="r">Ventas</th><th class="r">Gastos</th><th class="r">Utilidad</th></tr>${D.fincas.map(({ fc, s }) => `<tr><td>${e(fc.nombre)}</td><td class="r">${nf(s.sacos)}</td><td class="r">${usd(s.ventas)}</td><td class="r">${usd(s.gastos)}</td><td class="r">${usd(s.utilidad)}</td></tr>`).join('')}</table>` : '';
  const lotes = [...D.sembrados.map(l => `<li>Se sembró ${e(l.nombre)} en ${e(fincaName(l.finca))}${l.sacosSemilla ? ` (${sacosTxt(l.sacosSemilla)} de semilla)` : ''}.</li>`), ...D.cosechas.map(c => `<li>Se cosecharon ${sacosTxt(c.sacos)} de ${e(c.lote ? c.lote.nombre : 'un lote sin nombre')} en ${e(fincaName(c.finca))}${c.rend ? `, ${nf(c.rend, 1)} sacos por saco de semilla` : ''}.</li>`)].join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cierre de ${mes} · Agropecuaria Santo Domingo</title>
<style>body{font:15px/1.5 -apple-system,'Segoe UI',Roboto,sans-serif;color:#17251C;background:#fff;max-width:760px;margin:0 auto;padding:32px 20px}h1{font-size:24px;margin:0}h2{font-size:16px;margin:28px 0 8px;color:#1F5A40}.sub{color:#5F6E63;margin:2px 0 20px}.hero{background:#173F2E;color:#F2F7F3;border-radius:14px;padding:18px 20px;display:flex;flex-wrap:wrap;gap:18px 36px}.hero div{display:flex;flex-direction:column}.hero span{font-size:12px;color:#A9C8B6;text-transform:uppercase;letter-spacing:.04em}.hero b{font-size:22px;font-weight:600}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:7px 8px;border-bottom:1px solid #E0E6DE;text-align:left}th{font-size:12px;color:#5F6E63;text-transform:uppercase}.r{text-align:right;font-variant-numeric:tabular-nums}.nota{background:#F3F5F2;border-radius:12px;padding:14px 16px;white-space:pre-wrap}ul{padding-left:20px}footer{margin-top:32px;color:#5F6E63;font-size:12px}@media print{body{padding:0}.hero{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<h1>Cierre de ${mes}</h1><p class="sub">Agropecuaria Santo Domingo · ${e(D.titulo)} · Santo Domingo, Mérida</p>
<div class="hero"><div><span>Utilidad del mes</span><b>${usd(st.utilidad)}</b></div><div><span>Ventas</span><b>${usd(st.ventas)}</b></div><div><span>Gastos</span><b>${usd(st.gastos)}</b></div><div><span>Sacos cosechados</span><b>${nf(st.sacos)}</b></div></div>
${nota && nota.trim() ? `<h2>Comentario del gerente</h2><div class="nota">${e(nota.trim())}</div>` : ''}
<h2>Las cifras del mes</h2><table>${row('Sacos vendidos', nf(st.sacosV))}${row('Precio promedio por saco', st.precioProm == null ? '—' : usd(st.precioProm, 2))}${row('Precio en Coche (50 kg)', D.coche == null ? '—' : usd(D.coche, 2))}${row('Gastos del cultivo', usd(st.cultivo))}${row('Venta y flete', usd(st.venta))}${row('Gestión (sueldo, viajes, contador)', usd(st.gestion))}${row('Costo del cultivo por saco', st.costoSaco == null ? '—' : usd(st.costoSaco, 2))}${D.prev ? row(`Utilidad de ${MESES_L[D.m - 2].toLowerCase()}`, usd(D.prev.utilidad)) : ''}</table>
${fincas}
<h2>En el año hasta ${MESES_L[D.m - 1].toLowerCase()}</h2><table>${row('Ventas', usd(D.ytd.ventas))}${row('Gastos', usd(D.ytd.gastos))}${row('Utilidad', usd(D.ytd.utilidad))}${row('Sacos cosechados', `${nf(D.ytd.sacos)} de ${nf(D.metaHoy)} de la meta a esta fecha`)}</table>
${lotes ? `<h2>Lotes</h2><ul>${lotes}</ul>` : ''}
<h2>Para estar pendientes</h2><table>${row('Por cobrar', `${usd(D.porCobrar)}${D.vencido ? ` (${usd(D.vencido)} vencido)` : ''}`)}${row('Lotes sobre el presupuesto', D.sobre.length ? D.sobre.map(x => e(x.l.nombre)).join(', ') : 'Ninguno')}${row('Labores atrasadas', nf(D.labAtras))}</table>
<footer>Preparado el ${fdateY(today())} con el Cuaderno de las Fincas.</footer></body></html>`;
}
async function descargarCierre() {
  const D = cierreData(S.cierreMes);
  try { await S.downloads.save({ filename: `cierre-${D.pref}${D.f === 'all' ? '' : '-' + D.f}.html`, data: cierreHtmlDoc(D, val('ci-nota')) }); toast('Reporte listo'); }
  catch (e) { if (e && e.code !== 'declined') toast('No se pudo descargar en esta vista.'); }
}

// ---------- actions ----------
document.addEventListener('click', async ev => {
  if (ev.target.closest('.scrim')) { S.sheet = false; return render(); }
  const b = ev.target.closest('button, [data-go]'); if (!b) return;
  if (b.dataset.tab === 'mas') { S.sheet = !S.sheet; return render(); }
  if (b.dataset.tab) { S.sheet = false; return go(b.dataset.tab); }
  if (b.dataset.go) return go(b.dataset.go);
  if (b.dataset.tipo) { S.regTipo = b.dataset.tipo; S.editing = null; return render(); }
  const act = b.dataset.act; if (!act) return;
  const id = b.dataset.id;
  try {
    switch (act) {
      case 'confirm': S.confirm = b.dataset.k; render(); break;
      case 'confirm-no': S.confirm = null; render(); break;
      case 'del': S.confirm = null; await S.db.doc('registros/' + id).delete(); toast('Registro borrado'); break;
      case 'del-precio': S.confirm = null; await S.db.doc('precios/' + id).delete(); toast('Precio borrado'); break;
      case 'lote-del': S.confirm = null; await S.db.doc('lotes/' + id).delete(); toast('Lote borrado'); break;
      case 'cobrar': await S.db.doc('registros/' + id).update({ cobrado: true, fechaCobro: today() }); toast('Venta marcada como cobrada'); break;
      case 'edit': { const r = S.regs.find(x => x.id === id); if (!r) break; S.editing = id; S.regTipo = r.tipo; S.skipRestore = true; go('registrar'); break; }
      case 'cancel-edit': S.editing = null; S.skipRestore = true; render(); break;
      case 'new-precio': S.regTipo = 'precio'; S.editing = null; go('registrar'); break;
      case 'lote-new': S.editingLote = 'new'; S.skipRestore = true; render(); break;
      case 'lote-edit': S.editingLote = id; S.skipRestore = true; render(); window.scrollTo({ top: 0 }); break;
      case 'lote-cancel': S.editingLote = null; render(); break;
      case 'lote-estado': await S.db.doc('lotes/' + id).update({ estado: b.dataset.v }); toast(b.dataset.v === 'sembrado' ? 'Lote marcado como sembrado' : 'Lote marcado como cosechado'); break;
      case 'ai-read': await leerConClaude(); break;
      case 'ai-stop': S.aiCtl?.abort(); break;
      case 'ai-clear': S.proposals = []; render(); break;
      case 'ai-save': await guardarPropuestas(); break;
      case 'csv': await exportCsv(); break;
      case 'copy': await copyText(document.getElementById(b.dataset.src)); break;
      case 'logout': S.sheet = false; stopSubs(); await S.fb.auth.logout(); break;
      case 'login-mode': S.loginMode = b.dataset.v; S.loginErr = ''; S.skipRestore = false; render(); break;
      case 'login-reset': { const e = val('lg-email').trim(); if (!e) { S.loginErr = 'Escribe tu correo y vuelve a tocar "Olvidé mi contraseña".'; render(); break; } try { await S.fb.auth.reset(e); S.loginErr = 'Te mandamos un correo para cambiar la contraseña.'; } catch (er) { S.loginErr = authMsg(er); } render(); break; }
      case 'mb-del': S.confirm = null; await S.db.doc('miembros/' + id).delete(); toast('Usuario quitado'); break;
      case 'imp': await importar(); break;
      case 'lab-hecho': { await labSet(id, { hecho: true, omitida: false, fechaHecho: today() }); const it = labItems(true).find(x => x.id === id); if (it && it.k === 'siembra') { const l = S.lotes.find(x => x.id === it.lote); if (l && l.estado === 'plan') await S.db.doc('lotes/' + l.id).update({ estado: 'sembrado' }); } toast('Labor hecha'); break; }
      case 'lab-omitir': await labSet(id, { omitida: true, hecho: false }); toast('Marcada como "No aplica"'); break;
      case 'lab-undo': await labSet(id, { hecho: false, omitida: false, fechaHecho: null }); break;
      case 'lab-mover': S.movLab = id; S.skipRestore = true; render(); break;
      case 'lab-mover-no': S.movLab = null; render(); break;
      case 'lab-del': S.confirm = null; await S.db.doc('labores/' + id).delete(); toast('Labor borrada'); break;
      case 'lab-new': S.labNew = true; S.skipRestore = true; render(); break;
      case 'lab-new-no': S.labNew = false; render(); break;
      case 'lab-cos': { const it = labItems(true).find(x => x.id === id); if (!it) break; S.regTipo = 'cosecha'; S.editing = null; S.prefLote = it.lote; S.prefFinca = it.finca; go('registrar'); break; }
      case 'cobrar-cli': { S.confirm = null; const rs = S.pend.filter(r => !r.cobrado && cliName(r) === b.dataset.k && (S.finca === 'all' || r.finca === S.finca)); for (const r of rs) await S.db.doc('registros/' + r.id).update({ cobrado: true, fechaCobro: today() }); toast(`${rs.length} ventas marcadas como cobradas`); break; }
      case 'ci-save': await guardarCierre(); break;
      case 'ci-ai': await redactarCierre(); break;
      case 'ci-dl': await descargarCierre(); break;
      case 'ci-go': S.cierreMes = +b.dataset.v; S.skipRestore = true; render(); break;
    }
  } catch (e) { writeErr(e); }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && S.sheet) { S.sheet = false; render(); } });
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.id === 'f-year') { S.year = +el.value; subscribeRegs(); S.skipRestore = true; return render(); }
  if (el.id === 'f-finca') { S.finca = el.value; lsSet('cf-finca', S.finca); S.skipRestore = true; return render(); }
  if (el.id === 'mb-rol') { const w = document.getElementById('mb-finca-w'); if (w) w.hidden = el.value !== 'encargado'; return; }
  if (el.id === 'ci-mes') { S.cierreMes = +el.value; S.skipRestore = true; return render(); }
  if (el.dataset.libro) { S.libro[el.dataset.libro] = el.value; return render(); }
  if (el.dataset.aiTipo !== undefined) { syncProposals(); S.proposals[+el.dataset.aiTipo].tipo = el.value; S.skipRestore = true; return render(); }
  if (el.matches('select') && document.querySelector(`select[data-lote-for="${el.id}"]`)) syncLotes($('#view'));
});
let rzT = 0; window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { if (S.view === 'resumen' || S.view === 'precios') render(); }, 200); });
let qT = 0;
document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.dataset.libro === 'q') { clearTimeout(qT); qT = setTimeout(() => { S.libro.q = el.value; render(); }, 250); }
  if (el.closest('#reg-form') && (el.id === 'r-sacos' || el.id === 'r-precio')) { const t = $('#r-total'); const s = parseNum($('#r-sacos')?.value), p = parseNum($('#r-precio')?.value); if (t) t.textContent = s && p && S.regTipo === 'venta' ? `Total: ${usd(s * p)}` : ''; }
});
document.addEventListener('submit', async ev => {
  ev.preventDefault();
  const f = ev.target;
  try {
    if (f.id === 'reg-form') await guardarRegistro();
    if (f.id === 'lote-form') await guardarLote();
    if (f.id === 'plan-form') await generarPlan();
    if (f.id === 'cfg-form') await guardarAjustes();
    if (f.id === 'login-form') await entrar();
    if (f.id === 'mb-form') await guardarMiembro();
    if (f.id === 'lab-form') await guardarLabor();
    if (f.id === 'lab-move-form') { const fe = val('lm-fecha'); if (!isoOk(fe)) return toast('Pon la nueva fecha.'); await labSet(f.dataset.id, { fecha: fe }); S.movLab = null; toast('Fecha cambiada'); }
  } catch (e) { writeErr(e); }
});
function go(v) { if (!tabOk(v)) v = 'resumen'; S.view = v; S.confirm = null; lsSet('cf-view', v); try { history.replaceState(null, '', '#' + v); } catch { } S.skipRestore = true; render(); window.scrollTo({ top: 0 }); }
function writeErr(e) {
  console.error(e);
  const code = e && e.code;
  if (code === 'permission-denied' || code === 'invalid_argument') toast('No se guardó: tu usuario no tiene permiso para eso.');
  else if (code === 'quota_exceeded') toast('El cuaderno está lleno. Hay que borrar registros viejos.');
  else if (code === 'resource_exhausted') toast('Demasiados cambios seguidos. Espera un momento.');
  else toast('No se pudo guardar. Revisa la conexión y prueba otra vez.');
  S.saving = false; render();
}
const val = id => (document.getElementById(id) || {}).value ?? '';
async function guardarRegistro() {
  if (S.saving) return;
  const t = S.regTipo, fecha = val('r-fecha');
  if (!isoOk(fecha)) return toast('Pon la fecha.');
  let r;
  if (t === 'precio') {
    const precio = parseNum(val('r-precio')); if (!precio) return toast('Pon el precio por saco.');
    r = { fecha, mercado: val('r-mercado'), producto: val('r-producto').trim(), precio, kgSaco: parseNum(val('r-kg')) || 45, desc: val('r-desc').trim() };
  } else {
    r = { tipo: t, fecha, finca: val('r-finca'), lote: val('r-lote'), desc: val('r-desc').trim() };
    if (!r.finca) return toast('Elige la finca.');
    if (t === 'gasto') { r.cat = val('r-cat'); r.monto = parseNum(val('r-monto')); r.cantidad = parseNum(val('r-cant')); r.unidad = val('r-unidad').trim(); if (!r.monto) return toast('Pon el monto del gasto.'); }
    if (t === 'cosecha') { r.sacosPrimera = parseNum(val('r-prim')) || 0; r.sacosSegunda = parseNum(val('r-seg')) || 0; r.kgSaco = parseNum(val('r-kg')) || S.cfg.kgSaco; if (!(r.sacosPrimera + r.sacosSegunda)) return toast('Pon cuántos sacos se cosecharon.'); }
    if (t === 'venta') { r.comprador = val('r-comprador').trim(); r.canal = val('r-canal'); r.calidad = val('r-calidad'); r.sacos = parseNum(val('r-sacos')); r.precio = parseNum(val('r-precio')); r.kgSaco = parseNum(val('r-kg')) || S.cfg.kgSaco; r.cobrado = !!document.getElementById('r-cobrado')?.checked; if (!r.sacos || !r.precio) return toast('Pon los sacos y el precio por saco.'); r.monto = Math.round(r.sacos * r.precio * 100) / 100; }
  }
  S.saving = true;
  const col = t === 'precio' ? 'precios' : 'registros';
  if (S.editing) {
    const old = (t === 'precio' ? S.precios : S.regs).find(x => x.id === S.editing) || {};
    const { id: _id, ...rest } = old;
    await S.db.doc(col + '/' + S.editing).set({ ...rest, ...r, editado: new Date().toISOString(), editadoPor: S.uid || null });
    S.editing = null; toast('Cambios guardados');
  } else {
    await S.db.collection(col).add({ ...r, autor: S.uid || null, creado: new Date().toISOString(), fuente: 'manual' });
    toast(t === 'precio' ? 'Precio anotado' : 'Registro guardado');
  }
  S.saving = false; S.prefLote = ''; S.prefFinca = '';
  ['r-monto', 'r-cant', 'r-unidad', 'r-desc', 'r-prim', 'r-seg', 'r-sacos', 'r-precio', 'r-comprador'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const tt = $('#r-total'); if (tt) tt.textContent = '';
  render();
}
async function guardarLote() {
  const l = { nombre: val('l-nombre').trim(), finca: val('l-finca'), variedad: val('l-variedad').trim(), ha: parseNum(val('l-ha')), siembra: val('l-siembra'), cicloDias: parseNum(val('l-ciclo')) || S.cfg.cicloDias, sacosSemilla: parseNum(val('l-semilla')), presupuesto: parseNum(val('l-presup')), estado: val('l-estado'), notas: val('l-notas').trim() };
  if (!l.nombre || !isoOk(l.siembra)) return toast('Pon el nombre y la fecha de siembra.');
  if (S.editingLote === 'new') await S.db.collection('lotes').add({ ...l, creado: new Date().toISOString(), autor: S.uid || null });
  else { const old = S.lotes.find(x => x.id === S.editingLote) || {}; const { id: _i, ...rest } = old; await S.db.doc('lotes/' + S.editingLote).set({ ...rest, ...l }); }
  S.editingLote = null; S.skipRestore = true; toast('Lote guardado'); render();
}
async function generarPlan() {
  const y = parseNum(val('p-anio')), T = Math.max(1, Math.min(12, Math.round(parseNum(val('p-tandas')) || 4))), sem = parseNum(val('p-semilla')) || 0, ciclo = parseNum(val('p-ciclo')) || S.cfg.cicloDias, variedad = val('p-variedad').trim() || 'Granola';
  if (!y || y < 2000) return toast('Pon el año.');
  const ya = S.lotes.filter(l => l.plan === y).length;
  if (ya) return toast(`Ya hay ${ya} lotes del plan ${y}. Bórralos antes de generar otro.`);
  const docs = [];
  for (const f of S.fincas) {
    const m0 = +val('p-mes-' + f.id) || 1;
    for (let k = 0; k < T; k++) {
      const mm = m0 - 1 + k, yy = y + Math.floor(mm / 12), mes = (mm % 12) + 1;
      docs.push({ nombre: `Tanda ${k + 1} · ${y}`, finca: f.id, variedad, siembra: `${yy}-${String(mes).padStart(2, '0')}-01`, cicloDias: ciclo, sacosSemilla: Math.round(sem / T), estado: 'plan', plan: y, notas: '', creado: new Date().toISOString(), autor: S.uid || null });
    }
  }
  S.saving = true; toast(`Creando ${docs.length} lotes…`);
  for (const d of docs) await S.db.collection('lotes').add(d);
  S.saving = false; S.year = y; subscribeRegs(); toast(`Plan ${y} creado: ${docs.length} lotes`); render();
}
async function guardarAjustes() {
  const c = { kgSaco: parseNum(val('c-kg')) || 50, metaSacosFinca: parseNum(val('c-meta')) || 0, metaCostoSaco: parseNum(val('c-costo')) || 0, precioRef: parseNum(val('c-pref')) || 0, cicloDias: parseNum(val('c-ciclo')) || 150, presupSemilla: parseNum(val('c-presup')) || 0, diasCredito: parseNum(val('c-cred')) || 15, pctTrabajo: parseNum(val('c-pt')) ?? 0, pctTierra: parseNum(val('c-pl')) ?? 0, pctDinero: parseNum(val('c-pd')) ?? 0, baseEncargado: val('c-base'), prorrateo: val('c-pror') };
  const tot = c.pctTrabajo + c.pctTierra + c.pctDinero;
  if (Math.abs(tot - 100) > 0.5) return toast(`Los tres porcentajes suman ${nf(tot, 1)}%. Deben sumar 100%.`);
  await S.db.doc('ajustes/general').set(c);
  for (const f of S.fincas) {
    const n = { nombre: val('fc-n-' + f.id).trim() || f.nombre, ha: parseNum(val('fc-ha-' + f.id)), encargado: val('fc-e-' + f.id).trim() };
    if (n.nombre !== f.nombre || n.ha !== (f.ha ?? null) || n.encargado !== (f.encargado || '')) await S.db.doc('fincas/' + f.id).update(n);
  }
  toast('Ajustes guardados');
}
async function copyText(el) {
  if (!el) return; const t = el.textContent;
  try { await navigator.clipboard.writeText(t); toast('Copiado'); }
  catch { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Texto seleccionado: cópialo con el menú del teléfono'); }
}
async function exportCsv() {
  const cols = ['fecha', 'tipo', 'finca', 'lote', 'categoria', 'detalle', 'cantidad', 'unidad', 'sacos_primera', 'sacos_segunda', 'sacos_vendidos', 'precio_saco', 'kg_saco', 'monto_usd', 'comprador', 'canal', 'calidad', 'cobrado'];
  const n = v => v === null || v === undefined || v === '' ? '' : String(v).replace('.', ',');
  const q = v => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const rows = [...S.regs].sort((a, b) => a.fecha.localeCompare(b.fecha)).map(r => [r.fecha, r.tipo, fincaName(r.finca), loteName(r.lote), (CAT_BY[r.cat] || {}).n || '', r.desc, n(r.cantidad), r.unidad, n(r.sacosPrimera), n(r.sacosSegunda), n(r.sacos), n(r.precio), n(r.kgSaco), n(r.tipo === 'gasto' ? -N(r.monto) : r.monto), r.comprador, CANALES[r.canal] || '', CALIDADES[r.calidad] || '', r.tipo === 'venta' ? (r.cobrado ? 'sí' : 'no') : ''].map(q).join(';'));
  const csv = '﻿' + cols.join(';') + '\n' + rows.join('\n');
  try { await S.downloads.save({ filename: `cuaderno-fincas-${S.year}.csv`, data: csv }); toast('Archivo listo'); }
  catch (e) { if (e && e.code !== 'declined') toast('No se pudo descargar en esta vista.'); }
}

// ---------- Claude reader ----------
function buildPrompt(txt, nImg) {
  const fincas = S.fincas.map(f => `- ${f.id}: ${f.nombre}${f.encargado ? ' (encargado: ' + f.encargado + ')' : ''}`).join('\n');
  const lotes = S.lotes.filter(l => l.estado !== 'cosechado' || (l.siembra || '') >= addDays(today(), -400)).slice(0, 60).map(l => `- ${l.id}: ${l.nombre} (${fincaName(l.finca)}, sembrado ${l.siembra || '?'})`).join('\n') || '(no hay lotes)';
  const cats = CATS.map(c => `${c.id} = ${c.n}`).join('; ');
  return `Ayudas a llevar el cuaderno de campo de Agropecuaria Santo Domingo: tres fincas de papa en Santo Domingo, Mérida, Venezuela.
Convierte ${txt ? 'el mensaje' : ''}${txt && nImg ? ' y ' : ''}${nImg ? `las ${nImg} foto(s) adjuntas (facturas, notas o páginas del cuaderno)` : ''} en registros contables.

Fecha de hoy: ${today()}. Si dicen "ayer", "el lunes" o "la semana pasada", calcula la fecha. Si no hay fecha, usa hoy.
Fincas (usa el id en "finca"):
${fincas}
- general: gastos de todas las fincas juntas (sueldo del gerente, viajes, contador, permisos)
Lotes (usa el id en "lote" solo si el mensaje nombra la tanda o el lote; si no, ""):
${lotes}
Categorías de gasto (usa el id en "cat"): ${cats}

Reglas:
- Un registro por cada gasto, cosecha, venta o precio de mercado distinto. "4 jornales a 8$" es un gasto de 32 con cantidad 4 y unidad "jornales".
- Montos en dólares. Si algo está en bolívares y el mensaje da la tasa, conviértelo; si no la da, pon monto null y explícalo en "duda".
- No inventes cifras. Si falta un dato, pon null y explica en "duda" qué hay que confirmar.
- Una venta "a crédito", "debe" o "queda debiendo" lleva "cobrado": false.
- Si no se sabe la finca, usa la más probable por el encargado y avísalo en "duda".
- Ignora saludos y lo que no sea un registro.

Responde solo con JSON con esta forma:
{"registros":[
 {"tipo":"gasto","fecha":"AAAA-MM-DD","finca":"id","lote":"","cat":"id","desc":"texto corto","cantidad":null,"unidad":"","monto":0,"duda":""},
 {"tipo":"cosecha","fecha":"AAAA-MM-DD","finca":"id","lote":"","sacosPrimera":0,"sacosSegunda":0,"kgSaco":null,"desc":"","duda":""},
 {"tipo":"venta","fecha":"AAAA-MM-DD","finca":"id","lote":"","comprador":"","canal":"camionero|coche|restaurante|otro","calidad":"primera|segunda|mezclada","sacos":0,"precio":0,"kgSaco":null,"cobrado":true,"desc":"","duda":""},
 {"tipo":"precio","fecha":"AAAA-MM-DD","mercado":"finca|coche|otro","producto":"","precio":0,"kgSaco":45,"desc":"fuente","duda":""}
]}
${txt ? `\nMensaje:\n"""\n${txt.slice(0, 12000)}\n"""` : ''}`;
}
function normProp(p) {
  if (!p || typeof p !== 'object') return null;
  const tipo = ['gasto', 'cosecha', 'venta', 'precio'].includes(p.tipo) ? p.tipo : 'gasto';
  const finca = p.finca === 'general' || S.fincas.some(f => f.id === p.finca) ? p.finca : '';
  const lote = S.lotes.some(l => l.id === p.lote) ? p.lote : '';
  const cat = CAT_BY[p.cat] ? p.cat : 'otros_cultivo';
  const n = x => (x === null || x === undefined || x === '') ? null : parseNum(x);
  return { tipo, fecha: isoOk(p.fecha) ? p.fecha : today(), finca, lote, cat, desc: String(p.desc || '').slice(0, 200), cantidad: n(p.cantidad), unidad: String(p.unidad || ''), monto: n(p.monto),
    sacosPrimera: n(p.sacosPrimera), sacosSegunda: n(p.sacosSegunda), kgSaco: n(p.kgSaco), comprador: String(p.comprador || ''), canal: CANALES[p.canal] ? p.canal : 'camionero',
    calidad: CALIDADES[p.calidad] ? p.calidad : 'mezclada', sacos: n(p.sacos), precio: n(p.precio), cobrado: p.cobrado !== false, mercado: MERCADOS[p.mercado] ? p.mercado : 'coche', producto: String(p.producto || ''),
    duda: String(p.duda || '') + (!finca && tipo !== 'precio' ? (p.duda ? ' ' : '') + 'No se sabe de qué finca es.' : ''), on: true };
}
function syncProposals() {
  S.proposals.forEach((p, i) => {
    const g = k => document.getElementById(`ai-${i}-${k}`); if (!g('tipo')) return;
    const v = k => g(k) ? g(k).value : undefined;
    p.on = g('on') ? g('on').checked : true; p.fecha = v('fecha') ?? p.fecha; p.desc = v('desc') ?? p.desc;
    if (g('finca')) p.finca = v('finca'); if (g('lote')) p.lote = v('lote'); if (g('cat')) p.cat = v('cat');
    for (const [k, f] of [['monto', 'monto'], ['cant', 'cantidad'], ['prim', 'sacosPrimera'], ['seg', 'sacosSegunda'], ['kg', 'kgSaco'], ['sacos', 'sacos'], ['precio', 'precio']]) if (g(k)) p[f] = parseNum(v(k));
    for (const k of ['unidad', 'comprador', 'canal', 'calidad', 'mercado', 'producto']) if (g(k)) p[k] = v(k);
    if (g('cobrado')) p.cobrado = g('cobrado').checked;
  });
}
async function leerConClaude() {
  const txt = val('ai-text').trim(); const fi = document.getElementById('ai-foto'); const files = fi && fi.files ? [...fi.files] : [];
  if (!txt && !files.length) return toast('Pega un mensaje o elige una foto.');
  S.ai = { busy: true, error: '' }; render();
  const ctl = new AbortController(); S.aiCtl = ctl;
  const opts = { signal: ctl.signal, cache: false };
  if (files.length) opts.images = files;
  try {
    const out = await S.sample.json(buildPrompt(txt, files.length), opts);
    const list = Array.isArray(out) ? out : (out && Array.isArray(out.registros) ? out.registros : []);
    const ps = list.map(normProp).filter(Boolean);
    S.proposals = ps;
    S.ai = { busy: false, error: ps.length ? '' : 'Claude no encontró registros en el mensaje. Revisa que tenga gastos, cosechas, ventas o precios.' };
  } catch (e) {
    const c = e && e.code;
    const msg = { cancelled: '', not_granted: 'No se dio permiso para usar Claude. Puedes registrar a mano abajo.', sampling_disabled: 'Claude no está disponible en esta cuenta. Registra a mano abajo.', rate_limited: 'Claude está ocupado o llegaste al límite de uso. Prueba más tarde.', image_rejected: 'Esa foto no se pudo leer. Prueba con otra más nítida o más pequeña.', images_unavailable: 'Aquí no se pueden enviar fotos. Pega el texto.', invalid_json: 'Claude respondió algo que no se pudo leer. Prueba otra vez.', refused: 'Claude no pudo procesar ese mensaje.', prompt_too_large: 'El mensaje es muy largo. Pégalo por partes.' }[c] ?? 'No se pudo leer el mensaje. Prueba otra vez.';
    if (c === 'not_granted' || c === 'sampling_disabled' || c === 'not_declared' || c === 'capability_disabled' || c === 'capability_removed') S.sample = null;
    S.ai = { busy: false, error: msg };
  }
  render();
}
async function guardarPropuestas() {
  if (S.saving) return;
  syncProposals();
  const sel = S.proposals.filter(p => p.on);
  if (!sel.length) return toast('No hay registros marcados.');
  for (const p of sel) {
    if (p.tipo !== 'precio' && !p.finca) return toast('Falta elegir la finca en algún registro.');
    if (p.tipo === 'gasto' && !p.monto) return toast('Falta el monto de algún gasto.');
    if (p.tipo === 'venta' && !(p.sacos && p.precio)) return toast('Falta sacos o precio en alguna venta.');
    if (p.tipo === 'cosecha' && !(N(p.sacosPrimera) + N(p.sacosSegunda))) return toast('Falta la cantidad de sacos en alguna cosecha.');
    if (p.tipo === 'precio' && !p.precio) return toast('Falta el precio en algún registro de mercado.');
  }
  S.saving = true; render();
  const base = { autor: S.uid || null, creado: new Date().toISOString(), fuente: 'claude' };
  let n = 0;
  for (const p of sel) {
    let d;
    if (p.tipo === 'precio') { d = { fecha: p.fecha, mercado: p.mercado, producto: p.producto, precio: p.precio, kgSaco: p.kgSaco || 45, desc: p.desc }; await S.db.collection('precios').add({ ...d, ...base }); }
    else {
      d = { tipo: p.tipo, fecha: p.fecha, finca: p.finca, lote: p.lote || '', desc: p.desc };
      if (p.tipo === 'gasto') Object.assign(d, { cat: p.cat, monto: p.monto, cantidad: p.cantidad, unidad: p.unidad });
      if (p.tipo === 'cosecha') Object.assign(d, { sacosPrimera: N(p.sacosPrimera), sacosSegunda: N(p.sacosSegunda), kgSaco: p.kgSaco || S.cfg.kgSaco });
      if (p.tipo === 'venta') Object.assign(d, { comprador: p.comprador, canal: p.canal, calidad: p.calidad, sacos: p.sacos, precio: p.precio, kgSaco: p.kgSaco || S.cfg.kgSaco, cobrado: p.cobrado, monto: Math.round(p.sacos * p.precio * 100) / 100 });
      await S.db.collection('registros').add({ ...d, ...base });
    }
    n++;
  }
  S.saving = false; S.proposals = []; const ta = document.getElementById('ai-text'); if (ta) ta.value = ''; const fi = document.getElementById('ai-foto'); if (fi) fi.value = '';
  toast(`Guardé ${n} ${n === 1 ? 'registro' : 'registros'}`); render();
}

// ---------- usuarios ----------
function usuariosHtml() {
  const ms = [...S.miembros].sort((a, b) => (a.rol + a.id).localeCompare(b.rol + b.id));
  return `<div class="panel"><h3>Usuarios</h3>
    <p class="small muted">Agrega aquí el correo de cada persona. Después le mandas el link de la app y entra con "Crear cuenta" usando ese mismo correo. Los encargados solo ven y registran su finca; la familia y el analista solo pueden ver.</p>
    ${ms.length ? `<div class="list">${ms.map(m => `<div class="item"><span class="av t-lab">${icon('usuario', 's')}</span><div><div class="t">${esc(m.nombre || m.id)}</div><div class="s">${esc(m.id)} · ${esc(ROLES[m.rol] || m.rol)}${m.rol === 'encargado' ? ' · ' + esc(fincaName(m.finca)) : ''}</div></div><div class="a"></div>
      <div class="acts">${S.confirm === 'mb:' + m.id ? `<button class="btn danger" data-act="mb-del" data-id="${esc(m.id)}">Sí, quitar</button><button class="btn ghost" data-act="confirm-no">No</button>` : `<button class="btn ghost danger" data-act="confirm" data-k="mb:${esc(m.id)}">Quitar acceso</button>`}</div></div>`).join('')}</div>` : '<p class="muted small">Todavía no has agregado a nadie.</p>'}
    <form id="mb-form" class="grid">
      ${fld('mb-email', 'Correo', inp('mb-email', '', 'type="email" autocomplete="off" required placeholder="nombre@gmail.com"'))}
      ${fld('mb-nombre', 'Nombre', inp('mb-nombre', '', 'placeholder="Ej.: Pedro"'))}
      ${fld('mb-rol', 'Tipo de usuario', `<select id="mb-rol">${Object.entries(ROLES).map(([k, n]) => opt(k, n, 'encargado')).join('')}</select>`)}
      <div class="field" id="mb-finca-w"><label for="mb-finca">Finca</label><select id="mb-finca">${S.fincas.map(f => opt(f.id, f.nombre, '')).join('')}</select></div>
      <div class="field wide"><div class="btns"><button class="btn primary" type="submit">Agregar usuario</button></div></div>
    </form></div>`;
}
async function guardarMiembro() {
  const email = val('mb-email').trim().toLowerCase(), rol = val('mb-rol');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast('Escribe un correo válido.');
  const d = { nombre: val('mb-nombre').trim(), rol, finca: rol === 'encargado' ? val('mb-finca') : '', agregado: new Date().toISOString(), agregadoPor: S.email };
  await S.db.doc('miembros/' + email).set(d);
  ['mb-email', 'mb-nombre'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  toast('Usuario agregado'); render();
}
function importHtml() {
  return `<details class="box"><summary>Pasar datos de un respaldo</summary><div class="in">
    <p class="small muted">Carga un archivo de respaldo (.json) con fincas, lotes, registros, precios, labores y cierres. Los registros que ya existan con el mismo código se reemplazan; nada se duplica.</p>
    <input type="file" id="imp-file" accept="application/json,.json">
    <div class="btns"><button class="btn" data-act="imp" ${S.saving ? 'disabled' : ''}>Importar</button></div></div></details>`;
}
async function importar() {
  const f = document.getElementById('imp-file')?.files?.[0];
  if (!f) return toast('Elige el archivo de respaldo.');
  let data; try { data = JSON.parse(await f.text()); } catch { return toast('Ese archivo no es un respaldo válido.'); }
  const cols = ['fincas', 'ajustes', 'lotes', 'registros', 'precios', 'labores', 'cierres'];
  let n = 0; S.saving = true; render();
  for (const c of cols) {
    const docs = data[c]; if (!docs || typeof docs !== 'object') continue;
    for (const [id, d] of Object.entries(docs)) { if (d && typeof d === 'object' && /^[\w.-]{1,120}$/.test(id)) { await S.db.doc(`${c}/${id}`).set(d); n++; } }
  }
  S.saving = false; toast(`Importados ${n} datos`); render();
}

// ---------- entrada ----------
function authMsg(e) {
  const c = (e && e.code) || '';
  return ({
    'auth/invalid-credential': 'Correo o contraseña incorrectos.', 'auth/wrong-password': 'Correo o contraseña incorrectos.', 'auth/user-not-found': 'Ese correo no tiene cuenta todavía. Toca "Crear cuenta".',
    'auth/email-already-in-use': 'Ese correo ya tiene cuenta. Entra con tu contraseña.', 'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'Ese correo no es válido.', 'auth/network-request-failed': 'Sin conexión. Para entrar la primera vez hace falta internet; después funciona sin señal.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
  })[c] || 'No se pudo entrar. Prueba otra vez.';
}
function gateHtml() {
  const logo = `<span class="logo big" aria-hidden="true">${icon('lotes')}</span>`;
  if (S.status === 'noconfig') return `<div class="gate">${logo}<h1>Cuaderno de las Fincas</h1>${notReady()}</div>`;
  if (S.auth === 'checking' || (S.auth === 'in' && !S.rol)) return `<div class="gate">${logo}<h1>Cuaderno de las Fincas</h1><p class="muted">Abriendo…</p></div>`;
  if (S.auth === 'in' && S.rol === 'none') return `<div class="gate">${logo}<h1>Todavía no tienes acceso</h1><p class="muted">Entraste como ${esc(S.email)}, pero ese correo no está en la lista de usuarios. Pídele a Luis que te agregue con este mismo correo.</p><div class="btns"><button class="btn" data-act="logout">Salir</button></div></div>`;
  const up = S.loginMode === 'up';
  return `<div class="gate">${logo}<h1>Cuaderno de las Fincas</h1><p class="muted">Agropecuaria Santo Domingo</p>
    <form class="panel" id="login-form">
      ${up ? fld('lg-nombre', 'Tu nombre', inp('lg-nombre', '', 'autocomplete="name"')) : ''}
      ${fld('lg-email', 'Correo', inp('lg-email', '', 'type="email" autocomplete="email" required'))}
      ${fld('lg-pass', up ? 'Crea una contraseña (6 o más caracteres)' : 'Contraseña', inp('lg-pass', '', `type="password" autocomplete="${up ? 'new-password' : 'current-password'}" required`))}
      ${S.loginErr ? `<div class="notice">${esc(S.loginErr)}</div>` : ''}
      <button class="btn primary block" type="submit" ${S.loginBusy ? 'disabled' : ''}>${S.loginBusy ? 'Un momento…' : up ? 'Crear cuenta' : 'Entrar'}</button>
      <div class="btns" style="justify-content:space-between">${up ? `<button type="button" class="btn ghost" data-act="login-mode" data-v="in">Ya tengo cuenta</button>` : `<button type="button" class="btn ghost" data-act="login-mode" data-v="up">Primera vez: crear cuenta</button><button type="button" class="btn ghost" data-act="login-reset">Olvidé mi contraseña</button>`}</div>
    </form>
    <p class="hint">Solo pueden entrar los correos que Luis haya agregado.</p></div>`;
}
async function entrar() {
  const e = val('lg-email').trim().toLowerCase(), p = val('lg-pass');
  if (!e || !p) { S.loginErr = 'Escribe tu correo y tu contraseña.'; return render(); }
  S.loginBusy = true; S.loginErr = ''; render();
  try { if (S.loginMode === 'up') await S.fb.auth.register(e, p, val('lg-nombre').trim()); else await S.fb.auth.login(e, p); }
  catch (er) { S.loginErr = authMsg(er); }
  S.loginBusy = false; render();
}

// ---------- data ----------
function snapErr(e) { console.warn('db', e); if (e && e.code === 'permission-denied' && S.rol !== 'admin') { /* role changed or no access */ } }
function stopSubs() { S.unsubs.forEach(u => { try { u(); } catch { } }); S.unsubs = []; if (S.unsubRegs) { try { S.unsubRegs(); } catch { } S.unsubRegs = null; } }
function subscribeRegs() {
  if (!S.db || !S.rol || S.rol === 'none') return;
  if (S.unsubRegs) S.unsubRegs();
  S.loaded.regs = false;
  const y = S.year;
  if (S.rol === 'encargado') {
    // Rules only let an overseer read their own farm, so the query filters by farm and the year is cut here.
    S.unsubRegs = S.db.collection('registros').where('finca', '==', S.miFinca).limit(5000).onSnapshot(s => {
      const all = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => isoOk(r.fecha));
      S.regs = all.filter(r => r.fecha.startsWith(String(S.year))).sort((a, b) => b.fecha.localeCompare(a.fecha));
      S.pend = all.filter(r => r.tipo === 'venta' && r.cobrado === false);
      S.loaded.regs = true; S.loaded.pend = true; render();
    }, snapErr);
    return;
  }
  S.unsubRegs = S.db.collection('registros').where('fecha', '>=', `${y}-01-01`).where('fecha', '<=', `${y}-12-31`).orderBy('fecha', 'desc').limit(3000)
    .onSnapshot(s => { if (y !== S.year) return; S.regs = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => isoOk(r.fecha)); S.loaded.regs = true; render(); }, snapErr);
}
function subscribeStatic() {
  const db = S.db, on = u => S.unsubs.push(u);
  on(db.collection('fincas').onSnapshot(s => { S.fincas = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => N(a.orden) - N(b.orden)); S.loaded.fincas = true; render(); }, snapErr));
  on(db.doc('ajustes/general').onSnapshot(s => { S.cfg = { ...DEF, ...(s.exists ? s.data() : {}) }; S.loaded.cfg = true; render(); }, snapErr));
  on(db.collection('lotes').limit(2000).onSnapshot(s => { S.lotes = s.docs.map(d => ({ id: d.id, ...d.data() })); S.loaded.lotes = true; render(); }, snapErr));
  on(db.collection('labores').limit(5000).onSnapshot(s => { S.labores = s.docs.map(d => ({ id: d.id, ...d.data() })); S.loaded.labores = true; render(); }, snapErr));
  on(db.collection('precios').orderBy('fecha', 'desc').limit(500).onSnapshot(s => { S.precios = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => isoOk(p.fecha)); S.loaded.precios = true; render(); }, snapErr));
  if (S.rol === 'encargado') { S.loaded.cierres = true; return; }
  on(db.collection('cierres').limit(500).onSnapshot(s => { S.cierres = s.docs.map(d => ({ id: d.id, ...d.data() })); S.loaded.cierres = true; render(); }, snapErr));
  on(db.collection('registros').where('cobrado', '==', false).limit(1000).onSnapshot(s => { S.pend = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => r.tipo === 'venta' && isoOk(r.fecha)); S.loaded.pend = true; render(); }, snapErr));
  if (S.rol === 'admin') on(db.collection('miembros').onSnapshot(s => { S.miembros = s.docs.map(d => ({ id: d.id, ...d.data() })); S.miembros.forEach(m => { if (m.nombre) S.names[m.id] = m.nombre; }); render(); }, snapErr));
}
function arrancar() {
  stopSubs();
  S.loaded = { fincas: false, lotes: false, regs: false, precios: false, cfg: false, labores: false, cierres: false, pend: false };
  S.canAdmin = S.rol === 'admin';
  if (S.rol === 'encargado') S.finca = S.miFinca;
  S.status = 'ok';
  subscribeStatic(); subscribeRegs(); render();
}
function descargar({ filename, data }) {
  const type = filename.endsWith('.csv') ? 'text/csv;charset=utf-8' : filename.endsWith('.json') ? 'application/json' : 'text/html;charset=utf-8';
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type })); a.download = filename;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  return Promise.resolve({ status: 'saved' });
}
window.addEventListener('online', () => { S.online = true; render(); });
window.addEventListener('offline', () => { S.online = false; render(); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { });

(() => {
  const cfg = window.CUADERNO_CONFIG || {};
  if (!window.__fbMock && !(cfg.firebase && cfg.firebase.apiKey)) { S.status = 'noconfig'; S.auth = 'out'; render(); return; }
  const fb = (window.__fbMock || initFb)(cfg.firebase, writeErr);
  S.fb = fb; S.db = fb.db; S.downloads = { save: descargar };
  const owners = (cfg.administradores || []).map(x => String(x).toLowerCase());
  let unsubMe = null;
  fb.auth.onChange(u => {
    if (unsubMe) { unsubMe(); unsubMe = null; }
    stopSubs();
    if (!u) { S.auth = 'out'; S.email = null; S.uid = null; S.rol = null; render(); return; }
    S.auth = 'in'; S.email = u.email; S.uid = u.email; if (u.name) S.names[u.email] = u.name;
    if (owners.includes(u.email)) { S.rol = 'admin'; arrancar(); return; }
    S.rol = null; render();
    unsubMe = S.db.doc('miembros/' + u.email).onSnapshot(s => {
      const m = s.exists ? s.data() : null;
      const rol = m && ROLES[m.rol] ? m.rol : 'none', finca = (m && m.finca) || '';
      if (m && m.nombre) S.names[u.email] = m.nombre;
      if (rol !== S.rol || finca !== S.miFinca) { S.rol = rol; S.miFinca = finca; if (rol !== 'none') arrancar(); else { stopSubs(); render(); } }
    }, () => { S.rol = 'none'; render(); });
  });
  render();
})();
