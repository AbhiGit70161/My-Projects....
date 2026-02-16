import { db, auth} from './fb-config.js';
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, updateDoc, doc, query, where, setDoc, deleteDoc, serverTimestamp, getDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { logAction } from './logger.js';

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');

if (toggleBtn && sidebar) {
    toggleBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.classList.toggle('expanded');
        }
    };
}

// --- NAVIGATION LOGIC (To make your sidebar work) ---
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
        document.getElementById(target).style.display = 'block';
        
        const sectionName = item.innerText;
        document.getElementById('section-title').innerText = sectionName;

        if (target === 'approve-students-section') loadPendingStudents();
        if (target === 'manage-teachers-section') loadTeachers();
    });
});

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        
        item.classList.add('active');
        
        const target = item.getAttribute('data-target');
        switchSection(target); 
    });
});

let currentUserName = "Admin";

async function fetchCurrentUserName(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        
        if (userDoc.exists()) {
            currentUserName = userDoc.data().name;
        } 
        else {
            console.log("Direct lookup failed. Searching collection...");
            const q = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
                currentUserName = doc.data().name;
            });
        }

        // Update the screen
        const nameDisplay = document.getElementById('userNameDisplay');
        if (nameDisplay) {
            nameDisplay.innerText = currentUserName;
            nameDisplay.classList.add('name-loaded');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // We pass the logged-in user's ID to your function
        fetchCurrentUserName(user.uid); 
    } else {
        // If no one is logged in, send them back to login page
        window.location.href = "Auth.html";
    }
});

// --- YOUR ADD TEACHER LOGIC ---
const addTeacherForm = document.getElementById('addTeacherForm');
if (addTeacherForm) {
    addTeacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const teacherData = {
            name: document.getElementById('teacherName').value,
            dept: document.getElementById('teacherDept').value,
            subject: document.getElementById('teacherSubject').value,
            role: 'teacher'
        };
        try {
            await addDoc(collection(db, "teachers"), teacherData);
            logAction(`Admin added teacher: ${teacherData.name}`);
            alert("Teacher added!");
            addTeacherForm.reset();
        } catch (error) { console.error(error); }
    });
}

async function registerTeacher() {
    const name = document.getElementById('teacherName').value;
    const subject = document.getElementById('teacherSubject').value;
    const department = document.getElementById('teacherDept').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;

    try {
        // 1. Create the Auth Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 2. Save to 'users' collection (For Login/Permissions)
        await setDoc(doc(db, "users", uid), {
            uid: uid,
            name: name,
            email: email,
            role: "teacher",
            status: "approved"
        });

        // 3. Save to 'teachers' collection (For Student Search)
        await setDoc(doc(db, "teachers", uid), {
            name: name,
            subject: subject,
            dept: department,
            email: email,
            createdAt: serverTimestamp()
        });

        alert("Teacher Registered Successfully! They can now log in.");
        addTeacherForm.reset();
    } catch (error) {
        console.error("Registration failed:", error);
        alert("Error: " + error.message);
    }
}

const addBtn = document.getElementById('addTeacherBtn');
if (addBtn) {
    addBtn.addEventListener('click', registerTeacher);
}

// --- YOUR LOAD PENDING STUDENTS (Optimized) ---
async function loadPendingStudents() {
    const listBody = document.getElementById('studentListBody');
    listBody.innerHTML = "Loading...";

    const q = query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    listBody.innerHTML = "";

    querySnapshot.forEach((sDoc) => {
        const student = sDoc.data();
        listBody.innerHTML += `<tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.status}</td>
            <td><button class="action-btn" onclick="approveStudent('${sDoc.id}')">Approve</button></td>
        </tr>`;
    });
}

// --- NEW: LOAD TEACHERS (To fill your Manage Teachers table) ---
async function loadTeachers() {
    const listBody = document.getElementById('teacherListBody');
    const querySnapshot = await getDocs(collection(db, "teachers"));
    listBody.innerHTML = "";
    querySnapshot.forEach((tDoc) => {
        const t = tDoc.data();
        listBody.innerHTML += `<tr>
            <td>${t.name}</td>
            <td>${t.dept}</td>
            <td>${t.subject}</td>
            <td><button class="action-btn red" onclick="deleteTeacher('${tDoc.id}')">Remove</button></td>
        </tr>`;
    });
}

window.approveStudent = async (id) => {
    await updateDoc(doc(db, "users", id), { status: 'approved' });
    logAction(`Admin approved student: ${id}`);
    loadPendingStudents();
};

// Initialize the first view
document.getElementById('add-teacher-section').style.display = 'block';

// --- LOGOUT LOGIC ---
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                // Redirect to your login page after successful logout
                alert("Logged out successfully!");
                window.location.href = "Auth.html"; 
            })
            .catch((error) => {
                console.error("Logout Error:", error);
                alert("Error logging out. Check console.");
            });
    });
}

window.deleteTeacher = async (id) => {
    if(confirm("Are you sure you want to remove this teacher?")) {
        await deleteDoc(doc(db, "teachers", id));
        logAction(`Admin removed teacher: ${id}`);
        loadTeachers(); 
    }
};