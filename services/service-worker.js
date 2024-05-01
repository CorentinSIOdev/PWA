const CACHE_NAME = 'films-app-cache-v1';
const urlsToCache = [
  '../',
  '../index.html',
  '../public/css/style.css',
  '../app.js',
  '../data/local_movies.json',
  '../public/icons/icon-512x512.png',
  '../manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        const promises = urlsToCache.map(async url => {
          return fetch(url)
          .then(response => {
              if (response.ok) {
                return cache.put(new Request(url), response);
              } else {
                throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
              }
            })
          .catch(error => {
              console.error(error);
              // Ajouter le fichier au cache de toute façon, pour qu'il soit disponible hors ligne
              return cache.add(url);
            });
        });
        return Promise.all(promises);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('films-app-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Mettre à jour le cache avec la nouvelle version de la ressource
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Si la ressource n'est pas disponible en ligne, renvoyer la version en cache
          return response;
        });

        // Renvoyer la ressource en ligne et mettre à jour le cache en arrière-plan
        return response || fetchPromise;
      });
    })
  );
});

// Notifications
self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
  });
});