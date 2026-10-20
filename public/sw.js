// Service Worker for Resilience for Africa's Future

const CACHE_NAME = 'rafo-site-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/services.html',
  '/projects.html',
  '/about.html',
  '/blog.html',
  '/contact.html',
  '/insight-youth-food-systems.html',
  '/field-update-mampong.html',
  '/css/main.css',
  '/scripts/main.js',
  '/assets/images/logo.svg',
  '/assets/images/logo-white.svg',
  '/assets/images/favicon.svg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - respond with cached assets or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from cache
        if (response) {
          return response;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache non-GET requests or responses from different origins
            if (!event.request.url.startsWith(self.location.origin) || 
                event.request.method !== 'GET') {
              return networkResponse;
            }
            
            // Clone response for caching and returning
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, show a generic fallback
        // For HTML pages - could be customized further
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Network error occurred', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});
