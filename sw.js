/* Installeerbare app-schil. Netwerk eerst, laatst ontvangen stand als reserve. */
var CACHE = "cryptodokter-app-v1";
var SHELL = [
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/favicon-32.png",
  "/apple-touch-icon.png",
  "/icons/icon.svg",
  "/icons/icon-maskable.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function stableKey(url) {
  var u = new URL(url);
  if (u.pathname.slice(-5) === ".json") u.search = "";
  return u.origin + u.pathname + u.search;
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request).then(function (fresh) {
      if (fresh && fresh.ok && fresh.type === "basic") {
        var copy = fresh.clone();
        caches.open(CACHE).then(function (cache) {
          return cache.put(stableKey(request.url), copy);
        }).catch(function () {});
      }
      return fresh;
    }).catch(function (err) {
      if (request.signal && request.signal.aborted) throw err;
      return caches.open(CACHE).then(function (cache) {
        return cache.match(stableKey(request.url)).then(function (hit) {
          if (hit) return hit;
          if (request.mode === "navigate") return cache.match("/");
          throw err;
        });
      });
    })
  );
});
