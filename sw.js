const CACHE_NAME = 'robot-club-v4';
const ASSETS = [
  './',
  './index.html',
  './cours.html',
  './lecteur.html',
  './style.css',
  './script.js',
  './users.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com',
  'https://cdnjs.cloudflare.com'
];

// Installation : Mise en cache des fichiers de base
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : Nettoyage
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// Stratégie de Fetch (Navigation + PDF)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // 1. Si le fichier est déjà dans le cache, on le sert immédiatement
      if (cachedResponse) return cachedResponse;

      // 2. Sinon, on tente le réseau
      return fetch(e.request).then((networkResponse) => {
        // Si c'est un PDF, on le clone et on l'ajoute au cache "au vol"
        if (e.request.url.includes('.pdf')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        // 3. Fallback : Si on est offline et qu'on navigue vers une page HTML
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
