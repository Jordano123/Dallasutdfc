(function () {
  if (DU.soonPage()) return;
  const d = DU.store.get(), t = DU.t, esc = DU.esc, tr = DU.tr, sv = DU.sv;
  const paid = DU.on('tvPass', d);
  const main = DU.$('#main');
  const T = d.tvTexts || {};
  const byDate = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));
  const vids = (d.videos || []).slice();
  const ORDER = ['Highlights', 'Full match', 'Behind the scenes', 'Meet us', 'Interviews', 'Goals', 'Training', 'Community', 'Press'];
  const cats = Array.from(new Set(vids.map((v) => v.cat).filter(Boolean))).sort((a, b) => (ORDER.indexOf(a) < 0 ? 99 : ORDER.indexOf(a)) - (ORDER.indexOf(b) < 0 ? 99 : ORDER.indexOf(b)));
  const slides = (() => { const s = vids.filter((v) => v.slide); return (s.length ? s : vids.slice().sort(byDate)).slice(0, 6); })();

  function liveFix() {
    const dd = DU.fresh(); const f = dd.fixtures.find((x) => x.id === dd.live.fixtureId);
    if (!f || !f.stream || !DU.ytEmbed(f.stream)) return null;
    return (DU.liveFor(dd, f) || f.status === 'Live') ? { dd, f } : null;
  }
  function liveSide() {
    const lf = liveFix(); if (!lf) return '';
    const { dd, f } = lf; const lv = DU.liveFor(dd, f); const [ta, tb] = DU.teams(f);
    const du = lv ? dd.live.du : f.du, op = lv ? dd.live.op : f.op;
    const sa = f.ha === 'Home' ? du : op, sb = f.ha === 'Home' ? op : du;
    return `<span class="mcx-pill is-live"><span class="live-dot"></span>${tr('c.live')}${lv ? ` · ${esc(lv.label)}` : ''}</span>
      <div class="tvl-teams"><div class="tvl-row">${DU.crestFor(ta, f, 'tvl-crest')}<span class="tvl-name">${esc(ta)}</span><b>${esc(sa || 0)}</b></div><div class="tvl-row">${DU.crestFor(tb, f, 'tvl-crest')}<span class="tvl-name">${esc(tb)}</span><b>${esc(sb || 0)}</b></div></div>
      <p class="tvl-meta">${esc(DU.compName(f.comp))}${f.venue ? ` · ${esc(f.venue)}` : ''}</p>`;
  }
  const liveHero = () => { const lf = liveFix(); if (!lf) return ''; return `<div class="tvh2-in tvh2-live" data-tv-live><div class="tvh2-media">${DU.ytPlayer(lf.f.stream).replace('autoplay=1', 'autoplay=1&mute=1')}</div><div class="tvh2-side"><div data-tv-score>${liveSide()}</div><a class="v2-btn v2-btn-p" href="match-centre.html">${tr('c.matchCentre')}</a></div></div>`; };
  const sliderHero = () => (slides.length ? `<div class="tvh2-in" data-tvh2>
      <div class="tvh2-media">${slides.map((v, i) => `<button type="button" class="tvh2-slide${i ? '' : ' on'}" data-hs="${i}" data-play="${esc(v.id)}" aria-label="${DU.x('tv.play', 'Play')}: ${esc(t(v.title))}"${i ? ' tabindex="-1"' : ''}>${DU.media(v.thumb, `alt="" ${i ? 'loading="lazy"' : ''}`)}<span class="tvh2-pi" aria-hidden="true">${sv('play')}</span></button>`).join('')}</div>
      <div class="tvh2-side">
        <div class="tvh2-txs">${slides.map((v, i) => `<div class="tvh2-tx${i ? '' : ' on'}" data-ht="${i}"><span class="tvh2-meta">${v.len ? `<span>${esc(v.len)}</span>` : ''}<b>${esc(v.cat || '')}</b>${v.tag ? `<span class="tvh2-tag">${esc(v.tag)}</span>` : ''}</span><h2 class="tvh2-h">${esc(t(v.title))}</h2></div>`).join('')}</div>
        ${slides.length > 1 ? `<div class="tvh2-dots">${slides.map((v, i) => `<button type="button" data-dot="${i}" aria-label="${i + 1} / ${slides.length}" aria-current="${!i}"><span></span></button>`).join('')}</div>` : ''}
        <span class="tvh2-rule" aria-hidden="true"></span>
      </div></div>` : '');

  const up = DU.sortFx(d.fixtures).filter((f) => f.status !== 'Full time' && f.status !== 'Postponed').filter((f) => DU.liveFor(d, f) || DU.dt(f.date, f.time).getTime() > Date.now() - 2.5 * 36e5).slice(0, Number(T.upCount || 3));
  const upPic = (f) => {
    const img = f.tvImg || T.upcomingImg || DU.pic('matches.heroImg', 'assets/img/matchday-stadium.jpg');
    const [a, b] = DU.teams(f);
    return `<span class="tvu-pic">${DU.media(img, 'alt=""')}${f.tvImg ? '' : `<span class="tvu-crests">${DU.crestFor(a, f, 'tvu-crest')}<b>VS</b>${DU.crestFor(b, f, 'tvu-crest')}</span>`}</span>`;
  };
  const upHTML = up.length && T.upcomingOn !== false ? `<section class="tvu tvu2"><div class="v2-wrap">
    <h2 class="tvr-h">${DU.x('dutv.upK', 'Live & upcoming')}</h2>
    ${up.map((f) => { const [a, b] = DU.teams(f); const live = DU.liveFor(d, f); return `<div class="tvu-row"><span class="tvu-line"><span>${live ? tr('c.live').toUpperCase() : DU.x('dutv.upcoming', 'UPCOMING')}</span></span>
      <div class="tvu-grid"><span class="tvu-when"><b>${esc(DU.fmtTime(f.time))}</b><span>${esc(DU.fmtDay(f.date))}</span></span>${upPic(f)}
        <span class="tvu-copy"><b>${DU.x('dutv.live', 'Live')}: ${esc(a)} vs ${esc(b)}</b><span>${esc(f.tvText || `${DU.x('dutv.upT', 'Watch the match live on DU TV.')} ${DU.compName(f.comp)} · ${f.venue || ''}`)}</span></span>
        ${f.stream ? `<a class="v2-btn ${live ? 'v2-btn-live' : 'v2-btn-p'}" href="${live ? 'match-centre.html' : esc(f.stream)}" ${live ? '' : 'target="_blank" rel="noopener"'}>${sv('play')}${live ? DU.x('dutv.wl', 'Watch live now') : DU.x('dutv.wl2', 'Watch here')}</a>` : '<span></span>'}</div></div>`; }).join('')}
  </div></section>` : '';

  const catName = (c) => DU.x(`tv.cat.${c.toLowerCase().replace(/[^a-z]+/g, '')}`, c);
  main.innerHTML = `
  <section class="tvh2">${liveHero() || sliderHero()}</section>
  ${paid ? `<section class="v2-wrap tv-pass" style="padding-top:40px"><div class="grid-fit" style="--min:280px">
      <div class="card card-pad stack" style="--gap:10px;border-top:6px solid var(--blue)"><span class="eyebrow">${DU.x('dutv.1', 'Audio pass')}</span><span class="display" style="font-size:40px">${esc(T.audioPrice)}</span><button type="button" class="btn btn-navy" data-pass="Audio pass">${DU.x('dutv.3', 'Get the audio pass')}</button></div>
      <div class="card card-pad stack" style="--gap:10px;border-top:6px solid var(--gold);background:var(--navy);color:#fff"><span class="eyebrow">${DU.x('dutv.4', 'Video pass')}</span><span class="display" style="font-size:40px">${esc(T.videoPrice)}</span><button type="button" class="btn btn-gold" data-pass="Video pass">${DU.x('dutv.6', 'Get the video pass')}</button></div></div></section>` : ''}
  <div class="tvp">
    ${DU.tvRow({ title: DU.x('dutv.featured', 'Featured'), list: vids.slice().sort(byDate).slice(0, 10), tall: true, cls: 'tvr-feat' })}
    ${upHTML}
    ${cats.map((c) => DU.tvRow({ title: catName(c), list: vids.filter((v) => v.cat === c).sort(byDate) })).join('')}
  </div>`;
  DU.bindTvRows(main, d);
  DU.$$('[data-pass]').forEach((b) => b.addEventListener('click', () => { if (!DU.on('accounts')) { DU.toast(DU.x('tv.passSoon', 'Passes open soon.')); return; } location.href = `login.html?next=dutv&pass=${encodeURIComponent(b.dataset.pass)}`; }));

  const box = DU.$('[data-tvh2]');
  if (box) {
    const n = slides.length; let cur = 0, timer = null;
    const go = (k) => { cur = (k + n) % n; DU.$$('[data-hs]', box).forEach((el) => { const on = Number(el.dataset.hs) === cur; el.classList.toggle('on', on); el.tabIndex = on ? 0 : -1; }); DU.$$('[data-ht]', box).forEach((el) => el.classList.toggle('on', Number(el.dataset.ht) === cur)); DU.$$('[data-dot]', box).forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.dot) === cur))); };
    const play = () => { clearInterval(timer); if (n > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(cur + 1), 6000); };
    DU.$$('[data-dot]', box).forEach((b) => b.addEventListener('click', () => { go(Number(b.dataset.dot)); play(); }));
    DU.$$('[data-hs]', box).forEach((b) => b.addEventListener('click', () => DU.playVideo(d, b.dataset.play)));

    play();
  }
  setInterval(() => { const on = !!liveFix(); if (on !== !!DU.$('[data-tv-live]')) location.reload(); else if (on) { const el = DU.$('[data-tv-score]'); const h = liveSide(); if (el && h !== el.innerHTML) el.innerHTML = h; } }, 8000);
  const v0 = DU.param('v'); if (v0) setTimeout(() => DU.playVideo(d, v0), 300);
  DU.layout({ active: 'dutv', v2: true });
})();
