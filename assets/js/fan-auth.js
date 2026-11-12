(function () {
  const C = window.DU_FIREBASE || {};
  if (!(DU.cloud && DU.cloud.on) || !DU.on('accounts')) return;
  const V = '10.12.2';
  let ready = null;
  const load = () => ready || (ready = Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]).then(([A, AU, FS]) => { const app = A.getApps().length ? A.getApp() : A.initializeApp(C); return { AU, FS, auth: AU.getAuth(app), db: FS.getFirestore(app) }; }));
  const saveLocal = (u, p) => { const acc = { first: p.first || (u.displayName || '').split(' ')[0] || 'Fan', last: p.last || '', email: u.email, uid: u.uid }; DU.pref.set('account', acc); return acc; };
  const msg = (e) => ({ 'auth/invalid-credential': 'That email and password don’t match.', 'auth/wrong-password': 'That email and password don’t match.', 'auth/user-not-found': 'No account with that email yet. Create one below.', 'auth/email-already-in-use': 'There is already an account with that email. Sign in instead.', 'auth/weak-password': 'Use at least 8 characters for your password.', 'auth/too-many-requests': 'Too many tries. Wait a few minutes and try again.', 'auth/popup-closed-by-user': 'Google sign-in was closed.', 'auth/operation-not-allowed': 'This sign-in option is not switched on yet.' }[e && e.code] || 'Something went wrong. Try again.');
  DU.fanAuth = {
    msg,
    async signIn(email, pw) { const { AU, FS, auth, db } = await load(); const r = await AU.signInWithEmailAndPassword(auth, email, pw); const s = await FS.getDoc(FS.doc(db, 'fans', r.user.uid)).catch(() => null); return saveLocal(r.user, s && s.exists() ? s.data() : {}); },
    async signUp(first, last, email, pw, news, extra) {
      const { AU, FS, auth, db } = await load(); const r = await AU.createUserWithEmailAndPassword(auth, email, pw);
      await AU.updateProfile(r.user, { displayName: `${first} ${last}`.trim() }).catch(() => {});
      const p = { first, last, email, news: !!news, joined: new Date().toISOString().slice(0, 10), ...(extra || {}) };
      await FS.setDoc(FS.doc(db, 'fans', r.user.uid), p).catch(() => {});
      DU.store.addPublic('fans', { id: r.user.uid, phone: '', hood: '', bday: '', size: '', ...p });
      return saveLocal(r.user, p);
    },
    async google(which) {
      const { AU, FS, auth, db } = await load(); const prov = which === 'apple' ? (() => { const x = new AU.OAuthProvider('apple.com'); x.addScope('email'); x.addScope('name'); return x; })() : new AU.GoogleAuthProvider(); const r = await AU.signInWithPopup(auth, prov);
      const ref = FS.doc(db, 'fans', r.user.uid); const s = await FS.getDoc(ref).catch(() => null);
      let p = s && s.exists() ? s.data() : null;
      if (!p) { const [first, ...rest] = (r.user.displayName || '').split(' '); p = { first: first || 'Fan', last: rest.join(' '), email: r.user.email, news: false, joined: new Date().toISOString().slice(0, 10) }; await FS.setDoc(ref, p).catch(() => {}); DU.store.addPublic('fans', { id: r.user.uid, phone: '', hood: '', bday: '', size: '', ...p }); }
      return saveLocal(r.user, p);
    },
    apple() { return DU.fanAuth.google('apple'); },
    async reset(email) { const { AU, auth } = await load(); return AU.sendPasswordResetEmail(auth, email); },
    async signOut() { try { const { AU, auth } = await load(); await AU.signOut(auth); } catch (e) {  } DU.pref.set('account', null); }
  };
}());
