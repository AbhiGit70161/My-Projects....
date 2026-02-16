import { db, auth } from './fb-config.js';
import { collection, getDocs, addDoc, query, where, serverTimestamp, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { logAction } from './logger.js';

let allTeachers = [], currentUserName = "Student";
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
        const sectionTitle = document.getElementById('section-title');
        document.querySelectorAll('.content-section').forEach(s => s.style.display = s.id === target ? 'block' : 'none');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        if (sectionTitle) {
            sectionTitle.innerText = item.innerText; 
        }
        if (target === 'my-bookings-section') loadMyAppointments();
        if (target === 'sent-messages-section') loadSentMessages();
    };
});

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

// --- 2. FETCH & DISPLAY TEACHERS (Optimized) ---
async function fetchTeachers() {
    try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        // Store in our local array so search is instant
        allTeachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTeacherGrid(allTeachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
    }
}

function renderTeacherGrid(teachers) {
    const grid = document.getElementById('teacherGrid');
    grid.innerHTML = "";

    if (teachers.length === 0) {
        grid.innerHTML = `<p class="no-results">No mentors found.</p>`;
        return;
    }

    teachers.forEach((t) => {
        const availabilityInfo = (t.availableDay && t.availableTime) 
            ? `<p class="availability-tag">🟢 Next: ${t.availableDay} at ${t.availableTime}</p>`
            : `<p class="availability-tag">⚪ No schedule set</p>`;

        grid.innerHTML += `
            <div class="teacher-card glass">
                <h3>${t.name}</h3>
                <p class="subject"><b>Subject:</b> ${t.subject}</p>
                <p class="dept"><b>Dept:</b> ${t.dept || 'General'}</p>
                ${availabilityInfo}
                <button class="book-now-btn" onclick="bookTeacher('${t.id}', '${t.name}')">Book Now</button>
            </div>`;
    });

    const msgSelect = document.getElementById('msgTeacherSelect');
    
    if (msgSelect) {
        msgSelect.innerHTML = '<option value="">-- Choose Teacher --</option>';
        teachers.forEach(t => {
        msgSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
    });
}
}

// --- 3. REAL-TIME SEARCH (Your logic, but faster) ---
const searchInput = document.getElementById('teacherSearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter from our local 'allTeachers' array instead of re-fetching from DB
        const filtered = allTeachers.filter(t => 
            t.name.toLowerCase().includes(searchTerm) || 
            t.subject.toLowerCase().includes(searchTerm)
        );
        
        renderTeacherGrid(filtered);
    });
}

// --- 4. BOOKING LOGIC (Your logic) ---
window.bookTeacher = async (id, name) => {
    // We grab the elements first to avoid 'undefined' errors
    const dateEl = document.getElementById('apptDate');
    const timeEl = document.getElementById('apptTime');
    const reasonEl = document.getElementById('apptReason');

    if (!dateEl.value || !timeEl.value) {
        alert("Please select both a date and a time in the inputs above!");
        return;
    }

    try {
        await addDoc(collection(db, "appointments"), { 
            teacherId: id, 
            teacherName: name, 
            studentId: auth.currentUser.uid, 
            studentName: currentUserName, 
            date: dateEl.value, 
            time: timeEl.value, 
            reason: reasonEl.value || "General", 
            status: 'pending', 
            timestamp: serverTimestamp() 
        });
        
        alert(`Booking Request Sent to ${name}!`);
        // Clear inputs
        dateEl.value = ""; timeEl.value = ""; reasonEl.value = "";
    } catch (error) {
        alert("Booking failed: " + error.message);
    }
};

// --- 5. FETCH MY APPOINTMENTS ---
async function loadMyAppointments() {
    const body = document.getElementById('studentBookingsBody');
    const q = query(collection(db, "appointments"), where("studentId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    
    body.innerHTML = snap.empty ? "<tr><td colspan='4'>No bookings.</td></tr>" : 
        snap.docs.map(d => {
            const a = d.data();
            return `<tr><td>${a.teacherName}</td><td>${a.date} ${a.time}</td><td>${a.reason}</td>
                    <td><span class="status-badge ${a.status}">${a.status}</span></td></tr>`;
        }).join('');
}

messageForm.onsubmit = async (e) => {
    e.preventDefault();
    const [tId, sub, msg] = ['msgTeacherSelect', 'msgSubject', 'msgContent'].map(i => document.getElementById(i).value);
    const tName = allTeachers.find(t => t.id === tId)?.name;

    if (!tId || !sub || !msg) return alert("Fill all fields!");
    await addDoc(collection(db, "messages"), { 
        senderId: auth.currentUser.uid, senderName: currentUserName, 
        receiverId: tId, receiverName: tName, subject: sub, content: msg, 
        status: 'unread', timestamp: serverTimestamp() 
    });
    alert("Message Sent!");
    messageForm.reset();
};

async function loadSentMessages() {
    const container = document.getElementById('sentMessagesInbox');
    container.innerHTML = '<div class="loader">Loading sent items...</div>';

    const q = query(collection(db, "messages"), where("senderId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);

    if (snap.empty) {
        container.innerHTML = `<p style="color:#888; text-align:center; padding:20px;">You haven't sent any messages yet.</p>`;
        return;
    }

    container.innerHTML = snap.docs.map(d => {
        const m = d.data();
        const isRead = m.status === 'read';
        const dateStr = m.timestamp?.toDate().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) || 'Recently';

        return `
        <div class="message-item glass" style="border-left: 4px solid ${isRead ? '#10b981' : '#6366f1'};">
            <div class="msg-header" style="display:flex; justify-content:space-between;">
                <span style="color:#00d4ff;"><strong>To:</strong> ${m.receiverName}</span>
                <span style="font-size:0.8rem; color:#666;">${dateStr}</span>
            </div>
            <p style="margin:10px 0;"><strong>Subject:</strong> ${m.subject}</p>
            <p style="font-size:0.9rem; color:#ccc;">${m.content}</p>
            
            <div style="text-align:right; margin-top:10px;">
                ${isRead ? 
                    `<span style="color:#10b981; font-weight:bold; font-size:0.85rem;">✅ Seen and Read</span>` : 
                    `<span style="color:#f59e0b; font-size:0.85rem;">📩 Sent (Unread)</span>`
                }
            </div>
        </div>`;
    }).join('');
}

// --- 6. LOGOUT ---
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                alert("Logged out successfully!");
                window.location.href = "Auth.html"; 
            })
            .catch((error) => {
                console.error("Logout Error:", error);
                alert("Error logging out. Check console.");
            });
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is authenticated:", user.uid);
        fetchCurrentUserName(user.uid);
        fetchTeachers();
    } else {
        window.location.href = 'Auth.html';
    }
});