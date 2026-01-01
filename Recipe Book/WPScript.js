const recipeForm = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Initial Display
displayRecipes(recipes);

// Add Recipe Logic
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const ingredientsArray = document.getElementById('ingredients').value.split('\n');
    const stepsArray = document.getElementById('steps').value.split('\n');

    const newRecipe = {
        id: Date.now(),
        name: document.getElementById('recipeName').value,
        ingredients: ingredientsArray,
        steps: stepsArray,             
        image: document.getElementById('imageUrl').value || 'placeholder.jpg'
    };

    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes)); [cite, 66, 67]
    recipeForm.reset();
    displayRecipes(recipes);
});

function displayRecipes(recipeArray) {
    recipeList.innerHTML = '';
    recipeArray.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <button class="delete-btn" onclick="event.stopPropagation(); deleteRecipe(${recipe.id})">Delete</button>
        `;
        // Keep the click event for showing details
        card.onclick = () => showDetails(recipe);
        recipeList.appendChild(card);
    });
}

function deleteRecipe(id) {
    if (confirm("Are you sure you want to delete this recipe?")) {
        // Filter out the recipe with the matching ID
        recipes = recipes.filter(recipe => recipe.id !== id);
        
        // Update Local Storage so the deletion persists 
        localStorage.setItem('recipes', JSON.stringify(recipes));
        
        // Refresh the displayed list
        displayRecipes(recipes);
    }
}

// Search Logic 
function searchRecipes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = recipes.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.ingredients.some(i => i.toLowerCase().includes(query))
    );
    displayRecipes(filtered);
}

// Modal View Details 
function showDetails(recipe) {
    const details = document.getElementById('modalDetails');
    details.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" style="width:100%; max-height:400px; object-fit:cover; border-radius:10px;">
        
        <h3>Ingredients</h3>
        <ol>
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ol>

        <h3>Preparation Steps</h3>
        <ol>
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;
    document.getElementById('recipeModal').style.display = "block"; [cite, 63]
}

function closeModal() {
    document.getElementById('recipeModal').style.display = "none";
}