import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApQCkI22x5Zj114k0Po-Ym6RCDAbBLmng",
  authDomain: "tastebuds-e3fcc.firebaseapp.com",
  projectId: "tastebuds-e3fcc",
  storageBucket: "tastebuds-e3fcc.appspot.com",
  messagingSenderId: "679701602",
  appId: "1:679701602:web:04b54d1728512309ebb53b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
