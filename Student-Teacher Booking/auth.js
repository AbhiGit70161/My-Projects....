import { auth, db } from './fb-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { logAction } from './logger.js';

// --- 1. LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;

        try {
            // Step A: Attempt Firebase Authentication
            const userCred = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCred.user;

            // Step B: Fetch User Role/Status from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                logAction(`Login successful: Role = ${userData.role}`, email);
                
                // Step C: Role-Based Redirection
                if (userData.role === 'admin') {
                    window.location.href = 'admin.html';
                } 
                else if (userData.role === 'teacher') {
                    window.location.href = 'teacher.html';
                } 
                else if (userData.role === 'student') {
                    
                    if (userData.status === 'approved') {
                        window.location.href = 'student.html';
                    } else {
                        alert("Your account is still pending admin approval. Please check back later.");
                        logAction("Access denied: Student account pending", email);
                    }
                }
            } else {
                alert("User profile not found in database.");
                logAction("Error: Auth exists but Firestore document missing", email);
            }

        } catch (error) {
            console.error("Login Error:", error.code);
            logAction(`Login failed: ${error.message}`, email);
            alert("Login Failed: " + error.message);
        }
    });
}

//2. NAVIGATION TO REGISTER PAGE
const goToRegister = document.getElementById('goToRegister');

if (goToRegister) {
    goToRegister.addEventListener('click', () => {
        // Redirects the student to the registration file
        window.location.href = 'register.html'; 
    });
}