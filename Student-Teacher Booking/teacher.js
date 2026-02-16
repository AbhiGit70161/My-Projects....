import { db, auth } from './fb-config.js';
import { collection, query, where, getDocs, updateDoc, doc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// --- 1. SIDEBAR NAVIGATION ---
document.querySelectorAll('.nav-item').forEach(item => {
    item.onclick = () => {
        const target = item.dataset.target;
        document.querySelectorAll('.content-section').forEach(s => s.style.display = s.id === target ? 'block' : 'none');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('section-title').innerText = item.innerText;

        if (target === 'appointments-section') loadAllAppointments();
        if (target === 'requests-section') loadPendingRequests();
        if (target === 'messages-section') loadStudentMessages();
    };
});

let currentUserName = "Teacher";

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
        fetchCurrentUserName(user.uid);
        loadAllAppointments();
    } else {
        window.location.href = "Auth.html";
    }
});

// --- 2. LOAD ALL APPOINTMENTS (The Main Table) ---
async function loadAllAppointments() {
    const body = document.getElementById('appointmentListBody');
    const q = query(collection(db, "appointments"), where("teacherId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);

    body.innerHTML = snap.empty ? "<tr><td colspan='4'>No appointments.</td></tr>" : 
        snap.docs.map(d => {
            const a = d.data();
            return `<tr><td>${a.date} | ${a.time}</td><td>${a.studentName}</td>
                    <td>${a.reason || 'General'}</td>
                    <td><span class="status-badge ${a.status}">${a.status}</span></td></tr>`;
        }).join('');
}

// --- 3. LOAD PENDING REQUESTS (The "Action" Section) ---
async function loadPendingRequests() {
    const container = document.getElementById('pendingRequestsContainer');
    const q = query(collection(db, "appointments"), where("teacherId", "==", auth.currentUser.uid), where("status", "==", "pending"));
    const snap = await getDocs(q);

    container.innerHTML = snap.empty ? "<p>No pending requests.</p>" : 
        snap.docs.map(d => {
            const r = d.data();
            return `
            <div class="glass-card request-card">
                <p><b>Student:</b> ${r.studentName}</p>
                <p><b>Time:</b> ${r.date} at ${r.time}</p>
                <div class="card-actions">
                    <button class="approve-btn" onclick="updateStatus('${d.id}', 'approved')">Accept</button>
                    <button class="delete-btn" onclick="updateStatus('${d.id}', 'rejected')">Reject</button>
                </div>
            </div>`;
        }).join('');
}

// --- 4. UPDATE APPOINTMENT STATUS ---
window.updateStatus = async (id, newStatus) => {
    try {
        await updateDoc(doc(db, "appointments", id), { 
            status: newStatus,
            updatedAt: serverTimestamp() 
        });
        alert(`Request ${newStatus}!`);
        loadPendingRequests(); // Refresh the requests list
        loadAllAppointments(); // Refresh the main table
    } catch (error) {
        console.error("Update failed", error);
    }
};

const scheduleForm = document.getElementById('scheduleForm');
if (scheduleForm) {
    scheduleForm.onsubmit = async (e) => {
        e.preventDefault();
        const [day, start, end] = ['availableDate', 'startTime', 'endTime'].map(id => document.getElementById(id).value);
        const fullSlot = `${start} - ${end}`;

        await updateDoc(doc(db, "teachers", auth.currentUser.uid), {
            availableDay: day,
            availableTime: fullSlot,
            lastUpdated: serverTimestamp()
        });
        alert("Schedule updated!");
        scheduleForm.reset();
    };
}

async function loadStudentMessages() {
    const inbox = document.getElementById('messageInbox');
    if (!inbox) return;

    // 1. Clear the inbox and show loader
    inbox.innerHTML = '<div class="loader">Fetching your messages...</div>';

    try {
        const q = query(collection(db, "messages"), where("receiverId", "==", auth.currentUser.uid));
        const snap = await getDocs(q);

        // 2. Handle Empty State
        if (snap.empty) {
            inbox.innerHTML = `<p style="color:#888; text-align:center; margin-top:20px;">No messages from students yet.</p>`;
            return;
        }

        // 3. Render Real Messages
        inbox.innerHTML = snap.docs.map(d => {
            const m = d.data();
            const isUnread = m.status === 'unread';
            const dateStr = m.timestamp?.toDate().toLocaleString([], { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
            }) || 'Recently';

            return `
            <div class="message-item glass ${isUnread ? 'unread-bg' : ''}">
                <div class="msg-header">
                    <span class="msg-sender" style="color:#00d4ff; font-size: 1.1rem; font-weight:bold;">
                        ${isUnread ? '🔵' : '✅'} From: ${m.senderName}
                    </span>
                </div>
                
                <p class="msg-subject" style="margin: 10px 0; color:#fff;">
                    <strong>Subject:</strong> ${m.subject}
                </p>
                
                <p class="msg-body" style="color:#ccc; line-height:1.5;">${m.content}</p>
                
                <div class="msg-meta-row">
                    <span class="msg-date" style="color:#777; font-size:0.8rem;">${dateStr}</span>
                </div>

                <div class="msg-footer" style="display:flex; justify-content:flex-end; margin-top:15px;">
                    ${isUnread ? 
                        `<button class="read-btn" onclick="markAsRead('${d.id}')">Mark as Read</button>` : 
                        `<span style="color:#555; font-style:italic; font-size:0.85rem;">Message Read</span>`
                    }
                </div>
            </div>`;
        }).join('');

    } catch (error) {
        console.error("Error loading messages:", error);
        inbox.innerHTML = `<p style="color:red;">Failed to load messages. Please refresh.</p>`;
    }
}

// --- Update Message Status ---
window.markAsRead = async (msgId) => {
    try {
        const msgRef = doc(db, "messages", msgId);
        await updateDoc(msgRef, { status: 'read' });
        
        // Refresh the inbox to update the UI
        loadStudentMessages();
    } catch (err) {
        console.error("Error updating status:", err);
        alert("Could not update message status.");
    }
};

// --- 5. LOGOUT ---
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