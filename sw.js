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

// This event listener is necessary to open the `url` in the notification data. [TESTED]
self.addEventListener('notificationclick', event => {
    console.log('notificationclick: url?', event.notification.data?.url);
    event.notification.close();
    const url = event.notification.data?.url;
    if (!url) return;
    event.waitUntil(clients.openWindow(url));
});

// Learn: Below works such that clicking on notification opens the target url.
// setInterval(() => {
//     self.registration.showNotification('Test', {
//         body: 'Click me',
//         data: { url: 'https://google.com' }
//     });
// }, 10_000);
