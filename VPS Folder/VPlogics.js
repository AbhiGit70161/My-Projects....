// 1. Initial Stats (100 is full/best, 0 is empty/worst)
let hunger = 100;    // 100 = Full, 0 = Starving
let happiness = 100; // 100 = Happy, 0 = Sad
let energy = 100;    // 100 = Energetic, 0 = Exhausted

// 2. DOM Elements
const hungerBar = document.getElementById('hunger-bar');
const happinessBar = document.getElementById('happiness-bar');
const energyBar = document.getElementById('energy-bar');
const petContainer = document.getElementById('pet-container');
const petMessage = document.getElementById('pet-message');

const TICK_RATE = 3000; // Stats drop every 3 seconds

// 3. Interaction Functions
function feedPet() {
    if (hunger < 100) {
        hunger = Math.min(hunger + 20, 100);
        updateUI("Yum! That bone was delicious! 🦴");
    } else {
        updateUI("I'm too full to eat!");
    }
}

function playPet() {
    if (energy > 20) {
        happiness = Math.min(happiness + 20, 100);
        energy = Math.max(energy - 15, 0);
        
        // --- UPDATE 1: Match the selector to '.dog-wrapper' ---
        const dogEl = document.querySelector('.dog-wrapper');
        if (dogEl) {
            dogEl.style.transform = "translateY(-30px)";
            setTimeout(() => dogEl.style.transform = "translateY(0)", 300);
        }
        
        updateUI("Woof! I love playing! 🎾");
    } else {
        updateUI("I'm too tired to fetch... 💤");
    }
}

function sleepPet() {
    if (energy < 100) {
        energy = 100;
        hunger = Math.max(hunger - 10, 0); // Sleeping makes you a bit hungry
        updateUI("Zzz... dreaming of squirrels... 😴");
    } else {
        updateUI("I'm not tired!");
    }
}

// 4. UI & State Logic
function updateUI(message) {
    // Update the progress bars visually
   hungerBar.style.width = hunger + "%";
    happinessBar.style.width = happiness + "%";
    energyBar.style.width = energy + "%";

    if (message) petMessage.innerText = message;

    // State Transitions [cite: 33]
    if (hunger <= 0) {
        applyStatus('pet-starving'); // Activates CSS Tears
        petMessage.innerText = "I'm starving! Please feed me! 😭";
    } else if (energy < 20) {
        applyStatus('pet-sleep');
    } else if (happiness < 40) {
        applyStatus('pet-sad');
    } else if (happiness > 80) {
        applyStatus('pet-happy');
    } else {
        applyStatus('pet-neutral');}
}

function applyStatus(statusClass) {
    // This updates the container class so the CSS animations switch
    petContainer.className = statusClass;
}

// 5. The Game Loop (The "Tick")
function gameTick() {
    // Stats decrease over time
    hunger = Math.max(hunger - 5, 0);
    happiness = Math.max(happiness - 3, 0);
    energy = Math.max(energy - 2, 0);

    updateUI();

    // Game Over Logic
    if (hunger === 0 && happiness === 0) {
        clearInterval(gameLoop);
        petMessage.innerText = "Oh no! Your pet ran away to find snacks. ⚰️";
        applyStatus('pet-sad');
    }
}

// Start the loop
const gameLoop = setInterval(gameTick, TICK_RATE);

// Initial Call
updateUI("Welcome home! Click the buttons to take care of me.");