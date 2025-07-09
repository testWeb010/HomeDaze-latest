const CACHE_NAME = 'homedaze-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'HomeDaze Notification';
  const options = {
    body: data.body || '',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png',
    data: data.url || '/',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});