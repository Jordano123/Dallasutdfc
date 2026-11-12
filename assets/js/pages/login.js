(function () {
  if (DU.soonPage()) return;
  const tr = DU.tr, esc = DU.esc;
  const main = DU.$('#main');
  const me = DU.pref.get('account', null);
  let step = DU.param('join') ? 'new' : 'login';
  const SOC = DU.store.get().authCfg || {};
  document.body.classList.add('auth-page');

  const G = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const AP = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 4.9c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg>';
  const socials = () => {
    const b = [SOC.google !== false ? `<button type="button" class="au-soc" data-social="google">${G}<span>${DU.x('login.g', 'Continue with Google')}</span></button>` : '', SOC.apple !== false ? `<button type="button" class="au-soc au-apple" data-social="apple">${AP}<span>${DU.x('login.a', 'Continue with Apple')}</span></button>` : ''].join('');
    return b ? `<div class="au-or"><span>${DU.x('login.or', 'or')}</span></div><div class="au-socs">${b}</div>` : '';
  };
  const field = (name, label, type, extra) => `<label class="au-f"><span class="au-l">${label}</span><input name="${name}" type="${type || 'text'}" ${extra || ''}>${type === 'password' ? `<button type="button" class="au-show" data-show>${DU.x('login.show', 'Show')}</button>` : ''}</label>`;
  const bar = `<div class="au-bar"><a class="au-back" href="index.html"><span aria-hidden="true">‹</span> ${DU.x('login.back', 'Back to site')}</a><a class="au-crest" href="index.html" aria-label="Dallas United FC"><img src="${DU.CREST}" alt=""></a><span></span></div>`;
  const countries = () => (DU.COUNTRIES || [['USA', 'us']]).map(([n]) => `<option${n === (SOC.country || 'USA') ? ' selected' : ''}>${esc(n)}</option>`).join('');
  const pwOK = (p) => p.length >= 8 && p.length <= 30 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);

  function render() {
    let body;
    if (me) {
      body = `<section class="au-split"><div class="au-left"><h1 class="au-h">${DU.x('login.hi', 'Hi')}, ${esc(me.first)}</h1><p class="au-p">${DU.x('login.signedAs', 'You’re signed in as')} <strong>${esc(me.email)}</strong>.</p></div>
        <div class="au-right"><div class="au-box"><a class="au-btn" href="account.html">${DU.x('login.myAccount', 'Open My Dallas United')}</a><button type="button" class="au-link" data-out>${DU.x('login.2', 'Sign out')}</button></div></div></section>`;
    } else if (step === 'login') {
      body = `<section class="au-split"><div class="au-left"><h1 class="au-h">${DU.x('login.3', 'Sign in')}</h1>
          <p class="au-p">${DU.x('login.4b', 'Use your Dallas United account to sign in.')}</p>
          <p class="au-p">${DU.x('login.noAcc', 'If you don’t have an account yet, please')} <button type="button" class="au-inline" data-go="new">${DU.x('login.reg', 'Register now')}</button></p></div>
        <div class="au-right"><form class="au-box" novalidate data-f="login">
          ${field('email', tr('c.email'), 'email', 'autocomplete="email" required')}
          ${field('pw', DU.x('login.8', 'Password'), 'password', 'autocomplete="current-password" required')}
          <button type="button" class="au-forgot" data-forgot>${DU.x('login.forgot', 'Forgot password?')}</button>
          <button class="au-btn" type="submit" data-submit disabled>${DU.x('login.9', 'Sign in')}</button>
          <button type="button" class="au-link" data-go="new">${DU.x('login.reg', 'Register now')}</button>
          ${socials()}</form></div></section>`;
    } else {
      body = `<section class="au-col">
        <h1 class="au-h2">${DU.x('login.joinH', 'Join Dallas United for free')}</h1>
        <div class="au-intro">${String(DU.x('login.joinP', 'Create your free Dallas United account and become an official member of the club.\nOnce registered you get faster checkout in the shop, your founder card in your phone wallet, match reminders and club news.')).split('\n').filter(Boolean).map((x) => `<p>${x}</p>`).join('')}</div>
        <form class="au-reg" novalidate data-f="new">
          <p class="au-have"><button type="button" class="au-inline au-dark" data-go="login">${DU.x('login.have', 'Already have an account? Sign in.')}</button></p>
          <div class="au-narrow">
            ${field('first', tr('c.first'), 'text', 'autocomplete="given-name" required')}
            ${field('last', tr('c.last'), 'text', 'autocomplete="family-name" required')}
            ${field('bday', DU.x('login.dob', 'Date of birth'), 'date', 'autocomplete="bday"')}
            ${field('email', tr('c.email'), 'email', 'autocomplete="email" required')}
            <label class="au-f"><span class="au-l">${DU.x('login.country', 'Country of residence')}</span><select name="country">${countries()}</select></label>
          </div>
          <hr class="au-hr">
          <div class="au-two">${field('pw', DU.x('login.8', 'Password'), 'password', 'autocomplete="new-password" required')}${field('pw2', DU.x('login.pw2', 'Confirm password'), 'password', 'autocomplete="new-password" required')}</div>
          <div class="au-rules"><span class="au-i" aria-hidden="true">i</span><div><strong>${DU.x('login.rulesH', 'Your password should be')}</strong>
            <ul><li>${DU.x('login.r1', 'Between 8 and 30 characters long')}</li><li>${DU.x('login.r2', 'A mix of upper (capital) and lower case letters')}</li><li>${DU.x('login.r3', 'At least one number')}</li><li>${DU.x('login.r4', 'At least one special character (such as ! @ # $ %)')}</li></ul></div></div>
          <div class="au-more"><h2>${DU.x('login.moreH', 'Want more from Dallas United?')}</h2><p>${DU.x('login.moreP', 'Do you want to hear about the shop, matches, new signings, tickets, club news and partner offers? We never share your details with partners.')}</p>
            <div class="au-radios"><label><input type="radio" name="nl" value="yes"> ${DU.x('login.yes', 'Yes')}</label><label><input type="radio" name="nl" value="no"> ${DU.x('login.no', 'No')}</label></div></div>
          <p class="au-legal">${DU.x('login.legal', 'By registering you confirm that you have read and accept the club')} <a href="legal.html?tab=terms">${DU.x('login.terms', 'Terms and Conditions')}</a> ${DU.x('login.and', 'and')} <a href="legal.html?tab=privacy">${tr('c.privacy')}</a>.</p>
          <button class="au-btn au-red" type="submit">${DU.x('login.13', 'Register now')}</button>
          ${socials()}
        </form></section>`;
    }
    main.innerHTML = `<div class="au">${bar}${body}</div>`;
    bind();
  }

  function bind() {
    const q = (s) => DU.$(s);
    DU.$$('[data-go]').forEach((b) => { b.onclick = () => { step = b.dataset.go; history.replaceState(null, '', step === 'new' ? 'login.html?join=1' : 'login.html'); render(); scrollTo(0, 0); }; });
    DU.$$('[data-show]').forEach((b) => { b.onclick = () => { const i = b.previousElementSibling; const sh = i.type === 'password'; i.type = sh ? 'text' : 'password'; b.textContent = sh ? DU.x('login.hide', 'Hide') : DU.x('login.show', 'Show'); }; });
    if (q('[data-out]')) q('[data-out]').onclick = async () => { if (DU.fanAuth) await DU.fanAuth.signOut(); else DU.pref.set('account', null); location.reload(); };
    DU.$$('[data-social]').forEach((b) => { b.onclick = () => { if (!DU.fanAuth) { DU.toast(DU.x('login.socOff', 'Google and Apple sign-in work once the website is online with the database.')); return; } DU.fanAuth[b.dataset.social === 'apple' ? 'apple' : 'google']().then(() => { location.href = 'account.html'; }).catch((er) => DU.toast(DU.fanAuth.msg(er))); }; });
    const f = q('[data-f]'); if (!f) return;
    const sub = q('[data-submit]');
    if (sub) f.addEventListener('input', () => { sub.disabled = !(DU.isEmail(f.email.value) && f.pw.value.length >= 6); });
    if (q('[data-forgot]')) q('[data-forgot]').onclick = () => {
      const em = f.email.value.trim(); if (!DU.isEmail(em)) { DU.toast(DU.x('login.forgotE', 'Type your email first, then tap Forgot password.')); f.email.focus(); return; }
      if (!DU.fanAuth) { DU.toast(DU.x('login.forgotOff', 'Password reset works once the website is online with the database.')); return; }
      DU.fanAuth.reset(em).then(() => DU.toast(`${DU.x('login.sent', 'We sent a reset link to')} ${em}`)).catch((er) => DU.toast(DU.fanAuth.msg(er)));
    };
    f.addEventListener('submit', (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(f));
      const busy = (on) => { const b = f.querySelector('[type=submit]'); if (b) b.disabled = on; };
      if (f.dataset.f === 'login') {
        const em = String(fd.email || '').trim();
        if (DU.fanAuth) { busy(true); DU.fanAuth.signIn(em, String(fd.pw || '')).then(() => { location.href = 'account.html'; }).catch((er) => { busy(false); DU.toast(DU.fanAuth.msg(er)); }); return; }
        const fan = (DU.store.get().fans || []).find((x) => String(x.email).toLowerCase() === em.toLowerCase());
        const known = DU.pref.get('knownEmails', []).map((x) => String(x).toLowerCase()).includes(em.toLowerCase());
        if (!fan && !known) { DU.toast(DU.x('login.noUser', 'No account with that email yet. Register now.')); return; }
        DU.pref.set('account', { first: fan ? fan.first : em.split('@')[0], email: em }); location.href = 'account.html'; return;
      }
      if (!fd.first || !fd.last || !DU.isEmail(fd.email)) { DU.toast(tr('c.required')); return; }
      if (!pwOK(String(fd.pw || ''))) { DU.toast(DU.x('login.pwBad', 'Your password doesn’t follow the rules in the box.')); return; }
      if (fd.pw !== fd.pw2) { DU.toast(DU.x('login.pwSame', 'The two passwords are not the same.')); return; }
      const news = fd.nl === 'yes';
      const extra = { bday: fd.bday || '', country: fd.country || '' };
      if (DU.fanAuth) { busy(true); DU.fanAuth.signUp(fd.first.trim(), fd.last.trim(), fd.email.trim(), fd.pw, news, extra).then(() => { location.href = 'account.html'; }).catch((er) => { busy(false); DU.toast(DU.fanAuth.msg(er)); }); return; }
      DU.pref.set('knownEmails', [...DU.pref.get('knownEmails', []), fd.email.trim()]);
      DU.pref.set('account', { first: fd.first.trim(), email: fd.email.trim() });
      if (!(DU.store.get().fans || []).some((x) => String(x.email).toLowerCase() === fd.email.trim().toLowerCase())) DU.store.addPublic('fans', { id: DU.store.uid('fan'), first: fd.first.trim(), last: fd.last.trim(), email: fd.email.trim(), phone: '', hood: '', bday: extra.bday, country: extra.country, size: '', fav: '', tv: '', support: 0, news, notif: { email: news, goals: true, bday: true, merch: true, partners: false }, joined: new Date().toISOString().slice(0, 10) });
      DU.toast(`${DU.x('login.welcome', 'Welcome')}, ${fd.first.trim()}!`); setTimeout(() => { location.href = 'account.html'; }, 800);
    });
  }
  render();
  DU.layout({ active: '', footer: false });
})();
