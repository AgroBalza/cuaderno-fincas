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

export function initFb(config, onWriteError) {
  const app = initializeApp(config);
  let fs;
  try { fs = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch (e) { console.warn('sin caché local', e); fs = initializeFirestore(app, {}); }
  const auth = getAuth(app);
  auth.languageCode = 'es';

  const bg = p => { p.catch(e => onWriteError && onWriteError(e)); return Promise.resolve(); };
  const wrap = s => ({ docs: s.docs.map(d => ({ id: d.id, data: () => d.data() })), size: s.size, empty: s.empty, fromCache: s.metadata.fromCache });

  function Q(path, cons = []) {
    return {
      where: (f, op, v) => Q(path, [...cons, where(f, op, v)]),
      orderBy: (f, d) => Q(path, [...cons, orderBy(f, d)]),
      limit: n => Q(path, [...cons, limit(n)]),
      onSnapshot: (next, err) => onSnapshot(query(collection(fs, path), ...cons), s => next(wrap(s)), err),
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
      onSnapshot: (next, err) => onSnapshot(r, s => next({ id: s.id, exists: s.exists(), data: () => s.data() }), err),
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
