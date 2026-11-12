(function () {
  if (DU.soonPage()) return;
  const d = DU.store.get(), t = DU.t, esc = DU.esc, money = DU.money;
  const main = DU.$('#main');
  const FC = d.founderCfg || {};
  const S = d.shopTexts || {};
  const items = d.products.filter((p) => p.visible && p.founders);
  const SIZED = (p) => /tee|polo|hoodie|shirt/i.test(`${p.id} ${JSON.stringify(p.name)}`) || p.cat === 'Lifestyle';
  const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  const pad = (n) => String(n).padStart(4, '0');
  const lc = (s) => String(s || '').trim().toLowerCase();
  const findFounder = (no, email) => (DU.store.get().founders || []).find((f) => Number(f.no) === Number(no) && lc(f.email) === lc(email) && f.status !== 'rejected');
  let me = DU.pref.get('foundersShop', null);
  if (!me) { const mine = DU.pref.get('founder', null); if (mine && findFounder(mine.no, mine.email)) me = { no: mine.no, first: mine.first }; }
  const sizeSel = {};
  const [hero, ...rest] = items;
  const heroBg = S.collectionImg || '';
  const word = `<span>${DU.x('fshop.m1', 'Founders')}</span><i aria-hidden="true">★</i><span>Dallas United</span><i aria-hidden="true">★</i><span>${DU.x('fshop.m2', 'Since 2026')}</span><i aria-hidden="true">★</i>`;

  const sizes = (p) => (SIZED(p) ? `<fieldset class="fsx-sizes"><legend class="sr-only">Size</legend>${SIZES.map((s) => `<button type="button" data-size="${p.id}" data-v="${s}" aria-pressed="${(sizeSel[p.id] || 'M') === s}">${s}</button>`).join('')}</fieldset>` : '');
  const pics = (p) => `${DU.media(p.img, `alt="${esc(t(p.name))}" loading="lazy"`)}${p.imgBack ? DU.media(p.imgBack, 'class="fsx-back" loading="lazy"') : ''}`;
  const note = (p) => (p.numbered ? DU.x('fshop.num', 'Your founder number on the back of the neck') : DU.x('fshop.stitch', 'Stitched Founders mark'));

  const shopCats = (d.shopCats || []).filter((c) => c.visible !== false);
  main.innerHTML = `
  <section class="fsx-hero">
    ${heroBg ? `<div class="fsx-hero-bg" aria-hidden="true">${DU.media(heroBg)}</div>` : ''}
    <div class="container fsx-hero-in fsx-right">
      <div class="fsx-copy">
        <span class="fsx-pill">★ ${DU.x('fshop.k2', 'Members only')}</span>
        <h1>${DU.x('fshop.h1a', 'The')} <em>${DU.x('fshop.h1b', 'Founders')}</em><br>${DU.x('fshop.h1c', 'Collection')}</h1>
        <p>${DU.x('fshop.p', 'Your founder number on the back of every tee.')}</p>
        <div class="fsx-cta"><a class="btn btn-gold" href="#collection-items">${DU.x('fshop.shop', 'Shop the collection')} ↓</a>${!me && DU.on('founders', d) ? `<a class="btn btn-outline fsx-ghost" href="founders.html#join">${DU.x('fshop.become', 'Become a founder')}</a>` : ''}</div>
        ${me ? `<span class="fsx-me">${DU.x('fshop.hi', 'Welcome back, founder')} <strong>No. ${pad(me.no)}</strong> · <button type="button" class="as-link" data-lock>${DU.x('fshop.notMe', 'Not you?')}</button></span>` : ''}
      </div>
    </div>
  </section>
  <div class="fsx-marquee" aria-hidden="true"><div class="track">${word.repeat(8)}</div></div>

  <section id="collection-items" class="fsx-body">
    ${hero ? `<article class="fsx-feature${hero.imgBack ? ' has-back' : ''}">
      <div class="fsx-feature-pic">${pics(hero)}<span class="fsx-pill fsx-pill-on">★ ${DU.x('fshop.k2', 'Members only')}</span>${hero.numbered && me ? `<span class="fsx-no">No. ${pad(me.no)}</span>` : ''}</div>
      <div class="fsx-feature-copy">
        <span class="fsx-kick">${DU.x('fshop.feat', 'The one to get')}</span>
        <h2>${esc(t(hero.name))}</h2>
        <span class="fsx-price">${money(hero.sale || hero.price)}</span>
        <p>${note(hero)}.</p>
        <div data-size-box="${hero.id}">${sizes(hero)}</div>
        <button type="button" class="btn btn-gold fsx-add" data-add="${hero.id}" ${hero.soldOut ? 'disabled' : ''}>${hero.soldOut ? DU.x('shop.sold', 'Sold out') : DU.x('fshop.add', 'Add to bag')}</button>
      </div>
    </article>` : `<p class="muted center" style="display:flex;padding:60px 0">${DU.x('fshop.none', 'The founders collection is coming soon.')}</p>`}

  </section>
  ${items.length ? `<section class="fsx-look"><div class="container fsx-head"><h2>${DU.x('fshop.more2', 'Wear it first')}</h2><a class="link bold" href="shop.html">${DU.x('fshop.back', '← The full shop')}</a></div>
    <div class="fsx-grid">${items.map((p) => `<article class="fsx-card${p.imgBack ? ' has-back' : ''}">
      <div class="fsx-card-pic">${pics(p)}<span class="fsx-heart" aria-hidden="true">♡</span><span class="fsx-pill fsx-pill-on fsx-pill-low">★ ${p.numbered ? DU.x('fshop.numbered', 'Numbered') : DU.x('fshop.k2', 'Members only')}</span></div>
      <div class="fsx-card-copy"><div class="fsx-row"><strong>${esc(t(p.name))}</strong><span class="fsx-price">${money(p.sale || p.price)}</span></div>
        <span class="small muted">${note(p)}</span>
        <div data-size-box="${p.id}">${sizes(p)}</div>
        <button type="button" class="btn btn-navy fsx-add" data-add="${p.id}" ${p.soldOut ? 'disabled' : ''}>${p.soldOut ? DU.x('shop.sold', 'Sold out') : DU.x('fshop.add', 'Add to bag')}</button></div>
    </article>`).join('')}</div></section>` : ''}

  ${!me && DU.on('founders', d) ? `<section class="fsx-join"><div class="container fsx-join-in">
    <div class="stack" style="--gap:12px;flex:1 1 360px"><span class="fsx-kick" style="color:var(--gold)">${DU.x('fshop.jk', 'Not a founder yet?')}</span><h2>${DU.x('fshop.jh', 'Get your number. Get the collection.')}</h2><p>${DU.x('fshop.jp', 'Become a founder for')} ${money(FC.price || 25)}. ${DU.x('fshop.jp2', 'Your name on the wall, the gold card and this collection.')}</p><a class="btn btn-gold" style="align-self:flex-start" href="founders.html#join">${DU.x('fshop.jb', 'Become a founder')} →</a></div>
    <div class="fsx-join-card">${DU.memberCard({ type: 'founder', no: (FC.base || 0) + (d.founders || []).length + 1, name: 'Your name', hood: 'Your city, TX' })}</div>
  </div></section>` : ''}`;

  main.addEventListener('click', (e) => {
    const b = e.target.closest('[data-size]'); if (!b) return;
    sizeSel[b.dataset.size] = b.dataset.v;
    DU.$$(`[data-size="${b.dataset.size}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  });

  function verify(done) {
    const m = DU.modal(`<form class="stack" style="--gap:14px;padding:clamp(24px,4vw,36px)" novalidate data-vf>
      <span class="eyebrow" style="color:var(--gold-dark)">★ ${DU.x('fshop.k2', 'Members only')}</span>
      <h2 class="display" style="font-size:34px;line-height:1">${DU.x('fshop.vh', 'Confirm you’re a founder')}</h2>
      <p class="muted" style="margin:0">${DU.x('fshop.vp', 'Use your founder number and the email you joined with. We only ask once on this phone.')}</p>
      <label class="field">${DU.x('fshop.no', 'Founder number')}<input name="no" inputmode="numeric" autocomplete="off" placeholder="0013" required></label>
      <label class="field">${DU.x('fshop.em', 'Email you joined with')}<input name="email" type="email" autocomplete="email" required></label>
      <button type="submit" class="btn btn-gold">${DU.x('fshop.vgo', 'Confirm and add to bag')}</button>
      ${DU.on('founders', d) ? `<a class="link small bold" href="founders.html#join">${DU.x('fshop.notYet', 'Not a founder yet? Become one for')} ${money(FC.price || 25)}</a>` : ''}</form>`, { label: 'Confirm you are a founder', style: 'max-width:480px' });
    DU.$('[data-vf]', m.el).addEventListener('submit', (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target));
      const f = findFounder(String(fd.no).replace(/\D/g, ''), fd.email);
      if (!f) { DU.toast(DU.x('fshop.bad', 'That founder number and email don’t match. Use the email you paid with.')); return; }
      me = { no: f.no, first: f.first }; DU.pref.set('foundersShop', me); m.close(); DU.toast(`Hi ${f.first}!`); done();
    });
  }
  function add(p, btn) {
    const size = SIZED(p) ? (sizeSel[p.id] || 'M') : '';
    const bag = DU.pref.get('bag', []);
    const key = `${p.id}|${size}|F${me.no}`;
    const ex = bag.find((x) => x.key === key);
    if (ex) ex.qty += 1; else bag.push({ key, id: p.id, name: t(p.name), price: Number(p.sale || p.price), img: p.img, size, qty: 1, note: [size ? `Size ${size}` : '', p.numbered ? `No. ${pad(me.no)} on the neck` : '', 'Founders'].filter(Boolean).join(' · '), founderNo: me.no });
    DU.pref.set('bag', bag);
    DU.toast(`${DU.x('fshop.added', 'Added to your bag')} (${bag.reduce((a, x) => a + x.qty, 0)}).`);
    const dot = DU.$('[data-nav-bag]'); if (dot) dot.hidden = false;
    btn.outerHTML = `<a class="btn btn-gold fsx-add" href="shop.html#bag">${DU.x('fshop.toBag', 'In your bag · Check out')} →</a>`;
  }
  main.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const p = items.find((x) => x.id === b.dataset.add); if (!p) return;
    if (me) add(p, b); else verify(() => add(p, b));
  });
  const lock = DU.$('[data-lock]'); if (lock) lock.addEventListener('click', () => { me = null; DU.pref.set('foundersShop', null); location.reload(); });

  DU.layout({ active: 'shop', v2: true, shop: 'founders' });
  DU.bindCards(main);
})();
