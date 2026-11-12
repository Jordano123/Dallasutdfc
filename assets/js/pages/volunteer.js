(function () {
  const d = DU.store.get(), t = DU.t, esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  const roles = d.roles.filter((r) => r.open);
  const picked = new Set(roles.length ? [roles[0].id] : []);
  main.innerHTML = `
  <section class="hero"><div class="hero-media"><img class="zoom" src="${DU.esc(DU.pic('volunteer.hero', 'assets/img/community.jpg'))}" alt=""></div><div class="hero-shade"></div>
    <div class="container hero-inner"><span class="eyebrow">${DU.x('volunteer.1', 'Volunteer · No experience needed')}</span><h1 class="display" style="font-size:clamp(60px,11vw,168px);line-height:.86">${DU.x('volunteer.2', 'Join')}<br>the crew</h1><p class="lead">${DU.x('volunteer.3', 'Dallas United is built by its people. Give a few hours on matchday and be part of the club from the inside.')}</p><div class="row"><a class="btn btn-gold" href="#join">Sign up to help ${DU.icon('arrow')}</a></div></div></section>
  <section class="bg-white reveal"><div class="container section-tight grid-fit" style="--min:220px;--gap:28px">${[['01', DU.x('volunteer.a1', 'Free entry'), DU.x('volunteer.a2', 'Free entry to every match you help at, plus a free entry for a friend each season.')], ['02', DU.x('volunteer.a3', 'Crew shirt'), DU.x('volunteer.a4', 'An official crew shirt you can only get by volunteering.')], ['03', DU.x('volunteer.a5', 'Meet the squad'), DU.x('volunteer.a6', 'End-of-season party with the players and staff.')], ['04', DU.x('volunteer.a7', 'Count it'), DU.x('volunteer.a8', 'Volunteer hours letter for school, college or your résumé.')]].map(([n, h, p]) => `<div class="perk"><span class="steps-num">${n}</span><strong style="font-size:20px">${h}</strong><span class="text">${p}</span></div>`).join('')}</div></section>
  <section class="container section reveal"><h2 class="serif h2">${DU.x('volunteer.4', 'Pick your role')}</h2><p class="lead text" style="margin:8px 0 26px">${DU.x('volunteer.5', 'Tap the ones you’d like. You can pick more than one.')}</p><div class="grid" style="--min:280px" data-roles></div></section>
  <section id="join" class="bg-navy"><div class="container section" data-box>
    <form class="stack on-dark" style="--gap:16px" novalidate data-f><h2 class="display h2">${DU.x('volunteer.6', 'Sign up to help')}</h2><span class="gold bold" data-picked></span>
      <div class="form-grid"><label class="field">${tr('c.first')} *<input name="first" required autocomplete="given-name"></label><label class="field">${tr('c.last')} *<input name="last" required autocomplete="family-name"></label></div>
      <div class="form-grid"><label class="field">${tr('c.email')} *<input name="email" type="email" required autocomplete="email"></label><label class="field">${tr('c.phone')}<input name="phone" type="tel" autocomplete="tel"></label></div>
      <fieldset style="border:none;margin:0;padding:0"><legend class="bold small" style="margin-bottom:10px">${DU.x('volunteer.7', 'When can you help?')}</legend><div class="row" style="--gap:10px">${['Home matchdays', 'Away matchdays', 'Weekday evenings', 'Weekends'].map((x) => `<label class="check" style="background:var(--navy-2);border-radius:999px;padding:10px 16px;align-items:center"><input type="checkbox" name="when" value="${x}"> ${x}</label>`).join('')}</div></fieldset>
      <label class="field">${DU.x('volunteer.8', 'Anything we should know? (optional)')}<textarea name="note" placeholder="Skills, languages, camera gear…"></textarea></label>
      ${(d.waivers || []).length ? `<details class="vol-waiver"><summary>${DU.x('volunteer.wSum', 'Read the volunteer waiver and agreements')}</summary>${(d.waivers || []).map((w) => `<div class="stack" style="--gap:4px"><strong>${esc(t(w.title))}</strong><div class="tw-legal" tabindex="0">${esc(t(w.body)).split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('')}</div></div>`).join('')}</details>
      <label class="check" style="color:#DCE4F2"><input type="checkbox" name="waiver" required> ${DU.x('volunteer.wOk', 'I have read and agree to the waiver and agreements above.')}</label>
      <label class="field">${DU.x('volunteer.sign', 'Electronic signature: type your full name *')}<input name="sign" autocomplete="off" required style="font-family:'Brush Script MT','Segoe Script',cursive;font-size:22px"></label>` : ''}
      <label class="check" style="color:#DCE4F2"><input type="checkbox" name="ok" required> I’m 18 or over, or I’ll bring a parent’s permission. I agree to the <a class="link" href="legal.html?tab=privacy">${tr('c.privacy')}</a>.</label>
      <button class="btn btn-gold" type="submit" style="align-self:flex-start">${DU.x('volunteer.9', 'Send my sign-up')}</button></form></div></section>`;
  function renderRoles() {
    DU.$('[data-roles]').innerHTML = roles.map((r) => { const on = picked.has(r.id); return `<button type="button" class="lift" data-role="${r.id}" aria-pressed="${on}" style="text-align:left;background:${on ? 'var(--navy)' : '#fff'};color:${on ? '#fff' : 'var(--ink)'};border:3px solid ${on ? 'var(--gold)' : '#fff'};border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:10px;min-height:200px"><span class="row between" style="width:100%"><span style="font-size:30px" aria-hidden="true">${esc(r.icon || '⭐')}</span><span class="badge ${on ? 'badge-gold' : ''}" style="${on ? '' : 'background:var(--line-2)'}">${on ? '✓ Picked' : 'Tap to pick'}</span></span><strong class="display" style="font-size:28px">${esc(t(r.name))}</strong><span style="line-height:1.5;opacity:.85">${esc(t(r.text))}</span><span class="small bold" style="margin-top:auto;color:${on ? 'var(--gold)' : 'var(--blue)'}">${esc(r.when)}</span></button>`; }).join('');
    DU.$$('[data-role]').forEach((b) => b.addEventListener('click', () => { const id = b.dataset.role; if (picked.has(id)) picked.delete(id); else picked.add(id); renderRoles(); }));
    const names = roles.filter((r) => picked.has(r.id)).map((r) => t(r.name));
    const pk = DU.$('[data-picked]'); if (pk) pk.textContent = names.length ? `You picked: ${names.join(', ')}` : 'Pick at least one role above';
  }
  renderRoles();
  DU.$('[data-f]').addEventListener('submit', (e) => {
    e.preventDefault(); const f = e.target; const fd = new FormData(f);
    if (!fd.get('first') || !fd.get('last') || !fd.get('ok')) { DU.toast(tr('c.required')); return; }
    if (!DU.isEmail(fd.get('email'))) { DU.toast(tr('c.badEmail')); return; }
    if (!picked.size) { DU.toast('Pick at least one role.'); return; }
    if ((d.waivers || []).length) { const nm = `${fd.get('first')} ${fd.get('last')}`.toLowerCase().replace(/\s+/g, ' ').trim(); if (!fd.get('waiver')) { DU.toast(DU.x('volunteer.needW', 'Tick the box to agree to the waiver.')); return; } if (String(fd.get('sign') || '').toLowerCase().replace(/\s+/g, ' ').trim() !== nm) { DU.toast(DU.x('volunteer.needSign', 'Sign by typing your full name, the same as above.')); return; } }
    const names = roles.filter((r) => picked.has(r.id)).map((r) => t(r.name)).join(', ');
    DU.store.addPublic('volunteers', { id: DU.store.uid('vo'), name: `${fd.get('first')} ${fd.get('last')}`, email: fd.get('email'), phone: fd.get('phone') || '', roles: names, when: fd.getAll('when').join(', ') || 'Any time', note: fd.get('note') || '', signedAs: fd.get('sign') || '', signedAt: new Date().toISOString(), status: 'New' });
    DU.$('[data-box]').innerHTML = `<div class="stack" role="status" style="--gap:16px"><span style="font-size:52px" aria-hidden="true">🙌</span><h2 class="display h2">Welcome to the crew, ${esc(fd.get('first'))}</h2><p class="lead" style="color:#DCE4F2">We’ll email you within a few days with the next matchday and where to meet. Your roles: <strong style="color:#fff">${esc(names)}</strong>.</p><a class="link" href="matches.html">${DU.x('volunteer.10', 'See the next home matches →')}</a></div>`;
  });
  DU.layout({ active: '', v2: true });
})();
