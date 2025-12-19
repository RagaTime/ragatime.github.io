// @ts-nocheck
self.addEventListener('install', e => {
    e.waitUntil(caches.open('app-v1'));
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// This is to be able to show notifications
self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Received?", data);
    self.registration.showNotification(data.title, data);
});
