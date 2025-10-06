self.addEventListener('install', e => {
    e.waitUntil(caches.open('app-v1'));
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
