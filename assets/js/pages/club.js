(function () {
  if (DU.soonPage && DU.soonPage()) return;
  const d = DU.store.get(), t = DU.t, esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  const CT = d.clubTexts || {};
  const FC = d.founderCfg || {};
  const s = d.settings || {};
  const pad = (n) => String(n).padStart(4, '0');
  const members = () => (DU.store.get().fanclub || []);
  const followOn = CT.follow !== false;
  const SOC = [['Instagram', s.instagram, 'ig'], ['TikTok', s.tiktok, 'tt'], ['YouTube', s.youtube, 'yt'], ['X', s.x, 'x'], ['Facebook', s.facebook, 'fb']].filter((x) => x[1]);
  let me = DU.pref.get('club214', null);
  if (me) { const fresh = members().find((m) => m.id === me.id); if (fresh) me = fresh; }
  const founderPrice = DU.money(FC.price || 25);
  const goal = (FC.goal || 500).toLocaleString(DU.locale());
  const closes = FC.closesAt ? new Date(`${FC.closesAt}T12:00:00`).toLocaleDateString(DU.locale(), { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const walletBtns = `<div class="row" style="--gap:10px"><button type="button" class="wallet-btn" style="background:#000;color:#fff;border:none" data-wallet="Apple Wallet">${tr('t.apple')}</button><button type="button" class="wallet-btn" style="background:#fff;color:var(--navy);border:1px solid #C9D2E3" data-wallet="Google Wallet">${tr('t.gwallet')}</button></div>`;

  main.innerHTML = `
  <section class="club-hero">
    <span class="club-hero-214" aria-hidden="true">214</span>
    <div class="container club-hero-in">
      <div class="stack" style="--gap:18px;max-width:560px">
        <span class="eyebrow">${esc(t(CT.kicker) || 'Official supporters club')} · ${DU.x('club.free', 'Free')}</span>
        <h1 class="display" style="font-size:clamp(64px,10vw,130px);line-height:.88">${esc(t(CT.name) || 'The 214 Club')}</h1>
        <p class="lead" style="color:#DCE4F2">${esc(t(CT.intro))}</p>
        <div class="row"><a class="btn btn-gold" href="#join">${DU.x('club.join', 'Join free')} ${DU.icon('arrow')}</a><a class="btn btn-outline btn-on-dark" href="#how">${DU.x('club.seeHow', 'How it works')}</a></div>
        <span class="small bold" style="color:#C9D8FF" data-count>${members().length + Number(CT.base || 0) ? `${(members().length + Number(CT.base || 0)).toLocaleString(DU.locale())} ${DU.x('club.soFar', 'members so far')}` : DU.x('club.first', 'Be one of the very first members')}</span>
      </div>
      <div class="stack center" style="--gap:12px;flex:1;min-width:0;display:flex;align-items:center" data-hero-card></div>
    </div>
  </section>

  <section class="cpx-how" id="how" style="--pwbg:${esc((d.walletPhone || {}).c_bg || '#E5E5E5')}">
    <div class="cpx-how-pic">${DU.walletPhone('club', d, me ? { name: `${me.first} ${me.last}`, no: me.no } : null)}</div>
    <div class="cpx-how-copy">
      <div class="cp-head"><span class="cp-kick">${DU.x('club.howK', 'How to join')}</span><h2 class="cp-h">${DU.x('club.howH', 'Three steps, two minutes')}</h2></div>
      <ol class="cpx-steps">
        <li><span class="cp-num">01</span><div><strong>${DU.x('club.s1', 'Follow us')}</strong><span>${DU.x('club.s1t', 'On Instagram, TikTok, YouTube, X or Facebook. Any one is enough.')}</span>
          <div class="row" style="--gap:6px;margin-top:10px">${SOC.map(([l, u, ic]) => `<a class="cp-chip" href="${esc(u)}" target="_blank" rel="noopener">${DU.icon(ic)}${esc(l)}</a>`).join('')}</div></div></li>
        <li><span class="cp-num">02</span><div><strong>${DU.x('club.s2', 'Claim your card')}</strong><span>${DU.x('club.s2t2', 'Your name, your city and state, your email and where you follow us. You get your member number straight away.')}</span></div></li>
        <li><span class="cp-num">03</span><div><strong>${DU.x('club.s3', 'Add it to your phone')}</strong><span>${DU.x('club.s3t2', 'One tap puts the card in Apple Wallet or Google Wallet, so it is always with you.')}</span><div style="margin-top:10px">${walletBtns}</div></div></li>
      </ol>
      <a class="btn btn-gold" style="align-self:flex-start" href="#join">${DU.x('club.join', 'Join free')} ${DU.icon('arrow')}</a>
    </div>
  </section>

  <section class="cpx-gal"><div class="cpx-gal-head"><span class="cp-kick">${DU.x('club.galK', 'The 214')}</span><h2 class="cp-h">${DU.x('club.galH', 'Our people')}</h2></div>${DU.collage(d.club214Collage, 'Photos of 214 Club members')}</section>

  <section class="cp-sec">
    <div class="cp-head"><span class="cp-kick">${DU.x('club.cardK', 'Your card')}</span><h2 class="cp-h">${DU.x('club.cardH', 'What’s on it')}</h2></div>
    <div class="cp-explain">
      <div class="cp-explain-card"><img src="${esc(DU.pic('card.clubFront', 'assets/img/card-214-front.jpg'))}" alt="Front of the 214 Club card">
        <span class="cp-pin" style="left:6%;top:10%">1</span><span class="cp-pin" style="left:6%;top:56%">2</span><span class="cp-pin" style="left:78%;top:40%">3</span><span class="cp-pin" style="left:50%;top:70%">4</span></div>
      <ol class="cp-keys">
        ${[[DU.x('club.k1', 'The club crest'), DU.x('club.k1t', 'The same crest the players wear: the Lone Star, the Trinity River and 2026.')], [DU.x('club.k2', 'Your member number'), DU.x('club.k2t', 'In the order you joined. It stays yours.')], [DU.x('club.k3', 'The big 214'), DU.x('club.k3t', 'Dallas’s area code, behind everything, like the city behind the club.')], [DU.x('club.k4', 'The river line'), DU.x('club.k4t', 'The Trinity River in gold and blue, flowing across the card like it flows around the crest.')]].map(([h, p], i) => `<li><span class="cp-pin static">${i + 1}</span><span class="stack" style="--gap:4px"><strong>${h}</strong><span class="muted">${p}</span></span></li>`).join('')}
      </ol>
    </div>
  </section>

  <section id="join" class="bg-navy"><div class="container section split" style="align-items:center">
    <div data-join></div>
    <div class="stack" style="--gap:12px;align-items:center;display:flex" data-join-card></div>
  </div></section>

  <section class="cpx-row">${DU.dragRow(d.club214Slides, 'Photos from match days')}</section>

  ${DU.on('founders', d) ? `<section class="cp-sec">
    <div class="cp-head"><span class="cp-kick">${DU.x('club.cmpK', '214 Club or founder?')}</span><h2 class="cp-h">${DU.x('club.cmpH', 'You can be both')}</h2></div>
    ${DU.compareTable(d)}
  </section>

  <section class="cp-gold">
    <div class="cp-gold-card" aria-hidden="true">${DU.memberCard({ type: 'founder', no: 1, name: 'Your name', hood: 'Your city, TX', small: true })}</div>
    <div class="stack" style="--gap:10px;flex:1;min-width:240px"><h2 class="display" style="font-size:clamp(32px,4vw,48px);line-height:1">${DU.x('club.goldH', 'Want your name on the wall forever?')}</h2><span class="bold" style="color:#3A2C08">Become a founder for ${founderPrice}. Only the first ${goal}.</span></div>
    <a class="btn btn-navy" href="founders.html#join">${DU.x('club.goGold', 'Go gold')} ${DU.icon('arrow')}</a>
  </section>` : ''}

  ${DU.fanMapHTML({ kick: DU.x('club.mapK', 'Fan map'), title: DU.x('club.mapH3', 'Where our members live'), text: DU.x('club.mapP2', 'Which state has the most 214 Club members? Bring your friends and move your state up.') })}`;

  const heroCard = () => DU.memberCard({ type: 'club', no: me ? me.no : members().length + 1, name: me ? `${me.first} ${me.last}` : 'Your name', hood: me ? DU.place(me) : 'Your city, TX', since: me ? me.joined : '' });
  DU.$('[data-hero-card]').innerHTML = `${heroCard()}<span class="card-hint">${DU.x('club.hint3', 'Move your mouse over the card to turn it')}</span>`;

  function bindWallet(rec) {
    DU.$$('[data-wallet]').forEach((b) => { if (b.dataset.wb) return; b.dataset.wb = '1'; b.addEventListener('click', () => DU.toast(rec ? `Member #${pad(rec.no)} card is ready for ${b.dataset.wallet}. (Real Wallet passes are switched on when the site goes live.)` : DU.x('club.walletFirst', 'Join first, then add your card to your phone.'))); });
  }

  function renderJoin() {
    const box = DU.$('[data-join]'), cbox = DU.$('[data-join-card]');
    if (me) {
      box.innerHTML = `<div class="stack" role="status" style="--gap:16px"><span class="eyebrow">${DU.x('club.inK', 'Welcome to the 214')}</span><h2 class="display h2">You’re member #${pad(me.no)}</h2>
        <p class="lead" style="color:#DCE4F2">${DU.x('club.inP2', 'Keep your card on your phone. We will send you club news first, and a message on your birthday.')}</p>${walletBtns}
        ${DU.on('founders', d) ? `<a class="link gold bold" href="founders.html#join">${DU.x('club.inGold', 'Want the gold card too? Become a founder')} →</a>` : ''}</div>`;
      cbox.innerHTML = `${DU.memberCard({ type: 'club', no: me.no, name: `${me.first} ${me.last}`, hood: DU.place(me), since: me.joined })}<span class="card-hint">${DU.x('club.hint3', 'Move your mouse over the card to turn it')}</span>`;
      DU.bindCards(cbox); bindWallet(me);
      return;
    }
    box.innerHTML = `<form class="stack on-dark" style="--gap:14px" novalidate data-f><span class="eyebrow">${DU.x('club.formK', 'Join free')}</span><h2 class="display" style="font-size:clamp(40px,6vw,64px);line-height:.95">${DU.x('club.formH', 'Claim your card')}</h2>
      <div class="form-grid"><label class="field">${tr('c.first')} *<input name="first" required autocomplete="given-name" data-live></label><label class="field">${tr('c.last')} *<input name="last" required autocomplete="family-name" data-live></label></div>
      <div class="place-row"><label class="field">${DU.x('form.city', 'City *')}<input name="city" list="du-cities" required placeholder="Dallas" autocomplete="address-level2" data-live><datalist id="du-cities">${DU.CITIES.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></label><label class="field">${DU.x('form.state', 'State *')}${DU.stateSelect('state', 'TX', 'required data-live autocomplete="address-level1"')}</label></div>
      <div class="form-grid"><label class="field">${tr('c.email')} *<input name="email" type="email" required autocomplete="email"></label><label class="field">${DU.x('club.dob', 'Date of birth *')}<input name="dob" type="date" required autocomplete="bday" max="${new Date().toISOString().slice(0, 10)}"></label></div>
      <p class="small" style="color:#C9D2E3;margin:-4px 0 0">${DU.x('club.dobWhy', 'We ask so we can send you a birthday message.')}</p>
      ${followOn ? `<fieldset class="founder-follow"><legend>${DU.x('club.follow', 'Follow us to join *')}</legend>
        <p class="small" style="color:#DCE4F2;margin:0 0 10px">${DU.x('club.followP', 'The 214 Club is for our followers. Follow us on any one of these, then tell us your username.')}</p>
        <div class="ff-socs">${SOC.map(([l, u, ic]) => `<a class="ff-soc" href="${esc(u)}" target="_blank" rel="noopener" aria-label="${esc(l)} (opens in a new tab)">${DU.icon(ic)}<span>${ic === 'x' ? 'X' : esc(l)}</span></a>`).join('')}</div>
        <div class="ff-row"><label class="field">${DU.x('club.where', 'Where you follow us')}<select name="platform" class="input">${SOC.map((x) => `<option>${esc(x[0])}</option>`).join('')}</select></label><label class="field">${DU.x('club.user', 'Your username')}<input name="handle" required placeholder="@yourname" autocomplete="off" autocapitalize="off" spellcheck="false"></label></div>
      </fieldset>` : ''}
      <label class="check" style="color:#DCE4F2"><input type="checkbox" name="news" checked> ${DU.x('club.news', 'Send me club news by email')}</label>
      <button class="btn btn-gold" type="submit">${DU.x('club.submit', 'Join free and get my card')}</button></form>`;
    const f = DU.$('[data-f]');
    const upd = () => { const fd = new FormData(f); cbox.innerHTML = `${DU.memberCard({ type: 'club', no: members().length + 1, name: `${fd.get('first') || 'Your'} ${fd.get('last') || 'Name'}`, hood: `${String(fd.get('city') || '').trim() || 'Your city'}, ${fd.get('state') || 'TX'}` })}<span class="card-hint">${DU.x('club.live', 'Your card fills in as you type')}</span>`; DU.bindCards(cbox); };
    DU.$$('[data-live]', f).forEach((i) => i.addEventListener('input', upd)); upd();
    f.addEventListener('submit', (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(f));
      if (!String(fd.first || '').trim() || !String(fd.last || '').trim() || !String(fd.city || '').trim() || !DU.stateName(fd.state)) { DU.toast(tr('c.required')); return; }
      if (!DU.isEmail(fd.email)) { DU.toast(tr('c.badEmail')); return; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fd.dob || '')) { DU.toast(DU.x('club.dobNeed', 'Add your date of birth.')); return; }
      const handle = String(fd.handle || '').trim().replace(/^@+/, '').replace(/^https?:\/\/\S+\/@?/, '');
      if (followOn && !/^[A-Za-z0-9._-]{2,40}$/.test(handle)) { DU.toast(DU.x('club.badUser', 'Add the username you follow us with (letters, numbers, dots or underscores).')); return; }
      if (members().some((m) => String(m.email).toLowerCase() === fd.email.trim().toLowerCase())) { DU.toast(DU.x('club.dupe', 'That email is already in the 214 Club.')); return; }
      const rec = { id: DU.store.uid('fc'), no: members().length + 1, first: fd.first.trim(), last: fd.last.trim(), email: fd.email.trim(), city: fd.city.trim(), state: fd.state, hood: `${fd.city.trim()}, ${fd.state}`, dob: fd.dob, bday: fd.dob.slice(5), news: !!fd.news, joined: new Date().toISOString().slice(0, 10), ...(followOn ? { social: { platform: fd.platform, user: handle } } : {}) };
      DU.store.addPublic('fanclub', rec); DU.pref.set('club214', rec); me = rec;
      DU.$('[data-hero-card]').innerHTML = `${heroCard()}<span class="card-hint">${DU.x('club.hint3', 'Move your mouse over the card to turn it')}</span>`; DU.bindCards(DU.$('[data-hero-card]'));
      renderJoin(); DU.toast(`Welcome to ${t(CT.name) || 'the 214 Club'}!`);
      DU.$('#join').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const redrawMap = DU.bindFanMap(main, members, DU.x('club.members', 'members'), DU.fanSeed(d, 3));
  const renderBars = () => redrawMap && redrawMap();

  renderJoin(); renderBars();
  DU.layout({ active: 'club214', v2: true });
  bindWallet(me);
  DU.bindDragRows(main);
})();
