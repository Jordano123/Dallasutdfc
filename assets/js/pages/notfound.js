(function () {
  const main = DU.$('#main');
  main.innerHTML = `
  <section style="position:relative;overflow:hidden;min-height:100vh;display:flex;align-items:center;background:var(--navy);color:#fff">
    <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#0F1E36 0 120px,#0B1930 120px 240px)"></div>
    <div aria-hidden="true" class="hide-mobile" style="position:absolute;top:0;bottom:0;left:62%;width:4px;background:var(--gold);box-shadow:0 0 24px rgba(245,183,0,.6)"></div>
    <div class="container row" style="position:relative;padding-top:130px;padding-bottom:72px;--gap:40px;justify-content:space-between">
      <div class="stack" style="flex:1 1 480px;--gap:22px;max-width:680px">
        <span class="row" style="--gap:0;font-weight:800;font-size:14px"><span style="background:var(--red);padding:8px 12px;border-radius:6px 0 0 6px">VAR CHECK</span><span style="background:var(--navy-2);padding:8px 12px;color:var(--gold);border-radius:0 6px 6px 0">404’</span></span>
        <h1 class="display" style="font-size:clamp(84px,15vw,220px);line-height:.84">${DU.x('notfound.1', 'Offside!')}</h1>
        <p style="font-size:clamp(19px,2vw,24px);line-height:1.45;color:#DCE4F2">${DU.x('notfound.2', 'The flag is up. You made your run a little too early and ended up behind the last defender, where there’s no ball to play.')}</p>
        <p style="color:#C9D2E3">${DU.x('notfound.3', 'Free kick to you. Restart from one of these:')}</p>
        <div class="row"><a class="btn btn-gold" href="index.html">${DU.x('notfound.4', 'Back to kick-off (Home)')}</a><a class="btn btn-outline btn-on-dark" href="matches.html">${DU.x('notfound.5', 'Fixtures')}</a><a class="btn btn-outline btn-on-dark" href="news.html">${DU.x('notfound.6', 'News')}</a><a class="btn btn-outline btn-on-dark" href="shop.html">${DU.x('notfound.7', 'Shop')}</a></div>
        <span class="small" style="color:#C9D2E3">Think the ref got it wrong? <a class="link" href="mailto:hello@dallasunitedfc.com">${DU.x('notfound.8', 'Tell us which link sent you here')}</a>.</span>
      </div>
      <div aria-hidden="true" class="hide-mobile" style="flex:0 1 340px;display:flex;justify-content:center;align-items:flex-end">
        <svg width="150" height="300" viewBox="0 0 120 240" style="overflow:visible"><g style="transform-origin:12px 196px;animation:du-flag 1.1s ease-in-out infinite"><rect x="10" y="20" width="4" height="180" rx="2" fill="#DCE4F2"/><rect x="14" y="20" width="64" height="46" fill="#F5B700"/><rect x="14" y="20" width="32" height="23" fill="#C8102E"/><rect x="46" y="43" width="32" height="23" fill="#C8102E"/><rect x="6" y="196" width="12" height="28" rx="4" fill="#13233F"/></g></svg>
        <img src="${DU.esc(DU.pic('notfound.img', DU.CREST))}" alt="" style="width:160px;animation:du-float 5s ease-in-out infinite">
      </div>
    </div>
  </section>
  <style>@keyframes du-flag{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}</style>`;
  DU.layout({ active: '', v2: true });
})();
