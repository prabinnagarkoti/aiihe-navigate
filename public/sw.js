const CACHE_NAME = 'aiihe-navigate-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Best effort caching. If some fail, it's ok.
      return Promise.allSettled(
        STATIC_ASSETS.map((url) => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests and API calls
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // Network First for navigation (HTML) requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cacheResponse) => {
            if (cacheResponse) {
              return cacheResponse;
            }
            // Fallback for offline (could be an offline page)
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Cache First for everything else (images, css, js)
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      if (cacheResponse) {
        return cacheResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache external map tiles dynamically
        if (event.request.url.includes('tile.openstreetmap.org')) {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return networkResponse;
      });
    })
  );
});
