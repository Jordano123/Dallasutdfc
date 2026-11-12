(function () {
  const d = DU.store.get(), esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  const S = d.settings;
  const PAGES = {
    privacy: ['Privacy policy', 'This explains what information Dallas United FC collects when you use our website, why we collect it, and the choices you have.', [
      ['What we collect', `Information you give us: your name and email when you join the newsletter, become a founder, sign up for tryouts, ${DU.on('volunteer') ? 'volunteer ' : ''}or create an account; your delivery address when you buy from the shop; messages you send through our forms; your birthday if you choose to share it.\nInformation collected automatically: basic device and usage information through cookies (see the Cookie policy).`],
      ['How we use it', 'To run your account, process orders, register you for tryouts, send the club newsletter if you asked for it, show your name on the Founders Wall if you chose that, send birthday and anniversary messages, answer your questions, and improve the website.'],
      ['Payments', 'Card payments are handled by our payment provider (Stripe). We never see or store your full card number.'],
      ['Who we share it with', 'Only with services that help us run the club and website: payment processing, email newsletters (Mailchimp) and website hosting. We do not sell your personal information.'],
      ['How long we keep it', 'As long as your account is active or as needed to provide the service, and as required for tax and accounting records.'],
      ['Your choices and rights', `You can unsubscribe from emails with the link in every email, update or delete your account, ask to be removed from the Founders Wall, or ask for a copy of your data by emailing privacy@dallasunitedfc.com.`],
      ['Children', 'Our website is not aimed at children under 13 and we do not knowingly collect their information. Tryouts are for players 18 and over.'],
      ['Contact', `${S.clubName} · ${S.address} · privacy@dallasunitedfc.com`]]],
    terms: ['Terms of use', 'By using this website you agree to these terms. Please read them.', [
      ['Using the website', 'You may use the website for personal, non-commercial purposes. Do not misuse it, try to break it, or access accounts that are not yours.'],
      ['Your account', 'Keep your login details safe. You are responsible for activity on your account. We may close accounts that break these terms.'],
      ['Content you send', 'If you submit content (for example a name on the Founders Wall or a question for the squad), you confirm it is accurate and not offensive. We may remove anything inappropriate.'],
      ['Club content', 'Logos, photos, videos and text on this website belong to Dallas United FC or its partners. Please do not copy them without permission.'],
      ['DU TV and donations', 'DU TV passes and monthly support renew monthly until cancelled.'],
      ['Changes', 'We may update these terms. The date at the top shows the latest version.'],
      ['Governing law', 'These terms are governed by the laws of the State of Texas.']]],
    cookies: ['Cookie policy', 'Cookies are small files saved on your device. Here is what we use and why.', [
      ['Necessary cookies', 'Always on. They keep you signed in, remember what’s in your bag and save your cookie choices.'],
      ['Preference cookies', 'Remember your language (English or Español).'],
      ['Analytics cookies', 'Optional. Help us see which pages are popular so we can improve the website. Only used if you say yes.'],
      ['Marketing cookies', 'Optional. Help us measure our ads and sponsor campaigns. Only used if you say yes.'],
      ['Your choice', 'When you first visit, you choose Accept all, Only necessary, or pick for yourself. You can change this anytime from “Cookie settings” at the bottom of every page.']]],
    shop: ['Shipping & returns', 'Everything you need to know about orders from the official store.', [
      ['Delivery', `Standard delivery in the US takes 3–5 business days and is free on orders over $${d.shopTexts.freeShipOver} (otherwise $6).`],
      ['Returns', 'We are a new club with a small shop, so we are not able to take returns for now. If something is wrong with your order, see below and we will make it right.'],
      ['Personalised items', 'Jerseys printed with a name and number are made for you and can’t be returned unless they arrive damaged or with a mistake.'],
      ['Damaged or wrong items', 'Contact us within 7 days with a photo and we’ll send a replacement at no cost.']]],
    access: ['Accessibility', 'We want every Dallas United fan to be able to use this website, whatever device or ability they have.', [
      ['What we do', 'Text and buttons have strong colour contrast.\nEvery picture has a description for screen readers.\nThe whole site works with a keyboard.\nText can be made twice as big without breaking the page.\nButtons are big enough to tap easily on a phone.\nAnimations stop if your device is set to reduce motion.'],
      ['Languages', 'The website is available in English and Español. Use the flag button at the top of any page to switch.'],
      ['Video', 'We add captions to DU TV videos wherever we can.'],
      ['At our matches', 'If you need help getting to or around our home field, email us before the match and we will do our best to have everything ready.'],
      ['Something not working?', 'Email access@dallasunitedfc.com and tell us the page. We aim to fix it within two weeks.']]]
  };
  const OPEN = Object.keys(PAGES).filter((k) => DU.legalOn(k));
  let tab = OPEN.includes(DU.param('tab')) ? DU.param('tab') : (OPEN[0] || 'privacy');
  function render() {
    const [title, intro, sections] = PAGES[tab];
    main.innerHTML = `<section class="page-head"><div class="container stack" style="--gap:18px"><h1 class="display" style="font-size:clamp(44px,7vw,80px)">${DU.x('legal.1', 'Legal &amp; privacy')}</h1>
      <div class="tabs" role="tablist" style="overflow-x:auto;flex-wrap:nowrap">${Object.entries(PAGES).filter(([k]) => OPEN.includes(k) || k === tab).map(([k, v]) => `<button type="button" class="tab" role="tab" data-tab="${k}" aria-selected="${k === tab}" style="white-space:nowrap">${v[0]}</button>`).join('')}</div></div></section>
      <section class="container section-tight row" style="align-items:flex-start;--gap:40px">
        <nav aria-label="On this page" class="stack" style="flex:1 1 220px;--gap:10px;border-left:3px solid var(--gold);padding-left:16px"><span class="tiny bold muted" style="text-transform:uppercase;letter-spacing:.1em">${DU.x('legal.2', 'On this page')}</span>${sections.map((s, i) => `<a href="#s${i}" style="font-weight:600;text-decoration:none">${esc(s[0])}</a>`).join('')}</nav>
        <article class="stack text" style="flex:3 1 480px;min-width:0;max-width:720px;--gap:26px;line-height:1.7">
          <div class="stack" style="--gap:6px"><h2 class="serif" style="font-size:clamp(34px,5vw,48px);color:var(--ink)">${title}</h2><span class="small muted">Last updated 1 November 2026 · Questions? <a class="link" href="mailto:privacy@dallasunitedfc.com">privacy@dallasunitedfc.com</a></span></div>
          <p class="lead" style="color:var(--ink)">${esc(intro)}</p>
          ${sections.map((s, i) => `<section id="s${i}" class="stack" style="--gap:8px"><h3 style="font-size:20px;color:var(--ink)">${esc(s[0])}</h3><p style="white-space:pre-line">${esc(s[1])}</p></section>`).join('')}
          ${tab === 'cookies' ? `<div class="card card-pad row between" style="background:var(--white)"><strong>${DU.x('legal.3', 'Change your cookie choices at any time.')}</strong><button type="button" class="btn btn-navy btn-sm" data-ck>${tr('f.cookieSettings')}</button></div>` : ''}
        </article></section>`;
    DU.$$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; history.replaceState(null, '', `?tab=${tab}`); render(); }));
    const ck = DU.$('[data-ck]'); if (ck) ck.addEventListener('click', () => DU.openCookies(true));
  }
  render();
  DU.layout({ active: '', v2: true });
})();
