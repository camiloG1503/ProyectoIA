// web/service-worker.js
const CACHE_NAME = "proyectia-pwa-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/js/vendors~main.chunk.js",
  "/static/js/main.chunk.js",
  "/favicon.ico",
  "/manifest.json",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Archivos cacheados correctamente");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log("Error al cachear:", err)),
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Eliminando caché antigua:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Estrategia: Cache First, luego Red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Si está en caché, devolver desde caché
        if (response) {
          return response;
        }
        // Si no, ir a la red
        return fetch(event.request).then((networkResponse) => {
          // Verificar si la respuesta es válida
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }
          // Clonar respuesta para guardar en caché
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
      .catch(() => {
        // Si falla todo, mostrar página offline personalizada (opcional)
        // return caches.match('/offline.html');
      }),
  );
});