(function () {
  const d = DU.store.get(), esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  const C = d.donationCfg;
  let monthly = true, amt = 10, other = '', step = 'pick';
  const IMPACT = { 5: 'buys a new match ball', 10: 'pays for an hour of field time for youth clinics', 25: 'covers a player’s travel to an away game' };
  const raised = () => C.raisedBase + DU.store.get().donations.reduce((a, x) => a + Number(x.amount || 0), 0);
  const amount = () => (other ? Number(other) || 0 : amt);

  main.innerHTML = `
  <section style="position:relative;background:var(--navy-4);color:#fff;overflow:hidden">
    <img class="zoom" src="${DU.esc(DU.pic('support.hero', 'assets/img/fans.jpg'))}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:rgba(5,11,22,.74)"></div>
    <div class="container split" style="position:relative;padding-top:140px;padding-bottom:72px;align-items:center">
      <div class="stack" style="--gap:18px"><span class="eyebrow">${tr('nav.support')}</span><h1 class="display" style="font-size:clamp(56px,9vw,132px)">${DU.x('support.1', 'Help us')}<br>grow</h1>
        <p class="lead" style="color:#DCE4F2">${DU.x('support.2', 'Dallas United is a brand-new club built by its fans. Every dollar goes back into the club: kit, balls, field time, away travel and free clinics for Dallas kids.')}</p>
        <div class="stack" style="--gap:8px;max-width:520px"><div class="row between bold"><span data-raised></span><span class="gold">Goal $${C.goal.toLocaleString('en-US')}</span></div><div class="progress"><div data-bar></div></div><span class="small" style="color:#C9D2E3" data-sup></span></div></div>
      <div class="card stack" style="--gap:16px;color:var(--ink);padding:clamp(20px,3vw,32px);flex:0 1 440px" data-box></div>
    </div>
  </section>
  <section class="bg-white reveal"><div class="container section-tight stack" style="--gap:26px"><h2 class="serif h2">${DU.x('support.3', 'Where your money goes')}</h2>
    <div class="grid-fit" style="--min:220px;--gap:24px">${[['⚽', 'Kit & equipment', 'Balls, bibs, cones, goalkeeper gloves and first-aid kits.', 35], ['🏟️', 'Field time', 'Renting pitches for training and home matches.', 30], ['🚌', 'Away travel', 'Getting the squad to away games across Texas.', 20], ['🧒', 'Youth clinics', 'Free sessions with the players for Dallas kids.', 15]].map(([i, h, p, pc]) => `<div class="perk"><span style="font-size:34px" aria-hidden="true">${i}</span><strong style="font-size:20px">${h}</strong><span class="text">${p}</span><span class="display" style="font-size:28px;color:var(--blue)">${pc}%</span></div>`).join('')}</div></div></section>
  <section class="container section-tight reveal stack" style="--gap:26px"><h2 class="serif h2">${DU.x('support.4', 'Monthly supporters get')}</h2>
    <div class="grid-fit" style="--min:260px">${[['$5', 'Supporter', ['Supporter badge on your founder card', 'Monthly update from the club'], '#fff', 'var(--ink)', 'var(--blue)'], ['$10', 'Blue supporter', ['Everything in Supporter', '10% off in the club shop', 'Early look at new kits'], 'var(--blue)', '#fff', 'var(--gold)'], ['$25', 'Gold supporter', ['Everything in Blue', 'Invite to the end-of-season get-together with the squad', 'A thank-you on our social media'], 'var(--navy)', '#fff', 'var(--gold)']].map(([pr, n, perks, bg, fg, ac]) => `<div class="card card-pad stack" style="--gap:12px;background:${bg};color:${fg}"><span class="tiny bold" style="letter-spacing:.12em;color:${ac}">${pr} / MONTH</span><strong class="display" style="font-size:32px">${n}</strong>${perks.map((x) => `<span style="display:flex;gap:10px"><span style="color:${ac};font-weight:800" aria-hidden="true">✓</span>${x}</span>`).join('')}</div>`).join('')}</div></section>`;

  function head() {
    const r = raised();
    DU.$('[data-raised]').textContent = `$${r.toLocaleString('en-US')} raised this season`;
    DU.$('[data-bar]').style.width = `${Math.min(100, Math.round(100 * r / C.goal))}%`;
    const list = DU.store.get().donations;
    DU.$('[data-sup]').textContent = `${C.supportersBase + list.length} supporters · ${C.monthlyBase + list.filter((x) => x.kind === 'Monthly').length} give every month`;
    if (DU.$('[data-wall]')) DU.$('[data-wall]').innerHTML = list.filter((x) => x.show).slice(0, 14).map((x) => `<span style="background:var(--navy-2);border-radius:999px;padding:8px 14px;font-weight:700;font-size:14px">${esc(x.name.split(' ')[0])} ${x.kind === 'Monthly' && x.amount >= 10 ? `<span class="gold">★ ${x.amount >= 25 ? 'Gold' : 'Blue'}</span>` : ''}</span>`).join('');
  }
  function render() {
    const box = DU.$('[data-box]'), a = amount();
    if (step === 'pick') box.innerHTML = `
      <div role="radiogroup" aria-label="How often" style="display:grid;grid-template-columns:1fr 1fr;background:var(--line-2);border-radius:10px;padding:4px">${[[true, 'Monthly'], [false, 'One-time']].map(([v, l]) => `<button type="button" role="radio" aria-checked="${monthly === v}" data-freq="${v}" style="background:${monthly === v ? 'var(--navy)' : 'transparent'};color:${monthly === v ? '#fff' : 'var(--text)'};border:none;border-radius:8px;padding:12px;font-weight:800;min-height:48px">${l}</button>`).join('')}</div>
      <div role="radiogroup" aria-label="Amount" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">${[5, 10, 25].map((v) => { const on = !other && v === amt; return `<button type="button" role="radio" aria-checked="${on}" data-amt="${v}" style="display:flex;flex-direction:column;align-items:center;gap:2px;background:${on ? 'var(--navy)' : '#fff'};color:${on ? 'var(--gold)' : 'var(--navy)'};border:2px solid ${on ? 'var(--navy)' : '#C3CAD6'};border-radius:10px;padding:14px 6px;min-height:72px"><span class="display" style="font-size:30px">$${v}</span><span class="tiny bold">${monthly ? 'a month' : 'once'}</span></button>`; }).join('')}</div>
      <label class="field">${DU.x('support.6', 'Or choose your own amount')}<span style="display:flex;align-items:center;border:2px solid ${other ? 'var(--navy)' : '#C3CAD6'};border-radius:10px;padding:0 14px"><span class="bold muted">$</span><input type="number" min="1" inputmode="numeric" value="${esc(other)}" data-other placeholder="50" style="flex:1;border:none;outline:none;padding:12px 8px;font-weight:700;min-width:0;min-height:48px"></span></label>
      <p class="notice" style="background:var(--cream);font-weight:600">$${a} ${monthly ? 'a month' : 'today'} ${IMPACT[a] || 'helps pay for kit, field time and away travel'}.</p>
      <button type="button" class="btn btn-gold" data-next ${a > 0 ? '' : 'disabled'}>Give $${a} ${monthly ? 'a month' : 'now'}</button>
      <span class="tiny muted center" style="display:flex">${monthly ? 'Cancel anytime from the link in your receipt email.' : 'One payment. Nothing else will be charged.'}</span>`;
    if (step === 'pay') box.innerHTML = `<button type="button" class="link" style="background:none;border:none;align-self:flex-start;min-height:40px" data-back>← Change amount</button><strong style="font-size:20px">$${a} ${monthly ? 'every month' : 'one-time gift'}</strong>
      <div class="grid-fit" style="--min:150px;--gap:10px"><button type="button" class="btn" style="background:#000;color:#fff" data-pay>${DU.x('support.7', 'Apple Pay')}</button><button type="button" class="btn btn-outline" data-pay>${DU.x('support.8', 'Google Pay')}</button></div>
      <span class="tiny muted center" style="display:flex">or pay with card</span>
      <form class="stack" style="--gap:12px" novalidate data-payform><label class="field">${tr('c.first')} *<input name="first" required autocomplete="given-name"></label><label class="field">${DU.x('support.9', 'Email (for your receipt) *')}<input name="email" type="email" required autocomplete="email"></label><label class="field">${DU.x('support.10', 'Card number')}<input inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234"></label>
      <label class="check"><input type="checkbox" name="show" checked> Show my first name on the supporters list</label><button class="btn btn-gold" type="submit">Pay $${a}${monthly ? ' monthly' : ''}</button></form>
      <span class="tiny muted center" style="display:flex">🔒 Payments handled by ${esc(d.settings.payments)}. This is a test checkout: no card is charged yet.</span>`;
    if (step === 'done') box.innerHTML = `<div class="stack center" role="status" style="--gap:14px;text-align:center"><span style="width:84px;height:84px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:40px" aria-hidden="true">💛</span><h2 class="display" style="font-size:40px">${DU.x('support.11', 'Thank you!')}</h2><p class="text">${monthly ? `Your $${a} a month helps Dallas United grow. You can cancel anytime.` : `Your $${a} gift helps Dallas United grow.`} Your receipt is on its way by email.</p><span class="badge badge-navy" style="color:var(--gold);padding:8px 14px">★ ${monthly ? (a >= 25 ? 'Gold supporter' : a >= 10 ? 'Blue supporter' : 'Supporter') : 'One-time supporter'}</span></div>`;
    bind();
  }
  function bind() {
    DU.$$('[data-freq]').forEach((b) => b.onclick = () => { monthly = b.dataset.freq === 'true'; render(); });
    DU.$$('[data-amt]').forEach((b) => b.onclick = () => { amt = Number(b.dataset.amt); other = ''; render(); });
    const o = DU.$('[data-other]'); if (o) o.oninput = () => { other = o.value; const pos = o.selectionStart; render(); const n = DU.$('[data-other]'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {  } };
    const nx = DU.$('[data-next]'); if (nx) nx.onclick = () => { if (amount() > 0) { step = 'pay'; render(); } };
    const bk = DU.$('[data-back]'); if (bk) bk.onclick = () => { step = 'pick'; render(); };
    const pf = DU.$('[data-payform]');
    const pay = () => { const fd = new FormData(pf); if (!fd.get('first')) { DU.toast(tr('c.required')); return; } if (!DU.isEmail(fd.get('email'))) { DU.toast(tr('c.badEmail')); return; } DU.store.addPublic('donations', { id: DU.store.uid('d'), name: `${fd.get('first')}`, email: fd.get('email'), kind: monthly ? 'Monthly' : 'One-time', amount: amount(), when: new Date().toISOString().slice(0, 10), show: !!fd.get('show') }); step = 'done'; render(); head(); };
    if (pf) { pf.onsubmit = (e) => { e.preventDefault(); pay(); }; DU.$$('[data-pay]').forEach((b) => b.onclick = pay); }
  }
  head(); render();
  DU.layout({ active: '', v2: true });
})();
