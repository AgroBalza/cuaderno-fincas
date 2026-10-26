// Firebase adapter: exposes the small db/auth surface the app uses.
// Writes never block: Firestore applies them to the local cache at once and
// syncs when there is signal, so a save works the same in the field.
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
  collection, doc, query, where, orderBy, limit, onSnapshot, setDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut, updateProfile,
} from 'firebase/auth';

export function initFb(config, onWriteError, onPending) {
  const app = initializeApp(config);
  let fs;
  try { fs = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch (e) { console.warn('sin caché local', e); fs = initializeFirestore(app, {}); }
  const auth = getAuth(app);
  auth.languageCode = 'es';

  const bg = p => { p.catch(e => onWriteError && onWriteError(e)); return Promise.resolve(); };
  // Count documents saved on the phone but not yet confirmed by the server, across every open listener.
  // Listeners include metadata changes so the count drops as soon as an upload lands.
  const pend = new Map(); let lid = 0;
  const emit = () => onPending && onPending([...pend.values()].reduce((a, b) => a + b, 0));
  const listen = (ref, mk, next, err) => {
    const id = ++lid;
    const u = onSnapshot(ref, { includeMetadataChanges: true }, s => {
      const n = s.docs ? s.docs.filter(d => d.metadata.hasPendingWrites).length : (s.metadata.hasPendingWrites ? 1 : 0);
      if ((pend.get(id) || 0) !== n) { pend.set(id, n); emit(); }
      next(mk(s));
    }, err);
    return () => { u(); if (pend.delete(id)) emit(); };
  };
  const wrap = s => ({ docs: s.docs.map(d => ({ id: d.id, data: () => d.data() })), size: s.size, empty: s.empty, fromCache: s.metadata.fromCache });

  function Q(path, cons = []) {
    return {
      where: (f, op, v) => Q(path, [...cons, where(f, op, v)]),
      orderBy: (f, d) => Q(path, [...cons, orderBy(f, d)]),
      limit: n => Q(path, [...cons, limit(n)]),
      onSnapshot: (next, err) => listen(query(collection(fs, path), ...cons), wrap, next, err),
      add: async d => { const r = doc(collection(fs, path)); bg(setDoc(r, d)); return { id: r.id }; },
      doc: id => D(id ? `${path}/${id}` : doc(collection(fs, path)).path),
    };
  }
  function D(path) {
    const r = doc(fs, path);
    return {
      id: r.id,
      set: d => bg(setDoc(r, d)),
      update: d => bg(updateDoc(r, d)),
      delete: () => bg(deleteDoc(r)),
      onSnapshot: (next, err) => listen(r, s => ({ id: s.id, exists: s.exists(), data: () => s.data() }), next, err),
    };
  }
  return {
    db: { collection: p => Q(p), doc: D },
    auth: {
      onChange: cb => onAuthStateChanged(auth, u => cb(u ? { email: (u.email || '').toLowerCase(), name: u.displayName || '' } : null)),
      login: (e, p) => signInWithEmailAndPassword(auth, e, p),
      register: async (e, p, name) => { const c = await createUserWithEmailAndPassword(auth, e, p); if (name) try { await updateProfile(c.user, { displayName: name }); } catch { } return c; },
      reset: e => sendPasswordResetEmail(auth, e),
      logout: () => signOut(auth),
    },
  };
}
