(function () {
  if (DU.soonPage()) return;
  const d = DU.store.get(), esc = DU.esc, money = DU.money;
  const main = DU.$('#main');
  const players = d.people.filter((p) => p.group === 'Player');
  const FANS = {
    maria: { name: 'Maria Garcia', first: 'Maria', email: 'maria@example.com', phone: '(214) 555-0142', hood: 'Dallas, TX', city: 'Dallas', state: 'TX', bday: 'May 12', since: 'Oct 2026', founder: 1241, club: 87, tv: 'Video', support: 10, given: 30, fav: (players.find((p) => p.no === '9') || players[0]).id,
      orders: [{ id: 'DU-1042', date: 'Oct 29', item: 'Home Jersey 26/27', extra: 'GARCIA 10 · Size M', img: 'assets/img/home-jersey.jpg', total: 105, step: 2 }, { id: 'DU-1018', date: 'Oct 12', item: 'Crest Hoodie', extra: 'Size L', img: 'assets/img/hoodie.jpg', total: 65, step: 3 }] },
    newfan: { name: 'Jordan Lee', first: 'Jordan', email: 'jordan@example.com', phone: '', hood: 'Garland, TX', city: 'Garland', state: 'TX', bday: '', since: 'Today', founder: 0, club: 0, tv: '', support: 0, given: 0, fav: '', orders: [], questions: [] },
    superfan: { name: 'Carlos Rivera', first: 'Carlos', email: 'carlos@example.com', phone: '(469) 555-0199', hood: 'Dallas, TX', city: 'Dallas', state: 'TX', bday: 'Aug 3', since: 'Sep 2026', founder: 12, club: 3, tv: 'Video', support: 25, given: 125, fav: (players.find((p) => p.no === '10') || players[1]).id,
      orders: [{ id: 'DU-1051', date: 'Nov 1', item: 'Away Jersey 26/27', extra: 'RIVERA 12 · Size L', img: 'assets/img/away-jersey.jpg', total: 105, step: 1 }, { id: 'DU-1033', date: 'Oct 20', item: 'Founders Scarf', extra: '', img: 'assets/img/scarf.jpg', total: 25, step: 3 }, { id: 'DU-1009', date: 'Oct 5', item: 'Crest Hoodie', extra: 'Size XL', img: 'assets/img/hoodie.jpg', total: 65, step: 3 }] }
  };
  const fmtD = (iso) => { if (!iso) return ''; const x = new Date(`${iso}T12:00`); return isNaN(x) ? String(iso) : x.toLocaleDateString(DU.locale(), { month: 'short', day: 'numeric' }); };
  const sameMail = (a, b) => String(a || '').toLowerCase() === String(b || '').toLowerCase() && !!a;
  const STATUS_STEP = { Paid: 0, Packed: 1, Shipped: 2, 'On its way': 2, Delivered: 3, 'Picked up': 3, Ready: 2 };
  const prodImg = (items) => { const p = d.products.find((x) => String(items || '').toLowerCase().includes(String(DU.t(x.name)).toLowerCase().replace(/ 26\/27/, '').split(' ').slice(0, 2).join(' '))); return p ? p.img : DU.CREST_SMALL; };
  function realFan(email) {
    const rec = (d.fans || []).find((x) => sameMail(x.email, email)) || {};
    const acc = DU.pref.get('account', {}) || {};
    const first = rec.first || acc.first || String(email).split('@')[0];
    const pf = DU.pref.get('founder', null);
    const fo = d.founders.find((f) => sameMail(f.email, email)) || (pf && sameMail(pf.email, email) ? pf : null);
    const pc = DU.pref.get('club214', null);
    const cl = (d.fanclub || []).find((x) => sameMail(x.email, email)) || (pc && sameMail(pc.email, email) ? pc : null);
    const dons = (d.donations || []).filter((x) => sameMail(x.email, email));
    const monthly = dons.filter((x) => x.kind === 'Monthly');
    return {
      real: true, name: `${first} ${rec.last || ''}`.trim(), first, last: rec.last || '', email: rec.email || email, phone: rec.phone || '', hood: DU.place(rec) || DU.place(fo) || DU.place(cl) || '', city: DU.cityOf(rec) || DU.cityOf(fo) || DU.cityOf(cl) || '', state: DU.stateOf(rec) || DU.stateOf(fo) || DU.stateOf(cl) || 'TX', bday: rec.bday || '', size: rec.size || '',
      since: fmtD(rec.joined) || 'today', founder: fo && fo.status !== 'rejected' ? fo.no : 0, founderPending: !!(fo && fo.status === 'pending'), club: cl ? cl.no : 0, tv: rec.tv || '', support: rec.support != null ? rec.support : (monthly[0] ? monthly[0].amount : 0),
      given: dons.reduce((a, x) => a + Number(x.amount || 0), 0), history: dons, fav: rec.fav || '',
      orders: (d.orders || []).filter((o) => sameMail(o.email, email)).map((o) => ({ id: o.id, date: fmtD(o.when), item: o.items, extra: o.ship === 'Pick up' ? 'Pick up at training or a home match' : '', img: prodImg(o.items), total: o.total, step: STATUS_STEP[o.status] != null ? STATUS_STEP[o.status] : 0 })),
      notif: { email: true, goals: true, bday: true, merch: true, partners: false, ...(rec.notif || {}) }
    };
  }
  FANS.maria.notif = { email: true, goals: true, bday: true, merch: true, partners: false }; FANS.newfan.notif = { ...FANS.maria.notif }; FANS.superfan.notif = { ...FANS.maria.notif };
  const asFan = DU.param('asFan');
  const me = DU.pref.get('account', null);
  if (!asFan && !me) { location.replace('login.html'); return; }
  const preview = !!asFan;
  let who = asFan && FANS[asFan] ? asFan : (asFan ? 'email' : 'me');
  let tab = location.hash.slice(1) || 'overview';
  const cache = {};
  const F = () => { if (FANS[who]) return FANS[who]; const em = who === 'email' ? asFan : me.email; if (!cache[em]) cache[em] = realFan(em); return cache[em]; };
  const save = (patch) => {
    Object.assign(F(), patch);
    if (preview) return;
    const em = F().email;
    DU.store.addPublic(null, null, (dd) => { dd.fans = dd.fans || []; let r = dd.fans.find((x) => sameMail(x.email, em)); if (!r) { r = { id: `fan${dd.fans.length + 1}`, email: em, first: F().first, joined: new Date().toISOString().slice(0, 10) }; dd.fans.push(r); } Object.assign(r, patch); });
  };
  const pad = (n) => String(n).padStart(4, '0');
  const TABS = [['overview', 'Overview', 'house'], ['cards', 'My cards', 'credit-card'], ['matches', 'My matches', 'calendar'], ['orders', 'My orders', 'shopping-bag'], ['tv', 'DU TV pass', 'tv'], ['support', 'My support', 'heart'], ['profile', 'Profile & settings', 'user']];
  const TAB_ON = { overview: true, cards: true, matches: DU.on('matches', d), orders: DU.on('shop', d), tv: DU.on('dutv', d) && DU.on('tvPass', d), support: DU.on('support', d), profile: true };
  const TABS_ON = () => TABS.filter((x) => TAB_ON[x[0]]);
  const ico = (name, s = 18) => DU.lu(name).replace('<svg ', `<svg width="${s}" height="${s}" `);
  const card = (title, body, link, style) => `<div class="acc-card" style="${style || ''}"><div class="acc-h"><h3>${title}</h3>${link ? `<a href="#${link[0]}" data-go="${link[0]}">${link[1]}</a>` : ''}</div>${body}</div>`;
  const nf = DU.nextFixture(d);
  const fav = () => d.people.find((p) => p.id === F().fav);
  const STEPS = ['Paid', 'Packed', 'On its way', 'Delivered'];

  const founderCard = () => (F().founder ? `<div class="acc-mcard fc"><span class="w" aria-hidden="true">DU</span><span class="r"><span class="r" style="gap:8px"><img src="${DU.CREST_SMALL}" alt="" style="width:30px"><span><strong class="display" style="font-size:15px">DALLAS UNITED</strong><br><span style="font-size:9px;font-weight:800;letter-spacing:.2em">FOUNDER</span></span></span><span class="display" style="font-size:26px">#${pad(F().founder)}</span></span><span><strong class="display" style="font-size:24px;line-height:1">${esc(F().name.toUpperCase())}</strong><br><span class="small bold">${esc(F().hood)} · EST. 2026</span></span></div>`
    : `<div class="acc-empty"><strong>No founder number yet</strong><span class="small muted">The first 500 fans get a number forever.</span><a class="btn btn-gold btn-sm" href="founders.html#join">Claim your number</a></div>`);
  const clubCard = () => (F().club ? `<div class="acc-mcard cc"><span class="w" aria-hidden="true">214</span><span class="r"><span class="r" style="gap:8px"><img src="${DU.CREST_SMALL}" alt="" style="width:30px"><span><strong class="display" style="font-size:15px">THE 214 CLUB</strong><br><span style="font-size:9px;font-weight:800;letter-spacing:.2em;color:var(--gold)">MEMBER</span></span></span><span class="display gold" style="font-size:22px">#${pad(F().club)}</span></span><span><strong class="display" style="font-size:24px;line-height:1">${esc(F().name.toUpperCase())}</strong><br><span class="small bold" style="color:#DCE4F2">Member since 2026</span></span></div>`
    : `<div class="acc-empty"><strong>Not in the 214 Club yet</strong><span class="small muted">Free supporters club. Join in one tap.</span><button type="button" class="btn btn-gold btn-sm" data-join214>Join free</button></div>`);
  const wallet = (what) => (!DU.on('walletCards', d) ? '' : `<div class="acc-two"><button type="button" class="btn btn-sm btn-navy" data-wallet="Apple Wallet|${what}">Apple Wallet</button><button type="button" class="btn btn-sm btn-outline" data-wallet="Google Wallet|${what}">Google Wallet</button></div>`);
  const nextMatch = (dark) => (nf ? (() => { const [a, b] = DU.teams(nf); return `<div class="match-teams" style="gap:10px;margin:4px 0 6px"><div class="match-team" style="${dark ? 'color:#fff' : ''}">${DU.crestFor(a, nf)}<span>${esc(a)}</span></div><div style="font-size:34px;padding-top:12px"><span class="big-time">${DU.timeHTML(nf.time)}</span></div><div class="match-team" style="${dark ? 'color:#fff' : ''}">${DU.crestFor(b, nf)}<span>${esc(b)}</span></div></div>
    <div class="acc-two">${DU.calButton(DU.fxEvent(nf), 'Add to calendar', dark ? 'btn btn-sm btn-outline btn-cal-light' : 'btn btn-sm btn-outline')}<a class="btn btn-sm btn-gold" href="match-centre.html?id=${nf.id}">Match Centre</a></div>`; })() : '<p class="muted">No match planned.</p>');

  const SECTIONS = {
    overview: () => `<div class="acc-grid">
      ${card(`Next match <span class="pill-s">${nf ? esc(DU.fmtDay(nf.date)) : ''}</span>`, nextMatch(true), ['matches', 'All my matches'], 'background:var(--navy);color:#fff;grid-column:span 4')}
      ${card('My player', fav() ? `<div class="r" style="gap:14px;justify-content:flex-start"><img src="${esc(fav().img)}" alt="" class="acc-fav"><span><span class="display" style="font-size:40px;color:var(--blue);line-height:1;display:block">${esc(fav().no)}</span><strong>${esc(fav().first)} ${esc(fav().last)}</strong><br><span class="small muted">${esc(fav().pos)} · ${fav().goals || 0} goals</span></span></div>` : '<p class="small muted">Pick your favorite player.</p>', ['cards', fav() ? 'Change' : 'Pick one'], 'grid-column:span 2')}
      ${DU.on('founders', d) ? card('Founder card', founderCard() + (F().founder && !F().founderPending ? wallet('Founder card') : ''), ['cards', 'My cards'], 'grid-column:span 3') : ''}
      ${DU.on('club214', d) ? card('The 214 Club', clubCard(), ['cards', 'My cards'], 'grid-column:span 3') : ''}
      ${DU.on('shop', d) ? card('My orders', F().orders.length ? F().orders.slice(0, 2).map(orderRow).join('') : '<p class="small muted">No orders yet. <a class="link" href="shop.html">Visit the shop →</a></p>', ['orders', 'All orders'], 'grid-column:span 3') : ''}
      ${!DU.on('dutv', d) ? '' : DU.on('tvPass', d) ? card('DU TV pass', F().tv ? `<div class="r"><span><strong>${F().tv} pass · ${esc(F().tv === 'Video' ? d.tvTexts.videoPrice : d.tvTexts.audioPrice)}</strong><br><span class="small muted">Renews Dec 1</span></span><span class="pill-ok">Active</span></div><a class="btn btn-sm btn-gold" href="dutv.html">${DU.icon('play')} Watch highlights</a>` : '<p class="small muted">No pass. Watch every match live and on demand.</p><button type="button" class="btn btn-sm btn-gold" data-go="tv">Get the pass</button>', ['tv', 'Manage'], 'grid-column:span 3') : card('DU TV', `<p class="small muted">Every match, highlights and behind the scenes. Free for every fan.</p><a class="btn btn-sm btn-gold" href="dutv.html">${DU.icon('play')} Watch DU TV</a>`, null, 'grid-column:span 3')}
    </div>`,

    cards: () => `<div class="acc-grid">
      ${DU.on('founders', d) ? card('Founder card', founderCard() + (F().founder && !F().founderPending ? wallet('Founder card') + '<button type="button" class="btn btn-sm btn-outline" data-text>Text it to my phone</button>' : ''), null, `grid-column:span ${DU.on('club214', d) ? 3 : 6}`) : ''}
      ${DU.on('club214', d) ? card('The 214 Club card', clubCard() + (F().club ? wallet('214 Club card') : ''), null, `grid-column:span ${DU.on('founders', d) ? 3 : 6}`) : ''}
      ${card('My favorite player', `<label class="field">Pick a player<select data-fav><option value="">Choose…</option>${players.map((p) => `<option value="${p.id}" ${p.id === F().fav ? 'selected' : ''}>#${esc(p.no)} ${esc(p.first)} ${esc(p.last)}</option>`).join('')}</select></label>${fav() ? `<div class="r" style="gap:14px;justify-content:flex-start;margin-top:6px"><img src="${esc(fav().img)}" alt="" class="acc-fav"><span><strong>${esc(fav().first)} ${esc(fav().last)}</strong><br><span class="small muted">You get their player card and a message on their birthday.</span></span></div>${wallet(`${fav().last} player card`)}` : ''}`, null, 'grid-column:span 6')}
    </div>`,

    matches: () => { const up = DU.sortFx(d.fixtures).filter((f) => f.status !== 'Full time'); const done = DU.sortFx(d.fixtures).filter((f) => f.status === 'Full time').reverse();
      return `<div class="stack" style="--gap:16px">${card('Coming up', `<div class="grid" style="--min:260px">${up.map((f) => DU.fxCard(f, d)).join('')}</div>`, null, '')}
      ${card('Results', `<div class="grid" style="--min:260px">${done.map((f) => DU.fxCard(f, d)).join('')}</div>`, null, '')}
      ${card('Remind me', `<div class="acc-tog"><span>Text me 1 hour before kick-off</span><button type="button" class="acc-sw ${F().notif.remind !== false ? 'on' : ''}" data-sw="remind" aria-pressed="${F().notif.remind !== false}"></button></div><div class="acc-tog"><span>Goal alerts during the match</span><button type="button" class="acc-sw ${F().notif.goals ? 'on' : ''}" data-sw="goals" aria-pressed="${!!F().notif.goals}"></button></div><div class="acc-tog"><span>Final score by email</span><button type="button" class="acc-sw ${F().notif.ft ? 'on' : ''}" data-sw="ft" aria-pressed="${!!F().notif.ft}"></button></div>`, null, '')}</div>`; },

    orders: () => (F().orders.length ? `<div class="stack" style="--gap:12px">${F().orders.map((o) => `<button type="button" class="acc-card acc-order" data-order="${o.id}"><img src="${esc(o.img)}" alt=""><span style="flex:1;text-align:left"><strong>${esc(o.item)}</strong><br><span class="small muted">${esc(o.extra)}${o.extra ? ' · ' : ''}Order ${o.id} · ${o.date}</span></span><span class="stack" style="--gap:6px;align-items:flex-end"><strong>${money(o.total)}</strong>${statusPill(o.step)}</span></button>`).join('')}</div>`
      : card('My orders', '<div class="acc-empty"><strong>No orders yet</strong><span class="small muted">Jerseys, scarves and more in the official store.</span><a class="btn btn-gold btn-sm" href="shop.html">Visit the shop</a></div>', null, '')),

    tv: () => card('DU TV pass', `<div class="acc-plans">${[['', 'No pass', 'Free highlights only', '$0'], ['Audio', 'Audio pass', 'Live radio for every match', d.tvTexts.audioPrice], ['Video', 'Video pass', 'Every match live + full replays', d.tvTexts.videoPrice]].map(([k, n, s, p]) => `<button type="button" class="acc-plan ${F().tv === k ? 'on' : ''}" data-plan="${k}"><strong>${n}</strong><span class="small">${s}</span><span class="display" style="font-size:22px">${esc(p)}</span>${F().tv === k ? '<span class="pill-ok">Your plan</span>' : ''}</button>`).join('')}</div>
      ${F().tv ? `<div class="r" style="border-top:1px solid var(--line);padding-top:12px"><span class="small">Renews <strong>Dec 1</strong> · Visa ••4821</span><span class="row" style="--gap:8px"><button type="button" class="btn btn-sm btn-outline" data-paycard>Change card</button><button type="button" class="btn btn-sm" style="background:var(--red);color:#fff" data-plan="">Cancel pass</button></span></div>
      <h4 style="margin:8px 0 0">Keep watching</h4><div class="acc-two">${d.videos.slice(0, 2).map((v) => `<a href="dutv.html" class="acc-vid"><img src="${esc(v.thumb)}" alt=""><span>${esc(DU.t(v.title))}</span></a>`).join('')}</div>` : ''}`, null, ''),

    support: () => {
      const monthly = (F().support ? `<div class="r"><span><span class="display" style="font-size:40px">${money(F().support)}</span><span class="muted"> / month</span><br><span class="small muted">Thank you! You’ve given ${money(F().given)} so far.</span></span><span class="pill-ok">Active</span></div>` : '<p class="small muted">You’re not a monthly supporter yet.</p>')
        + `<span class="small bold">${F().support ? 'Change amount' : 'Start monthly support'}</span><div class="row" style="--gap:8px">${[5, 10, 25, 50].map((a) => `<button type="button" class="chip" aria-pressed="${F().support === a}" data-amt="${a}">${money(a)}</button>`).join('')}</div>`
        + (F().support ? '<button type="button" class="link" style="background:none;border:none;align-self:flex-start;padding:0;color:var(--red)" data-amt="0">Stop monthly support</button>' : '');
      const once = `<p class="small muted" style="margin:0">One-time gift to help with kits, fields and travel.</p><div class="row" style="--gap:8px">${[10, 25, 50, 100].map((a) => `<button type="button" class="chip" data-once="${a}">${money(a)}</button>`).join('')}</div>`;
      const months = ['Nov 1', 'Oct 1', 'Sep 1'].slice(0, Math.max(1, Math.min(3, Math.round(F().given / (F().support || 10)))));
      const hist = F().given ? `<table class="standings"><thead><tr><th>Date</th><th>Type</th><th class="num">Amount</th><th></th></tr></thead><tbody>${months.map((dt) => `<tr><td>${dt}</td><td>Monthly</td><td class="num">${money(F().support || 10)}</td><td><button type="button" class="link" style="background:none;border:none;padding:0" data-receipt>Receipt</button></td></tr>`).join('')}</tbody></table>` : '<p class="small muted">Nothing yet.</p>';
      return `<div class="acc-grid">${card('Monthly support', monthly, null, 'grid-column:span 3')}${card('Give once', once, null, 'grid-column:span 3')}${card('History', hist, null, 'grid-column:span 6')}</div>`;
    },

    profile: () => `<div class="acc-grid">${card('Profile', `<div class="form-grid"><label class="field">Full name<input data-pf="name" autocomplete="name" value="${esc(F().name)}"></label><label class="field">Email<input value="${esc(F().email)}" type="email" readonly title="Ask the club to change your email"></label><label class="field">Phone<input data-pf="phone" type="tel" autocomplete="tel" value="${esc(F().phone)}" placeholder="(214) 555-0123"></label><label class="field">City<input data-pf="city" value="${esc(DU.cityOf(F()))}" placeholder="Dallas" autocomplete="address-level2"></label><label class="field">State${DU.stateSelect('st', DU.stateOf(F()) || 'TX', 'data-pf="state"')}</label><label class="field">Birthday<input data-pf="bday" value="${esc(F().bday)}" placeholder="Month and day, e.g. May 12"></label><label class="field">Shirt size<select data-pf="size">${['', 'S', 'M', 'L', 'XL', 'XXL'].map((z) => `<option value="${z}" ${z === (F().size || '') ? 'selected' : ''}>${z || 'Choose…'}</option>`).join('')}</select></label></div><button type="button" class="btn btn-gold btn-sm" style="align-self:flex-start" data-save>Save changes</button>`, null, 'grid-column:span 4')}
      ${card('Language', `<div class="stack" style="--gap:8px">${DU.LANGS.map(([k, n]) => `<button type="button" class="chip chip-flag" aria-pressed="${k === DU.lang()}" data-langp="${k}">${DU.flag(k)}${n}</button>`).join('')}</div>`, null, 'grid-column:span 2')}
      ${card('What I get', [['email', 'Weekly club email', 'newsletter'], ['goals', 'Goal alerts by text'], ['bday', 'Birthday message from the club'], ['merch', 'New merch drops', 'shop'], ['partners', 'Partner offers', 'partners']].filter((x) => !x[2] || DU.on(x[2], d)).map(([k, l]) => `<div class="acc-tog"><span>${l}</span><button type="button" class="acc-sw ${F().notif[k] ? 'on' : ''}" data-sw="${k}" aria-pressed="${!!F().notif[k]}"></button></div>`).join(''), null, 'grid-column:span 3')}
      ${card('Security', `<button type="button" class="btn btn-sm btn-outline" data-pw>Change password</button><div class="r"><span class="small">Signed in with</span><span class="small bold">Email</span></div><button type="button" class="btn btn-sm btn-outline" data-out>Sign out</button><button type="button" class="link" style="background:none;border:none;padding:0;color:var(--red);align-self:flex-start" data-del>Delete my account</button>`, null, 'grid-column:span 3')}</div>`
  };
  function orderRow(o) { return `<div class="r" style="border-top:1px solid var(--line);padding:10px 0;gap:12px"><img src="${esc(o.img)}" alt="" style="width:48px;height:48px;border-radius:8px;object-fit:cover"><span style="flex:1"><strong class="small">${esc(o.item)}</strong><br><span class="tiny muted">Order ${o.id}</span></span>${statusPill(o.step)}</div>`; }
  function statusPill(st) { return st >= 3 ? '<span class="pill-ok">Delivered</span>' : `<span class="pill-ship">${STEPS[st]}</span>`; }

  function render() {
    const f = F();
    main.innerHTML = `
    ${preview ? `<div class="acc-preview" role="status"><span>👁 Staff preview · changes here are not saved</span><label>Test fan <select data-who>${[['maria', 'Maria · founder + 214 + DU TV'], ['newfan', 'New fan · just signed up'], ['superfan', 'Superfan · everything'], ...(asFan && !FANS[asFan] ? [['email', asFan]] : [])].map(([k, l]) => `<option value="${esc(k)}" ${k === who ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label><a href="admin.html" style="color:var(--navy);text-decoration:underline">Back to admin</a></div>` : ''}
    <section class="acc-hello"><span class="bg" aria-hidden="true">DU</span><div class="container">
      <span class="eyebrow">My Dallas United</span><h1 class="serif" style="font-size:clamp(40px,6vw,60px)">Hi, ${esc(f.first)}</h1>
      <p style="color:#C9D2E3;margin:0">Member since ${esc(f.since)}${f.hood ? ` · ${esc(f.hood)}` : ''}</p>
      <div class="row" style="--gap:8px;margin-top:14px">${f.founder && DU.on('founders', d) ? `<span class="acc-badge g">★ Founder #${f.founder.toLocaleString()}${f.founderPending ? ' · being checked' : ''}</span>` : ''}${f.club && DU.on('club214', d) ? '<span class="acc-badge">214 Club member</span>' : ''}${f.tv && TAB_ON.tv ? `<span class="acc-badge">DU TV ${f.tv.toLowerCase()} pass</span>` : ''}${f.support && TAB_ON.support ? '<span class="acc-badge">Monthly supporter 💛</span>' : ''}${!f.founder && !f.club ? '<span class="acc-badge">New fan 👋</span>' : ''}</div>
    </div></section>
    <div class="container acc-body">
      <nav class="acc-side" aria-label="My account">${TABS_ON().map(([k, l, pth]) => `<a href="#${k}" data-go="${k}" ${k === tab ? 'aria-current="page"' : ''}>${ico(pth)}<span>${l}</span></a>`).join('')}<span class="sep"></span><button type="button" data-out>${ico('log-out')}<span>Sign out</span></button></nav>
      <div class="acc-main"><h2 class="serif" style="font-size:clamp(28px,3.4vw,40px);margin:0 0 16px">${TABS.find((x) => x[0] === tab)[1]}</h2>${SECTIONS[tab]()}</div>
    </div>
    <nav class="acc-tabs" aria-label="Account">${TABS_ON().filter((x) => ['overview', 'cards', 'matches', 'orders', 'profile'].includes(x[0])).filter((x, i, arr) => arr.length <= 5 || x[0] !== 'questions').slice(0, 5).map(([k, l, pth]) => `<a href="#${k}" data-go="${k}" ${k === tab ? 'aria-current="page"' : ''}>${ico(pth, 22)}<span>${{ overview: 'Home', cards: 'Cards', matches: 'Matches', orders: 'Orders', questions: 'Questions', profile: 'Me' }[k]}</span></a>`).join('')}</nav>`;
    bind();
  }
  function bind() {
    const ws = DU.$('[data-who]'); if (ws) ws.addEventListener('change', (e) => { who = e.target.value; render(); });
    DU.$$('[data-wallet]').forEach((b) => b.addEventListener('click', () => { const [w, what] = b.dataset.wallet.split('|'); DU.toast(`${what} would be added to ${w} here.`); }));
    DU.$$('[data-sw]').forEach((b) => b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('on', on); if (b.dataset.sw) { save({ notif: { ...F().notif, [b.dataset.sw]: on } }); DU.toast('Saved'); } }));
    DU.$$('[data-out]').forEach((b) => b.addEventListener('click', () => { if (preview) { location.href = 'admin.html'; return; } if (DU.fanAuth) { DU.fanAuth.signOut().then(() => { location.href = 'index.html'; }); return; } DU.pref.set('account', null); location.href = 'index.html'; }));
    const fv = DU.$('[data-fav]'); if (fv) fv.addEventListener('change', () => { save({ fav: fv.value }); render(); DU.toast('Favorite player saved'); });
    const j = DU.$('[data-join214]'); if (j) j.addEventListener('click', () => { if (preview) { F().club = 214; render(); DU.toast('Welcome to the 214 Club!'); return; } const no = (DU.store.get().fanclub || []).length + 1; const rec = { id: DU.store.uid('fc'), no, first: F().first, last: F().last, email: F().email, hood: F().hood || 'Dallas', news: true, joined: new Date().toISOString().slice(0, 10) }; DU.store.addPublic('fanclub', rec); DU.pref.set('club214', rec); F().club = no; render(); DU.toast('Welcome to the 214 Club!'); });
    const tx = DU.$('[data-text]'); if (tx) tx.addEventListener('click', () => DU.toast(`Your founder card would be texted to ${F().phone || 'your phone'}.`));
    DU.$$('[data-order]').forEach((b) => b.addEventListener('click', () => openOrder(F().orders.find((o) => o.id === b.dataset.order))));
    DU.$$('[data-plan]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.plan; if (k === F().tv) return; if (!k && !confirm('Cancel your DU TV pass? You keep it until Dec 1.')) return; save({ tv: k }); render(); DU.toast(k ? `Switched to the ${k} pass` : 'Pass cancelled'); }));
    const pc = DU.$('[data-paycard]'); if (pc) pc.addEventListener('click', () => DU.toast('This opens the secure card form (Stripe).'));
    DU.$$('[data-amt]').forEach((b) => b.addEventListener('click', () => { save({ support: Number(b.dataset.amt) }); render(); DU.toast(F().support ? `Monthly support set to ${money(F().support)}` : 'Monthly support stopped'); }));
    DU.$$('[data-once]').forEach((b) => b.addEventListener('click', () => DU.toast(`This opens checkout for a ${money(b.dataset.once)} gift.`)));
    DU.$$('[data-receipt]').forEach((b) => b.addEventListener('click', () => DU.toast('Your receipt would download here.')));
    DU.$$('[data-langp]').forEach((b) => b.addEventListener('click', () => DU.setLang(b.dataset.langp)));
    const sv = DU.$('[data-save]'); if (sv) sv.addEventListener('click', () => { const g = (k) => (DU.$(`[data-pf="${k}"]`) || {}).value || ''; const full = g('name').trim(); if (!full) { DU.toast('Add your name.'); return; } const [first, ...rest] = full.split(' '); save({ first, last: rest.join(' '), name: full, phone: g('phone').trim(), city: g('city').trim(), state: g('state') || 'TX', hood: g('city').trim() ? `${g('city').trim()}, ${g('state') || 'TX'}` : '', bday: g('bday').trim(), size: g('size') }); if (!preview) { const a = DU.pref.get('account', {}) || {}; DU.pref.set('account', { ...a, first }); } render(); DU.toast('Profile saved'); });
    const pw = DU.$('[data-pw]'); if (pw) pw.addEventListener('click', () => DU.toast('We’d email you a link to change your password.'));
    const del = DU.$('[data-del]'); if (del) del.addEventListener('click', () => { if (!confirm('Delete your account? Your founder number stays reserved for you.')) return; if (preview) { location.href = 'admin.html'; return; } const em = F().email; DU.store.addPublic(null, null, (dd) => { dd.fans = (dd.fans || []).filter((x) => !sameMail(x.email, em)); }); DU.pref.set('account', null); location.href = 'index.html'; });
  }
  function openOrder(o) {
    DU.modal(`<div class="stack" style="--gap:16px;padding:28px"><span class="eyebrow">Order ${o.id} · ${o.date}</span><h2 class="serif" style="font-size:34px">${esc(o.item)}</h2>
      <div class="r" style="gap:16px;justify-content:flex-start"><img src="${esc(o.img)}" alt="" style="width:110px;height:110px;border-radius:12px;object-fit:cover"><span><strong>${esc(o.extra || 'One size')}</strong><br><span class="muted">${money(o.total)} · paid with Visa ••4821</span></span></div>
      <ol class="acc-track">${STEPS.map((s, i) => `<li class="${i <= o.step ? 'done' : ''}"><span></span>${s}</li>`).join('')}</ol>
      <p class="small muted" style="margin:0">Ships to ${esc(F().first)} · 1200 Main Street, Dallas, TX 75201</p>
      <div class="row" style="--gap:8px">${o.step === 2 ? '<button type="button" class="btn btn-sm btn-navy" onclick="DU.toast(\'Tracking would open here.\')">Track package</button>' : ''}<a class="btn btn-sm btn-outline" href="mailto:hello@dallasunitedfc.com">Need help?</a>${o.step === 3 ? '<button type="button" class="btn btn-sm btn-outline" onclick="DU.toast(\'Return form would open here.\')">Return or exchange</button>' : ''}</div></div>`, { label: `Order ${o.id}` });
  }

  const css = document.createElement('style');
  css.textContent = `
  .acc-preview{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:80;border-radius:14px;box-shadow:0 12px 30px rgba(10,22,40,.35);width:max-content;max-width:calc(100% - 24px);background:var(--gold);color:var(--navy);font-weight:800;font-size:14px;display:flex;justify-content:center;align-items:center;gap:10px 20px;flex-wrap:wrap;padding:8px var(--pad);text-align:center}
  .acc-preview select{font:inherit;font-weight:700;border:1.5px solid var(--navy);border-radius:8px;padding:4px 8px;background:#fff;color:var(--navy);margin-left:6px}
  .acc-hello{position:relative;overflow:hidden;background:linear-gradient(120deg,var(--navy) 0%,var(--navy-3) 100%);color:#fff;padding:120px 0 34px}
  .acc-hello .bg{position:absolute;right:-20px;top:-40px;font-family:var(--font-serif);font-size:clamp(220px,30vw,360px);color:var(--blue);opacity:.2;line-height:1;pointer-events:none}
  .acc-hello .container{position:relative}.acc-hello .eyebrow{color:var(--gold)}
  .acc-badge{display:inline-flex;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;background:rgba(255,255,255,.12)}.acc-badge.g{background:var(--gold);color:var(--navy)}
  .acc-body{display:grid;grid-template-columns:220px minmax(0,1fr);gap:28px;padding-top:28px;padding-bottom:72px;align-items:start}
  .acc-side{display:flex;flex-direction:column;gap:2px;position:sticky;top:110px}
  .acc-side a,.acc-side button{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;font-weight:700;font-size:14px;color:#3B4556;text-decoration:none;background:none;border:none;text-align:left;min-height:44px;cursor:pointer}
  .acc-side a:hover,.acc-side button:hover{background:rgba(10,22,40,.05)}
  .acc-side a[aria-current]{background:#fff;color:var(--navy);box-shadow:0 2px 8px rgba(10,22,40,.06)}
  .acc-side .sep{height:1px;background:var(--line);margin:8px 0}
  .acc-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:16px}
  .acc-card{background:#fff;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0}
  .acc-h{display:flex;justify-content:space-between;align-items:center;gap:10px}.acc-h h3{margin:0;font-size:16px;display:flex;gap:8px;align-items:center}
  .acc-h a{font-size:13px;font-weight:800;color:var(--blue);text-decoration:none}
  .acc-card[style*="navy"] .acc-h a{color:var(--gold)}
  .pill-s{font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;background:rgba(255,255,255,.14)}
  .pill-ok,.pill-ship,.pill-wait,.pill-new{display:inline-flex;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:800;white-space:nowrap;text-decoration:none}
  .pill-ok{background:#D4EDDA;color:#1E7A46}.pill-ship{background:#E5EDFF;color:var(--blue)}.pill-wait{background:#FFF3CD;color:#7A5A00}.pill-new{background:#EEF1F6;color:#3B4556}
  .r{display:flex;justify-content:space-between;align-items:center;gap:8px}
  .acc-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}.acc-two .btn{justify-content:center}
  .acc-fav{width:84px;height:84px;border-radius:12px;object-fit:cover;object-position:top;background:#2A3A5C;flex-shrink:0}
  .acc-mcard{aspect-ratio:1.586/1;border-radius:14px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;max-width:420px;width:100%}
  .acc-mcard.fc{background:linear-gradient(135deg,var(--gold),var(--gold-2,#E2A700));color:var(--navy)}
  .acc-mcard.cc{background:linear-gradient(135deg,var(--blue) 0%,var(--navy-3) 70%);color:#fff;border:2px solid var(--gold)}
  .acc-mcard .w{position:absolute;right:-10px;bottom:-34px;font-family:var(--font-serif);font-size:130px;opacity:.12;line-height:1}
  .acc-empty{border:2px dashed var(--line);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
  .acc-tog{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;border-top:1px solid var(--line);font-weight:600;font-size:14px}.acc-tog:first-of-type{border-top:none}
  .acc-sw{width:44px;height:26px;border-radius:999px;background:#C9C5BB;border:none;position:relative;cursor:pointer;flex-shrink:0}
  .acc-sw::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s}
  .acc-sw.on{background:#1E7A46}.acc-sw.on::after{left:21px}
  .acc-order{flex-direction:row;align-items:center;gap:14px;border:none;cursor:pointer;font:inherit;color:inherit}.acc-order:hover{box-shadow:var(--shadow)}
  .acc-order img{width:64px;height:64px;border-radius:10px;object-fit:cover}
  .acc-plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .acc-plan{border:2px solid var(--line);border-radius:14px;background:#fff;padding:16px;display:flex;flex-direction:column;gap:6px;align-items:flex-start;text-align:left;cursor:pointer;font:inherit;color:inherit}
  .acc-plan.on{border-color:var(--navy);background:#F5F7FB}
  .acc-vid{position:relative;display:block;border-radius:10px;overflow:hidden;aspect-ratio:16/9;color:#fff;text-decoration:none}.acc-vid img{width:100%;height:100%;object-fit:cover}
  .acc-vid span{position:absolute;left:8px;right:8px;bottom:8px;font-weight:800;font-size:13px;text-shadow:0 1px 6px rgba(0,0,0,.7)}
  .acc-track{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;font-size:12px;font-weight:700;color:var(--muted)}
  .acc-track li{display:flex;flex-direction:column;gap:6px}.acc-track li span{height:6px;border-radius:3px;background:var(--line)}
  .acc-track li.done{color:var(--navy)}.acc-track li.done span{background:var(--gold)}
  .acc-tabs{display:none}
  @media (max-width:900px){
    .acc-body{grid-template-columns:1fr;padding-bottom:110px}.acc-side{display:none}
    .acc-grid{grid-template-columns:1fr}.acc-grid>*{grid-column:auto !important}
    .acc-plans{grid-template-columns:1fr}
    .acc-hello{padding-top:104px}
    .acc-preview{bottom:calc(76px + env(safe-area-inset-bottom));font-size:12px;padding:8px 12px}
    .acc-tabs{display:grid;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:70;background:#fff;border-top:1px solid var(--line);padding:6px 4px calc(10px + env(safe-area-inset-bottom))}
    .acc-tabs a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10px;font-weight:700;color:#6B7486;min-height:48px;text-decoration:none}
    .acc-tabs a[aria-current]{color:var(--navy)}.acc-tabs a[aria-current] svg{stroke:var(--blue)}
  }`;
  document.head.appendChild(css);
  if (!TABS.some((x) => x[0] === tab)) tab = 'overview';
  render();
  DU.layout({ active: '', v2: true });
})();
