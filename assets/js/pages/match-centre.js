(function () {
  if (DU.soonPage()) return;
  const tr = DU.tr, esc = DU.esc;
  const main = DU.$('#main');
  const BALL = DU.lu('ball');
  const SWAP = DU.lu('repeat', 'mcq-swap');
  let hadVideo = null;

  function build() {
    const d = DU.fresh();
    const L = d.live;
    const id = DU.param('id');
    const f = d.fixtures.find((x) => x.id === (id || L.fixtureId)) || DU.nextFixture(d) || d.fixtures[0];
    const lv = DU.liveFor(d, f);
    const ranLive = f.id === L.fixtureId && L.period !== 'Pre-match';
    const [a, b] = DU.teams(f);
    const du = ranLive ? L.du : f.du, op = ranLive ? L.op : f.op;
    const sa = f.ha === 'Home' ? du : op, sb = f.ha === 'Home' ? op : du;
    const done = f.status === 'Full time' || (L.period === 'Full time' && ranLive);
    const upcoming = !lv && !done;
    const scorers = ranLive ? DU.liveScorers(L.events) : (f.scorers ? f.scorers.split(',').map((x) => x.trim()).filter(Boolean) : []);
    const theirScorers = !ranLive && f.oppScorers ? f.oppScorers.split(',').map((x) => x.trim()).filter(Boolean) : [];
    const usSide = f.ha === 'Home' ? 'a' : 'b';
    const goalsFor = (side) => (side === usSide ? scorers : theirScorers);

    const row = (name, side, sc) => `<div class="mcx-team"><span class="mcx-crest">${DU.crestFor(name, f, 'mcx-crest-i')}</span><span class="mcx-name">${esc(name)}</span><span class="mcx-score">${upcoming ? '' : esc(sc || 0)}</span>
      ${goalsFor(side).length ? `<ul class="mcx-goals">${goalsFor(side).map((x) => `<li>${BALL} ${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
    const pill = lv ? `<span class="mcx-pill is-live"><span class="live-dot"></span>${tr('c.live')} · ${esc(lv.label)}</span>` : done ? `<span class="mcx-pill">${tr('c.fullTime')}</span>` : `<span class="mcx-pill is-soon">${DU.x('mc.ko', 'Kick-off')} ${esc(DU.fmtTime(f.time))}</span>`;
    const comp = f.comp === 'League' ? [d.settings.leagueShort || d.settings.league, d.settings.leagueDivision].filter(Boolean).join(' ') : DU.compName(f.comp);
    const panel = `<div class="mcx-panel">
          <div class="mcx-teams">${row(a, 'a', sa)}${row(b, 'b', sb)}</div>
          <div class="mcx-side">${pill}<strong>${esc(comp)}</strong><span>${esc(DU.fmtDay(f.date, true))}</span>
            ${f.referee ? `<span>${DU.x('mc.ref', 'Referee')}: ${esc(f.referee)}</span>` : ''}
            ${f.venue ? `<span>${DU.x('mc.venue', 'Stadium')}: ${esc(f.venue)}</span>` : ''}
            ${upcoming ? `<span class="mcx-cal">${DU.calButton(DU.fxEvent(f), DU.x('mh.cal', 'Add to calendar'), 'v2-btn v2-btn-p')}</span>` : ''}
          </div></div>`;

    const link = lv || f.status === 'Live' || f.status === 'Half-time' ? f.stream : done ? (f.replay || f.stream) : '';
    const vid = DU.on('liveStream', d) && link && DU.ytEmbed(link) ? link : '';
    const player = vid ? DU.ytPlayer(vid).replace('autoplay=1', lv ? 'autoplay=1&mute=1' : 'autoplay=0') : '';
    const video = vid ? `<section class="mcv" aria-label="${DU.x('mc.vidL', 'Match video')}"><div class="v2-wrap">
        <div class="mcv-head"><h2 class="v2-h2">${esc(a)} <span class="mcv-vs">vs</span> ${esc(b)}</h2>${lv ? `<span class="mcx-pill is-live"><span class="live-dot"></span>${tr('c.live')}${lv.label ? ` · ${esc(lv.label)}` : ''}</span>` : `<span class="mcx-pill">${DU.x('mc.full', 'Full match')}</span>`}</div>
        <div class="mcv-frame" data-video>${player}</div></div></section>` : '';

    const lu = DU.lineupFor(d, f);
    const everyone = [...lu.xi, ...lu.subs];
    const byId = (pid) => d.people.find((p) => p.id === pid);
    const evs = ranLive ? (L.events || []) : [];
    const goalMins = (p) => {
      if (ranLive) return evs.filter((e) => e.kind === 'goal' && e.dd && e.pid === p.id && !e.og).map((e) => `${e.min}’${e.pen ? ' (P)' : ''}`);
      return scorers.filter((s) => s.toLowerCase().startsWith(String(p.last || '').toLowerCase())).map((s) => (s.match(/\d+\s*(\+\s*\d+)?/) || [''])[0].replace(/\s/g, '')).filter(Boolean).map((m) => `${m}’`);
    };
    const chip = (ico, txt, cls) => `<span class="mcq-chip ${cls || ''}">${ico}${esc(txt)}</span>`;
    const pRow = (p) => {
      const chips = [
        ...goalMins(p).map((m) => chip(BALL, m, 'goal')),
        ...evs.filter((e) => e.kind === 'card' && e.pid === p.id).map((e) => chip(`<i class="mcq-card ${e.color === 'r' ? 'r' : 'y'}" aria-label="${e.color === 'r' ? 'Red card' : 'Yellow card'}"></i>`, `${e.min}’`))
      ];
      const off = evs.find((e) => e.kind === 'sub' && e.pid === p.id), on = evs.find((e) => e.kind === 'sub' && e.pin === p.id);
      const swapLine = (e, other) => (other ? `<span class="mcq-sub">${SWAP}<b>${esc(other.no)}</b> ${esc(other.last)} ${esc(e.min)}’</span>` : '');
      return `<li class="mcq-p"><span class="mcq-no">${esc(p.no)}</span><span class="mcq-pic">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : ''}</span>
        <span class="mcq-nm"><span>${esc(p.first ? `${p.first} ` : '')}${esc(p.last)}${lu.roles.captain === p.id ? ' <abbr class="mcq-c" title="Captain">C</abbr>' : ''}</span>${off ? swapLine(off, byId(off.pin)) : ''}${on ? swapLine(on, byId(on.pid)) : ''}</span>
        <span class="mcq-chips">${chips.join('')}</span></li>`;
    };
    void everyone;
    const squad = `<section class="mcq" data-squad aria-label="${DU.x('mc.squad', 'Dallas United squad')}"><div class="v2-wrap">
      <div class="v2-sh"><h2 class="v2-h2">${DU.x('mc.squadH', 'Our squad')}</h2>${upcoming && !lu.saved ? `<span class="mcq-note">${DU.x('mc.pred', 'Predicted line-up. The real one is posted before kick-off.')}</span>` : ''}</div>
      <div class="mcq-grid">
        <div class="mcq-card-box"><div class="mcq-head"><h3>${DU.x('mc.xi', 'Starting XI')}</h3><span class="mcq-form">${DU.x('mc.formation', 'Formation')} ${esc(lu.formation)}</span>
          ${lu.coach ? `<span class="mcq-coach">${DU.x('mc.coach', 'Head coach')}: <b>${esc(lu.coach.first)} ${esc(lu.coach.last)}</b></span>` : ''}</div>
          <ul class="mcq-list">${lu.xi.map(pRow).join('')}</ul></div>
        <div class="mcq-card-box"><div class="mcq-head"><h3>${DU.x('match-centre.2', 'Substitutes')}</h3></div>
          ${lu.subs.length ? `<ul class="mcq-list">${lu.subs.map(pRow).join('')}</ul>` : `<p class="mcq-empty">${DU.x('mc.tba', 'To be announced.')}</p>`}</div>
      </div></div></section>`;

    const parseList = (txt) => String(txt || '').split(',').map((x) => x.trim()).filter(Boolean).map((x) => { const m = x.match(/(\d+)\s*(\+\s*\d+)?\s*[’']?/); return { min: m ? m[0].replace(/[’'\s]/g, '') : '', who: x.replace(/\(?\d+\s*(\+\s*\d+)?\s*[’']?\)?/, '').replace(/\(P\)/i, '').trim(), pen: /\(P\)/i.test(x) }; });
    const tl = ranLive && evs.length ? evs.slice() : !ranLive && (scorers.length || theirScorers.length) ? [...parseList(f.scorers).map((g) => ({ kind: 'goal', dd: 1, min: g.min, who: g.who, pen: g.pen })), ...parseList(f.oppScorers).map((g) => ({ kind: 'goal', od: 1, min: g.min, who: g.who, pen: g.pen }))] : [];
    const minOf = (e) => { const m = String(e.min || '').match(/(\d+)(?:\+(\d+))?/); return m ? Number(m[1]) + (m[2] ? Number(m[2]) / 100 : 0) : -1; };
    tl.sort((x, y) => minOf(y) - minOf(x));
    const ours = (e) => e.kind === 'goal' ? !!e.dd : e.kind === 'card' || e.kind === 'sub' ? !e.od : null;
    const who = (e) => { const p = e.pid && byId(e.pid); return p ? `${p.first ? `${p.first} ` : ''}${p.last}` : (e.who || ''); };
    const tlRow = (e) => {
      const side = ours(e); const pin = e.pin && byId(e.pin);
      let ico = '', title = '', sub = '';
      if (e.kind === 'goal') { ico = `<span class="mct-ic goal">${BALL}</span>`; title = e.og ? DU.x('mc.og', 'Own goal') : (who(e) || (side ? 'Dallas United' : f.opp)); sub = `${DU.x('mc.goal', 'Goal')}${e.pen ? ` · ${DU.x('mc.pen', 'Penalty')}` : ''}`; }
      else if (e.kind === 'card') { ico = `<span class="mct-ic"><i class="mcq-card ${e.color === 'r' ? 'r' : 'y'}"></i></span>`; title = who(e); sub = e.color === 'r' ? DU.x('mc.red', 'Red card') : DU.x('mc.yellow', 'Yellow card'); }
      else if (e.kind === 'sub') { ico = `<span class="mct-ic sub">${SWAP}</span>`; title = pin ? `${pin.first ? `${pin.first} ` : ''}${pin.last}` : who(e); sub = `${DU.x('mc.on', 'On')}${pin ? ` · ${DU.x('mc.offFor', 'off')}: ${esc(who(e))}` : ''}`; }
      else { return `<li class="mct-row mid"><span class="mct-min">${esc(e.min ? `${e.min}’` : '')}</span><span class="mct-note">${esc(e.text || '')}</span></li>`; }
      return `<li class="mct-row ${side ? 'us' : 'them'}"><span class="mct-min">${esc(e.min ? `${String(e.min).replace(/[’']/g, '')}’` : '')}</span><div class="mct-ev">${ico}<span><b>${esc(title)}</b><small>${sub}</small></span></div></li>`;
    };
    const timeline = tl.length ? `<section class="mct" data-timeline aria-label="${DU.x('mc.tl', 'Match timeline')}"><div class="v2-wrap">
      <div class="v2-sh"><h2 class="v2-h2">${DU.x('mc.tlH', 'Timeline')}</h2></div>
      <div class="mct-teams"><span>${esc(DU.teams(f)[f.ha === 'Home' ? 0 : 1])}</span><span>${esc(f.opp)}</span></div>
      <ol class="mct-list">${tl.map(tlRow).join('')}</ol></div></section>` : '';
    return { f, a, b, panel, video, squad, timeline, hasVideo: !!vid };
  }

  function render(partial) {
    const x = build();
    if (partial && hadVideo === x.hasVideo) {
      const tmp = document.createElement('div'); tmp.innerHTML = `${x.panel}${x.squad}${x.timeline}`;
      const p = DU.$('.mcx-panel'), s = DU.$('[data-squad]');
      if (p) p.replaceWith(tmp.querySelector('.mcx-panel'));
      if (s) s.replaceWith(tmp.querySelector('[data-squad]'));
      const t0 = DU.$('[data-timeline]'), t1 = tmp.querySelector('[data-timeline]');
      if (t0 && t1) t0.replaceWith(t1); else if (t1 && DU.$('[data-squad]')) DU.$('[data-squad]').after(t1); else if (t0) t0.remove();
      return;
    }
    hadVideo = x.hasVideo;
    main.innerHTML = `
    <section class="mcx mcx2">
      <div class="mcx-photo">${DU.media(x.f.img || DU.pic('matches.heroImg', 'assets/img/matchday-stadium.jpg'), 'alt=""')}</div><div class="mcx-shade"></div>
      <div class="mcx-in"><h1 class="sr-only">Match Centre: ${esc(x.a)} vs ${esc(x.b)}</h1>${x.panel}</div>
    </section>
    ${x.video}
    ${x.squad}
    ${x.timeline}
    ${DU.on('dutv', DU.fresh()) ? `<div class="tvp">${DU.tvRow({ title: DU.x('matches.hl', 'Match highlights'), list: DU.highlightsFor(DU.fresh(), x.f), more: true })}</div>` : ''}`;
    DU.bindTvRows(main, DU.fresh());
  }
  render();
  DU.layout({ active: 'matches', v2: true });
  let last = '';
  setInterval(() => { const d = DU.fresh(); if (!(d.live.running || DU.LIVE_PERIODS.includes(d.live.period))) return; const key = JSON.stringify([d.live.du, d.live.op, d.live.period, (d.live.events || []).length, Math.floor((DU.liveFor(d, d.fixtures.find((g) => g.id === d.live.fixtureId)) || {}).minute || 0)]); if (key === last) return; last = key; render(true); }, 5000);
  window.addEventListener('storage', () => render(true));
})();
