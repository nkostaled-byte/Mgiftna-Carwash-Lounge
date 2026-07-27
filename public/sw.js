const CACHE_NAME = "mgiftanas-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/icon.svg",
  "/manifest.json"
];

// Install Event - cache core resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - network first with cache fallback, cache-first for images
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  const isImage = 
    event.request.destination === "image" ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)/i) ||
    url.hostname.includes("images.unsplash.com") ||
    url.hostname.includes("res.cloudinary.com");

  if (isImage) {
    // Cache First Strategy for Images (both local and remote)
    event.respondWith(
      caches.open("mgiftanas-images-cache-v1").then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached image instantly
            return cachedResponse;
          }
          
          // Fallback to network fetch, then cache the result
          return fetch(event.request, { mode: "no-cors" }).then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // If offline and request failed, try checking default caches
            return caches.match(event.request);
          });
        });
      })
    );
    return;
  }

  // Only cache GET requests and skip external API or chrome-extension protocols
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // fallback to index.html for client-side routing
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
