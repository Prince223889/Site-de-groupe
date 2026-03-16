const CACHE_NAME = 'robot-club-v5'; // On passe en v5 pour forcer la mise à jour
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
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// Stratégie de Fetch (Réseau d'abord, sinon Cache)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Si on récupère un PDF sur le réseau, on le met en cache pour plus tard
        if (e.request.url.includes('.pdf')) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(() => {
        // Si le réseau échoue (Hors-ligne), on regarde dans le cache
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Si c'est une navigation (changement de page), on renvoie vers l'accueil
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
