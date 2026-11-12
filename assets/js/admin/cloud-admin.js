const C = window.DU_FIREBASE || {};
if (C.apiKey && C.projectId) start();

async function start() {
  const V = '10.12.2';
  const [{ initializeApp }, AU, FS, ST, FN] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-storage.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-functions.js`)
  ]);
  const app = initializeApp(C);
  const auth = AU.getAuth(app); const db = FS.getFirestore(app); const st = ST.getStorage(app);
  const staffSave = FN.httpsCallable(FN.getFunctions(app), 'staffSave');
  let boss = false;
  const root = document.getElementById('admin');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  DU.cloud.signOut = () => AU.signOut(auth).then(() => { try { localStorage.removeItem('du-admin'); } catch (e) {  } location.reload(); });

  function login(msg) {
    root.innerHTML = DU.adminLogin({ attr: 'data-cl', msg, forgot: true, social: true, text: 'Sign in with the email and password the club set up for you, or with the Google or Apple account that uses your staff email.' });
    DU.bindShow(root);
    root.querySelectorAll('[data-asoc]').forEach((b) => b.addEventListener('click', () => { const pv = b.dataset.asoc === 'apple' ? new AU.OAuthProvider('apple.com') : new AU.GoogleAuthProvider(); AU.signInWithPopup(auth, pv).catch(() => DU.toast('That sign-in did not work. Use your staff email and password.')); }));
    const f = root.querySelector('[data-cl]');
    f.addEventListener('submit', (e) => { e.preventDefault(); AU.signInWithEmailAndPassword(auth, f.email.value.trim(), f.pw.value).catch(() => DU.toast('That email and password don’t match.')); });
    root.querySelector('[data-forgot]').addEventListener('click', () => { const em = f.email.value.trim(); if (!em) { DU.toast('Type your email first'); return; } AU.sendPasswordResetEmail(auth, em).then(() => DU.toast('Check your email for a reset link')).catch(() => DU.toast('Could not send the email')); });
  }

  const read = async (path) => { const s = await FS.getDoc(FS.doc(db, ...path.split('/'))); return s.exists() ? s.data() : null; };
  const put = (path, data, at) => (boss ? FS.setDoc(FS.doc(db, ...path.split('/')), { data: JSON.stringify(data), at }) : staffSave({ path, data: JSON.stringify(data) }));
  const tooBig = (d) => JSON.stringify(d).length > 950000;

  function merge(d, coll, item) {
    if (coll === 'founders:update') { const f = (d.founders || []).find((x) => x.id === item.id); if (f) Object.assign(f, item); return; }
    if (coll === 'subscribersList') { d.subscribersList = d.subscribersList || []; if (!d.subscribersList.some((x) => x.email === item.email)) { d.subscribersList.unshift(item); d.subscribers = (d.subscribers || 0) + 1; } return; }
    d[coll] = Array.isArray(d[coll]) ? d[coll] : [];
    if (item.id && d[coll].some((x) => x.id === item.id)) return;
    d[coll].unshift(item);
    if (coll === 'signups') { const s = (d.sessions || []).find((x) => x.id === item.session); if (s) s.signed = (s.signed || 0) + 1; }
  }

  async function open(user) {
    root.innerHTML = '<div class="ad-login"><p class="text">Loading the club’s data…</p></div>';
    const email = String(user.email || '').toLowerCase();
    const staff = await read(`admins/${email}`).catch(() => null);
    if (!staff) { login(`${email} is not on the club’s staff list yet. An owner must add it in Firebase (Firestore → admins).`); AU.signOut(auth); return; }
    boss = ['owner', 'admin'].includes(String(staff.role || '').toLowerCase());
    const P = await read('private/data').catch(() => null);
    const Dr = await read('private/draft').catch(() => null);
    let live = P ? JSON.parse(P.data) : DU.store.live();
    let draft = Dr ? JSON.parse(Dr.data) : JSON.parse(JSON.stringify(live));
    const box = await FS.getDocs(FS.collection(db, 'inbox')).catch(() => null);
    const ids = [];
    if (box) box.forEach((s) => { const x = s.data(); try { const it = JSON.parse(x.item); merge(live, x.coll, it); merge(draft, x.coll, it); ids.push(s.id); } catch (e) {  } });
    live.users = live.users || [];
    if (!live.users.some((u) => String(u.email).toLowerCase() === email)) { const ALL = ['live', 'news', 'matches', 'table', 'players', 'home', 'shop', 'tryouts', 'dutv', 'partners', 'media', 'settings', 'fans']; const u = { id: `u${Date.now().toString(36)}`, name: user.displayName || email.split('@')[0], email, role: P ? 'Match reporter' : 'Owner', code: '', perms: P ? ['live', 'news', 'matches'] : ALL }; live.users.push(u); draft.users = [...(draft.users || []), u]; }
    const at = new Date().toISOString();
    if (!P || ids.length) { await put('private/data', live, at); await put('private/draft', draft, at); if (!P) await put('site/live', DU.publicCopy(live), at); }
    await Promise.all(ids.map((id) => FS.deleteDoc(FS.doc(db, 'inbox', id)).catch(() => {})));
    DU.store.load(live, draft);
    const me = live.users.find((u) => String(u.email).toLowerCase() === email);
    try { localStorage.setItem('du-admin', me.id); } catch (e) {  }
    hook();
    DU.admin.start();
    if (ids.length) DU.toast(`${ids.length} new from the website added (sign-ups, orders, messages)`);
  }

  function hook() {
    const S = DU.store;
    const pub = S.publish.bind(S);
    S.publish = function () {
      const r = pub(); const L = S.live(); const at = new Date().toISOString();
      if (tooBig(L)) { DU.toast('Too much data to publish. Remove old pictures stored inside the data first.'); return r; }
      Promise.all([put('private/data', L, at), put('private/draft', S.draft(), at), put('site/live', DU.publicCopy(L), at)])
        .then(() => DU.toast('Live on the website for everyone')).catch((e) => DU.toast(`Not saved to the cloud: ${e.code || e.message}`));
      return r;
    };
    let t = null;
    const sd = S.saveDraft.bind(S);
    S.saveDraft = function (d) { const r = sd(d); clearTimeout(t); t = setTimeout(() => put('private/draft', S.draft(), new Date().toISOString()).catch(() => DU.toast('Draft not saved to the cloud')), 1500); return r; };
    const ap = S.addPublic.bind(S);
    S.addPublic = function (coll, item, mutate) { const r = ap(coll, item, mutate); const at = new Date().toISOString(); put('private/data', S.live(), at).then(() => put('site/live', DU.publicCopy(S.live()), at)).catch(() => DU.toast('Not saved to the cloud')); return r; };
    const A = DU.admin; const ri = A.readImage;
    A.readImage = (file, cb) => {
      if (/^video\//.test(file.type || '')) {
        const vref = ST.ref(st, `video/${Date.now().toString(36)}-${String(file.name || 'video').replace(/[^\w.-]+/g, '-').slice(-60)}`);
        DU.toast('Uploading video…');
        ST.uploadBytes(vref, file, { contentType: file.type }).then(() => ST.getDownloadURL(vref)).then((url) => cb(url, file.name)).catch(() => DU.toast('Video storage isn’t switched on yet (it needs the Blaze plan). For now use “Paste a link” with a video link.'));
        return;
      }
      return ri(file, (dataUrl, name) => {
      const ref = ST.ref(st, `img/${Date.now().toString(36)}-${String(file.name || 'picture').replace(/[^\w.-]+/g, '-').slice(-60)}`);
      DU.toast('Uploading picture…');
      ST.uploadString(ref, dataUrl, 'data_url').then(() => ST.getDownloadURL(ref)).then((url) => cb(url, name)).catch(() => {
        if (dataUrl.length > 250000) { DU.toast('Picture storage isn’t switched on yet. Use a smaller picture (under about 180 KB) or a picture link.'); return; }
        DU.toast('Saved inside the website data (picture storage is not switched on yet)'); cb(dataUrl, name);
      });
    });
    };
  }

  AU.onAuthStateChanged(auth, (user) => { if (user) open(user).catch((e) => login(`Could not load the club’s data (${e.code || e.message}).`)); else login(); });
}
