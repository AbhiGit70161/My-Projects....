import { auth, db } from './fb-con.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, getDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
            initAdminListeners();
        } 
        else {
            alert("Access Denied: Admins Only.");
            window.location.href = 'Login.html';
        }
    } 
    else {
        window.location.href = 'Login.html';
    }
});

function initAdminListeners() {
    loadCategories();
    loadCities();
}

const catForm = document.getElementById('add-category-form');
catForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sportsName = document.getElementById('new-category').value;
    try {
        await addDoc(collection(db, "categories"), { sportsName });
        catForm.reset();
    } catch (err) { alert(err.message); }
});

function loadCategories() {
    const q = query(collection(db, "categories"), orderBy("sportsName", "asc"));
    onSnapshot(q, (snap) => {
        const list = document.getElementById('category-list');
        list.innerHTML = '<h3>Current Sports:</h3>';
        snap.forEach(d => {
            const item = document.createElement('div');
            item.className = 'admin-item';
            item.innerHTML = `
                <span>${d.data().sportsName}</span> 
                <div>
                    <i class="fas fa-edit" onclick="updateData('categories', '${d.id}', '${d.data().sportsName}')"></i>
                    <i class="fas fa-trash" onclick="deleteData('categories', '${d.id}')"></i>
                </div>`;
            list.appendChild(item);
        });
    });
}

const cityForm = document.getElementById('add-city-form');
cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityName = document.getElementById('new-city').value;
    try {
        await addDoc(collection(db, "cities"), { cityName });
        cityForm.reset();
    } catch (err) { alert(err.message); }
});

const areaForm = document.getElementById('add-area-form');
areaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityId = document.getElementById('city-dropdown').value;
    const areaName = document.getElementById('new-area').value;
    try {
        await addDoc(collection(db, "areas"), { cityId, areaName });
        areaForm.reset();
    } catch (err) { alert(err.message); }
});

function loadCities() {
    const cityDropdown = document.getElementById('city-dropdown');
    const q = query(collection(db, "cities"), orderBy("cityName", "asc"));
    
    onSnapshot(q, (snap) => {
        cityDropdown.innerHTML = '<option value="" disabled selected>Select City</option>';
        snap.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.data().cityName;
            cityDropdown.appendChild(opt);
        });
    });
}

window.updateData = async (coll, id, oldName) => {
    const newName = prompt(`Update name for ${oldName}:`, oldName);
    if (newName && newName !== oldName) {
        try {
            const docRef = doc(db, coll, id);
            const updateObj = coll === 'categories' ? { sportsName: newName } : { cityName: newName };
            await updateDoc(docRef, updateObj);
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    }
};

window.deleteData = async (coll, id) => {
    if (confirm("Delete this item permanently?")) {
        await deleteDoc(doc(db, coll, id));
    }
};

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = 'Login.html');
    });
}