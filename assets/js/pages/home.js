(function () {
  const d = DU.store.get(), tr = DU.tr, t = DU.t, esc = DU.esc, sv = DU.sv;
  const main = DU.$('#main');
  const H = d.home2 || {};
  const on = (k) => DU.on(k, d);
  const posts = DU.publishedPosts(d);
  const arrows = (l1, l2) => `<div class="v2-arr"><button type="button" class="v2-ic" data-move="-1" aria-label="${l1}">${sv('left')}</button><button type="button" class="v2-ic" data-move="1" aria-label="${l2}">${sv('right')}</button></div>`;
  const more = (href, label) => `<a class="v2-more" href="${href}">${sv('right')}${label}</a>`;
  const pic = (src, attrs) => DU.media(src, `alt="" ${attrs || 'loading="lazy"'}`);

  const heroPosts = (() => { const f = posts.filter((p) => p.featured); return [...f, ...posts.filter((p) => !p.featured)].slice(0, Math.max(1, Math.min(6, Number(H.heroCount) || 4))); })();
  const SECS = Math.max(3, Number(H.heroSecs) || 6);
  const heroHTML = () => (on('hero') && heroPosts.length ? `
    <div class="hx-hb" data-hero style="--secs:${SECS}s">
      ${heroPosts.map((p, i) => `<div class="hx-hs${i ? '' : ' on'}" data-hs="${i}">${DU.media(p.img, `alt="" ${i ? 'loading="lazy"' : ''}`)}</div>`).join('')}
      <div class="hx-shade"></div>
      ${DU.socials(d).length ? `<div class="hx-soc">${DU.socialBtns(d)}</div>` : ''}
      <div class="hx-bot">
        <div class="hx-tx">${heroPosts.map((p, i) => `<div class="hx-t${i ? '' : ' on'}" data-ht="${i}"${i ? ' aria-hidden="true"' : ''}><span class="v2-kick gold">${esc(p.cat)}</span><h1 class="hx-h">${esc(t(p.title))}</h1><a class="v2-btn v2-btn-p" href="news.html?post=${esc(p.id)}"${i ? ' tabindex="-1"' : ''}>${tr('c.readMore')}</a></div>`).join('')}</div>
        ${heroPosts.length > 1 ? `<div class="hx-tabs" role="tablist" aria-label="${DU.x('hx.stories', 'Top stories')}">${heroPosts.map((p, i) => `<button type="button" class="hx-tab${i ? '' : ' on'}" role="tab" aria-selected="${!i}" data-tab="${i}"><i class="hx-bar"></i>${DU.media(p.img, 'alt="" loading="lazy"')}<span>${esc(t(p.title))}</span></button>`).join('')}</div>` : ''}
      </div>
    </div>` : '');

  const nextUp = (x) => { const lf = x.fixtures.find((f) => DU.liveFor(x, f)); if (lf) return lf; const now = Date.now(); return DU.sortFx(x.fixtures).find((f) => ['Upcoming', 'Live', 'Half-time'].includes(f.status) && DU.dt(f.date, f.time).getTime() > now - 2.5 * 36e5) || null; };
  const stripColor = (c) => (c === 'Texas Cup' ? 'cup' : c === 'Friendly' ? 'fr' : '');
  const lgName = (f) => (f.comp === 'League' ? [d.settings.leagueShort || d.settings.league, d.settings.leagueDivision].filter(Boolean).join(' ') : DU.compName(f.comp));
  const matchCards = (x) => {
    const list = DU.sortFx(x.fixtures).filter((f) => f.status !== 'Postponed');
    const nx = nextUp(x);
    return list.map((f) => {
      const [a, b] = DU.teams(f); const lv = DU.liveFor(x, f);
      const live = !!lv || f.status === 'Live' || f.status === 'Half-time';
      const [sa, sb] = lv ? (f.ha === 'Home' ? [lv.L.du, lv.L.op] : [lv.L.op, lv.L.du]) : DU.score(f);
      const mid = f.status === 'Full time'
        ? `<div class="hx-score">${esc(sa)} : ${esc(sb)}</div><div class="hx-msub">${tr('c.fullTime')} · ${esc(DU.fmtDay(f.date))}</div>`
        : live ? `<div class="hx-score">${esc(sa || 0)} : ${esc(sb || 0)}</div><div class="hx-msub"><span class="live-dot"></span> ${tr('c.live')}${lv ? ` · ${esc(lv.label)}` : ''}</div>`
          : `<div class="hx-mdate">${esc(DU.fmtDate(f.date))}</div><div class="hx-msub">${esc(DU.fmtTime(f.time))} · ${f.ha === 'Home' ? DU.x('hx.home', 'Home') : DU.x('hx.away', 'Away')}</div>`;
      const isNext = nx && f.id === nx.id;
      return `<a class="hx-mc${isNext ? ' next' : ''}${live ? ' live' : ''}" href="match-centre.html?id=${esc(f.id)}"${isNext ? ' data-next' : ''}>
        <span class="hx-strip ${stripColor(f.comp)}"></span>${isNext ? `<span class="hx-ntag">${live ? tr('c.live') : DU.x('hx.next', 'Next match')}</span>` : ''}
        <span class="hx-mci">${DU.crestFor(a, f, 'hx-crest')}<span><span class="hx-mcomp">${esc(lgName(f))}</span>${mid}</span>${DU.crestFor(b, f, 'hx-crest')}</span></a>`;
    }).join('');
  };
  const nextHTML = () => (on('matchday') && d.fixtures.length ? `
    <div class="hx-nm" data-slider>
      <div class="hx-nmh"><div class="hx-cd" data-cd></div><a class="v2-btn v2-btn-o" href="matches.html">${DU.x('h.allMatches', 'All matches')}</a></div>
      <div class="v2-trk hx-mrow" data-trk>${matchCards(d)}</div>
      <div class="hx-nmf">${arrows(DU.x('hx.prevM', 'Earlier matches'), DU.x('hx.nextM', 'Later matches'))}</div>
    </div>` : '');

  const lead = posts.find((p) => p.featured && !heroPosts.slice(0, 1).includes(p)) || posts[0];
  const rest = posts.filter((p) => p !== lead).slice(0, 8);
  const newsCard = (p) => `<a class="hx-nc" href="news.html?post=${esc(p.id)}"><span class="hx-ncp">${pic(p.img)}</span><span class="hx-ncx"><span class="v2-kick cat">${esc(p.cat)}</span><span class="hx-nct">${esc(t(p.title))}</span><span class="hx-date">${esc(DU.fmtDate(p.date))}</span></span></a>`;

  const igLink = d.settings.instagram || `https://instagram.com/${H.igHandle || ''}`;
  const igTile = (p) => { const vid = DU.isVideo(p.img); return `<a class="hx-igt" href="${esc(p.link || igLink)}" target="_blank" rel="noopener" aria-label="${esc(p.caption || DU.x('hx.igView', 'View on Instagram'))}">${pic(p.img)}${vid ? `<span class="hx-igb">${sv('play')}</span>` : ''}<span class="hx-igo"><span>${esc(String(p.caption || '').slice(0, 180))}</span><small>${DU.x('hx.igView', 'View on Instagram')}</small></span></a>`; };
  const igManual = (d.igPosts || []).filter((p) => p.img).map((p) => ({ img: p.img, caption: t(p.caption), link: p.link }));

  const vids = (d.videos || []).slice(0, 10);
  const tvCard = (v) => `<button type="button" class="hx-tc" data-play="${esc(v.id)}">${pic(v.thumb)}<span class="hx-tcs"></span><span class="hx-play">${sv('play')}</span><span class="hx-tcx"><span class="v2-kick gold">${esc(v.cat || '')}</span><span class="hx-tct">${esc(t(v.title))}</span></span></button>`;
  const nu = nextUp(d); const upcoming = nu ? DU.sortFx(d.fixtures).filter((f) => DU.dt(f.date, f.time) >= DU.dt(nu.date, nu.time) && ['Upcoming', 'Live', 'Half-time'].includes(f.status)).slice(0, 10) : [];
  const gameCard = (f) => {
    const [a, b] = DU.teams(f); const live = DU.liveFor(d, f) || f.status === 'Live' || f.status === 'Half-time';
    const tix = DU.ticketsOn(d) && f.ha === 'Home' && (f.tickets || d.settings.ticketPage);
    return `<div class="hx-gc">${pic(f.img || H.gamesImg || DU.pic('matches.heroImg', 'assets/img/matchday-stadium.jpg'))}<div class="hx-gcx">
      <span class="v2-kick gold">${esc(lgName(f))}</span><span class="hx-gcd">${esc(DU.fmtDay(f.date))} · ${esc(DU.fmtTime(f.time))}</span>
      <span class="hx-gcr">${DU.crestFor(a, f, 'hx-crest')}${DU.crestFor(b, f, 'hx-crest')}</span>
      <span class="hx-gn">${esc(a)}<span>${esc(b)}</span></span><span class="hx-gcv">${esc(f.venue || '')}</span>
      ${live ? `<a class="v2-btn v2-btn-live" href="match-centre.html?id=${esc(f.id)}"><span class="live-dot"></span>${tr('c.live')} · ${tr('c.matchCentre')}</a>`
        : tix ? `<a class="v2-btn v2-btn-p" href="${esc(DU.ticketUrl(f, d))}" target="_blank" rel="noopener">${DU.x('hx.tix', 'Tickets')}</a>`
          : `<a class="v2-btn v2-btn-o" href="match-centre.html?id=${esc(f.id)}">${tr('c.matchCentre')}</a>`}</div></div>`;
  };

  const slides = (d.storeSlides || []).filter((s) => s.img);

  const fan = (cards, img, label, small) => { const c = (cards || []).slice(0, 4); return `<div class="hx-fan">${c.map((x, i) => `<div class="hx-fc hx-f${i + 1}">${pic(x.img)}<b>${esc(t(x.label))}</b></div>`).join('')}<div class="hx-fc hx-f0"><img src="${esc(img)}" alt="" loading="lazy"><b>${esc(label)}</b><small>${esc(small)}</small></div></div>`; };
  const show214 = on('club214') && H.c214On !== false && (!d.clubTexts || d.clubTexts.on !== false);
  const showFd = on('founders') && H.fdOn !== false;

  const heroBox = on('hero') ? heroHTML() : '', nextBox = on('matchday') ? nextHTML() : '';
  main.innerHTML = `
${heroBox ? `<section class="hx-hero"><div class="v2-wrap">${heroBox}</div></section>` : ''}
${nextBox ? `<section class="hx-next"><span class="hx-next-bg" aria-hidden="true"></span><div class="v2-wrap">${nextBox}</div></section>` : ''}

${on('news') && posts.length ? `
  <section class="v2-sec v2-lt" data-slider><div class="v2-wrap">
    <div class="v2-sh"><h2 class="v2-h2">${tr('h.latest')}</h2><div class="v2-shr">${arrows(DU.x('hx.prevN', 'Earlier news'), DU.x('hx.nextN', 'More news'))}${more('news.html', DU.x('hx.allNews', 'All news'))}</div></div>
    ${lead ? `<a class="hx-feat" href="news.html?post=${esc(lead.id)}">${pic(lead.img)}<span class="hx-featx"><span class="v2-kick cat">${esc(lead.cat)}</span><span class="hx-featt">${esc(t(lead.title))}</span>${t(lead.sum) ? `<span class="hx-sum">${esc(t(lead.sum))}</span>` : ''}<span class="hx-date">${esc(DU.fmtDate(lead.date))}</span><span class="v2-more">${sv('right')}${tr('c.readMore')}</span></span></a>` : ''}
    ${rest.length ? `<div class="v2-trk hx-ntr" data-trk>${rest.map(newsCard).join('')}</div>` : ''}
  </div></section>` : ''}

${(H.igOn !== false) || (d.homeTexts.videoOn && d.homeTexts.videoUrl && on('video')) ? `
  <section class="v2-sec v2-wt hx-social">
    ${H.igOn !== false ? `<div class="v2-wrap">
      <div class="hx-igh"><img class="hx-igav" src="${DU.CREST}" alt=""><span class="hx-ign"><b data-ig-user>${esc(H.igHandle || 'dallasunitedfc')}</b><span data-ig-name>${esc(H.igName || d.settings.clubName)}</span></span><a class="v2-btn v2-btn-d" href="${esc(igLink)}" target="_blank" rel="noopener">${sv('instagram')}${DU.x('hx.follow', 'Follow')}</a></div>
      <div class="hx-igg" data-ig data-zs>${igManual.slice(0, 10).map(igTile).join('')}</div>
    </div>` : ''}
  </section>` : ''}

${on('dutv') && vids.length ? `
  <section class="v2-sec hx-dark" data-slider>${H.tvImg ? `<span class="hx-bg">${pic(H.tvImg)}</span>` : ''}
    <div class="hx-side"><div class="hx-sl"><h2 class="v2-big">DU TV</h2>${t(H.tvText) ? `<p>${esc(t(H.tvText))}</p>` : ''}</div>
      <div class="v2-trk hx-ttr" data-trk>${vids.map(tvCard).join('')}</div></div>
    <div class="v2-wrap"><div class="hx-foot">${arrows(DU.x('hx.prevV', 'Earlier videos'), DU.x('hx.nextV', 'More videos'))}${more('dutv.html', DU.x('hx.allTv', 'Go to DU TV'))}</div></div>
  </section>` : ''}

${on('matches') && H.gamesOn !== false && upcoming.length ? `
  <section class="v2-sec hx-dark hx-games" data-slider>${H.gamesImg ? `<span class="hx-bg">${pic(H.gamesImg)}</span>` : ''}
    <div class="hx-side"><div class="hx-sl"><h2 class="v2-big">${esc(t(H.gamesTitle) || 'Games')}</h2>${t(H.gamesText) ? `<p>${esc(t(H.gamesText))}</p>` : ''}</div>
      <div class="v2-trk hx-ttr" data-trk>${upcoming.map(gameCard).join('')}</div></div>
    <div class="v2-wrap"><div class="hx-foot">${arrows(DU.x('hx.prevG', 'Earlier games'), DU.x('hx.nextG', 'Later games'))}${more('matches.html', DU.x('h.allMatches', 'All matches'))}</div></div>
  </section>` : ''}

${on('standings') ? `
  <section class="section reveal" style="position:relative;overflow:hidden;background:#fff">
    ${(() => { const w = String(d.homeTexts.bgWords || '').split('/').map((x) => x.trim()).filter(Boolean); return w.length ? `<div class="giant-words left" aria-hidden="true">${w.map(esc).join('<br>')}</div><div class="giant-words right" aria-hidden="true">${w.map(esc).join('<br>')}</div>` : ''; })()}
    <div class="container hx-std">
      <div class="hx-sttabs" role="tablist" aria-label="${esc(tr('h.standings'))}">${[['league', tr('c.league')], ['cup', tr('c.cup')]].map(([k, l], i) => `<button type="button" class="hx-sttab" role="tab" data-table="${k}" aria-pressed="${i === 0}" aria-selected="${i === 0}">${l}</button>`).join('')}</div>
      <div class="hx-stbody" data-table-body></div>
      <p class="hx-stmore"><a class="link" href="matches.html?tab=standings">${tr('h.fullTable')} →</a></p>
    </div>
  </section>` : ''}

${d.homeTexts.videoOn && d.homeTexts.videoUrl && on('video') ? `<section class="hx-vidsec"><div class="hx-vid">
    <section class="promo-video" aria-label="${esc(t(d.homeTexts.videoTitle) || 'Dallas United')}">
      <video autoplay muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback" tabindex="-1" poster="${esc(d.homeTexts.videoImg || '')}" src="${esc(d.homeTexts.videoUrl)}"></video>
    </section>
    </div></section>` : ''}

${on('shop') && on('shopOpen') && slides.length ? `
  <section class="v2-sec v2-lt" data-slider>
    <div class="hx-side hx-kit"><div class="hx-kl"><span class="v2-kick cat">${esc(t(H.storeKick) || 'Official store')}</span><h2 class="v2-h2" data-kit-title aria-live="polite">${esc(t(slides[0].title))}</h2>${t(H.storeText) ? `<p>${esc(t(H.storeText))}</p>` : ''}<a class="v2-btn v2-btn-p" data-kit-buy href="${esc(slides[0].link || 'shop.html')}">${esc(t(H.storeBtn) || 'Buy now')}</a></div>
      <div class="v2-trk hx-ktr" data-trk data-kit>${slides.map((s, i) => `<a class="hx-kc${i ? '' : ' on'}" href="${esc(s.link || 'shop.html')}" data-kt="${esc(t(s.title))}">${pic(s.img)}<span>${esc(t(s.title))}</span></a>`).join('')}</div></div>
    <div class="v2-wrap"><div class="hx-foot">${arrows(DU.x('hx.prevK', 'Earlier products'), DU.x('hx.nextK', 'More products'))}${more('shop.html', esc(t(H.storeAll) || 'Go to online store'))}</div></div>
  </section>` : ''}

${show214 || showFd ? `
  <section class="v2-sec hx-mem"><div class="v2-wrap hx-mbs">
    ${show214 ? `<div class="hx-mb c214 reveal">${H.c214Bg ? `<span class="hx-bg">${pic(H.c214Bg)}</span>` : ''}${fan(d.c214Cards, H.c214Img || 'assets/img/card-214-front.jpg', t(H.c214Label) || '214 Club', t(H.c214Small) || '')}
      <div class="hx-mbx">${t(H.c214Kick) ? `<span class="v2-kick">${esc(t(H.c214Kick))}</span>` : ''}<h2 class="hx-mbh">${esc(t(H.c214Title))}</h2><p>${esc(t(H.c214Text))}</p><a class="v2-btn v2-btn-w" href="${esc(H.c214Link || '214-club.html')}">${esc(t(H.c214Btn) || 'Join now')}</a></div></div>` : ''}
    ${showFd ? `<div class="hx-mb fd reveal">${H.fdBg ? `<span class="hx-bg">${pic(H.fdBg)}</span>` : ''}
      <div class="hx-mbx">${t(H.fdKick) ? `<span class="v2-kick gold">${esc(t(H.fdKick))}</span>` : ''}<h2 class="hx-mbh">${esc(t(H.fdTitle))}</h2><p>${esc(t(H.fdText))}</p><a class="v2-btn v2-btn-p" href="${esc(H.fdLink || 'founders.html')}">${esc(t(H.fdBtn) || 'Claim your number')}</a></div>
      ${fan(d.fdCards, H.fdImg || 'assets/img/card-founder-front.jpg', t(H.fdLabel) || 'Founders 500', t(H.fdSmall) || '')}</div>` : ''}
  </div></section>` : ''}`;

  DU.layout({ active: 'home', v2: true });
  DU.zSlide(main);

  DU.$$('[data-slider]').forEach((root) => {
    const trk = DU.$('[data-trk]', root); if (!trk) return;
    DU.$$('[data-move]', root).forEach((b) => b.addEventListener('click', () => trk.scrollBy({ left: Number(b.dataset.move) * Math.max(280, trk.clientWidth * 0.7), behavior: 'smooth' })));
  });

  DU.$$('.hx-tc[data-play]').forEach((b) => b.addEventListener('click', () => DU.playVideo(d, b.dataset.play)));

  const hero = DU.$('[data-hero]');
  if (hero) {
    const n = heroPosts.length; let cur = 0, timer = null;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let paused = reduce;
    const show = (i) => {
      cur = (i + n) % n;
      DU.$$('[data-hs]', hero).forEach((el) => el.classList.toggle('on', Number(el.dataset.hs) === cur));
      DU.$$('[data-ht]', hero).forEach((el) => { const yes = Number(el.dataset.ht) === cur; el.classList.toggle('on', yes); el.setAttribute('aria-hidden', String(!yes)); const a = el.querySelector('a'); if (a) a.tabIndex = yes ? 0 : -1; });
      const W = Math.min(3, innerWidth < 760 ? 1 : innerWidth < 1100 ? 2 : 3); hero.style.setProperty('--tw', W);
      const start = n > W ? Math.floor(cur / W) * W : 0;
      const win = n > W ? Array.from({ length: W }, (_, k) => (start + k) % n) : null;
      DU.$$('[data-tab]', hero).forEach((el) => { const k = Number(el.dataset.tab); const pos = win ? win.indexOf(k) : k; el.hidden = pos < 0; el.style.order = String(pos < 0 ? 9 : pos); });
      DU.$$('[data-tab]', hero).forEach((el) => { const yes = Number(el.dataset.tab) === cur; el.classList.remove('on'); el.setAttribute('aria-selected', String(yes)); if (yes) { void el.offsetWidth; el.classList.add('on'); } });
    };
    const arm = () => { clearTimeout(timer); if (!paused && n > 1) timer = setTimeout(() => { show(cur + 1); arm(); }, SECS * 1000); };
    DU.$$('[data-tab]', hero).forEach((b) => b.addEventListener('click', () => { show(Number(b.dataset.tab)); arm(); }));
    show(0); arm();
    let rz = null, lastW = innerWidth < 760 ? 1 : innerWidth < 1100 ? 2 : 3; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { const w = innerWidth < 760 ? 1 : innerWidth < 1100 ? 2 : 3; if (w !== lastW) { lastW = w; show(cur); arm(); } }, 150); });
  }

  const cdEl = DU.$('[data-cd]'), mrow = DU.$('.hx-mrow');
  if (cdEl) {
    let dd = d;
    const two = (x) => String(Math.max(0, x)).padStart(2, '0');
    const tick = () => {
      const nf = nextUp(dd); const lv = nf && (DU.liveFor(dd, nf) || nf.status === 'Live' || nf.status === 'Half-time');
      if (!nf) { cdEl.innerHTML = ''; return; }
      let ms = DU.dt(nf.date, nf.time) - Date.now();
      if (lv) { cdEl.innerHTML = `<span class="v2-kick">${DU.x('hx.nextL', 'Next match')}</span><div class="hx-cdlive"><span class="live-dot"></span>${tr('c.live')}</div>`; return; }
      if (ms <= 0) { cdEl.innerHTML = `<span class="v2-kick">${DU.x('hx.nextL', 'Next match')}</span><div class="hx-cdlive hx-today">${DU.x('hx.today', 'Match day')}</div>`; return; }
      const D = Math.floor(ms / 864e5); ms -= D * 864e5; const h = Math.floor(ms / 36e5); ms -= h * 36e5; const m = Math.floor(ms / 6e4); const s = Math.floor((ms - m * 6e4) / 1000);
      cdEl.innerHTML = `<span class="v2-kick">${DU.x('hx.nextL', 'Next match')}</span><div class="hx-cdn">${[[D, DU.x('hx.d', 'Days')], [h, DU.x('hx.h', 'Hrs')], [m, DU.x('hx.m', 'Min')], [s, DU.x('hx.s', 'Sec')]].map(([v, l]) => `<span class="n"><b>${two(v)}</b><small>${l}</small></span>`).join('<i>:</i>')}</div>`;
    };
    tick(); setInterval(tick, 1000);
    const centre = () => { const nx = mrow && DU.$('[data-next]', mrow); if (!nx) return; const r = nx.getBoundingClientRect(), rr = mrow.getBoundingClientRect(); mrow.scrollLeft += (r.left - rr.left) - Math.max(0, (rr.width - r.width) / 2); };
    requestAnimationFrame(centre); window.addEventListener('load', centre, { once: true });
    let lastKey = JSON.stringify([d.live, d.fixtures.map((f) => [f.id, f.status, f.du, f.op])]);
    const liveTick = () => {
      const x = DU.fresh(); if (!x || !x.live) return;
      const key = JSON.stringify([x.live, x.fixtures.map((f) => [f.id, f.status, f.du, f.op])]);
      const running = DU.LIVE_PERIODS.includes(x.live.period);
      if (key !== lastKey || running) { const keep = mrow.scrollLeft; lastKey = key; dd = x; mrow.innerHTML = matchCards(x); mrow.scrollLeft = keep; tick(); }
    };
    setInterval(liveTick, 5000);
    window.addEventListener('storage', liveTick);
  }

  const ig = DU.$('[data-ig]');
  if (ig && H.igFeed) {
    fetch(H.igFeed).then((r) => r.json()).then((j) => {
      const list = Array.isArray(j) ? j : (j.posts || j.data || j.media || []);
      const items = list.map((p) => {
        const type = String(p.mediaType || p.media_type || '').toUpperCase();
        const sizes = p.sizes || {};
        const still = p.thumbnailUrl || p.thumbnail_url || (sizes.medium && sizes.medium.mediaUrl) || (sizes.large && sizes.large.mediaUrl);
        const media = p.mediaUrl || p.media_url;
        return { img: type === 'VIDEO' && media ? media : (still || media), caption: p.prunedCaption || p.caption || '', link: p.permalink || p.link || '' };
      }).filter((p) => p.img).slice(0, 10);
      if (items.length) ig.innerHTML = items.map(igTile).join('');
      if (j.username) DU.$('[data-ig-user]').textContent = j.username;
    }).catch(() => {  });
  }

  const pv = DU.$('.promo-video video');
  if (pv) {
    pv.muted = true; pv.defaultMuted = true;
    const go = () => { const p = pv.play(); if (p && p.catch) p.catch(() => {}); };
    pv.addEventListener('pause', () => { if (!document.hidden) go(); });
    pv.addEventListener('ended', go);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) go(); });
    ['contextmenu', 'click', 'dblclick'].forEach((e) => pv.addEventListener(e, (ev) => ev.preventDefault()));
    go();
  }
  DU.$$('#main video').forEach((v) => { if (v === pv) return; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); const p = v.play(); if (p && p.catch) p.catch(() => {}); });

  const tb = DU.$('[data-table-body]');
  if (tb) {
    const setTable = (k) => { tb.innerHTML = `<p class="hx-sttitle">${esc(d.table[k].title)}</p>${DU.standingsTable(d.table[k].rows, true)}`; DU.$$('[data-table]').forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.table === k)); b.setAttribute('aria-selected', String(b.dataset.table === k)); }); };
    DU.$$('[data-table]').forEach((b) => b.addEventListener('click', () => setTable(b.dataset.table)));
    setTable('league');
  }

  const kit = DU.$('[data-kit]');
  if (kit) {
    const title = DU.$('[data-kit-title]'), buy = DU.$('[data-kit-buy]');
    const cards = DU.$$('.hx-kc', kit);
    let curK = 0;
    const pick = () => {
      const x0 = kit.getBoundingClientRect().left;
      let best = 0, bd = Infinity;
      cards.forEach((c, i) => { const dist = Math.abs(c.getBoundingClientRect().left - x0); if (dist < bd) { bd = dist; best = i; } });
      if (kit.scrollLeft + kit.clientWidth >= kit.scrollWidth - 4 && bd > 8) best = cards.length - 1;
      if (best === curK) return; curK = best;
      cards.forEach((c, i) => c.classList.toggle('on', i === best));
      title.textContent = cards[best].dataset.kt; buy.href = cards[best].getAttribute('href');
    };
    kit.addEventListener('scroll', () => requestAnimationFrame(pick), { passive: true });
  }
})();
