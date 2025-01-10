// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOdw39-p6EEndPEpLfZNSMOK3PcPxtfrU",
  authDomain: "vijay-368b8.firebaseapp.com",
  databaseURL: "https://vijay-368b8-default-rtdb.firebaseio.com",
  projectId: "vijay-368b8",
  storageBucket: "vijay-368b8.appspot.com",
  messagingSenderId: "754141435698",
  appId: "1:754141435698:web:006b4cd733da7cfcb6692b",
  measurementId: "G-5VYDB51CQ2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
