// src/firebase.js

// Import required Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCr1UnmM14gQE1TfcuQSsv37TrLPg7OECI",
  authDomain: "lets-v-9ee3f.firebaseapp.com",
  projectId: "lets-v-9ee3f",
  storageBucket: "lets-v-9ee3f.firebasestorage.app",
  messagingSenderId: "532091645528",
  appId: "1:532091645528:web:2f18c12362e81e9619a42d",
  measurementId: "G-DQVLJJXBPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
