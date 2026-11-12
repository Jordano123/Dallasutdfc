(function () {
  const d = DU.store.get(), t = DU.t, esc = DU.esc, tr = DU.tr;
  const main = DU.$('#main');
  main.innerHTML = `
  <section class="hero pa-hero"><div class="hero-media"><img class="zoom" src="${DU.esc(DU.pic('partners.hero', 'assets/img/fans.jpg'))}" alt=""></div><div class="hero-shade"></div>
    <div class="container hero-inner"><span class="eyebrow">${DU.x('partners.1', 'Partnerships')}</span><h1 class="display h1">${DU.x('partners.2', 'Partner with us')}</h1><p class="lead">${DU.x('partners.3', 'Put your brand in front of a new, fast-growing fan base in Dallas, from day one.')}</p><div class="row"><a class="btn btn-gold" href="#contact">Talk to us ${DU.icon('arrow')}</a></div></div></section>
  <section class="container section reveal"><div class="grid-fit" style="--min:260px;--gap:32px">${[['01', DU.x('partners.a1', 'A city that loves the game'), DU.x('partners.a2', 'Soccer is the fastest-growing sport in Dallas. Be part of its new club from the first season.')], ['02', DU.x('partners.a3', 'Every channel'), DU.x('partners.a4b', 'Shirt, website, DU TV, social media and the club email.')], ['03', DU.x('partners.a5', 'Real community'), DU.x('partners.a6', 'School visits, youth clinics and volunteer days your team can join.')]].map(([n, h, p]) => `<div class="perk"><span class="steps-num">${n}</span><strong style="font-size:22px">${h}</strong><span class="text">${p}</span></div>`).join('')}</div></section>
  <section class="bg-white reveal"><div class="container section-tight stack" style="--gap:22px"><h2 class="serif h2">${DU.x('partners.4', 'Packages')}</h2>
    <div class="grid-fit" style="--min:260px">${d.packages.map((k) => `<div class="card card-pad stack" style="--gap:12px;${k.featured ? 'background:var(--navy);color:#fff' : 'background:var(--cream)'}"><span class="badge ${k.featured ? 'badge-gold' : 'badge-navy'}" style="align-self:flex-start">${esc(t(k.badge))}</span><strong class="display" style="font-size:30px">${esc(t(k.name))}</strong><ul style="margin:0;padding-left:18px;line-height:1.8">${t(k.perks).split('\n').filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join('')}</ul><a class="btn ${k.featured ? 'btn-gold' : 'btn-navy'}" style="margin-top:auto" href="#contact" data-pkg="${esc(t(k.name))}">${DU.x('partners.5', 'I’m interested')}</a></div>`).join('')}</div></div></section>
  <section id="contact" class="bg-navy"><div class="container section split" style="align-items:flex-start">
    <div class="stack" style="--gap:14px"><span class="eyebrow">${DU.x('partners.6', 'Contact')}</span><h2 class="display h2">${DU.x('partners.7', 'Let’s talk')}</h2><p class="lead" style="color:#DCE4F2">${DU.x('partners.8', 'Tell us a little about your business and we’ll send the full partnership guide within two working days.')}</p></div>
    <div data-box><form class="stack on-dark" style="--gap:14px" novalidate data-f>
      <div class="form-grid"><label class="field">${DU.x('partners.9', 'Your name *')}<input name="name" required autocomplete="name"></label><label class="field">${DU.x('partners.10', 'Company *')}<input name="company" required autocomplete="organization"></label></div>
      <div class="form-grid"><label class="field">${tr('c.email')} *<input name="email" type="email" required autocomplete="email"></label><label class="field">${tr('c.phone')}<input name="phone" type="tel" autocomplete="tel"></label></div>
      <label class="field">${DU.x('partners.11', 'Package')}<select name="pkg">${d.packages.map((k) => `<option>${esc(t(k.name))}</option>`).join('')}<option>${DU.x('partners.12', 'Not sure yet')}</option></select></label>
      <label class="field">${DU.x('partners.13', 'Message')}<textarea name="msg" placeholder="What would you like to achieve?"></textarea></label>
      <button class="btn btn-gold" type="submit">${DU.x('partners.14', 'Send enquiry')}</button></form></div></div></section>`;
  DU.$$('[data-pkg]').forEach((a) => a.addEventListener('click', () => { DU.$('select[name=pkg]').value = a.dataset.pkg; }));
  DU.$('[data-f]').addEventListener('submit', (e) => {
    e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target));
    if (!fd.name || !fd.company) { DU.toast(tr('c.required')); return; } if (!DU.isEmail(fd.email)) { DU.toast(tr('c.badEmail')); return; }
    DU.store.addPublic('enquiries', { id: DU.store.uid('e'), company: fd.company, pkg: fd.pkg, name: fd.name, email: fd.email, phone: fd.phone || '', msg: fd.msg || '', when: new Date().toISOString().slice(0, 10) });
    DU.$('[data-box]').innerHTML = `<div class="stack" role="status" style="--gap:12px"><span style="font-size:48px" aria-hidden="true">🤝</span><h3 class="display" style="font-size:44px">Thank you, ${esc(fd.name.split(' ')[0])}</h3><p class="lead" style="color:#DCE4F2">We’ll be in touch at ${esc(fd.email)} within two working days.</p></div>`;
  });
  DU.layout({ active: '', v2: true });
})();
