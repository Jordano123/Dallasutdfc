(function () {
  if (DU.soonPage()) return;
  let d = DU.store.get(); const tr = DU.tr, esc = DU.esc, x = DU.x;
  const main = DU.$('#main');
  const TABS = [['fixtures', DU.x('matches.t2', 'Fixtures')], ['results', DU.x('matches.t3', 'Results')], ['standings', DU.x('matches.t4b', 'Table')]];
  const asked = DU.param('tab');
  const state = { open: {}, tab: ({ calendar: 'fixtures', results: 'results', standings: 'standings', fixtures: 'fixtures' })[asked] || 'fixtures', comp: 'All', month: null, table: 'league' };
  if (state.tab === 'standings' && !DU.on('standings', d)) state.tab = 'fixtures';
  let tick = null;

  const all = () => DU.sortFx(d.fixtures);
  const isLive = (f) => !!DU.liveFor(d, f);
  const results = () => all().filter((f) => f.status === 'Full time').reverse();
  const upcoming = () => all().filter((f) => f.status !== 'Full time');
  const focusFx = () => all().find(isLive) || DU.nextFixture(d) || results()[0] || all()[0];
  const ours = (f) => { const [a, b] = DU.score(f); return f.ha === 'Home' ? [Number(a || 0), Number(b || 0)] : [Number(b || 0), Number(a || 0)]; };
  const wdl = (f) => { const [u, t] = ours(f); return u > t ? 'W' : u < t ? 'L' : 'D'; };
  const badge = (r) => `<span class="mx-wdl mx-${r}">${r}</span>`;
  const crest = (name, f, cls) => DU.crestFor(name, f, cls || 'mx-crest');
  const short = (name, f) => (name === 'Dallas United' ? 'DU' : (f.oppShort || name));

  const card = (f) => {
    const [a, b] = DU.teams(f), done = f.status === 'Full time', lv = isLive(f), [sa, sb] = DU.score(f);
    const ourG = DU.scorerList(f.scorers), theirG = DU.scorerList(f.oppScorers);
    const [ga, gb] = f.ha === 'Home' ? [ourG, theirG] : [theirG, ourG];
    const line = (name, sc, goals) => `<div class="mc-line${done || lv ? '' : ' mc-ns'}">${done || lv ? `<span class="mc-sc">${esc(sc || 0)}</span>` : ''}<span class="mc-nm${name === 'Dallas United' ? ' is-us' : ''}">${esc(name)}</span>${goals.length ? `<span class="mc-goals">${esc(goals.join(', '))}</span>` : ''}</div>`;
    const btns = [];
    if (DU.on('matchCentre', d) && (done || lv)) btns.push(`<a class="mc-btn" href="match-centre.html?id=${esc(f.id)}">${tr('c.matchCentre')} <span aria-hidden="true">↗</span></a>`);
    const right = [];
    if (!done && !lv) right.push(DU.calButton(DU.fxEvent(f), DU.x('mh.cal', 'Add to calendar'), 'mc-btn mc-btn-gold'));
    if (!done && !lv && DU.ticketsOn(d) && f.tickets) right.push(`<a class="mc-btn mc-btn-navy" href="${esc(DU.ticketUrl(f, d))}" target="_blank" rel="noopener">${tr('c.tickets')} <span aria-hidden="true">↗</span></a>`);
    return `<article class="mc">
      <div class="mc-top">
        <div class="mc-crests">${DU.crestFor(a, f, 'mc-crest')}${DU.crestFor(b, f, 'mc-crest')}</div>
        <div class="mc-mid"><span class="mc-when">${esc(DU.fmtTime(f.time))} / ${esc(DU.fmtDay(f.date, true))}${lv ? ` · <b class="mc-live"><span class="live-dot"></span>${tr('c.live')}</b>` : ''}</span>${line(a, sa, ga)}${line(b, sb, gb)}<span class="mc-venue">${esc(f.venue || d.settings.stadium || '')}</span></div>
        <div class="mc-lg">${DU.leagueBadge(f.comp, 'mc-lg-img')}${f.broadcast ? `<span class="mc-tv">${esc(f.broadcast)}</span>` : ''}</div>
      </div>
      ${btns.length || right.length ? `<div class="mc-bot"><div class="mc-row">${btns.join('')}</div><div class="mc-row">${right.join('')}</div></div>` : ''}
    </article>`;
  };
  const tableHTML = () => {
    const k = state.table, T = d.table[k]; if (!T) return '';
    const sorted = [...T.rows].sort((a, b) => (b.pts - a.pts) || ((b.gf - b.ga) - (a.gf - a.ga)) || (b.gf - a.gf));
    const formOf = (r) => String(r.form || '').toUpperCase().replace(/[^WDL]/g, '').slice(-5).split('').filter(Boolean);
    return `<div class="mt-head">${DU.leagueBadge(k === 'league' ? 'League' : 'Texas Cup', 'mt-logo')}<h2 class="mt-title">${esc(T.title)}</h2>
      ${['league', 'cup'].filter((t) => d.table[t]).length > 1 ? `<div class="chips mt-chips">${['league', 'cup'].filter((t) => d.table[t]).map((t) => `<button type="button" class="chip" data-table="${t}" aria-pressed="${t === k}">${esc(d.table[t].title)}</button>`).join('')}</div>` : ''}</div>
      <div class="mt-wrap"><table class="mt"><thead><tr><th>Pos</th><th>${tr('m.club')}</th><th class="n">P</th><th class="n">W</th><th class="n">D</th><th class="n">L</th><th class="n hide-s">GF</th><th class="n hide-s">GA</th><th class="n">GD</th><th class="n">Pts</th><th class="hide-s">${DU.x('matches.form2', 'Form')}</th></tr></thead><tbody>
      ${sorted.map((r, i) => `<tr class="${r.us ? 'is-us' : ''}"><td class="mt-pos">${i + 1}</td><td class="mt-club">${esc(r.name)}</td><td class="n">${r.p}</td><td class="n">${r.w}</td><td class="n">${r.d}</td><td class="n">${r.l}</td><td class="n hide-s">${r.gf}</td><td class="n hide-s">${r.ga}</td><td class="n">${(r.gf - r.ga) > 0 ? '+' : ''}${r.gf - r.ga}</td><td class="n mt-pts">${r.pts}</td><td class="hide-s"><span class="mt-form">${formOf(r).map((x) => `<span class="mx-wdl mx-${x}">${x}</span>`).join('')}</span></td></tr>`).join('')}
      </tbody></table></div><p class="small muted">${DU.x('matches.1', 'W = win · D = draw · L = loss · GF/GA = goals for/against · GD = goal difference')}</p>`;
  };
  const syncHref = () => DU.icsHref(upcoming().map(DU.fxEvent));

  function timelineHTML(f) {
    const lv = DU.liveFor(d, f);
    let evs = [];
    if (lv) evs = (d.live.events || []).filter((e) => e.kind === 'goal' || e.kind === 'card').map((e) => ({ min: Number(e.min) || 0, us: !!(e.dd || (e.kind === 'card' && e.pid)), kind: e.kind, color: e.color, who: e.og ? 'Own goal' : (e.who || (e.od ? f.opp : '')) }));
    else if (f.status === 'Full time' && f.scorers) evs = f.scorers.split(',').map((s) => s.trim()).filter(Boolean).map((s) => ({ min: Number((s.match(/(\d+)/) || [])[1] || 0), us: true, kind: 'goal', who: s.replace(/\d+’?'?/, '').replace(/\(P\)/, '').trim() }));
    if (!lv && !evs.length) return '';
    const now = lv ? Math.min(90, lv.minute) : 90;
    const pct = (m) => Math.max(0, Math.min(100, (m / 90) * 100));
    const line = (us) => evs.filter((e) => e.us === us).map((e) => `${e.min}’ ${esc(e.who)}${e.kind === 'card' ? ` (${e.color === 'r' ? 'red' : 'yellow'})` : ''}`).join(' · ');
    return `<section class="mx-card mx-timeline" aria-label="${DU.x('matches.tl', 'Timeline')}">
      <div class="mx-tl-team"><img src="${DU.CREST_SMALL}" alt="" aria-hidden="true"><strong>DALLAS UNITED</strong><span>${line(true) || '–'}</span></div>
      <div class="mx-tl-bar"><span class="mx-tl-0">0</span><div class="mx-tl-track"><span class="mx-tl-fill" style="width:${pct(now)}%"></span>
        ${evs.map((e) => `<span class="mx-tl-ev ${e.kind === 'card' ? `ev-card-${e.color === 'r' ? 'r' : 'y'}` : e.us ? 'ev-us' : 'ev-them'}" style="left:${pct(e.min)}%" title="${e.min}’ ${esc(e.who)}">${e.kind === 'goal' ? 'G' : ''}</span>`).join('')}
        ${lv ? `<span class="mx-tl-now" style="left:${pct(now)}%">${esc(lv.label)}</span>` : ''}</div><span class="mx-tl-90">90</span></div>
      <div class="mx-tl-team">${DU.oppCrest(f, 'mx-tl-crest')}<strong>${esc(f.opp.toUpperCase())}</strong><span>${line(false) || '–'}</span></div>
    </section>`;
  }


  const highlightsRow = () => {
    if (!DU.on('dutv', d)) return '';
    const vids = (d.videos || []).slice(0, 3); if (!vids.length) return '';
    return `<section class="mx-low-sec"><div class="mx-sec-head"><h2 class="display">${DU.x('matches.hl', 'Match highlights')}</h2><a class="mx-link" href="dutv.html">${DU.x('matches.allTv', 'All on DU TV')} →</a></div>
      <div class="mx-grid3">${vids.map((v) => `<a class="mx-vid" href="dutv.html"><span class="mx-vid-pic"><img src="${esc(v.thumb)}" alt="" loading="lazy"><span>${esc(v.len)}</span></span><strong>${esc(DU.t(v.title))}</strong></a>`).join('')}</div></section>`;
  };

  function lowHTML() {
    if (state.tab === 'standings') return `<section class="container mx-sec">${tableHTML()}</section>`;
    const isRes = state.tab === 'results';
    const comps = ['All', ...Array.from(new Set(all().map((g) => g.comp)))];
    const base = (isRes ? results() : upcoming()).filter((g) => state.comp === 'All' || g.comp === state.comp);
    const months = Array.from(new Set(base.map((g) => DU.monthKey(g.date))));
    if (isRes) months.sort().reverse(); else months.sort();
    const list = base.filter((g) => !state.month || DU.monthKey(g.date) === state.month);
    const shown = months.filter((m) => !state.month || m === state.month);
    const f = isRes ? results()[0] : focusFx();
    return `
      <div class="mx-months" role="tablist" aria-label="${DU.x('matches.month', 'Month')}"><button type="button" role="tab" data-month="" aria-selected="${!state.month}">${tr('m.all').toUpperCase()}</button>${months.map((m) => `<button type="button" role="tab" data-month="${m}" aria-selected="${state.month === m}">${esc(DU.monthName(m)).slice(0, 3).toUpperCase()}</button>`).join('')}</div>
      <div class="container mx-filters">
        <label class="mx-select"><span class="sr-only">${DU.x('matches.comp', 'Competition')}</span><select data-comp>${comps.map((c) => `<option value="${esc(c)}" ${state.comp === c ? 'selected' : ''}>${c === 'All' ? DU.x('matches.allComp', 'All competitions').toUpperCase() : esc(DU.compName(c)).toUpperCase()}</option>`).join('')}</select></label>
        ${!isRes && upcoming().length ? `<a class="mx-sync" href="${syncHref()}" download="dallas-united-fixtures.ics">${DU.icon('cal')}<span>${DU.x('matches.sync', 'Sync to calendar')}</span><span class="mx-sync-go" aria-hidden="true">→</span></a>` : ''}
      </div>
      ${f && isLive(f) ? `<div class="container mx-hero-wrap">${timelineHTML(f)}</div>` : ''}
      <section class="container mx-sec">
        ${list.length ? shown.map((m) => `<div class="mx-month"><button type="button" class="mx-mhead" data-fold="${m}" aria-expanded="${!state.open[m] ? 'true' : 'false'}"><h2>${esc(DU.monthName(m))} ${m.slice(0, 4)}</h2><span aria-hidden="true">⌃</span></button>${!isRes && m === shown[0] ? `<p class="mx-note">${DU.x('matches.tz', 'All times are Dallas time (Central) and may change.')}</p>` : ''}<div class="mx-cards" ${state.open[m] ? 'hidden' : ''}>${list.filter((g) => DU.monthKey(g.date) === m).map(card).join('')}</div></div>`).join('') : `<p class="lead muted">${tr('m.none')}</p>`}
      </section>`;
  }
  function render() {
    clearInterval(tick);
    const isRes = state.tab === 'results';
    const hf = state.tab === 'results' ? results()[0] : focusFx();
    main.innerHTML = `
    <section class="mxb mxb2">
      <div class="mxb-photo">${DU.media(DU.pic('matches.heroImg', 'assets/img/matchday-stadium.jpg'), 'alt=""')}</div>
      <div class="mxb-shade" aria-hidden="true"></div>
      <div class="v2-wrap mxb-in">
        <div class="mxb-row"><h1 class="v2-big mx-title2">${tr('m.title')}</h1>
          <div class="nx-pills" role="tablist" aria-label="${tr('m.title')}">${TABS.filter(([k]) => k !== 'standings' || DU.on('standings', d)).map(([k, l]) => `<button type="button" role="tab" class="nx-pill" data-tab="${k}" aria-selected="${state.tab === k}">${l}</button>`).join('')}</div></div>
        <div class="mxb-game" data-hero>${hf ? DU.matchHero(d, hf, { bare: true, noHl: true }) : ''}</div>
      </div>
    </section>
    <div data-live-player class="container"></div>
    <div class="mx-body" data-body>${lowHTML()}</div>
    ${DU.on('dutv', d) ? `<div class="tvp">${DU.tvRow({ title: DU.x('matches.hl', 'Match highlights'), list: DU.highlightsFor(d, null), more: true })}</div>` : ''}`;
    DU.bindTvRows(main, d);
    void highlightsRow;
    void isRes;
    placeInd(false);
    bind();
  }
  function swap() {
    clearInterval(tick);
    const body = DU.$('[data-body]');
    body.classList.remove('mx-in'); void body.offsetWidth;
    body.innerHTML = lowHTML(); body.classList.add('mx-in');
    const hf = state.tab === 'results' ? results()[0] : focusFx(); const hb = DU.$('[data-hero]');
    if (hb && hf) { hb.innerHTML = DU.matchHero(d, hf, { bare: true, noHl: true }); hb.classList.remove('mx-in'); void hb.offsetWidth; hb.classList.add('mx-in'); }
    DU.$$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === state.tab)));
    placeInd(true); bindBody();
  }
  function placeInd(anim) {
    const seg = DU.$('.mx-seg'), on = DU.$('.mx-seg [aria-selected="true"]'), ind = DU.$('.mx-seg-ind'); if (!seg || !on || !ind) return;
    ind.style.transition = anim ? '' : 'none';
    ind.style.width = `${on.offsetWidth}px`; ind.style.transform = `translateX(${on.offsetLeft - 4}px)`;
  }
  function bind() {
    DU.$$('[data-tab]').forEach((b) => b.addEventListener('click', () => { if (state.tab === b.dataset.tab) return; state.tab = b.dataset.tab; state.month = null; history.replaceState(null, '', state.tab === 'fixtures' ? 'matches.html' : `?tab=${state.tab}`); swap(); }));
    addEventListener('resize', () => placeInd(false));
    bindBody();
  }
  function bindBody() {
    DU.$$('[data-month]').forEach((b) => b.addEventListener('click', () => { state.month = b.dataset.month || null; swap(); }));
    const c = DU.$('[data-comp]'); if (c) c.addEventListener('change', () => { state.comp = c.value; swap(); });
    DU.$$('[data-table]').forEach((b) => b.addEventListener('click', () => { state.table = b.dataset.table; swap(); }));
    DU.$$('[data-fold]').forEach((b) => b.addEventListener('click', () => { const m = b.dataset.fold; state.open[m] = !state.open[m]; const box = b.parentElement.querySelector('.mx-cards'); box.hidden = !!state.open[m]; b.setAttribute('aria-expanded', String(!state.open[m])); }));
    const wl = DU.$('[data-watch-live]'); if (wl) wl.addEventListener('click', () => { const f = focusFx(); const box = DU.$('[data-live-player]'); box.innerHTML = DU.ytPlayer(f.stream); box.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    tick = DU.runCountdowns(DU.$('.mxb'));
  }

  render();
  DU.layout({ active: 'matches', v2: true });
  const keyOf = (v) => JSON.stringify([v.live, v.fixtures.map((g) => [g.id, g.status, g.du, g.op])]);
  let lastKey = keyOf(d);
  const poll = () => { const v = DU.fresh(); const k = keyOf(v); const running = DU.LIVE_PERIODS.includes(v.live.period); if (k !== lastKey || running) { lastKey = k; d = v; render(); } };
  setInterval(poll, 5000);
  window.addEventListener('storage', poll);
})();
