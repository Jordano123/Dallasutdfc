window.DU = window.DU || {};
(function () {
  const esc = DU.esc;
  const A = DU.admin = {};
  let D = DU.store.draft();
  let lastSecSaved = 'dash'; try { lastSecSaved = localStorage.getItem('du-admin-sec') || 'dash'; } catch (e) {  }
  const S = A.state = { sec: lastSecSaved, lang: 'EN', open: null, picker: null, viewAs: null, sideOpen: false };
  const hist = A.hist = [];
  let changes = 0;
  A.D = () => D;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  A.uid = (p) => DU.store.uid(p);
  A.today = () => new Date().toISOString().slice(0, 10);

  A.ALLP = [['live', 'Live match mode'], ['news', 'News, email & social'], ['matches', 'Matches & checklist'], ['table', 'Standings'], ['players', 'Players, cards & availability'], ['home', 'Homepage'], ['shop', 'Shop'], ['tryouts', 'Tryouts'], ['dutv', 'DU TV'], ['partners', 'Partners'], ['media', 'Media, pictures & QR codes'], ['fans', 'Founders, volunteers & messages'], ['settings', 'Settings']];
  A.PRESET = { Owner: A.ALLP.map((p) => p[0]), Admin: A.ALLP.map((p) => p[0]).filter((k) => k !== 'settings'), Editor: ['news', 'home', 'dutv', 'media'], 'Match reporter': ['live', 'news', 'matches'], 'Shop manager': ['shop', 'media'], Media: ['media', 'dutv'], Coach: ['players', 'live', 'matches'], Custom: [] };
  A.session = () => { try { return localStorage.getItem('du-admin'); } catch (e) { return null; } };
  A.me = () => D.users.find((u) => u.id === A.session()) || null;
  A.viewer = () => { const me = A.me(); if (me && me.role === 'Owner' && S.viewAs) return D.users.find((u) => u.id === S.viewAs) || me; return me; };
  A.isBoss = () => { const v = A.viewer(); return v && (v.role === 'Owner' || v.role === 'Admin'); };
  A.can = (p) => { const v = A.viewer(); if (!v) return false; if (v.role === 'Owner') return true; if (p === 'boss') return v.role === 'Admin'; return (v.perms || []).includes(p); };

  A.SECS = [
    ['Overview', [['dash', 'Dashboard', 'Everything at a glance, and shortcuts to add things', null, 'index'], ['stats', 'Club numbers', 'Founders, sign-ups, orders and supporters in one place', 'boss', 'index']]],
    ['Match day', [['live', 'Live match mode', 'Use this on your phone at the stadium during games', 'live', 'match-centre'], ['matches', 'Matches & scores', 'Every fixture and result: add games, change scores, stream and replay links', ['matches', 'live'], 'matches'], ['lineups', 'Line-ups', 'Starting XI, substitutes and coach for each match', ['live', 'players'], 'match-centre'], ['reports', 'League reports', 'Team sheet (Starting XI), squad list and results to print or send to the league', ['matches', 'players', 'live'], 'match-centre'], ['table', 'Standings', 'Club names, numbers and form for each table', 'table', 'matches'], ['checklist', 'Matchday checklist', 'Everything to get ready before, during and after each game', 'matches', 'matches'], ['avail', 'Player availability', 'Who can play this week', 'players', 'team'], ['graphics', 'Matchday graphics', 'Starting XI, score and result pictures for social media', ['news', 'live'], 'index'], ['calendar', 'Staff calendar', 'Training, meetings and matches for the staff', 'matches', 'index']]],
    ['Website pages', [['home', 'Homepage', 'Top stories, matches, video, Instagram, kit, 214 and Founders banners', 'home', 'index'], ['news', 'News', 'Write, translate, schedule and publish stories', 'news', 'news'], ['players', 'Team: players & staff', 'Photos, numbers, bios, stats and birthdays', 'players', 'team'], ['cards', 'Player & staff cards', 'The Apple / Google Wallet card for each player and staff member', 'players', 'team'], ['dutv', 'DU TV', 'Videos, thumbnails, categories and pass prices', 'dutv', 'dutv'], ['story', 'Our story', 'Top picture, story, crest, crest details, colors and gallery', 'home', 'story'], ['tryouts', 'Tryouts', 'Sessions, page text and sign-ups', 'tryouts', 'tryouts'], ['shop', 'Shop & orders', 'Slides, categories, products, prices, pre-orders and pickups', 'shop', 'shop'], ['partners', 'Partners', 'Partner logos, packages and enquiries', 'partners', 'partners'], ['contact', 'Contact page', 'Email, Instagram and the most asked questions', 'home', 'contact']]],
    ['Fans', [['founders', 'Founders', 'Everyone on the Founders wall', 'fans', 'founders'], ['fanclub', '214 Club members', 'Fans who joined the supporters club', 'fans', '214-club'], ['fans', 'Fan accounts', 'Fans who signed up, and “see the site as a fan”', 'fans', 'account'], ['volunteers', 'Volunteers', 'Roles and the people who signed up', 'fans', 'volunteer'], ['donations', 'Donations', 'Monthly and one-time supporters', 'boss', 'support'], ['birthdays', 'Birthdays', 'Automatic birthday wishes', ['fans', 'players'], 'index'], ['auto', 'Automatic messages', 'Welcome emails, anniversaries, milestones, thank-yous, On this day', 'fans', 'index'], ['email', 'Email newsletter', 'The weekly club email', 'news', 'index'], ['social', 'Social posting', 'Club accounts and automatic posts', 'news', 'news']]],
    ['Whole website', [['switches', 'Website switches & launch', 'Turn pages and sections on or off, and choose what is hidden or “Soon” at launch', 'settings', 'index'], ['texts', 'Website text', 'Change any text on any page', 'home', 'index'], ['pics', 'Website pictures & icons', 'Change any picture, the crest and the social icons', ['home', 'media'], 'index'], ['media', 'Media library', 'Every picture and video used on the site', 'media', 'index'], ['look', 'Colors & Christmas', 'Club colors and one-click Christmas mode', 'settings', 'index'], ['qr', 'QR codes', 'Codes to print for the stadium and flyers', 'media', 'index']]],
    ['Club', [['access', 'Team & access', 'Who can sign in and what they can change', 'boss', 'index'], ['history', 'History & undo', 'Every change this session, and a way back', 'boss', 'index'], ['settings', 'Settings', 'Club details, league and links', 'settings', 'index']]]
  ];
  A.secInfo = (k) => { for (const [, list] of A.SECS) for (const s of list) if (s[0] === k) return s; return A.SECS[0][1][0]; };
  A.allowed = (k) => { const p = A.secInfo(k)[3]; if (!p) return true; if (p === 'boss') return A.isBoss(); return (Array.isArray(p) ? p : [p]).some((x) => A.can(x)); };

  A.commit = (desc, mutate, key) => {
    const top = hist[0];
    if (!(key && top && top.key === key)) { hist.unshift({ desc, who: (A.viewer() || {}).name || '', when: new Date(), key, prev: JSON.stringify(D) }); if (hist.length > 30) hist.pop(); changes += 1; }
    mutate(D);
    DU.store.saveDraft(D);
    A.topbar();
  };
  A.undo = (i) => { const h = hist[i]; D = JSON.parse(h.prev); hist.splice(0, i + 1); DU.store.saveDraft(D); changes += 1; A.render(); DU.toast(`Undone: ${h.desc}`); };
  A.liveSave = (mutate) => { DU.store.addPublic(null, null, mutate); D = DU.store.draft(); };

  A.tv = (v) => (v && typeof v === 'object' ? (v[S.lang] || '') : (v == null ? '' : v));
  A.en = (v) => (v && typeof v === 'object' ? (v.EN || '') : (v == null ? '' : String(v)));

  A.BUILTIN = ['stadium-night', 'matchday-stadium', 'training', 'celebrate', 'fans', 'community', 'tactics', 'shop-hero', 'kit-home-full', 'home-jersey', 'away-jersey', 'third-jersey', 'gk-jersey', 'kids-home', 'training-top', 'training-tee', 'hoodie', 'scarf', 'cap', 'beanie', 'mug', 'tote', 'bottle', 'flag', 'phone-case', 'pin-sticker', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 's1', 's2'].map((n) => `assets/img/${n}.jpg`);
  A.media = () => [...(D.media || []).map((m) => m.src), ...A.BUILTIN];
  const localOK = () => !(DU.cloud && DU.cloud.on) && DU.localImg && DU.localImg.ready();
  A.readImage = (file, cb) => {
    if (/^video\//.test(file.type || '')) {
      if (localOK()) { DU.localImg.put(file).then((u) => cb(u, file.name)).catch(() => DU.toast('Could not keep that video in the browser.')); return; }
      if (file.size > 3.5e6) { DU.toast('That video is too big to keep in the browser. In the live site videos go to Firebase storage, or paste a video link.'); return; }
      const rv = new FileReader(); rv.onload = () => cb(rv.result, file.name); rv.readAsDataURL(file); return;
    }
    const cb0 = cb;
    cb = (src, name) => { if (localOK() && /^data:/.test(src)) DU.localImg.put(src).then((u) => cb0(u, name)).catch(() => cb0(src, name)); else cb0(src, name); };
    const r = new FileReader();
    r.onload = () => { const img = new Image(); img.onload = () => { const max = /png|webp|gif/i.test(file.type || '') ? 1800 : 2400; const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); cb(/png|webp|gif/i.test(file.type || '') ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86), file.name); }; img.src = r.result; };
    r.readAsDataURL(file);
  };

  A.download = (name, text, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/csv;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  A.csv = (name, rows) => { const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`; A.download(name, rows.map((r) => r.map(q).join(',')).join('\r\n')); DU.toast(`${name} downloaded`); };

  A.field = (coll, id, it, f) => {
    const [key, label, type, wide, tr, opts, onText, hint] = f;
    const raw = it[key];
    const v = tr ? A.tv(raw) : (raw == null ? '' : raw);
    const path = `${coll}|${id}|${key}|${tr ? 1 : 0}|${type}`;
    const ph = tr && S.lang !== 'EN' ? A.en(raw) : '';
    const tag = tr ? `<span class="lang-tag">${S.lang}</span>` : '';
    const cls = `f${wide ? ' wide' : ''}`;
    const hn = hint ? `<span class="hint">${esc(hint)}</span>` : '';
    if (type === 'toggle') return `<div class="${cls}">${esc(label)}<label class="tog"><input type="checkbox" data-path="${path}" ${raw ? 'checked' : ''}> ${esc(onText || 'On')}</label>${hn}</div>`;
    if (type === 'area') return `<label class="${cls}"><span>${esc(label)}${tag}</span><textarea data-path="${path}" placeholder="${esc(ph)}">${esc(v)}</textarea>${hn}</label>`;
    if (type === 'select') return `<label class="${cls}">${esc(label)}<select data-path="${path}">${opts.map((o) => { const [val, lab] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(val)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(lab)}</option>`; }).join('')}</select>${hn}</label>`;
    if (type === 'gallery') {
      const arr = Array.isArray(raw) ? raw : []; const pk = `${coll}|${id}|${key}|g`; const open = S.picker === pk;
      return `<div class="${cls} wide">${esc(label)}<div class="gal-edit">${arr.map((src, k) => `<div class="gal-it">${DU.isVideo(src) ? `<video src="${esc(src)}" muted playsinline></video>` : `<img src="${esc(src)}" alt="">`}<span class="gal-n">${k + 1}</span><div class="gal-acts"><button type="button" class="mini" data-act="galmove" data-k="${path}|${k}|-1" aria-label="Move left" ${k === 0 ? 'disabled' : ''}>${DU.lu('chevron-left')}</button><button type="button" class="mini" data-act="galmove" data-k="${path}|${k}|1" aria-label="Move right" ${k === arr.length - 1 ? 'disabled' : ''}>${DU.lu('chevron-right')}</button><button type="button" class="mini red" data-act="galdel" data-k="${path}|${k}" aria-label="Remove">${DU.lu('x')}</button></div></div>`).join('')}
        <label class="gal-add">${DU.lu('plus')}<span>Add pictures</span><input type="file" accept="image/*,video/mp4,video/webm" multiple data-galup="${path}" style="position:absolute;left:-9999px"></label>
        <button type="button" class="gal-add" data-act="picker" data-k="${pk}">${DU.lu('image')}<span>From library</span></button></div>
        ${open ? `<div class="media-grid">${A.media().map((m) => `<button type="button" data-act="galpick" data-k="${path}" data-src="${esc(m)}" aria-label="Add this"> ${DU.isVideo(m) ? `<video src="${esc(m)}" muted playsinline></video>` : `<img src="${esc(m)}" alt="" loading="lazy">`}</button>`).join('')}</div>` : ''}${hn}</div>`;
    }
    if (type === 'image') {
      const pk = `${coll}|${id}|${key}`; const open = S.picker === pk;
      return `<div class="${cls}">${esc(label)}<div class="row" style="--gap:10px">${DU.isVideo(v) ? `<video src="${esc(v)}" muted playsinline style="width:76px;height:56px;object-fit:cover;border-radius:6px;background:#EEF1F6"></video>` : `<img src="${esc(v)}" alt="" style="width:76px;height:56px;object-fit:cover;border-radius:6px;background:#EEF1F6">`}<button type="button" class="mini" data-act="picker" data-k="${pk}">Choose from library</button><label class="mini" style="display:inline-flex;align-items:center;cursor:pointer">Upload picture or video<input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" data-upload="${path}" style="position:absolute;left:-9999px"></label><button type="button" class="mini" data-act="linkimg" data-k="${path}">Paste a link</button>${v ? `<button type="button" class="mini" data-act="clearimg" data-k="${path}">Remove</button>` : ''}</div>
        ${open ? `<div class="media-grid">${A.media().map((m) => `<button type="button" class="${m === v ? 'on' : ''}" data-act="pickimg" data-k="${path}" data-src="${esc(m)}" aria-label="Use this"> ${DU.isVideo(m) ? `<video src="${esc(m)}" muted playsinline></video>` : `<img src="${esc(m)}" alt="" loading="lazy">`}</button>`).join('')}</div>` : ''}${hn}</div>`;
    }
    if (type === 'code') return `<div class="${cls}">${esc(label)}<div class="row" style="--gap:8px;flex-wrap:nowrap"><span style="flex:1;font-family:ui-monospace,monospace;font-weight:800;letter-spacing:.3em;background:#EEF1F6;border-radius:8px;padding:10px;min-height:42px">${esc(v)}</span><button type="button" class="mini" data-act="newcode" data-k="${path}">New code</button></div></div>`;
    if (type === 'perms') return `<div class="${cls}">${esc(label)}<div class="grid-fit" style="--min:220px;--gap:4px">${A.ALLP.map(([k, l]) => `<label class="tog" style="min-height:34px"><input type="checkbox" data-perm="${coll}|${id}|${k}" ${(raw || []).includes(k) ? 'checked' : ''}> ${esc(l)}</label>`).join('')}</div></div>`;
    const it2 = { text: 'text', number: 'number', color: 'color', date: 'date', datetime: 'datetime-local', time: 'time', url: 'url' }[type] || 'text';
    return `<label class="${cls}"><span>${esc(label)}${tag}</span><input type="${it2}" data-path="${path}" value="${esc(v)}" placeholder="${esc(ph)}">${hn}</label>`;
  };

  A.list = (coll, cfg, title, desc, extra) => {
    const key = cfg.key || coll; cfg.coll = coll;
    const list = (D[coll] || []).filter((it) => (cfg.filter ? cfg.filter(it) : true));
    const items = list.map((it, i) => {
      const open = S.open === `${coll}|${it.id}`;
      return `<div class="item"><div class="item-row ${open ? 'is-open' : ''}">${cfg.thumb && it[cfg.thumb] ? `<img src="${esc(it[cfg.thumb])}" alt="">` : ''}<div class="meta"><strong>${esc(cfg.head(it) || `New ${cfg.noun}`)}</strong><span>${esc(cfg.sub ? cfg.sub(it) : '')}</span></div>
        <div class="row" style="--gap:4px;flex-wrap:nowrap">${cfg.noSort ? '' : `<button type="button" class="mini" data-act="up" data-coll="${coll}" data-cfg="${key}" data-id="${esc(it.id)}" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" class="mini" data-act="down" data-coll="${coll}" data-cfg="${key}" data-id="${esc(it.id)}" aria-label="Move down" ${i === list.length - 1 ? 'disabled' : ''}>↓</button>`}
        <button type="button" class="mini dark" data-act="open" data-coll="${coll}" data-id="${esc(it.id)}" aria-expanded="${open}">${open ? 'Close' : 'Edit'}</button><button type="button" class="mini red" data-act="del" data-coll="${coll}" data-cfg="${key}" data-id="${esc(it.id)}" aria-label="Delete ${esc(cfg.head(it))}">Delete</button></div></div>
        ${open ? `<div class="fields">${cfg.fields.map((f) => A.field(coll, it.id, it, f)).join('')}${extra ? extra(it) : ''}</div>` : ''}</div>`;
    }).join('');
    A.CFG[key] = cfg; if (!cfg.key) A.CFG[coll] = cfg;
    return `<section class="panel"><div class="panel-head"><div><h2>${esc(title)}</h2>${desc ? `<p class="small muted">${esc(desc)}</p>` : ''}</div>${cfg.noAdd ? '' : `<button type="button" class="btn btn-gold btn-sm" data-act="add" data-coll="${coll}" data-cfg="${key}">+ Add ${esc(cfg.noun)}</button>`}</div>${items || `<p class="muted small">Nothing here yet.</p>`}</section>`;
  };
  A.single = (coll, fields, title, desc) => `<section class="panel"><div><h2>${esc(title)}</h2>${desc ? `<p class="small muted">${esc(desc)}</p>` : ''}</div><div class="fields" style="border:none;padding:0">${fields.map((f) => A.field(coll, '_', D[coll], f)).join('')}</div></section>`;
  A.CFG = {};

  function target(coll, id) { return id === '_' ? D[coll] : (D[coll] || []).find((x) => String(x.id) === String(id)); }
  function setPath(path, value, label) {
    const [coll, id, key, tr, type] = path.split('|');
    const it = target(coll, id); if (!it) return;
    let v = value;
    if (type === 'number') v = value === '' ? '' : Number(value);
    A.commit(`Edited ${label || key}`, () => {
      const obj = target(coll, id);
      if (tr === '1') { const cur = obj[key]; const o = cur && typeof cur === 'object' ? { ...cur } : { EN: cur || '' }; o[S.lang] = v; obj[key] = o; }
      else obj[key] = v;
      if (coll === 'users' && key === 'role' && A.PRESET[v]) obj.perms = [...A.PRESET[v]];
    }, `${path}|${S.lang}`);
  }
  A.setPath = setPath;

  const ACT = A.ACT = {
    open: (el) => { const k = `${el.dataset.coll}|${el.dataset.id}`; S.open = S.open === k ? null : k; S.picker = null; A.render(); },
    up: (el) => move(el, -1), down: (el) => move(el, 1),
    del: (el) => { const coll = el.dataset.coll, id = el.dataset.id, cfg = A.CFG[el.dataset.cfg || coll]; const it = target(coll, id); if (!confirmDel(cfg.head(it))) return; A.commit(`Deleted ${cfg.noun}: ${cfg.head(it)}`, () => { D[coll] = D[coll].filter((x) => String(x.id) !== String(id)); }); A.render(); },
    add: (el) => { const coll = el.dataset.coll, cfg = A.CFG[el.dataset.cfg || coll]; const nid = A.uid(coll.slice(0, 2)); A.commit(`Added a ${cfg.noun}`, () => { D[coll] = [cfg.blank(nid), ...(D[coll] || [])]; }); S.open = `${coll}|${nid}`; A.render(); },
    picker: (el) => { S.picker = S.picker === el.dataset.k ? null : el.dataset.k; A.render(); },
    galpick: (el) => { const [coll, id, key] = el.dataset.k.split('|'); const it = target(coll, id); if (!it) return; A.commit('Added a picture', () => { const o = target(coll, id); o[key] = [...(Array.isArray(o[key]) ? o[key] : []), el.dataset.src]; }); A.render(); },
    galdel: (el) => { const parts = el.dataset.k.split('|'); const k = Number(parts.pop()); const [coll, id, key] = parts; A.commit('Removed a picture', () => { const o = target(coll, id); o[key] = (o[key] || []).filter((x, i) => i !== k); }); A.render(); },
    galmove: (el) => { const parts = el.dataset.k.split('|'); const dir = Number(parts.pop()), k = Number(parts.pop()); const [coll, id, key] = parts; A.commit('Moved a picture', () => { const o = target(coll, id); const a = [...(o[key] || [])]; const j = k + dir; if (j < 0 || j >= a.length) return; [a[k], a[j]] = [a[j], a[k]]; o[key] = a; }); A.render(); },
    pickimg: (el) => { A.setPath(el.dataset.k, el.dataset.src, 'picture'); S.picker = null; A.render(); },
    clearimg: (el) => { A.setPath(el.dataset.k, '', 'picture'); A.render(); },
    linkimg: (el) => { const u = prompt('Paste the link of a picture or a video (ending in .jpg, .png, .mp4, .webm…):', ''); if (!u) return; if (!/^https?:\/\/|^assets\//.test(u.trim())) { DU.toast('That doesn’t look like a link.'); return; } A.setPath(el.dataset.k, u.trim(), 'picture'); A.render(); },
    newcode: (el) => { A.setPath(el.dataset.k, String(100000 + Math.floor(Math.random() * 899999)), 'admin code'); A.render(); },
    quick: (el) => { const [sec, coll, cfg] = el.dataset.k.split('|'); S.sec = sec; try { localStorage.setItem('du-admin-sec', sec); } catch (e) {  } S.open = null; A.render(); window.scrollTo(0, 0);
      if (coll) { const c = A.CFG[cfg || coll]; if (c) { const nid = A.uid(coll.slice(0, 2)); A.commit(`Added a ${c.noun}`, () => { D[coll] = [c.blank(nid), ...(D[coll] || [])]; }); S.open = `${coll}|${nid}`; A.render(); } } },
    sec: (el) => { S.sec = el.dataset.k; try { localStorage.setItem('du-admin-sec', S.sec); } catch (e) {  } S.open = null; S.picker = null; S.sideOpen = false; A.render(); window.scrollTo(0, 0); },
    lang: (el) => { S.lang = el.dataset.k; A.render(); },
    undo: (el) => A.undo(Number(el.dataset.k)),
    publish: () => { DU.store.publish(); changes = 0; A.topbar(); DU.toast('Published. Your changes are live on the website.'); },
    preview: () => { const p = A.secInfo(S.sec)[4]; window.open(`${p}.html?preview=1`, '_blank'); },
    side: () => { S.sideOpen = !S.sideOpen; DU.$('.ad-side').classList.toggle('open', S.sideOpen); },
    logout: () => { if (DU.cloud && DU.cloud.on && DU.cloud.signOut) { DU.cloud.signOut(); return; } try { localStorage.removeItem('du-admin'); localStorage.removeItem('du-admin-sec'); } catch (e) {  } location.reload(); }
  };
  function confirmDel(name) { return window.confirm(`Delete “${name}”? You can undo this in History & undo.`); }
  function move(el, dir) { const coll = el.dataset.coll, id = el.dataset.id, cfg = A.CFG[el.dataset.cfg || coll]; const list = D[coll]; const vis = list.map((x, k) => k).filter((k) => (cfg.filter ? cfg.filter(list[k]) : true)); const vi = vis.findIndex((k) => String(list[k].id) === String(id)); if (vi < 0 || vi + dir < 0 || vi + dir >= vis.length) return; const i = vis[vi], j = vis[vi + dir]; A.commit(`Reordered ${cfg.noun}s`, () => { const l = D[coll]; [l[i], l[j]] = [l[j], l[i]]; }); A.render(); }

  function bindRoot(root) {
    root.addEventListener('click', (e) => { const el = e.target.closest('[data-act]'); if (!el || el.disabled) return; const fn = ACT[el.dataset.act]; if (fn) { e.preventDefault(); fn(el, e); } });
    root.addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset.path && el.type !== 'checkbox' && el.tagName !== 'SELECT' && el.type !== 'file') A.setPath(el.dataset.path, el.value);
      if (el.dataset.in && A.IN[el.dataset.in]) A.IN[el.dataset.in](el, e);
    });
    root.addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset.path && (el.type === 'checkbox' || el.tagName === 'SELECT')) { A.setPath(el.dataset.path, el.type === 'checkbox' ? el.checked : el.value); A.render(); }
      else if (el.dataset.path && el.type !== 'file') setTimeout(() => A.render(true), 0);
      if (el.dataset.perm) { const [coll, id, k] = el.dataset.perm.split('|'); A.commit(`Changed access: ${k}`, () => { const u = target(coll, id); u.perms = el.checked ? [...new Set([...(u.perms || []), k])] : (u.perms || []).filter((x) => x !== k); u.role = Object.keys(A.PRESET).find((r) => JSON.stringify([...A.PRESET[r]].sort()) === JSON.stringify([...u.perms].sort())) || 'Custom'; }); A.render(); }
      if (el.dataset.galup) { const [coll, id, key] = el.dataset.galup.split('|'); [...el.files].forEach((f) => A.readImage(f, (src, name) => { A.commit('Uploaded a picture', () => { D.media = [{ id: A.uid('m'), src, name }, ...(D.media || [])]; const o = target(coll, id); if (o) o[key] = [...(Array.isArray(o[key]) ? o[key] : []), src]; }); A.render(); })); }
      if (el.dataset.upload) { const f = el.files[0]; if (!f) return; A.readImage(f, (src, name) => { A.commit(DU.isVideo(src) ? 'Uploaded a video' : 'Uploaded a picture', () => { D.media = [{ id: A.uid('m'), src, name }, ...(D.media || [])]; }); A.setPath(el.dataset.upload, src, 'picture'); A.render(); }); }
      if (el.dataset.ch && A.CH[el.dataset.ch]) A.CH[el.dataset.ch](el, e);
    });
  }
  A.IN = {}; A.CH = {};

  A.topbar = () => {
    const el = DU.$('[data-pub]'); if (!el) return;
    const dirty = DU.store.hasUnpublished();
    el.textContent = dirty ? `Publish (${Math.max(1, changes)})` : 'Published ✓';
    el.className = `btn btn-sm ${dirty ? 'btn-blue' : 'btn-outline'}`;
  };
  let lastSec = null;
  let rendering = false;
  A.render = (keepScroll) => {
    if (rendering) { setTimeout(() => A.render(keepScroll), 0); return; }
    rendering = true;
    try { draw(keepScroll); } finally { rendering = false; }
  };
  function draw(keepScroll) {
    const root = DU.$('#admin');
    const me = A.me();
    if (!me) { loginScreen(root); return; }
    D = DU.store.draft();
    if (!A.allowed(S.sec)) S.sec = 'dash';
    const info = A.secInfo(S.sec), v = A.viewer();
    const y = window.scrollY;
    let body = '';
    try { body = A.SECTIONS[S.sec] ? A.SECTIONS[S.sec]() : '<p>Coming soon.</p>'; } catch (err) { console.error(err); body = `<div class="notice notice-err">Something went wrong in this section: ${esc(err.message)}</div>`; }
    root.innerHTML = `<div class="ad-shell">
      <aside class="ad-side ${S.sideOpen ? 'open' : ''}" aria-label="Admin sections">
        <a class="brand" href="index.html"><img src="${DU.CREST_SMALL}" alt="" style="width:36px"><span class="brand-name"><strong>DALLAS UNITED</strong><span>ADMIN</span></span></a>
        <label class="ad-find"><span class="sr-only">Find a section</span>${DU.lu('search')}<input type="search" placeholder="Find a section…" data-find autocomplete="off"></label>
        <nav class="ad-nav">${A.SECS.map(([g, list]) => { const ok = list.filter((s) => A.allowed(s[0])); return ok.length ? `<span class="grp">${g}</span>${ok.map((s) => `<button type="button" data-act="sec" data-k="${s[0]}" data-words="${esc(`${s[1]} ${s[2]} ${g}`.toLowerCase())}" ${s[0] === S.sec ? 'aria-current="page"' : ''}>${esc(s[1])}${s[0] === 'live' && D.live.running ? '<span class="pill" style="background:var(--red);color:#fff">LIVE</span>' : ''}</button>`).join('')}` : ''; }).join('')}</nav>
        <div class="stack small" style="--gap:10px;margin-top:auto;border-top:1px solid #1E2E4D;padding:14px 8px 0"><span><strong>${esc(v.name)}</strong> · ${esc(v.role)}</span><a class="link" href="index.html" target="_blank">View website ↗</a><button type="button" class="mini" data-act="logout" style="align-self:flex-start;background:transparent;color:#fff;border-color:#3A4A66">Sign out</button></div>
      </aside>
      <main class="ad-main" id="main">
        <div class="ad-top"><div class="row" style="--gap:12px;flex-wrap:nowrap;align-items:flex-start"><button type="button" class="mini dark ad-menu-btn" data-act="side" aria-label="Menu">☰</button><div class="stack" style="--gap:4px"><h1>${esc(info[1])}</h1><span class="small muted">${esc(info[2])}</span></div></div>
          <div class="ad-tools">
            ${me.role === 'Owner' ? `<label class="small bold row" style="--gap:6px">Viewing as<select class="ad-input" style="width:auto;min-height:38px" data-ch="viewAs">${D.users.map((u) => `<option value="${u.id}" ${u.id === v.id ? 'selected' : ''}>${esc(u.name)} (${esc(u.role)})</option>`).join('')}</select></label>` : ''}
            <button type="button" class="btn btn-sm btn-outline" data-act="preview">Preview ↗</button>
            <button type="button" data-act="publish" data-pub></button>
          </div></div>
        ${body}
      </main></div>`;
    A.topbar();
    const find = DU.$('[data-find]');
    if (find) find.addEventListener('input', () => { const q = find.value.trim().toLowerCase(); DU.$$('.ad-nav [data-words]').forEach((b) => { b.hidden = !!q && !q.split(/\s+/).every((w) => b.dataset.words.includes(w)); }); DU.$$('.ad-nav .grp').forEach((g) => { let n = g.nextElementSibling, any = false; while (n && !n.classList.contains('grp')) { if (!n.hidden) any = true; n = n.nextElementSibling; } g.hidden = !any; }); });
    if (find) find.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const b = DU.$$('.ad-nav [data-words]').find((x) => !x.hidden); if (b) b.click(); } });
    if (A.AFTER[S.sec]) A.AFTER[S.sec]();
    if (keepScroll === true || lastSec === S.sec) window.scrollTo(0, y);
    lastSec = S.sec;
  }
  A.AFTER = {};
  A.CH.viewAs = (el) => { S.viewAs = el.value; A.render(); };

  function loginScreen(root) {
    if (DU.cloud && DU.cloud.on) { if (DU.cloud.signOut) DU.cloud.signOut(); return; }
    root.innerHTML = DU.adminLogin({ attr: 'data-login', text: 'Everyone has their own admin code and only sees the parts they’re allowed to change.', codeLabel: 'Your admin code', codeName: 'code', codeAttrs: 'type="password" inputmode="numeric" maxlength="6" autocomplete="current-password"', note: 'Testing on this computer: use alcino@dallasunitedfc.com with code 482913, then change your code in Team &amp; access.' });
    DU.bindShow(root);
    DU.$('[data-login]').addEventListener('submit', (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target));
      const u = D.users.find((x) => x.email.toLowerCase() === String(fd.email).trim().toLowerCase() && x.code === String(fd.code).trim());
      if (!u) { DU.toast('That email and code don’t match. Ask an owner for your code.'); return; }
      try { localStorage.setItem('du-admin', u.id); } catch (e) {  } A.render();
    });
  }

  A.start = () => {
    if (!(DU.cloud && DU.cloud.on) && 'serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(async () => {
        if (!navigator.serviceWorker.controller) { if (!sessionStorage.getItem('du-sw-reload')) { sessionStorage.setItem('du-sw-reload', '1'); location.reload(); } return; }
        try {
          const dr = DU.store.draft(), lv = DU.store.live();
          const n = (await DU.localImg.slim(dr)) + (await DU.localImg.slim(lv));
          if (n) { DU.store.load(lv, dr); DU.toast(`Made room: ${n} pictures moved out of the browser data.`); A.render(); }
        } catch (e) {  }
      }).catch(() => {});
    }
    const root = DU.$('#admin');
    bindRoot(root);
    A.render();
    setInterval(() => { if (S.sec === 'live' && DU.store.live().live.running) { const c = DU.$('[data-clock]'); if (c && A.clockText) c.textContent = A.clockText(); } }, 1000);
    window.addEventListener('beforeunload', (e) => { if (DU.store.hasUnpublished() && changes > 0) { e.preventDefault(); e.returnValue = ''; } });
  };
})();
