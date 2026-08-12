const CACHE_NAME = "real-or-fake-pwa-v1";
const OFFLINE_URL = "offline.html";
const IMAGE_COUNT = 50;

const CORE_ASSETS = [
  "./",
  "index.html",
  "about.html",
  "additional_information.html",
  "dialog.html",
  "form.html",
  "impressum.html",
  "phase-summary.html",
  "quiz.html",
  "training1.html",
  "tutorial.html",
  OFFLINE_URL,
  "manifest.webmanifest",
  "style.css",
  "ai_agent.css",
  "footer_links.css",
  "form-style.css",
  "numbered_list.css",
  "phase-summary.css",
  "quiz-style.css",
  "training.css",
  "tutorial-style.css",
  "additional_information.css",
  "dialog-script.js",
  "footer-script.js",
  "form-validation.js",
  "i18n.js",
  "script.js",
  "additional_information.js",
  "phase-summary.js",
  "quiz.js",
  "training.js",
  "tutorial-script.js",
  "Agent_MIB.png",
  "Gemini_Generated_Image_uiqurluiqurluiqu.png",
  "pwa-icon.svg",
  "pwa-maskable.svg"
];

for (let i = 1; i <= IMAGE_COUNT; i += 1) {
  CORE_ASSETS.push(`Img/R/${i}.png`);
  CORE_ASSETS.push(`Img/F/${i}.png`);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          return cachedPage || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});