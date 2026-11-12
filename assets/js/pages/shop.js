(function () {
  if (DU.soonPage()) return;
  const d = DU.store.get(), t = DU.t, esc = DU.esc, money = DU.money;
  const main = DU.$('#main');
  const S = d.shopTexts;
  const allItems = d.products.filter((p) => p.visible);
  const items = allItems.filter((p) => !p.founders);
  const foundersItems = allItems.filter((p) => p.founders);
  const today = new Date().toISOString().slice(0, 10);
  const preOpen = (p) => !!p.preorder && (!S.preorderEnds || today <= S.preorderEnds);
  const CUSTOM = Number(S.personalisePrice || 15), MAXL = Number(S.customMax || 12);
  const INK = { away: '#0A1628', gk: '#0A1628' };
  const BAD = /(fuck|shit|bitch|cunt|dick|cock|pussy|nigg|fag|whore|slut|porn|sex|nazi|hitler|kkk|69|420)/i;
  const SIZES = { Kit: ['S', 'M', 'L', 'XL', 'XXL'], Lifestyle: ['S', 'M', 'L', 'XL', 'XXL'], Youth: ['6–8', '8–10', '10–12', '12–14'], Jerseys: ['S', 'M', 'L', 'XL', 'XXL'], Kids: ['6–8', '8–10', '10–12', '12–14'], Training: ['S', 'M', 'L', 'XL', 'XXL'] };
  const PZ = S.personaliseOn === true;
  const slides = (d.shopSlides || []).filter((x) => x.img);
  const shopCats = (d.shopCats || []).filter((c) => c.visible !== false);
  const collImg = S.collectionImg || ((d.collectionPics || [])[0] || {}).img || '';
  const CATS = shopCats.map((c) => c.id);
  let cat = CATS.includes(DU.param('cat')) ? DU.param('cat') : 'All';
  let bag = DU.pref.get('bag', []);
  const saveBag = () => { DU.pref.set('bag', bag); updateBagCount(); };
  const price = (p) => Number(p.sale || p.price);
  const holiday = !!S.holidayOn;
  const daysLeft = Math.max(0, Math.ceil((DU.dt(S.holidayCutoff || '2026-12-18') - new Date()) / 864e5));

  main.innerHTML = `
  ${holiday ? `<div style="background:var(--holiday);color:#fff;padding-top:96px"><div class="container row center" style="--gap:10px 22px;padding-top:14px;padding-bottom:14px;text-align:center;font-weight:700"><span aria-hidden="true">❄️</span><span><strong style="color:var(--gold-2)">${DU.x('shop.1', 'Holiday shop is open.')}</strong> ${esc(t(S.holidayText))}</span><span class="badge" style="background:#fff;color:var(--holiday)">${daysLeft} days left</span></div></div>` : ''}
  <h1 class="sr-only">${DU.x('shop.h1', 'Dallas United FC official store')}</h1>
  ${slides.length ? `<section class="pk${holiday ? '' : ' pk-top'}" aria-roledescription="carousel" aria-label="${DU.x('shop.slidesL', 'Shop highlights')}" tabindex="0" data-slides>
    <div class="pk-view"><div class="pk-track" data-pk-track>${(slides.length > 1 ? [...slides, ...slides, ...slides] : slides).map((sl, j) => { const i = j % slides.length; return `<figure class="pk-slide" data-slide="${i}" data-pos="${j}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}: ${esc(t(sl.kicker))}">
      <a class="pk-pic" href="${esc(sl.link || 'shop.html')}" data-slide-link tabindex="-1" draggable="false">${DU.slideMedia(sl, 'draggable="false"' + (j > slides.length + 1 ? ' loading="lazy"' : ''))}</a>
      <figcaption class="pk-cap"><a class="pk-shop" href="${esc(sl.link || 'shop.html')}" data-slide-link tabindex="-1">${DU.x('shop.shopWord', 'Shop')}<span class="sr-only"> ${esc(t(sl.kicker))}</span></a><span class="pk-txt"><strong>${esc(t(sl.kicker))}</strong><span>${esc(t(sl.title))}</span></span></figcaption></figure>`; }).join('')}</div></div>
  </section>` : ''}

  ${shopCats.length ? `<section class="shx-colls" aria-label="${DU.x('shop.catsL', 'Shop by category')}"><div class="v2-wrap shx-colls-in">${shopCats.slice(0, 3).map((c) => `<a class="shx-coll" href="shop.html?cat=${encodeURIComponent(c.id)}" data-tile="${esc(c.id)}">${DU.media(c.img, 'alt="" loading="lazy"')}<span>${esc(t(c.name) || c.id)}</span></a>`).join('')}</div></section>` : ''}

  ${S.collectionOn !== false && collImg ? `<section class="collection coll-long" id="collection" aria-label="${esc(t(S.collectionTitle))}">
    <div class="pin"><div><span class="tag">${esc(t(S.collectionTitle))} <small class="shx-mo">${DU.x('shop.membersOnly', 'Members only')}</small></span><a class="go" href="founders-shop.html">${DU.x('shop.3', 'Shop')}</a></div></div>
    <div class="pics">${DU.media(collImg, `alt="${esc(t(S.collectionTitle))}"`)}</div>
  </section>` : ''}

  ${(() => { const card = (p) => `<button type="button" class="shx-p${p.soldOut ? ' is-sold' : ''}" data-view="${esc(p.id)}"><span class="shx-pp">${DU.media(p.img, 'alt="" loading="lazy"')}${p.imgBack ? DU.media(p.imgBack, 'class="shx-back" alt="" loading="lazy"') : ''}${p.soldOut ? `<span class="shx-badge shx-sold">${DU.x('shop.sold', 'Sold out')}</span>` : preOpen(p) ? `<span class="shx-badge">${DU.x('shop.pre', 'Pre-order')}</span>` : p.isNew ? `<span class="shx-badge">${DU.x('shop.new', 'New')}</span>` : ''}</span><span class="shx-pn">${esc(t(p.name))}</span><span class="shx-pr">${p.sale ? `<s>${money(p.price)}</s> ` : ''}${money(p.sale || p.price)}</span>${SIZES[p.cat] ? `<span class="shx-sz">${SIZES[p.cat].join(' - ')}</span>` : ''}</button>`;
    const rows = [[DU.x('shop.newIn', 'New in'), items.filter((p) => p.isNew)], ...shopCats.map((c) => [t(c.name) || c.id, items.filter((p) => p.cat === c.id)])].filter((r) => r[1].length >= 3).slice(0, 3);
    return rows.map(([title, list]) => `<section class="shx-row" data-slider><div class="v2-wrap"><div class="v2-sh"><h2 class="v2-h2">${esc(title)}</h2><div class="v2-arr"><button type="button" class="v2-ic" data-move="-1" aria-label="Previous">${DU.sv('left')}</button><button type="button" class="v2-ic" data-move="1" aria-label="Next">${DU.sv('right')}</button></div></div></div>
      <div class="v2-trk shx-trk" data-trk>${list.map(card).join('')}</div></section>`).join(''); })()}

  <div class="shx-bar" hidden>
    <div class="container row between shop-bar" style="padding-top:8px;padding-bottom:8px;--gap:10px;flex-wrap:nowrap">
      <div class="chips" style="padding:2px 0" data-cats></div>
      <button type="button" class="btn btn-navy btn-sm" style="flex-shrink:0" data-open-bag>${DU.icon('bag')} Bag <span class="badge badge-gold" data-bag-count>0</span></button>
    </div>
  </div>

  ${holiday ? `<section class="container section-tight" aria-label="Gift guide" style="padding-bottom:0">
    <div class="row between" style="margin-bottom:18px"><h2 class="serif h2" style="color:var(--holiday)">${DU.x('shop.5', 'Gift guide')}</h2>${S.giftWrap ? '<span class="bold text">Free gift wrap on every order this month</span>' : ''}</div>
    <div class="grid-fit" style="--min:260px">${[['under30', 'Under $30', 'Stocking fillers', 'Scarves, caps, mugs and pins', 'Accessories'], ['kids', 'For kids', 'Little fans', 'Kids jerseys with their name and number', 'Kids'], ['superfan', 'For the superfan', 'The full kit', 'Home jersey, personalised, gift wrapped', 'Jerseys']].map(([k, tag, title, sub, c]) => { const p = items.find((x) => x.gift === k) || items[0]; return `<button type="button" class="lift" data-gift="${c}" style="position:relative;border:none;padding:0;border-radius:var(--radius);overflow:hidden;background:var(--navy);color:#fff;aspect-ratio:4/3;text-align:left"><img src="${esc(p.img)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.8"><span style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,22,40,.92) 15%,rgba(10,22,40,0) 70%)"></span><span class="badge" style="position:absolute;top:14px;left:14px;background:var(--holiday);color:#fff">🎁 ${tag}</span><span class="stack" style="position:absolute;left:18px;right:18px;bottom:18px;--gap:4px"><strong class="display" style="font-size:30px">${title}</strong><span class="small" style="color:#DCE4F2">${sub}</span></span></button>`; }).join('')}</div>
  </section>` : ''}

  <section class="container section-tight" id="shop-grid">
    <div class="row between" style="margin-bottom:16px"><h2 class="serif h2" data-grid-title>${DU.x('shop.6', 'All products')}</h2><span class="muted bold" data-grid-count></span></div>
    <div class="product-grid" data-grid></div>
  </section>

  ${PZ ? `<section id="personalise" class="bg-navy">
    <div class="container section split">
      <div class="center" style="display:flex"><svg viewBox="0 0 600 660" style="width:min(420px,100%)" role="img" aria-label="Your personalised jersey">
        <path d="M190 40C230 60 370 60 410 40L520 80L600 200L520 262L480 222L480 640L120 640L120 222L80 262L0 200L80 80Z" fill="#0A1628" stroke="#13305E" stroke-width="3"/>
        <g fill="#0F2547">${[140, 196, 252, 308, 364, 420].map((x) => `<rect x="${x}" y="70" width="22" height="566"/>`).join('')}</g>
        <path d="M190 40C230 60 370 60 410 40L398 34C360 50 240 50 202 34Z" fill="#F5B700"/><path d="M4 204L80 258M520 258L596 204" stroke="#F5B700" stroke-width="14"/><path d="M120 632H480" stroke="#F5B700" stroke-width="10"/>
        <text x="300" y="210" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="58" letter-spacing="4" fill="#F5B700" data-pz-name>REYES</text>
        <text x="300" y="470" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="240" fill="#F5B700" data-pz-num>6</text>
      </svg></div>
      <form class="stack on-dark" style="--gap:16px" data-pz-form novalidate>
        <span class="eyebrow">Personalise · +${money(S.personalisePrice)}</span>
        <h2 class="display h2">${DU.x('shop.7', 'Your name. Your number.')}</h2>
        <p class="lead" style="color:#DCE4F2">${DU.x('shop.8', 'Printed on the back of the home jersey, exactly like the players’.')}</p><p class="small bold" style="color:var(--gold);margin:0">${DU.x('shop.czNoReturn', 'Custom items can’t be returned. The club checks every name before printing.')}</p>
        <div class="form-grid"><label class="field">Name (up to ${MAXL} letters)<input data-pz-in-name maxlength="${MAXL}" value="REYES" autocomplete="off"></label><label class="field">${DU.x('shop.10', 'Number (1–99)')}<input data-pz-in-num inputmode="numeric" maxlength="2" value="6"></label></div>
        <label class="field">${DU.x('shop.11', 'Size')}<select data-pz-size>${SIZES.Jerseys.map((s) => `<option${s === 'M' ? ' selected' : ''}>${s}</option>`).join('')}</select></label>
        <button type="submit" class="btn btn-gold">Add to bag · <span data-pz-total></span></button>
      </form>
    </div>
  </section>` : ''}`;

  const nameOf = (c) => { const x = shopCats.find((k) => k.id === c); return x ? (t(x.name) || c) : c; };
  const cats = ['All', ...CATS.filter((c) => allItems.some((p) => p.cat === c))];
  DU.$('[data-cats]').innerHTML = cats.map((c) => `<button type="button" class="chip" data-cat="${esc(c)}">${c === 'All' ? DU.x('shop.all', 'All') : esc(nameOf(c))}</button>`).join('') + (foundersItems.length ? `<a class="chip chip-gold" href="founders-shop.html">${DU.x('shop.fChip', 'Founders')}</a>` : '');
  function renderGrid() {
    DU.$$('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    DU.$$('.sh-cat').forEach((b) => b.setAttribute('aria-current', String(b.dataset.tile === cat)));
    const list = allItems.filter((p) => cat === 'All' || p.cat === cat).sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    DU.$('[data-grid-title]').textContent = cat === 'All' ? DU.x('shop.6', 'All products') : nameOf(cat);
    DU.$('[data-grid-count]').textContent = `${list.length} items`;
    DU.$('[data-grid]').innerHTML = list.length ? list.map((p) => DU.productTile(p, { pre: preOpen(p), btn: preOpen(p) ? 'Pre-order' : SIZES[p.cat] ? 'Choose size' : 'Add to bag' })).join('') : `<p class="muted">${DU.x('shop.none', 'Nothing here yet. New items are on the way.')}</p>`;
    DU.$$('[data-grid] [data-view]').forEach((b) => b.addEventListener('click', () => view(b.dataset.view)));
  }
  DU.$$('[data-cat]').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat; renderGrid(); }));
  const GIFT = { Jerseys: 'Kit', Kids: 'Youth', Accessories: 'Accessories' };
  DU.$$('[data-tile], [data-gift]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); cat = b.dataset.tile || GIFT[b.dataset.gift] || 'All'; history.replaceState(null, '', cat === 'All' ? 'shop.html' : `shop.html?cat=${encodeURIComponent(cat)}`); renderGrid(); DU.$('#shop-grid').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  DU.$$('[data-cat]').forEach((b) => b.addEventListener('click', () => history.replaceState(null, '', b.dataset.cat === 'All' ? 'shop.html' : `shop.html?cat=${encodeURIComponent(b.dataset.cat)}`)));

  const sb = DU.$('[data-slides]');
  if (sb && slides.length > 1) {
    const n = slides.length, track = DU.$('[data-pk-track]', sb), els = DU.$$('.pk-slide', track);
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
  } else if (sb) { const el = DU.$('.pk-slide', sb); if (el) el.classList.add('is-cur', 'is-only'); }
  DU.$$('[data-slide-link]').forEach((a) => a.addEventListener('click', (e) => { const u = new URL(a.href, location.href); if (!/shop\.html$/.test(u.pathname)) return; e.preventDefault(); const c = u.searchParams.get('cat'); cat = CATS.includes(c) ? c : 'All'; history.replaceState(null, '', a.getAttribute('href')); renderGrid(); DU.$('#shop-grid').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));

  function view(id) {
    const p = items.find((x) => x.id === id); if (!p) return;
    const custom = p.custom && PZ;
    const pics = [p.img, p.imgBack, ...(Array.isArray(p.imgs) ? p.imgs : [])].filter(Boolean).filter((x, k, a) => a.indexOf(x) === k);
    const sizes = SIZES[p.cat];
    const pre = preOpen(p);
    const stock = p.sizes && Object.values(p.sizes).some((n) => Number(n) > 0) ? p.sizes : null;
    const left = (sz) => (stock ? Number(stock[sz] || 0) : 99);
    const sizeSub = (sz) => (pre ? 'pre-order' : stock ? (left(sz) <= 0 ? 'Sold out' : left(sz) <= 5 ? `${left(sz)} left` : '') : '');
    const firstOk = sizes ? (sizes.find((sz, i) => i >= 1 && left(sz) > 0) || sizes.find((sz) => left(sz) > 0) || '') : '';
    const ends = S.preorderEnds ? DU.dt(S.preorderEnds, '23:59') : null;
    const m = DU.modal(`${pre && ends ? `<div class="pre-bar"><span class="badge badge-gold">PRE-ORDER</span><strong>${DU.x('shop.preT', 'First kit drop · orders close')} ${esc(DU.fmtDay(S.preorderEnds))}</strong><span class="pre-cd" data-pre-cd></span><span class="small">${esc(t(S.preorderShip) || '')}</span></div>` : ''}
      <div class="pv"><div class="pv-pics"><div class="pv-main" style="--ink:${INK[p.id] || '#F5B700'}"><img src="${esc(custom && p.imgBack ? p.imgBack : p.img)}" alt="${esc(t(p.name))}" data-pv-main>${custom && p.imgBack ? '<span class="pv-name" data-pv-name></span><span class="pv-num" data-pv-num></span><span class="pv-live" data-pv-live hidden>LIVE PREVIEW OF YOUR NAME</span>' : ''}</div>
        ${pics.length > 1 ? `<button type="button" class="pv-nav l" data-pv-step="-1" aria-label="${DU.x('shop.prevPic', 'Previous picture')}">${DU.lu('chevron-left')}</button><button type="button" class="pv-nav r" data-pv-step="1" aria-label="${DU.x('shop.nextPic', 'Next picture')}">${DU.lu('chevron-right')}</button>
        <div class="pv-thumbs">${pics.map((src, k) => `<button type="button" data-pv-pic="${esc(src)}" data-k="${k}" data-face="${src === p.imgBack ? 'back' : 'front'}" aria-label="${DU.x('shop.pic', 'Picture')} ${k + 1}" aria-current="${k === 0}">${DU.isVideo(src) ? `<video src="${esc(src)}" muted playsinline></video>` : `<img src="${esc(src)}" alt="">`}</button>`).join('')}</div>` : ''}</div>
      <div class="stack pv-buy" style="--gap:16px"><span class="eyebrow">${esc(p.cat)}</span><h2 class="display" style="font-size:clamp(32px,4vw,44px)">${esc(t(p.name))}</h2>
      <span style="font-size:22px;font-weight:800">${money(price(p))}</span>
      ${sizes ? `<fieldset class="pv-set"><legend class="bold small">${DU.x('shop.12', 'Size')}</legend><div class="pv-sizes">${sizes.map((sz) => `<button type="button" class="pv-size" data-size="${sz}" aria-pressed="${sz === firstOk}" ${left(sz) <= 0 ? 'disabled' : ''}>${sz}${sizeSub(sz) ? `<span>${sizeSub(sz)}</span>` : ''}</button>`).join('')}</div></fieldset>` : ''}
      ${p.custom && PZ ? `<div class="pv-custom"><label class="check bold"><input type="checkbox" data-cz> ${DU.x('shop.czAdd', 'Add a name and number')} <span class="muted" style="margin-left:auto">+${money(CUSTOM)}</span></label>
        <div class="form-grid" data-cz-box hidden><label class="field">Name · up to ${MAXL} letters<input data-cz-name maxlength="${MAXL}" autocomplete="off" autocapitalize="characters" spellcheck="false"></label><label class="field">${DU.x('shop.10', 'Number (1–99)')}<input data-cz-num inputmode="numeric" maxlength="2" autocomplete="off"></label></div>
        <span class="small muted" data-cz-count hidden></span>
        <span class="small bold" style="color:var(--red)" data-cz-note hidden>${DU.x('shop.czNoReturn', 'Custom items can’t be returned. The club checks every name before printing.')}</span></div>` : ''}
      ${pre ? `<fieldset class="pv-set"><legend class="bold small">${DU.x('shop.getH', 'How do you want it?')}</legend>
        <label class="pv-get"><input type="radio" name="get" value="pickup" checked><span><strong>${DU.x('shop.getPick', 'Free pickup')}</strong><span class="small muted">${esc(t(S.pickupPlace) || 'At training or a home match')}. ${DU.x('shop.getText', 'We text you when it’s ready.')}</span></span></label>
        <label class="pv-get"><input type="radio" name="get" value="std"><span><strong>${DU.x('shop.getShip', 'Ship it to me')}</strong><span class="small muted">$6 in the US. Free over ${money(S.freeShipOver)}.</span></span></label></fieldset>` : ''}
      <button type="button" class="btn btn-gold" data-add></button>
      <p class="small muted">${pre ? `${DU.x('shop.preNote', 'You pay now. Made after the pre-order closes.')} ${esc(t(S.preorderShip) || '')}.` : `Free shipping over ${money(S.freeShipOver)}. Free pick-up at ${esc(d.settings.stadium)} on home matchdays. 30-day returns${custom ? ' (not on custom items)' : ''}.`}</p></div></div>`, { label: t(p.name), style: 'max-width:980px' });
    let size = firstOk, cz = false;
    const czName = DU.$('[data-cz-name]', m.el), czNum = DU.$('[data-cz-num]', m.el);
    const total = () => price(p) + (cz ? CUSTOM : 0);
    let picAt = 0;
    const setPic = (src, face) => { const im = DU.$('[data-pv-main]', m.el); if (im) im.src = src; picAt = Math.max(0, pics.indexOf(src)); DU.$$('[data-pv-pic]', m.el).forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.k) === picAt))); DU.$$('.pv-name, .pv-num', m.el).forEach((e) => { e.hidden = face !== 'back'; }); };
    DU.$$('[data-pv-step]', m.el).forEach((b) => b.addEventListener('click', () => { const k = (picAt + Number(b.dataset.pvStep) + pics.length) % pics.length; setPic(pics[k], pics[k] === p.imgBack ? 'back' : 'front'); }));
    let sx = null; const mainBox = DU.$('.pv-main', m.el);
    if (mainBox && pics.length > 1) { mainBox.addEventListener('pointerdown', (e) => { sx = e.clientX; }); mainBox.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) { const k = (picAt + (dx < 0 ? 1 : -1) + pics.length) % pics.length; setPic(pics[k], pics[k] === p.imgBack ? 'back' : 'front'); } }); }
    const paint = () => {
      const btn = DU.$('[data-add]', m.el);
      btn.textContent = `${pre ? 'Pre-order' : DU.x('shop.13', 'Add to bag')} · ${money(total())}`;
      btn.disabled = (!!sizes && !size) || !!p.soldOut;
      if (p.soldOut) { btn.textContent = DU.x('shop.sold', 'Sold out'); return; }
      if (!custom) return;
      DU.$('[data-cz-box]', m.el).hidden = !cz; DU.$('[data-cz-note]', m.el).hidden = !cz; DU.$('[data-cz-count]', m.el).hidden = !cz;
      const nm = cz ? czName.value : '', nu = cz ? czNum.value : '';
      const ne = DU.$('[data-pv-name]', m.el), nue = DU.$('[data-pv-num]', m.el), lv = DU.$('[data-pv-live]', m.el);
      if (ne) { ne.textContent = nm; nue.textContent = nu; lv.hidden = !cz; }
      DU.$('[data-cz-count]', m.el).textContent = `${czName.value.replace(/\s/g, '').length} of ${MAXL} letters · the picture shows how it will look`;
    };
    DU.$$('[data-size]', m.el).forEach((b) => b.addEventListener('click', () => { size = b.dataset.size; DU.$$('[data-size]', m.el).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); paint(); }));
    DU.$$('[data-pv-pic]', m.el).forEach((b) => b.addEventListener('click', () => setPic(b.dataset.pvPic, b.dataset.face)));
    if (custom) {
      DU.$('[data-cz]', m.el).addEventListener('change', (e) => { cz = e.target.checked; if (cz && p.imgBack) setPic(p.imgBack, 'back'); paint(); if (cz) czName.focus(); });
      czName.addEventListener('input', () => { czName.value = czName.value.toUpperCase().replace(/[^A-ZÀ-ÜÑ' .-]/g, '').slice(0, MAXL); paint(); });
      czNum.addEventListener('input', () => { czNum.value = czNum.value.replace(/\D/g, '').slice(0, 2); paint(); });
    }
    let timer = null;
    const cd = DU.$('[data-pre-cd]', m.el);
    if (cd && ends) { const two = (n) => String(Math.max(0, n)).padStart(2, '0'); const tick = () => { let ms = Math.max(0, ends - Date.now()); const dd = Math.floor(ms / 864e5); ms -= dd * 864e5; const hh = Math.floor(ms / 36e5); ms -= hh * 36e5; const mi = Math.floor(ms / 6e4); const ss = Math.floor((ms - mi * 6e4) / 1000); cd.textContent = `${two(dd)}d ${two(hh)}h ${two(mi)}m ${two(ss)}s`; }; tick(); timer = setInterval(tick, 1000); }
    const obs = new MutationObserver(() => { if (!document.body.contains(m.el)) { clearInterval(timer); obs.disconnect(); } }); obs.observe(document.body, { childList: true, subtree: true });
    DU.$('[data-add]', m.el).addEventListener('click', () => {
      if (sizes && !size) { DU.toast('Pick a size.'); return; }
      let custom = null;
      if (cz) {
        const nm = czName.value.trim(), nu = czNum.value.trim();
        if (!nm || !nu || Number(nu) < 1) { DU.toast('Add a name and a number (1–99), or untick the name and number box.'); return; }
        custom = { name: nm, num: String(Number(nu)), flag: BAD.test(nm) || BAD.test(nu) };
      }
      const getEl = DU.$('input[name=get]:checked', m.el); if (getEl) DU.pref.set('shopGet', getEl.value);
      add({ key: `${p.id}|${size}${custom ? `|${custom.name}|${custom.num}` : ''}`, id: p.id, name: `${t(p.name)}${custom ? ` · ${custom.name} ${custom.num}` : ''}`, price: total(), img: p.img, size, note: [size ? `Size ${size}` : '', custom ? 'name and number · no returns' : '', pre ? 'pre-order' : ''].filter(Boolean).join(' · '), custom, pre: pre || undefined });
      m.close();
    });
    paint();
  }
  function add(item) {
    const ex = bag.find((x) => x.key === item.key);
    if (ex) ex.qty += 1; else bag.push({ ...item, qty: 1 });
    saveBag(); openBag();
  }

  if (PZ) {
    const nIn = DU.$('[data-pz-in-name]'), numIn = DU.$('[data-pz-in-num]');
    const home = items.find((p) => p.id === 'home') || items[0];
    const pzTotal = () => DU.$('[data-pz-total]').textContent = money(price(home) + Number(S.personalisePrice || 0));
    const pzUpdate = () => { nIn.value = nIn.value.toUpperCase().replace(/[^A-ZÀ-ÜÑ' .-]/g, '').slice(0, MAXL); numIn.value = numIn.value.replace(/\D/g, '').slice(0, 2); DU.$('[data-pz-name]').textContent = nIn.value || 'NAME'; DU.$('[data-pz-num]').textContent = numIn.value || '00'; };
    nIn.addEventListener('input', pzUpdate); numIn.addEventListener('input', pzUpdate); pzTotal();
    DU.$('[data-pz-form]').addEventListener('submit', (e) => { e.preventDefault(); if (!nIn.value || !numIn.value) { DU.toast('Add a name and a number.'); return; } const size = DU.$('[data-pz-size]').value; add({ key: `home|${size}|${nIn.value}|${numIn.value}`, id: 'home', name: `${t(home.name)} · ${nIn.value} ${numIn.value}`, price: price(home) + CUSTOM, img: home.img, size, note: `Size ${size} · name and number · no returns${preOpen(home) ? ' · pre-order' : ''}`, custom: { name: nIn.value, num: String(Number(numIn.value)), flag: BAD.test(nIn.value) || BAD.test(numIn.value) }, pre: preOpen(home) || undefined }); });
  }

  const drawer = document.createElement('div'); drawer.className = 'drawer-wrap'; drawer.hidden = true; drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-label', 'Your bag');
  document.body.appendChild(drawer);
  function totals(ship) { const sub = bag.reduce((a, x) => a + x.price * x.qty, 0); const shipCost = ship === 'pickup' || sub >= S.freeShipOver || sub === 0 ? 0 : 6; return { sub, shipCost, total: sub + shipCost }; }
  function updateBagCount() { const c = bag.reduce((a, x) => a + x.qty, 0); DU.$$('[data-bag-count]').forEach((e) => { e.textContent = c; }); }
  function openBag() {
    const tt = totals('std');
    drawer.innerHTML = `<div class="drawer"><div class="row between" style="padding:18px 20px;border-bottom:1px solid var(--line)"><strong style="font-size:20px">Your bag</strong><button type="button" class="icon-btn" style="background:var(--cream);color:var(--navy)" data-close aria-label="Close">${DU.icon('close')}</button></div>
      <div class="stack" style="flex:1;overflow:auto;padding:16px 20px;--gap:14px">${bag.length ? bag.map((x, i) => `<div class="row" style="flex-wrap:nowrap;align-items:flex-start;--gap:12px"><img src="${esc(x.img)}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px;background:var(--cream)"><div class="stack" style="flex:1;--gap:4px;min-width:0"><strong style="font-size:15px">${esc(x.name)}</strong><span class="tiny muted">${esc(x.note)}</span>
        <div class="row" style="--gap:6px"><button type="button" class="icon-btn" style="background:var(--cream);color:var(--navy);width:36px;height:36px" data-dec="${i}" aria-label="One less">−</button><span class="bold">${x.qty}</span><button type="button" class="icon-btn" style="background:var(--cream);color:var(--navy);width:36px;height:36px" data-inc="${i}" aria-label="One more">+</button><button type="button" class="link" style="background:none;border:none;margin-left:auto;min-height:36px" data-rm="${i}">Remove</button></div></div><strong>${money(x.price * x.qty)}</strong></div>`).join('') : '<p class="muted">Your bag is empty.</p>'}</div>
      <div class="stack" style="--gap:10px;padding:18px 20px;border-top:1px solid var(--line)">
        ${tt.sub && tt.sub < S.freeShipOver ? `<p class="notice notice-warn small">Add ${money(S.freeShipOver - tt.sub)} more for free shipping.</p>` : tt.sub ? '<p class="notice notice-ok small">You get free shipping.</p>' : ''}
        <div class="row between bold"><span>Subtotal</span><span>${money(tt.sub)}</span></div>
        <button type="button" class="btn btn-gold btn-block" data-checkout ${bag.length ? '' : 'disabled'}>Checkout</button></div></div>`;
    drawer.hidden = false; document.body.style.overflow = 'hidden';
    drawer.querySelector('[data-close]').focus();
  }
  drawer.addEventListener('click', (e) => {
    const b = e.target;
    if (b === drawer || b.closest('[data-close]')) { drawer.hidden = true; document.body.style.overflow = ''; return; }
    const i = (k) => Number(b.closest(`[${k}]`).getAttribute(k));
    if (b.closest('[data-inc]')) { bag[i('data-inc')].qty += 1; saveBag(); openBag(); }
    else if (b.closest('[data-dec]')) { const j = i('data-dec'); bag[j].qty -= 1; if (bag[j].qty < 1) bag.splice(j, 1); saveBag(); openBag(); }
    else if (b.closest('[data-rm]')) { bag.splice(i('data-rm'), 1); saveBag(); openBag(); }
    else if (b.closest('[data-checkout]')) { drawer.hidden = true; checkout(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { drawer.hidden = true; document.body.style.overflow = ''; } });
  DU.$$('[data-open-bag]').forEach((b) => b.addEventListener('click', openBag));
  if (location.hash === '#bag') setTimeout(openBag, 50);

  function checkout() {
    let step = 'ship', ship = DU.pref.get('shopGet', 'std') === 'pickup' ? 'pickup' : 'std';
    const m = DU.modal('<div data-co style="padding:clamp(22px,4vw,40px)"></div>', { label: 'Checkout', style: 'max-width:640px', onClose: () => { document.body.style.overflow = ''; } });
    const box = DU.$('[data-co]', m.el);
    const steps = () => `<div class="row" style="--gap:8px;margin-bottom:22px">${['Delivery', 'Payment', 'Done'].map((l, i) => { const on = i <= ['ship', 'pay', 'done'].indexOf(step); return `<span class="badge" style="background:${on ? 'var(--navy)' : 'var(--cream)'};color:${on ? '#fff' : 'var(--muted)'};padding:8px 12px">${i + 1}. ${l}</span>`; }).join('')}</div>`;
    const draw = () => {
      const tt = totals(ship);
      if (step === 'ship') box.innerHTML = `${steps()}<form class="stack" style="--gap:14px" novalidate><h2 class="display" style="font-size:36px">Delivery</h2>
        <div class="stack" style="--gap:8px">${[['std', `Ship to my address · ${tt.sub >= S.freeShipOver ? 'Free' : '$6'} · 3–5 days`], ['pickup', `${t(S.pickupPlace) || `Pick up free at ${d.settings.stadium} on a home matchday`} · we text you when it’s ready`]].map(([k, l]) => `<label class="check" style="font-size:15px;font-weight:600;border:1px solid var(--line);border-radius:8px;padding:12px"><input type="radio" name="ship" value="${k}" ${ship === k ? 'checked' : ''}> ${esc(l)}</label>`).join('')}</div>
        <div class="form-grid"><label class="field">${DU.tr('c.first')}<input name="first" required autocomplete="given-name"></label><label class="field">${DU.tr('c.last')}<input name="last" required autocomplete="family-name"></label></div>
        <label class="field">${DU.tr('c.email')}<input name="email" type="email" required autocomplete="email"></label>
        ${ship === 'pickup' ? `<label class="field">${DU.x('shop.phone', 'Mobile number (we text you when it’s ready)')}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(214) 555-0123"></label>` : ''}
        ${bag.some((x) => x.custom) ? `<p class="notice notice-warn small" style="margin:0">${DU.x('shop.czNoReturn', 'Custom items can’t be returned. The club checks every name before printing.')}</p>` : ''}
        <div data-addr class="stack" style="--gap:14px" ${ship === 'pickup' ? 'hidden' : ''}><label class="field">Address<input name="addr" autocomplete="street-address"></label><div class="form-grid"><label class="field">City<input name="city" value="Dallas" autocomplete="address-level2"></label><label class="field">ZIP<input name="zip" inputmode="numeric" autocomplete="postal-code"></label></div></div>
        <div class="row between bold" style="border-top:1px solid var(--line);padding-top:14px"><span>Total</span><span>${money(tt.total)}</span></div>
        <button class="btn btn-gold" type="submit">Continue to payment</button></form>`;
      if (step === 'pay') box.innerHTML = `${steps()}<div class="stack" style="--gap:14px"><h2 class="display" style="font-size:36px">Payment</h2>
        <div class="grid-fit" style="--min:160px;--gap:10px"><button type="button" class="btn" style="background:#000;color:#fff" data-pay>Apple Pay</button><button type="button" class="btn btn-outline" data-pay>Google Pay</button></div>
        <span class="center small muted" style="display:flex">or pay with card</span>
        <label class="field">Card number<input inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234"></label>
        <div class="form-grid"><label class="field">Expiry<input autocomplete="cc-exp" placeholder="MM / YY"></label><label class="field">CVC<input inputmode="numeric" autocomplete="cc-csc" placeholder="123"></label></div>
        <button type="button" class="btn btn-gold" data-pay>Pay ${money(tt.total)}</button>
        <p class="tiny muted center" style="display:flex">🔒 Payments are handled by ${esc(d.settings.payments)}. This is a test checkout: no card is charged yet.</p></div>`;
      if (step === 'done') { const no = `DU-${1043 + (d.orders || []).length}`; box.innerHTML = `${steps()}<div class="stack center" style="--gap:14px;text-align:center"><span style="font-size:56px" aria-hidden="true">🎉</span><h2 class="display" style="font-size:40px">Thank you!</h2><p class="lead text">Order <strong>${no}</strong> is confirmed. A receipt is on its way to your email.</p><button type="button" class="btn btn-navy" data-done>Back to the shop</button></div>`; }
      bindStep();
    };
    const bindStep = () => {
      const f = box.querySelector('form');
      if (f) {
        DU.$$('input[name=ship]', f).forEach((r) => r.addEventListener('change', () => { ship = r.value; draw(); }));
        f.addEventListener('submit', (e) => { e.preventDefault(); const fd = new FormData(f); if (!fd.get('first') || !fd.get('last')) { DU.toast(DU.tr('c.required')); return; } if (!DU.isEmail(fd.get('email'))) { DU.toast(DU.tr('c.badEmail')); return; } m.buyer = `${fd.get('first')} ${String(fd.get('last')).slice(0, 1)}.`; m.email = String(fd.get('email') || '').trim(); m.phone = String(fd.get('phone') || '').trim(); if (ship === 'pickup' && m.phone.replace(/\D/g, '').length < 10) { DU.toast('Add a mobile number so we can text you when it’s ready.'); return; } step = 'pay'; draw(); });
      }
      DU.$$('[data-pay]', box).forEach((b) => b.addEventListener('click', () => {
        const tt = totals(ship);
        const lines = bag.map((x) => ({ id: x.id, name: x.name, size: x.size || '', qty: x.qty, pre: !!x.pre, ...(x.custom ? { custom: { ...x.custom, check: x.custom.flag ? 'flagged' : 'waiting' } } : {}) }));
        const order = { id: `DU-${1043 + (DU.store.get().orders || []).length}`, email: m.email || DU.myEmail(), phone: m.phone || '', name: m.buyer || 'Customer', items: bag.map((x) => `${x.name}${x.size ? ` (${x.size})` : ''}${x.qty > 1 ? ` ×${x.qty}` : ''}`).join(', '), lines, ship: ship === 'pickup' ? 'Pick up' : 'Ship', total: tt.total, status: lines.some((l) => l.custom) ? 'Name check' : 'Paid', when: new Date().toISOString().slice(0, 10), pre: lines.some((l) => l.pre) };
        DU.store.addPublic('orders', order);
        bag = []; saveBag(); step = 'done'; draw();
      }));
      const dn = box.querySelector('[data-done]'); if (dn) dn.addEventListener('click', m.close);
    };
    draw();
  }

  renderGrid(); updateBagCount();
  DU.layout({ active: 'shop', v2: true, shop: true });
  DU.$$('[data-shop-bag]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); openBag(); }));
  const hx = DU.$('[data-shx]');
  if (hx && slides.length > 1) {
    let cur = 0, tm = null; const n = slides.length;
    const show = (k) => { cur = (k + n) % n; DU.$$('[data-sp]', hx).forEach((el) => { const on = Number(el.dataset.sp) === cur; el.classList.toggle('on', on); el.tabIndex = on ? 0 : -1; }); DU.$$('[data-sx]', hx).forEach((el) => { const on = Number(el.dataset.sx) === cur; el.classList.toggle('on', on); el.setAttribute('aria-hidden', String(!on)); const a2 = el.querySelector('a'); if (a2) a2.tabIndex = on ? 0 : -1; }); DU.$$('[data-st]', hx).forEach((el) => { const on = Number(el.dataset.st) === cur; el.classList.remove('on'); el.setAttribute('aria-selected', String(on)); if (on) { void el.offsetWidth; el.classList.add('on'); } }); };
    const arm = () => { clearTimeout(tm); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) tm = setTimeout(() => { show(cur + 1); arm(); }, 6000); };
    DU.$$('[data-st]', hx).forEach((b) => b.addEventListener('click', () => { show(Number(b.dataset.st)); arm(); }));
    arm();
  }
  DU.$$('.shx-row').forEach((sec) => { const trk = DU.$('[data-trk]', sec); DU.$$('[data-move]', sec).forEach((b) => b.addEventListener('click', () => trk.scrollBy({ left: Number(b.dataset.move) * Math.max(280, trk.clientWidth * 0.7), behavior: 'smooth' }))); });
  DU.$$('.shx-p[data-view]').forEach((b) => b.addEventListener('click', () => view(b.dataset.view)));
  if (DU.param('p')) view(DU.param('p'));
})();
