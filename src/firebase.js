// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCCgRLK8Uvt7EyBWj8QsaZlESgvyrAMwpo",
  authDomain: "wedding-invitation-e1f08.firebaseapp.com",
  projectId: "wedding-invitation-e1f08",
  storageBucket: "wedding-invitation-e1f08.firebasestorage.app",
  messagingSenderId: "178967269510",
  appId: "1:178967269510:web:3d5b61e2ffdf1f5665c107",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스
export const db = getFirestore(app);

// Storage (이미지 저장용)
export const storage = getStorage(app);

export default app;
