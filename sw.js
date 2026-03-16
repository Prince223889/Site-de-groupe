const CACHE_NAME = 'robot-club-v2';
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

// Installation : Mise en cache des fichiers de base
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Stratégie : Chercher sur le réseau, sinon dans le cache, et enregistrer les nouveaux PDF
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Si le fichier est dans le cache, on le donne
      if (response) return response;

      // Sinon, on le télécharge sur le réseau
      return fetch(e.request).then((networkResponse) => {
        // Si c'est un PDF, on l'ajoute au cache pour la prochaine fois
        if (e.request.url.includes('.pdf')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
        // Optionnel : afficher une page d'erreur personnalisée si rien ne marche
    })
  );
});
