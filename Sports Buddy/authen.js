import { auth, db } from './fb-con.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function handleRoleRedirect(user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
            window.location.href = 'Admn.html';
        } else {
            window.location.href = 'User.html';
        }
    } else {
        alert("Account error: No role found. Please contact support.");
    }
}

const regForm = document.getElementById('user-register');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                fullName: name,
                email: email,
                role: 'user',
                createdAt: new Date()
            });

            alert("Registration successful! Please login.");
            location.reload(); 
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
}

const userLoginForm = document.getElementById('user-login');
if (userLoginForm) {
    userLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleRoleRedirect(userCredential.user);
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    });
}

const adminLoginForm = document.getElementById('admin-login');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                window.location.href = 'Admn.html';
            } else {
                alert("Access Denied: You do not have administrator privileges.");
                await auth.signOut();
            }
        } catch (error) {
            alert("Admin Login Failed: " + error.message);
        }
    });
}