(function () {
  const d = DU.store.get(), t = DU.t, esc = DU.esc;
  const main = DU.$('#main');
  const C = d.contact || {}, st = d.settings || {};
  const F = (d.contactFaq || []).filter((x) => t(x.q));
  const mail = st.email || '';
  const ig = st.instagram || '';
  const box = (icon, title, text, btn, href, ext) => `<div class="ct-box">${icon}<h3>${esc(title)}</h3><p>${esc(text)}</p><a class="v2-btn v2-btn-p" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(btn)}</a></div>`;
  main.innerHTML = `
  <section class="ct-top"><div class="v2-wrap">
    <span class="v2-kick gold">${esc(t(C.title) || 'Contact us')}</span>
    <h1 class="ct-h">${esc(t(C.help) || 'Hello, how can we help you?')}</h1>
    <div class="ct-grid">
      ${mail ? box(DU.lu('mail', 'ct-ic'), t(C.emailTitle) || 'Email us', t(C.emailText), t(C.emailBtn) || 'Send an email', `mailto:${mail}`) + '' : ''}
      ${ig ? box(DU.brand('instagram', 'ct-ic'), t(C.igTitle) || 'DM us on Instagram', t(C.igText), t(C.igBtn) || 'Message us', ig, true) : ''}
      ${F.length ? box(DU.lu('message-square', 'ct-ic'), t(C.faqTitle) || 'FAQ', t(C.faqText), t(C.faqBtn) || 'Find answers', '#faq') : ''}
    </div>
    ${mail ? `<p class="ct-mail">${DU.lu('mail')}<a href="mailto:${esc(mail)}">${esc(mail)}</a></p>` : ''}
  </div></section>
  ${F.length ? `<section class="ct-faq" id="faq"><div class="v2-wrap">
    <div class="ct-fh"><h2 class="v2-h2">${esc(t(C.faqHead) || 'The most frequently asked questions')}</h2>${mail ? `<a class="v2-btn v2-btn-o" href="mailto:${esc(mail)}">${esc(t(C.faqMore) || 'Can’t find your question? Email us')}</a>` : ''}</div>
    <div class="ct-list">${F.map((x) => `<details class="ct-q"><summary><span>${esc(t(x.q))}</span>${DU.lu('chevron-down', 'ct-chev')}</summary><div class="ct-a">${String(t(x.a) || '').split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div>
  </div></section>` : ''}`;
  DU.layout({ active: '', v2: true });
})();
