import { auth, db } from './fb-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { logAction } from './logger.js';

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPassword').value;

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, pass);
            
            await setDoc(doc(db, "users", userCred.user.uid), {
                name: name,
                email: email,
                role: 'student',
                status: 'pending'
            });

            logAction("New student registered: Pending Approval", email);
            alert("Registration successful! Please wait for Admin approval before logging in.");
            window.location.href = 'Auth.html';

        } catch (error) {
            alert("Registration Error: " + error.message);
        }
    });
}