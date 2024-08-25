// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV5DCp1MGLDDvTAPM37sEOywVgwz9TB2Y",
  authDomain: "iot-physics.firebaseapp.com",
  projectId: "iot-physics",
  storageBucket: "iot-physics.appspot.com",
  messagingSenderId: "117511795733",
  appId: "1:117511795733:web:5e1d9b4d2cc0be30610a1c",
  measurementId: "G-6N1LXH2133"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };