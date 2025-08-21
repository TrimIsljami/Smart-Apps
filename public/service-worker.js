const CACHE_NAME = "smart-pantry-cache-v4";
const ASSET_CACHE = "smart-pantry-assets-v4";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html"
];
const ASSETS = [
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)),
      caches.open(ASSET_CACHE).then(cache => cache.addAll(ASSETS))
    ])
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== ASSET_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  if (event.request.destination === "image" || event.request.destination === "style" || event.request.destination === "script") {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(ASSET_CACHE).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener("push", event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Smart Pantry", {
      body: data.body || "Herinnering van Smart Pantry",
      icon: "/icons/icon-192.png"
    })
  );
});

self.addEventListener("sync", event => {
  if (event.tag === "sync-shopping-list") {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ action: "SYNC_ITEMS" }));
      })
    );
  }
});
