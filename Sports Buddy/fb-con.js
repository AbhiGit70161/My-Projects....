import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgjQaHxeUwQFKxOnBhsJmyF6emwFIpS7U",
    authDomain: "sports-buddy-1f220.firebaseapp.com",
    projectId: "sports-buddy-1f220",
    storageBucket: "sports-buddy-1f220.firebasestorage.app",
    messagingSenderId: "725479076159",
    appId: "1:725479076159:web:26f0160ece3244f8d0a38a",
    measurementId: "G-Q10PNW0SGL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Sports Buddy: Firebase Initialized");