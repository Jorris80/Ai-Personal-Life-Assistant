/* AI Personal Life Assistant — service worker (cangkang offline). Naikkan VERSI setiap kali index.html diperbarui. */
const VERSI = 'apla-v1.0.0';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSI).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;            // panggilan API (POST ke Apps Script) tidak pernah di-cache
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(VERSI).then(x => x.put(e.request, c)); } return r; })   // jaringan dulu → selalu versi terbaru
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));                                                          // offline → dari cache
});
