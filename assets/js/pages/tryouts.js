(function () {
  const d = DU.store.get(), t = DU.t, esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  const T = d.tryTexts;
  const sessions = [...d.sessions].sort((a, b) => DU.dt(a.date, a.time) - DU.dt(b.date, b.time));
  const FEE = Number(T.fee || 0);
  const WAIVERS = T.waiverOn === false ? [] : (d.waivers || []);
  const sessEvent = (s) => DU.calEvent('Dallas United open tryout', DU.dt(s.date, s.time), 180, s.place, 'Bring cleats, shin guards, water and photo ID.');

  main.innerHTML = `
  <section class="hero">
    <div class="hero-media"><img class="zoom" src="${esc(T.heroImg)}" alt=""></div><div class="hero-shade"></div>
    <div class="container hero-inner">
      <span class="eyebrow">${T.open ? '● Registration open' : 'Registration closed'} · ${T.minAge}+</span>
      <h1 class="display">${DU.x('try.h1', 'Open tryouts')}</h1>
      <p class="lead">${esc(t(T.intro))}</p>
      <div class="row"><a class="btn btn-gold" href="#register">Register now ${DU.icon('arrow')}</a></div>
    </div>
  </section>

  <section class="container section reveal">
    <div class="grid-fit" style="--min:240px;--gap:32px">${d.steps.map((s) => `<div class="perk"><span class="steps-num">${esc(s.n)}</span><strong style="font-size:22px">${esc(t(s.title))}</strong><span class="text">${esc(t(s.text))}</span></div>`).join('')}</div>
  </section>

  <section class="bg-white reveal">
    <div class="container section-tight stack" style="--gap:22px">
      <h2 class="serif h2">${DU.x('tryouts.1', 'Sessions')}</h2>
      <div class="grid-fit" style="--min:280px">${sessions.map((s) => { const left = Math.max(0, s.cap - s.signed); return `<div class="card card-pad stack" style="--gap:10px;background:var(--cream)"><span class="eyebrow">${esc(DU.fmtDay(s.date, true))}</span><strong class="display" style="font-size:34px">${esc(DU.fmtTime(s.time))}</strong><span class="text">${esc(s.place)}</span><div class="progress" style="background:var(--line)"><div style="width:${Math.min(100, Math.round(100 * s.signed / s.cap))}%;background:${left < 10 ? 'var(--red)' : 'var(--blue)'}"></div></div><span class="small bold ${left < 10 ? '' : 'muted'}" style="${left < 10 ? 'color:var(--red)' : ''}">${left ? `${left} spots left` : 'Full'}</span><div class="row" style="--gap:8px"><a class="btn btn-sm btn-navy" href="#register" data-pick="${s.id}">${DU.x('tryouts.2', 'Pick this session')}</a>${DU.calButton(sessEvent(s))}</div></div>`; }).join('')}</div>
    </div>
  </section>

  <section id="register" class="bg-navy">
    <div class="container section tw-wrap">
      <aside class="tw-info stack" style="--gap:16px">
        <span class="eyebrow">${DU.x('tryouts.3', 'Register')}</span>
        <h2 class="display h2">${DU.x('tryouts.regH', 'Player tryout registration')}</h2>
        <dl class="tw-facts">
          <div><dt>${DU.x('tryouts.fDates', 'Dates')}</dt><dd>${sessions.map((s) => esc(DU.fmtDay(s.date))).join(' · ') || '–'}</dd></div>
          <div><dt>${DU.x('tryouts.fVenue', 'Venue')}</dt><dd>${esc(T.venue || (sessions[0] || {}).place || '')}</dd></div>
          <div><dt>${DU.x('tryouts.fFee', 'Registration fee')}</dt><dd>${FEE ? `${DU.money(FEE)} <span class="tw-nr">(${DU.x('tryouts.nonRef', 'non-refundable')})</span>` : DU.x('tryouts.free', 'Free')}</dd></div>
          <div><dt>${DU.x('tryouts.fAge', 'Age')}</dt><dd>${esc(t(T.ageText) || `${T.minAge} and older`)}</dd></div>
        </dl>
        <div><strong class="tw-bring-h">${DU.x('tryouts.6', 'What to bring:')}</strong><ul class="tw-bring">${d.bring.map((b) => `<li>${esc(t(b.text))}</li>`).join('')}</ul></div>
      </aside>
      <div class="tw" data-tw>${T.open ? '' : `<div class="tw-body"><p class="lead">${DU.x('tryouts.closed', 'Registration is closed right now. Follow us to hear about the next tryouts.')}</p></div>`}</div>
    </div>
  </section>

  <section class="container section reveal"><h2 class="serif h2" style="margin-bottom:16px">${tr('c.questions')}</h2>
    ${d.faq.map((q, i) => `<div class="faq-item"><button type="button" aria-expanded="${i === 0}" data-faq><span style="color:var(--ink);font-size:18px">${esc(t(q.q))}</span><span aria-hidden="true">${i === 0 ? '−' : '+'}</span></button><p ${i === 0 ? '' : 'hidden'}>${esc(t(q.a))}</p></div>`).join('')}
  </section>`;

  DU.$$('[data-faq]').forEach((b) => b.addEventListener('click', () => { const p = b.nextElementSibling; const open = p.hidden; p.hidden = !open; b.setAttribute('aria-expanded', String(open)); b.lastElementChild.textContent = open ? '−' : '+'; }));
  const box = DU.$('[data-tw]');
  const STEPS = [DU.x('tryouts.sW', 'Welcome'), DU.x('tryouts.sI', 'Player information'), ...(WAIVERS.length ? [DU.x('tryouts.sA', 'Waivers & agreements')] : []), DU.x('tryouts.sR', 'Review'), DU.x('tryouts.sC', 'Confirmation')];
  const K = { welcome: 0, info: 1, waiver: WAIVERS.length ? 2 : -1, review: WAIVERS.length ? 3 : 2, done: WAIVERS.length ? 4 : 3 };
  const open = sessions.filter((s) => s.signed < s.cap);
  const R = { step: 0, session: (open[0] || {}).id || '', first: '', last: '', email: '', phone: '', dob: '', home: '', pos: '', pos2: '', exp: '', club: '', agree: {}, sign: '', gName: '', gSign: '', eName: '', eRel: '', ePhone: '' };
  const POS = [DU.x('tryouts.10', 'Goalkeeper'), DU.x('tryouts.11', 'Defender'), DU.x('tryouts.12', 'Midfielder'), DU.x('tryouts.13', 'Forward')];
  const full = () => `${R.first} ${R.last}`.trim();
  const age = () => (R.dob ? (Date.now() - new Date(`${R.dob}T12:00:00`)) / 31557600000 : 99);
  const minor = () => age() < 18;
  const sess = () => sessions.find((s) => s.id === R.session);
  const who = () => (full() ? `<div class="tw-who"><span class="tw-ava" aria-hidden="true">${esc((R.first[0] || '').toUpperCase())}${esc((R.last[0] || '').toUpperCase())}</span>${DU.x('tryouts.who', 'Currently registering:')} <strong>${esc(full())}</strong></div>` : '');
  const field = (name, label, attrs) => `<label class="field">${label}<input name="${name}" value="${esc(R[name])}" ${attrs || ''}></label>`;
  const sel = (name, label, opts, extra) => `<label class="field">${label}<select name="${name}" class="input"><option value="">${DU.x('tryouts.9', 'Choose')}</option>${opts.map((o) => `<option${R[name] === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}${extra || ''}</select></label>`;

  function progress() {
    return `<ol class="tw-steps" aria-label="${DU.x('tryouts.progress', 'Registration steps')}">${STEPS.map((l, i) => `<li class="${i < R.step ? 'is-done' : i === R.step ? 'is-on' : ''}"${i === R.step ? ' aria-current="step"' : ''}><span>${i < R.step ? '✓' : i + 1}</span>${esc(l)}</li>`).join('')}</ol>`;
  }
  function body() {
    const st = R.step;
    if (st === K.welcome) return `<h3 class="tw-h">${DU.x('tryouts.wH', 'Welcome')}</h3>
      <p>${esc(t(T.intro))}</p>
      <fieldset class="tw-sess"><legend>${DU.x('tryouts.14', 'Session *')}</legend>${sessions.map((s) => { const isFull = s.signed >= s.cap; return `<label class="tw-opt${isFull ? ' is-full' : ''}"><input type="radio" name="session" value="${s.id}"${R.session === s.id ? ' checked' : ''}${isFull ? ' disabled' : ''}><span><strong>${esc(DU.fmtDay(s.date, true))} · ${esc(DU.fmtTime(s.time))}</strong><small>${esc(s.place)} · ${isFull ? DU.x('tryouts.full', 'Full') : `${s.cap - s.signed} ${DU.x('tryouts.left', 'spots left')}`}</small></span></label>`; }).join('')}</fieldset>
      <p class="small muted">${DU.x('tryouts.wNote', 'Registering takes about five minutes. You will add your details, read and sign the waivers, then check everything before you send it.')}</p>`;
    if (st === K.info) return `${who()}<h3 class="tw-h">${DU.x('tryouts.iH', 'Player information')}</h3>
      <div class="form-grid">${field('first', `${tr('c.first')} *`, 'required autocomplete="given-name" data-who')}${field('last', `${tr('c.last')} *`, 'required autocomplete="family-name" data-who')}</div>
      <div class="form-grid">${field('email', `${tr('c.email')} *`, 'type="email" required autocomplete="email"')}${field('phone', `${DU.x('tryouts.phone', 'Phone number *')}`, 'type="tel" required autocomplete="tel" inputmode="tel"')}</div>
      <fieldset class="try-emerg"><legend class="bold">${DU.x('tryouts.emH', 'Emergency contact')}</legend><p class="small muted" style="margin:0 0 10px">${DU.x('tryouts.emT', 'Someone we can call if you get hurt during the tryout.')}</p>
      <div class="form-grid">${field('eName', `${DU.x('tryouts.emName', 'Full name')} *`, 'required autocomplete="off"')}${field('eRel', `${DU.x('tryouts.emRel', 'Relationship (e.g. mother, partner)')} *`, 'required autocomplete="off"')}${field('ePhone', `${DU.x('tryouts.emPhone', 'Phone number')} *`, 'type="tel" required inputmode="tel" autocomplete="off"')}</div></fieldset>
      <div class="form-grid">${field('dob', DU.x('tryouts.7', 'Date of birth *'), `type="date" required max="${new Date().toISOString().slice(0, 10)}"`)}${field('home', DU.x('tryouts.home', 'Hometown (city, state or country) *'), 'required placeholder="Dallas, TX"')}</div>
      <div class="form-grid">${sel('pos', DU.x('tryouts.pos1', 'Primary position *'), POS)}${sel('pos2', DU.x('tryouts.pos2', 'Secondary position (optional)'), POS, `<option${R.pos2 === 'N/A' ? ' selected' : ''}>N/A</option>`)}</div>
      ${field('club', DU.x('tryouts.15', 'Where do you play now? (optional)'), 'placeholder="Club, league or pickup"')}
      <label class="field">${DU.x('tryouts.exp', 'Your experience and soccer history, including other clubs *')}<textarea name="exp" rows="4" class="input" required placeholder="${DU.x('tryouts.expPh', 'Clubs, leagues, school or college teams, years played')}">${esc(R.exp)}</textarea></label>`;
    if (st === K.waiver) return `${who()}<h3 class="tw-h">${DU.x('tryouts.aH', 'Waivers & agreements')}</h3>
      <p class="small muted">${DU.x('tryouts.aP', 'Please read each agreement. Tick to agree, then sign by typing your full name.')}</p>
      ${WAIVERS.map((w) => `<div class="tw-waiver"><strong>${esc(t(w.title))}</strong><div class="tw-legal" tabindex="0">${esc(t(w.body)).split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('')}</div>
        <label class="check"><input type="checkbox" data-agree="${w.id}"${R.agree[w.id] ? ' checked' : ''}> ${DU.x('tryouts.iAgree', 'I have read and agree to the')} ${esc(t(w.title).toLowerCase())}.</label></div>`).join('')}
      <div class="tw-sign"><label class="field">${DU.x('tryouts.sign', 'Electronic signature: type your full name *')}<input name="sign" value="${esc(R.sign)}" autocomplete="off" placeholder="${esc(full())}"></label>
        <span class="small muted">${DU.x('tryouts.signNote', 'Typing your name here is your legal signature for all of the agreements above.')} ${esc(DU.fmtDate(new Date().toISOString().slice(0, 10)))}</span></div>
      ${minor() ? `<div class="tw-sign"><strong>${DU.x('tryouts.minor', 'Players under 18: a parent or legal guardian must also sign')}</strong><div class="form-grid">${field('gName', DU.x('tryouts.gName', 'Parent / guardian full name *'))}${field('gSign', DU.x('tryouts.gSign', 'Parent / guardian signature (type their name) *'), 'autocomplete="off"')}</div></div>` : ''}`;
    if (st === K.review) {
      const s = sess();
      const rows = [[DU.x('tryouts.rS', 'Session'), s ? `${DU.fmtDay(s.date, true)} · ${DU.fmtTime(s.time)} · ${s.place}` : '', K.welcome], [DU.x('tryouts.rN', 'Name'), full(), K.info], [tr('c.email'), R.email, K.info], [DU.x('tryouts.rP', 'Phone'), R.phone, K.info], [DU.x('tryouts.rE', 'Emergency contact'), `${R.eName} (${R.eRel}) · ${R.ePhone}`, K.info], [DU.x('tryouts.rD', 'Date of birth'), DU.fmtDate(R.dob), K.info], [DU.x('tryouts.rH', 'Hometown'), R.home, K.info], [DU.x('tryouts.rPos', 'Positions'), [R.pos, R.pos2 && R.pos2 !== 'N/A' ? R.pos2 : ''].filter(Boolean).join(' · '), K.info], [DU.x('tryouts.rC', 'Current club'), R.club || '–', K.info], [DU.x('tryouts.rE', 'Experience'), R.exp, K.info]];
      if (WAIVERS.length) rows.push([DU.x('tryouts.rW', 'Waivers'), `${DU.x('tryouts.rSigned', 'Signed by')} ${R.sign}${minor() ? ` · ${DU.x('tryouts.rG', 'guardian')}: ${R.gSign}` : ''}`, K.waiver]);
      return `${who()}<h3 class="tw-h">${DU.x('tryouts.rvH', 'Review')}</h3><p class="small muted">${DU.x('tryouts.rvP', 'Check your details. Tap Edit to change anything.')}</p>
        <dl class="tw-review">${rows.map(([k, v, go]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd><button type="button" class="tw-edit" data-go="${go}">${DU.x('tryouts.edit', 'Edit')}</button></div>`).join('')}</dl>
        <div class="tw-total"><span>${DU.x('tryouts.fFee', 'Registration fee')}</span><strong>${FEE ? DU.money(FEE) : DU.x('tryouts.free', 'Free')}</strong></div>
        ${FEE ? `<p class="small muted">${esc(t(T.feeNote) || '')} ${DU.x('tryouts.nonRef2', 'The fee is non-refundable.')}</p>` : ''}`;
    }
    const s = sess();
    return `<div class="tw-done" role="status"><span class="tw-check" aria-hidden="true">✓</span><h3 class="tw-h">${DU.x('tryouts.dH', 'You’re registered,')} ${esc(R.first)}</h3>
      <p>${s ? `${esc(DU.fmtDay(s.date, true))} ${DU.x('tryouts.at', 'at')} ${esc(DU.fmtTime(s.time))}, ${esc(s.place)}.` : ''} ${DU.x('tryouts.dP', 'We have sent the details to')} ${esc(R.email)}.</p>
      ${s ? `<div class="row">${DU.calButton(sessEvent(s), tr('c.addCal'), 'btn btn-gold')}</div>` : ''}
      <p class="small muted">${DU.x('tryouts.dBring', 'Bring a photo ID, your boots, shin guards and water. Arrive 30 minutes early to check in.')}</p></div>`;
  }
  function nav() {
    if (R.step === K.done) return '';
    const back = R.step > 0 ? `<button type="button" class="btn btn-outline" data-back>${DU.x('tryouts.back', 'Back')}</button>` : '<span></span>';
    const next = R.step === K.review ? `<button type="button" class="btn btn-gold" data-next>${FEE ? `${DU.x('tryouts.submitFee', 'Register')} · ${DU.money(FEE)}` : DU.x('tryouts.16', 'Register for the tryout')}</button>` : `<button type="button" class="btn btn-navy" data-next>${DU.x('tryouts.cont', 'Continue')} ${DU.icon('arrow')}</button>`;
    return `<div class="tw-nav">${back}${next}</div>`;
  }
  function save() {
    DU.$$('input[name], select[name], textarea[name]', box).forEach((el) => { if (el.type === 'radio') { if (el.checked) R[el.name] = el.value; } else R[el.name] = el.value.trim(); });
    DU.$$('[data-agree]', box).forEach((c) => { R.agree[c.dataset.agree] = c.checked; });
  }
  function check() {
    const st = R.step;
    if (st === K.welcome && !R.session) return DU.x('tryouts.needS', 'Pick a session.');
    if (st === K.info) {
      if (!R.first || !R.last || !R.phone || !R.dob || !R.home || !R.pos || !R.exp) return tr('c.required');
      if (!DU.isEmail(R.email)) return tr('c.badEmail');
      if (R.phone.replace(/\D/g, '').length < 10) return DU.x('tryouts.badPhone', 'Enter a phone number with area code.');
      if (!R.eName || !R.eRel || !R.ePhone) return DU.x('tryouts.needEm', 'Add an emergency contact: name, relationship and phone.');
      if (R.ePhone.replace(/\D/g, '').length < 10) return DU.x('tryouts.badEm', 'Enter the emergency contact’s phone with area code.');
      if (age() < T.minAge) return `${DU.x('tryouts.ageA', 'Tryouts are for players')} ${T.minAge} ${DU.x('tryouts.ageB', 'and over.')}`;
    }
    if (st === K.waiver) {
      if (WAIVERS.some((w) => !R.agree[w.id])) return DU.x('tryouts.needAgree', 'Tick each agreement to continue.');
      const norm = (v) => String(v || '').toLowerCase().replace(/\s+/g, ' ').trim();
      if (norm(R.sign) !== norm(full())) return `${DU.x('tryouts.needSign', 'Sign by typing your full name exactly:')} ${full()}`;
      if (minor() && (!R.gName || norm(R.gSign) !== norm(R.gName))) return DU.x('tryouts.needG', 'A parent or guardian must type their full name to sign.');
    }
    return '';
  }
  function submit() {
    const s = sess(); const now = new Date().toISOString();
    const rec = { id: DU.store.uid('su'), name: full(), email: R.email, phone: R.phone, dob: R.dob, home: R.home, pos: R.pos, pos2: R.pos2 && R.pos2 !== 'N/A' ? R.pos2 : '', exp: R.exp, club: R.club, emergency: { name: R.eName, rel: R.eRel, phone: R.ePhone }, session: R.session, when: now.slice(0, 10), fee: FEE, paid: FEE ? 'Due' : 'Free',
      waivers: WAIVERS.map((w) => ({ id: w.id, title: t(w.title) })), signedAs: R.sign, signedAt: now, ...(minor() ? { guardian: R.gName, guardianSigned: R.gSign } : {}) };
    DU.store.addPublic('signups', rec, (dd) => { dd.signups = [rec, ...(dd.signups || [])]; const ss = dd.sessions.find((x) => x.id === R.session); if (ss) ss.signed += 1; });
    if (s) s.signed += 1;
  }
  function draw(focus) {
    box.innerHTML = `${progress()}<form class="tw-body" novalidate data-tw-form>${body()}</form>${nav()}`;
    DU.$$('[data-who]', box).forEach((i) => i.addEventListener('input', () => { save(); }));
    const n = DU.$('[data-next]', box); if (n) n.addEventListener('click', go);
    const b = DU.$('[data-back]', box); if (b) b.addEventListener('click', () => { save(); R.step -= 1; draw(true); });
    DU.$$('[data-go]', box).forEach((e) => e.addEventListener('click', () => { R.step = Number(e.dataset.go); draw(true); }));
    DU.$('[data-tw-form]', box).addEventListener('submit', (e) => { e.preventDefault(); go(); });
    if (focus) { window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' }); const h = DU.$('.tw-h', box); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }
  function go() {
    save(); const err = check(); if (err) { DU.toast(err); return; }
    if (R.step === K.review) { submit(); }
    R.step += 1; draw(true);
  }
  if (T.open) draw(false);
  DU.$$('[data-pick]').forEach((a) => a.addEventListener('click', () => { if (!T.open) return; R.session = a.dataset.pick; if (R.step === K.welcome) draw(false); }));
  DU.layout({ active: 'tryouts', v2: true });
})();
