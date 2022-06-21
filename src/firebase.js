import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyDtuZgRm8gosGRP_IPQQ5K1m8TQsudLa64",
  authDomain: "vi-learning.firebaseapp.com",
  projectId: "vi-learning",
  storageBucket: "vi-learning.appspot.com",
  messagingSenderId: "135566345452",
  appId: "1:135566345452:web:d002db1f3a844d3ac691c9",
  measurementId: "G-N4QR25YKQX",
});

export const auth = getAuth(firebaseConfig);
export const firestore = getFirestore(firebaseConfig);
export const storage = getStorage(firebaseConfig);
