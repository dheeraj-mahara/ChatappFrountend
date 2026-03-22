import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
 apiKey: "AIzaSyB5grnfq-ncTYE-6Ri_nl_y4AUyUKRG638",
  authDomain: "chatvibe-d.firebaseapp.com",
  projectId: "chatvibe-d",
  storageBucket: "chatvibe-d.firebasestorage.app",
  messagingSenderId: "82194989789",
  appId: "1:82194989789:web:39a08e63199cd91d69d134",
  measurementId: "G-8N9BN1L639"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);