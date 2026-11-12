const CACHE = 'du-v36';
const CORE = ['index.html', 'assets/css/site.css', 'assets/js/data.js', 'assets/js/store.js', 'assets/js/firebase-config.js', 'assets/js/cloud.js', 'assets/js/i18n.js', 'assets/js/ui.js', 'assets/brand/crest.svg', 'assets/brand/crest-jersey.svg', '404.html'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
const idb = () => new Promise((res, rej) => { const r = indexedDB.open('du-local-img', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  const m = u.origin === self.location.origin && u.pathname.match(/\/local-img\/([\w.-]+)$/);
  if (m) {
    e.respondWith(idb().then((db) => new Promise((res) => { const q = db.transaction('f').objectStore('f').get(m[1]); q.onsuccess = () => res(q.result ? new Response(q.result, { headers: { 'Content-Type': q.result.type || 'image/png' } }) : new Response('', { status: 404 })); q.onerror = () => res(new Response('', { status: 404 })); })));
    return;
  }
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('404.html'))));
});
