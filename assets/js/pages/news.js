(function () {
  const d = DU.store.get(), tr = DU.tr, t = DU.t, esc = DU.esc, sv = DU.sv;
  const main = DU.$('#main');
  const posts = DU.publishedPosts(d);
  const id = DU.param('post');
  const ago = (iso) => {
    const ms = Date.now() - new Date(`${iso}T12:00:00`).getTime(); const dd = Math.floor(ms / 864e5);
    if (dd < 1) return DU.x('news.today', 'Today'); if (dd === 1) return DU.x('news.yday', 'Yesterday'); if (dd < 7) return `${dd} ${DU.x('news.daysAgo', 'days ago')}`;
    return DU.fmtDate(iso);
  };
  const pic = (src, attrs) => DU.media(src, `alt="" ${attrs || 'loading="lazy"'}`);
  const tile = (p) => `<a class="nx-tile" href="news.html?post=${esc(p.id)}">${pic(p.img)}<span class="nx-shade"></span><span class="nx-tx"><span class="v2-kick gold">${esc(p.cat)}</span><span class="nx-tt">${esc(t(p.title))}</span></span></a>`;

  if (id) {
    const p = posts.find((x) => x.id === id) || (DU.store.isPreview ? d.posts.find((x) => x.id === id) : null);
    if (!p) { location.replace('news.html'); return; }
    document.title = `${t(p.title)} · Dallas United FC`;
    const paras = String(t(p.body) || '').split(/\n+/).filter(Boolean);
    const more = [...posts.filter((x) => x.id !== p.id && x.cat === p.cat), ...posts.filter((x) => x.id !== p.id && x.cat !== p.cat)].slice(0, 10);
    main.innerHTML = `
    <article class="nx-art">
      <header class="nx-ah">${pic(p.img, '')}<span class="nx-ah-shade"></span>
        <div class="v2-wrap nx-ah-in"><span class="nx-ghost" aria-hidden="true">${esc(t(p.title))}</span></div></header>
      <div class="nx-ab">
        <div class="nx-card">
          <div class="nx-cardtop"><span class="nx-date">${esc(DU.fmtDate(p.date))}<span class="nx-dot" aria-hidden="true">·</span><span class="nx-cat">${esc(p.cat)}</span></span>
            <button type="button" class="nx-share" data-share>${sv('share')}${tr('c.share')}</button></div>
          <h1 class="nx-h1">${esc(t(p.title))}</h1>
          <div class="nx-text">
            ${t(p.sum) ? `<p class="nx-lead">${esc(t(p.sum))}</p>` : ''}
            ${paras.map((x) => `<p>${esc(x)}</p>`).join('')}
            <a class="v2-more" href="news.html">${sv('left')}${DU.x('news.back', 'All news')}</a>
          </div>
        </div>
      </div>
    </article>
    ${more.length ? `<section class="nx-more" data-slider aria-label="${DU.x('news.moreH', 'More news')}">
      <h2 class="v2-h2 nx-more-h">${DU.x('news.moreH', 'More news')}</h2>
      <div class="nx-mrow-w"><div class="v2-trk nx-mrow" data-trk>${more.map(tile).join('')}</div>
        <button type="button" class="v2-ic nx-arr l" data-move="-1" aria-label="${DU.x('hx.prevN', 'Earlier news')}">${sv('left')}</button><button type="button" class="v2-ic nx-arr r" data-move="1" aria-label="${DU.x('hx.nextN', 'More news')}">${sv('right')}</button></div>
    </section>` : ''}`;
    DU.$('[data-share]').addEventListener('click', async () => {
      const url = location.href;
      if (navigator.share) { try { await navigator.share({ title: t(p.title), url }); } catch (e) {  } }
      else { try { await navigator.clipboard.writeText(url); DU.toast(tr('c.shareCopied')); } catch (e) { DU.toast(url); } }
    });
    DU.layout({ active: 'news', v2: true });
    const trk = DU.$('[data-trk]');
    if (trk) DU.$$('[data-move]').forEach((b) => b.addEventListener('click', () => trk.scrollBy({ left: Number(b.dataset.move) * Math.max(280, trk.clientWidth * 0.6), behavior: 'smooth' })));
    return;
  }

  const used = Array.from(new Set(posts.map((p) => p.cat).filter(Boolean)));
  const ORDER = ['First Team', 'Club', 'Tryouts', 'Community'];
  const cats = ['All', ...ORDER.filter((c) => used.includes(c)), ...used.filter((c) => !ORDER.includes(c))];
  let cat = cats.includes(DU.param('cat')) ? DU.param('cat') : 'All', order = 'new', shown = 0;
  const STEP = 7;

  const SHAPES = {
    7: ['a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'b c c e', 'b f g e', 'b f g e', 'b f g e'],
    6: ['a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'b c c e', 'b f f e', 'b f f e', 'b f f e'],
    5: ['a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c e', 'a f f e', 'a f f e', 'a f f e'],
    4: ['a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a c c d', 'a f f d', 'a f f d', 'a f f d'],
    3: Array(10).fill('a c c d'),
    2: Array(10).fill('c c c d'),
    1: Array(8).fill('c c c c')
  };
  const FULL = [SHAPES[7],
    ['c c a d', 'c c a d', 'c c a d', 'c c a d', 'c c a d', 'c c a d', 'c c b e', 'f g b e', 'f g b e', 'f g b e'],
    ['a d c c', 'a d c c', 'a d c c', 'a d c c', 'a d c c', 'a d c c', 'b e c c', 'b e f g', 'b e f g', 'b e f g']];
  let blockNo = 0;
  const PRIORITY = ['c', 'a', 'd', 'b', 'e', 'f', 'g'];
  const gridTile = (p, area) => `<a class="nx-g nx-g-${area}" style="grid-area:${area}" href="news.html?post=${esc(p.id)}">${pic(p.img)}<span class="nx-shade"></span><span class="nx-tx"><span class="nx-gd">${esc(DU.fmtDate(p.date))} · ${esc(p.cat)}</span><span class="nx-tt">${esc(t(p.title))}</span></span></a>`;
  const block = (list) => {
    const rows = list.length === 7 ? FULL[blockNo % FULL.length] : SHAPES[list.length]; blockNo += 1; const letters = PRIORITY.filter((l) => rows.join(' ').includes(l));
    return `<div class="nx-blk nx-n${list.length}" style="grid-template-areas:${rows.map((r) => `'${r}'`).join(' ')};grid-template-rows:repeat(${rows.length},var(--row))">${list.map((p, i) => gridTile(p, letters[i])).join('')}</div>`;
  };

  main.innerHTML = `
  <section class="nx-top">
    <span class="nx-bg">${pic(DU.pic('news.heroImg', 'assets/img/stadium-night.jpg'), '')}</span>
    <div class="v2-wrap nx-head">
      <h1 class="v2-big nx-title" data-title>${cat === 'All' ? tr('nav.news') : esc(cat)}</h1>
      <div class="nx-bar">
        <div class="nx-pills" role="tablist" aria-label="${DU.x('news.cats', 'Categories')}">${cats.map((c) => `<button type="button" role="tab" class="nx-pill" data-cat="${esc(c)}" aria-selected="${c === cat}">${c === 'All' ? tr('m.all') : esc(c)}</button>`).join('')}</div>
        <label class="nx-filter">${sv('filter')}<span class="sr-only">${DU.x('news.order', 'Order')}</span><select data-order><option value="new">${DU.x('news.new', 'Newest first')}</option><option value="old">${DU.x('news.old', 'Oldest first')}</option></select></label>
      </div>
    </div>
    <div class="nx-feat" data-feat></div>
  </section>
  <section class="nx-list" aria-label="${DU.x('news.latest', 'Latest News')}">
    <div class="v2-wrap"><h2 class="sr-only">${DU.x('news.latest', 'Latest News')}</h2>
      <div data-grid></div>
      <p class="nx-empty" data-empty hidden>${DU.x('news.2', 'No stories yet.')}</p>
      <div class="nx-morebtn"><button type="button" class="v2-btn v2-btn-d" data-more hidden>${DU.x('news.more', 'More news')}</button></div>
    </div>
  </section>`;

  const listNow = () => { let list = posts.filter((p) => cat === 'All' || p.cat === cat); if (order === 'old') list = list.slice().reverse(); return list; };
  function drawFeat(first) {
    DU.$('[data-feat]').innerHTML = first ? `<a class="nx-fa" href="news.html?post=${esc(first.id)}">
      <span class="nx-fpic">${pic(first.img, '')}</span>
      <span class="nx-fbody"><span class="nx-when">${esc(ago(first.date))}</span><span class="v2-kick">${esc(first.cat)}</span><span class="nx-ft">${esc(t(first.title))}</span>${t(first.sum) ? `<span class="nx-fs">${esc(t(first.sum))}</span>` : ''}<span class="v2-more">${sv('right')}${DU.x('news.read', 'Read')}</span></span></a>` : '';
  }
  function drawGrid(reset) {
    const rest = listNow().slice(1);
    if (reset) { shown = 0; blockNo = 0; DU.$('[data-grid]').innerHTML = ''; }
    const next = rest.slice(shown, shown + STEP);
    if (next.length) DU.$('[data-grid]').insertAdjacentHTML('beforeend', block(next));
    shown += next.length;
    DU.$('[data-more]').hidden = shown >= rest.length;
    DU.$('[data-empty]').hidden = rest.length > 0 || !!listNow().length;
  }
  function render() {
    DU.$$('[data-cat]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.cat === cat)));
    DU.$('[data-title]').textContent = cat === 'All' ? tr('nav.news') : cat;
    const list = listNow();
    drawFeat(list[0]); drawGrid(true);
    if (!list.length) { DU.$('[data-empty]').hidden = false; }
  }
  DU.$$('[data-cat]').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat; history.replaceState(null, '', cat === 'All' ? 'news.html' : `news.html?cat=${encodeURIComponent(cat)}`); render(); }));
  DU.$('[data-order]').addEventListener('change', (e) => { order = e.target.value; render(); });
  DU.$('[data-more]').addEventListener('click', () => drawGrid(false));
  render();
  DU.layout({ active: 'news', v2: true });
})();
