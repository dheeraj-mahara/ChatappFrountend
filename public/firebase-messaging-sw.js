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

// messaging.onBackgroundMessage(function (payload) {

//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body
//   });
// });

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (event) => { });