// Service Worker for DUB5 PWA
// Update this version on each deployment to force cache refresh
const CACHE_VERSION = '1.0.0';
const CACHE_BUILD = '009'; // Increment this on each build
const CACHE_NAME = `dub5-v${CACHE_VERSION}.${CACHE_BUILD}`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/tokens.css',
  '/css/base.css',
  '/css/shell.css',
  '/css/cards.css',
  '/css/game.css',
  '/js/app.js',
  '/js/registry.js',
  '/js/starfield.js',
  '/js/intro.js',
  '/js/sw-register.js',
  '/engine/loop.js',
  '/engine/input.js',
  '/engine/canvas.js',
  '/engine/storage.js',
  '/engine/audio.js',
  '/engine/rng.js',
  '/engine/hud.js',
  '/engine/game-host.js',
  // Game pages (pretty URLs served by routes)
  '/snake',
  '/minesweeper',
  '/blockblast',
  '/rekenmachine',
  '/2048',
  '/tetris',
  '/memory',
  '/flappy',
  '/pong',
  '/sudoku',
  '/gnomelauncher',
  '/breakout',
  '/baseball',
  // Shared game assets
  '/showcase/showcase.css',
  '/showcase/showcase.js',
  '/games/memory/starfield.js',
  '/games/rekenmachine/starfield.js',
  '/games/sudoku/starfield.js',
  '/stacktris',
  '/stacktris/',
  '/stacktris/webapp/poki-stub.js',
  '/stacktris/webapp/source_min.js',
  '/stacktris/webapp/index.js',
  '/stacktris/webapp/index.data',
  '/stacktris/webapp/index.wasm',
  '/stacktris/webapp/cover.jpg',
  // Block Blast (original Defold build)
  '/block-blast',
  '/block-blast/dmloader.js',
  '/block-blast/blockypuzzle_wasm.js',
  '/block-blast/blockypuzzle.wasm',
  '/block-blast/poki-stub.js',
  '/block-blast/GameAnalytics.js',
  '/block-blast/game_logo.png',
  '/block-blast/archive/archive_files.json',
  '/block-blast/archive/game0.projectc',
  '/block-blast/archive/game0.arci',
  '/block-blast/archive/game0.arcd',
  '/block-blast/archive/game0.dmanifest',
  '/block-blast/archive/game0.public.der',
  '/offline.html'
];

// Install event - precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('dub5-')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // API calls (if any) - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // App shell - cache first
  if (APP_SHELL.some(path => url.pathname === path || url.pathname.endsWith(path))) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Clone response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      }).catch(() => {
        // If offline and not in cache, serve offline page
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Game modules - cache on first play
  if (url.pathname.startsWith('/games/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // Update in background
          fetch(request).then((freshResponse) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, freshResponse);
            });
          });
          return response;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          // If offline and game not cached, show offline page
          return caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // Block Blast game assets - cache on first play
  if (url.pathname.startsWith('/block-blast/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          fetch(request).then((freshResponse) => {
            if (freshResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, freshResponse);
              });
            }
          });
          return response;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          return caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // Everything else - network first, fallback to cache
  event.respondWith(
    fetch(request).then((response) => {
      // Cache successful responses
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        // If offline and nothing in cache, serve offline page
        return caches.match('/offline.html');
      });
    })
  );
});

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  // For future implementation
});

// Handle background sync (if needed in future)
self.addEventListener('sync', (event) => {
  // For future implementation
});
