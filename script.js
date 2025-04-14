document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipeForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const input = document.getElementById("ingredients");
        const output = document.getElementById("recipeResults");
        const rawInput = input.value.trim();

        if (!rawInput) {
            output.innerHTML = `<p class="text-red-500">Please enter at least one ingredient.</p>`;
            return;
        }

        const ingredients = rawInput.split(",").map(i => i.trim());
        output.innerHTML = `<p class="text-gray-500">Searching for recipes...</p>`;

        try {
            const response = await fetch("http://localhost:8080/recipes/find", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients })
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const recipes = await response.json();

            if (recipes.length === 0) {
                output.innerHTML = `<p class="text-yellow-600">No recipes found for the selected ingredients.</p>`;
            } else {
                output.innerHTML = recipes.map(recipe => `
                    <div class="p-4 border rounded-lg shadow mb-4 bg-white">
                        <h3 class="text-xl font-bold mb-2">${recipe.name}</h3>
                        <p>${recipe.description || "No description provided."}</p>
                    </div>
                `).join("");
            }
        } catch (err) {
            console.error("Error:", err);
            output.innerHTML = `<p class="text-red-600">Something went wrong while fetching recipes.</p>`;
        }
    });
});
