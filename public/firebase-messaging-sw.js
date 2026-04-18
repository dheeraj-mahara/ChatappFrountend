importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB5grnfq-ncTYE-6Ri_nl_y4AUyUKRG638",
  authDomain: "chatvibe-d.firebaseapp.com",
  projectId: "chatvibe-d",
  storageBucket: "chatvibe-d.firebasestorage.app",
  messagingSenderId: "82194989789",
  appId: "1:82194989789:web:39a08e63199cd91d69d134",
  measurementId: "G-8N9BN1L639"
});

const messaging = firebase.messaging();

const CACHE_NAME = "chatvibe-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});