(function () {
  const d = DU.store.get(), tr = DU.tr, t = DU.t, esc = DU.esc, sv = DU.sv;
  const main = DU.$('#main');
  const people = d.people.filter((p) => p.visible !== false);
  const POS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const FILTERS = [['all', DU.x('team.all', 'All')], ...POS.map((p) => [p, tr(`t.${p}`)]), ['staff', tr('t.staff')]];
  let view = DU.param('view') === 'staff' ? 'staff' : 'all';
  const age = (dob) => { if (!dob) return ''; const b = new Date(dob); const n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a -= 1; return a > 0 && a < 90 ? String(a) : ''; };
  const fmtD = (iso) => { if (!iso) return ''; const x = new Date(`${iso}T12:00:00`); return isNaN(x) ? '' : x.toLocaleDateString(DU.locale(), { day: 'numeric', month: 'long', year: 'numeric' }); };
  const flagOf = (p, cls) => (p.flag ? `<img class="${cls}" src="${esc(p.flag)}" alt="">` : p.nat ? DU.natFlag(p.nat, cls) : '');
  const byNo = (a, b) => Number(a.no || 99) - Number(b.no || 99);
  const isCoach = (p) => p.group === 'Staff' && /head coach/i.test(p.pos || '');

  const card = (p) => `<a class="tq-card" href="team.html?p=${encodeURIComponent(p.id)}" data-open="${esc(p.id)}" aria-label="${esc(p.first)} ${esc(p.last)}, ${esc(p.pos)}${p.nat ? `, ${esc(p.nat)}` : ''}">
    <span class="tq-pic">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : ''}</span><span class="tq-shade"></span>
    <span class="tq-top">${p.no ? `<span class="tq-no">${esc(p.no)}</span>` : ''}${p.nat ? `<span class="tq-flag" title="${esc(p.nat)}">${flagOf(p, 'tq-flag-i')}</span>` : ''}</span>
    <span class="tq-name"><span class="tq-first">${esc(p.first)}</span><span class="tq-last">${esc(p.last)}</span>${p.group !== 'Player' ? `<span class="tq-role">${esc(p.pos)}</span>` : ''}<span class="tq-line" aria-hidden="true"></span></span></a>`;

  const coachBand = (c) => (c ? `<section class="tq-coach"><div class="v2-wrap tq-coach-in">
      <div class="tq-coach-tx"><span class="tq-ghost" aria-hidden="true">${DU.x('team.coachW', 'Coach')}</span>
        <h2 class="tq-coach-n"><a href="team.html?p=${encodeURIComponent(c.id)}" data-open="${esc(c.id)}">${esc(c.first)} ${esc(c.last)}</a></h2>
        <dl class="tq-coach-f">${[[DU.x('pp.dob', 'Date of birth'), fmtD(c.dob)], [DU.x('pp.nat', 'Nationality'), c.nat]].filter((x) => x[1]).map(([k, v]) => `<div><dt>${k}:</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
      <span class="tq-coach-pic">${c.img ? `<img src="${esc(c.img)}" alt="${esc(c.first)} ${esc(c.last)}" loading="lazy">` : ''}</span></div></section>` : '');

  const group = (name, list) => (list.length ? `<section class="tq-group"><h2 class="tq-gh">${esc(name)}</h2><div class="tq-grid">${list.map(card).join('')}</div></section>` : '');

  function list() {
    document.title = 'Team · Dallas United FC';
    main.innerHTML = `
    <section class="tq-top-sec">
      <span class="nx-bg">${DU.media(DU.pic('team.headImg', 'assets/img/celebrate.jpg'), 'alt=""')}</span>
      <div class="v2-wrap tq-head">
        <span class="v2-kick gold">${DU.x('team.1', 'Season 2026/27')}</span>
        <h1 class="v2-big">${DU.x('team.list', 'Squad list')}</h1>
        <div class="nx-pills" role="tablist" aria-label="${DU.x('team.filter', 'Show')}">${FILTERS.map(([k, l]) => `<button type="button" role="tab" class="nx-pill" data-view="${k}" aria-selected="${view === k}">${esc(l)}</button>`).join('')}</div>
      </div>
    </section>
    <div class="tq-body" data-body></div>`;
    draw();
    DU.$$('[data-view]').forEach((b) => b.addEventListener('click', () => { view = b.dataset.view; history.replaceState(null, '', view === 'staff' ? 'team.html?view=staff' : 'team.html'); draw(); }));
  }
  function draw() {
    DU.$$('[data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view)));
    const players = people.filter((p) => p.group === 'Player');
    const staff = people.filter((p) => p.group === 'Staff');
    const coach = staff.find(isCoach);
    const coaching = staff.filter((p) => p !== coach && /coach/i.test(p.pos || ''));
    const club = staff.filter((p) => p !== coach && !/coach/i.test(p.pos || ''));
    const showPos = view === 'all' ? POS : POS.includes(view) ? [view] : [];
    const showStaff = view === 'all' || view === 'staff';
    DU.$('[data-body]').innerHTML = `
      ${showPos.length ? `<div class="v2-wrap tq-wrap">${showPos.map((pos) => group(tr(`t.${pos}`), players.filter((p) => p.pos === pos).sort(byNo))).join('')}</div>` : ''}
      ${showStaff ? `${coachBand(coach)}<div class="v2-wrap tq-wrap">${group(tr('t.coaching'), coaching)}${group(tr('t.club'), club)}</div>` : ''}`;
    bindOpen();
  }

  function open(id) {
    const p = people.find((x) => x.id === id); if (!p) { list(); return; }
    const isP = p.group === 'Player';
    const cardOn = ((d.cardP || {})[p.id] || {}).on !== false && DU.on('walletCards', d);
    const facts = [[DU.x('pp.age', 'Age'), esc(age(p.dob))], [isP ? DU.x('pp.pos', 'Position') : DU.x('pp.role', 'Role'), esc(p.pos)], [DU.x('pp.nat', 'Nationality'), p.nat ? `${esc(p.nat)} <span class="pp2-flag">${flagOf(p, 'tq-flag-i')}</span>` : '']].filter((f) => f[1]);
    const info = [[DU.x('pp.dob', 'Date of birth'), esc(fmtD(p.dob))], [DU.x('pp.born', 'Place of birth'), esc(p.birthCity || '')], [DU.x('pp.joined', 'Joined Dallas United'), esc(fmtD(p.joined))]].filter((f) => f[1]);
    const mates = people.filter((x) => x.id !== p.id && x.group === p.group && (isP ? x.pos === p.pos : true)).sort(byNo);
    const otherT = isP ? `${DU.x('pp.other', 'Other')} ${tr(`t.${p.pos}`).toLowerCase()}` : DU.x('pp.staff', 'Our staff');
    document.title = `${p.first} ${p.last} · Dallas United FC`;
    main.innerHTML = `
    <section class="pp2">
      <div class="v2-wrap pp2-in">
        <a class="v2-btn v2-btn-o pp2-all" href="team.html${isP ? '' : '?view=staff'}">${DU.icon('users') || ''}${isP ? DU.x('pp.allP', 'All players') : DU.x('pp.allS', 'All staff')}</a>
        <div class="pp2-copy">
          ${p.no ? `<span class="pp2-no">${esc(p.no)}</span>` : ''}
          <h1 class="pp2-name"><span class="pp2-first">${esc(p.first)}</span><span class="pp2-last">${esc(p.last)}</span></h1>
          <span class="pp2-line" aria-hidden="true"></span>
          <dl class="pp2-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        </div>
        <div class="pp2-pic">${p.img ? DU.media(p.img, `alt="${esc(p.first)} ${esc(p.last)}"`) : ''}${cardOn ? `<button type="button" class="v2-btn v2-btn-p pp2-card" data-pcard>${DU.x('pp.card', 'Get player card')}</button>` : ''}</div>
      </div>
    </section>
    ${info.length || p.instagram ? `<section class="pp2-info"><div class="v2-wrap pp2-row">
      ${info.map(([k, v]) => `<div class="pp2-box"><span>${k}</span><strong>${v}</strong></div>`).join('')}
      ${p.instagram ? `<div class="pp2-box"><span>${DU.x('pp.social', 'Social media')}</span><a class="pp2-ig" href="${esc(p.instagram)}" target="_blank" rel="noopener">${sv('instagram')}Instagram</a></div>` : ''}
    </div></section>` : ''}
    ${mates.length ? `<section class="pp2-mates" data-slider><div class="v2-wrap">
      <div class="v2-sh"><h2 class="v2-h2">${esc(otherT.charAt(0).toUpperCase() + otherT.slice(1))}</h2><div class="v2-shr"><a class="v2-more" href="team.html${isP ? '' : '?view=staff'}">${sv('right')}${DU.x('pp.full', 'Full squad')}</a>
        <div class="v2-arr"><button type="button" class="v2-ic" data-move="-1" aria-label="Previous">${sv('left')}</button><button type="button" class="v2-ic" data-move="1" aria-label="Next">${sv('right')}</button></div></div></div></div>
      <div class="v2-trk tq-row" data-trk>${mates.map(card).join('')}</div></section>` : ''}`;
    bindOpen();
    const trk = DU.$('[data-trk]');
    if (trk) DU.$$('[data-move]').forEach((b) => b.addEventListener('click', () => trk.scrollBy({ left: Number(b.dataset.move) * Math.max(260, trk.clientWidth * 0.6), behavior: 'smooth' })));
    const pc = DU.$('[data-pcard]');
    if (pc) pc.addEventListener('click', () => {
      const m = DU.modal(`<div class="stack" style="--gap:18px;padding:clamp(22px,4vw,36px);align-items:center;text-align:center"><h2 class="display" style="font-size:34px">${isP ? tr('t.card') : 'Get the staff card'}</h2><p class="muted" style="margin:0">${isP ? tr('t.cardText') : 'Free. Save it to your phone wallet.'}</p>${walletCard(p)}
        <div class="row" style="--gap:10px;justify-content:center"><button type="button" class="wallet-btn" style="background:#000;color:#fff;border:none" data-wallet="Apple Wallet">${tr('t.apple')}</button><button type="button" class="wallet-btn" style="background:#fff;color:var(--navy);border:2px solid var(--navy)" data-wallet="Google Wallet">${tr('t.gwallet')}</button></div></div>`, { label: `${p.first} ${p.last} card`, style: 'max-width:520px' });
      DU.$$('[data-wallet]', m.el).forEach((b) => b.addEventListener('click', () => DU.toast(`${p.first}’s card is ready for ${b.dataset.wallet}. (Real Wallet passes are switched on when the site goes live.)`)));
    });
    window.scrollTo(0, 0);
  }

  function walletCard(p) {
    const C = d.cardCfg, ci = (d.cardP && d.cardP[p.id]) || {};
    return DU.walletCard(p, { cfg: C, photo: ci.photo, season: t(C.season) });
  }



  function bindOpen() { DU.$$('[data-open]').forEach((a) => a.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); history.pushState({ p: a.dataset.open }, '', `team.html?p=${encodeURIComponent(a.dataset.open)}`); open(a.dataset.open); })); }
  addEventListener('popstate', () => { const id = DU.param('p'); if (id) open(id); else { view = DU.param('view') === 'staff' ? 'staff' : 'all'; list(); } });

  if (DU.param('p')) open(DU.param('p')); else list();
  DU.layout({ active: 'team', v2: true });
})();
