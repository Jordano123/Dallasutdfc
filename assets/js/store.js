window.DU = window.DU || {};
(function () {
  const KEY_LIVE = 'du-live-v1';
  const KEY_DRAFT = 'du-draft-v1';
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function read(key) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function write(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; }
    catch (e) { if (DU.toast) DU.toast('Could not save: the browser storage is full. Try smaller pictures.'); return false; }
  }
  function withDefaults(d, key) {
    const base = clone(DU.DEFAULTS);
    if (!d) return base;
    Object.keys(base).forEach((k) => { if (d[k] === undefined) d[k] = base[k]; });
    if ((d.version || 1) < base.version) {
      ['settings', 'homeTexts', 'tryTexts', 'tvTexts', 'kitBand', 'shopTexts', 'founderCfg', 'cardCfg', 'donationCfg', 'clubTexts', 'countdownTexts', 'quote', 'story', 'features', 'theme'].forEach((k) => {
        if (base[k] && d[k] && typeof d[k] === 'object') Object.keys(base[k]).forEach((f) => { if (d[k][f] === undefined) d[k][f] = base[k][f]; });
      });
      ['faq', 'bring', 'waivers', 'shopCats'].forEach((k) => {
        if (!Array.isArray(d[k])) return;
        base[k].forEach((it) => { if (!d[k].some((x) => x.id === it.id)) d[k].push(it); });
      });
      if (Array.isArray(d.calEvents)) d.calEvents = d.calEvents.map((e, i) => (e.id ? e : { ...e, id: `ce${i}` }));
      if ((d.version || 1) < 5 && d.countdownTexts) { const b = base.countdownTexts; if (!d.countdownTexts.date) { d.countdownTexts.date = b.date; d.countdownTexts.time = b.time; } if (d.countdownTexts.title && d.countdownTexts.title.EN === 'Countdown to kick-off') d.countdownTexts.title = b.title; if (!d.countdownTexts.sub) d.countdownTexts.sub = b.sub; }
      if ((d.version || 1) < 9) {
        if (Array.isArray(d.storyParts) && d.storyParts.some((p) => p.id === 'du' || p.id === 'shield')) d.storyParts = clone(base.storyParts);
        if (d.founderCfg) d.founderCfg.follow = false;
        if (d.shopTexts && d.shopTexts.collectionTitle && d.shopTexts.collectionTitle.EN === 'Founding collection') { d.shopTexts.collectionTitle = base.shopTexts.collectionTitle; d.collectionPics = clone(base.collectionPics); }
        if (Array.isArray(d.orders) && !d.orders.some((o) => Array.isArray(o.lines))) base.orders.filter((o) => Array.isArray(o.lines)).reverse().forEach((o) => { if (!d.orders.some((x) => x.id === o.id)) d.orders.unshift(clone(o)); });
        if (Array.isArray(d.products)) {
          base.products.forEach((bp) => {
            const p = d.products.find((x) => x.id === bp.id);
            if (!p) { if (bp.founders) d.products.push(clone(bp)); return; }
            ['imgBack', 'preorder', 'custom', 'sizes'].forEach((k) => { if (bp[k] !== undefined && p[k] === undefined) p[k] = clone(bp[k]); });
            if (bp.img !== p.img && /jersey|kids-home|training-tee/.test(bp.img) && p.img === bp.img.replace(/\?.*$/, '')) p.img = bp.img;
          });
        }
      }
      if ((d.version || 1) < 10) {
        if (d.founderCfg) { d.founderCfg.goal = 500; d.founderCfg.price = 25; d.founderCfg.closesAt = ''; if ((d.founderCfg.base || 0) > 500) d.founderCfg.base = 0; }
        if (Array.isArray(d.founders) && d.founders.some((f) => f.no > 500)) d.founders = clone(base.founders);
        if (d.settings && /Dallas Stadium/.test(d.settings.stadium || '')) d.settings.stadium = base.settings.stadium;
        (d.fixtures || []).forEach((f) => { if (f.venue === 'Dallas Stadium') f.venue = 'Home field (TBA)'; });
        (d.posts || []).forEach((p) => { if (p.body && p.body.EN) p.body.EN = p.body.EN.replace(' at Dallas Stadium.', '.').replace(' Gates open at 6:00 PM.', ''); });
        if (d.countdownTexts && d.countdownTexts.sub && /Dallas Stadium/.test(d.countdownTexts.sub.EN || '')) d.countdownTexts.sub = clone(base.countdownTexts.sub);
        if (d.clubTexts) { if (/loudest/.test((d.clubTexts.intro || {}).EN || '')) d.clubTexts.intro = clone(base.clubTexts.intro); if (/supporters’ section/i.test((d.clubTexts.perks || {}).EN || '')) d.clubTexts.perks = clone(base.clubTexts.perks); }
        if (d.homeTexts && d.homeTexts.tvPrice === '$4.99 / month') d.homeTexts.tvPrice = '';
        if (Array.isArray(d.people)) {
          d.people = d.people.filter((p) => !(p.group === 'Staff' && (p.pos === 'Kit Manager' || p.pos === 'Physio') && /^st[36]$/.test(p.id)));
          base.people.filter((p) => /^st(7|8|9|10)$/.test(p.id)).forEach((p) => { if (!d.people.some((x) => x.id === p.id)) d.people.push(clone(p)); });
        }
        if (Array.isArray(d.packages) && d.packages.some((k) => /LED|big screen|Hospitality/i.test((k.perks || {}).EN || ''))) d.packages = clone(base.packages);
        if (!Array.isArray(d.waivers)) d.waivers = clone(base.waivers);
        if (d.shopTexts && d.shopTexts.holidayText && /stadium/.test(d.shopTexts.holidayText.EN || '')) d.shopTexts.holidayText = clone(base.shopTexts.holidayText);
        (d.roles || []).forEach((r) => { if (r.id === 'r4' && r.text && /stadium/.test(r.text.EN || '')) r.text = clone(base.roles.find((x) => x.id === 'r4').text); });
      }
      if ((d.version || 1) < 11) {
        if (d.founderCfg && (!d.founderCfg.youthPct || d.founderCfg.youthPct === 5)) d.founderCfg.youthPct = 20;
        const MAP = { Jerseys: 'Kit', Training: 'Kit', Kids: 'Youth' };
        (d.products || []).forEach((p) => {
          const b = base.products.find((x) => x.id === p.id);
          if (b && ['Jerseys', 'Kids', 'Training', 'Accessories', 'Founders'].includes(p.cat)) p.cat = b.cat;
          else if (MAP[p.cat]) p.cat = MAP[p.cat];
          else if (p.cat === 'Founders') p.cat = /cap|hat|beanie/i.test(JSON.stringify(p.name)) ? 'Hats' : /scarf|pin|mug|bag|flag/i.test(JSON.stringify(p.name)) ? 'Accessories' : 'Lifestyle';
          else if (p.cat === 'Accessories' && /\b(cap|hat|beanie)\b/i.test(JSON.stringify(p.name))) p.cat = 'Hats';
        });
        if (!Array.isArray(d.shopSlides)) d.shopSlides = clone(base.shopSlides);
        if (d.shopTexts && !d.shopTexts.collectionImg && Array.isArray(d.collectionPics) && d.collectionPics[0]) d.shopTexts.collectionImg = d.collectionPics[0].img;
        if (d.table && d.table.league && /Texas Premier League/.test(d.table.league.title || '')) d.table.league.title = base.table.league.title;
      }
      if ((d.version || 1) < 12 && Array.isArray(d.shopCats)) {
        const ORD = ['Kit', 'Lifestyle', 'Youth', 'Hats', 'Accessories'];
        d.shopCats.sort((a, b) => (ORD.indexOf(a.id) < 0 ? 99 : ORD.indexOf(a.id)) - (ORD.indexOf(b.id) < 0 ? 99 : ORD.indexOf(b.id)));
      }
      if ((d.version || 1) < 13 && Array.isArray(d.people)) d.people.forEach((x) => { ['birthCity', 'joined', 'instagram', 'tiktok'].forEach((k) => { if (x[k] === undefined) { const b = (base.people || []).find((y) => y.id === x.id); x[k] = b ? b[k] : ''; } }); });
      if ((d.version || 1) < 14 && Array.isArray(d.videos)) {
        d.videos.forEach((v) => { const b = (base.videos || []).find((x) => x.id === v.id); if (b && v.tag === undefined) { v.tag = b.tag || ''; v.slide = !!b.slide; } });
      }
      if ((d.version || 1) < 25) { if (!d.fanSeed) d.fanSeed = clone(base.fanSeed); const NB = (base.hoods || []).map((h) => String(h[0]).toLowerCase()); const CITY = ['irving', 'garland', 'richardson', 'mesquite', 'grand prairie', 'arlington', 'carrollton', 'plano']; ['founders', 'fanclub', 'fans'].forEach((k) => (d[k] || []).forEach((r) => { if (r.city || !r.hood) return; const h = String(r.hood).trim(); if (/,\s*[A-Za-z]{2}$/.test(h)) { r.city = h.replace(/,\s*[A-Za-z]{2}$/, ''); r.state = h.slice(-2).toUpperCase(); return; } const lo = h.toLowerCase(); r.city = lo === 'las colinas' ? 'Irving' : (NB.includes(lo) && !CITY.includes(lo)) ? 'Dallas' : h; r.state = 'TX'; r.hood = `${r.city}, TX`; })); }
      if ((d.version || 1) < 24) { if (d.story) { const en = (v) => (v && typeof v === 'object' ? v.EN : v); if (en(d.story.crestTitle) === 'Our crest') d.story.crestTitle = clone(base.story.crestTitle); if (en(d.story.beyondTitle) === 'Beyond the crest') d.story.beyondTitle = clone(base.story.beyondTitle); if (d.story.crestKick === undefined) d.story.crestKick = clone(base.story.crestKick); } if (d.bdayCfg && !d.bdayCfg.club214) d.bdayCfg.club214 = clone(base.bdayCfg.club214); if (d.autos) ['club214', 'players'].forEach((k) => { if (!d.autos[k]) d.autos[k] = clone(base.autos[k]); }); }
      if ((d.version || 1) < 23) { if (!d.contact) d.contact = clone(base.contact); if (!d.contactFaq) d.contactFaq = clone(base.contactFaq); }
      if ((d.version || 1) < 22) {
        d.story = { ...clone(base.story), ...(d.story || {}) };
        if (!d.storyGallery) d.storyGallery = clone(base.storyGallery);
        const OLD = { '#0A1628': ['#121A2B', 'Midnight Ink'], '#F5B700': ['#B8773F', 'Bronze'], '#1452D9': ['#2A5F8F', 'Trinity Blue'], '#F1F0EC': ['#EEE8DC', 'Limestone'] };
        const bc = (base.storyParts || []).find((x) => x.id === 'colors'), pc = (d.storyParts || []).find((x) => x.id === 'colors');
        if (bc && pc && pc.name && /Navy, gold/.test(pc.name.en || '')) { pc.name = clone(bc.name); pc.text = clone(bc.text); }
        (d.storyColors || []).forEach((c) => { const n = OLD[String(c.hex).toUpperCase()]; if (n) { c.hex = n[0]; if (c.name && typeof c.name === 'object') c.name.en = n[1]; } });
      }
      if ((d.version || 1) < 21) { const have = new Set((d.fixtures || []).map((x) => x.id)); (base.fixturesMore || []).forEach((x) => { if (!have.has(x.id)) d.fixtures.push(clone(x)); }); }
      if ((d.version || 1) < 20) { const have = new Set((d.videos || []).map((x) => x.id)); d.videos = d.videos || []; (base.videosMore || []).forEach((x) => { if (!have.has(x.id)) d.videos.push(clone(x)); }); }
      if ((d.version || 1) < 19) { const have = new Set((d.posts || []).map((x) => x.id)); (base.newsMore || []).forEach((x) => { if (!have.has(x.id)) d.posts.push(clone(x)); }); }
      if ((d.version || 1) < 18) { ['home2', 'igPosts', 'storeSlides', 'c214Cards', 'fdCards'].forEach((k) => { if (!d[k]) d[k] = clone(base[k]); }); }
      if ((d.version || 1) < 17) { if (!d.venue) d.venue = clone(base.venue); }
      if ((d.version || 1) < 16) {
        ['walletPhone', 'club214Collage', 'club214Slides', 'foundersCollage', 'foundersSlides'].forEach((k) => { if (!d[k]) d[k] = clone(base[k]); });
      }
      if ((d.version || 1) < 15) {
        if (d.kitBand && !d.kitBand.logo) d.kitBand.logo = base.kitBand.logo;
        if (d.features) d.features.ask = false;
        if (!d.popup) d.popup = clone(base.popup);
        if (!d.authCfg) d.authCfg = clone(base.authCfg);
        (d.people || []).forEach((x) => { const b = (base.people || []).find((y) => y.id === x.id); if (b && !x.instagram && b.instagram) x.instagram = b.instagram; });
      }
      if ((d.version || 1) < 2) {
        if (d.homeTexts.bgWords === 'DU / TPL') d.homeTexts.bgWords = base.homeTexts.bgWords;
        if (/community\.jpg$/.test(d.homeTexts.videoImg || '')) d.homeTexts.videoImg = base.homeTexts.videoImg;
      }
      d.version = base.version;
      if (key) write(key, d);
    }
    return d;
  }

  const isPreview = /[?&]preview=1/.test(location.search);
  let live = withDefaults(read(KEY_LIVE), KEY_LIVE);
  let draft = null;

  DU.store = {
    isPreview,
    get() { return isPreview ? this.draft() : live; },
    live() { return live; },
    draft() { if (!draft) { const r = read(KEY_DRAFT); draft = withDefaults(r || clone(live), r ? KEY_DRAFT : null); } return draft; },
    saveDraft(d) { draft = d; return write(KEY_DRAFT, d); },
    publish() { live = clone(this.draft()); return write(KEY_LIVE, live); },
    load(l, dr) { live = withDefaults(l, KEY_LIVE); write(KEY_LIVE, live); draft = dr ? withDefaults(dr, KEY_DRAFT) : clone(live); write(KEY_DRAFT, draft); },
    hasUnpublished() { return JSON.stringify(this.draft()) !== JSON.stringify(live); },
    addPublic(coll, item, mutate) {
      [live, this.draft()].forEach((d) => {
        if (mutate) mutate(d);
        else { d[coll] = d[coll] || []; d[coll].unshift(clone(item)); }
      });
      write(KEY_LIVE, live); write(KEY_DRAFT, draft);
    },
    reset() { try { localStorage.removeItem(KEY_LIVE); localStorage.removeItem(KEY_DRAFT); } catch (e) {  } live = withDefaults(null); draft = null; },
    uid(p) { return `${p || 'id'}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; }
  };

  const IDB = () => new Promise((res, rej) => { const r = indexedDB.open('du-local-img', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const toBlob = (dataUrl) => fetch(dataUrl).then((r) => r.blob());
  DU.localImg = {
    ready() { return !!(navigator.serviceWorker && navigator.serviceWorker.controller) && 'indexedDB' in window; },
    async put(fileOrDataUrl, ext) {
      const blob = typeof fileOrDataUrl === 'string' ? await toBlob(fileOrDataUrl) : fileOrDataUrl;
      const e = ext || ((blob.type.split('/')[1] || 'bin').replace('jpeg', 'jpg').replace('quicktime', 'mov'));
      const key = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${e}`;
      const db = await IDB();
      await new Promise((res, rej) => { const tx = db.transaction('f', 'readwrite'); tx.objectStore('f').put(blob, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
      return `local-img/${key}`;
    },
    async slim(d) {
      const seen = new Map(); let n = 0;
      const walk = async (o) => {
        if (!o || typeof o !== 'object') return;
        for (const k of Object.keys(o)) {
          const v = o[k];
          if (typeof v === 'string' && /^data:(image|video)\//.test(v) && v.length > 2000) {
            if (!seen.has(v)) seen.set(v, await DU.localImg.put(v));
            o[k] = seen.get(v); n += 1;
          } else if (v && typeof v === 'object') await walk(v);
        }
      };
      await walk(d); return n;
    }
  };

  DU.pref = {
    get(k, d) { try { const v = localStorage.getItem(`du-${k}`); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(`du-${k}`, JSON.stringify(v)); } catch (e) {  } }
  };
})();
