import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { logAction } from "./logger.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRGhSS2DXM0doWFpTc_DQ98bb1dIOnI0A",
  authDomain: "student-teacher-appointm-5a3d5.firebaseapp.com",
  databaseURL: "https://student-teacher-appointm-5a3d5-default-rtdb.firebaseio.com",
  projectId: "student-teacher-appointm-5a3d5",
  storageBucket: "student-teacher-appointm-5a3d5.firebasestorage.app",
  messagingSenderId: "182182521924",
  appId: "1:182182521924:web:005fa7d4b7288cf2e9e011",
  measurementId: "G-Z2RG4B55YP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

logAction("Firebase services initialized and connected to project: student-teacher-appointm-5a3d5");