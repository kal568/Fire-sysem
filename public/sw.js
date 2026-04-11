self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("fire-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "login.html",
        "dashboard.html"
      ]);
    })
  );
});
