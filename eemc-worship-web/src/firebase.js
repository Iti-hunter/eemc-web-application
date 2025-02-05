import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAo_70mbObFEn1P_1tASreLEa5B3-uBrAw",
  authDomain: "eemcworshipv2.firebaseapp.com",
  projectId: "eemcworshipv2",
  storageBucket: "eemcworshipv2.firebasestorage.app",
  messagingSenderId: "1043367039876",
  appId: "1:1043367039876:android:f29bb33ff07326d1e503d1"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Initialisation Firestore
const db = getFirestore(app);

// Initialisation Auth
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export { db, auth };

