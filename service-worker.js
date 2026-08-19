const CACHE_NAME = 'cj-admin-cache-v1';
const SCOPE = '/cj-admin/';
const CORE_ASSETS = [SCOPE, SCOPE + 'index.html', SCOPE + 'manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('cj-admin-') && k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (!event.request.url.includes(SCOPE)) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)); return response; })
      .catch(() => caches.match(event.request))
  );
});
