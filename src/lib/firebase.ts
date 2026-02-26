// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBQJyhPX6KKabrtyZIIFApJnbuvaGx9xv0",
    authDomain: "safaiconnect.firebaseapp.com",
    projectId: "safaiconnect",
    storageBucket: "safaiconnect.firebasestorage.app",
    messagingSenderId: "646493037655",
    appId: "1:646493037655:web:8bd824355c6b2ea2082f12",
    measurementId: "G-HB8DPD6TKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

import { getMessaging } from 'firebase/messaging';

// Firebase Messaging (FCM) — only initialise in browser context
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;