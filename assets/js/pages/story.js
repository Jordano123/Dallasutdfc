(function () {
  const d = DU.store.get(), t = DU.t, esc = DU.esc;
  const main = DU.$('#main');
  const st = d.story || {};
  const P = d.storyParts || [], C = d.storyColors || [], G = (d.storyGallery || []).filter((g) => g.img);
  const STEPS = ['star', 'river', 'name', 'year', 'circle', 'all'];
  const stepImg = (p) => (STEPS.includes(p.step) ? `assets/brand/crest-steps/${p.step}.svg` : DU.CREST);
  const two = (n) => String(n).padStart(2, '0');
  const paras = (txt) => String(txt || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join('');
  const ink = (hex) => { const h = String(hex).replace('#', ''); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#121A2B' : '#FFFFFF'; };

  const storyText = paras(t(st.intro)) + paras(t(st.teamText));
  const storyMedia = DU.ytEmbed(st.teamVideo) ? DU.ytPlayer(st.teamVideo).replace('autoplay=1', 'autoplay=0') : DU.media(st.teamImg || 'assets/img/fans.jpg', 'alt="" loading="lazy"');
  const crestPic = st.crestImg ? `<span class="sty-cb-bg">${DU.media(st.crestImg, 'alt="" loading="lazy"')}</span>` : `<span class="sty-cb-bg is-crest"><img src="${DU.CREST}" alt="" loading="lazy"></span>`;
  const slidePic = (p) => (p.img ? DU.media(p.img, 'alt="" loading="lazy"') : `<span class="sty-sl-crest"><img src="${esc(stepImg(p))}" alt="" loading="lazy"></span>`);
  const showCrest = st.crestOn !== false, showParts = st.beyondOn !== false && P.length;

  main.innerHTML = `
  <section class="sty-hero">
    <span class="sty-hero-bg">${DU.media(st.heroImg || 'assets/img/stadium-night.jpg', 'alt=""')}</span><span class="sty-hero-shade"></span>
    <div class="v2-wrap sty-hero-in"><span class="v2-kick gold">${esc(t(st.heroKick) || 'Dallas United FC')}</span><h1 class="v2-big">${esc(t(st.heroTitle) || DU.tr('nav.story'))}</h1></div>
  </section>

  ${st.teamOn !== false ? `<section class="sty-two">
    <div class="sty-two-pic">${storyMedia}</div>
    <div class="sty-two-tx"><h2 class="v2-h2">${esc(t(st.teamTitle) || 'Our story')}</h2>${storyText || `<p>${DU.x('story.tsSoon', 'The full story of how Dallas United started is coming soon.')}</p>`}</div>
  </section>` : ''}

  ${showCrest || showParts ? `<section class="sty-three"><div class="v2-wrap">
    ${showCrest ? `<div class="sty-cb">${crestPic}
      <div class="sty-tab sty-tab-b"><span class="v2-kick">${esc(t(st.crestKick) || 'Dallas United FC')}</span><h2 class="v2-h2">${esc(t(st.crestTitle) || 'Behind the crest')}</h2>${t(st.crestText) ? `<p>${esc(t(st.crestText))}</p>` : ''}</div>
    </div>` : ''}
    ${showParts ? `<div class="sty-pp" data-slider aria-roledescription="carousel" aria-label="${esc(t(st.beyondTitle) || 'Piece by piece')}">
      <div class="sty-tab sty-tab-t"><h2 class="v2-h2">${esc(t(st.beyondTitle) || 'Piece by piece')}</h2></div>
      <div class="sty-sl">
        <div class="sty-sl-track">${P.map((p, i) => `<div class="sty-sl-pic${i ? '' : ' is-on'}" data-sl="${i}" aria-hidden="${i ? 'true' : 'false'}">${slidePic(p)}</div>`).join('')}</div>
        <div class="sty-sl-box" aria-live="polite">${P.map((p, i) => `<div class="sty-sl-tx${i ? '' : ' is-on'}" data-slt="${i}"${i ? ' hidden' : ''}><span class="sty-num">${two(i + 1)}<small>/${two(P.length)}</small></span><span class="v2-kick">${esc(t(p.tag))}</span><h3>${esc(t(p.name))}</h3><p>${esc(t(p.text))}</p></div>`).join('')}
          <div class="sty-sl-nav"><button type="button" class="sty-sl-b" data-slstep="-1" aria-label="Previous">${DU.lu('chevron-left')}</button><div class="sty-sl-dots">${P.map((p, i) => `<button type="button" class="sty-sl-dot" data-slgo="${i}" aria-label="${esc(t(p.name))}" aria-current="${i === 0}"><span></span></button>`).join('')}</div><button type="button" class="sty-sl-b" data-slstep="1" aria-label="Next">${DU.lu('chevron-right')}</button></div>
        </div>
      </div>
    </div>` : ''}
  </div></section>` : ''}

  ${st.colorsOn !== false && C.length ? `<section class="sty-sec sty-colors"><div class="v2-wrap">
    <h2 class="v2-h2">${esc(t(st.colorsTitle) || 'Our colors')}</h2>
    <div class="sty-sw" style="--n:${C.length}">${C.map((c) => `<div class="sty-c" tabindex="0" style="background:${esc(c.hex)};--ink:${ink(c.hex)}" aria-label="${esc(t(c.name))} ${esc(String(c.hex).toUpperCase())}">
      <div class="sty-c-info"><span class="sty-c-hex">${esc(String(c.hex).toUpperCase())}</span><h3>${esc(t(c.name))}</h3>${t(c.text) ? `<p>${esc(t(c.text))}</p>` : ''}</div></div>`).join('')}</div>
  </div></section>` : ''}

  ${st.galleryOn !== false && G.length ? `<section class="sty-sec sty-gal"><div class="v2-wrap">
    <h2 class="v2-h2">${esc(t(st.galleryTitle) || 'Gallery')}</h2>
    <div class="sty-grid" data-zs>${G.map((g, i) => `<figure class="sty-g g${i % 6}">${DU.media(g.img, 'alt="" loading="lazy"')}${t(g.cap) ? `<figcaption>${esc(t(g.cap))}</figcaption>` : ''}</figure>`).join('')}</div>
  </div></section>` : ''}`;

  const sl = DU.$('[data-slider]');
  if (sl && P.length) {
    let cur = 0, timer = null, hold = false, x0 = null;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = (n) => {
      cur = (n + P.length) % P.length;
      DU.$$('[data-sl]', sl).forEach((el) => { const on = Number(el.dataset.sl) === cur; el.classList.toggle('is-on', on); el.setAttribute('aria-hidden', String(!on)); });
      DU.$$('[data-slt]', sl).forEach((el) => { const on = Number(el.dataset.slt) === cur; el.hidden = !on; el.classList.toggle('is-on', on); });
      DU.$$('[data-slgo]', sl).forEach((el) => el.setAttribute('aria-current', String(Number(el.dataset.slgo) === cur)));
      sl.style.setProperty('--sl-reset', String(Date.now()));
      restart();
    };
    const restart = () => { clearInterval(timer); if (reduce || P.length < 2) return; sl.classList.remove('is-run'); void sl.offsetWidth; if (!hold) sl.classList.add('is-run'); timer = setInterval(() => { if (!hold && !document.hidden) go(cur + 1); }, 6000); };
    sl.addEventListener('click', (e) => { const s = e.target.closest('[data-slstep]'), g = e.target.closest('[data-slgo]'); if (s) go(cur + Number(s.dataset.slstep)); else if (g) go(Number(g.dataset.slgo)); });
    sl.addEventListener('focusin', (e) => { if (!e.target.matches(':focus-visible')) return; hold = true; sl.classList.add('is-hold'); });
    sl.addEventListener('focusout', () => { hold = false; sl.classList.remove('is-hold'); });
    const track = DU.$('.sty-sl-track', sl);
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    sl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
    restart();
  }

  DU.layout({ active: '', v2: true });
  DU.zSlide(main);
})();
