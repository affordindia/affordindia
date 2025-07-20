import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAWs4SbO_0noOgRTWDX9hwwIbTe1aGgwJw",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "affordindia-a602c.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "affordindia-a602c",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "affordindia-a602c.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "737953463509",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:737953463509:web:138c2c1e58b04f4b20b65c",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XY9TS5K7K9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
