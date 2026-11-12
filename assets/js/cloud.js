(function () {
  const C = window.DU_FIREBASE || {};
  const on = !!(C.apiKey && C.projectId);
  window.DU = window.DU || {};
  DU.cloud = { on };
  if (!on) return;
  const base = `https://firestore.googleapis.com/v1/projects/${C.projectId}/databases/(default)/documents`;
  const isAdmin = /admin\.html$/.test(location.pathname);
  DU.cloud.base = base;

  const PRIVATE_LISTS = ['users', 'fans', 'orders', 'signups', 'volunteers', 'enquiries', 'subscribersList'];
  const PII = ['email', 'phone', 'dob', 'bday', 'address', 'addr', 'street', 'zip', 'handle', 'signedAs', 'guardian', 'guardianSigned'];
  DU.publicCopy = (d) => {
    const c = JSON.parse(JSON.stringify(d));
    PRIVATE_LISTS.forEach((k) => { if (Array.isArray(c[k])) c[k] = []; });
    ['founders', 'fanclub', 'questions', 'donations'].forEach((k) => (c[k] || []).forEach((x) => PII.forEach((p) => { delete x[p]; })));
    (c.people || []).forEach((x) => { delete x.phone; });
    delete c.teamText;
    return c;
  };

  const orig = DU.store.addPublic.bind(DU.store);
  DU.store.addPublic = function (coll, item, mutate) {
    orig(coll, item, mutate);
    if (isAdmin || !coll || !item) return;
    const body = { fields: { coll: { stringValue: String(coll) }, item: { stringValue: JSON.stringify(item).slice(0, 19000) }, at: { stringValue: new Date().toISOString() }, page: { stringValue: location.pathname.split('/').pop() || 'index.html' } } };
    fetch(`${base}/inbox?key=${C.apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(() => {});
  };
  if (isAdmin) return;

  const html = document.documentElement;
  let cachedAt = null; try { cachedAt = localStorage.getItem('du-cloud-at'); } catch (e) {  }
  if (!cachedAt) html.classList.add('cloud-wait');
  const done = () => html.classList.remove('cloud-wait');
  setTimeout(done, 3000);
  const get = (path) => fetch(`${base}/${path}?key=${C.apiKey}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  Promise.all([get('site/live'), get('upsl/standings')]).then(([live, up]) => {
    if (!live || !live.fields || !live.fields.data) { done(); return; }
    const upAt = up && up.fields && up.fields.at ? up.fields.at.stringValue : '';
    const at = `${live.fields.at ? live.fields.at.stringValue : ''}|${upAt}`;
    if (at === cachedAt) { done(); return; }
    let d; try { d = JSON.parse(live.fields.data.stringValue); } catch (e) { done(); return; }
    try {
      const rows = up && up.fields && up.fields.ok && up.fields.ok.booleanValue && up.fields.rows ? JSON.parse(up.fields.rows.stringValue) : null;
      if (rows && rows.length > 1 && (d.features || {}).autoStandings && d.table && d.table.league) {
        const me = String((d.settings || {}).clubName || 'Dallas United').toLowerCase().replace(/\s*fc$/, '');
        d.table.league.rows = rows.map((r, i) => ({ id: `u${i}`, name: r.team, p: r.p, w: r.w, d: r.d, l: r.l, gf: r.gf, ga: r.ga, pts: r.pts, form: '', us: r.team.toLowerCase().includes(me) }));
        d.table.league.updated = upAt;
      }
    } catch (e) {  }
    try { localStorage.setItem('du-live-v1', JSON.stringify(d)); localStorage.setItem('du-cloud-at', at); } catch (e) { done(); return; }
    let again = null; try { again = sessionStorage.getItem('du-cloud-reload'); sessionStorage.setItem('du-cloud-reload', at); } catch (e) {  }
    if (again !== at) location.reload(); else done();
  });
}());
