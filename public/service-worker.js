/*
  Basic Service Worker for hiarchitectweb
  - Provides install/activate lifecycle
  - Adds a small cache for core PWA assets (manifest + icons)
  - Implements a simple runtime strategy for images & API fallback
  NOTE: Adjust and expand caching strategy as needed.
*/

const SW_VERSION = 'v1.0.1';
const CORE_CACHE = `hiarchi-core-${SW_VERSION}`;
const RUNTIME_CACHE = `hiarchi-runtime-${SW_VERSION}`;

// Core assets to pre-cache (keep list small)
// IMPORTANT: Do NOT cache '/' to prevent serving stale SSR HTML for the homepage.
const CORE_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/images/Hi-logo-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => ![CORE_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Runtime fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET and dev tools
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // For navigations (HTML documents), use network-first to always get fresh SSR/CSR pages
  // This prevents the root '/' and other pages from being served stale from cache.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const fresh = await fetch(request);
          // Optionally cache successful HTML responses
          const cache = await caches.open(RUNTIME_CACHE);
          if (fresh && fresh.status === 200) {
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch (err) {
          // Fallback to cache if available (useful for back/forward or brief offline)
          const cached = await caches.match(request);
          if (cached) return cached;
          // As a last resort, return a generic response
          return Response.error();
        }
      })()
    );
    return;
  }

  // Strategy: Network first for API routes, fallback to cache (if any)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Strategy: Stale-while-revalidate for images & static assets
  if (request.destination === 'image' || url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request).then((resp) => {
          if (resp.status === 200) cache.put(request, resp.clone());
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default: cache-first for other GET requests (e.g., small static assets)
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Optional: Listen for manual skipWaiting messages
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
