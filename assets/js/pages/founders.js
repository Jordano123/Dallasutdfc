(function () {
  const d = DU.store.get(), esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  const FC = d.founderCfg;
  const count = () => FC.base + DU.store.get().founders.length;
  const nextNo = () => count() + 1;
  const pad = (n) => String(n).padStart(4, '0');
  const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2026, i, 1).toLocaleDateString(DU.locale(), { month: 'long' }));
  let mine = DU.pref.get('founder', null);
  if (mine) { const fresh = d.founders.find((f) => f.id === mine.id); if (fresh) mine = fresh; }
  const cardId = DU.param('card');
  const cardRec = cardId ? d.founders.find((f) => f.id === cardId) : null;
  const PRICE = Number(FC.price || 25);
  const youthPct = Number(FC.youthPct || 20), youthAmt = DU.money(Math.round(PRICE * youthPct) / 100);
  const closeAt = null;
  const closed = () => !FC.open || count() >= FC.goal || (closeAt && Date.now() > closeAt.getTime() + 864e5);
  const closeTxt = '';
  const verified = (r) => !r || r.status !== 'pending' && r.status !== 'rejected';
  const cardLink = (rec) => `${location.href.split(/[?#]/)[0]}?card=${encodeURIComponent(rec.id)}`;

  const FIRST = ['Maria', 'James', 'Ana', 'Chris', 'Diego', 'Aaliyah', 'Tom', 'Priya', 'Luis', 'Grace', 'Omar', 'Hannah', 'Jamal', 'Sofia', 'Kevin', 'Lucia', 'Ben', 'Nia', 'Carlos', 'Emily'];
  const LAST = ['Garcia', 'Thompson', 'Patel', 'Walker', 'Hernandez', 'Johnson', 'Nguyen', 'Brooks', 'Martinez', 'Kim', 'Haddad', 'Lee', 'Okafor', 'Rivera', 'Adams', 'Lopez'];
  const PLACES = ['Dallas, TX', 'Irving, TX', 'Garland, TX', 'Plano, TX', 'Arlington, TX', 'Fort Worth, TX', 'Grand Prairie, TX', 'Mesquite, TX', 'Richardson, TX', 'Frisco, TX', 'Houston, TX', 'Austin, TX', 'Oklahoma City, OK', 'Shreveport, LA', 'Los Angeles, CA', 'Chicago, IL'];
  const filler = Array.from({ length: Math.min(FC.base, 240) }, (_, i) => ({ no: FC.base - i, first: FIRST[(i * 7) % FIRST.length], last: LAST[(i * 5 + 3) % LAST.length], hood: PLACES[(i * 3) % PLACES.length], wall: true }));

  main.innerHTML = `
  <section class="fdx-hero" style="--pwbg:${esc((d.walletPhone || {}).f_bg || '#E5E5E5')}">
    <div class="fdx-hero-pic">${DU.walletPhone('founder', d, mine ? { name: `${mine.first} ${mine.last}`, no: mine.no } : null)}</div>
    <div class="fdx-hero-copy"><span class="eyebrow">The first ${FC.goal.toLocaleString(DU.locale())} fans · ${DU.money(PRICE)} ${DU.x('founders.once', 'once')}</span><h1 class="serif" style="font-size:clamp(56px,11vw,150px)">${DU.x('founders.1', 'Become')}<br>a founder</h1>
      <p class="lead">${DU.x('founders.2', 'Get your founder number, put your name on the wall and be part of Dallas United from the very first day.')}${closeTxt ? ` <strong class="gold">Closes at the first kickoff: ${esc(closeTxt)}.</strong>` : ''}</p>
      <div class="stack" style="--gap:8px;max-width:520px"><div class="row between bold"><span data-count>${count().toLocaleString(DU.locale())} founders so far</span><span class="gold">${FC.goal.toLocaleString(DU.locale())}</span></div><div class="progress"><div data-bar style="width:${Math.round(100 * count() / FC.goal)}%"></div></div></div>
      <div class="row"><a class="btn btn-gold" href="#join">Claim your number ${DU.icon('arrow')}</a><a class="btn btn-outline" href="#wall">${DU.x('founders.3', 'See the wall')}</a></div></div></section>

  <section class="cp-sec fd-mark reveal" aria-label="The Founders mark">
    <div class="fd-mark-art"><img src="${esc(DU.pic('founders.mark', 'assets/brand/founders-mark.svg'))}" alt="The Dallas United Founders mark">
      <span class="cp-pin" style="left:46%;top:1%">1</span><span class="cp-pin" style="left:4%;top:30%">2</span><span class="cp-pin" style="left:46%;top:40%">3</span><span class="cp-pin" style="left:88%;top:58%">4</span><span class="cp-pin" style="left:80%;top:80%">5</span></div>
    <div class="stack" style="--gap:18px;flex:1 1 380px">
      <div class="cp-head"><span class="cp-kick">${DU.x('founders.mk', 'Behind the mark')}</span><h2 class="cp-h">${DU.x('founders.mh', 'The Founders mark')}</h2><p class="lead" style="margin:0;color:#4A5468">${DU.x('founders.mp', 'Our first shield, kept for the people who were here first. You’ll only see it on founder merch and the gold card.')}</p></div>
      <ol class="cp-keys">${[[DU.x('founders.m1', 'The Lone Star'), DU.x('founders.m1t', 'The same faceted star as the team crest. Texas, on top of everything.')], [DU.x('founders.m2', 'The first shield'), DU.x('founders.m2t', 'The club’s original shape, from before the round crest. Founders keep it.')], [DU.x('founders.m3', 'DU'), DU.x('founders.m3t', 'Dallas United, in gold.')], [DU.x('founders.m4', 'The Trinity River'), DU.x('founders.m4t', 'The river that runs through Dallas, in club blue and gold.')], [DU.x('founders.m5', 'Founders 2026'), DU.x('founders.m5t', 'The year it all started, and the people who started it with us.')]].map(([h, p], i) => `<li><span class="cp-pin static">${i + 1}</span><span class="stack" style="--gap:4px"><strong>${h}</strong><span class="muted">${p}</span></span></li>`).join('')}</ol>
    </div>
  </section>

  ${(d.foundersSlides || []).filter((x) => x.img).length ? `<section class="fdx-shop" aria-label="${DU.x('founders.shopL', 'The founders collection')}">${DU.pkHTML((d.foundersSlides || []).filter((x) => x.img), DU.x('founders.shopBtn', 'Shop'))}</section>` : ''}

  <section class="fd-card reveal" aria-label="The gold founder card">
    <div class="stack" style="--gap:12px;align-items:center;display:flex;flex:1 1 380px;min-width:0">${DU.memberCard({ type: 'founder', no: mine ? mine.no : nextNo(), name: mine ? `${mine.first} ${mine.last}` : 'Your name', hood: mine ? DU.place(mine) : 'Your city, TX', since: mine ? mine.joined : '' })}<span class="card-hint">${DU.x('founders.hint2', 'Move your mouse over the card to turn it')}</span></div>
    <div class="stack" style="--gap:16px;flex:1 1 340px">
      <span class="cp-kick" style="color:var(--gold)">${DU.x('founders.ck', 'Your gold card')}</span><h2 class="cp-h">${DU.x('founders.ch', 'What’s on it')}</h2>
      <div class="stack fd-card-list" style="--gap:12px">
        <span><strong>${DU.x('founders.c1', 'Your founder number.')}</strong> One of the first ${FC.goal.toLocaleString(DU.locale())}. Nobody else will ever have it.</span>
        <span><strong>${DU.x('founders.c2', 'The Founders mark')}</strong> ${DU.x('founders.c2t', 'in the corner, and the Lone Star across the gold.')}</span>
        <span><strong>${DU.x('founders.c3b', 'Your name, city and state,')}</strong> ${DU.x('founders.c3t', 'and the month you joined.')}</span>
      </div>
      <div class="row" style="--gap:10px"><button type="button" class="wallet-btn" style="background:#000;color:#fff;border:1px solid #333" data-wallet="Apple Wallet">${tr('t.apple')}</button><button type="button" class="wallet-btn" style="background:#fff;color:var(--navy);border:none" data-wallet="Google Wallet">${tr('t.gwallet')}</button></div>
    </div>
  </section>

  <section class="cpx-gal"><div class="cpx-gal-head"><span class="cp-kick">${DU.x('founders.galK', 'Founders')}</span><h2 class="cp-h">${DU.x('founders.galH', 'Worn by the first')}</h2></div>${DU.collage(d.foundersCollage, 'Founders wearing the collection')}</section>

  <section id="join" class="bg-navy"><div class="container section split" style="align-items:center">
    <div data-join></div>
    <div class="center" style="display:flex"><div data-card style="width:min(400px,100%)"></div></div>
  </div></section>

  ${DU.fanMapHTML({ kick: DU.x('founders.4', 'Fan map'), title: `${DU.x('founders.5', 'Where our')}<br>founders live`, text: DU.x('founders.6b', 'Which state has the most founders? Get your friends to join and move your state up.') })}

  <section id="wall" class="container section stack" style="--gap:24px">
    <div class="row between" style="align-items:flex-end"><h2 class="serif" style="font-size:clamp(40px,6vw,80px)">${DU.x('founders.8', 'The founders')}<br>wall</h2><label class="field" style="flex:0 1 360px">${DU.x('founders.9', 'Find a founder')}<input type="search" data-q placeholder="Search a name or neighborhood"></label></div>
    <div data-wall style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr));border-top:1px solid #C9C5BB;border-left:1px solid #C9C5BB"></div>
    <p class="muted" data-none hidden>${DU.x('founders.10', 'No founder matches that search.')}</p>
    <button type="button" class="btn btn-navy" style="align-self:center" data-more>${DU.x('founders.11', 'Show more founders')}</button>
  </section>`;

  const card = (no, name, hood, since) => DU.memberCard({ type: 'founder', no, name, hood, since });

  function walletBox(rec, askPhone) {
    return `<div class="founder-pass stack" style="--gap:12px">
      <strong style="font-size:18px">${DU.x('founders.15', 'Keep your card on your phone')}</strong>
      <div class="founder-pass-btns"><button type="button" class="wallet-btn" style="background:#000;color:#fff;border:none" data-wallet="Apple Wallet">${tr('t.apple')}</button><button type="button" class="wallet-btn" style="background:#fff;color:var(--navy);border:none" data-wallet="Google Wallet">${tr('t.gwallet')}</button></div>
      ${askPhone ? `<form class="stack" style="--gap:8px" data-phone novalidate><label class="field on-dark" style="color:#fff">${DU.x('founders.16', 'Or text the card to my phone')}<span class="founder-phone-row"><input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="(214) 555-0123" value="${esc(rec.phone || '')}"><button type="submit" class="btn btn-gold">${DU.x('founders.17', 'Send')}</button></span></label>
        <span class="tiny" style="color:#C9D2E3">${DU.x('founders.18', 'Lost your phone or your card? Ask the club and we’ll send it again.')}</span></form>` : ''}</div>`;
  }
  let walletRec = null;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-wallet]'); if (!b) return;
    if (!walletRec) { DU.toast(DU.x('founders.walletFirst', 'Claim your number first, then add your card to your phone.')); DU.$('#join').scrollIntoView({ behavior: 'smooth' }); return; }
    DU.toast(`Founder #${pad(walletRec.no)} card is ready for ${b.dataset.wallet}. (Real Wallet passes are switched on when the site goes live.)`);
  });
  function bindPhone(rec) {
    walletRec = rec;
    const pf = DU.$('[data-phone]');
    if (pf) pf.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = pf.phone.value.trim();
      if (phone.replace(/\D/g, '').length < 10) { DU.toast('Enter a phone number with area code.'); return; }
      const when = new Date().toISOString().slice(0, 10);
      DU.store.addPublic('founders:update', { id: rec.id, phone, cardText: when }, (dd) => { const f = dd.founders.find((x) => x.id === rec.id); if (f) { f.phone = phone; f.cardText = when; } });
      rec.phone = phone; DU.pref.set('founder', { ...rec, phone });
      DU.toast(`Your founder card is on its way to ${phone}.`);
    });
  }

  function pay(rec, done) {
    const m = DU.modal(`<div class="stack" style="--gap:14px;padding:clamp(22px,4vw,36px)"><span class="eyebrow" style="color:var(--blue)">${DU.x('founders.payK', 'Founder pass')}</span><h2 class="display" style="font-size:36px">Pay ${DU.money(PRICE)}</h2>
      <div class="fd-sum"><span>Founder No. ${pad(rec.no)} · ${esc(rec.first)} ${esc(rec.last)}</span><strong>${DU.money(PRICE)}</strong></div>
      <div class="grid-fit" style="--min:160px;--gap:10px"><button type="button" class="btn" style="background:#000;color:#fff" data-pay>Apple Pay</button><button type="button" class="btn btn-outline" data-pay>Google Pay</button></div>
      <span class="center small muted" style="display:flex">${DU.x('founders.payCard', 'or pay with card')}</span>
      <label class="field">Card number<input inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234"></label>
      <div class="form-grid"><label class="field">Expiry<input autocomplete="cc-exp" placeholder="MM / YY"></label><label class="field">CVC<input inputmode="numeric" autocomplete="cc-csc" placeholder="123"></label></div>
      <button type="button" class="btn btn-gold" data-pay>Pay ${DU.money(PRICE)} and claim No. ${pad(rec.no)}</button>
      <p class="tiny muted center" style="display:flex">🔒 ${esc(d.settings.payments || 'Stripe')} · ${youthAmt} ${DU.x('founders.payYouth2', 'of this goes to youth soccer in Dallas. This is a test checkout: no card is charged yet.')}</p></div>`, { label: 'Pay for your founder pass', style: 'max-width:520px' });
    DU.$$('[data-pay]', m.el).forEach((b) => b.addEventListener('click', () => { m.close(); done(); }));
  }

  function renderJoin() {
    const box = DU.$('[data-join]'), cbox = DU.$('[data-card]');
    if (cardRec && !(mine && mine.id === cardRec.id)) {
      box.innerHTML = `<div class="stack" style="--gap:16px"><span class="eyebrow">${DU.x('founders.21', 'Founder card')}</span><h2 class="display h2">Founder #${pad(cardRec.no)}</h2><p class="lead" style="color:#DCE4F2">${esc(cardRec.first)}, here is your card. Add it to your phone wallet so it is always with you.</p>${walletBox(cardRec, false)}</div>`;
      cbox.innerHTML = card(cardRec.no, `${cardRec.first} ${cardRec.last}`, cardRec.hood, cardRec.joined);
      bindPhone(cardRec);
      return;
    }
    if (mine) {
      box.innerHTML = `<div class="stack" role="status" style="--gap:16px"><span class="eyebrow">${DU.x('founders.welcome', 'Welcome to the family')}</span><h2 class="display h2">You’re founder #${pad(mine.no)}</h2>
        <p class="lead" style="color:#DCE4F2">${mine.wall ? DU.x('founders.onWall', 'Your name is on the wall below.') : DU.x('founders.offWall', 'You chose to keep your name off the public wall.')} ${DU.x('founders.receipt', 'Your receipt and welcome message are in your email.')}</p>
        ${walletBox(mine, true)}
        <div class="row"><button type="button" class="btn btn-gold" data-share>${tr('c.share')}</button>${DU.on('shop', d) ? `<a class="btn btn-outline btn-on-dark" href="founders-shop.html">${DU.x('founders.toShop', 'Founders shop')}</a>` : ''}<a class="btn btn-outline btn-on-dark" href="#wall">${DU.x('founders.22', 'See the wall')}</a></div></div>`;
      cbox.innerHTML = card(mine.no, `${mine.first} ${mine.last}`, mine.hood, mine.joined);
      bindPhone(mine);
      DU.$('[data-share]').addEventListener('click', async () => { const url = location.href.split(/[?#]/)[0]; const text = `I’m founder #${pad(mine.no)} of Dallas United! Join me:`; if (navigator.share) { try { await navigator.share({ title: 'Dallas United Founders', text, url }); } catch (e) {  } } else { try { await navigator.clipboard.writeText(`${text} ${url}`); DU.toast(tr('c.shareCopied')); } catch (e) { DU.toast(url); } } });
      return;
    }
    if (closed()) { box.innerHTML = `<div class="stack" style="--gap:14px"><h2 class="display h2">${count() >= FC.goal ? DU.x('founders.23', 'All founder numbers are taken') : DU.x('founders.closed', 'The founder pass is closed')}</h2><p class="lead" style="color:#DCE4F2">${DU.x('founders.24', 'Thank you, Dallas. Join the newsletter to hear what’s next.')}</p>${DU.on('club214', d) ? `<a class="btn btn-gold" href="214-club.html" style="align-self:flex-start">${DU.x('founders.closed214', 'Join the 214 Club free')}</a>` : ''}</div>`; cbox.innerHTML = card(FC.goal, 'Founders', 'Dallas'); return; }
    box.innerHTML = `<form class="stack on-dark" style="--gap:14px" novalidate data-f><span class="eyebrow">${DU.x('founders.claimK', 'Claim your number')}</span><h2 class="display" style="font-size:clamp(40px,6vw,64px);line-height:.95">${DU.money(PRICE)}. ${DU.x('founders.claimH', 'Once. Forever.')}</h2>
      <p style="margin:0;color:#DCE4F2">${DU.x('founders.claimP', 'Your number, your name on the wall, the gold card and the founders-only shop.')} <strong class="gold">${youthPct}% (${youthAmt})</strong> ${DU.x('founders.claimYouthC', 'of every founder pass goes to youth soccer in Dallas, through grants we give to local teams and kids who want to play. That’s us investing in our community.')}${closeTxt ? ` <strong class="gold">${DU.x('founders.closes', 'Closes at the first kickoff:')} ${esc(closeTxt)}.</strong>` : ''}</p>
      <div class="form-grid"><label class="field">${tr('c.first')} *<input name="first" required autocomplete="given-name" data-live></label><label class="field">${tr('c.last')} *<input name="last" required autocomplete="family-name" data-live></label></div>
      <div class="place-row"><label class="field">${DU.x('form.city', 'City *')}<input name="city" list="du-cities" required placeholder="Dallas" autocomplete="address-level2" data-live><datalist id="du-cities">${DU.CITIES.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></label><label class="field">${DU.x('form.state', 'State *')}${DU.stateSelect('state', 'TX', 'required data-live autocomplete="address-level1"')}</label></div>
      <label class="field">${tr('c.email')} *<input name="email" type="email" required autocomplete="email"></label>
      <div class="form-grid"><label class="field">${DU.x('founders.dob', 'Date of birth *')}<input name="dob" type="date" required autocomplete="bday" max="${new Date().toISOString().slice(0, 10)}"></label><label class="field">${DU.x('founders.phoneOpt', 'Phone (optional)')}<input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(214) 555-0100"></label></div>
      <p class="small" style="color:#C9D2E3;margin:-4px 0 0">${DU.x('founders.dobWhy', 'We ask so the club can send you a birthday message.')}</p>
      <label class="check" style="color:#DCE4F2"><input type="checkbox" name="wall" checked data-live> ${DU.x('founders.wallOpt', 'Show my name and city on the public Founders Wall')}</label>
      <label class="check" style="color:#DCE4F2"><input type="checkbox" name="news" checked> Send me the weekly club email. See the <a class="link" href="legal.html?tab=privacy">${tr('c.privacy')}</a>.</label>
      <div class="fd-sum on-navy"><span>${DU.x('founders.pass', 'Founder pass')} · No. ${pad(nextNo())} ${DU.x('founders.isNext', 'is next')}</span><strong>${DU.money(PRICE)}</strong></div>
      <button class="btn btn-gold" type="submit">Pay ${DU.money(PRICE)} ${DU.x('founders.payBtn', 'and claim my number')}</button>
      <span class="tiny center" style="display:flex;color:#C9D2E3">${DU.x('founders.secure', 'Secure checkout with Stripe · Apple Pay · Google Pay')}</span></form>`;
    const f = DU.$('[data-f]');
    const upd = () => { const fd = new FormData(f); cbox.innerHTML = card(nextNo(), `${fd.get('first') || 'Your'} ${fd.get('last') || 'Name'}`, `${String(fd.get('city') || '').trim() || 'Your city'}, ${fd.get('state') || 'TX'}`); DU.bindCards(cbox); };
    DU.$$('[data-live]', f).forEach((i) => i.addEventListener('input', upd)); upd();
    f.addEventListener('submit', (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(f));
      if (!String(fd.first || '').trim() || !String(fd.last || '').trim() || !String(fd.city || '').trim() || !DU.stateName(fd.state)) { DU.toast(tr('c.required')); return; }
      if (!DU.isEmail(fd.email)) { DU.toast(tr('c.badEmail')); return; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fd.dob || '')) { DU.toast(DU.x('founders.dobNeed', 'Add your date of birth.')); return; }
      const rec = { id: DU.store.uid('fd'), no: nextNo(), first: fd.first.trim(), last: fd.last.trim(), city: fd.city.trim(), state: fd.state, hood: `${fd.city.trim()}, ${fd.state}`, email: fd.email.trim(), joined: new Date().toISOString().slice(0, 10), wall: !!fd.wall, news: !!fd.news, dob: fd.dob, bday: fd.dob.slice(5), phone: String(fd.phone || '').trim(), status: 'verified', paid: PRICE, youth: Math.round(PRICE * youthPct) / 100 };
      pay(rec, () => {
        rec.no = nextNo();
        DU.store.addPublic('founders', rec);
        DU.pref.set('founder', rec);
        location.hash = 'join'; location.reload();
      });
    });
  }

  const renderMap = DU.bindFanMap(main, () => DU.store.get().founders, DU.x('founders.noun', 'founders'), DU.fanSeed(d, 1));

  let shown = 40;
  function renderWall() {
    const q = (DU.$('[data-q]').value || '').toLowerCase();
    const real = DU.store.get().founders.filter((f) => f.wall && verified(f)).sort((a, b) => b.no - a.no);
    const list = [...real, ...filler.filter((x) => !real.some((r) => r.no === x.no))].filter((w) => !q || `${w.first} ${w.last} ${w.hood} ${w.no}`.toLowerCase().includes(q));
    DU.$('[data-wall]').innerHTML = list.slice(0, shown).map((w) => { const me = mine && mine.no === w.no; return `<div style="border-right:1px solid #C9C5BB;border-bottom:1px solid #C9C5BB;padding:16px 18px;display:flex;flex-direction:column;gap:2px;background:${me ? 'var(--gold)' : 'transparent'}"><span class="display" style="font-size:22px;color:${me ? 'var(--navy)' : 'var(--blue)'}">#${pad(w.no)}</span><span class="bold" style="text-transform:uppercase">${esc(w.first)} ${esc(w.last)}</span><span class="small muted">${esc(w.hood)}</span></div>`; }).join('');
    DU.$('[data-none]').hidden = list.length > 0;
    DU.$('[data-more]').hidden = list.length <= shown;
  }
  DU.$('[data-q]').addEventListener('input', () => { shown = 40; renderWall(); });
  DU.$('[data-more]').addEventListener('click', () => { shown += 40; renderWall(); });

  renderJoin(); renderMap(); renderWall();
  DU.bindPk(DU.$('.fdx-shop [data-slides]'));
  DU.layout({ active: '', v2: true });
})();
