window.DU = window.DU || {};
(function () {
  const tr = DU.tr, t = DU.t;
  DU.$ = (s, r) => (r || document).querySelector(s);
  DU.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  DU.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  DU.isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());
  DU.money = (n) => `$${Number(n || 0).toFixed(2).replace(/\.00$/, '')}`;
  DU.param = (k) => new URLSearchParams(location.search).get(k);
  const D0 = () => DU.store.get();
  DU.LAUNCH_DEFAULT = { shop: 'hide', dutv: 'soon', centre: 'soon', account: 'soon', matches: 'soon', standings: 'hide', matchday: 'hide', strip: 'hide', partners: 'hide' };
  DU.launchPlan = (d) => ({ ...DU.LAUNCH_DEFAULT, ...(((d || D0()).launchPlan) || {}) });
  const LAUNCH_KEYS = { shop: ['shop', 'shopOpen'], dutv: ['dutv'], centre: ['matchCentre'], account: ['accounts'], matches: ['matches'], standings: ['standings'], matchday: ['matchday'], strip: ['strip'], partners: ['partners', 'partnersWall'] };
  const KEY_ITEM = {}; Object.keys(LAUNCH_KEYS).forEach((i) => LAUNCH_KEYS[i].forEach((k) => { KEY_ITEM[k] = i; }));
  DU.on = (k, d) => { const dd = d || D0(); const f = dd.features || {}; if (f.launch === true && KEY_ITEM[k] && DU.launchPlan(dd)[KEY_ITEM[k]] === 'hide') return false; return f[k] !== false; };
  DU.isSoon = (item, d) => { const dd = d || D0(); return (dd.features || {}).launch === true && DU.launchPlan(dd)[item] === 'soon'; };
  DU.launchOn = (d) => (((d || D0()).features) || {}).launch === true;
  DU.LAUNCH_PAGES = { 'dutv.html': 'dutv', 'shop.html': 'shop', 'founders-shop.html': 'shop', 'match-centre.html': 'centre', 'login.html': 'account', 'account.html': 'account', 'matches.html': 'countdown' };
  DU.x = (key, def) => { const v = ((D0().texts) || {})[key]; return v != null && String(v).trim() !== '' ? DU.esc(v) : def; };
  DU.pic = (key, def) => { const v = ((D0().pics) || {})[key]; return v ? v : def; };
  DU.CREST = DU.pic('brand.crest', 'assets/brand/crest.svg');
  DU.CREST_SMALL = DU.pic('brand.crestSmall', 'assets/brand/crest-jersey.svg');
  DU.LEGAL = [['privacy', 'lgPrivacy', 'f.privacy'], ['terms', 'lgTerms', 'f.terms'], ['cookies', 'lgCookies', 'f.cookies'], ['cookieSet', 'lgCookieSet', 'f.cookieSettings'], ['shop', 'lgShipping', 'f.shipping'], ['access', 'lgAccess', 'f.access'], ['staff', 'lgStaff', 'f.staff']];
  DU.legalOn = (tab, d) => { const L = DU.LEGAL.find((x) => x[0] === tab); if (!L) return true; if (!DU.on(L[1], d)) return false; if (tab === 'shop') return DU.on('shop', d) && DU.on('shopOpen', d); return true; };
  DU.legalLis = (d) => DU.LEGAL.filter(([k]) => DU.legalOn(k, d)).map(([k, , key]) => `<li>${k === 'cookieSet' ? `<button type="button" class="as-link" data-cookie-open>${DU.tr(key)}</button>` : k === 'staff' ? `<a href="admin.html">${DU.tr(key)}</a>` : `<a href="legal.html?tab=${k}">${DU.tr(key)}</a>`}</li>`).join('');
  DU.PAGE_FEATURE = { 'shop.html': 'shop', 'founders-shop.html': 'shop', '214-club.html': 'club214', 'tryouts.html': 'tryouts', 'founders.html': 'founders', 'story.html': 'story', 'volunteer.html': 'volunteer', 'support.html': 'support', 'partners.html': 'partners', 'dutv.html': 'dutv', 'news.html': 'news', 'account.html': 'accounts', 'login.html': 'accounts', 'team.html': 'team', 'match-centre.html': 'matchCentre', 'contact.html': 'contact' };
  (function guard() {
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const k = DU.PAGE_FEATURE[page];
    if (k && !DU.on(k) && !DU.store.isPreview) { DU.pageOff = true; location.replace('index.html'); }
  })();
  DU.soonPage = () => {
    const d = D0();
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const kind = DU.LAUNCH_PAGES[page];
    if (!DU.launchOn(d) || !kind || DU.param('asFan')) return false;
    if (DU.launchPlan(d)[kind === 'countdown' ? 'matches' : kind] === 'show') return false;
    const main = DU.$('#main');
    const T = {
      dutv: ['DU TV', DU.x('soon.dutv', 'Highlights, full matches and behind the scenes start with our first season.')],
      shop: ['Official store', DU.x('soon.shop', 'The first Dallas United kit and merch are on the way.')],
      centre: ['Match Centre', DU.x('soon.centre', 'Live scores, line-ups and stats start with our first match.')],
      account: ['My Dallas United', DU.x('soon.account', 'Fan accounts open soon: your founder card, 214 Club card and more, all in one place.')],
      countdown: ['Matches', DU.x('soon.matches', 'The full schedule is posted here as soon as the league announces it.')],
    };
    const [label, text] = T[kind];
    const CD = d.countdownTexts || {};
    const target = CD.date ? DU.dt(CD.date, CD.time || '19:00').getTime() : 0;
    const showCd = kind === 'countdown' && target > Date.now();
    const notify = `<form class="soon-form" novalidate data-soon-form><label class="sr-only" for="soon-email">${DU.x('soon.emailLabel', 'Your email')}</label><input id="soon-email" type="email" autocomplete="email" placeholder="${DU.x('soon.emailLabel', 'Your email')}"><button class="btn btn-gold" type="submit">${DU.x('soon.notify', 'Tell me when it opens')}</button></form><p class="notice notice-ok" hidden data-soon-ok>${DU.x('soon.thanks', 'Thanks! We will email you when it opens.')}</p>`;
    main.innerHTML = `<section class="soon"><div class="container soon-in">
      <img class="soon-crest" src="${DU.CREST}" alt="Dallas United FC crest">
      <span class="eyebrow">${DU.esc(label)}</span>
      ${showCd ? `<h1 class="display soon-h">${DU.esc(DU.t(CD.title) || 'Countdown to kickoff')}</h1><p class="soon-sub">${DU.esc(DU.t(CD.sub) || '')} · ${DU.esc(DU.fmtDay(CD.date))}</p>
      <div class="soon-nums" data-soon-cd><span><b data-d>00</b><i>${DU.x('soon.days', 'Days')}</i></span><span><b data-h>00</b><i>${DU.x('soon.hours', 'Hours')}</i></span><span><b data-m>00</b><i>${DU.x('soon.minutes', 'Minutes')}</i></span><span><b data-s>00</b><i>${DU.x('soon.seconds', 'Seconds')}</i></span></div>`
      : `<h1 class="display soon-h">${DU.x('soon.title', 'Coming soon')}</h1>`}
      <p class="soon-text">${text}</p>
      ${notify}
      <div class="row center" style="--gap:10px;margin-top:6px"><a class="btn btn-outline btn-on-dark" href="index.html">${DU.x('soon.home', 'Back to home')}</a>${DU.on('tryouts', d) ? `<a class="btn btn-ghost" style="color:#fff" href="tryouts.html">${DU.x('soon.tryouts', 'Tryouts')} ${DU.icon('arrow')}</a>` : ''}</div>
    </div></section>`;
    DU.layout({ active: kind === 'countdown' ? 'matches' : kind === 'account' ? '' : kind, v2: true });
    const f = DU.$('[data-soon-form]');
    f.addEventListener('submit', (e) => {
      e.preventDefault(); const em = f.querySelector('input').value.trim();
      if (!DU.isEmail(em)) { DU.toast(DU.tr('c.badEmail')); return; }
      const rec = { email: em, when: new Date().toISOString().slice(0, 10), source: label };
      DU.store.addPublic('subscribersList', rec, (dd) => { dd.subscribers = (dd.subscribers || 0) + 1; dd.subscribersList = [rec, ...(dd.subscribersList || [])]; });
      DU.$('[data-soon-ok]').hidden = false; f.reset();
    });
    if (showCd) {
      const two = (n) => String(Math.max(0, n)).padStart(2, '0');
      const box = DU.$('[data-soon-cd]');
      const tick = () => { let ms = Math.max(0, target - Date.now()); const dd = Math.floor(ms / 864e5); ms -= dd * 864e5; const hh = Math.floor(ms / 36e5); ms -= hh * 36e5; const mi = Math.floor(ms / 6e4); const ss = Math.floor((ms - mi * 6e4) / 1000);
        box.querySelector('[data-d]').textContent = two(dd); box.querySelector('[data-h]').textContent = two(hh); box.querySelector('[data-m]').textContent = two(mi); box.querySelector('[data-s]').textContent = two(ss); };
      tick(); setInterval(tick, 1000);
    }
    return true;
  };
  DU.applyTheme = () => {
    const th = D0().theme || {};
    const root = document.documentElement.style;
    [['navy', '--navy'], ['gold', '--gold'], ['blue', '--blue'], ['cream', '--cream'], ['deep', '--navy-3']].forEach(([k, v]) => { if (th[k]) root.setProperty(v, th[k]); });
    if (th.gold) root.setProperty('--gold-2', th.gold);
    document.documentElement.classList.toggle('xmas', !!th.xmas && !/admin\.html$/.test(location.pathname));
  };
  DU.applyTheme();
  DU.myEmail = () => ((DU.pref.get('account', null) || {}).email || '');

  DU.dt = (date, time) => { const [y, m, d] = String(date).split('-').map(Number); const [hh, mm] = String(time || '00:00').split(':').map(Number); return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0); };
  DU.fmtDay = (date, long) => DU.dt(date).toLocaleDateString(DU.locale(), long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' });
  DU.fmtTime = (time) => DU.dt('2026-01-01', time).toLocaleTimeString(DU.locale(), { hour: 'numeric', minute: '2-digit' });
  DU.fmtDate = (date) => (date ? DU.dt(date).toLocaleDateString(DU.locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  DU.monthKey = (date) => String(date).slice(0, 7);
  DU.monthName = (key) => DU.dt(`${key}-01`).toLocaleDateString(DU.locale(), { month: 'long' });

  DU.sortFx = (list) => [...list].sort((a, b) => DU.dt(a.date, a.time) - DU.dt(b.date, b.time));
  DU.nextFixture = (d) => { const list = DU.sortFx(d.fixtures); const now = Date.now();
    return list.find((f) => f.status === 'Live' || f.status === 'Half-time') || list.find((f) => f.status === 'Upcoming' && DU.dt(f.date, f.time).getTime() > now - 2.5 * 36e5) || list.find((f) => f.status === 'Upcoming'); };
  DU.lastResult = (d) => DU.sortFx(d.fixtures).reverse().find((f) => f.status === 'Full time');
  DU.compName = (c) => (c === 'League' ? tr('c.league') : c === 'Texas Cup' ? tr('c.cup') : c === 'Friendly' ? tr('c.friendly') : c);
  DU.statusName = (s) => ({ 'Full time': tr('c.fullTime'), Live: tr('c.live'), Upcoming: tr('c.upcoming') }[s] || s);
  DU.fresh = () => { try { const raw = localStorage.getItem(DU.store.isPreview ? 'du-draft-v1' : 'du-live-v1'); if (raw) return JSON.parse(raw); } catch (e) {  } return DU.store.get(); };
  DU.LIVE_PERIODS = ['1st half', 'Half-time', '2nd half'];
  DU.liveFor = (d, f) => {
    const L = d.live; if (!f || !L || L.fixtureId !== f.id || !DU.LIVE_PERIODS.includes(L.period)) return null;
    const el = L.base + (L.running ? Date.now() - L.startedAt : 0);
    const minute = Math.max(1, Math.floor(el / 60000) + 1);
    return { L, minute, label: L.period === 'Half-time' ? 'HT' : `${minute}’` };
  };
  DU.timeHTML = (time) => { const t = DU.fmtTime(time); const m = t.match(/^(\d{1,2}[:.h]\d{2})\s*(.*)$/); return m ? `<span class="t-num">${DU.esc(m[1])}</span>${m[2] ? `<span class="t-ampm">${DU.esc(m[2])}</span>` : ''}` : `<span class="t-num">${DU.esc(t)}</span>`; };
  DU.ytEmbed = (url) => {
    const u = String(url || '').trim(); if (!u) return '';
    const m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
    const ch = u.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]+)/);
    return ch ? `https://www.youtube.com/embed/live_stream?channel=${ch[1]}&autoplay=1` : '';
  };
  DU.ytPlayer = (url) => { const src = DU.ytEmbed(url); return src ? `<div class="yt-frame"><iframe src="${DU.esc(src)}" title="Dallas United live stream" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>` : ''; };
  DU.FORMATIONS = { '4-3-3': [4, 3, 3], '4-4-2': [4, 4, 2], '4-2-3-1': [4, 2, 3, 1], '4-1-4-1': [4, 1, 4, 1], '3-5-2': [3, 5, 2], '3-4-3': [3, 4, 3], '5-3-2': [5, 3, 2], '5-4-1': [5, 4, 1] };
  DU.formationPos = (shape) => {
    const pos = [[50, 89]]; const n = shape.length;
    const gap = { 1: 0, 2: 30, 3: 25, 4: 22, 5: 17 };
    shape.forEach((cnt, li) => { const y = Math.round(70 - li * (52 / Math.max(1, n - 1))); for (let k = 0; k < cnt; k++) pos.push([Math.round(50 + (k - (cnt - 1) / 2) * (gap[cnt] || 16)), y]); });
    return pos;
  };

  const ISO = { usa: 'us', 'united states': 'us', 'united states of america': 'us', us: 'us', america: 'us', mexico: 'mx', canada: 'ca', brazil: 'br', argentina: 'ar', colombia: 'co', venezuela: 've', peru: 'pe', chile: 'cl', ecuador: 'ec', uruguay: 'uy', paraguay: 'py', bolivia: 'bo', 'el salvador': 'sv', honduras: 'hn', guatemala: 'gt', nicaragua: 'ni', 'costa rica': 'cr', panama: 'pa', jamaica: 'jm', haiti: 'ht', cuba: 'cu', 'dominican republic': 'do', 'puerto rico': 'pr', 'trinidad and tobago': 'tt', england: 'gb-eng', scotland: 'gb-sct', wales: 'gb-wls', 'northern ireland': 'gb-nir', 'united kingdom': 'gb', uk: 'gb', ireland: 'ie', france: 'fr', spain: 'es', portugal: 'pt', germany: 'de', italy: 'it', netherlands: 'nl', belgium: 'be', switzerland: 'ch', austria: 'at', croatia: 'hr', serbia: 'rs', poland: 'pl', sweden: 'se', norway: 'no', denmark: 'dk', greece: 'gr', turkey: 'tr', 'türkiye': 'tr', ukraine: 'ua', russia: 'ru', nigeria: 'ng', ghana: 'gh', cameroon: 'cm', 'ivory coast': 'ci', "côte d'ivoire": 'ci', 'cote d\'ivoire': 'ci', senegal: 'sn', mali: 'ml', 'burkina faso': 'bf', guinea: 'gn', togo: 'tg', benin: 'bj', gabon: 'ga', congo: 'cg', 'dr congo': 'cd', 'democratic republic of the congo': 'cd', kenya: 'ke', ethiopia: 'et', eritrea: 'er', somalia: 'so', sudan: 'sd', 'south sudan': 'ss', uganda: 'ug', tanzania: 'tz', rwanda: 'rw', burundi: 'bi', zambia: 'zm', zimbabwe: 'zw', 'south africa': 'za', angola: 'ao', mozambique: 'mz', morocco: 'ma', algeria: 'dz', tunisia: 'tn', egypt: 'eg', liberia: 'lr', 'sierra leone': 'sl', 'cape verde': 'cv', japan: 'jp', 'south korea': 'kr', korea: 'kr', china: 'cn', india: 'in', pakistan: 'pk', bangladesh: 'bd', vietnam: 'vn', philippines: 'ph', indonesia: 'id', thailand: 'th', iran: 'ir', iraq: 'iq', 'saudi arabia': 'sa', jordan: 'jo', lebanon: 'lb', syria: 'sy', israel: 'il', palestine: 'ps', afghanistan: 'af', nepal: 'np', australia: 'au', 'new zealand': 'nz' };
  DU.COUNTRIES = [['USA', 'us'], ['Mexico', 'mx'], ['Canada', 'ca'], ['El Salvador', 'sv'], ['Honduras', 'hn'], ['Guatemala', 'gt'], ['Nicaragua', 'ni'], ['Costa Rica', 'cr'], ['Panama', 'pa'], ['Jamaica', 'jm'], ['Haiti', 'ht'], ['Cuba', 'cu'], ['Dominican Republic', 'do'], ['Puerto Rico', 'pr'], ['Trinidad and Tobago', 'tt'], ['Colombia', 'co'], ['Venezuela', 've'], ['Ecuador', 'ec'], ['Peru', 'pe'], ['Bolivia', 'bo'], ['Chile', 'cl'], ['Argentina', 'ar'], ['Uruguay', 'uy'], ['Paraguay', 'py'], ['Brazil', 'br'], ['England', 'gb-eng'], ['Scotland', 'gb-sct'], ['Wales', 'gb-wls'], ['Northern Ireland', 'gb-nir'], ['Ireland', 'ie'], ['France', 'fr'], ['Spain', 'es'], ['Portugal', 'pt'], ['Germany', 'de'], ['Italy', 'it'], ['Netherlands', 'nl'], ['Belgium', 'be'], ['Switzerland', 'ch'], ['Austria', 'at'], ['Denmark', 'dk'], ['Sweden', 'se'], ['Norway', 'no'], ['Poland', 'pl'], ['Croatia', 'hr'], ['Serbia', 'rs'], ['Bosnia and Herzegovina', 'ba'], ['Albania', 'al'], ['Greece', 'gr'], ['Turkey', 'tr'], ['Ukraine', 'ua'], ['Romania', 'ro'], ['Russia', 'ru'], ['Nigeria', 'ng'], ['Ghana', 'gh'], ['Cameroon', 'cm'], ['Ivory Coast', 'ci'], ['Senegal', 'sn'], ['Mali', 'ml'], ['Burkina Faso', 'bf'], ['Guinea', 'gn'], ['Togo', 'tg'], ['Benin', 'bj'], ['Gabon', 'ga'], ['Congo', 'cg'], ['DR Congo', 'cd'], ['Kenya', 'ke'], ['Ethiopia', 'et'], ['Eritrea', 'er'], ['Somalia', 'so'], ['Sudan', 'sd'], ['South Sudan', 'ss'], ['Uganda', 'ug'], ['Tanzania', 'tz'], ['Rwanda', 'rw'], ['Burundi', 'bi'], ['Zambia', 'zm'], ['Zimbabwe', 'zw'], ['South Africa', 'za'], ['Angola', 'ao'], ['Mozambique', 'mz'], ['Morocco', 'ma'], ['Algeria', 'dz'], ['Tunisia', 'tn'], ['Egypt', 'eg'], ['Liberia', 'lr'], ['Sierra Leone', 'sl'], ['Cape Verde', 'cv'], ['Gambia', 'gm'], ['Japan', 'jp'], ['South Korea', 'kr'], ['China', 'cn'], ['India', 'in'], ['Pakistan', 'pk'], ['Bangladesh', 'bd'], ['Nepal', 'np'], ['Vietnam', 'vn'], ['Philippines', 'ph'], ['Indonesia', 'id'], ['Thailand', 'th'], ['Iran', 'ir'], ['Iraq', 'iq'], ['Saudi Arabia', 'sa'], ['Jordan', 'jo'], ['Lebanon', 'lb'], ['Syria', 'sy'], ['Palestine', 'ps'], ['Israel', 'il'], ['Afghanistan', 'af'], ['Australia', 'au'], ['New Zealand', 'nz']];
  DU.COUNTRIES.forEach(([n, c]) => { ISO[n.toLowerCase()] = c; });
  DU.natFlag = (nat, cls) => { const k = ISO[String(nat || '').trim().toLowerCase()]; const code = DU.esc(String(nat || '').trim().slice(0, 3).toUpperCase()); return k ? `<img class="${cls || 'flag'}" src="https://flagcdn.com/w80/${k}.png" srcset="https://flagcdn.com/w160/${k}.png 2x" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;pc-code&quot;>${code}</span>'">` : (code ? `<span class="pc-code">${code}</span>` : ''); };
  DU.seasonOnly = (txt) => String(txt || '').replace(/^\s*(Founding|Fundación|Fondation)\s*[·•-]\s*/i, '').trim();
  DU.walletCard = (p, o) => {
    o = o || {}; const C = o.cfg || {}, esc = DU.esc;
    const main = C.main || '#0A1628', acc = C.accent || '#F5B700';
    const h = String(main).replace('#', ''); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    const ink = (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#0A1628' : '#FFFFFF';
    const star = (n) => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="${esc(acc)}"/></svg>`;
    const flag = p.flag ? `<img class="wc-flag" src="${esc(p.flag)}" alt="${esc(p.nat || '')}">` : p.nat ? DU.natFlag(p.nat, 'wc-flag') : '';
    return `<div class="wallet-card" role="img" aria-label="${p.group === 'Player' ? 'Player' : 'Staff'} card: ${esc(p.first)} ${esc(p.last)}${p.no ? `, number ${esc(p.no)}` : ''}" style="--card-main:${esc(main)};--card-accent:${esc(acc)};--card-ink:${ink}${o.dim ? ';opacity:.45' : ''}">
      <div class="top"><span class="club">${C.logo === 'star' ? `<span class="wc-logo">${star(26)}</span>` : `<img src="${DU.CREST_SMALL}" alt="">`}<strong>DALLAS UNITED FC</strong></span><span class="num">${p.no ? esc(p.no) : star(34)}</span></div>
      <div class="photo"><img src="${esc(o.photo || p.img)}" alt=""></div>
      <div class="bottom"><div class="wc-name"><span class="wc-nm"><span class="wc-first">${esc(p.first)}</span><span class="display wc-last" style="font-size:${String(p.last || '').length > 13 ? 20 : String(p.last || '').length > 9 ? 24 : 30}px">${esc(p.last)}</span></span>${flag}</div>
        <div class="fields"><span><span>${p.group === 'Player' ? 'POSITION' : 'ROLE'}</span><strong>${esc(p.pos)}</strong></span><span><span>SEASON</span><strong>${esc(DU.seasonOnly(o.season || ''))}</strong></span></div>
        <div class="fade" aria-hidden="true">${esc(C.fade || 'DU')}</div></div></div>`;
  };
  DU.cardFlag = (p) => (p.flag ? `<img class="wc-flag" src="${DU.esc(p.flag)}" alt="">` : p.nat ? DU.natFlag(p.nat, 'wc-flag') : '');
  DU.isVideo = (src) => /^data:video\/|\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(String(src || '')) || /\/video%2F|\/video\//.test(String(src || ''));
  DU.media = (src0, attrs) => { const src = src0 || DU.pic('brand.noPhoto', 'assets/img/stadium-night.jpg'); return (DU.isVideo(src) ? `<video src="${DU.esc(src)}" autoplay muted loop playsinline preload="metadata" ${attrs || ''}></video>` : `<img src="${DU.esc(src)}" alt="" ${attrs || ''}>`); };
  DU.productTile = (p, o) => {
    o = o || {}; const esc = DU.esc, name = esc(DU.t(p.name)), money = DU.money;
    const badge = p.founders ? `<span class="pt-badge pt-badge-f">${DU.x('shop.membersOnly', 'Members only')}</span>` : o.pre ? '<span class="pt-badge pt-badge-pre">PRE-ORDER</span>' : p.isNew ? '<span class="pt-badge">NEW</span>' : '';
    const pics = `${DU.media(p.img, 'loading="lazy"')}${p.imgBack ? DU.media(p.imgBack, 'class="pt-back" loading="lazy"') : ''}${badge}${p.sale ? '<span class="pt-badge pt-badge-sale">SALE</span>' : ''}`;
    const priceTxt = p.sale ? `<s>${money(p.price)}</s> <strong class="pt-sale">${money(p.sale)}</strong>` : `<span>${money(p.price)}</span>`;
    const body = o.buy
      ? `<span class="pt-body"><strong class="pt-name">${name}</strong><span class="pt-price">${DU.x('shop.yourPrice', 'Your price:')} ${priceTxt}</span><span class="pt-buy">${p.founders ? DU.x('shop.fBuy', 'Founders shop') : DU.x('shop.buyNow', 'Buy now')} <span aria-hidden="true">+</span></span></span>`
      : `<span class="pt-body"><strong class="pt-name">${name}</strong><span class="pt-price">${priceTxt}</span>${p.founders ? `<span class="pt-fnote">${DU.x('shop.fNote', 'For founders · Founders shop')} →</span>` : ''}</span>`;
    const cls = `ptile${p.founders ? ' ptile-f' : ''}${p.imgBack ? ' has-back' : ''}`;
    if (o.href || p.founders) return `<a class="${cls}" href="${esc(p.founders ? `founders-shop.html#${p.id}` : o.href)}" aria-label="${name}"><span class="pt-pic">${pics}</span>${body}</a>`;
    return `<article class="${cls}"><button type="button" class="pt-pic" data-view="${esc(p.id)}" aria-label="${name}">${pics}</button>${body}${o.btn ? `<button type="button" class="btn btn-navy btn-sm pt-btn" data-view="${esc(p.id)}">${o.btn}</button>` : ''}</article>`;
  };
  DU.leagueBadge = (comp, cls) => {
    const key = comp === 'League' ? 'brand.leagueLogo' : comp === 'Texas Cup' ? 'brand.cupLogo' : '';
    const src = key ? DU.pic(key, comp === 'League' ? 'assets/brand/upsl.svg' : '') : '';
    return src ? `<img class="${cls || 'lg-badge'}" src="${DU.esc(src)}" alt="${DU.esc(DU.compName(comp))}">` : `<span class="${cls || 'lg-badge'} lg-badge-txt">${DU.esc(DU.compName(comp))}</span>`;
  };
  DU.scorerList = (txt) => String(txt || '').split(',').map((x) => x.trim()).filter(Boolean);
  DU.matchHero = (d, f, o) => {
    if (!f) return '';
    o = o || {};
    const esc = DU.esc, tr = DU.tr;
    const lv = DU.liveFor(d, f), L = d.live;
    const done = f.status === 'Full time' && !lv;
    const [a, b] = DU.teams(f);
    let sa = '', sb = '';
    if (lv) { sa = f.ha === 'Home' ? L.du : L.op; sb = f.ha === 'Home' ? L.op : L.du; } else if (done) [sa, sb] = DU.score(f);
    const ourGoals = lv ? DU.liveScorers(L.events) : DU.scorerList(f.scorers);
    const theirGoals = DU.scorerList(f.oppScorers);
    const [ga, gb] = f.ha === 'Home' ? [ourGoals, theirGoals] : [theirGoals, ourGoals];
    const goals = (list) => (list.length ? `<span class="mh-goals">${list.map((g) => `<span>${DU.icon('ball') || '⚽'} ${esc(g)}</span>`).join('')}</span>` : '');
    const team = (name, score, list) => `<div class="mh-team"><span class="mh-crest">${DU.crestFor(name, f, 'mh-crest-img')}</span><span class="mh-name">${esc(name)}</span>${done || lv ? `<span class="mh-score">${esc(score || 0)}</span>` : ''}${goals(list)}</div>`;
    const ko = DU.fmtTime(f.time);
    const side = lv
      ? `<span class="mh-pill mh-live"><span class="live-dot"></span>${tr('c.live')} · ${esc(lv.label)}</span>`
      : done ? `<span class="mh-pill">${esc(tr('c.fullTime')).toUpperCase()}</span>`
        : `<div class="mh-count" data-cd="${esc(f.date)}T${esc(f.time)}">${[['d', DU.x('mh.d', 'Days')], ['h', DU.x('mh.h', 'Hours')], ['m', DU.x('mh.m', 'Mins')], ['s', DU.x('mh.s', 'Secs')]].map(([k, l]) => `<div><b data-c="${k}">00</b><span>${l}</span></div>`).join('')}</div><span class="mh-ko">${DU.icon('clock') || ''} ${esc(ko)}</span>`;
    const btns = [];
    if (!lv && !done) btns.push(DU.calButton(DU.fxEvent(f), DU.x('mh.cal', 'Add to calendar'), 'mh-btn mh-btn-gold'));
    if (!lv && !done && DU.ticketsOn(d) && f.tickets) btns.push(`<a class="mh-btn mh-btn-light" href="${esc(DU.ticketUrl(f, d))}" target="_blank" rel="noopener">${tr('c.tickets')} <span aria-hidden="true">↗</span></a>`);
    if (lv && DU.ytEmbed(f.stream) && DU.on('liveStream', d)) btns.push(`<button type="button" class="mh-btn mh-btn-gold" data-watch-live>${DU.x('matches.watchLive', 'Watch live')} <span aria-hidden="true">▶</span></button>`);
    if (done && f.highlights && DU.on('dutv', d) && !o.noHl) btns.push(`<a class="mh-btn mh-btn-gold" href="dutv.html?v=${esc(f.highlights)}">${tr('c.highlights')} <span aria-hidden="true">▶</span></a>`);
    if ((lv || done) && DU.on('matchCentre', d)) btns.push(`<a class="mh-btn mh-btn-light" href="match-centre.html?id=${esc(f.id)}">${tr('c.matchCentre')} <span aria-hidden="true">↗</span></a>`);
    const img = f.img || DU.pic('matches.heroImg', 'assets/img/matchday-stadium.jpg');
    return `<section class="mh${o.home ? ' mh-home' : ''}${o.bare ? ' mh-bare' : ''}" aria-label="${esc(a)} vs ${esc(b)}">
      <div class="mh-stage">${o.bare ? '' : `<div class="mh-photo">${DU.media(img, 'alt=""')}</div>`}
      <div class="mh-panel">
        <div class="mh-teams">${team(a, sa, ga)}${team(b, sb, gb)}</div>
        <div class="mh-side">${side}<dl class="mh-info"><div><dt>${DU.x('mh.comp', 'Competition')}</dt><dd>${esc(f.comp === 'League' ? `${d.settings.leagueShort || 'UPSL'} ${d.settings.leagueDivision || ''}`.trim() : DU.compName(f.comp))}</dd></div><div><dt>${DU.x('mh.date', 'Date')}</dt><dd>${esc(DU.fmtDay(f.date, true))}</dd></div><div><dt>${DU.x('mh.venue', 'Venue')}</dt><dd>${esc(f.venue || d.settings.stadium || '')}</dd></div>${f.referee ? `<div><dt>${DU.x('mh.ref', 'Referee')}</dt><dd>${esc(f.referee)}</dd></div>` : ''}</dl></div>
      </div></div>
      ${btns.length ? `<div class="mh-btns">${btns.join('')}</div>` : ''}
    </section>`;
  };
  DU.runCountdowns = (root) => {
    const els = DU.$$('[data-cd]', root || document); if (!els.length) return null;
    const put = () => els.forEach((el) => {
      const [dt, tm] = el.dataset.cd.split('T'); const ms = Math.max(0, DU.dt(dt, tm).getTime() - Date.now());
      const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
      Object.entries(v).forEach(([k, n]) => { const b = el.querySelector(`[data-c="${k}"]`); if (b) b.textContent = String(n).padStart(2, '0'); });
    });
    put(); return setInterval(put, 1000);
  };

  DU.tvSlides = (d) => { const v = (d.videos || []).filter((x) => x.slide); return (v.length ? v : (d.videos || []).slice(0, 4)); };
  DU.tvTag = (v) => (v.tag ? `<span class="tv-tag tv-tag-${DU.esc(String(v.tag).toLowerCase().replace(/[^a-z]+/g, '-'))}">${DU.esc(v.tag)}</span>` : '');
  DU.tvHero = (d) => {
    const S = DU.tvSlides(d); if (!S.length) return '';
    const esc = DU.esc, t = DU.t;
    return `<div class="tvh" data-tvh>${S.map((v, i) => `<div class="tvh-slide${i ? '' : ' is-on'}" data-tvs="${i}" ${i ? 'aria-hidden="true"' : ''}>
        <button type="button" class="tvh-pic" data-play="${esc(v.id)}" aria-label="Play: ${esc(t(v.title))}">${DU.media(v.thumb, 'alt=""')}<span class="tvh-play" aria-hidden="true">${DU.icon('play')}</span></button>
        <div class="tvh-copy"><span class="tvh-meta"><span>${esc(v.len || '')}</span><strong>${esc(v.cat || '')}</strong>${DU.tvTag(v)}</span><h2 class="tvh-title">${esc(t(v.title))}</h2></div></div>`).join('')}
      ${S.length > 1 ? `<div class="tvh-dots">${S.map((_, i) => `<button type="button" data-tvd="${i}" aria-label="Video ${i + 1}" aria-current="${!i}"></button>`).join('')}</div>` : ''}
      <span class="tvh-line" aria-hidden="true"></span></div>`;
  };
  DU.playVideo = (d, id) => {
    const v = (d.videos || []).find((x) => x.id === id); if (!v) return;
    const yt = DU.ytEmbed(v.link);
    if (yt) { DU.modal(`<div class="tv-player">${DU.ytPlayer(v.link)}</div>`, { label: DU.t(v.title), style: 'max-width:1100px;width:96vw;padding:0;background:#000' }); return; }
    if (v.link) { window.open(v.link, '_blank', 'noopener'); return; }
    DU.modal(`<div style="aspect-ratio:16/9;background:#000;position:relative"><img src="${DU.esc(v.thumb)}" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.4"><div class="stack center" style="position:absolute;inset:0;color:#fff;text-align:center;--gap:12px;padding:24px"><strong class="display" style="font-size:clamp(26px,4vw,40px)">${DU.esc(DU.t(v.title))}</strong><span>Add the YouTube link in Admin → DU TV to play it here.</span></div></div>`, { label: DU.t(v.title) });
  };
  DU.bindTvHero = (root, d) => {
    const box = DU.$('[data-tvh]', root); if (!box) return;
    const slides = DU.$$('[data-tvs]', box), dots = DU.$$('[data-tvd]', box); let cur = 0, timer = null;
    const go = (k) => { cur = (k + slides.length) % slides.length; slides.forEach((s, i) => { s.classList.toggle('is-on', i === cur); s.setAttribute('aria-hidden', String(i !== cur)); }); dots.forEach((b, i) => b.setAttribute('aria-current', String(i === cur))); };
    const play = () => { clearInterval(timer); if (slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(cur + 1), 6000); };
    dots.forEach((b) => b.addEventListener('click', () => { go(Number(b.dataset.tvd)); play(); }));
    let x0 = null; box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true }); box.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); play(); } x0 = null; });
    DU.$$('[data-play]', box).forEach((b) => b.addEventListener('click', () => DU.playVideo(d, b.dataset.play)));
    play();
  };

  const pad4 = (n) => String(n || 0).padStart(4, '0');
  const sinceTxt = (iso) => { const dd = iso ? new Date(`${String(iso).slice(0, 10)}T12:00:00`) : new Date(); return dd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(); };
  DU.memberCard = (o) => {
    const f = o.type === 'founder';
    const name = String(o.name || '').trim() || 'YOUR NAME';
    const hood = DU.place(o) || String(o.hood || '').trim() || 'Your city, ST';
    const no = f ? `No. ${pad4(o.no)}` : `#${pad4(o.no)}`;
    const label = `${f ? 'Founder' : '214 Club'} card ${no}, ${name}`;
    return `<div class="mcard ${f ? 'mcard-founder' : 'mcard-club'}${o.small ? ' mcard-sm' : ''}" data-mcard role="img" aria-label="${DU.esc(label)}">
      <span class="mcard-in">
        <span class="mcard-face mcard-front"><img src="${DU.pic(f ? 'card.founderFront' : 'card.clubFront', `assets/img/card-${f ? 'founder' : '214'}-front.jpg?v=2`)}" alt="" draggable="false">
          <span class="mc-no">${DU.esc(no)}</span><span class="mc-name">${DU.esc(name.toUpperCase())}</span><span class="mc-hood">${DU.esc(hood)}</span><span class="mc-since">${DU.esc(sinceTxt(o.since))}</span>
          <span class="mcard-shine" aria-hidden="true"></span></span>
      </span></div>`;
  };
  DU.bindCards = (root) => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    DU.$$('[data-mcard]', root || document).forEach((c) => {
      if (c.dataset.bound) return; c.dataset.bound = '1';
      const inner = c.querySelector('.mcard-in');
      let rx = 0, ry = 0;
      const paint = () => { inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
      c.addEventListener('pointermove', (e) => {
        if (still || e.pointerType === 'touch') return;
        const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        ry = (x - 0.5) * 30; rx = (0.5 - y) * 22; paint();
        c.style.setProperty('--mx', `${Math.round(x * 100)}%`); c.style.setProperty('--my', `${Math.round(y * 100)}%`);
      });
      c.addEventListener('pointerleave', () => { rx = 0; ry = 0; paint(); c.style.removeProperty('--mx'); c.style.removeProperty('--my'); });
    });
  };

  DU.compareTable = (d) => {
    const FC = d.founderCfg || {}; const price = DU.money(FC.price || 25); const goal = (FC.goal || 500).toLocaleString(DU.locale());
    const rows = [
      [DU.x('cmp.how', 'How to join'), DU.x('cmp.how214', 'Follow us on social media'), `Pay ${price}`],
      [DU.x('cmp.many', 'How many'), DU.x('cmp.many214', 'Everyone, forever'), `The first ${goal} only`],
      [DU.x('cmp.card', 'Card'), DU.x('cmp.card214', 'Blue member card'), DU.x('cmp.cardF', 'Gold founder card')],
      [DU.x('cmp.name', 'Name on the website'), DU.x('cmp.name214b', 'Your state on the fan map'), DU.x('cmp.nameF', 'On the Founders Wall, forever')],
      [DU.x('cmp.news', 'Club news and a birthday message'), DU.x('cmp.news214', 'Yes'), DU.x('cmp.newsF', 'Yes')],
      ...(DU.on('shop', d) ? [[DU.x('cmp.merch', 'Merch'), DU.x('cmp.merch214', 'First dibs on new drops'), DU.x('cmp.merchF', 'First dibs, plus the founders-only collection')]] : [])
    ];
    return `<div class="cmp" role="table" aria-label="214 Club and Founder compared"><div class="cmp-row cmp-top" role="row"><span role="columnheader"></span><span role="columnheader" class="c214">${DU.x('cmp.h214', '214 Club · Free')}</span><span role="columnheader" class="cF">Founder · ${price} ${DU.x('cmp.once', 'one time')}</span></div>
      ${rows.map((r) => `<div class="cmp-row" role="row"><strong role="rowheader">${r[0]}</strong><span role="cell" data-l="214 Club">${r[1]}</span><span role="cell" data-l="Founder">${r[2]}</span></div>`).join('')}</div>`;
  };

  DU.shopBase = () => { const u = String(((DU.store.get().shopTexts) || {}).shopUrl || '').trim().replace(/\/+$/, ''); return u && /^https?:\/\//.test(u) ? `${u}/` : ''; };
  DU.shopLinks = (root) => {
    const st = DU.store.get().shopTexts || {}; const here = location.pathname.split('/').pop();
    if (here === 'shop.html' || here === 'founders-shop.html') return;
    const base = DU.shopBase();
    DU.$$('a[href^="shop.html"], a[href^="founders-shop.html"]', root || document).forEach((a) => {
      if (base) a.setAttribute('href', base + a.getAttribute('href'));
      if (st.newTab !== false) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  };
  DU.shapeOf = (name, d) => {
    if (DU.FORMATIONS[name]) return DU.FORMATIONS[name];
    const c = ((d || D0()).formationsCustom || []).find((x) => x.name === name);
    if (c && Array.isArray(c.shape)) return c.shape;
    if (c && DU.FORMATIONS[c.base]) return DU.FORMATIONS[c.base];
    const m = String(name || '').match(/^\s*(\d)(?:\s*-\s*(\d)){1,4}/);
    if (m) { const parts = String(name).match(/\d/g).map(Number); if (parts.reduce((a, b) => a + b, 0) === 10) return parts; }
    return DU.FORMATIONS['4-3-3'];
  };
  const LINE = (shape, idx) => (idx === 0 ? 'Defender' : idx === shape.length - 1 ? 'Forward' : 'Midfielder');
  DU.needFor = (shape) => { const n = { Goalkeeper: 1, Defender: shape[0], Forward: shape[shape.length - 1] }; n.Midfielder = 10 - n.Defender - n.Forward; return n; };
  DU.arrangeXI = (xi, shape) => {
    const left = xi.filter(Boolean).slice();
    const takeOne = (pref) => { for (const pos of pref) { const k = left.findIndex((p) => p.pos === pos); if (k >= 0) return left.splice(k, 1)[0]; } return left.length ? left.shift() : null; };
    const out = [takeOne(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'])];
    const rowsWanted = shape.map((cnt, li) => ({ cnt, pos: LINE(shape, li) }));
    const placed = rowsWanted.map(() => []);
    ['Defender', 'Forward', 'Midfielder'].forEach((want) => rowsWanted.forEach((r, li) => { if (r.pos !== want) return; while (placed[li].length < r.cnt) { const k = left.findIndex((p) => p.pos === want); if (k < 0) break; placed[li].push(left.splice(k, 1)[0]); } }));
    const near = { Defender: ['Midfielder', 'Forward', 'Goalkeeper'], Midfielder: ['Defender', 'Forward', 'Goalkeeper'], Forward: ['Midfielder', 'Defender', 'Goalkeeper'] };
    rowsWanted.forEach((r, li) => { while (placed[li].length < r.cnt && left.length) placed[li].push(takeOne(near[r.pos])); });
    placed.forEach((row) => out.push(...row));
    return out.concat(left).filter(Boolean).slice(0, 11);
  };
  DU.fitXI = (d, xiIds, subIds, shape) => {
    const byId = (id) => d.people.find((p) => p.id === id);
    const fitOk = (p) => p && !(d.avail && d.avail[p.id] && d.avail[p.id][0] !== 'Fit');
    const cur = (xiIds || []).map(byId).filter(Boolean);
    const bench = (subIds || []).map(byId).filter(Boolean);
    const squad = d.people.filter((p) => p.group === 'Player' && fitOk(p));
    const need = DU.needFor(shape);
    const chosen = [];
    Object.keys(need).forEach((pos) => {
      const pick = (list) => list.filter((p) => p.pos === pos && !chosen.includes(p));
      let have = pick(cur).slice(0, need[pos]);
      if (have.length < need[pos]) have = have.concat(pick(bench).slice(0, need[pos] - have.length));
      if (have.length < need[pos]) have = have.concat(pick(squad).filter((p) => !have.includes(p)).slice(0, need[pos] - have.length));
      chosen.push(...have);
    });
    const spare = cur.filter((p) => !chosen.includes(p));
    while (chosen.length < 11 && spare.length) chosen.push(spare.shift());
    const extra = squad.filter((p) => !chosen.includes(p) && p.pos !== 'Goalkeeper');
    while (chosen.length < 11 && extra.length) chosen.push(extra.shift());
    const xi = DU.arrangeXI(chosen, shape);
    const subs = [...cur.filter((p) => !xi.includes(p)), ...bench.filter((p) => !xi.includes(p))].filter((p, k, a) => a.indexOf(p) === k);
    return { xi: xi.map((p) => p.id), subs: subs.map((p) => p.id) };
  };
  DU.lineupFor = (d, f) => {
    const saved = (d.lineups || {})[f && f.id] || {};
    const formation = DU.FORMATIONS[saved.formation] ? saved.formation : '4-3-3';
    const shape = saved.custom && Array.isArray(saved.shape) && saved.shape.reduce((a, b) => a + b, 0) === 10 ? saved.shape : DU.FORMATIONS[formation];
    const players = d.people.filter((p) => p.group === 'Player');
    const byId = (id) => d.people.find((p) => p.id === id);
    let xi = (saved.xi || []).map(byId);
    if (xi.length !== 11 || xi.some((p) => !p)) {
      const fit = players.filter((p) => !(d.avail && d.avail[p.id] && d.avail[p.id][0] !== 'Fit'));
      const r = DU.fitXI(d, [], [], shape);
      xi = r.xi.map(byId).filter(Boolean);
      const rest = fit.filter((p) => !xi.includes(p) && p.pos !== 'Goalkeeper');
      while (xi.length < 11 && rest.length) xi.push(rest.shift());
    }
    const rows = [[xi[0]]]; let k = 1;
    shape.forEach((n) => { rows.push(xi.slice(k, k + n).filter(Boolean)); k += n; });
    const subs = saved.subs ? saved.subs.map(byId).filter(Boolean) : players.filter((p) => !xi.includes(p) && !(d.avail && d.avail[p.id] && d.avail[p.id][0] !== 'Fit')).slice(0, 9);
    const coach = (saved.coach && byId(saved.coach)) || d.people.find((p) => p.pos === 'Head Coach') || null;
    const pos = (saved.custom && Array.isArray(saved.pos) && saved.pos.length === 11) ? saved.pos : DU.formationPos(shape);
    const roles = { captain: saved.captain || '', pens: saved.pens || '', fk: saved.fk || '', cornerL: saved.cornerL || '', cornerR: saved.cornerR || '' };
    const label = saved.custom && saved.customName ? saved.customName : formation;
    return { formation: label, base: formation, shape, custom: !!saved.custom, pos, roles, rows, xi: xi.filter(Boolean), subs, coach, saved: !!saved.xi };
  };

  const ICO = {
    get goal() { return `<span class="ev-ico ev-goal" title="Goal">${DU.lu('ball')}</span>`; },
    get pen() { return `<span class="ev-ico ev-goal" title="Penalty goal">${DU.lu('ball')}<b>P</b></span>`; },
    yc: '<span class="ev-ico ev-card ev-yc" title="Yellow card"></span>',
    rc: '<span class="ev-ico ev-card ev-rc" title="Red card"></span>',
    out: '<span class="ev-ico ev-sub ev-out" title="Subbed off">▼</span>',
    in: '<span class="ev-ico ev-sub ev-in" title="Subbed on">▲</span>',
    miss: '<span class="ev-ico ev-miss" title="Missed penalty">✕P</span>'
  };
  DU.ICO = ICO;
  DU.playerMarks = (events, pid) => (events || []).slice().reverse().map((e) => {
    if (e.pid === pid && e.kind === 'goal' && e.dd) return e.pen ? ICO.pen : ICO.goal;
    if (e.pid === pid && e.kind === 'card') return e.color === 'r' ? ICO.rc : ICO.yc;
    if (e.pid === pid && e.kind === 'miss') return ICO.miss;
    if (e.kind === 'sub' && e.pid === pid) return ICO.out;
    if (e.kind === 'sub' && e.pin === pid) return ICO.in;
    return '';
  }).join('');
  DU.liveScorers = (events) => (events || []).filter((e) => e.kind === 'goal' && e.dd).slice().reverse().map((e) => `${e.og ? 'Own goal' : (e.who || String(e.text || '').replace(/^.*Goal:\s*/, '').trim())} ${e.min}’${e.pen ? ' (P)' : ''}`);
  DU.flag = (k) => ({
    EN: '<svg class="flag" viewBox="0 0 26 18" aria-hidden="true"><rect width="26" height="18" rx="2" fill="#B22234"/><g fill="#FFF"><rect y="2.8" width="26" height="1.4"/><rect y="5.6" width="26" height="1.4"/><rect y="8.4" width="26" height="1.4"/><rect y="11.2" width="26" height="1.4"/><rect y="14" width="26" height="1.4"/></g><rect width="11" height="9.8" fill="#3C3B6E"/></svg>',
    ES: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#006847"/><rect x="10" width="10" height="20" fill="#FFF"/><rect x="20" width="10" height="20" fill="#CE1126"/><circle cx="15" cy="10" r="3" fill="#8C5A2B"/></svg>',
    FR: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#0055A4"/><rect x="10" width="10" height="20" fill="#FFF"/><rect x="20" width="10" height="20" fill="#EF4135"/></svg>'
  }[k] || '');
  DU.teams = (f) => (f.ha === 'Home' ? ['Dallas United', f.opp] : [f.opp, 'Dallas United']);
  DU.score = (f) => (f.ha === 'Home' ? [f.du, f.op] : [f.op, f.du]);
  DU.oppCrest = (f, cls) => {
    if (f.oppLogo) return `<img class="${cls || 'crest-mini'}" src="${DU.esc(f.oppLogo)}" alt="${DU.esc(f.opp)}" style="object-fit:contain">`;
    const ini = DU.esc((f.oppShort || f.opp.split(' ').map((w) => w[0]).join('')).slice(0, 3).toUpperCase());
    return `<svg class="${cls || 'crest-mini'}" viewBox="0 0 48 52" role="img" aria-label="${DU.esc(f.opp)}"><path d="M24 2 L44 8 V24 C44 37 34 45 24 50 C14 45 4 37 4 24 V8 Z" fill="${DU.esc(f.oppColor || '#455A64')}" stroke="#fff" stroke-width="2"/><text x="24" y="31" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${ini.length > 2 ? 13 : 16}" fill="#fff">${ini}</text></svg>`;
  };
  DU.ourCrest = (cls) => `<img class="${cls || 'crest-mini'}" src="${DU.CREST_SMALL}" alt="Dallas United" style="object-fit:contain">`;
  DU.crestFor = (name, f, cls) => (name === 'Dallas United' ? DU.ourCrest(cls) : DU.oppCrest(f, cls));
  DU.ticketUrl = (f, d) => f.tickets || (d.settings.ticketPage || '#');
  DU.ticketsOn = (d) => !!(d.settings && d.settings.ticketsOn);

  const pad = (n) => String(n).padStart(2, '0');
  const stamp = (dt) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  DU.calEvent = (title, start, mins, where, details) => ({ title, start, end: new Date(start.getTime() + (mins || 120) * 60000), where: where || '', details: details || '' });
  DU.fxEvent = (f) => DU.calEvent(`${DU.teams(f).join(' vs ')} (${DU.compName(f.comp)})`, DU.dt(f.date, f.time), 120, f.venue, `${location.origin}${location.pathname.replace(/[^/]*$/, '')}matches.html`);
  DU.googleCal = (e) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${stamp(e.start)}/${stamp(e.end)}&ctz=America/Chicago&location=${encodeURIComponent(e.where)}&details=${encodeURIComponent(e.details)}`;
  DU.icsHref = (events) => {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dallas United FC//Website//EN', 'CALSCALE:GREGORIAN'];
    events.forEach((e, i) => lines.push('BEGIN:VEVENT', `UID:du-${stamp(e.start)}-${i}@dallasunitedfc.com`, `DTSTAMP:${stamp(new Date())}`, `DTSTART;TZID=America/Chicago:${stamp(e.start)}`, `DTEND;TZID=America/Chicago:${stamp(e.end)}`, `SUMMARY:${e.title.replace(/[,;]/g, ' ')}`, `LOCATION:${e.where.replace(/[,;]/g, ' ')}`, `DESCRIPTION:${e.details.replace(/[,;]/g, ' ')}`, ...(e.alarm ? ['BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Kickoff in 1 hour', 'TRIGGER:-PT1H', 'END:VALARM'] : []), 'END:VEVENT'));
    lines.push('END:VCALENDAR');
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
  };
  DU.calButton = (e, label, cls) => {
    const id = DU.store.uid('cal');
    return `<span style="position:relative;display:inline-flex"><button type="button" class="${cls || 'btn btn-sm btn-outline'}" aria-expanded="false" aria-controls="${id}" data-cal-toggle="${id}">${DU.icon('cal')}${DU.esc(label || tr('c.addCal'))}</button>
      <span class="popover" id="${id}" hidden><a href="${DU.googleCal(e)}" target="_blank" rel="noopener">${tr('c.google')}</a><a href="${DU.icsHref([e])}" download="dallas-united.ics">${tr('c.apple')}</a></span></span>`;
  };
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-cal-toggle]');
    DU.$$('.popover').forEach((p) => { if (!b || p.id !== b.dataset.calToggle) p.hidden = true; });
    if (b) { const p = document.getElementById(b.dataset.calToggle); p.hidden = !p.hidden; b.setAttribute('aria-expanded', String(!p.hidden)); }
  });


  const LU = {"arrow-right": "<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>", "arrow-left": "<path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/>", "arrow-up": "<path d=\"m5 12 7-7 7 7\"/><path d=\"M12 19V5\"/>", "arrow-down": "<path d=\"M12 5v14\"/><path d=\"m19 12-7 7-7-7\"/>", "arrow-up-right": "<path d=\"M7 7h10v10\"/><path d=\"M7 17 17 7\"/>", "chevron-left": "<path d=\"m15 18-6-6 6-6\"/>", "chevron-right": "<path d=\"m9 18 6-6-6-6\"/>", "chevron-down": "<path d=\"m6 9 6 6 6-6\"/>", "chevron-up": "<path d=\"m18 15-6-6-6 6\"/>", "shopping-bag": "<path d=\"M16 10a4 4 0 0 1-8 0\"/><path d=\"M3.103 6.034h17.794\"/><path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\"/>", "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>", "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>", "menu": "<path d=\"M4 12h16\"/><path d=\"M4 6h16\"/><path d=\"M4 18h16\"/>", "x": "<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>", "play": "<polygon points=\"6 3 20 12 6 21 6 3\" fill=\"currentColor\"/>", "pause": "<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/>", "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"/>", "list-filter": "<path d=\"M3 6h18\"/><path d=\"M7 12h10\"/><path d=\"M10 18h4\"/>", "calendar": "<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/>", "calendar-plus": "<path d=\"M16 18h6\"/><path d=\"M16 2v3\"/><path d=\"M19 15v6\"/><path d=\"M21 11.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.3\"/><path d=\"M3 9h18\"/><path d=\"M8 2v3\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"/><path d=\"M2 12h20\"/>", "map-pin": "<path d=\"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>", "ticket": "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\"/><path d=\"M13 5v2\"/><path d=\"M13 17v2\"/><path d=\"M13 11v2\"/>", "check": "<path d=\"M20 6 9 17l-5-5\"/>", "star": "<path fill=\"currentColor\" d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>", "heart": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/>", "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>", "snowflake": "<line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\"/><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\"/><path d=\"m20 16-4-4 4-4\"/><path d=\"m4 8 4 4-4 4\"/><path d=\"m16 4-4 4-4-4\"/><path d=\"m8 20 4-4 4 4\"/>", "cake": "<path d=\"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8\"/><path d=\"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1\"/><path d=\"M2 21h20\"/><path d=\"M7 8v3\"/><path d=\"M12 8v3\"/><path d=\"M17 8v3\"/><path d=\"M7 4h.01\"/><path d=\"M12 4h.01\"/><path d=\"M17 4h.01\"/>", "tree-pine": "<path d=\"m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z\"/><path d=\"M12 22v-3\"/>", "party-popper": "<path d=\"M5.8 11.3 2 22l10.7-3.79\"/><path d=\"M4 3h.01\"/><path d=\"M22 8h.01\"/><path d=\"M15 2h.01\"/><path d=\"M22 20h.01\"/><path d=\"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10\"/><path d=\"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17\"/><path d=\"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7\"/><path d=\"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z\"/>", "hand": "<path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\"/><path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\"/><path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\"/><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"/>", "plane": "<path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"/>", "plus": "<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>", "target": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>", "camera": "<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/>", "smartphone": "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"/><path d=\"M12 18h.01\"/>", "shirt": "<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"/>", "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"/><line x1=\"4\" x2=\"4\" y1=\"22\" y2=\"15\"/>", "sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"/>", "award": "<circle cx=\"12\" cy=\"8\" r=\"6\"/><path d=\"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11\"/>", "handshake": "<path d=\"m11 17 2 2a1 1 0 1 0 3-3\"/><path d=\"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4\"/><path d=\"m21 3 1 11h-2\"/><path d=\"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3\"/><path d=\"M3 4h8\"/>", "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "gift": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\"/><path d=\"M12 8v13\"/><path d=\"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7\"/><path d=\"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5\"/>", "landmark": "<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\"/><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\"/><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\"/><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\"/><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\"/><polygon points=\"12 2 20 7 4 7\"/>", "bus": "<path d=\"M8 6v6\"/><path d=\"M15 6v6\"/><path d=\"M2 12h19.6\"/><path d=\"M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/><path d=\"M9 18h5\"/><circle cx=\"16\" cy=\"18\" r=\"2\"/>", "smile": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\"/><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\"/>", "mic": "<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"/><line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\"/>", "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/>", "external-link": "<path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/>", "arrow-right-left": "<path d=\"m16 3 4 4-4 4\"/><path d=\"M20 7H4\"/><path d=\"m8 21-4-4 4-4\"/><path d=\"M4 17h16\"/>", "ball": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m12 7 4.5 3.3-1.7 5.2H9.2l-1.7-5.2z\"/><path d=\"M12 2v5M21.5 9l-5 1.3M18 20l-3.2-4.5M6 20l3.2-4.5M2.5 9l5 1.3\"/>", "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>", "credit-card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"/><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\"/>", "tv": "<rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><polyline points=\"17 2 12 7 7 2\"/>", "log-out": "<path d=\"m16 17 5-5-5-5\"/><path d=\"M21 12H9\"/><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/>", "message-square": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>", "newspaper": "<path d=\"M15 18h-5\"/><path d=\"M18 14h-8\"/><path d=\"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2\"/><rect width=\"8\" height=\"4\" x=\"10\" y=\"6\" rx=\"1\"/>", "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/>", "video": "<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\"/><rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\"/>", "shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>", "sliders": "<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\"/><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\"/><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\"/><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\"/><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\"/><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\"/><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\"/><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\"/>", "rocket": "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\"/><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\"/><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\"/><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"/>", "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/>", "printer": "<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\"/>", "trophy": "<path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\"/><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\"/><path d=\"M4 22h16\"/><path d=\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\"/><path d=\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\"/><path d=\"M18 2H6v7a6 6 0 0 0 12 0V2Z\"/>", "repeat": "<path d=\"m17 2 4 4-4 4\"/><path d=\"M3 11v-1a4 4 0 0 1 4-4h14\"/><path d=\"m7 22-4-4 4-4\"/><path d=\"M21 13v1a4 4 0 0 1-4 4H3\"/>", "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/><path d=\"m15 5 4 4\"/>", "trash-2": "<path d=\"M3 6h18\"/><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"/><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/>", "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"/>", "eye-off": "<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"/><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"/><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"/><path d=\"m2 2 20 20\"/>", "download": "<path d=\"M12 15V3\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m7 10 5 5 5-5\"/>", "minus": "<path d=\"M5 12h14\"/>"};
  const BR = {"instagram": "M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388 5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388 5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123 5.86 5.86 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895 3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008", "facebook": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036 27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647", "x": "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z", "tiktok": "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07", "youtube": "M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z"};
  DU.lu = (n, cls) => (LU[n] ? `<svg class="lu${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LU[n]}</svg>` : '');
  DU.brand = (n, cls) => (BR[n] ? `<svg class="br${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${BR[n]}"/></svg>` : '');
  const CHAR = { '→': 'arrow-right', '↗': 'arrow-up-right', '←': 'arrow-left', '↑': 'arrow-up', '↓': 'arrow-down', '‹': 'chevron-left', '›': 'chevron-right', '▶': 'play', '▼': 'chevron-down', '▲': 'chevron-up', '⌃': 'chevron-up', '✕': 'x', '✓': 'check', '★': 'star', '⭐': 'star', '⚽': 'ball', '💛': 'heart', '♡': 'heart', '🔒': 'lock', '❄': 'snowflake', '🎂': 'cake', '🎄': 'tree-pine', '🎉': 'party-popper', '👋': 'hand', '🙌': 'sparkles', '👏': 'sparkles', '✈': 'plane', '✚': 'plus', '◎': 'target', '🎟': 'ticket', '📸': 'camera', '📱': 'smartphone', '🧣': 'shirt', '🚩': 'flag', '🏴': 'flag', '🏅': 'award', '📅': 'calendar', '🤝': 'handshake', '👁': 'eye', '🎁': 'gift', '🏟': 'landmark', '🚌': 'bus', '🧒': 'smile', '🎤': 'mic', '☰': 'menu' };
  const CHAR_RE = new RegExp(`(${Object.keys(CHAR).join('|')})[\\uFE0F]?`, 'gu');
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION', 'SELECT', 'TITLE', 'SVG', 'svg', 'CODE', 'PRE']);
  DU.iconize = (root) => {
    const r = root || document.body; if (!r) return;
    const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, { acceptNode: (n) => { CHAR_RE.lastIndex = 0; if (!CHAR_RE.test(n.nodeValue)) return NodeFilter.FILTER_REJECT; for (let p = n.parentNode; p && p !== r.parentNode; p = p.parentNode) { if (SKIP.has(p.nodeName) || (p.isContentEditable)) return NodeFilter.FILTER_REJECT; } return NodeFilter.FILTER_ACCEPT; } });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach((n) => { const span = document.createElement('span'); span.className = 'lu-t'; CHAR_RE.lastIndex = 0; span.innerHTML = DU.esc(n.nodeValue).replace(CHAR_RE, (m, c) => DU.lu(CHAR[c], 'lu-in')); n.replaceWith(...span.childNodes); });
  };
  let iconTimer = null;
  const iconObs = new MutationObserver(() => { clearTimeout(iconTimer); iconTimer = setTimeout(() => DU.iconize(document.body), 30); });
  DU.watchIcons = () => { DU.iconize(document.body); iconObs.observe(document.body, { childList: true, subtree: true, characterData: true }); };
  const IC = { user: DU.lu('user'), menu: DU.lu('menu'), close: DU.lu('x'), globe: DU.lu('globe'), cal: DU.lu('calendar'), play: DU.lu('play'), ball: DU.lu('ball'), clock: DU.lu('clock'), arrow: DU.lu('arrow-right'), bag: DU.lu('shopping-bag'), users: DU.lu('users'), chev: DU.lu('chevron-down'),
    ig: DU.brand('instagram'), fb: DU.brand('facebook'), tt: DU.brand('tiktok'), x: DU.brand('x'), yt: DU.brand('youtube') };
  DU.icon = (n) => IC[n] || '';

  DU.toast = (msg) => {
    let box = DU.$('.toast-box');
    if (!box) { box = document.createElement('div'); box.className = 'toast-box'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; box.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };

  DU.modal = (html, opts) => {
    const o = document.createElement('div'); o.className = 'overlay'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
    if (opts && opts.label) o.setAttribute('aria-label', opts.label);
    o.innerHTML = `<div class="modal" style="${(opts && opts.style) || ''}"><button type="button" class="modal-close" aria-label="${tr('c.close')}">${DU.icon('close')}</button>${html}</div>`;
    const prev = document.activeElement;
    const close = () => { o.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); if (opts && opts.onClose) opts.onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    o.addEventListener('click', (e) => { if (e.target === o || e.target.closest('.modal-close')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(o); document.body.style.overflow = 'hidden';
    const f = o.querySelector('.modal-close'); if (f) f.focus();
    return { el: o, close };
  };

  DU.reveal = (root) => {
    const els = DU.$$('.reveal:not(.is-in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  };

  const LOGO_STYLES = [
    (n) => `<span class="logo" style="font-family:var(--font-display);font-size:28px;letter-spacing:.06em">★ ${n.toUpperCase()}</span>`,
    (n) => `<span class="logo" style="font-style:italic;font-size:32px;letter-spacing:-.02em;color:var(--blue)">${n.toUpperCase()}</span>`,
    (n) => `<span class="logo" style="font-family:var(--font-serif);font-size:30px;color:var(--blue)">${n}</span>`,
    (n) => `<span class="logo" style="font-family:var(--font-display);font-size:26px;color:var(--text);letter-spacing:.04em">${n.toUpperCase()}</span>`,
    (n) => `<span class="logo" style="font-size:22px">✈ ${n}</span>`,
    (n) => `<span class="logo" style="font-family:var(--font-serif);font-size:26px;color:#9B2C2C">${n}</span>`,
    (n) => `<span class="logo" style="font-size:22px;color:#1F6B54">✚ ${n}</span>`,
    (n) => `<span class="logo" style="font-size:22px;letter-spacing:.2em">${n.toUpperCase()}</span>`,
    (n) => `<span class="logo" style="font-size:18px;letter-spacing:.06em">◎ ${n.toUpperCase()}</span>`
  ];
  DU.partnerLogo = (p, i) => (p.logo ? `<img class="logo" src="${DU.esc(p.logo)}" alt="${DU.esc(p.name)}" style="height:44px;width:auto">` : LOGO_STYLES[i % LOGO_STYLES.length](DU.esc(p.name)));

  const NAV_ALL = [['news', 'news.html', 'news'], ['matches', 'matches.html', 'matches'], ['team', 'team.html', 'team'], ['dutv', 'dutv.html', 'dutv'], ['tryouts', 'tryouts.html', 'tryouts'], ['shop', 'shop.html', 'shop']];
  const MORE_ALL = [['story', 'story.html', 'story'], ['club214', '214-club.html', 'club214'], ['founders', 'founders.html', 'founders'], ['centre', 'match-centre.html', 'matchCentre'], ['support', 'support.html', 'support'], ['volunteer', 'volunteer.html', 'volunteer'], ['partners', 'partners.html', 'partners']];
  let NAV = NAV_ALL, MORE = MORE_ALL;


  DU.adminLogin = (o) => `<div class="au au-admin"><div class="au-bar"><a class="au-back" href="index.html"><span aria-hidden="true">‹</span> Back to site</a><a class="au-crest" href="index.html" aria-label="Dallas United FC"><img src="${DU.CREST}" alt=""></a><span></span></div>
    <section class="au-split"><div class="au-left"><span class="au-k">Staff only</span><h1 class="au-h">Club admin</h1><p class="au-p">${o.text}</p></div>
    <div class="au-right"><form class="au-box" novalidate ${o.attr}>${o.msg ? `<div class="notice small">${DU.esc(o.msg)}</div>` : ''}
      <label class="au-f"><span class="au-l">Email</span><input name="email" type="email" autocomplete="username" required></label>
      <label class="au-f"><span class="au-l">${o.codeLabel || 'Password'}</span><input name="${o.codeName || 'pw'}" ${o.codeAttrs || 'type="password" autocomplete="current-password"'} required><button type="button" class="au-show" data-show>Show</button></label>
      ${o.forgot ? '<button type="button" class="au-forgot" data-forgot>Forgot password?</button>' : ''}
      <button class="au-btn" type="submit">Sign in to admin</button>
      ${o.social ? `<div class="au-or"><span>or</span></div><div class="au-socs"><button type="button" class="au-soc" data-asoc="google"><svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg><span>Continue with Google</span></button><button type="button" class="au-soc au-apple" data-asoc="apple"><svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 4.9c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg><span>Continue with Apple</span></button></div>` : ''}
      ${o.note ? `<p class="au-note">${o.note}</p>` : ''}</form></div></section></div>`;
  DU.bindShow = (root) => DU.$$('[data-show]', root).forEach((b) => { b.onclick = () => { const i = b.previousElementSibling; const sh = i.type === 'password'; i.type = sh ? 'text' : 'password'; b.textContent = sh ? 'Hide' : 'Show'; }; });

  DU.popup = (d) => {
    const P = d.popup || {};
    if (!P.on) return;
    const page = (location.pathname.split('/').pop() || 'index.html');
    if (P.where !== 'Every page' && page !== 'index.html' && page !== '') return;
    if (P.until && new Date(`${P.until}T23:59:59`) < new Date()) return;
    const id = `pop-${String(P.title && (P.title.EN || P.title) || '')}-${P.img || ''}`.slice(0, 120);
    try { if (P.often !== 'Every visit' && localStorage.getItem('du-popup') === id) return; if (P.often === 'Every visit' && sessionStorage.getItem('du-popup') === id) return; } catch (e) {  }
    const t = DU.t, esc = DU.esc;
    const box = document.createElement('div'); box.className = 'pop'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', t(P.title) || 'Dallas United');
    box.innerHTML = `<div class="pop-card" style="--pop:${esc(P.color || '#1452D9')}"><div class="pop-copy">${t(P.kicker) ? `<span class="pop-k">${esc(t(P.kicker))}</span>` : ''}<h2 class="pop-h">${esc(t(P.title))}</h2>${t(P.text) ? `<p class="pop-p">${esc(t(P.text))}</p>` : ''}${t(P.btn) ? `<a class="pop-btn" href="${esc(P.link || '#')}" data-pop-go><span>${esc(t(P.btn))}</span><span aria-hidden="true">↗</span></a>` : ''}</div>
      ${P.img ? `<div class="pop-pic">${DU.media(P.img, 'alt=""')}</div>` : ''}<button type="button" class="pop-x" data-pop-x aria-label="Close">✕</button></div>`;
    const close = () => { try { localStorage.setItem('du-popup', id); sessionStorage.setItem('du-popup', id); } catch (e) {  } box.classList.remove('is-on'); setTimeout(() => box.remove(), 300); document.removeEventListener('keydown', esc2); };
    const esc2 = (e) => { if (e.key === 'Escape') close(); };
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('[data-pop-x]') || e.target.closest('[data-pop-go]')) close(); });
    setTimeout(() => { document.body.appendChild(box); requestAnimationFrame(() => box.classList.add('is-on')); document.addEventListener('keydown', esc2); const x = box.querySelector('[data-pop-x]'); if (x) x.focus(); }, Number(P.delay || 1.5) * 1000);
  };

  DU.fakeQR = (seed) => { let h = 0; for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0; const N = 21; let r = ''; const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#000"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#000"/>`;
    const inF = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inF(x, y) && rnd() > 0.52) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    return `<svg viewBox="-1 -1 23 23" aria-hidden="true"><rect x="-1" y="-1" width="23" height="23" fill="#fff"/><g fill="#000">${r}</g>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`; };
  DU.walletPhone = (type, d, who) => {
    const W = (d || DU.store.get()).walletPhone || {}; const k = type === 'founder' ? 'f' : 'c';
    const v = (n, def) => (W[`${k}_${n}`] === '' || W[`${k}_${n}`] == null ? def : Number(W[`${k}_${n}`]));
    const img = W[`${k}_img`] || 'assets/img/phone-hand.png';
    const gold = type === 'founder';
    const name = who && who.name ? who.name : DU.x(gold ? 'wallet.fName' : 'wallet.cName', 'Your name');
    const no = String(who && who.no ? who.no : 1).padStart(4, '0');
    return `<figure class="pw${gold ? ' pw-gold' : ''}" aria-label="${gold ? 'The gold founder card' : 'The 214 Club card'} in a phone wallet"><img class="pw-photo" src="${DU.esc(img)}" alt="">
      <div class="pw-screen" style="left:${v('x', 36.1)}%;top:${v('y', 13.9)}%;width:${v('w', 27.1)}%;height:${v('h', 75.3)}%;--pr:${v('r', 14)}cqw">
        <div class="pw-ui"><div class="pw-bar"><span>${DU.x('wallet.done', 'Done')}</span><span class="pw-dots">•••</span></div>
          <div class="pw-pass"><div class="pw-ph"><img src="${DU.CREST}" alt=""><span>${gold ? DU.x('wallet.fTitle', 'FOUNDERS') : DU.x('wallet.cTitle', 'THE 214 CLUB')}</span><span class="pw-no"><small>${DU.x('wallet.no', 'No.')}</small>${no}</span></div>
            <div class="pw-strip">${DU.media(DU.pic(gold ? 'card.founderFront' : 'card.clubFront', gold ? 'assets/img/card-founder-front.jpg' : 'assets/img/card-214-front.jpg'))}</div>
            <div class="pw-fields"><span><small>${DU.x('wallet.member', 'Member')}</small>${DU.esc(name)}</span><span><small>${DU.x('wallet.since', 'Since')}</small>2026</span></div>
            <div class="pw-qr">${DU.fakeQR(type + no)}</div></div>
        </div></div></figure>`;
  };
  DU.collage = (list, label) => { const L = (list || []).slice(0, 6); while (L.length < 6) L.push({}); return `<div class="clg" aria-label="${DU.esc(label || 'Photos')}">${L.map((p, i) => `<figure class="clg-i clg-${i + 1}">${p.img ? DU.media(p.img, 'loading="lazy"') : `<span class="clg-empty">${DU.x('gallery.add', 'Add a photo in Admin')}</span>`}${p.caption && DU.t(p.caption) ? `<figcaption>${DU.esc(DU.t(p.caption))}</figcaption>` : ''}</figure>`).join('')}</div>`; };
  DU.dragRow = (list, label) => { const L = (list || []).filter((p) => p.img); const one = L.length ? L : Array.from({ length: 6 }, () => ({})); const items = [...one, ...one, ...one]; return `<div class="drow" data-drow tabindex="0" aria-label="${DU.esc(label || 'Photos')}: drag to move"><div class="drow-track">${items.map((p) => `<figure class="drow-i">${p.img ? DU.media(p.img, 'loading="lazy" draggable="false"') : `<span class="clg-empty">${DU.x('gallery.add', 'Add a photo in Admin')}</span>`}</figure>`).join('')}</div></div>`; };
  DU.bindDragRows = (root) => DU.$$('[data-drow]', root).forEach((el) => {
    el.dataset.dragOn = '1';
    let down = false, x0 = 0, s0 = 0, hover = false, last = 0;
    const set = () => el.scrollWidth / 3;
    const wrap = () => { const w = set(); if (!w) return; if (el.scrollLeft < w * 0.5) el.scrollLeft += w; else if (el.scrollLeft > w * 1.5) el.scrollLeft -= w; };
    requestAnimationFrame(() => { el.scrollLeft = set(); });
    el.addEventListener('scroll', wrap, { passive: true });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let acc = 0;
    const tick = (ts) => { const dt = last ? Math.min(64, ts - last) : 16; last = ts; if (!down && !hover && !reduce && !document.hidden) { acc += dt * 0.04; const step = Math.floor(acc); if (step) { el.scrollLeft += step; acc -= step; } } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; x0 = e.clientX; s0 = el.scrollLeft; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); });
    el.addEventListener('pointermove', (e) => { if (!down) return; el.scrollLeft = s0 - (e.clientX - x0); const w = set(); if (el.scrollLeft < w * 0.5 || el.scrollLeft > w * 1.5) { wrap(); x0 = e.clientX; s0 = el.scrollLeft; } });
    const up = () => { down = false; el.classList.remove('is-drag'); }; el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') el.scrollBy({ left: 300, behavior: 'smooth' }); if (e.key === 'ArrowLeft') el.scrollBy({ left: -300, behavior: 'smooth' }); });
  });
  DU.slideMedia = (sl, attrs) => {
    const f = sl.focus || 'Top';
    if (f === 'Whole photo' && !DU.isVideo(sl.img)) return `<span class="fit-blur" aria-hidden="true">${DU.media(sl.img, 'alt="" draggable="false"')}</span>${DU.media(sl.img, `${attrs || ''} class="fit-whole"`)}`;
    const pos = f === 'Center' ? 'center center' : f === 'Bottom' ? 'center 85%' : 'center 18%';
    return DU.media(sl.img, `${attrs || ''} style="object-position:${pos}"`);
  };
  DU.pkHTML = (slides, btn) => (slides.length ? `<section class="pk pk-top" aria-roledescription="carousel" tabindex="0" data-slides>
    <div class="pk-view"><div class="pk-track" data-pk-track>${(slides.length > 1 ? [...slides, ...slides, ...slides] : slides).map((sl, j) => { const i = j % slides.length; return `<figure class="pk-slide" data-slide="${i}" data-pos="${j}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}">
      <a class="pk-pic" href="${DU.esc(sl.link || 'founders-shop.html')}" tabindex="-1" draggable="false">${DU.slideMedia(sl, 'draggable="false"')}</a>
      <figcaption class="pk-cap"><a class="pk-shop" href="${DU.esc(sl.link || 'founders-shop.html')}" tabindex="-1">${DU.esc(btn || 'Shop')}</a><span class="pk-txt"><strong>${DU.esc(DU.t(sl.kicker))}</strong><span>${DU.esc(DU.t(sl.title))}</span></span></figcaption></figure>`; }).join('')}</div></div></section>` : '');
  DU.bindPk = (sb) => {
    if (!sb) return; const els = DU.$$('.pk-slide', sb); const n = els.length / 3;
    if (els.length < 3) { if (els[0]) els[0].classList.add('is-cur', 'is-only'); return; }
    const track = DU.$('[data-pk-track]', sb);
    let pos = n, timer = null, dragging = false, x0 = 0, dx = 0, moved = false;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = () => { const a = els[0].getBoundingClientRect(), b = els[1].getBoundingClientRect(); return b.left - a.left; };
    const offset = (extra) => { const w = els[0].offsetWidth; return (sb.clientWidth - w) / 2 - pos * step() + (extra || 0); };
    const paint = (anim, extra) => { track.style.transition = anim && !still ? 'transform .75s cubic-bezier(.65,0,.35,1)' : 'none'; track.style.transform = `translate3d(${offset(extra)}px,0,0)`; els.forEach((el, j) => { const on = j === pos; el.classList.toggle('is-cur', on); el.setAttribute('aria-hidden', String(!on)); }); };
    const go = (k) => { pos = k; paint(true); };
    track.addEventListener('transitionend', () => { if (pos < n || pos >= 2 * n) { pos = ((pos % n) + n) % n + n; paint(false); } });
    const play = () => { clearInterval(timer); if (!still) timer = setInterval(() => { if (!dragging && document.visibilityState === 'visible') go(pos + 1); }, 5000); };
    sb.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; dragging = true; moved = false; x0 = e.clientX; dx = 0; clearInterval(timer); sb.setPointerCapture(e.pointerId); sb.classList.add('is-drag'); });
    sb.addEventListener('pointermove', (e) => { if (!dragging) return; dx = e.clientX - x0; if (Math.abs(dx) > 6) moved = true; paint(false, dx); });
    const end = () => { if (!dragging) return; dragging = false; sb.classList.remove('is-drag'); const lim = Math.min(120, step() * 0.15); if (dx < -lim) go(pos + 1); else if (dx > lim) go(pos - 1); else paint(true); play(); };
    sb.addEventListener('pointerup', end); sb.addEventListener('pointercancel', end);
    sb.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; } const f = e.target.closest('.pk-slide'); if (f && !f.classList.contains('is-cur')) { e.preventDefault(); e.stopPropagation(); go(Number(f.dataset.pos)); play(); } }, true);
    sb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { go(pos + 1); play(); } if (e.key === 'ArrowLeft') { go(pos - 1); play(); } });
    addEventListener('resize', () => paint(false));
    paint(false); requestAnimationFrame(() => paint(false)); play();
  };

  DU.STATES = [['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming']];
  DU.CITIES = ['Dallas', 'Fort Worth', 'Arlington', 'Irving', 'Garland', 'Plano', 'Frisco', 'Grand Prairie', 'Mesquite', 'Richardson', 'Carrollton', 'McKinney', 'Denton', 'Lewisville', 'Allen', 'Cedar Hill', 'DeSoto', 'Duncanville', 'Rowlett', 'Houston', 'Austin', 'San Antonio', 'El Paso'];
  DU.fanSeed = (d, div) => { const s = d.fanSeed || {}; if (s.on === false) return {}; const o = {}; Object.entries(s.states || {}).forEach(([k, v]) => { o[k] = Math.round(Number(v || 0) / (div || 1)); }); return o; };
  DU.stateName = (c) => { const x = DU.STATES.find((s) => s[0] === String(c || '').toUpperCase()); return x ? x[1] : ''; };
  DU.stateOf = (o) => { if (!o) return ''; if (o.state) return String(o.state).toUpperCase(); const m = String(o.hood || '').match(/,\s*([A-Za-z]{2})\s*$/); return m ? m[1].toUpperCase() : (o.hood ? 'TX' : ''); };
  DU.cityOf = (o) => { if (!o) return ''; if (o.city) return String(o.city).trim(); const h = String(o.hood || '').trim(); return h.replace(/,\s*[A-Za-z]{2}\s*$/, ''); };
  DU.place = (o) => { const c = DU.cityOf(o), st = DU.stateOf(o); return c ? `${c}${st ? `, ${st}` : ''}` : ''; };
  DU.stateSelect = (name, val, extra) => `<select name="${name}" class="input" ${extra || ''}>${DU.STATES.map(([c, n]) => `<option value="${c}" ${c === (val || 'TX') ? 'selected' : ''}>${DU.esc(n)}</option>`).join('')}</select>`;
  const TILES = { AK: [0, 0], ME: [11, 0], WI: [6, 1], VT: [10, 1], NH: [11, 1], WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], MI: [7, 2], NY: [9, 2], MA: [10, 2], OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3], RI: [11, 3], CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4], AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5], OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6], HI: [0, 7], TX: [4, 7], FL: [9, 7] };
  DU.fanMapHTML = (o) => `<section class="bg-deep reveal fanmap" aria-label="Fan map"><div class="container section stack" style="--gap:26px">
    <div class="row between" style="align-items:flex-end"><div class="stack" style="--gap:10px;max-width:640px"><span class="eyebrow">${o.kick}</span><h2 class="serif">${o.title}</h2><p class="lead" style="color:#DCE4F2">${o.text}</p></div><span class="small" style="color:#C9D2E3">${DU.x('fanmap.tap', 'Tap a state to see the count')}</span></div>
    <div class="fm-wrap"><div class="fm-map" data-map></div><ol class="fm-board" data-board></ol></div>
  </div></section>`;
  DU.bindFanMap = (root, getRecs, noun, seed) => {
    let pick = '';
    const esc = DU.esc;
    const draw = () => {
      const recs = getRecs() || []; const by = {}; const cities = {};
      Object.entries(seed || {}).forEach(([k, v]) => { if (TILES[k]) by[k] = (by[k] || 0) + Number(v || 0); });
      recs.forEach((r) => { const st = DU.stateOf(r); if (!TILES[st]) return; by[st] = (by[st] || 0) + 1; const c = DU.cityOf(r); if (c) { cities[st] = cities[st] || {}; cities[st][c] = (cities[st][c] || 0) + 1; } });
      const sorted = Object.entries(by).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]); const max = Math.max(1, sorted.length ? sorted[0][1] : 1);
      if (!pick || !by[pick]) pick = sorted.length ? sorted[0][0] : 'TX';
      const cnt = by[pick] || 0, rank = sorted.findIndex((x) => x[0] === pick) + 1;
      const top = Object.entries(cities[pick] || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
      DU.$('[data-map]', root).innerHTML = `<div class="fm-grid">${Object.entries(TILES).map(([k, [x, y]]) => { const c = by[k] || 0; const a = c ? 0.25 + 0.75 * Math.sqrt(c / max) : 0; return `<button type="button" class="fm-t${c ? ' has' : ''}${k === pick ? ' on' : ''}" data-h="${k}" style="grid-column:${x + 1};grid-row:${y + 1};--a:${a.toFixed(2)}" aria-label="${esc(DU.stateName(k))}: ${c} ${noun}" aria-pressed="${k === pick}">${k}</button>`; }).join('')}</div>
        <div class="fm-card" role="status"><span class="display fm-n">${cnt}</span><span class="stack" style="--gap:2px"><strong>${esc(DU.stateName(pick))}</strong><span class="tiny">${noun}${rank ? ` · #${rank} ${DU.x('fanmap.rank', 'in the country')}` : ''}</span>${top.length ? `<span class="tiny fm-cities">${top.map(([c, n]) => `${esc(c)} ${n}`).join(' · ')}</span>` : ''}</span></div>`;
      DU.$('[data-board]', root).innerHTML = (sorted.length ? sorted.slice(0, 8) : [['TX', 0]]).map(([k, c], i) => `<li><button type="button" data-h="${k}" class="fm-row${k === pick ? ' on' : ''}"><span class="row between" style="width:100%"><span class="bold"><span class="display gold" style="margin-right:10px">${i + 1}</span>${esc(DU.stateName(k))}</span><strong>${c}</strong></span><span class="fm-bar"><span style="width:${Math.round(100 * c / max)}%"></span></span></button></li>`).join('');
      DU.$$('[data-h]', root).forEach((b) => b.addEventListener('click', () => { pick = b.dataset.h; draw(); }));
    };
    draw(); return draw;
  };
  DU.zSlide = (root) => {
    DU.$$('[data-zs]', root || document).forEach((el) => {
      if (el.dataset.zsOn) return; el.dataset.zsOn = '1';
      const nav = document.createElement('div'); nav.className = 'zs-nav';
      nav.innerHTML = `<button type="button" class="zs-b" data-zsm="-1" aria-label="${DU.x('zs.prev', 'Previous')}">${DU.lu('chevron-left')}</button><button type="button" class="zs-b" data-zsm="1" aria-label="${DU.x('zs.next', 'Next')}">${DU.lu('chevron-right')}</button>`;
      el.after(nav);
      const upd = () => { const over = el.scrollWidth > el.clientWidth + 4; nav.hidden = !over; if (!over) return; const [a, b] = nav.children; a.disabled = el.scrollLeft < 4; b.disabled = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4; };
      nav.addEventListener('click', (e) => { const btn = e.target.closest('[data-zsm]'); if (!btn) return; const first = el.firstElementChild; const step = first ? first.getBoundingClientRect().width + 2 : el.clientWidth * 0.8; el.scrollBy({ left: Number(btn.dataset.zsm) * Math.max(step, el.clientWidth * 0.8), behavior: 'smooth' }); });
      el.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); if (window.ResizeObserver) new ResizeObserver(upd).observe(el); setTimeout(upd, 300); upd();
    });
  };
  DU.dragScroll = (root) => {
    DU.$$('.v2-trk, [data-trk], [data-drag]', root || document).forEach((trk) => {
      if (trk.dataset.dragOn) return; trk.dataset.dragOn = '1';
      let down = false, x0 = 0, s0 = 0, moved = false;
      trk.addEventListener('dragstart', (e) => e.preventDefault());
      trk.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; x0 = e.clientX; s0 = trk.scrollLeft; });
      window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - x0; if (!moved && Math.abs(dx) > 5) { moved = true; trk.classList.add('is-drag'); } if (moved) trk.scrollLeft = s0 - dx; });
      const up = () => { if (!down) return; down = false; if (moved) { const left = trk.scrollLeft; trk.classList.remove('is-drag'); trk.scrollLeft = left; } };
      window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      trk.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  };
  DU.layout = (opts) => {
    const o = opts || {};
    const d = DU.store.get();
    if (DU.pageOff) return;
    NAV = NAV_ALL.filter((x) => DU.on(x[2], d)); MORE = MORE_ALL.filter((x) => DU.on(x[2], d));
    if ((d.theme || {}).xmas && (d.theme.xmasBanner || '').trim()) {
      const xb = document.createElement('div'); xb.className = 'xmas-banner'; xb.innerHTML = `<span aria-hidden="true">❄</span> ${DU.esc(d.theme.xmasBanner)} <span aria-hidden="true">❄</span>`;
      document.body.prepend(xb);
    }
    const body = document.body;
    const main = DU.$('#main');

    if (DU.store.isPreview) {
      const pb = document.createElement('div');
      pb.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:140;background:#7A5300;color:#fff;text-align:center;font-weight:800;padding:10px 16px;font-size:14px';
      pb.textContent = 'Preview: you are seeing unpublished changes from the admin.';
      body.appendChild(pb);
    }

    const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = '#main'; skip.textContent = tr('nav.skip');
    body.prepend(skip);

    if (o.v2 && o.shop) { body.classList.add('v2', 'v2-shop'); DU.headerShop(d, o, skip); } else if (o.v2) { body.classList.add('v2'); DU.headerV2(d, o, skip); } else {
    let stripH = 0;
    const nf = DU.nextFixture(d);
    if (o.strip && nf && d.homeTexts.countdownOn !== false && DU.on('strip', d)) {
      const s = document.createElement('div'); s.className = 'strip';
      const [a, b] = DU.teams(nf);
      const st = d.settings || {}; const lg = DU.on('league', d);
      const opp = nf.ha === 'Home' ? b : a;
      const lgLogo = lg ? `<img class="strip-league" src="${DU.esc(DU.pic('brand.leagueLogo', 'assets/brand/upsl.svg'))}" alt="${DU.esc(st.leagueFull || st.league || 'League')}">` : '';
      s.innerHTML = `<div class="container">${lg ? `<span class="strip-lg s-wide">${lgLogo}<span class="strip-lg-name">${DU.esc([st.leagueShort || st.league, st.leagueDivision].filter(Boolean).join(' · '))}</span></span><span class="strip-sep s-wide" aria-hidden="true">|</span>` : ''}`
        + `<span class="s-wide">${tr('strip.next')}: <strong>${DU.esc(a)} ${tr('c.vs')} ${DU.esc(b)}</strong> · ${DU.esc(DU.fmtDay(nf.date))} · ${DU.esc(DU.fmtTime(nf.time))}</span><span class="count s-wide" aria-live="off" data-count></span>`
        + `<span class="s-short">${lgLogo}<span><strong class="hl">${tr('strip.next')}</strong> · ${DU.esc(DU.fmtDay(nf.date))} · <strong>${tr('c.vs')} ${DU.esc(opp)}</strong></span></span></div>`;
      skip.after(s);
      const target = DU.dt(nf.date, nf.time);
      const tick = () => { const ms = target - Date.now(); const el = s.querySelector('[data-count]'); if (ms <= 0) { el.textContent = tr('c.live'); return; } const dd = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, sec = Math.floor(ms / 1e3) % 60; el.textContent = `${dd}${tr('strip.days')} ${pad(h)}:${pad(m)}:${pad(sec)}`; };
      tick(); setInterval(tick, 1000);
      stripH = 1;
    }

    const lang = DU.lang();
    const nav = document.createElement('header'); nav.className = 'nav'; nav.setAttribute('role', 'banner');
    nav.innerHTML = `<div class="nav-bar">
      <a class="brand" href="index.html" aria-label="Dallas United FC, ${tr('nav.home')}"><img src="${DU.CREST_SMALL}" alt=""><span class="brand-name"><strong>DALLAS UNITED</strong><span>FOOTBALL CLUB</span></span></a>
      <nav aria-label="Main"><ul class="nav-links">${NAV.map(([k, href]) => `<li><a href="${href}"${o.active === k ? ' aria-current="page"' : ''}>${tr(`nav.${k}`)}</a></li>`).join('')}</ul></nav>
      <div class="nav-tools">
        <button type="button" class="icon-btn flag-btn" data-lang="${DU.otherLang()}" aria-label="${DU.otherLang() === 'ES' ? 'Cambiar a español' : 'Switch to English'}" title="${DU.LANGS.find((l) => l[0] === DU.otherLang())[1]}">${DU.flag(DU.otherLang())}</button>
        ${DU.on('shop', d) && DU.on('shopOpen', d) ? `<a class="icon-btn bag-btn" href="shop.html#bag" aria-label="${tr('nav.shop')}">${DU.icon('bag')}<span class="bag-dot" data-nav-bag hidden></span></a>` : ''}
        ${DU.on('accounts', d) ? `<a class="icon-btn" href="${DU.pref.get('account', null) ? 'account.html' : 'login.html'}" aria-label="${tr('nav.account')}">${DU.icon('user')}</a>` : ''}
        <button type="button" class="icon-btn menu-btn" aria-label="${tr('nav.menu')}" aria-expanded="false">${DU.icon('menu')}</button>
      </div></div>`;
    (DU.$('.strip') || skip).after(nav);

    const mm = document.createElement('div'); mm.className = 'mobile-menu'; mm.hidden = true; mm.setAttribute('role', 'dialog'); mm.setAttribute('aria-modal', 'true'); mm.setAttribute('aria-label', tr('nav.menu'));
    mm.innerHTML = `<div class="row between" style="margin-bottom:12px"><a class="brand" href="index.html"><img src="${DU.CREST_SMALL}" alt="" style="width:40px"><span class="brand-name"><strong>DALLAS UNITED</strong><span>FOOTBALL CLUB</span></span></a><button type="button" class="icon-btn" data-close aria-label="${tr('nav.close')}">${DU.icon('close')}</button></div>
      <nav aria-label="Mobile">${NAV.map(([k, href]) => `<a href="${href}"${o.active === k ? ' aria-current="page"' : ''}>${tr(`nav.${k}`)} ${DU.icon('arrow')}</a>`).join('')}</nav>
      <nav class="more" aria-label="More" style="margin-top:18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:2px 16px">${MORE.map(([k, href]) => `<a href="${href}">${tr(`nav.${k}`)}</a>`).join('')}${DU.on('accounts', d) ? `<a href="${DU.pref.get('account', null) ? 'account.html' : 'login.html'}">${tr('nav.account')}</a>` : ''}</nav>
      <div class="chips" style="margin-top:24px">${DU.LANGS.map(([k, n]) => `<button type="button" class="chip chip-flag" data-lang="${k}" aria-pressed="${k === lang}">${DU.flag(k)}${n}</button>`).join('')}</div>${DU.on('accounts', d) && !DU.pref.get('account', null) ? `<div class="mm-join"><strong class="mm-join-h">${DU.x('menu.joinH', 'My Dallas United')}</strong><p>${DU.x('menu.joinP', 'Create your free account and become an official member of the club.')}</p><ul>${String(DU.x('menu.joinL', 'Founder card in your phone wallet / Match reminders / Faster shop checkout / Club news first')).split('/').map((x) => x.trim()).filter(Boolean).map((x) => `<li>${x}</li>`).join('')}</ul><div class="mm-join-btns"><a href="login.html">${DU.x('menu.login', 'Sign in')} <span aria-hidden="true">↗</span></a><a href="login.html?join=1">${DU.x('menu.signup', 'Sign up')} <span aria-hidden="true">↗</span></a></div></div>` : ''}`;
    body.appendChild(mm);
    const menuBtn = nav.querySelector('.menu-btn');
    const openMenu = (v) => { mm.hidden = !v; menuBtn.setAttribute('aria-expanded', String(v)); body.style.overflow = v ? 'hidden' : ''; if (v) mm.querySelector('[data-close]').focus(); else menuBtn.focus(); };
    menuBtn.addEventListener('click', () => openMenu(true));
    mm.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) openMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mm.hidden) openMenu(false); });

    DU.$$('[data-lang]').forEach((b) => b.addEventListener('click', () => DU.setLang(b.dataset.lang)));

    let lastY = window.scrollY;
    const stripEl = DU.$('.strip');
    const onScroll = () => {
      const y = window.scrollY;
      const xbEl = DU.$('.xmas-banner'); const sh = (stripEl ? stripEl.offsetHeight : 0) + (xbEl ? xbEl.offsetHeight : 0);
      nav.style.setProperty('--nav-top', `${Math.max(12, sh + 12 - y)}px`);
      if (y > lastY + 4 && y > 160) { nav.classList.add('is-hidden'); }
      else if (y < lastY - 4 || y < 160) nav.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const bagDot = nav.querySelector('[data-nav-bag]');
    if (bagDot) { const n = (DU.pref.get('bag', []) || []).reduce((t, x) => t + (x.qty || 1), 0); if (n) { bagDot.hidden = false; bagDot.textContent = n > 9 ? '9+' : n; } }
    window.addEventListener('resize', onScroll);
    }

    if (o.footer !== false) { body.appendChild(o.v2 ? DU.footerV2(d) : buildFooter(d)); const tt = DU.$('[data-to-top]'); if (tt) tt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }); DU.popup(d); }
    buildCookies();
    DU.reveal();
    DU.dragScroll(); setTimeout(() => DU.dragScroll(), 600);
    DU.watchIcons();
    DU.bindCards(); DU.shopLinks();
    if (main) main.setAttribute('tabindex', '-1');
    registerSW();
  };

  function capFooter() {
    const cap = DU.$('[data-ft-cap]'); if (!cap) return;
    const paint = () => {
      const main = DU.$('#main'); let el = main && main.lastElementChild;
      while (el && (el.hidden || getComputedStyle(el).display === 'none' || el.offsetHeight === 0)) el = el.previousElementSibling;
      let bg = '';
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'transparent' && !/rgba\(0, 0, 0, 0\)/.test(c)) { bg = c; break; } }
      cap.style.background = bg || getComputedStyle(document.body).backgroundColor;
    };
    paint(); setTimeout(paint, 400); window.addEventListener('load', paint);
    const main = DU.$('#main'); if (main && window.MutationObserver) new MutationObserver(paint).observe(main, { childList: true });
  }
  function buildFooter(d) {
    const f = document.createElement('div');
    const s = d.settings;
    const partners = d.partners.filter((p) => p.footer);
    const motto = DU.esc((d.theme || {}).xmas && (d.theme.xmasMotto || '').trim() ? d.theme.xmasMotto : t(d.homeTexts.motto));
    const mottoRow = Array.from({ length: 6 }, () => `<span>${motto} <img src="${DU.esc(DU.pic('brand.marqueeMark', 'assets/brand/du-gold.svg'))}" alt="" style="height:26px;width:auto"></span>`).join('');
    const on = (k) => DU.on(k, d);
    const li = (k, href, label, extra) => (on(k) ? `<li><a href="${href}"${extra || ''}>${label}</a></li>` : '');
    const soc = (k, url, name) => (url ? `<li><a href="${DU.esc(url)}" target="_blank" rel="noopener">${s[`icon_${k}`] ? `<img src="${DU.esc(s[`icon_${k}`])}" alt="" class="soc-ico">` : DU.icon(k)}${name}</a></li>` : '');
    f.innerHTML = `
    <footer class="site-footer ft${on('partners') && on('partnersWall') && partners.length ? ' ft-has-partners' : ''}">
    ${on('partners') && on('partnersWall') && partners.length ? `<section class="ft-partners" aria-label="${tr('f.partners')}">
      <span class="ft-partners-h">${DU.x('footer.partnersH', 'Official club partners')}</span>
      <div class="ft-plogos">${partners.map((p, i) => `<span class="ft-plogo">${DU.partnerLogo(p, i)}</span>`).join('')}</div>
    </section>` : ''}
      <div class="watermark" aria-hidden="true">DU</div>
      <div class="container ft-inner">
        <div class="ft-top">
          <div class="ft-brand">
            <a class="ft-id" href="index.html"><img src="${DU.CREST}" alt="Dallas United FC crest"><span><strong>${DU.esc(s.clubName)}</strong><span>${DU.esc(s.city || 'Dallas, Texas')}</span></span></a>
            <ul class="ft-social" aria-label="${tr('f.follow')}">${soc('ig', s.instagram, 'Instagram')}${soc('tt', s.tiktok, 'TikTok')}${soc('x', s.x, 'X')}${soc('yt', s.youtube, 'YouTube')}${soc('fb', s.facebook, 'Facebook')}</ul>
            <a class="ft-mail" href="mailto:${DU.esc(s.email)}">${DU.esc(s.email)}</a>
          </div>
          <nav class="ft-links" aria-label="${tr('f.club')}">
            <div><h3>${tr('f.club')}</h3><ul>${li('story', 'story.html', tr('nav.story'))}${li('founders', 'founders.html', tr('nav.founders'))}${li('club214', '214-club.html', tr('nav.club214'))}${li('partners', 'partners.html', tr('f.partners'))}</ul></div>
            <div><h3>${DU.x('footer.involved', 'Get involved')}</h3><ul>${li('support', 'support.html', `${tr('nav.support')} 💛`, ' class="ft-gold"')}${li('volunteer', 'volunteer.html', tr('nav.volunteer'))}${on('accounts') ? `<li><a href="${DU.pref.get('account', null) ? 'account.html' : 'login.html'}">${tr('nav.account')}</a></li>` : ''}</ul></div>
          </nav>
          ${on('newsletter') ? `<form class="newsletter ft-news" novalidate>
            <label for="nl-email" class="ft-news-h">${tr('f.newsletter')}</label>
            <div class="inrow"><input id="nl-email" type="email" autocomplete="email" placeholder="${tr('f.yourEmail')}" required><button type="submit" aria-label="${tr('c.send')}">${DU.icon('arrow')}</button></div>
            <label class="check ft-consent"><input type="checkbox" required> ${tr('f.consent')}</label>
            <p class="notice notice-ok" hidden data-ok>${tr('f.newsletterOk')}</p>
          </form>` : ''}
        </div>
        ${DU.on('league', d) ? `<div class="league-row ft-league"><span>${DU.x('footer.member', 'Proud member club of the')}</span><img src="${DU.esc(DU.pic('brand.leagueLogo', 'assets/brand/upsl.svg'))}" alt="${DU.esc(s.leagueShort || s.league || '')}"><span>${DU.esc(s.leagueFull || s.league || '')}</span></div>` : ''}
        <div class="ft-bottom">
          <span>© ${new Date().getFullYear()} ${DU.esc(s.clubName)}</span>
          <ul class="ft-legal" aria-label="${tr('f.legal')}">
            ${DU.legalLis(d)}
          </ul>
          <button type="button" class="ft-top-btn" data-to-top>${DU.x('footer.top', 'Back to top')} <span aria-hidden="true">↑</span></button>
        </div>
      </div>
      <div class="marquee" aria-hidden="true"><div class="track">${mottoRow}${mottoRow}</div></div>
    </footer>`;
    const form = f.querySelector('.newsletter');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const em = form.querySelector('input[type=email]').value, ok = form.querySelector('input[type=checkbox]').checked;
      if (!DU.isEmail(em)) { DU.toast(tr('c.badEmail')); return; }
      if (!ok) { DU.toast(tr('c.required')); return; }
      DU.store.addPublic('subscribersList', { email: em, when: new Date().toISOString().slice(0, 10) }, (dd) => { dd.subscribers = (dd.subscribers || 0) + 1; dd.subscribersList = [{ email: em, when: new Date().toISOString().slice(0, 10) }, ...(dd.subscribersList || [])]; });
      form.querySelector('[data-ok]').hidden = false; form.reset();
    });
    f.querySelectorAll('[data-cookie-open]').forEach((x) => x.addEventListener('click', () => openCookies(true)));
    return f;
  }


  const SV = { instagram: DU.brand('instagram'), facebook: DU.brand('facebook'), x: DU.brand('x'), tiktok: DU.brand('tiktok'), youtube: DU.brand('youtube'),
    bag: DU.lu('shopping-bag'), user: DU.lu('user'), menu: DU.lu('menu'), left: DU.lu('arrow-left'), right: DU.lu('arrow-right'), up: DU.lu('arrow-up'),
    play: DU.lu('play'), pause: DU.lu('pause'), share: DU.lu('share-2'), filter: DU.lu('list-filter') };
  DU.sv = (n) => SV[n] || '';
  DU.socials = (d) => { const s = d.settings || {}; return [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['x', 'X'], ['tiktok', 'TikTok'], ['youtube', 'YouTube']].filter(([k]) => s[k]).map(([k, n]) => [k, s[k], n]); };
  DU.socialBtns = (d, cls) => DU.socials(d).map(([k, url, n]) => `<a class="${cls || 'v2-ic'}" href="${DU.esc(url)}" target="_blank" rel="noopener" aria-label="${n}">${SV[k]}</a>`).join('');
  const v2Name = (cls) => `<span class="brand-name ${cls || ''}"><strong>DALLAS UNITED</strong><span>FOOTBALL CLUB</span></span>`;

  DU.headerV2 = (d, o, skip) => {
    const body = document.body;
    const on = (k) => DU.on(k, d);
    const nav2 = [['news', 'news.html', 'news'], ['matches', 'matches.html', 'matches'], ['team', 'team.html', 'team'], ['dutv', 'dutv.html', 'dutv'], ['club214', '214-club.html', 'club214'], ['tryouts', 'tryouts.html', 'tryouts'], ['shop', 'shop.html', 'shop']].filter((x) => on(x[2]));
    const label = (k) => (k === 'club214' ? DU.x('nav2.214', '214 Club') : tr(`nav.${k}`));
    const soonTag = (k) => (DU.isSoon(k, d) ? `<small class="v2-soon">${DU.x('nav2.soon', 'Soon')}</small>` : '');
    const shopOn = on('shop') && on('shopOpen');
    const acct = DU.pref.get('account', null) ? 'account.html' : 'login.html';
    const st = d.settings || {};
    const top = document.createElement('div'); top.className = 'v2-top';
    top.innerHTML = `<div class="v2-wrap">
      <a class="v2-brand" href="index.html" aria-label="Dallas United FC, ${tr('nav.home')}"><img src="${DU.CREST}" alt=""><span class="v2-bt">${v2Name()}</span></a>
      <div class="v2-tr">
        <div class="v2-tr1">${on('contact') ? `<a class="v2-tl" href="contact.html">${DU.x('nav2.contact', 'Contact')}</a>` : ''}${on('accounts') ? `<a class="v2-ic" href="${acct}" aria-label="${tr('nav.account')}">${SV.user}</a>` : ''}</div>
        <div class="v2-tr2">${on('league') ? `<img class="v2-league" src="${DU.esc(DU.pic('brand.leagueLogo', 'assets/brand/upsl.svg'))}" alt="${DU.esc(st.leagueFull || st.league || 'League')}">` : ''}${on('league') && shopOn ? '<span class="v2-sep" aria-hidden="true"></span>' : ''}${shopOn ? `<a class="v2-btn v2-btn-o v2-store" href="shop.html">${SV.bag}${DU.x('nav2.store', 'Online store')}</a>` : ''}</div>
      </div></div>`;
    skip.after(top);
    const bar = document.createElement('header'); bar.className = 'v2-bar'; bar.setAttribute('role', 'banner');
    bar.innerHTML = `<div class="v2-wrap">
      <a class="v2-mini" href="index.html" tabindex="-1" aria-hidden="true"><img src="${DU.CREST_SMALL}" alt="">${v2Name()}</a>
      <nav aria-label="Main"><ul class="v2-links">${nav2.map(([k, href]) => `<li><a href="${href}"${o.active === k ? ' aria-current="page"' : ''}>${label(k)}${soonTag(k)}</a></li>`).join('')}</ul></nav>
      <div class="v2-tools">
        <button type="button" class="icon-btn flag-btn" data-lang="${DU.otherLang()}" aria-label="${DU.otherLang() === 'ES' ? 'Cambiar a español' : 'Switch to English'}" title="${DU.LANGS.find((l) => l[0] === DU.otherLang())[1]}">${DU.flag(DU.otherLang())}</button>
        ${shopOn ? `<a class="v2-ic v2-bag" href="shop.html#bag" aria-label="${tr('nav.shop')}">${SV.bag}<span class="bag-dot" data-nav-bag hidden></span></a>` : ''}
        ${on('accounts') ? `<span class="v2-late"><a class="v2-ic" href="${acct}" aria-label="${tr('nav.account')}">${SV.user}</a></span>` : ''}
        <button type="button" class="v2-ic v2-burger" aria-label="${tr('nav.menu')}" aria-expanded="false">${SV.menu}</button>
      </div></div>`;
    top.after(bar);
    const mm = document.createElement('div'); mm.className = 'mobile-menu'; mm.hidden = true; mm.setAttribute('role', 'dialog'); mm.setAttribute('aria-modal', 'true'); mm.setAttribute('aria-label', tr('nav.menu'));
    mm.innerHTML = `<div class="row between" style="margin-bottom:12px"><a class="brand" href="index.html"><img src="${DU.CREST_SMALL}" alt="" style="width:40px">${v2Name()}</a><button type="button" class="icon-btn" data-close aria-label="${tr('nav.close')}">${DU.icon('close')}</button></div>
      <nav aria-label="Mobile">${nav2.map(([k, href]) => `<a href="${href}"${o.active === k ? ' aria-current="page"' : ''}>${label(k)} ${DU.icon('arrow')}</a>`).join('')}</nav>
      <nav class="more" aria-label="More" style="margin-top:18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:2px 16px">${MORE.filter((x) => x[0] !== 'club214').map(([k, href]) => `<a href="${href}">${tr(`nav.${k}`)}</a>`).join('')}${on('accounts') ? `<a href="${acct}">${tr('nav.account')}</a>` : ''}</nav>
      <div class="chips" style="margin-top:24px">${DU.LANGS.map(([k, n]) => `<button type="button" class="chip chip-flag" data-lang="${k}" aria-pressed="${k === DU.lang()}">${DU.flag(k)}${n}</button>`).join('')}</div>`;
    body.appendChild(mm);
    const mb = bar.querySelector('.v2-burger');
    const openMenu = (v) => { mm.hidden = !v; mb.setAttribute('aria-expanded', String(v)); body.style.overflow = v ? 'hidden' : ''; if (v) mm.querySelector('[data-close]').focus(); else mb.focus(); };
    mb.addEventListener('click', () => openMenu(true));
    mm.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) openMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mm.hidden) openMenu(false); });
    DU.$$('[data-lang]').forEach((b) => b.addEventListener('click', () => DU.setLang(b.dataset.lang)));
    const onScroll = () => body.classList.toggle('v2-stuck', bar.getBoundingClientRect().top <= 0.5 && window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll();
    const bagDot = bar.querySelector('[data-nav-bag]');
    if (bagDot) { const n = (DU.pref.get('bag', []) || []).reduce((tt, x) => tt + (x.qty || 1), 0); if (n) { bagDot.hidden = false; bagDot.textContent = n > 9 ? '9+' : n; } }
  };

  DU.tvCard = (v, tall) => {
    const meta = [v.date ? DU.fmtDate(v.date) : '', v.len || ''].filter(Boolean).join(' · ');
    return `<button type="button" class="tvx${tall ? ' tall' : ''}" data-play="${DU.esc(v.id)}"><span class="tvx-pic">${DU.media(v.thumb, 'alt="" loading="lazy"')}<span class="tvx-pi" aria-hidden="true">${SV.play}</span>${v.tag ? `<span class="tvx-tag">${DU.esc(v.tag)}</span>` : ''}</span>
      <span class="tvx-cap"><span class="tvx-t">${DU.esc(t(v.title))}</span>${meta ? `<span class="tvx-d">${DU.esc(meta)}</span>` : ''}</span></button>`;
  };
  DU.tvRow = (o) => {
    if (!o.list || !o.list.length) return '';
    const moreCard = o.more ? `<a class="tvx tvx-more${o.tall ? ' tall' : ''}" href="dutv.html"><span>${DU.esc(o.moreText || DU.x('tv.more', 'More on DU TV'))}</span>${SV.right}</a>` : '';
    return `<section class="tvr${o.cls ? ` ${o.cls}` : ''}" data-slider aria-label="${DU.esc(o.title)}"><div class="v2-wrap"><h2 class="tvr-h">${DU.esc(o.title)}</h2></div>
      <div class="v2-trk tvr-trk" data-trk>${o.list.map((v) => DU.tvCard(v, o.tall)).join('')}${moreCard}</div>
      <div class="v2-wrap tvr-foot"><div class="v2-arr"><button type="button" class="v2-ic" data-move="-1" aria-label="${DU.x('tv.prev', 'Previous videos')}">${SV.left}</button><button type="button" class="v2-ic" data-move="1" aria-label="${DU.x('tv.next', 'More videos')}">${SV.right}</button></div>${o.more ? `<a class="v2-more" href="dutv.html">${SV.right}${DU.esc(o.moreText || DU.x('tv.more', 'More on DU TV'))}</a>` : ''}</div></section>`;
  };
  DU.bindTvRows = (root, d) => {
    DU.$$('.tvr', root).forEach((sec) => { const trk = DU.$('[data-trk]', sec); DU.$$('[data-move]', sec).forEach((b) => b.addEventListener('click', () => trk.scrollBy({ left: Number(b.dataset.move) * Math.max(280, trk.clientWidth * 0.7), behavior: 'smooth' }))); });
    DU.$$('.tvx[data-play]', root).forEach((b) => b.addEventListener('click', () => DU.playVideo(d, b.dataset.play)));
  };
  DU.highlightsFor = (d, f) => { const vids = d.videos || []; const own = f && f.highlights ? vids.filter((v) => v.id === f.highlights) : []; const hl = vids.filter((v) => v.cat === 'Highlights' && !own.includes(v)).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))); return [...own, ...hl].slice(0, 7); };

  DU.headerShop = (d, o, skip) => {
    const cats = (d.shopCats || []).filter((c) => c.visible !== false);
    const hasF = (d.products || []).some((p) => p.visible && p.founders);
    const here = DU.param('cat');
    const bar = document.createElement('header'); bar.className = 'shx-menu'; bar.setAttribute('role', 'banner');
    bar.innerHTML = `<div class="v2-wrap shx-menu-in">
      <a class="shx-brand" href="shop.html"><img src="${DU.CREST}" alt=""><strong>${DU.x('shop.storeName', 'Dallas United official store')}</strong></a>
      <nav class="shx-links" aria-label="${DU.x('shop.menuL', 'Shop menu')}">${cats.map((c) => `<a href="shop.html?cat=${encodeURIComponent(c.id)}" data-tile="${DU.esc(c.id)}"${o.shop !== 'founders' && here === c.id ? ' aria-current="page"' : ''}>${DU.esc(t(c.name) || c.id)}</a>`).join('')}${hasF ? `<a class="shx-gold" href="founders-shop.html"${o.shop === 'founders' ? ' aria-current="page"' : ''}>${DU.x('shop.fColl', 'Founders collection')} <span>${DU.x('shop.membersOnly', 'Members only')}</span></a>` : ''}</nav>
      <div class="shx-tools">
        <button type="button" class="icon-btn flag-btn" data-lang="${DU.otherLang()}" aria-label="${DU.otherLang() === 'ES' ? 'Cambiar a español' : 'Switch to English'}" title="${DU.LANGS.find((l) => l[0] === DU.otherLang())[1]}">${DU.flag(DU.otherLang())}</button>
        <a class="v2-ic shx-bag" href="shop.html#bag" data-shop-bag aria-label="${DU.x('shop.bagL', 'Your bag')}">${SV.bag}<span class="bag-dot" data-nav-bag hidden></span></a>
      </div></div>`;
    skip.after(bar);
    DU.$$('[data-lang]', bar).forEach((b) => b.addEventListener('click', () => DU.setLang(b.dataset.lang)));
    const dot = bar.querySelector('[data-nav-bag]');
    const upd = () => { const n = (DU.pref.get('bag', []) || []).reduce((tt, x) => tt + (x.qty || 1), 0); dot.hidden = !n; dot.textContent = n > 9 ? '9+' : n; };
    upd(); window.addEventListener('storage', upd); setInterval(upd, 1500);
  };

  DU.footerV2 = (d) => {
    const f = document.createElement('div');
    const s = d.settings || {}; const H = d.home2 || {};
    const on = (k) => DU.on(k, d);
    const a = (k, href, label) => (!k || on(k) ? `<a href="${href}">${label}</a>` : '');
    const col = (h, links) => { const l = links.join(''); return l ? `<div><h3>${h}</h3>${l}</div>` : ''; };
    const partners = (d.partners || []).filter((p) => p.footer);
    const showP = on('partners') && on('partnersWall') && partners.length;
    const main = partners.filter((p) => /main|kit/i.test(p.tier || ''));
    const other = partners.filter((p) => !main.includes(p));
    const pl = (list, big) => list.map((p) => (p.logo ? `<img class="v2-plogo${big ? ' big' : ''}" src="${DU.esc(p.logo)}" alt="${DU.esc(p.name)}">` : `<span class="v2-pname${big ? ' big' : ''}">${DU.esc(p.name)}</span>`)).map((x, i) => (list[i].link ? `<a href="${DU.esc(list[i].link)}" target="_blank" rel="noopener">${x}</a>` : x)).join('');
    const acct = DU.pref.get('account', null) ? 'account.html' : 'login.html';
    f.innerHTML = `${on('newsletter') ? `<section class="v2-nl" aria-label="${DU.x('v2.nlL', 'Mailing list')}"><div class="v2-wrap">
        <div><h2 class="v2-h2">${DU.esc(t(H.nlTitle) || 'Stay in the loop')}</h2><p>${DU.esc(t(H.nlText) || '')}</p></div>
        <form class="v2-nlf" novalidate><label class="v2-kick" for="nl2-email">${DU.x('v2.email', 'Email address')}</label>
          <div class="v2-nlr"><input id="nl2-email" type="email" autocomplete="email" placeholder="${tr('f.yourEmail')}" required><button class="v2-btn v2-btn-d" type="submit">${DU.x('v2.signup', 'Sign up')}</button></div>
          <label class="v2-cons"><input type="checkbox" required> <span>${DU.esc(t(H.nlNote) || tr('f.consent'))}</span></label>
          <p class="v2-ok" hidden data-ok>${tr('f.newsletterOk')}</p></form></div></section>` : ''}
      <footer class="v2-ft">
        <div class="v2-wrap">
          <div class="v2-ftt"><a href="index.html" aria-label="Dallas United FC"><img src="${DU.CREST}" alt=""></a><div class="v2-fts">${DU.socialBtns(d)}</div></div>
          <nav class="v2-ftc" aria-label="${tr('f.club')}">
            ${col(tr('nav.matches'), [a('matches', 'matches.html', DU.x('v2.f1', 'Fixtures & results')), a('standings', 'matches.html?tab=standings', tr('h.standings')), a('matchCentre', 'match-centre.html', tr('c.matchCentre'))])}
            ${col(tr('nav.team'), [a('team', 'team.html', DU.x('v2.f2', 'Players & staff')), a('tryouts', 'tryouts.html', tr('nav.tryouts'))])}
            ${col(DU.x('v2.fans', 'Fans'), [a('club214', '214-club.html', DU.x('nav2.214', '214 Club')), a('founders', 'founders.html', tr('nav.founders')), on('accounts') ? `<a href="${acct}">${tr('nav.account')}</a>` : ''])}
            ${col(tr('f.club'), [a('story', 'story.html', tr('nav.story')), a('partners', 'partners.html', tr('f.partners')), a('volunteer', 'volunteer.html', tr('nav.volunteer')), a('support', 'support.html', tr('nav.support')), (DU.on('contact', d) ? `<a href="contact.html">${DU.x('v2.contact', 'Contact us')}</a>` : `<a href="mailto:${DU.esc(s.email || '')}">${DU.x('v2.contact', 'Contact us')}</a>`)])}
            ${col('DU TV', [a('dutv', 'dutv.html', DU.x('v2.f3', 'Watch DU TV'))])}
            ${col(DU.x('v2.f4', 'News & shop'), [a('news', 'news.html', tr('h.latest')), on('shop') && on('shopOpen') ? `<a href="shop.html">${DU.x('nav2.store', 'Online store')}</a>` : ''])}
          </nav>
          ${on('partners') && on('partnersWall') ? `<div class="v2-ftp" aria-label="${tr('f.partners')}">${Array.from({ length: 5 }, (_, i) => { const p = partners[i]; const inner = p && p.logo ? `<img src="${DU.esc(p.logo)}" alt="${DU.esc(p.name)}">` : `<span>${DU.x('v2.logo', 'Partner logo')}</span>`; return p && p.link ? `<a class="v2-pslot" href="${DU.esc(p.link)}" target="_blank" rel="noopener">${inner}</a>` : `<span class="v2-pslot">${inner}</span>`; }).join('')}</div>` : ''}
          <div class="v2-ftb">
            <button type="button" class="v2-totop" data-to-top>${DU.x('footer.top', 'Back to top')} ${SV.up}</button>
            <ul class="v2-ftl" aria-label="${tr('f.legal')}">${DU.legalLis(d)}</ul>
          </div>
        </div>
        <div class="v2-cp">© ${new Date().getFullYear()} ${DU.esc(s.clubName || 'Dallas United FC')}</div>
      </footer>`;
    const form = f.querySelector('.v2-nlf');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const em = form.querySelector('input[type=email]').value, ok = form.querySelector('input[type=checkbox]').checked;
      if (!DU.isEmail(em)) { DU.toast(tr('c.badEmail')); return; }
      if (!ok) { DU.toast(tr('c.required')); return; }
      DU.store.addPublic('subscribersList', { email: em, when: new Date().toISOString().slice(0, 10) }, (dd) => { dd.subscribers = (dd.subscribers || 0) + 1; dd.subscribersList = [{ email: em, when: new Date().toISOString().slice(0, 10) }, ...(dd.subscribersList || [])]; });
      form.querySelector('[data-ok]').hidden = false; form.reset();
    });
    f.querySelectorAll('[data-cookie-open]').forEach((x) => x.addEventListener('click', () => openCookies(true)));
    f.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => DU.setLang(b.dataset.lang)));
    return f;
  };

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });

  let cookieEl = null;
  function buildCookies() {
    cookieEl = document.createElement('div'); cookieEl.className = 'cookie'; cookieEl.hidden = true;
    cookieEl.setAttribute('role', 'dialog'); cookieEl.setAttribute('aria-label', tr('ck.title'));
    document.body.appendChild(cookieEl);
    if (!DU.pref.get('cookies', null)) openCookies(false);
  }
  function openCookies(manage) {
    const c = DU.pref.get('cookies', { analytics: true, marketing: false });
    cookieEl.innerHTML = `<strong style="font-size:17px">${tr('ck.title')}</strong><span>${tr('ck.text')} <a class="link" href="legal.html?tab=cookies">${tr('f.cookies')}</a></span>
      ${manage ? `<div class="stack" style="--gap:6px;border-top:1px solid var(--line-2);padding-top:10px">
        <label class="toggle"><span><strong>${tr('ck.needed')}</strong></span><input type="checkbox" checked disabled></label>
        <label class="toggle"><span>${tr('ck.analytics')}</span><input type="checkbox" data-a ${c.analytics ? 'checked' : ''}></label>
        <label class="toggle"><span>${tr('ck.marketing')}</span><input type="checkbox" data-m ${c.marketing ? 'checked' : ''}></label>
        <button type="button" class="btn btn-navy" data-save>${tr('ck.save')}</button></div>`
        : `<div class="row" style="--gap:8px"><button type="button" class="btn btn-navy" style="flex:1 1 140px" data-all>${tr('ck.all')}</button><button type="button" class="btn btn-outline" style="flex:1 1 140px" data-none>${tr('ck.necessary')}</button></div>
        <button type="button" class="link" style="background:none;border:none;min-height:40px" data-manage>${tr('ck.choose')}</button>`}`;
    cookieEl.hidden = false;
    const done = (v) => { DU.pref.set('cookies', v); cookieEl.hidden = true; };
    const q = (s) => cookieEl.querySelector(s);
    if (q('[data-all]')) q('[data-all]').onclick = () => done({ analytics: true, marketing: true });
    if (q('[data-none]')) q('[data-none]').onclick = () => done({ analytics: false, marketing: false });
    if (q('[data-manage]')) q('[data-manage]').onclick = () => openCookies(true);
    if (q('[data-save]')) q('[data-save]').onclick = () => done({ analytics: q('[data-a]').checked, marketing: q('[data-m]').checked });
  }
  DU.openCookies = openCookies;

  function registerSW() {
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  DU.fxCard = (f, d) => {
    const [a, b] = DU.teams(f), [sa, sb] = DU.score(f);
    const done = f.status === 'Full time', live = f.status === 'Live' || f.status === 'Half-time';
    const actions = [];
    if (done) { if (DU.on('matchCentre', d)) actions.push(`<a class="btn btn-sm btn-navy" href="match-centre.html?id=${f.id}">${tr('c.matchCentre')}</a>`); if (f.highlights && DU.on('dutv', d)) actions.push(`<a class="btn btn-sm btn-outline" href="dutv.html">${DU.icon('play')} ${tr('c.highlights')}</a>`); }
    else if (live) actions.push(`<a class="btn btn-sm btn-live" href="match-centre.html?id=${f.id}"><span class="live-dot"></span>${tr('c.live')} · ${tr('c.matchCentre')}</a>`);
    else { if (DU.ticketsOn(d)) actions.push(`<a class="btn btn-sm btn-gold" href="${DU.esc(DU.ticketUrl(f, d))}" target="_blank" rel="noopener">${f.ha === 'Home' ? tr('c.tickets') : tr('c.awayTickets')} ↗</a>`); actions.push(DU.calButton(DU.fxEvent(f))); }
    return `<article class="match-card lift">
      <div class="match-meta"><span>${DU.esc(DU.compName(f.comp))}</span>${live ? `<span class="live-chip"><span class="live-dot"></span>${tr('c.live')}${(DU.liveFor(d, f) || {}).label ? ` · ${DU.liveFor(d, f).label}` : ''}</span>` : `<span>${DU.esc(DU.fmtDay(f.date))} · ${DU.esc(DU.fmtTime(f.time))}</span>`}</div>
      <div class="match-teams"><div class="match-team"><span class="crest-box">${DU.crestFor(a, f)}</span><span>${DU.esc(a)}</span></div>
      <div class="match-score">${done || live ? `${DU.esc(sa || 0)}–${DU.esc(sb || 0)}` : `<span style="font-size:.6em;color:var(--muted)">${tr('c.vs')}</span>`}</div>
      <div class="match-team"><span class="crest-box">${DU.crestFor(b, f)}</span><span>${DU.esc(b)}</span></div></div>
      <div class="tiny muted center" style="display:flex">${DU.esc(f.venue)}${done ? ` · ${DU.esc(DU.statusName(f.status))}` : ''}</div>
      <div class="match-actions">${actions.join('')}</div></article>`;
  };
  DU.standingsTable = (rows, compact) => {
    const sorted = [...rows].sort((a, b) => (b.pts - a.pts) || ((b.gf - b.ga) - (a.gf - a.ga)) || (b.gf - a.gf));
    return `<div class="table-wrap"><table class="standings"><thead><tr><th>#</th><th>${tr('m.club')}</th><th class="num">P</th>${compact ? '' : '<th class="num">W</th><th class="num">D</th><th class="num">L</th><th class="num">GF</th><th class="num">GA</th>'}<th class="num">GD</th><th class="num">Pts</th>${compact ? '' : '<th>Form</th>'}</tr></thead><tbody>
      ${sorted.map((r, i) => `<tr class="${r.us ? 'is-us' : ''}"><td>${i + 1}</td><td><strong>${DU.esc(r.name)}</strong></td><td class="num">${r.p}</td>${compact ? '' : `<td class="num">${r.w}</td><td class="num">${r.d}</td><td class="num">${r.l}</td><td class="num">${r.gf}</td><td class="num">${r.ga}</td>`}<td class="num">${(r.gf - r.ga) > 0 ? '+' : ''}${r.gf - r.ga}</td><td class="num"><strong>${r.pts}</strong></td>${compact ? '' : `<td><span class="form-dots">${String(r.form || '').split('').map((c) => `<span class="f-${c}" aria-label="${c}">${c}</span>`).join('')}</span></td>`}</tr>`).join('')}
    </tbody></table></div>`;
  };
  DU.newsCard = (p) => `<a class="news-card lift" href="news.html?post=${p.id}"><div class="thumb">${DU.media(p.img, 'loading="lazy"')}</div><div class="body"><span class="cat">${DU.esc(p.cat)}</span><span class="title">${DU.esc(t(p.title))}</span><span class="tiny muted" style="margin-top:auto">${DU.esc(DU.fmtDate(p.date))}</span></div></a>`;
  DU.publishedPosts = (d) => {
    const now = new Date();
    return d.posts.filter((p) => p.status === 'Published' || (p.status === 'Scheduled' && p.when && new Date(p.when) <= now))
      .map((p) => (p.status === 'Scheduled' ? { ...p, date: p.when.slice(0, 10) } : p))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  };
  DU.schema = (key, obj) => {
    let el = document.querySelector(`script[data-schema="${key}"]`);
    if (!obj) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.dataset.schema = key; document.head.appendChild(el); }
    el.textContent = JSON.stringify(obj);
  };
  const isoChicago = (date, time) => {
    const t = (time || '12:00').slice(0, 5);
    let off = '-06:00';
    try { const m = new Date(`${date}T${t}:00Z`).toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'shortOffset' }).match(/GMT([+-]\d+)/); if (m) off = `${m[1][0]}${String(Math.abs(+m[1])).padStart(2, '0')}:00`; } catch (e) {  }
    return `${date}T${t}:00${off}`;
  };
  const absUrl = (p) => { try { return new URL(p, location.href).href; } catch (e) { return p; } };
  const placeOf = (name) => { const parts = String(name || '').split(',').map((x) => x.trim()).filter(Boolean); return { '@type': 'Place', name: name || 'Dallas, TX', address: { '@type': 'PostalAddress', addressLocality: parts.length > 1 ? parts[parts.length - 1] : 'Dallas', addressRegion: 'TX', addressCountry: 'US' } }; };
  DU.seoEvents = () => {
    try {
      const d = DU.store.get(); const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      const today = new Date().toISOString().slice(0, 10);
      const club = { '@type': 'SportsTeam', name: 'Dallas United FC', url: absUrl('index.html') };
      if (page === 'tryouts.html' && DU.on('tryouts', d) && (d.tryTexts || {}).open !== false) {
        const list = (d.sessions || []).filter((s) => s.date >= today).map((s) => ({
          '@type': 'Event', name: 'Dallas United FC Open Soccer Tryout', startDate: isoChicago(s.date, s.time),
          endDate: isoChicago(s.date, String(Math.min(23, +(s.time || '09:00').slice(0, 2) + 3)).padStart(2, '0') + (s.time || '09:00').slice(2, 5)),
          eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: placeOf(s.place), image: [absUrl('assets/brand/share.jpg')],
          description: `Free open soccer tryout for players ${(d.tryTexts || {}).minAge || 18} and over. Sign up online at the Dallas United FC website.`,
          organizer: club, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: absUrl('tryouts.html'), availability: s.signed >= s.cap ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock', validFrom: '2026-01-01' },
        }));
        DU.schema('tryouts', list.length ? { '@context': 'https://schema.org', '@graph': list } : null);
      }
      if ((page === 'matches.html' || page === 'index.html') && DU.on('matches', d)) {
        const list = DU.sortFx(d.fixtures || []).filter((f) => f.status === 'Upcoming' && f.date >= today).slice(0, 10).map((f) => {
          const home = f.ha === 'Home' ? 'Dallas United FC' : f.opp, away = f.ha === 'Home' ? f.opp : 'Dallas United FC';
          return { '@type': 'SportsEvent', name: `${home} vs ${away}`, sport: 'Soccer', startDate: isoChicago(f.date, f.time),
            eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: placeOf(f.venue), image: [absUrl('assets/brand/share.jpg')], description: `${home} vs ${away} (${f.comp}).`,
            homeTeam: { '@type': 'SportsTeam', name: home }, awayTeam: { '@type': 'SportsTeam', name: away }, organizer: club, url: absUrl('matches.html') };
        });
        DU.schema('matches', list.length ? { '@context': 'https://schema.org', '@graph': list } : null);
      }
    } catch (e) {  }
  };
  window.addEventListener('load', DU.seoEvents);
})();
