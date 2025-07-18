
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWs4SbO_0noOgRTWDX9hwwIbTe1aGgwJw",
  authDomain: "affordindia-a602c.firebaseapp.com",
  projectId: "affordindia-a602c",
  storageBucket: "affordindia-a602c.firebasestorage.app",
  messagingSenderId: "737953463509",
  appId: "1:737953463509:web:138c2c1e58b04f4b20b65c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
