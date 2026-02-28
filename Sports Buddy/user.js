import { auth, db } from './fb-con.js';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        fetchUserEvents();
        setupLocationDropdowns();
    } else {
        window.location.href = 'Login.html';
    }
});

function setupLocationDropdowns() {
    const sportSelect = document.getElementById('sport-category');
    const citySelect = document.getElementById('event-city');
    const areaSelect = document.getElementById('event-area');

    onSnapshot(query(collection(db, "categories"), orderBy("sportsName", "asc")), (snap) => {
        sportSelect.innerHTML = '<option value="" disabled selected>Select Sport</option>';
        snap.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.data().sportsName; 
            opt.textContent = d.data().sportsName;
            sportSelect.appendChild(opt);
        });
    });

    onSnapshot(query(collection(db, "cities"), orderBy("cityName", "asc")), (snap) => {
        citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
        snap.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.dataset.name = d.data().cityName;
            opt.textContent = d.data().cityName;
            citySelect.appendChild(opt);
        });
    });

    citySelect.addEventListener('change', (e) => {
        const cityId = e.target.value;
        const q = query(collection(db, "areas"), where("cityId", "==", cityId));

        onSnapshot(q, (snap) => {
            areaSelect.innerHTML = '<option value="" disabled selected>Select Area</option>';
            snap.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.data().areaName;
                opt.textContent = d.data().areaName;
                areaSelect.appendChild(opt);
            });
        });
    });
}

const addEventForm = document.getElementById('add-event-form');
if (addEventForm) {
    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const citySelect = document.getElementById('event-city');
        const selectedOption = citySelect.options[citySelect.selectedIndex];
        const cityName = selectedOption ? selectedOption.dataset.name : "";

        const eventData = {
            userId: currentUser.uid,
            eventName: document.getElementById('event-name').value,
            sport: document.getElementById('sport-category').value,
            city: cityName,
            area: document.getElementById('event-area').value,
            time: document.getElementById('event-time').value,
            level: document.getElementById('ability-level').value,
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(collection(db, "events"), eventData);
            alert("Match Hosted Successfully!");
            addEventForm.reset();
        } catch (error) {
            alert("Error adding event: " + error.message);
        }
    });
}

function fetchUserEvents() {
    const eventsList = document.getElementById('events-list');
    const q = query(collection(db, "events"), where("userId", "==", currentUser.uid));

    onSnapshot(q, (snapshot) => {
        eventsList.innerHTML = '';
        
        if (snapshot.empty) {
            eventsList.innerHTML = '<p>No matches hosted yet. Start one above!</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const event = doc.data();
            const eventId = doc.id;

            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <h3>${event.eventName}</h3>
                <p><strong>Sport:</strong> ${event.sport}</p>
                <p><strong>Location:</strong> ${event.area}, ${event.city}</p>
                <p><strong>Time:</strong> ${new Date(event.time).toLocaleString()}</p>
                <p><strong>Level:</strong> ${event.level}</p>
                <div class="card-actions">
                    <span class="edit-btn" onclick="editEvent('${eventId}', '${event.eventName}')">
                        <i class="fas fa-edit"></i> Edit
                    </span>
                    <span class="delete-btn" onclick="deleteEvent('${eventId}')">
                        <i class="fas fa-trash"></i> Delete
                    </span>
                </div>
            `;
            eventsList.appendChild(card);
        });
    });
}

window.deleteEvent = async (id) => {
    if (confirm("Are you sure you want to cancel this event?")) {
        try {
            await deleteDoc(doc(db, "events", id));
        } catch (error) {
            console.error("Delete Failed", error);
        }
    }
};

window.editEvent = async (id, currentName) => {
    const newName = prompt("Enter new event name:", currentName);
    if (newName && newName !== currentName) {
        try {
            await updateDoc(doc(db, "events", id), { eventName: newName });
        } catch (error) {
            console.error("Update failed", error);
        }
    }
};

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'Login.html';
    });
});