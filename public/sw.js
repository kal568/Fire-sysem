const CACHE_NAME = "fire-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/dashboard.html"
];

// 🔥 INSTALL
self.addEventListener("install", (e) => {
  console.log("Service Worker Installed");

  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// 🔥 ACTIVATE
self.addEventListener("activate", (e) => {
  console.log("Service Worker Activated");

  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// 🔥 FETCH (Offline Support)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        return response; // return cached version
      }

      return fetch(e.request)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, res.clone()); // save new request
            return res;
          });
        })
        .catch(() => {
          // fallback if offline and not cached
          return caches.match("/index.html");
        });
    })
  );
});
