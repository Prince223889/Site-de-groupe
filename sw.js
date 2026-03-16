const CACHE_NAME = 'robot-v3'; // Change le nom (v3) à chaque grosse modif
const ASSETS = [
  './',
  './index.html',
  './cours.html',
  './lecteur.html',
  './style.css',
  './script.js',
  './users.js',
  'https://cdnjs.cloudflare.com',
  'https://cdnjs.cloudflare.com'
];

// Installation et mise en cache immédiate
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Force l'activation
});

// Nettoyage des vieux caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// Stratégie : Réseau d'abord, sinon Cache (pour les PDF)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
